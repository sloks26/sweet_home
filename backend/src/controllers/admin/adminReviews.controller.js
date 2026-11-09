import prisma from '../../config/prisma.js';
import { logAudit } from '../../services/audit.js';
import cacheService from '../../services/cacheService.js';

async function syncProductRatingStats(productId) {
  if (!productId) return;
  const approvedReviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    select: { rating: true }
  });
  const reviewCount = approvedReviews.length;
  const avgRating =
    reviewCount > 0
      ? Number(
          (approvedReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewCount).toFixed(1)
        )
      : 5.0;

  await prisma.product.update({
    where: { id: productId },
    data: { reviewCount, rating: avgRating }
  });
}

export async function getAdminReviews(req, res) {
  try {
    const [testimonials, productReviews] = await Promise.all([
      prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.findMany({
        include: {
          product: { select: { id: true, name: true, slug: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const unified = [
      ...testimonials.map((t) => ({
        id: t.id,
        kind: 'STORE',
        customerName: t.clientName,
        locationOrEmail: t.clientLocation || 'Costa Rica',
        productName: null,
        rating: t.rating || 5,
        comment: t.comment,
        isApproved: Boolean(t.isActive),
        createdAt: t.createdAt
      })),
      ...productReviews.map((r) => ({
        id: r.id,
        kind: 'PRODUCT',
        customerName: r.customerName,
        locationOrEmail: r.customerEmail || 'Costa Rica',
        productName: r.product?.name || 'Producto de la tienda',
        productId: r.productId,
        rating: r.rating || 5,
        comment: r.comment,
        isApproved: Boolean(r.isApproved),
        createdAt: r.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ success: true, data: unified });
  } catch (err) {
    console.error('Error al listar reseñas en admin:', err);
    return res.status(500).json({ error: true, message: 'Error al cargar reseñas' });
  }
}

export async function approveAdminReview(req, res) {
  try {
    const { kind, id } = req.params;
    const isApproved = req.body?.isApproved !== undefined ? Boolean(req.body.isApproved) : true;

    if (kind === 'STORE') {
      const updated = await prisma.testimonial.update({
        where: { id },
        data: { isActive: isApproved }
      });

      await logAudit({
        userId: req.user?.id,
        action: isApproved ? 'APPROVE_TESTIMONIAL' : 'HIDE_TESTIMONIAL',
        module: 'REVIEWS',
        details: { id, clientName: updated.clientName, isApproved },
        req
      });
    } else if (kind === 'PRODUCT') {
      const updated = await prisma.review.update({
        where: { id },
        data: { isApproved }
      });
      await syncProductRatingStats(updated.productId);

      await logAudit({
        userId: req.user?.id,
        action: isApproved ? 'APPROVE_REVIEW' : 'HIDE_REVIEW',
        module: 'REVIEWS',
        details: { id, customerName: updated.customerName, productId: updated.productId, isApproved },
        req
      });
    } else {
      return res.status(400).json({ error: true, message: 'Tipo de reseña inválido' });
    }

    cacheService.invalidateHome?.();

    return res.json({
      success: true,
      message: isApproved
        ? 'Reseña aprobada y publicada en la tienda'
        : 'Reseña ocultada de la tienda pública'
    });
  } catch (err) {
    console.error('Error al aprobar/ocultar reseña:', err);
    return res.status(500).json({ error: true, message: 'Error al actualizar la reseña' });
  }
}

export async function deleteAdminReview(req, res) {
  try {
    const { kind, id } = req.params;

    if (kind === 'STORE') {
      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: true, message: 'Reseña no encontrada' });
      }
      await prisma.testimonial.delete({ where: { id } });

      await logAudit({
        userId: req.user?.id,
        action: 'DELETE_TESTIMONIAL',
        module: 'REVIEWS',
        details: { id, clientName: existing.clientName },
        req
      });
    } else if (kind === 'PRODUCT') {
      const existing = await prisma.review.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: true, message: 'Reseña no encontrada' });
      }
      await prisma.review.delete({ where: { id } });
      await syncProductRatingStats(existing.productId);

      await logAudit({
        userId: req.user?.id,
        action: 'DELETE_REVIEW',
        module: 'REVIEWS',
        details: { id, customerName: existing.customerName, productId: existing.productId },
        req
      });
    } else {
      return res.status(400).json({ error: true, message: 'Tipo de reseña inválido' });
    }

    cacheService.invalidateHome?.();

    return res.json({
      success: true,
      message: 'Reseña eliminada permanentemente'
    });
  } catch (err) {
    console.error('Error al eliminar reseña:', err);
    return res.status(500).json({ error: true, message: 'Error al eliminar la reseña' });
  }
}
