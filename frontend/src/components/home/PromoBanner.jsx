import React from 'react';
import { Gift, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export const PromoBanner = ({ promoData = null }) => {
  const defaultPromo = {
    badge: 'Detalles que Enamoran',
    title: 'Sets de Regalo con Empaque Exclusivo y Dedicatoria',
    subtitle: 'Cada paquete es una experiencia sensorial única: cajas rígidas perfumadas con nuestra fragancia insignia, lazos de satín y tarjetas caligrafiadas con tu mensaje personalizado para esa persona especial.',
    ctaText: 'Ver Sets de Regalo',
    ctaLink: '#novedades-regalos',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80&auto=format&fit=crop'
  };

  const data = promoData || defaultPromo;

  return (
    <section className="w-full bg-[#12071F] py-16 px-4 sm:px-8 relative overflow-hidden select-none">
      {/* Resplandor nebulosa dorado sutil de fondo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-DEFAULT/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-night-800 via-night-900 to-night-950 border border-gold-DEFAULT/25 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
          {/* Lado Izquierdo: Copy Editorial */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 text-gold-light text-xs font-semibold">
              <Gift className="w-3.5 h-3.5 text-gold-bright" />
              <span>{data.badge}</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-[1.15] tracking-tight">
              Sets de Regalo con <br />
              <span className="font-script text-gold-gradient text-4xl sm:text-6xl font-normal block sm:inline">
                Empaque Exclusivo
              </span>{' '}
              y Dedicatoria
            </h3>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl">
              {data.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                iconRight={ArrowRight}
                onClick={() => {
                  const el = document.querySelector(data.ctaLink || '#catalogo');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {data.ctaText}
              </Button>

              <span className="text-xs text-gold-light font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-bright" />
                <span>Envío GRATIS en compras mayores a ₡35,000</span>
              </span>
            </div>
          </div>

          {/* Lado Derecho: Fotografía Editorial a Sangre */}
          <div className="lg:col-span-5 relative aspect-[16/11] rounded-2xl overflow-hidden shadow-2xl border border-gold-DEFAULT/25 group">
            <img
              src={data.image}
              alt="Sets de Regalo Sweet Home"
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
