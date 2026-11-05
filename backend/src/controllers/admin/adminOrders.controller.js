import path from 'path';
import fs from 'fs';
import prisma from '../../config/prisma.js';
import { config } from '../../config/index.js';
import { logAudit } from '../../services/audit.js';

export async function getAdminOrders(req, res) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search && search.trim()) {
      const query = search.trim();
      where.OR = [
        { orderNumber: { contains: query } },
        { customerName: { contains: query } },
        { customerPhone: { contains: query } },
        { customerEmail: { contains: query } }
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit, 10),
        orderBy: { createdAt: 'desc' },
        include: {
          items: true
        }
      })
    ]);

    return res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      }
    });
  } catch (err) {
    console.error('Error al listar pedidos en admin:', err);
    return res.status(500).json({ error: true, message: 'Error al listar pedidos' });
  }
}

export async function getAdminOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: true, message: 'Pedido no encontrado' });
    }

    return res.json({ success: true, data: order });
  } catch (err) {
    console.error('Error al obtener pedido en admin:', err);
    return res.status(500).json({ error: true, message: 'Error al obtener pedido' });
  }
}

export async function updateAdminOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, trackingNumber, internalNotes, rejectionReason } = req.body;

    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'PAYMENT_CONFIRMED') {
        updateData.paymentConfirmedAt = new Date();
      }
    }
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true }
    });

    await logAudit({
      userId: req.user?.id,
      action: `Actualizó pedido ${order.orderNumber} a estado ${status || 'editado'}`,
      module: 'ORDERS',
      metadata: { orderId: id, status, trackingNumber }
    });

    return res.json({ success: true, message: 'Pedido actualizado con éxito', data: order });
  } catch (err) {
    console.error('Error al actualizar estado del pedido:', err);
    return res.status(500).json({ error: true, message: 'Error al actualizar pedido' });
  }
}

export async function deleteAdminOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, orderNumber: true }
    });

    if (!order) {
      return res.status(404).json({ error: true, message: 'Pedido no encontrado' });
    }

    await prisma.order.delete({
      where: { id }
    });

    await logAudit({
      userId: req.user?.id,
      action: `Eliminó el pedido ${order.orderNumber}`,
      module: 'ORDERS',
      metadata: { orderId: id, orderNumber: order.orderNumber }
    });

    return res.json({
      success: true,
      message: `Pedido ${order.orderNumber} eliminado correctamente`
    });
  } catch (err) {
    console.error('Error al eliminar pedido en admin:', err);
    return res.status(500).json({ error: true, message: 'Error al eliminar pedido' });
  }
}

/**
 * Servir comprobante bancario protegido con autenticación de staff/admin (SEC-02)
 */
export async function getAdminOrderVoucher(req, res) {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, voucherPath: true, voucherUrl: true, orderNumber: true }
    });

    if (!order) {
      return res.status(404).json({ error: true, message: 'Pedido no encontrado' });
    }

    let targetPath = order.voucherPath;
    if (!targetPath && order.voucherUrl) {
      const fileName = path.basename(order.voucherUrl);
      const possiblePrivate = path.join(config.privateVoucherDir, fileName);
      const possiblePublic = path.join(config.uploadDir, fileName);
      if (fs.existsSync(possiblePrivate)) {
        targetPath = possiblePrivate;
      } else if (fs.existsSync(possiblePublic)) {
        targetPath = possiblePublic;
      }
    }

    if (!targetPath || !fs.existsSync(targetPath)) {
      return res.status(404).json({
        error: true,
        message: 'No se encontró el archivo del comprobante para este pedido'
      });
    }

    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.sendFile(targetPath);
  } catch (err) {
    console.error('Error al servir comprobante protegido:', err);
    return res.status(500).json({ error: true, message: 'Error al obtener comprobante' });
  }
}
