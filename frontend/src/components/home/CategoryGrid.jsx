import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Home,
  Shirt,
  Watch,
  Heart,
  Smile,
  ShieldCheck,
  Lock,
  Gift,
  Activity
} from 'lucide-react';
import { useAgeGateStore } from '../../store/ageGateStore';

// Fotografías reales de alta resolución y lujo para las 10 categorías
const categoryPhotos = {
  hogar:
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80&auto=format&fit=crop',
  moda: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&auto=format&fit=crop',
  accesorios:
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop',
  belleza:
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&auto=format&fit=crop',
  perfumes:
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1000&q=80&auto=format&fit=crop',
  maquillaje:
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80&auto=format&fit=crop',
  'cuidado-personal':
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80&auto=format&fit=crop',
  'bienestar-intimo':
    'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=800&q=80&auto=format&fit=crop',
  'novedades-regalos':
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80&auto=format&fit=crop',
  'omnilife-y-mas':
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop'
};

export const CategoryGrid = ({ categories = [], onSelectCategory }) => {
  const { isAdultVerified, promptAgeGate } = useAgeGateStore();

  const getLinearIcon = (slug) => {
    const iconClass = 'w-4 h-4 text-gold-bright';
    switch (slug) {
      case 'hogar':
        return <Home className={iconClass} />;
      case 'moda':
        return <Shirt className={iconClass} />;
      case 'accesorios':
        return <Watch className={iconClass} />;
      case 'belleza':
        return <Sparkles className={iconClass} />;
      case 'perfumes':
        return <Heart className={iconClass} />;
      case 'maquillaje':
        return <Smile className={iconClass} />;
      case 'cuidado-personal':
        return <ShieldCheck className={iconClass} />;
      case 'bienestar-intimo':
        return <Lock className={iconClass} />;
      case 'novedades-regalos':
        return <Gift className={iconClass} />;
      case 'omnilife-y-mas':
        return <Activity className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const handleCategoryClick = (e, cat) => {
    e.preventDefault();
    if (cat.isAdult && !isAdultVerified) {
      promptAgeGate(cat.slug);
      return;
    }
    if (onSelectCategory) {
      onSelectCategory(cat.slug);
    }
  };

  // Clases de tamaño y proporciones Bento asimétricas según el slug o índice
  const getBentoClasses = (slug, idx) => {
    switch (slug) {
      case 'hogar':
        // Hero Card: Doble ancho y doble alto en escritorio
        return 'md:col-span-2 md:row-span-2 min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]';
      case 'perfumes':
        // Segunda Card Destacada: Doble ancho
        return 'md:col-span-2 min-h-[220px] sm:min-h-[260px]';
      case 'moda':
        return 'md:col-span-1 md:row-span-2 min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]';
      case 'novedades-regalos':
        return 'md:col-span-2 min-h-[200px] sm:min-h-[240px]';
      default:
        // Celdas estándar del bento
        return 'col-span-1 min-h-[200px] sm:min-h-[220px]';
    }
  };

  return (
    <section
      id="catalogo"
      className="w-full bg-[#FBF6F0] text-[#1A0D26] py-16 sm:py-24 px-4 sm:px-8 border-y border-[#EEDDE8]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Encabezado Editorial Refinado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E6D8E3] pb-6">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-galaxy-light tracking-widest uppercase block">
              Boutique & Colecciones
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A0D26] tracking-tight">
              Explora Nuestro{' '}
              <span className="italic font-normal text-galaxy-DEFAULT">Universo</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#685B78] max-w-xl leading-relaxed">
              Diez mundos seleccionados con esmero para inspirar tu día a día, consentir tus
              sentidos y transformar cada rincón de tu hogar en Costa Rica.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-[#685B78] bg-white/90 px-4 py-2 rounded-full border border-[#EBDCE6] shadow-sm">
              ✨ 10 Colecciones Exclusivas
            </span>
          </div>
        </div>

        {/* COMPOSICIÓN BENTO ASIMÉTRICA CON FOTOGRAFÍA REAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr">
          {categories.map((cat, idx) => {
            const photoUrl =
              cat.image ||
              categoryPhotos[cat.slug] ||
              'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80';
            const bentoSpan = getBentoClasses(cat.slug, idx);

            return (
              <a
                key={cat.id || cat.slug}
                href={`#${cat.slug}`}
                onClick={(e) => handleCategoryClick(e, cat)}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-[#EEDDE8] hover:border-gold-DEFAULT/60 flex flex-col justify-between p-5 sm:p-6 ${bentoSpan}`}
              >
                {/* Fotografía de Fondo con Zoom en Hover */}
                <img
                  src={photoUrl}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />

                {/* Velo Direccional de Contraste Suave (Permite apreciar la foto y leer el texto a la perfección) */}
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/90 via-night-950/35 to-transparent transition-opacity duration-300 group-hover:from-night-950/95" />

                {/* Insignia Superior con Ícono Lineal */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-night-950/60 backdrop-blur-md border border-gold-DEFAULT/30 flex items-center justify-center shadow-md">
                    {getLinearIcon(cat.slug)}
                  </div>

                  {cat.isAdult && (
                    <span className="px-2.5 py-0.5 rounded-full bg-night-950/80 backdrop-blur-md text-gold-bright text-[10px] font-bold border border-gold-DEFAULT/40 shadow-sm">
                      🔞 +18
                    </span>
                  )}
                </div>

                {/* Información de la Categoría: Nombre Serif y Descripción que aparece en Hover */}
                <div className="relative z-10 space-y-1.5 pt-12">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-gold-bright transition-colors drop-shadow-sm">
                    {cat.name}
                  </h3>

                  {/* Descripción corta de marca */}
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 max-h-0 sm:max-h-0 opacity-0 sm:opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-400 ease-in-out">
                    {cat.description ||
                      'Piezas y detalles elegidos con el estándar de elegancia de Sweet Home.'}
                  </p>

                  <div className="pt-1 flex items-center gap-1.5 text-xs text-gold-bright font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                    <span>Explorar colección</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
