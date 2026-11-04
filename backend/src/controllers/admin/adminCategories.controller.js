import prisma from '../../config/prisma.js';
import { logAudit } from '../../services/audit.js';
import cacheService from '../../services/cacheService.js';

export async function getAdminCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        subcategories: { orderBy: { order: 'asc' } },
        _count: { select: { products: true } }
      }
    });
    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error('Error al listar categorías para admin:', err);
    return res.status(500).json({ error: true, message: 'Error al listar categorías' });
  }
}

export async function createAdminCategory(req, res) {
  try {
    const {
      name,
      slug,
      description,
      icon,
      image,
      menuBadge,
      menuTitle,
      menuLink,
      isAdult,
      featuredInMenu
    } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ error: true, message: 'El nombre de categoría es obligatorio' });
    }

    const finalSlug = (slug || name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const count = await prisma.category.count();
    const adult = Boolean(isAdult);

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        icon: icon || 'Sparkles',
        image: adult ? null : image || null,
        menuBadge: adult ? null : menuBadge || null,
        menuTitle: adult ? null : menuTitle || null,
        menuLink: adult ? null : menuLink || null,
        order: count + 1,
        isAdult: adult,
        featuredInMenu: featuredInMenu !== undefined ? Boolean(featuredInMenu) : true,
        isActive: true
      }
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_CATEGORY',
      module: 'CATEGORIES',
      details: { categoryId: category.id, name: category.name },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Categoría creada con éxito', data: category });
  } catch (err) {
    console.error('Error al crear categoría:', err);
    return res
      .status(500)
      .json({ error: true, message: err.message || 'Error al crear categoría' });
  }
}

export async function updateAdminCategory(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      icon,
      image,
      menuBadge,
      menuTitle,
      menuLink,
      isAdult,
      featuredInMenu,
      isActive,
      order
    } = req.body;
    const adult = isAdult !== undefined ? Boolean(isAdult) : undefined;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image: adult === true ? null : image || null }),
        ...(menuBadge !== undefined && { menuBadge: adult === true ? null : menuBadge || null }),
        ...(menuTitle !== undefined && { menuTitle: adult === true ? null : menuTitle || null }),
        ...(menuLink !== undefined && { menuLink: adult === true ? null : menuLink || null }),
        ...(adult !== undefined && { isAdult: adult }),
        ...(featuredInMenu !== undefined && { featuredInMenu: Boolean(featuredInMenu) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(order !== undefined && { order: parseInt(order, 10) })
      }
    });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_CATEGORY',
      module: 'CATEGORIES',
      details: { categoryId: category.id, name: category.name },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Categoría actualizada con éxito', data: category });
  } catch (err) {
    console.error('Error al actualizar categoría:', err);
    return res.status(500).json({ error: true, message: 'Error al actualizar categoría' });
  }
}

export async function deleteAdminCategory(req, res) {
  try {
    const { id } = req.params;
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return res.status(400).json({
        error: true,
        message: `No se puede eliminar esta categoría porque contiene ${productsCount} producto(s). Reasigna o elimina los productos primero.`
      });
    }

    const category = await prisma.category.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_CATEGORY',
      module: 'CATEGORIES',
      details: { categoryId: id, name: category.name },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Categoría eliminada con éxito' });
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
    return res.status(500).json({ error: true, message: 'Error al eliminar categoría' });
  }
}

export async function reorderAdminCategories(req, res) {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: true, message: 'Se esperaba un array de IDs' });
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { order: index + 1 }
        })
      )
    );

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Categorías reordenadas correctamente' });
  } catch (err) {
    console.error('Error reordenando categorías:', err);
    return res.status(500).json({ error: true, message: 'Error reordenando categorías' });
  }
}

export async function createAdminSubcategory(req, res) {
  try {
    const { categoryId } = req.params;
    const { name, slug, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ error: true, message: 'Nombre de subcategoría requerido' });
    }

    const finalSlug = (slug || name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const count = await prisma.subcategory.count({ where: { categoryId } });

    const subcategory = await prisma.subcategory.create({
      data: {
        categoryId,
        name,
        slug: finalSlug,
        description: description || null,
        image: image || null,
        order: count + 1,
        isActive: true
      }
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_SUBCATEGORY',
      module: 'CATEGORIES',
      details: { subcategoryId: subcategory.id, name: subcategory.name, categoryId },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Subcategoría creada con éxito', data: subcategory });
  } catch (err) {
    console.error('Error al crear subcategoría:', err);
    return res
      .status(500)
      .json({ error: true, message: err.message || 'Error al crear subcategoría' });
  }
}

export async function updateAdminSubcategory(req, res) {
  try {
    const { id } = req.params;
    const { name, slug, description, image, isActive, order } = req.body;

    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(order !== undefined && { order: parseInt(order, 10) })
      }
    });

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Subcategoría actualizada', data: subcategory });
  } catch (err) {
    console.error('Error al actualizar subcategoría:', err);
    return res.status(500).json({ error: true, message: 'Error al actualizar subcategoría' });
  }
}

export async function deleteAdminSubcategory(req, res) {
  try {
    const { id } = req.params;
    await prisma.subcategory.delete({ where: { id } });
    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Subcategoría eliminada' });
  } catch (err) {
    console.error('Error al eliminar subcategoría:', err);
    return res.status(500).json({ error: true, message: 'Error al eliminar subcategoría' });
  }
}
