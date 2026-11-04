import React from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import ResponsiveImage from '../ui/ResponsiveImage';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export const ProductCard = ({ product, onQuickView, onClick }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(product.id);
  const coverImage =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80';

  // Descuento porcentual si aplica
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleCardClick = (e) => {
    if (onClick && !e.target.closest('button')) {
      onClick(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group editorial-card overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer border border-[#EEDDE8] hover:border-gold-DEFAULT/50 bg-white"
    >
      {/* Contenedor Fotográfico sin recortes: Producto completo siempre visible */}
      <div className="relative aspect-square overflow-hidden bg-[#FBF8FA] flex items-center justify-center p-3">
        {/* Fondo ambiental sutil que armoniza con los colores del producto */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 blur-lg scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${coverImage})` }}
        />

        <ResponsiveImage
          src={coverImage}
          alt={product.name}
          aspectRatio="1/1"
          objectFit="contain"
          width={480}
          height={480}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          containerClassName="w-full h-full flex items-center justify-center relative z-10"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges Discretos Superiores */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-galaxy-DEFAULT text-[10px] font-bold tracking-wider uppercase shadow-sm border border-galaxy-DEFAULT/20">
              Nuevo
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-full bg-nebula-magenta text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isAdult && (
            <span className="px-2 py-0.5 rounded-full bg-night-950/80 text-gold-light text-[10px] font-semibold tracking-wider">
              🔞 +18
            </span>
          )}
        </div>

        {/* Botón Favoritos Flotante */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              isFavorited
                ? 'bg-nebula-magenta text-white shadow-nebula-sm scale-105'
                : 'bg-white/85 text-[#685B78] hover:text-nebula-magenta hover:bg-white'
            }`}
            aria-label={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Vista Rápida en Hover */}
        {onQuickView && (
          <div className="absolute bottom-3 inset-x-3 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full py-2 px-3 rounded-xl bg-night-950/85 backdrop-blur-md text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-lg hover:bg-night-900 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-gold-bright" />
              <span>Vista Rápida</span>
            </button>
          </div>
        )}
      </div>

      {/* Información del Producto Limpia (Abajo de la fotografía) */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3 bg-white">
        <div>
          <span className="text-[10px] font-bold text-galaxy-light uppercase tracking-widest block">
            {product.category?.name || 'Sweet Home'}
          </span>

          <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A0D26] line-clamp-1 mt-1 group-hover:text-galaxy-DEFAULT transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-[#685B78] line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Precios y Botón de Carrito */}
        <div className="pt-3 border-t border-[#F2E8F0] flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-bold text-[#1A0D26]">
              ₡{product.price.toLocaleString('es-CR')}
            </div>
            {product.compareAtPrice && (
              <div className="text-xs text-[#7A6A8C] line-through font-medium">
                ₡{product.compareAtPrice.toLocaleString('es-CR')}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
            className="btn-gold-metallic px-3.5 py-2 rounded-xl text-xs font-bold text-[#12071F] flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            title="Agregar al carrito"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
