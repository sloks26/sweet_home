import prisma from '../../config/prisma.js';
import { logAudit } from '../../services/audit.js';
import cacheService from '../../services/cacheService.js';

/**
 * Métricas y estadísticas para el Dashboard del Panel Admin
 */
export async function getDashboardStats(req, res) {
  try {
    const [
      totalOrders,
      pendingPaymentOrders,
      voucherReceivedOrders,
      completedOrders,
      totalProducts,
      lowStockCount,
      ordersToShipCount,
      pendingReviewsCount,
      recentOrders,
      recentLogs,
      topProducts,
      shippingOrders,
      lowStockItems
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING_PAYMENT' } }),
      prisma.order.count({ where: { status: 'VOUCHER_RECEIVED' } }),
      prisma.order.count({
        where: { status: { in: ['PAYMENT_CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'] } }
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 3 }, isActive: true } }),
      prisma.order.count({ where: { status: { in: ['PAYMENT_CONFIRMED', 'PREPARING'] } } }),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerPhone: true,
          status: true,
          paymentMethod: true,
          total: true,
          voucherUrl: true,
          createdAt: true
        }
      }),
      prisma.auditLog.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      }),
      // Prendas Estrella / Top Productos
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: [{ isBestSeller: 'desc' }, { isFeatured: 'desc' }, { stock: 'desc' }],
        take: 5,
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          stock: true,
          sku: true,
          isBestSeller: true
        }
      }),
      // Pedidos listos para envío y mensajería
      prisma.order.findMany({
        where: { status: { in: ['PAYMENT_CONFIRMED', 'PREPARING', 'SHIPPED'] } },
        orderBy: { createdAt: 'desc' },
        take: 12,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerPhone: true,
          shippingMethod: true,
          shippingAddress: true,
          status: true,
          total: true,
          createdAt: true
        }
      }),
      // Artículos con inventario crítico (<= 3)
      prisma.product.findMany({
        where: { stock: { lte: 3 }, isActive: true },
        take: 6,
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          price: true,
          images: true
        }
      })
    ]);

    const salesAggregate = await prisma.order.aggregate({
      where: { status: { in: ['PAYMENT_CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'] } },
      _sum: { total: true }
    });

    const totalRevenue = salesAggregate._sum.total || 0;

    return res.json({
      success: true,
      data: {
        metrics: {
          totalRevenue,
          totalOrders,
          pendingPaymentOrders,
          voucherReceivedOrders,
          ordersToShipCount,
          pendingReviewsCount,
          completedOrders,
          totalProducts,
          lowStockCount
        },
        recentOrders,
        recentLogs,
        topProducts,
        shippingOrders,
        lowStockItems
      }
    });
  } catch (err) {
    console.error('Error al obtener métricas del dashboard:', err);
    return res
      .status(500)
      .json({ error: true, message: 'Error al obtener métricas del dashboard' });
  }
}

/**
 * Actualizar bloques de contenido del sitio (store_settings, our_story, etc.)
 */
export async function updateSiteContent(req, res) {
  try {
    const { key } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: true, message: 'Datos requeridos' });
    }

    const content = await prisma.siteContent.upsert({
      where: { key },
      create: {
        key,
        data: typeof data === 'object' ? JSON.stringify(data) : data
      },
      update: {
        data: typeof data === 'object' ? JSON.stringify(data) : data
      }
    });

    await logAudit({
      userId: req.user?.id,
      action: 'UPDATE_CONTENT',
      module: 'CONTENT',
      details: { key },
      req
    });

    cacheService.invalidateHome?.();

    return res.json({
      success: true,
      message: 'Contenido actualizado correctamente',
      data: content
    });
  } catch (err) {
    console.error('Error al actualizar contenido del sitio:', err);
    return res
      .status(500)
      .json({ error: true, message: 'Error al actualizar contenido del sitio' });
  }
}
