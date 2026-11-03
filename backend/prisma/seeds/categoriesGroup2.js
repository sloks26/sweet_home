export const categoriesGroup2 = [
    {
      name: 'Maquillaje',
      slug: 'maquillaje',
      description: 'Colores que realzan tu belleza y tu personalidad.',
      icon: 'Smile',
      order: 6,
      isAdult: false,
      subcategories: ['Rostro', 'Ojos', 'Labios', 'Uñas', 'Brochas'],
      products: [
        {
          name: 'Paleta de Sombras "Galaxia Mágica" 18 Tonos',
          slug: 'paleta-sombras-galaxia-magica',
          sku: 'MAQ-PAL-001',
          price: 19500,
          compareAtPrice: 24000,
          shortDescription: 'Pigmentación profesional con acabados mate, satinado y glitter metálico.',
          description: 'Tonos neutros cálidos, dorados intensos y púrpuras cósmicos de ultra adherencia.',
          stock: 14,
          isFeatured: true,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80']
        },
        {
          name: 'Labial Líquido Mate Larga Duración Velvet Gold',
          slug: 'labial-liquido-mate-velvet-gold',
          sku: 'MAQ-LAB-002',
          price: 8500,
          shortDescription: 'Intransmutable, cómodo e hidratante.',
          description: 'Fórmula enriquecida con aceite de jojoba que no reseca los labios durante 16 horas.',
          stock: 35,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80'],
          variants: [{ name: 'Tono', options: JSON.stringify(['Rojo Imperial', 'Nude Rosa', 'Vino Noche', 'Mocaccino']) }]
        },
        {
          name: 'Set de 12 Brochas Profesionales con Estuche Cilindro Dorado',
          slug: 'set-brochas-profesionales-cilindro',
          sku: 'MAQ-BRO-003',
          price: 21500,
          compareAtPrice: 26000,
          shortDescription: 'Fibras sintéticas ultrasuaves para rostro y ojos.',
          description: 'Mango ergonómico con virola dorada resistente y estuche de viaje rígido.',
          stock: 12,
          isFeatured: true,
          images: ['https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80']
        },
        {
          name: 'Iluminador Horneado "Luz de Luna" con Destellos Dorados',
          slug: 'iluminador-horneado-luz-de-luna',
          sku: 'MAQ-ILU-004',
          price: 11500,
          shortDescription: 'Brillo reflectivo sedoso sin textura marcada.',
          description: 'Aplica en pómulos, arco de cupido y clavículas para un efecto húmedo radiante.',
          stock: 20,
          images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80']
        },
        {
          name: 'Máscara de Pestañas Efecto Volumen y Alargamiento Infinito',
          slug: 'mascara-pestanas-volumen-infinito',
          sku: 'MAQ-MAS-005',
          price: 9500,
          shortDescription: 'A prueba de agua con cepillo de silicona curvo.',
          description: 'Eleva y separa cada pestaña sin grumos ni caídas.',
          stock: 28,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&q=80']
        },
        {
          name: 'Base de Maquillaje Fluida Cobertura Media Construible',
          slug: 'base-maquillaje-fluida-cobertura',
          sku: 'MAQ-BAS-006',
          price: 15000,
          shortDescription: 'Acabado natural semimate que dura todo el día.',
          description: 'Fórmula libre de aceites con protección solar SPF 20 y ácido hialurónico.',
          stock: 16,
          images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80']
        }
      ]
    },
    {
      name: 'Cuidado Personal',
      slug: 'cuidado-personal',
      description: 'Productos que miman tu piel y tu cuerpo.',
      icon: 'Shield',
      order: 7,
      isAdult: false,
      subcategories: ['Higiene', 'Hidratación', 'Spa en casa'],
      products: [
        {
          name: 'Exfoliante Corporal Café y Aceite de Coco Virgen (350g)',
          slug: 'exfoliante-corporal-cafe-coco',
          sku: 'CUI-EXF-001',
          price: 9800,
          shortDescription: 'Elimina células muertas y estimula la circulación.',
          description: 'Elaborado con café costarricense puro, azúcar morena y aceites emolientes para una piel suave como la seda.',
          stock: 22,
          isFeatured: true,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80']
        },
        {
          name: 'Mantequilla Corporal Batida Karité & Cacao (250ml)',
          slug: 'mantequilla-corporal-karite-cacao',
          sku: 'CUI-MAN-002',
          price: 11000,
          shortDescription: 'Ultra nutritiva para codos, talones y piel reseca.',
          description: 'Textura cremosa batida que se funde con el calor de la piel sin sensación grasosa.',
          stock: 18,
          images: ['https://images.unsplash.com/photo-1608248597359-0091ff30b200?w=800&q=80']
        },
        {
          name: 'Set de Bombas de Baño Efervescentes Aromaterapia (6 Uds)',
          slug: 'bombas-de-bano-aromaterapia',
          sku: 'CUI-BOM-003',
          price: 12500,
          shortDescription: 'Convierte tu tina o ducha en un spa relajante.',
          description: 'Con sales de Epsom, aceites esenciales de eucalipto, lavanda y rosas.',
          stock: 15,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80']
        },
        {
          name: 'Jabón Líquido Corporal Botánico Hidratante (500ml)',
          slug: 'jabon-liquido-corporal-botanico',
          sku: 'CUI-JAB-004',
          price: 8500,
          shortDescription: 'Limpieza suave con pH balanceado y extracto de avena.',
          description: 'Apto para toda la familia con espuma cremosa y fragancia delicada.',
          stock: 25,
          images: ['https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80']
        },
        {
          name: 'Bálsamo Labial Reparador Cera de Abejas y Vainilla',
          slug: 'balsamo-labial-cera-abejas',
          sku: 'CUI-BAL-005',
          price: 4500,
          shortDescription: 'Alivio inmediato para labios agrietados.',
          description: 'Práctico envase dorado, textura no pegajosa.',
          stock: 40,
          images: ['https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&q=80']
        },
        {
          name: 'Guante Exfoliante de Seda Natural Tradicional',
          slug: 'guante-exfoliante-seda-natural',
          sku: 'CUI-GUA-006',
          price: 6500,
          shortDescription: 'Renueva tu piel solo con agua tibia en la ducha.',
          description: 'Inspirado en los rituales hammam para eliminar impurezas profundas.',
          stock: 30,
          images: ['https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&q=80']
        }
      ]
    },
    {
      name: 'Bienestar Íntimo (+18)',
      slug: 'bienestar-intimo',
      description: 'Bienestar, confianza y momentos para ti. Descúbrelo con libertad y discreción.',
      icon: 'Lock',
      order: 8,
      isAdult: true, // +18 con verificación y empaque discreto
      subcategories: ['Cuidado Íntimo', 'Masajes y Velas', 'Sensualidad'],
      products: [
        {
          name: 'Vela de Masaje Tibio Aroma Vainilla Borbón y Jazmín',
          slug: 'vela-masaje-tibio-vainilla',
          sku: 'INT-VEL-001',
          price: 14500,
          compareAtPrice: 17500,
          shortDescription: 'Cera vegetal que se derrite a temperatura corporal para masajes sensuales.',
          description: 'Formulada con manteca de karité, aceite de coco y fragancias hipoalergénicas. Envase discreto con boquilla vertedora.',
          stock: 16,
          isAdult: true,
          isFeatured: false,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80']
        },
        {
          name: 'Gel Lubricante Hidratante Íntimo Base Agua con Ácido Hialurónico',
          slug: 'gel-lubricante-intimo-hialuronico',
          sku: 'INT-LUB-002',
          price: 11500,
          shortDescription: 'Fórmula ultra sedosa con pH fisiológico respetuoso.',
          description: 'Libre de parabenos, siliconas y glicerina. No mancha sábanas y se retira fácilmente con agua.',
          stock: 20,
          isAdult: true,
          images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80']
        },
        {
          name: 'Aceite de Masajes Afrodisíaco con Feromonas Vegetales',
          slug: 'aceite-masajes-afrodisiaco-rosas',
          sku: 'INT-ACE-003',
          price: 16000,
          compareAtPrice: 19000,
          shortDescription: 'Estimulación sensorial cálida con extracto de ylang-ylang.',
          description: 'Delicada textura que desliza suavemente sobre la piel dejando una estela aromática irresistible.',
          stock: 14,
          isAdult: true,
          images: ['https://images.unsplash.com/photo-1608248597359-0091ff30b200?w=800&q=80']
        },
        {
          name: 'Espuma Limpiadora Íntima Delicada con Prebióticos (200ml)',
          slug: 'espuma-limpiadora-intima-prebioticos',
          sku: 'INT-ESP-004',
          price: 9500,
          shortDescription: 'Cuidado diario suave que respeta la flora natural.',
          description: 'Dermatológicamente y ginecológicamente testeada, enriquecida con extracto de caléndula.',
          stock: 25,
          isAdult: true,
          images: ['https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80']
        },
        {
          name: 'Bruma de Almohada y Ambiente Relajación Sensual (120ml)',
          slug: 'bruma-almohada-ambiente-sensual',
          sku: 'INT-BRU-005',
          price: 8900,
          shortDescription: 'Ambienta tu habitación para momentos íntimos inolvidables.',
          description: 'Notas de ámbar dulce, pachulí suave y flores nocturnas.',
          stock: 18,
          isAdult: true,
          images: ['https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80']
        },
        {
          name: 'Antifaz de Seda Pura Noche Profunda',
          slug: 'antifaz-seda-pura-noche',
          sku: 'INT-ANT-006',
          price: 7500,
          shortDescription: 'Tacto sensual suave para desconectar la vista y elevar sensaciones.',
          description: 'Acolchado de seda en tono negro y ribete dorado.',
          stock: 22,
          isAdult: true,
          images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80']
        }
      ]
    },
    {
      name: 'Novedades y Regalos',
      slug: 'novedades-regalos',
      description: 'Descubre lo nuevo que llega para ti cada semana.',
      icon: 'Gift',
      order: 9,
      isAdult: false,
      subcategories: ['Recién llegados', 'Sets de regalo', 'Ediciones especiales'],
      products: [
        {
          name: 'Caja Regalo "Momentos Dorados" (Vela + Difusor + Jabón Artesanal)',
          slug: 'caja-regalo-momentos-dorados',
          sku: 'NOV-REG-001',
          price: 29500,
          compareAtPrice: 35000,
          shortDescription: 'Presentación lista para regalar con lazo dorado y tarjeta personalizada.',
          description: 'Una selección curada con los favoritos de Sweet Home en una caja rígida premium.',
          stock: 10,
          isFeatured: true,
          isBestSeller: true,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80']
        },
        {
          name: 'Lámpara de Cristal Galaxia con Base de Madera Noble',
          slug: 'lampara-cristal-galaxia-madera',
          sku: 'NOV-LAM-002',
          price: 17500,
          shortDescription: 'Esfera de cristal grabada en 3D con luz cálida LED.',
          description: 'Un detalle decorativo que ilumina cualquier escritorio o mesita de noche con magia cósmica.',
          stock: 15,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80']
        },
        {
          name: 'Joyero Musical Estilo Vintage con Forro de Terciopelo',
          slug: 'joyero-musical-vintage-terciopelo',
          sku: 'NOV-JOY-003',
          price: 22500,
          shortDescription: 'Guarda tus tesoros más preciados con delicadeza.',
          description: 'Espejo interior, separadores para anillos y collares, acabado exterior en tono noche profundo.',
          stock: 8,
          images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80']
        },
        {
          name: 'Taza de Porcelana Fina con Asa Dorada y Tapa Infusora',
          slug: 'taza-porcelana-asa-dorada-infusor',
          sku: 'NOV-TAZ-004',
          price: 9500,
          shortDescription: 'Disfruta tu té o café con distinción.',
          description: 'Incluye cuchara dorada a juego en caja para obsequio.',
          stock: 20,
          images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80']
        },
        {
          name: 'Portarretrato Metálico con Borde Laurel Dorado',
          slug: 'portarretrato-metalico-laurel-dorado',
          sku: 'NOV-POR-005',
          price: 11000,
          shortDescription: 'Enmarca tus recuerdos favoritos con el estilo de la tienda.',
          description: 'Medida estándar 15x20 cm con soporte posterior y vidrio de alta nitidez.',
          stock: 14,
          images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80']
        },
        {
          name: 'Bolsa de Tela Ecológica Ilustrada Sweet Home Luxury Tote',
          slug: 'bolsa-tela-ecologica-sweet-home',
          sku: 'NOV-TOT-006',
          price: 6500,
          shortDescription: 'Lleva tus compras con amor y estilo.',
          description: 'Lienzo de algodón grueso con serigrafía dorada de nuestro logo.',
          stock: 50,
          images: ['https://images.unsplash.com/photo-1597484662317-c931448b1d96?w=800&q=80']
        }
      ]
    },
    {
      name: 'Omnilife y Más',
      slug: 'omnilife-y-mas',
      description: 'Productos que apoyan tu bienestar y tu día a día.',
      icon: 'Activity',
      order: 10,
      isAdult: false,
      subcategories: ['Suplementos y bienestar'],
      products: [
        {
          name: 'Omnilife Biocros Supreme (Caja 30 Sobres)',
          slug: 'omnilife-biocros-supreme',
          sku: 'OMN-BIO-001',
          price: 24500,
          shortDescription: 'Energía natural, concentración y vitalidad prolongada.',
          description: 'Suplemento dietario en polvo sabor a frutas cítricas enriquecido con complejo B, cafeína natural y taurina.',
          stock: 18,
          isFeatured: true,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80']
        },
        {
          name: 'Omnilife Power Maker Supreme (Caja 30 Sobres)',
          slug: 'omnilife-power-maker-supreme',
          sku: 'OMN-POW-002',
          price: 36500,
          shortDescription: 'Nutrición para músculos, articulaciones y descanso regenerador.',
          description: 'Fórmula avanzada con arginina, colina, glicina y vitaminas antioxidantes.',
          stock: 12,
          isFeatured: true,
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80']
        },
        {
          name: 'Omnilife OmniPlus Supreme Frutas (Bote 940ml)',
          slug: 'omnilife-omniplus-supreme',
          sku: 'OMN-OMN-003',
          price: 32000,
          shortDescription: 'Fortalece el sistema inmunológico con extractos herbales y micelización.',
          description: 'Concentrado multivitamínico con extractos de aloe vera, espirulina, equinácea y minerales quelados.',
          stock: 14,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80']
        },
        {
          name: 'Omnilife StarBien Supreme (Caja 30 Sobres)',
          slug: 'omnilife-starbien-supreme',
          sku: 'OMN-STA-004',
          price: 22000,
          shortDescription: 'Sensación de calma y bienestar ante el estrés diario.',
          description: 'Con ácido fólico, fibra de manzana y vitaminas antioxidantes con refrescante sabor a naranja.',
          stock: 16,
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80']
        },
        {
          name: 'Omnilife Teatino Limón Supreme (Caja 30 Sobres)',
          slug: 'omnilife-teatino-limon-supreme',
          sku: 'OMN-TEA-005',
          price: 26000,
          shortDescription: 'Delicioso té con extracto de té negro y cromo para complementar tu alimentación.',
          description: 'Se toma frío o caliente, ideal para acompañar tus comidas y apoyar el control de peso.',
          stock: 20,
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80']
        },
        {
          name: 'Omnilife Aloe Beta Supreme Sabor Piña (Bote 960ml)',
          slug: 'omnilife-aloe-beta-supreme',
          sku: 'OMN-ALO-006',
          price: 18500,
          shortDescription: 'Bebida refrescante con gel de sábila y betacaroteno para la digestión.',
          description: 'Favorece la desintoxicación natural del organismo y el confort gastrointestinal.',
          stock: 22,
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80']
        }
      ]
    }
  ];
