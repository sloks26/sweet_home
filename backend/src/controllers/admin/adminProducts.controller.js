import prisma from '../../config/prisma.js';
import { logAudit } from '../../services/audit.js';
import cacheService from '../../services/cacheService.js';

export async function getAdminProducts(req, res) {
  try {
    const {
      search,
      categoryId,
      subcategoryId,
      isActive,
      stockStatus,
      page = 1,
      limit = 20,
      sort = 'newest'
    } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (subcategoryId) where.subcategoryId = subcategoryId;

    if (isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    if (stockStatus === 'low') {
      where.stock = { lte: 5, gt: 0 };
    } else if (stockStatus === 'out') {
      where.stock = { lte: 0 };
    } else if (stockStatus === 'in') {
      where.stock = { gt: 0 };
    }

    const orderBy = [];
    if (sort === 'price_asc') orderBy.push({ price: 'asc' });
    else if (sort === 'price_desc') orderBy.push({ price: 'desc' });
    else if (sort === 'stock_asc') orderBy.push({ stock: 'asc' });
    else if (sort === 'name_asc') orderBy.push({ name: 'asc' });
    else orderBy.push({ createdAt: 'desc' });

    const take = parseInt(limit, 10) || 20;
    const skip = (parseInt(page, 10) - 1) * take;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        take,
        skip,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          subcategory: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { order: 'asc' } },
          variants: true
        }
      })
    ]);

    return res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (err) {
    console.error('Error listando productos para admin:', err);
    return res.status(500).json({ error: true, message: 'Error listando productos' });
  }
}

export async function getAdminProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true,
        images: { orderBy: { order: 'asc' } },
        variants: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: true, message: 'Producto no encontrado' });
    }

    return res.json({ success: true, data: product });
  } catch (err) {
    console.error('Error al obtener producto:', err);
    return res.status(500).json({ error: true, message: 'Error al obtener producto' });
  }
}

export async function createAdminProduct(req, res) {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      sku,
      price,
      compareAtPrice,
      costPrice,
      stock,
      lowStockThreshold,
      isFeatured,
      isNew,
      isBestSeller,
      isActive,
      isAdult,
      categoryId,
      subcategoryId,
      images = [],
      variants = []
    } = req.body;

    if (!name || price === undefined || !categoryId) {
      return res
        .status(400)
        .json({ error: true, message: 'Nombre, precio y categoría son obligatorios.' });
    }

    const finalSlug =
      (slug || name)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const finalSku = (sku || `SW-${Date.now().toString().slice(-6)}`).toUpperCase();

    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name,
          slug: finalSlug,
          description: description || name,
          shortDescription: shortDescription || null,
          sku: finalSku,
          price: parseFloat(price),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          costPrice: costPrice ? parseFloat(costPrice) : null,
          stock: parseInt(stock, 10) || 0,
          lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
          isFeatured: Boolean(isFeatured),
          isNew: isNew !== undefined ? Boolean(isNew) : true,
          isBestSeller: Boolean(isBestSeller),
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          isAdult: Boolean(isAdult),
          categoryId,
          subcategoryId: subcategoryId || null
        }
      });

      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img, idx) => ({
            productId: newProduct.id,
            url: typeof img === 'string' ? img : img.url,
            alt: typeof img === 'object' ? img.alt || name : name,
            isCover: idx === 0,
            order: idx + 1
          }))
        });
      }

      if (variants && variants.length > 0) {
        for (const v of variants) {
          await tx.productVariant.create({
            data: {
              productId: newProduct.id,
              name: v.name || 'Opción',
              options: typeof v.options === 'string' ? v.options : JSON.stringify(v.options || []),
              sku: v.sku || null,
              price: v.price ? parseFloat(v.price) : null,
              stock: parseInt(v.stock, 10) || 0
            }
          });
        }
      }

      return tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          category: true,
          subcategory: true,
          images: { orderBy: { order: 'asc' } },
          variants: true
        }
      });
    });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_PRODUCT',
      module: 'PRODUCTS',
      details: { productId: product.id, name: product.name, sku: product.sku },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Producto creado exitosamente', data: product });
  } catch (err) {
    console.error('Error al crear producto:', err);
    return res.status(500).json({ error: true, message: err.message || 'Error al crear producto' });
  }
}

