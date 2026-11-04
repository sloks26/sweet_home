import React, { useState } from 'react';
import { Instagram, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export const InstagramFeedSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const instaPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80',
      alt: 'Hogar cálido'
    },
    {
      url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80',
      alt: 'Perfumes exclusivos'
    },
    {
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80',
      alt: 'Bolsos y moda'
    },
    {
      url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80',
      alt: 'Velas y aromaterapia'
    },
    {
      url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80',
      alt: 'Empaques de regalo'
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-12">
      {/* Feed Instagram */}
      <div className="space-y-6 text-center">
        <div>
          <span className="text-xs font-semibold text-gold-bright uppercase tracking-wider block mb-1">
            Comunidad Sweet Home
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary">
            Síguenos en Instagram{' '}
            <span className="text-gold-gradient font-script text-4xl sm:text-5xl">
              @sweethomeboutiquecr
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {instaPhotos.map((photo, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-night-950 border border-gold-DEFAULT/20"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-night-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-gold-light">
                <Instagram className="w-8 h-8 drop-shadow-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caja de Newsletter */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-night-900 via-night-800 to-night-900 border border-gold-DEFAULT/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left max-w-lg">
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-bright font-semibold">
            <Mail className="w-4 h-4" />
            <span>Club Exclusivo Sweet Home</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Recibe 10% de descuento en tu primer pedido
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary">
            Ingresa tu correo y usa el código{' '}
            <strong className="text-gold-light">BIENVENIDA10</strong> al finalizar tu compra por
            SINPE Móvil o Transferencia.
          </p>
        </div>

        {subscribed ? (
          <div className="p-4 rounded-2xl bg-night-950/80 border border-status-success/40 text-status-success flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <span>¡Gracias por suscribirte! Ya puedes usar el cupón BIENVENIDA10.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row w-full md:w-auto gap-2.5"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Escribe tu correo electrónico..."
              required
              className="px-4 py-3 rounded-xl bg-night-950 border border-gold-DEFAULT/30 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-gold-DEFAULT focus:ring-2 focus:ring-gold-DEFAULT/25 min-w-[260px]"
            />
            <Button type="submit" variant="primary" size="md" iconRight={ArrowRight}>
              Suscribirme
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default InstagramFeedSection;
