import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, ShieldCheck, Star } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  if (!isOpen || !product) return null;

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images.map((img) => img.url)
    : ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80'];

  const variants = product.variants || [];

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-night-950/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-gradient-to-b from-night-800 to-night-900 border border-gold-DEFAULT/30 rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-night-900/80 text-text-secondary hover:text-gold-light hover:bg-night-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Galería de Fotos */}
          <div className="p-6 flex flex-col justify-between bg-night-950/60 border-b md:border-b-0 md:border-r border-night-700/50">
            <div className="aspect-square rounded-2xl overflow-hidden bg-night-900 border border-night-600 mb-4">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx
                        ? 'border-gold-bright shadow-gold-sm'
                        : 'border-night-600 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles del Producto */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gold-bright uppercase tracking-wider">
                  {product.category?.name}
                </span>
                {product.isAdult && <Badge variant="adult" size="sm">🔞 +18</Badge>}
              </div>

              <h3 className="font-serif text-2xl font-bold text-text-primary">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gold-bright">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating || 5.0}</span>
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-bold text-gold-light">
                  ₡{product.price.toLocaleString('es-CR')}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-text-muted line-through">
                    ₡{product.compareAtPrice.toLocaleString('es-CR')}
                  </span>
                )}
              </div>

              <p className="text-xs text-text-secondary leading-relaxed pt-1 line-clamp-4">
                {product.description}
              </p>

              {/* Variantes si existen */}
              {variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-text-primary block">
                    {variants[0].name}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(variants[0].options || '[]').map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant({ ...variants[0], selectedOption: opt })}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          selectedVariant?.selectedOption === opt
                            ? 'border-gold-bright bg-gold-DEFAULT/15 text-gold-light shadow-sm'
                            : 'border-night-600 text-text-secondary hover:border-gold-DEFAULT/50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="space-y-3 pt-4 border-t border-night-700/60">
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  icon={ShoppingBag}
                  onClick={handleAddToCart}
                >
                  Agregar al Carrito
                </Button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isFavorited
                      ? 'border-nebula-magenta bg-nebula-magenta/20 text-nebula-pink'
                      : 'border-night-600 text-text-secondary hover:text-nebula-pink hover:border-gold-DEFAULT/40'
                  }`}
                  title="Favoritos"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-bright" />
                <span>Pago seguro por SINPE Móvil y Transferencia</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
