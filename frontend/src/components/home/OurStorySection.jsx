import React from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export const OurStorySection = ({ storyData, onOpenFullStory, authUser }) => {
  const isAdmin = authUser && (authUser.role === 'ADMIN' || authUser.role === 'STAFF');
  const defaultStory = {
    badge: 'Donde cada detalle ilumina tu hogar y tu estilo',
    title: '¿Quiénes Somos?',
    subtitle: 'Tu tienda de confianza en Costa Rica',
    founderName: 'Fundadora & Directora Creativa',
    founderRole: 'Sweet Home & Boutique CR',
    founderPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop',
    storyParagraphs: [
      'Somos tu tienda de confianza, donde encontrarás productos seleccionados con amor para el hogar, la belleza, tu estilo y tu bienestar íntimo.',
      'Creemos que cada detalle cuenta y tiene el poder de transformar tu día a día. Nuestra misión es brindar productos de calidad que hagan tu vida más fácil, bonita y especial.',
      'Inspiramos tu hogar, realzamos tu belleza y cuidamos tu bienestar con envíos seguros y entregas confiables a todo Costa Rica. Tu hogar, tu estilo, tu esencia.'
    ],
    isProvisional: false
  };

  const data = storyData || defaultStory;

  return (
    <section
      id="nuestra-historia"
      className="w-full bg-gradient-to-b from-[#FDF2F5] via-[#FDF0F4] to-[#FCEAEF] text-[#1A0D26] py-20 sm:py-28 px-4 sm:px-8 relative overflow-hidden border-y border-[#F3D5E2]"
    >
      {/* Resplandor cálido de fondo */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gold-DEFAULT/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* COLUMNA 1: Marco de Arco con Detalle Dorado y Sombra Suave */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative p-2 rounded-t-[140px] rounded-b-[36px] bg-gradient-to-b from-gold-light via-gold-DEFAULT to-gold-dark shadow-2xl">
            <div className="w-64 sm:w-72 md:w-80 h-88 sm:h-96 rounded-t-[130px] rounded-b-[28px] overflow-hidden bg-night-950 relative shadow-inner">
              <img
                src={data.founderPhoto}
                alt={data.founderName}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Corazón dorado en la esquina inferior */}
            <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-[#FFF5F8] border-2 border-gold-bright flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-gold-dark fill-gold-DEFAULT" />
            </div>

            {/* Badge de Fundadora */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFF5F8] border border-gold-DEFAULT/50 text-[10px] text-gold-dark font-serif font-bold uppercase tracking-widest shadow-md">
              ✨ Fundadora
            </div>
          </div>

          {isAdmin && data.isProvisional && (
            <span className="text-[11px] text-[#8C7E9C] mt-4 italic text-center max-w-xs block">
              (Texto y fotografía de muestra • 100% editables desde el panel administrativo)
            </span>
          )}
        </div>

        {/* COLUMNA 2: Relato Editorial, Script Dorado y Tipografía Serif */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF5F8] border border-gold-DEFAULT/40 text-gold-dark text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>{data.badge}</span>
          </div>

          <div>
            <h2 className="font-script text-5xl sm:text-6xl lg:text-7xl text-gold-dark leading-none">
              {data.title}
            </h2>
            <p className="font-serif text-xl sm:text-2xl text-[#1A0D26] mt-2 font-bold tracking-tight">
              {data.subtitle}
            </p>
          </div>

          <div className="space-y-4 font-serif text-base sm:text-lg text-[#4A3B58] leading-relaxed">
            {data.storyParagraphs?.map((paragraph, idx) => (
              <p key={idx}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="pt-6 border-t border-[#E6D8E3] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-0.5">
              <span className="font-script text-3xl sm:text-4xl text-gold-dark block">
                {data.founderName}
              </span>
              <span className="text-xs text-[#8C7E9C] font-sans font-medium tracking-wider uppercase">
                {data.founderRole}
              </span>
            </div>

            <Button
              variant="primary"
              size="md"
              iconRight={ArrowRight}
              onClick={onOpenFullStory}
            >
              Conoce Más de Nuestra Historia
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
