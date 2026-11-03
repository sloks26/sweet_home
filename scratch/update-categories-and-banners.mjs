import prisma from '../backend/src/config/prisma.js';

async function updateData() {
  console.log('🔄 Actualizando categorías con sus fotos correspondientes y textos editables...');

  const categoryConfigs = [
    {
      slug: 'hogar',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=480&q=80&auto=format&fit=crop',
      menuBadge: 'Hogar & Confort',
      menuTitle: 'Espacios que transmiten paz',
      menuLink: '#hogar'
    },
    {
      slug: 'moda',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=480&q=80&auto=format&fit=crop',
      menuBadge: 'Nueva Temporada',
      menuTitle: 'Prendas selectas para ti',
      menuLink: '#moda'
    },
    {
      slug: 'accesorios',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=480&q=80&auto=format&fit=crop',
      menuBadge: 'Complementos Finos',
      menuTitle: 'Joyería y carteras artesanales',
      menuLink: '#accesorios'
    },
    {
      slug: 'belleza',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=480&q=80&auto=format&fit=crop',
      menuBadge: 'Cuidado Facial',
      menuTitle: 'Fórmulas de luminosidad',
      menuLink: '#belleza'
    },
    {
      slug: 'perfumes',
      // Perfume artesanal de lujo SIN marca visible (reemplaza cualquier marca comercial de terceros)
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=480&q=80&auto=format&fit=crop',
      menuBadge: 'Aromas Selectos',
      menuTitle: 'Esencias que dejan huella',
      menuLink: '#perfumes'
    },
    {
      slug: 'maquillaje',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=480&q=80&auto=format&fit=crop',
      menuBadge: 'Tendencias Boutique',
      menuTitle: 'Tonos cálidos y naturales',
      menuLink: '#maquillaje'
    },
    {
      slug: 'cuidado-personal',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=480&q=80&auto=format&fit=crop',
      menuBadge: 'Bienestar Diario',
      menuTitle: 'Baño y cuidado botánico',
      menuLink: '#cuidado-personal'
    },
    {
      slug: 'bienestar-intimo',
      // IMPORTANTE: Bienestar Íntimo (+18) NO DEBE LLEVAR FOTO EN EL MENÚ
      image: null,
      menuBadge: null,
      menuTitle: null,
      menuLink: null
    },
    {
      slug: 'novedades-regalos',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=480&q=80&auto=format&fit=crop',
      menuBadge: 'Detalles Especiales',
      menuTitle: 'Cajas de regalo preparadas a mano',
      menuLink: '#novedades-regalos'
    },
    {
      slug: 'omnilife-y-mas',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=480&q=80&auto=format&fit=crop',
      menuBadge: 'Nutrición & Vitalidad',
      menuTitle: 'Línea Seytú y suplementos',
      menuLink: '#omnilife-y-mas'
    }
  ];

  for (const cat of categoryConfigs) {
    await prisma.category.updateMany({
      where: { slug: cat.slug },
      data: {
        image: cat.image,
        menuBadge: cat.menuBadge,
        menuTitle: cat.menuTitle,
        menuLink: cat.menuLink
      }
    });
    console.log(`✅ Categoría "${cat.slug}" actualizada. Imagen: ${cat.image ? 'SÍ' : 'NINGUNA (sin foto)'}`);
  }

  // 2. Actualizar Banner 2 en la base de datos para quitar foto de Chanel Coco Mademoiselle
  console.log('🔄 Actualizando banner de perfumes en carrusel con foto sin marcas de terceros...');
  const perfumeBanner = await prisma.banner.findFirst({
    where: {
      OR: [
        { desktopImage: { contains: '1592945403244-b3fbafd7f539' } },
        { title: { contains: 'Aromas' } }
      ]
    }
  });

  if (perfumeBanner) {
    await prisma.banner.update({
      where: { id: perfumeBanner.id },
      data: {
        desktopImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1920&q=80&auto=format&fit=crop',
        mobileImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=768&q=80&auto=format&fit=crop',
        title: 'Fragancias de autor que dejan una huella inolvidable',
        subtitle: 'Perfumes de lujo, difusores y esencias botánicas para crear momentos memorables.',
        badge: 'Exclusivo en Sweet Home',
        ctaText: 'Explorar Perfumes'
      }
    });
    console.log(`✅ Banner de perfumes (${perfumeBanner.id}) actualizado sin marcas comerciales de terceros.`);
  }

  console.log('✨ Base de datos actualizada con éxito.');
  process.exit(0);
}

updateData().catch((err) => {
  console.error(err);
  process.exit(1);
});
