export const bannersData = [
  {
    title: 'Donde cada detalle ilumina tu hogar y tu estilo',
    subtitle: 'Descubre piezas exclusivas, aromas cautivadores y moda que realza tu esencia con envíos a todo Costa Rica.',
    badge: 'Nueva Colección 2026',
    ctaText: 'Ver Colección Hogar',
    ctaLink: '/categoria/hogar',
    desktopImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    order: 1,
    isActive: true
  },
  {
    title: 'Fragancias de autor que dejan una huella inolvidable',
    subtitle: 'Perfumes selectos de lujo, difusores y esencias botánicas para crear momentos memorables.',
    badge: 'Exclusivo en Sweet Home',
    ctaText: 'Explorar Perfumes',
    ctaLink: '/categoria/perfumes',
    desktopImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1920&q=80&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=768&q=80&auto=format&fit=crop',
    order: 2,
    isActive: true
  },
  {
    title: 'Regalos con amor para personas especiales',
    subtitle: 'Sets armados con empaque premium y tarjetas con dedicatoria personal.',
    badge: 'Detalles Únicos',
    ctaText: 'Ver Sets de Regalo',
    ctaLink: '/categoria/novedades-regalos',
    desktopImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
    order: 3,
    isActive: true
  }
];

export const siteContentData = [
  {
    key: 'our_story',
    data: JSON.stringify({
      badge: 'El corazón de nuestra boutique',
      title: 'Nuestra Historia',
      subtitle: 'Un sueño costarricense que nació para iluminar hogares',
      founderName: 'Vanessa Sánchez',
      founderRole: 'Fundadora & Directora Creativa',
      founderPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      storyParagraphs: [
        'Sweet Home & Boutique CR nació desde un anhelo profundo en el corazón: transformar espacios cotidianos en santuarios de calidez, belleza y armonía. Lo que empezó como una pequeña selección de detalles para seres queridos se convirtió, paso a paso y con inmenso amor, en una boutique donde cada artículo cuenta una historia.',
        'Creemos que tu hogar es el reflejo de tu alma, y que tu estilo es la forma en que iluminas el mundo. Por eso, cada difusor, cada prenda, cada joya y cada fragancia es elegida personalmente, buscando la más alta calidad y ese toque distintivo que no se encuentra en las tiendas masivas.',
        'Hoy, gracias a la confianza de tantas familias en todo el país, seguimos enviando amor en cada paquete, preparados a mano y sellados con la ilusión de llevar dicha y bienestar a tu puerta.'
      ],
      isProvisional: true,
      isActive: true
    })
  },
  {
    key: 'store_settings',
    data: JSON.stringify({
      phone: '+506 8888-8888',
      whatsapp: '50688888888',
      sinpePhone: '8888-8888',
      sinpeHolder: 'Sweet Home & Boutique CR',
      bankName: 'Banco de Costa Rica (BCR)',
      bankHolder: 'Sweet Home & Boutique CR',
      bankIban: 'CR05015202001000000000',
      bankIdNumber: '3-101-123456',
      storeAddress: 'San José, Costa Rica',
      pickupNote: 'Previa coordinación por WhatsApp',
      contactEmail: 'info@sweethomeandboutiquecr.com',
      freeShippingThreshold: 35000
    })
  },
  {
    key: 'sinpe_config',
    data: JSON.stringify({
      phone: '8888-8888',
      holder: 'Sweet Home & Boutique CR',
      instructions: 'Realiza el pago por SINPE Móvil al número indicado por el monto exacto de tu pedido.',
      whatsappPhone: '50688888888',
      paymentTimeoutHours: 24
    })
  },
  {
    key: 'bank_config',
    data: JSON.stringify({
      bankName: 'Banco de Costa Rica (BCR)',
      holder: 'Sweet Home & Boutique CR',
      accountNumber: '001-0123456-7',
      ibanNumber: 'CR05015201001012345678',
      idNumber: '3-101-123456',
      instructions: 'Transfiere el monto total a nuestra cuenta IBAN y coloca como referencia tu número de pedido.'
    })
  },
  {
    key: 'promo_bar',
    data: JSON.stringify({
      messages: [
        '✨ Envíos a todo Costa Rica por Correos de Costa Rica y Mensajería Express',
        '🎁 Envío GRATIS en compras superiores a ₡35,000 colones',
        '💜 Paga fácil y seguro con tu SINPE Móvil o Transferencia bancaria'
      ],
      freeShippingThreshold: 35000,
      isActive: true
    })
  }
];

export const testimonialsData = [
  {
    clientName: 'Valeria M.',
    clientLocation: 'Curridabat, San José',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    rating: 5,
    comment: '¡Quedé enamorada del empaque! El difusor y las esencias llegaron al día siguiente por Correos de Costa Rica, todo envuelto con un aroma delicioso y una notita hermosa. 100% recomendados.',
    isFeatured: true,
    isActive: true,
    order: 1
  },
  {
    clientName: 'María José R.',
    clientLocation: 'San Joaquín de Flores, Heredia',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    rating: 5,
    comment: 'Compré el perfume Nuit Étoilée y un bolso para un regalo de cumpleaños. La atención por WhatsApp fue super personalizada y el pago por SINPE muy cómodo. La calidad superó mis expectativas.',
    isFeatured: true,
    isActive: true,
    order: 2
  },
  {
    clientName: 'Fernanda C.',
    clientLocation: 'Cartago Centro',
    clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
    rating: 5,
    comment: 'Excelente variedad para el hogar. Las toallas y los cojines le dieron un toque super elegante a mi sala. Se nota el amor y el buen gusto en cada detalle.',
    isFeatured: true,
    isActive: true,
    order: 3
  },
  {
    clientName: 'Daniela S.',
    clientLocation: 'Escazú, San José',
    clientAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80',
    rating: 5,
    comment: 'El vestido y los accesorios me llegaron perfectos en talla y tela. Además me encanta que sea un emprendimiento tico con un estándar de boutique tan alto.',
    isFeatured: true,
    isActive: true,
    order: 4
  }
];

export const promotionData = {
  name: 'Descuento de Bienvenida',
  code: 'BIENVENIDA10',
  type: 'PERCENTAGE',
  value: 10,
  minOrderAmount: 15000,
  isActive: true,
  applyToAll: true
};
