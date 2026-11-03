export const categoriesGroup1 = [
    {
      name: 'Hogar',
      slug: 'hogar',
      description: 'Todo para hacer de tu hogar un lugar único y especial.',
      icon: 'Home',
      order: 1,
      isAdult: false,
      subcategories: ['Cocina y ollas', 'Decoración', 'Cojines y textiles', 'Aromas y difusores', 'Organización', 'Baño'],
      products: [
        {
          name: 'Difusor Ultrasónico Galaxia con Iluminación LED',
          slug: 'difusor-ultrasonico-galaxia',
          sku: 'HOG-DIF-001',
          price: 18500,
          compareAtPrice: 22000,
          shortDescription: 'Crea una atmósfera mágica de descanso con niebla aromática continua.',
          description: 'Difusor de aromas ultrasónico con 7 colores de iluminación suave, apagado automático y capacidad de 500ml. Silencioso y perfecto para salas y dormitorios.',
          stock: 14,
          isFeatured: true,
          isNew: true,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&q=80'],
          variants: [{ name: 'Aroma', options: JSON.stringify(['Vainilla Dorada', 'Lavanda Relajante', 'Flor de Cerezo']) }]
        },
        {
          name: 'Set de Ollas Cerámica Antiadherente Rose Gold (6 Piezas)',
          slug: 'set-ollas-ceramica-rose-gold',
          sku: 'HOG-OLL-002',
          price: 49500,
          compareAtPrice: 58000,
          shortDescription: 'Cocina saludable con elegancia y fácil limpieza.',
          description: 'Juego de 6 piezas de aluminio prensado con revestimiento cerámico libre de PTFE/PFOA y mangos ergonómicos en tono oro rosa suave.',
          stock: 8,
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1584990347449-33e4c4c2357a?w=800&q=80']
        },
        {
          name: 'Cojín Terciopelo Bordado con Hilo Dorado Luxury',
          slug: 'cojin-terciopelo-bordado-dorado',
          sku: 'HOG-COJ-003',
          price: 12500,
          compareAtPrice: 15000,
          shortDescription: 'Detalle refinado para tu sofá o cama.',
          description: 'Cojín de 45x45 cm confeccionado en terciopelo suave noche profunda con motivos geométricos bordados en hilo dorado metálico. Incluye relleno hipoalergénico.',
          stock: 20,
          isFeatured: false,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80']
        },
        {
          name: 'Vela Aromática en Recipiente Cerámica Esmaltada',
          slug: 'vela-aromatica-ceramica-esmeralda',
          sku: 'HOG-VEL-004',
          price: 9500,
          shortDescription: 'Cera de soya 100% natural de larga duración.',
          description: 'Vela artesanal con mecha de madera crujiente y notas de sándalo, jazmín y ámbar cálido. Más de 50 horas de combustión limpia.',
          stock: 25,
          isFeatured: true,
          images: ['https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80']
        },
        {
          name: 'Organizador Giratorio 360° Dorado para Tocador',
          slug: 'organizador-giratorio-360-dorado',
          sku: 'HOG-ORG-005',
          price: 14500,
          shortDescription: 'Ten tus perfumes y cosméticos ordenados con estilo.',
          description: 'Bandeja giratoria con detalles dorados y acrílico resistente de alta transparencia.',
          stock: 12,
          images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80']
        },
        {
          name: 'Set de Toallas Algodón Egipcio Borde Jacquard (4 Pzas)',
          slug: 'set-toallas-algodon-egipcio',
          sku: 'HOG-TOA-006',
          price: 24000,
          compareAtPrice: 28500,
          shortDescription: 'Suavidad insuperable y máxima absorción.',
          description: 'Toallas 600 GSM de tacto afelpado en tonos lavanda y blanco perla.',
          stock: 10,
          images: ['https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&q=80']
        }
      ]
    },
    {
      name: 'Moda',
      slug: 'moda',
      description: 'Estilos que te hacen brillar cada día.',
      icon: 'Shirt',
      order: 2,
      isAdult: false,
      subcategories: ['Vestidos', 'Blusas', 'Pantalones', 'Calzado', 'Ropa deportiva'],
      products: [
        {
          name: 'Vestido Midi Seda Elegance con Cinturón Dorado',
          slug: 'vestido-midi-seda-elegance',
          sku: 'MOD-VES-001',
          price: 28500,
          compareAtPrice: 34000,
          shortDescription: 'Caída impecable para tus eventos especiales.',
          description: 'Vestido midi de satén suave con escote cruzado, falda fluida y cinturón desmontable con hebilla dorada.',
          stock: 15,
          isFeatured: true,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'],
          variants: [{ name: 'Talla', options: JSON.stringify(['S', 'M', 'L', 'XL']) }]
        },
        {
          name: 'Blusa Chifón Cuello Halter con Detalle Joya',
          slug: 'blusa-chifon-cuello-halter',
          sku: 'MOD-BLU-002',
          price: 16500,
          shortDescription: 'Versátil, fresca y distinguida.',
          description: 'Blusa de chifón con forro interior, cuello cerrado con broche joya dorado y espalda descubierta sutil.',
          stock: 18,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80']
        },
        {
          name: 'Pantalón Palazzo Tiro Alto Pretina Ancha',
          slug: 'pantalon-palazzo-tiro-alto',
          sku: 'MOD-PAN-003',
          price: 21000,
          shortDescription: 'Comodidad estilizada con bolsillos laterales.',
          description: 'Pantalón palazzo en tela crepé de excelente caída que estiliza la figura.',
          stock: 12,
          images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80']
        },
        {
          name: 'Sandalias Tacón Bloque Dorado Metálico',
          slug: 'sandalias-tacon-bloque-dorado',
          sku: 'MOD-CAL-004',
          price: 27500,
          compareAtPrice: 32000,
          shortDescription: 'El toque de brillo para cualquier atuendo.',
          description: 'Sandalias de tacón medio 6cm súper cómodas con plantilla acolchada.',
          stock: 9,
          isFeatured: true,
          images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80']
        },
        {
          name: 'Conjunto Deportivo Seamless Esculpidor (Top + Legging)',
          slug: 'conjunto-deportivo-seamless-esculpidor',
          sku: 'MOD-DEP-005',
          price: 24500,
          shortDescription: 'Ajuste perfecto sin costuras para entrenar con confianza.',
          description: 'Tejido compresivo de secado rápido que moldea sin transparentar.',
          stock: 16,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80']
        },
        {
          name: 'Enterizo Asimétrico Noche de Gala',
          slug: 'enterizo-asimetrico-noche-gala',
          sku: 'MOD-ENT-006',
          price: 32000,
          compareAtPrice: 38000,
          shortDescription: 'Impactante y sofisticado con corte sastre.',
          description: 'Enterizo en tono púrpura profundo con una manga acampanada y detalle drapeado en la cintura.',
          stock: 7,
          images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80']
        }
      ]
    },
    {
      name: 'Accesorios',
      slug: 'accesorios',
      description: 'Los detalles que complementan tu esencia.',
      icon: 'Watch',
      order: 3,
      isAdult: false,
      subcategories: ['Bolsos', 'Carteras', 'Lentes', 'Joyería', 'Cinturones'],
      products: [
        {
          name: 'Bolso Tote Cuero Vegano Acolchado con Cadena Dorada',
          slug: 'bolso-tote-cuero-vegano-dorado',
          sku: 'ACC-BOL-001',
          price: 26500,
          compareAtPrice: 31000,
          shortDescription: 'Espacioso, elegante y perfecto para el día a día.',
          description: 'Bolso de estructura armada con cierre principal, compartimentos internos para celular y correa ajustable.',
          stock: 11,
          isFeatured: true,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80']
        },
        {
          name: 'Collar Cadena de Eslabones Gruesos Baño Oro 18K',
          slug: 'collar-cadena-eslabones-oro-18k',
          sku: 'ACC-JOY-002',
          price: 15500,
          shortDescription: 'Hipoalergénico y resistente con acabado brillante.',
          description: 'Gargantilla estilo chunky chain con baño de oro de 18K sobre acero inoxidable grado quirúrgico.',
          stock: 22,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80']
        },
        {
          name: 'Lentes de Sol Oversized Polarizados Degradé',
          slug: 'lentes-sol-oversized-polarizados',
          sku: 'ACC-LEN-003',
          price: 13500,
          shortDescription: 'Protección UV400 completa con marco liviano.',
          description: 'Montura elegante con sutiles detalles dorados en las esquinas y estuche rígido incluido.',
          stock: 17,
          images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80']
        },
        {
          name: 'Billetera Compacta con Bloqueo RFID y Broche Dorado',
          slug: 'billetera-compacta-rfid-dorado',
          sku: 'ACC-BIL-004',
          price: 11000,
          shortDescription: 'Protege tus tarjetas con máxima organización.',
          description: 'Múltiples ranuras para tarjetas, monedero con zíper y compartimento para billetes.',
          stock: 25,
          images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80']
        },
        {
          name: 'Juego de Aretes Huggies con Circonias Cúbicas',
          slug: 'aretes-huggies-circonias-oro',
          sku: 'ACC-ARE-005',
          price: 9800,
          shortDescription: 'Brillo delicado para usar todos los días.',
          description: 'Set de 3 pares de aros pequeños bañados en oro para oreja completa.',
          stock: 30,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80']
        },
        {
          name: 'Cinturón Fino con Hebilla Escultural Doble Círculo',
          slug: 'cinturon-fino-hebilla-escultural',
          sku: 'ACC-CIN-006',
          price: 8500,
          shortDescription: 'Acentúa tu cintura en vestidos y pantalones.',
          description: 'Cinturón en tono negro medianoche y hebilla metálica pulida.',
          stock: 20,
          images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80']
        }
      ]
    },
    {
      name: 'Belleza',
      slug: 'belleza',
      description: 'Cuídate, quiérete y resalta tu belleza natural.',
      icon: 'Sparkles',
      order: 4,
      isAdult: false,
      subcategories: ['Rostro', 'Cabello', 'Cuerpo', 'Herramientas'],
      products: [
        {
          name: 'Sérum Facial Ácido Hialurónico + Vitamina C Glow',
          slug: 'serum-acido-hialuronico-vitamina-c',
          sku: 'BEL-SER-001',
          price: 16800,
          compareAtPrice: 19500,
          shortDescription: 'Hidratación profunda y luminosidad instantánea.',
          description: 'Fórmula no grasa enriquecida con antioxidantes que atenúa líneas finas y unifica el tono de la piel.',
          stock: 24,
          isFeatured: true,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80']
        },
        {
          name: 'Rodillo Facial de Cuarzo Rosa y Piedra Gua Sha',
          slug: 'rodillo-cuarzo-rosa-gua-sha',
          sku: 'BEL-ROD-002',
          price: 12000,
          shortDescription: 'Masaje drenante y tensor para tu rutina nocturna.',
          description: 'Piedra de cuarzo 100% auténtica pulida a mano en estuche magnético de lujo.',
          stock: 19,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80']
        },
        {
          name: 'Mascarilla Reparadora Capilar de Argán y Keratina (500g)',
          slug: 'mascarilla-capilar-argan-keratina',
          sku: 'BEL-MAS-003',
          price: 14500,
          shortDescription: 'Nutrición intensiva para cabellos secos o tinturados.',
          description: 'Restaura el brillo, sella las puntas abiertas y reduce el frizz desde la primera aplicación.',
          stock: 15,
          images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80']
        },
        {
          name: 'Cepillo Secador y Voluminizador de Aire Caliente',
          slug: 'cepillo-secador-voluminizador-dorado',
          sku: 'BEL-CEP-004',
          price: 26000,
          compareAtPrice: 31000,
          shortDescription: 'Acabado de salón en minutos con tecnología iónica.',
          description: 'Cerdas desenredantes y revestimiento cerámico que protege el cabello del calor excesivo.',
          stock: 8,
          isFeatured: true,
          images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80']
        },
        {
          name: 'Crema Hidratante Reafirmante con Colágeno y Karité',
          slug: 'crema-reafirmante-colageno-karite',
          sku: 'BEL-CRE-005',
          price: 13800,
          shortDescription: 'Piel aterciopelada y elástica durante 48 horas.',
          description: 'Textura rica de rápida absorción con delicado aroma a flores blancas.',
          stock: 22,
          images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80']
        },
        {
          name: 'Aceite Seco Iluminador Corporal Shimmer Gold',
          slug: 'aceite-iluminador-corporal-shimmer',
          sku: 'BEL-ACE-006',
          price: 11500,
          shortDescription: 'Destellos dorados sutiles que realzan el bronceado.',
          description: 'Mezcla de aceites botánicos con microperlas doradas biodegradables.',
          stock: 18,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1608248597359-0091ff30b200?w=800&q=80']
        }
      ]
    },
    {
      name: 'Perfumes',
      slug: 'perfumes',
      description: 'Aromas que cuentan tu historia y dejan huella.',
      icon: 'Heart',
      order: 5,
      isAdult: false,
      subcategories: ['Mujer', 'Hombre', 'Unisex', 'Sets de regalo'],
      products: [
        {
          name: 'Eau de Parfum "Nuit Étoilée" Sweet Home Signature (100ml)',
          slug: 'perfume-nuit-etoilee-signature',
          sku: 'PER-SIG-001',
          price: 36000,
          compareAtPrice: 42000,
          shortDescription: 'Nuestra fragancia insignia: misterio, sensualidad y sofisticación.',
          description: 'Notas de salida de pera jugosa y pimienta rosa, corazón de jazmín nocturno y flor de azahar, con fondo envolvente de vainilla de Madagascar y madera de cedro.',
          stock: 12,
          isFeatured: true,
          isBestSeller: true,
          isNew: true,
          images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80']
        },
        {
          name: 'Eau de Parfum "Golden Aura" Mujer (85ml)',
          slug: 'perfume-golden-aura-mujer',
          sku: 'PER-MUJ-002',
          price: 29500,
          shortDescription: 'Cálido, radiante y adictivo con notas de ámbar y caramelo.',
          description: 'Frasco joya facetado con detalles en oro metálico. Fijación comprobada de más de 12 horas en piel.',
          stock: 15,
          isFeatured: true,
          images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80']
        },
        {
          name: 'Eau de Parfum "Bois Sauvage" Hombre (100ml)',
          slug: 'perfume-bois-sauvage-hombre',
          sku: 'PER-HOM-003',
          price: 32000,
          compareAtPrice: 37000,
          shortDescription: 'Amaderado aromático, magnético e imponente.',
          description: 'Notas frescas de bergamota de Calabria con vetiver terroso, cuero ahumado y pachulí noble.',
          stock: 10,
          images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80']
        },
        {
          name: 'Set de Perfumería Deluxe: Fragancia + Loción Corporal + Mini Travel',
          slug: 'set-perfumeria-deluxe-regalo',
          sku: 'PER-SET-004',
          price: 45000,
          compareAtPrice: 52000,
          shortDescription: 'El regalo perfecto presentado en caja rígida dorada.',
          description: 'Incluye perfume 100ml, crema perfumada 150ml y atomizador recargable para bolso.',
          stock: 7,
          isFeatured: true,
          isBestSeller: true,
          images: ['https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&q=80']
        },
        {
          name: 'Bruma Capilar & Corporal Perfumada "Vanilla Silk" (250ml)',
          slug: 'bruma-capilar-corporal-vanilla-silk',
          sku: 'PER-BRU-005',
          price: 11000,
          shortDescription: 'Aroma ligero y duradero que cuida tu cabello.',
          description: 'Con aloe vera y vitamina E. No reseca el cabello y aporta un perfume cautivador a cada paso.',
          stock: 25,
          images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80']
        },
        {
          name: 'Perfume Unisex "Santal Imperial" (100ml)',
          slug: 'perfume-unisex-santal-imperial',
          sku: 'PER-UNI-006',
          price: 34500,
          shortDescription: 'Elegancia neutral con sándalo cremoso e iris.',
          description: 'Una fragancia de nicho para quienes buscan distinción sin etiquetas.',
          stock: 9,
          images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80']
        }
      ]
    },
];
