import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../src/config/prisma.js';
import { categoriesGroup1 } from './seeds/categoriesGroup1.js';
import { categoriesGroup2 } from './seeds/categoriesGroup2.js';
import { bannersData, siteContentData, testimonialsData, promotionData } from './seeds/bannersAndExtras.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

async function main() {
  // Candado de seguridad: este seed BORRA TODA la base de datos (usuarios, pedidos, productos).
  // Local y producción pueden compartir la misma base en la nube, por eso exige confirmación explícita.
  if (process.env.CONFIRM_WIPE_DATABASE !== 'SI_BORRAR_TODO') {
    throw new Error(
      '❌ Este seed BORRA TODA la base de datos. Si estás 100% segura/o de lo que haces, ejecútalo con CONFIRM_WIPE_DATABASE=SI_BORRAR_TODO'
    );
  }

  console.log('✨ Iniciando Seed modular para Sweet Home & Boutique CR...');

  // 1. Limpieza segura de tablas previas
  console.log('🧹 Limpiando tablas previas...');
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.user.deleteMany();

  // 2. Administradoras oficiales (Socias): las contraseñas SIEMPRE deben venir del .env (sin valores por defecto)
  const adminPass = process.env.INITIAL_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  const jendryPass = process.env.JENDRY_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!adminPass || !jendryPass) {
    throw new Error('❌ Es obligatorio definir ADMIN_PASSWORD (o INITIAL_ADMIN_PASSWORD / JENDRY_ADMIN_PASSWORD) en .env');
  }

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@sweethomeboutiquecr.com';
  const adminName = process.env.INITIAL_ADMIN_NAME || 'Vanessa';

  const hashedPassword = await bcrypt.hash(adminPass, 12);
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail.toLowerCase().trim(),
      password: hashedPassword,
      name: adminName,
      role: 'ADMIN',
      phone: '+506 6465-6625',
      isActive: true
    }
  });
  console.log(`👤 Socia Administradora 1 creada: ${adminUser.email}`);

  const jendryEmail = process.env.JENDRY_ADMIN_EMAIL || 'jendry@sweethomeboutiquecr.com';
  const jendryName = process.env.JENDRY_ADMIN_NAME || 'Jendry Zúñiga';
  const jendryHashedPassword = await bcrypt.hash(jendryPass, 12);
  const jendryUser = await prisma.user.create({
    data: {
      email: jendryEmail.toLowerCase().trim(),
      password: jendryHashedPassword,
      name: jendryName,
      role: 'ADMIN',
      isActive: true
    }
  });
  console.log(`👤 Socia Administradora 2 creada: ${jendryUser.email}`);

  // 3. Crear Categorías, Subcategorías y Productos
  const allCategories = [...categoriesGroup1, ...categoriesGroup2];
  console.log(`📦 Creando ${allCategories.length} categorías oficiales con sus productos...`);

  for (const catData of allCategories) {
    const category = await prisma.category.create({
      data: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        icon: catData.icon,
        order: catData.order,
        isAdult: catData.isAdult,
        isActive: true,
        featuredInMenu: true
      }
    });

    const subcatMap = {};
    for (let i = 0; i < catData.subcategories.length; i++) {
      const subName = catData.subcategories[i];
      const subSlug = subName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const subcat = await prisma.subcategory.create({
        data: {
          categoryId: category.id,
          name: subName,
          slug: subSlug,
          order: i + 1,
          isActive: true
        }
      });
      subcatMap[subName] = subcat.id;
    }

    for (const prod of catData.products) {
      const subcatId = Object.values(subcatMap)[0] || null;

      const createdProduct = await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          sku: prod.sku,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice || null,
          shortDescription: prod.shortDescription || null,
          description: prod.description,
          stock: prod.stock,
          isFeatured: prod.isFeatured || false,
          isNew: prod.isNew || false,
          isBestSeller: prod.isBestSeller || false,
          isAdult: prod.isAdult || catData.isAdult,
          categoryId: category.id,
          subcategoryId: subcatId,
          rating: 4.9,
          reviewCount: Math.floor(Math.random() * 20) + 5
        }
      });

      if (prod.images && prod.images.length > 0) {
        for (let imgIndex = 0; imgIndex < prod.images.length; imgIndex++) {
          await prisma.productImage.create({
            data: {
              productId: createdProduct.id,
              url: prod.images[imgIndex],
              alt: prod.name,
              isCover: imgIndex === 0,
              order: imgIndex
            }
          });
        }
      }

      if (prod.variants && prod.variants.length > 0) {
        for (const variant of prod.variants) {
          await prisma.productVariant.create({
            data: {
              productId: createdProduct.id,
              name: variant.name,
              options: variant.options,
              stock: prod.stock
            }
          });
        }
      }
    }
  }

  // 4. Banners
  console.log('🎠 Creando banners...');
  await prisma.banner.createMany({ data: bannersData });

  // 5. Site Content
  console.log('📖 Creando contenidos del sitio...');
  await prisma.siteContent.createMany({ data: siteContentData });

  // 6. Testimonios
  console.log('⭐ Creando testimonios...');
  if (testimonialsData.length > 0) {
    await prisma.testimonial.createMany({ data: testimonialsData });
  }

  // 7. Promociones
  console.log('🎟️ Creando promociones...');
  await prisma.promotion.create({ data: promotionData });

  console.log('🎉 Seed modular completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
