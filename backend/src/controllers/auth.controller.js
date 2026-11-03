import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/prisma.js';
import { config } from '../config/index.js';
import { logAudit } from '../services/audit.js';

const loginSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
});

export const authController = {
  /**
   * Iniciar sesión en el panel de administración
   */
  async login(req, res) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: true,
          message: parsed.error.errors[0]?.message || 'Datos de inicio de sesión inválidos',
          errors: parsed.error.format()
        });
      }

      const { email, password } = parsed.data;
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (!user) {
        await logAudit({
          action: 'LOGIN_FAILED',
          module: 'AUTH',
          details: { email, reason: 'Usuario no encontrado' },
          req
        });
        return res.status(401).json({
          error: true,
          message: 'Credenciales inválidas. Verifica tu correo y contraseña.',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Verificar si la cuenta está inactiva
      if (!user.isActive) {
        return res.status(403).json({
          error: true,
          message: 'Tu cuenta ha sido desactivada. Comunícate con la administración.',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      // Verificar si la cuenta está temporalmente bloqueada por intentos fallidos
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
        return res.status(429).json({
          error: true,
          message: `Cuenta bloqueada temporalmente por seguridad tras 5 intentos fallidos. Intenta de nuevo en ${remainingMinutes} minuto(s).`,
          code: 'ACCOUNT_LOCKED'
        });
      }

      // Validar contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const failedAttempts = (user.failedAttempts || 0) + 1;
        let updateData = { failedAttempts };

        if (failedAttempts >= 5) {
          // Bloquear por 15 minutos
          updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
          await logAudit({
            userId: user.id,
            action: 'ACCOUNT_LOCKED',
            module: 'AUTH',
            details: { email: user.email, attempts: failedAttempts },
            req
          });
        } else {
          await logAudit({
            userId: user.id,
            action: 'LOGIN_FAILED',
            module: 'AUTH',
            details: { email: user.email, attempts: failedAttempts },
            req
          });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });

        const remainingAttempts = Math.max(0, 5 - failedAttempts);
        return res.status(401).json({
          error: true,
          message: remainingAttempts > 0
            ? `Contraseña incorrecta. Te quedan ${remainingAttempts} intento(s) antes del bloqueo temporal.`
            : 'Has excedido el número de intentos permitidos. Cuenta bloqueada por 15 minutos.',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Login exitoso: reiniciar intentos y actualizar último login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date()
        }
      });

      // Generar JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      // Guardar en cookie httpOnly
      res.cookie('token', token, {
        httpOnly: true,
        secure: Boolean(req.secure || req.headers['x-forwarded-proto'] === 'https'),
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      });

      await logAudit({
        userId: user.id,
        action: 'LOGIN_SUCCESS',
        module: 'AUTH',
        details: { email: user.email, role: user.role },
        req
      });

      return res.json({
        success: true,
        message: 'Bienvenida(o) a Sweet Home & Boutique CR',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      });
    } catch (err) {
      console.error('Error en login:', err);
      return res.status(500).json({
        error: true,
        message: 'Error interno al procesar el inicio de sesión',
        code: 'INTERNAL_ERROR'
      });
    }
  },

  /**
   * Cerrar sesión y limpiar cookies
   */
  async logout(req, res) {
    if (req.user) {
      await logAudit({
        userId: req.user.id,
        action: 'LOGOUT',
        module: 'AUTH',
        req
      });
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: Boolean(req.secure || req.headers['x-forwarded-proto'] === 'https'),
      sameSite: 'lax'
    });

    return res.json({
      success: true,
      message: 'Sesión cerrada correctamente'
    });
  },

  /**
   * Obtener datos del usuario en sesión
   */
  async me(req, res) {
    if (!req.user) {
      return res.json({ authenticated: false, user: null });
    }
    return res.json({
      authenticated: true,
      user: req.user
    });
  },

  /**
   * Cambiar contraseña del usuario autenticado
   */
  async changePassword(req, res) {
    try {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: true,
          message: parsed.error.errors[0]?.message || 'Datos inválidos',
          errors: parsed.error.format()
        });
      }

      const { currentPassword, newPassword } = parsed.data;
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'Usuario no encontrado'
        });
      }

      const isCurrentMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentMatch) {
        return res.status(400).json({
          error: true,
          message: 'La contraseña actual no es correcta'
        });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword }
      });

      await logAudit({
        userId: user.id,
        action: 'PASSWORD_CHANGED',
        module: 'AUTH',
        details: { email: user.email },
        req
      });

      return res.json({
        success: true,
        message: 'Contraseña actualizada con éxito'
      });
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      return res.status(500).json({
        error: true,
        message: 'No se pudo actualizar la contraseña',
        code: 'INTERNAL_ERROR'
      });
    }
  }
};
