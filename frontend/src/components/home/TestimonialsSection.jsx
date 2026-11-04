import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Sparkles, Quote } from 'lucide-react';

export const TestimonialsSection = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const defaultTestimonials = [
    {
      id: 't-1',
      clientName: 'Valeria M.',
      clientLocation: 'Curridabat, San José',
      clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
      rating: 5,
      comment:
        '¡Quedé enamorada del empaque! El difusor y las esencias llegaron al día siguiente por Correos de Costa Rica, todo envuelto con un aroma delicioso y una notita hermosa. 100% recomendados.'
    },
    {
      id: 't-2',
      clientName: 'María José R.',
      clientLocation: 'San Joaquín de Flores, Heredia',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      rating: 5,
      comment:
        'Compré el perfume Nuit Étoilée y un bolso para un regalo de cumpleaños. La atención por WhatsApp fue super personalizada y el pago por SINPE muy cómodo. La calidad superó mis expectativas.'
    },
    {
      id: 't-3',
      clientName: 'Fernanda C.',
      clientLocation: 'Cartago Centro',
      clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
      rating: 5,
      comment:
        'Excelente variedad para el hogar. Las toallas y los cojines le dieron un toque super elegante a mi sala. Se nota el amor y el buen gusto en cada detalle.'
    },
    {
      id: 't-4',
      clientName: 'Daniela S.',
      clientLocation: 'Escazú, San José',
      clientAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80',
      rating: 5,
      comment:
        'El vestido y los accesorios me llegaron perfectos en talla y tela. Además me encanta que sea un emprendimiento tico con un estándar de boutique tan alto.'
    }
  ];

  const list = testimonials.length > 0 ? testimonials : defaultTestimonials;

  // Autoplay suave cada 6 segundos
  useEffect(() => {
    if (isPaused || list.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, list.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const currentItem = list[currentIndex] || list[0];

  return (
    <section
      className="w-full bg-[#FDF7FA] text-[#1A0D26] py-20 px-4 sm:px-8 border-b border-[#EEDDE8] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Encabezado */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-galaxy-light uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>Experiencias Sweet Home</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A0D26] tracking-tight">
            Lo que dicen{' '}
            <span className="italic font-normal text-galaxy-DEFAULT">nuestras clientas</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#685B78]">
            Familias en todo Costa Rica que confían en nosotros para iluminar sus momentos
            especiales.
          </p>
        </div>

        {/* Carrusel Simple de Testimonios */}
        <div className="relative max-w-3xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EBDCE6] shadow-sm flex flex-col items-center text-center space-y-6 relative overflow-hidden transition-all duration-500">
            {/* Cita Decorativa Fina */}
            <Quote className="w-10 h-10 text-gold-DEFAULT/30" />

            {/* Estrellas Doradas */}
            <div className="flex items-center gap-1.5 text-gold-dark">
              {[...Array(currentItem.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            {/* Testimonio */}
            <p className="font-serif text-base sm:text-xl text-[#3A2C4B] italic leading-relaxed max-w-2xl">
              "{currentItem.comment}"
            </p>

            {/* Autora */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-[#F2E8F0] w-full justify-center">
              <img
                src={
                  currentItem.clientAvatar ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80'
                }
                alt={currentItem.clientName}
                className="w-12 h-12 rounded-full object-cover border-2 border-gold-DEFAULT/40 shadow-sm"
                loading="lazy"
              />
              <div className="text-left">
                <h3 className="font-serif text-base font-bold text-[#1A0D26]">
                  {currentItem.clientName}
                </h3>
                <span className="text-xs text-galaxy-light font-medium block">
                  {currentItem.clientLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Flechas de Navegación del Carrusel */}
          {list.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#EBDCE6] text-[#1A0D26] hover:text-galaxy-DEFAULT hover:border-gold-DEFAULT shadow-md flex items-center justify-center transition-all cursor-pointer"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#EBDCE6] text-[#1A0D26] hover:text-galaxy-DEFAULT hover:border-gold-DEFAULT shadow-md flex items-center justify-center transition-all cursor-pointer"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicadores Minimalistas de Puntos */}
              <div className="flex items-center justify-center gap-2 pt-6">
                {list.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? 'w-6 bg-gold-dark'
                        : 'w-2 bg-[#D9C8D6] hover:bg-gold-DEFAULT/50'
                    }`}
                    aria-label={`Ir al testimonio ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
