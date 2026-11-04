import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export const HeroCarousel = ({ banners = [], isMenuOpen = false, onSelectCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showMobileArrows, setShowMobileArrows] = useState(true);

  // Soporte de Swipe táctil en móvil
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const arrowTimerRef = useRef(null);

  useEffect(() => {
    // Mostrar flechas brevemente al inicio (3 segundos) para enseñar al usuario que se desliza, y luego desvanecerlas
    arrowTimerRef.current = setTimeout(() => {
      setShowMobileArrows(false);
    }, 3000);
    return () => {
      if (arrowTimerRef.current) clearTimeout(arrowTimerRef.current);
    };
  }, []);

  // Banners por defecto de alta resolución y lujo si la API está cargando o vacía
  const slides =
    banners.length > 0
      ? banners
      : [
          {
            id: 'default-1',
            title: 'Donde cada detalle ilumina tu hogar y tu estilo',
            subtitle:
              'Descubre piezas exclusivas, aromas cautivadores y moda que realza tu esencia con envíos a todo Costa Rica.',
            badge: 'Nueva Colección 2026',
            ctaText: 'Ver Colección Hogar',
            ctaLink: '#hogar',
            desktopImage:
              'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80&auto=format&fit=crop',
            mobileImage:
              'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=768&q=80&auto=format&fit=crop'
          },
          {
            id: 'default-2',
            title: 'Fragancias de autor que dejan una huella inolvidable',
            subtitle:
              'Perfumes selectos de lujo, difusores y esencias botánicas para crear momentos memorables.',
            badge: 'Exclusivo en Sweet Home',
            ctaText: 'Explorar Perfumes',
            ctaLink: '#perfumes',
            desktopImage:
              'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1920&q=80&auto=format&fit=crop',
            mobileImage:
              'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=768&q=80&auto=format&fit=crop'
          },
          {
            id: 'default-3',
            title: 'Regalos con amor para personas especiales',
            subtitle:
              'Sets armados a mano en cajas rígidas perfumadas, con lazos de satín y tarjetas con dedicatoria.',
            badge: 'Detalles Únicos',
            ctaText: 'Ver Sets de Regalo',
            ctaLink: '#novedades-regalos',
            desktopImage:
              'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&q=80&auto=format&fit=crop',
            mobileImage:
              'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=768&q=80&auto=format&fit=crop'
          }
        ];

  // Autoplay cada 7 segundos (se pausa al interactuar, pasar el ratón, tocar la pantalla o tener el mega menú abierto)
  useEffect(() => {
    if (isPaused || isMenuOpen || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, isMenuOpen, slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Manejo de Gestos Swipe en Móvil
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;

    // Mostrar brevemente al tocar y volver a desvanecer tras 2s para mantener pantalla limpia
    setShowMobileArrows(true);
    if (arrowTimerRef.current) clearTimeout(arrowTimerRef.current);
    arrowTimerRef.current = setTimeout(() => {
      setShowMobileArrows(false);
    }, 2000);
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    const threshold = 45; // Mínimo de píxeles para reconocer swipe

    if (diff > threshold) {
      nextSlide(); // Swipe izquierda -> siguiente slide
    } else if (diff < -threshold) {
      prevSlide(); // Swipe derecha -> slide anterior
    }

    // Reactivar autoplay tras interacción
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <section
      className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden select-none bg-night-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Galería Hero Principal"
    >
      {slides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        const isFirst = idx === 0;

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Imagen del Slide con srcset y optimización de carga */}
            <picture className="absolute inset-0 w-full h-full block">
              <source
                media="(max-width: 640px)"
                srcSet={
                  slide.mobileImage ||
                  `${slide.desktopImage.split('?')[0]}?w=768&q=80&auto=format&fit=crop`
                }
              />
              <img
                src={slide.desktopImage}
                alt={slide.title}
                width={1920}
                height={680}
                loading={isFirst ? 'eager' : 'lazy'}
                fetchPriority={isFirst ? 'high' : 'auto'}
                decoding={isFirst ? 'sync' : 'async'}
                className="w-full h-full object-cover object-center"
              />
            </picture>

            {/* Degradado cinematográfico sobre la foto para mantenerla nítida y garantizar contraste AA */}
            <div className="absolute inset-0 bg-gradient-to-r from-night-950/90 via-night-950/60 to-night-950/20 sm:to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-black/20 pointer-events-none" />

            {/* Contenido de la Diapositiva */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-12 flex flex-col justify-center">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                {slide.badge && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-night-950/75 border border-gold-DEFAULT/40 text-gold-light text-xs font-semibold shadow-md backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-gold-bright" />
                    <span>{slide.badge}</span>
                  </div>
                )}

                {isFirst ? (
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {slide.title.includes('ilumina') ? (
                      <>
                        Donde cada detalle <br />
                        <span className="font-script text-gold-gradient text-5xl sm:text-7xl lg:text-8xl font-normal block sm:inline drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)]">
                          ilumina tu hogar
                        </span>{' '}
                        y tu estilo
                      </>
                    ) : (
                      slide.title
                    )}
                    <span className="sr-only">
                      {' '}
                      - Sweet Home & Boutique CR | Tienda en Línea Costa Rica
                    </span>
                  </h1>
                ) : (
                  <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {slide.title}
                  </h2>
                )}

                {slide.subtitle && (
                  <p className="font-sans text-xs sm:text-base text-white/95 font-medium leading-relaxed max-w-lg drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                    {slide.subtitle}
                  </p>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    iconRight={ArrowRight}
                    onClick={() => {
                      const link = slide.ctaLink || '#catalogo';
                      if (link.startsWith('#')) {
                        const el = document.querySelector(link);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        const slug = link.replace('/categoria/', '').replace('/', '');
                        if (onSelectCategory && slug) {
                          onSelectCategory(slug);
                        } else {
                          const el = document.querySelector('#catalogo');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                  >
                    {slide.ctaText || 'Ver Colección'}
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      const el = document.querySelector('#nuestra-historia');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Nuestra Historia
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Flechas de Navegación: Siempre visibles y claras en PC; en móvil aparecen 3s para educar y desaparecen */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-night-950/80 border border-gold-DEFAULT/50 text-gold-light hover:text-gold-bright hover:border-gold-bright hover:bg-night-900 transition-all duration-300 flex items-center justify-center group/btn shadow-xl cursor-pointer md:opacity-95 md:scale-100 md:pointer-events-auto ${
              showMobileArrows
                ? 'opacity-90 scale-100 pointer-events-auto'
                : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-night-950/80 border border-gold-DEFAULT/50 text-gold-light hover:text-gold-bright hover:border-gold-bright hover:bg-night-900 transition-all duration-300 flex items-center justify-center group/btn shadow-xl cursor-pointer md:opacity-95 md:scale-100 md:pointer-events-auto ${
              showMobileArrows
                ? 'opacity-90 scale-100 pointer-events-auto'
                : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          {/* Indicadores / Paginadores Dorados Minimalistas */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-gold-metallic shadow-gold-sm'
                    : 'w-2 bg-night-600/70 hover:bg-gold-DEFAULT/40'
                }`}
                aria-label={`Ir a la diapositiva ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;
