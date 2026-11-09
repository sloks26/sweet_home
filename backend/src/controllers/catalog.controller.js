import prisma from '../config/prisma.js';
import { config } from '../config/index.js';
import cacheService from '../services/cacheService.js';
import {
  fetchApprovedTestimonialsCombined,
  getTestimonials,
  createPublicTestimonial,
  createProductReview
} from './reviews.controller.js';

export const catalogController = {
  /**
   * Obtener todos los datos necesarios para el Home en una sola petición (agregador de alto rendimiento con caché)
   */
  async getHomeData(req, res) {
    try {
      const cached = cacheService.getHomeData();
      if (cached.data && cached.etag) {
        if (req.headers['if-none-match'] === cached.etag) {
          return res.status(304).end();
        }
        res.setHeader('ETag', cached.etag);
        res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
        return res.json({ success: true, data: cached.data });
      }

      const now = new Date();
      const [
        rawBanners,
        categories,
        featuredProducts,
        ourStoryRecord,
        storeSettingsRecord,
        testimonials
      ] = await Promise.all([
        prisma.banner.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.category.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            subcategories: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            },
            _count: {
              select: { products: { where: { isActive: true } } }
            }
          }
        }),
        prisma.product.findMany({
          where: { isActive: true },
          orderBy: [{ isFeatured: 'desc' }, { isBestSeller: 'desc' }, { createdAt: 'desc' }],
          take: 24,
          include: {
            category: { select: { id: true, name: true, slug: true, isAdult: true } },
            subcategory: { select: { id: true, name: true, slug: true } },
            images: { orderBy: { order: 'asc' } },
            variants: true,
            reviews: {
              where: { isApproved: true },
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        }),
        prisma.siteContent.findUnique({ where: { key: 'our_story' } }),
        prisma.siteContent.findUnique({ where: { key: 'store_settings' } }),
        fetchApprovedTestimonialsCombined()
      ]);

      const banners = rawBanners.filter((b) => {
        if (b.startsAt && new Date(b.startsAt) > now) return false;
        if (b.endsAt && new Date(b.endsAt) < now) return false;
        return true;
      });

      const ourStory = ourStoryRecord ? JSON.parse(ourStoryRecord.data) : null;
      const storeSettings = storeSettingsRecord
        ? JSON.parse(storeSettingsRecord.data)
        : {
            phone: config.store.phone,
            whatsapp: config.store.whatsapp,
            sinpePhone: config.store.sinpe.phone,
            sinpeHolder: config.store.sinpe.holder,
            bankName: config.store.banks.bac.name,
            bankHolder: config.store.banks.holder,
            bankIban: config.store.banks.bac.iban,
            popularBankName: config.store.banks.popular.name,
            popularBankIban: config.store.banks.popular.iban,
            storeAddress: config.store.address,
            pickupNote: 'Previa coordinación por WhatsApp',
            contactEmail: config.store.email,
            freeShippingThreshold: 35000,
            social: config.store.social
          };

      const payload = {
        banners,
        categories,
        featuredProducts,
        ourStory,
        storeSettings,
        testimonials
      };

      const etag = cacheService.setHomeData(payload);
      res.setHeader('ETag', etag);
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.json({ success: true, data: payload });
    } catch (err) {
      console.error('Error al obtener datos unificados del Home:', err);
      return res.status(500).json({ error: true, message: 'Error al obtener datos del Home' });
    }
  },
  /**
   * Obtener todas las categorías con sus subcategorías
   */
  async getCategories(req, res) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          subcategories: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          _count: {
            select: { products: { where: { isActive: true } } }
          }
        }
      });

      return res.json({ success: true, data: categories });
    } catch (err) {
      console.error('Error al obtener categorías:', err);
      return res.status(500).json({ error: true, message: 'Error al obtener categorías' });
    }
  },

  /**
   * Obtener productos con filtros avanzados (categoría, subcategoría, búsqueda, destacados, etc.)
   */
  async getProducts(req, res) {
    try {
      const {
        category,
        subcategory,
        search,
        featured,
        isNew,
        bestSeller,
        isAdult,
        minPrice,
        maxPrice,
        sort = 'newest',
        limit = 20,
        page = 1
      } = req.query;

      const where = { isActive: true };

      if (category) {
        where.category = { slug: category };
      }

      if (subcategory) {
        where.subcategory = { slug: subcategory };
      }

      // Si no se solicita explícitamente contenido adulto, excluirlo por discreción
      if (isAdult === 'true') {
        where.isAdult = true;
      } else if (isAdult === 'false') {
        where.isAdult = false;
      }

      if (featured === 'true') where.isFeatured = true;
      if (isNew === 'true') where.isNew = true;
      if (bestSeller === 'true') where.isBestSeller = true;

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice);
        if (maxPrice) where.price.lte = parseFloat(maxPrice);
      }

      if (req.query.inStock === 'true') {
        where.stock = { gt: 0 };
      }

      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { shortDescription: { contains: search } },
          { sku: { contains: search } }
        ];
      }

      const orderBy = [];
      if (sort === 'price_asc') orderBy.push({ price: 'asc' });
      else if (sort === 'price_desc') orderBy.push({ price: 'desc' });
      else if (sort === 'best_seller')
        orderBy.push({ isBestSeller: 'desc' }, { viewsCount: 'desc' });
      else if (sort === 'rating') orderBy.push({ rating: 'desc' });
      else orderBy.push({ createdAt: 'desc' });

      const take = parseInt(limit, 10) || 20;
      const skip = (parseInt(page, 10) - 1) * take;

      const [total, products, priceStats] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          orderBy,
          take,
          skip,
          include: {
            category: { select: { id: true, name: true, slug: true, isAdult: true } },
            subcategory: { select: { id: true, name: true, slug: true } },
            images: { orderBy: { order: 'asc' } },
            variants: true,
            reviews: {
              where: { isApproved: true },
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        }),
        prisma.product.aggregate({
          where: { isActive: true },
          _min: { price: true },
          _max: { price: true }
        })
      ]);

      return res.json({
        success: true,
        data: products,
        priceRange: {
          min: priceStats._min.price || 0,
          max: priceStats._max.price || 100000
        },
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: take,
          totalPages: Math.ceil(total / take)
        }
      });
    } catch (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ error: true, message: 'Error al obtener productos' });
    }
  },

  /**
   * Obtener detalle de un producto por su slug
   */
  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          subcategory: true,
          images: { orderBy: { order: 'asc' } },
          variants: true,
          reviews: {
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      if (!product || !product.isActive) {
        return res.status(404).json({ error: true, message: 'Producto no encontrado' });
      }

      // Incrementar contador de visitas de forma no bloqueante
      prisma.product
        .update({
          where: { id: product.id },
          data: { viewsCount: { increment: 1 } }
        })
        .catch(() => {});

      // Buscar productos relacionados de la misma categoría
      const related = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true
        },
        take: 4,
        include: {
          images: { where: { isCover: true }, take: 1 }
        }
      });

      return res.json({
        success: true,
        data: product,
        related
      });
    } catch (err) {
      console.error('Error al obtener producto:', err);
      return res.status(500).json({ error: true, message: 'Error al obtener producto' });
    }
  },

  /**
   * Obtener banners activos del Hero Carrusel
   */
  async getBanners(req, res) {
    try {
      const now = new Date();
      const rawBanners = await prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });

      const banners = rawBanners.filter((b) => {
        if (b.startsAt && new Date(b.startsAt) > now) return false;
        if (b.endsAt && new Date(b.endsAt) < now) return false;
        return true;
      });

      return res.json({ success: true, data: banners });
    } catch (err) {
      console.error('Error al obtener banners:', err);
      return res.status(500).json({ error: true, message: 'Error al obtener banners' });
    }
  },

  /**
   * Obtener contenido del sitio por clave (ej: our_story, sinpe_config)
   */
  async getSiteContent(req, res) {
    try {
      const { key } = req.params;
      const content = await prisma.siteContent.findUnique({
        where: { key }
      });

      if (!content) {
        return res.status(404).json({ error: true, message: 'Contenido no encontrado' });
      }

      return res.json({
        success: true,
        data: JSON.parse(content.data)
      });
    } catch (err) {
      console.error('Error al obtener contenido:', err);
      return res.status(500).json({ error: true, message: 'Error al obtener contenido' });
    }
  },

  getTestimonials,
  createPublicTestimonial,
  createProductReview
};
