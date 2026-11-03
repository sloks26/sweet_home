import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import Badge from '../../ui/Badge';

export const ProductGallery = ({
  images = [],
  productName,
  hasDiscount,
  discountPercent,
  isNew,
  isAdult
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);

  const displayImages = images.length > 0
    ? images
    : [{ url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', alt: productName }];

  const currentImage = displayImages[selectedImageIndex] || displayImages[0];

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div className="lg:col-span-6 space-y-4">
      {/* Contenedor de la Imagen Principal con Lupa */}
      <div
        ref={imageContainerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-square w-full rounded-2xl overflow-hidden bg-night-950 border border-gold-DEFAULT/25 cursor-crosshair group shadow-galaxy-card"
      >
        {/* Fondo ambiental sutil */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 blur-lg scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${currentImage.url})` }}
        />

        <img
          src={currentImage.url}
          alt={currentImage.alt || productName}
          className="relative z-10 w-full h-full object-contain p-2 transition-transform duration-300"
        />

        {/* Lente de Zoom Ampliado en tiempo real */}
        {isZooming && (
          <div
            className="absolute inset-0 pointer-events-none hidden md:block"
            style={{
              backgroundImage: `url(${currentImage.url})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: '250%',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}

        {/* Badges Flotantes sobre la imagen */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {hasDiscount && (
            <Badge variant="discount" size="sm">
              -{discountPercent}% OFF
            </Badge>
          )}
          {isNew && <Badge variant="gold" size="sm">✨ Nuevo</Badge>}
          {isAdult && <Badge variant="adult" size="sm">🔞 +18 Discreto</Badge>}
        </div>

        {/* Indicador de ayuda para zoom en móvil/escritorio */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-night-950/80 backdrop-blur-sm border border-gold-DEFAULT/20 text-[10px] text-text-muted flex items-center gap-1 pointer-events-none">
          <Sparkles className="w-3 h-3 text-gold-bright" />
          <span className="hidden md:inline">Pasa el cursor para hacer zoom</span>
          <span className="md:hidden">Toca para explorar</span>
        </div>
      </div>

      {/* Tira de Miniaturas */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border transition-all ${
                selectedImageIndex === idx
                  ? 'border-gold-bright ring-2 ring-gold-DEFAULT/50 shadow-gold-sm scale-105'
                  : 'border-night-700/80 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `Vista ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
