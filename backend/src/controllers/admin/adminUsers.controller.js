import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma.js';
import { logAudit } from '../../services/audit.js';

export async function getAdminUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'STAFF'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    return res.json({ success: true, data: users });
  } catch (err) {
    console.error('Error al listar usuarios:', err);
    return res.status(500).json({ error: true, message: 'Error al listar usuarios del equipo' });
  }
}

export async function createAdminUser(req, res) {
  try {
    const { name, email, password, role = 'STAFF', phone } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: 'Nombre, correo y contraseña son obligatorios' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: true, message: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existing) {
      return res
        .status(400)
        .json({ error: true, message: 'Ya existe un usuario con este correo electrónico' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const validRole = role === 'ADMIN' ? 'ADMIN' : 'STAFF';

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: validRole,
        phone: phone ? phone.trim() : null,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true
      }
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_USER',
      module: 'USERS',
      details: { targetUserId: newUser.id, email: newUser.email, role: newUser.role },
      req
    });

    return res.status(201).json({
      success: true,
      message: `Usuario ${newUser.name} (${newUser.role}) creado exitosamente`,
      data: newUser
    });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    return res.status(500).json({ error: true, message: 'Error interno al registrar usuario' });
  }
}

export async function toggleAdminUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res
        .status(400)
        .json({ error: true, message: 'No puedes desactivar tu propio usuario activo' });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !targetUser.isActive },
      select: { id: true, name: true, email: true, role: true, isActive: true }
    });

    await logAudit({
      userId: req.user.id,
      action: 'TOGGLE_USER_STATUS',
      module: 'USERS',
      details: { targetUserId: id, newStatus: updated.isActive },
      req
    });

    return res.json({
      success: true,
      message: `Usuario ${updated.name} ${updated.isActive ? 'activado' : 'desactivado'}`,
      data: updated
    });
  } catch (err) {
    console.error('Error al alternar estado de usuario:', err);
    return res.status(500).json({ error: true, message: 'Error al cambiar estado de usuario' });
  }
}

export async function deleteAdminUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({ error: true, message: 'No puedes eliminar tu propio usuario' });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ error: true, message: 'Usuario no encontrado' });
    }

    await prisma.user.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_USER',
      module: 'USERS',
      details: { targetUserId: id, email: targetUser.email },
      req
    });

    return res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    return res.status(500).json({ error: true, message: 'Error al eliminar usuario' });
  }
}
