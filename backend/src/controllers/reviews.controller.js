import prisma from '../config/prisma.js';

export async function fetchApprovedTestimonialsCombined() {
  const [approvedTestimonials, approvedProductReviews] = await Promise.all([
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 12
    }),
    prisma.review.findMany({
      where: { isApproved: true },
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 12
    })
  ]);

  return [
    ...approvedTestimonials,
    ...approvedProductReviews.map((r) => ({
      id: r.id,
      clientName: r.customerName,
      clientLocation: r.product?.name
        ? `${r.customerEmail || 'Costa Rica'} • ${r.product.name}`
        : r.customerEmail || 'Costa Rica',
      rating: r.rating || 5,
      comment: r.comment,
      createdAt: r.createdAt
    }))
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 12);
}

export async function getTestimonials(req, res) {
  try {
    const testimonials = await fetchApprovedTestimonialsCombined();
    return res.json({ success: true, data: testimonials });
  } catch (err) {
    console.error('Error al obtener testimonios:', err);
    return res.status(500).json({ error: true, message: 'Error al obtener testimonios' });
  }
}

export async function createPublicTestimonial(req, res) {
  try {
    const { clientName, clientLocation, rating = 5, comment } = req.body || {};

    if (!clientName || !String(clientName).trim() || !comment || !String(comment).trim()) {
      return res.status(400).json({
        error: true,
        message: 'Por favor ingresa tu nombre y tu comentario.'
      });
    }

    const cleanComment = String(comment).trim();
    if (cleanComment.length < 5) {
      return res.status(400).json({
        error: true,
        message: 'El comentario es muy corto. Cuéntanos un poquito más de tu experiencia.'
      });
    }

    const cleanRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

    const created = await prisma.testimonial.create({
      data: {
        clientName: String(clientName).trim().slice(0, 80),
        clientLocation: clientLocation
          ? String(clientLocation).trim().slice(0, 80)
          : 'Costa Rica',
        rating: cleanRating,
        comment: cleanComment.slice(0, 800),
        isFeatured: true,
        isActive: false // Pendiente de moderación por la dueña
      }
    });

    return res.status(201).json({
      success: true,
      message:
        '¡Muchas gracias por tu reseña! Fue enviada con éxito y será publicada tras ser revisada por nuestra boutique.',
      data: { id: created.id }
    });
  } catch (err) {
    console.error('Error al registrar testimonio:', err);
    return res.status(500).json({
      error: true,
      message: 'No se pudo enviar tu reseña en este momento.'
    });
  }
}

export async function createProductReview(req, res) {
  try {
    const { productId } = req.params;
    const { customerName, customerLocation, rating = 5, comment } = req.body || {};

    if (
      !productId ||
      !customerName ||
      !String(customerName).trim() ||
      !comment ||
      !String(comment).trim()
    ) {
      return res.status(400).json({
        error: true,
        message: 'Por favor ingresa tu nombre y tu comentario sobre el producto.'
      });
    }

    const cleanComment = String(comment).trim();
    if (cleanComment.length < 5) {
      return res.status(400).json({
        error: true,
        message: 'El comentario es muy corto. Cuéntanos qué te pareció el producto.'
      });
    }

    const cleanRating = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));

    const created = await prisma.review.create({
      data: {
        productId,
        customerName: String(customerName).trim().slice(0, 80),
        customerEmail: customerLocation
          ? String(customerLocation).trim().slice(0, 80)
          : 'Costa Rica',
        rating: cleanRating,
        comment: cleanComment.slice(0, 800),
        isApproved: false // Pendiente de moderación por la dueña
      }
    });

    return res.status(201).json({
      success: true,
      message:
        '¡Gracias por tu opinión! Ha sido enviada y se publicará una vez aprobada por la administración.',
      data: { id: created.id }
    });
  } catch (err) {
    console.error('Error al crear reseña de producto:', err);
    return res.status(500).json({
      error: true,
      message: 'No se pudo enviar tu reseña en este momento.'
    });
  }
}
