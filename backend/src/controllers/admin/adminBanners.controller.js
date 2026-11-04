import prisma from '../../config/prisma.js';
import { logAudit } from '../../services/audit.js';
import cacheService from '../../services/cacheService.js';

export async function getBanners(req, res) {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' }
    });
    return res.json({ success: true, data: banners });
  } catch (err) {
    console.error('Error al obtener banners:', err);
    return res.status(500).json({ error: true, message: 'Error al obtener banners' });
  }
}

export async function createBanner(req, res) {
  try {
    const {
      title,
      subtitle,
      badge,
      ctaText,
      ctaLink,
      desktopImage,
      mobileImage,
      isActive,
      startsAt,
      endsAt
    } = req.body;

    if (!title || !desktopImage) {
      return res
        .status(400)
        .json({ error: true, message: 'Título e imagen para escritorio son requeridos.' });
    }

    const count = await prisma.banner.count();

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        badge: badge || null,
        ctaText: ctaText || 'Ver Colección',
        ctaLink: ctaLink || '#catalogo',
        desktopImage,
        mobileImage: mobileImage || desktopImage,
        order: count + 1,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null
      }
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_BANNER',
      module: 'BANNERS',
      details: { bannerId: banner.id, title: banner.title },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, data: banner, message: 'Banner creado con éxito' });
  } catch (err) {
    console.error('Error al crear banner:', err);
    return res.status(500).json({ error: true, message: 'Error al crear banner' });
  }
}

export async function updateBanner(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      badge,
      ctaText,
      ctaLink,
      desktopImage,
      mobileImage,
      isActive,
      startsAt,
      endsAt,
      order
    } = req.body;

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(badge !== undefined && { badge }),
        ...(ctaText !== undefined && { ctaText }),
        ...(ctaLink !== undefined && { ctaLink }),
        ...(desktopImage && { desktopImage }),
        ...(mobileImage !== undefined && { mobileImage }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(startsAt !== undefined && { startsAt: startsAt ? new Date(startsAt) : null }),
        ...(endsAt !== undefined && { endsAt: endsAt ? new Date(endsAt) : null }),
        ...(order !== undefined && { order: parseInt(order, 10) })
      }
    });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_BANNER',
      module: 'BANNERS',
      details: { bannerId: banner.id, title: banner.title },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, data: banner, message: 'Banner actualizado con éxito' });
  } catch (err) {
    console.error('Error al actualizar banner:', err);
    return res.status(500).json({ error: true, message: 'Error al actualizar banner' });
  }
}

export async function deleteBanner(req, res) {
  try {
    const { id } = req.params;
    const banner = await prisma.banner.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_BANNER',
      module: 'BANNERS',
      details: { bannerId: banner.id, title: banner.title },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Banner eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar banner:', err);
    return res.status(500).json({ error: true, message: 'Error al eliminar banner' });
  }
}

export async function reorderBanners(req, res) {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: true, message: 'Formato de IDs inválido' });
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.banner.update({
          where: { id },
          data: { order: index + 1 }
        })
      )
    );

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Banners reordenados con éxito' });
  } catch (err) {
    console.error('Error al reordenar banners:', err);
    return res.status(500).json({ error: true, message: 'Error al reordenar banners' });
  }
}