export async function updateAdminProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      shortDescription,
      sku,
      price,
      compareAtPrice,
      costPrice,
      stock,
      lowStockThreshold,
      isFeatured,
      isNew,
      isBestSeller,
      isActive,
      isAdult,
      categoryId,
      subcategoryId,
      images,
      variants
    } = req.body;

    const product = await prisma.$transaction(async (tx) => {
      const updateData = {};
      if (name) updateData.name = name;
      if (slug) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;
      if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
      if (sku) updateData.sku = sku.toUpperCase();
      if (price !== undefined) updateData.price = parseFloat(price);
      if (compareAtPrice !== undefined)
        updateData.compareAtPrice = compareAtPrice ? parseFloat(compareAtPrice) : null;
      if (costPrice !== undefined) updateData.costPrice = costPrice ? parseFloat(costPrice) : null;
      if (stock !== undefined) updateData.stock = parseInt(stock, 10);
      if (lowStockThreshold !== undefined)
        updateData.lowStockThreshold = parseInt(lowStockThreshold, 10);
      if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
      if (isNew !== undefined) updateData.isNew = Boolean(isNew);
      if (isBestSeller !== undefined) updateData.isBestSeller = Boolean(isBestSeller);
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);
      if (isAdult !== undefined) updateData.isAdult = Boolean(isAdult);
      if (categoryId) updateData.categoryId = categoryId;
      if (subcategoryId !== undefined) updateData.subcategoryId = subcategoryId || null;

      const updated = await tx.product.update({
        where: { id },
        data: updateData
      });

      if (Array.isArray(images)) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img, idx) => ({
              productId: id,
              url: typeof img === 'string' ? img : img.url,
              alt: typeof img === 'object' ? img.alt || updated.name : updated.name,
              isCover: idx === 0,
              order: idx + 1
            }))
          });
        }
      }

      if (Array.isArray(variants)) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        for (const v of variants) {
          await tx.productVariant.create({
            data: {
              productId: id,
              name: v.name || 'Opción',
              options: typeof v.options === 'string' ? v.options : JSON.stringify(v.options || []),
              sku: v.sku || null,
              price: v.price ? parseFloat(v.price) : null,
              stock: parseInt(v.stock, 10) || 0
            }
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          subcategory: true,
          images: { orderBy: { order: 'asc' } },
          variants: true
        }
      });
    });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_PRODUCT',
      module: 'PRODUCTS',
      details: { productId: product.id, name: product.name },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Producto actualizado con éxito', data: product });
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    return res
      .status(500)
      .json({ error: true, message: err.message || 'Error al actualizar producto' });
  }
}

export async function deleteAdminProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_PRODUCT',
      module: 'PRODUCTS',
      details: { productId: id, name: product.name },
      req
    });

    cacheService.invalidateHome();
    return res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    return res.status(500).json({ error: true, message: 'Error al eliminar producto' });
  }
}

export async function toggleAdminProduct(req, res) {
  try {
    const { id } = req.params;
    const current = await prisma.product.findUnique({
      where: { id },
      select: { id: true, isActive: true, name: true }
    });

    if (!current) {
      return res.status(404).json({ error: true, message: 'Producto no encontrado' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: !current.isActive }
    });

    await logAudit({
      userId: req.user.id,
      action: 'TOGGLE_PRODUCT_STATUS',
      module: 'PRODUCTS',
      details: { productId: id, isActive: updated.isActive },
      req
    });

    cacheService.invalidateHome();
    return res.json({
      success: true,
      message: updated.isActive ? 'Producto activado' : 'Producto pausado',
      data: updated
    });
  } catch (err) {
    console.error('Error al cambiar estado del producto:', err);
    return res.status(500).json({ error: true, message: 'Error al cambiar estado' });
  }
}
