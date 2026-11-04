import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import prisma from '../config/prisma.js';

export async function authenticate(req, res, next) {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    // Validar que el userId sea un ObjectId de MongoDB válido (24 caracteres hexadecimales)
    if (!decoded.userId || !/^[0-9a-fA-F]{24}$/.test(decoded.userId)) {
      req.user = null;
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lockedUntil: true
      }
    });

    if (!user || !user.isActive) {
      req.user = null;
      return next();
    }

    // Verificar si sigue bloqueado temporalmente
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: true,
      message: 'Acceso no autorizado. Inicia sesión para continuar.',
      code: 'UNAUTHORIZED'
    });
  }
  next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Acceso no autorizado.',
        code: 'UNAUTHORIZED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: true,
        message: 'No tienes los permisos necesarios para realizar esta acción.',
        code: 'FORBIDDEN'
      });
    }

    next();
  };
}

export const requireAdmin = requireRole('ADMIN');
export const requireStaff = requireRole('ADMIN', 'STAFF');
