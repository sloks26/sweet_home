import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  ShoppingBag,
  Check,
  AlertTriangle,
  Star,
  MessageCircle,
  Truck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import Button from '../ui/Button';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import ProductGallery from './subcomponents/ProductGallery';
import ProductInfoTabs from './subcomponents/ProductInfoTabs';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export const ProductDetailModal = ({ isOpen, onClose, product, onBuyNow }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const isFavorited = product ? isInWishlist(product.id) : false;

  const isOutOfStock = product ? product.stock <= 0 : false;
  const isLowStock = product ? product.stock > 0 && product.stock <= (product.lowStockThreshold || 5) : false;

  const hasDiscount = product && product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const cartItems = useCartStore.getState().items;
    let variantKey = 'default';
    if (selectedVariants) {
      const entries = Object.entries(selectedVariants).filter(([_, v]) => Boolean(v));
      if (entries.length > 0) {
        variantKey = entries.sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`).join('|');
      }
    }
    const itemKey = `${product.id}_${variantKey}`;
    const alreadyInCart = cartItems.some((i) => i.key === itemKey);

    if (!alreadyInCart) {
      addItem(product, quantity, selectedVariants);
    }

    if (onBuyNow) {
      onClose();
      onBuyNow();
    }
  };

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setAddedToCartSuccess(false);

      if (product.variants && product.variants.length > 0) {
        const initialVariants = {};
        product.variants.forEach((v) => {
          try {
            const opts = typeof v.options === 'string' ? JSON.parse(v.options) : v.options;
            if (Array.isArray(opts) && opts.length > 0) {
              initialVariants[v.name] = opts[0];
            }
          } catch (e) {
            initialVariants[v.name] = v.options;
          }
        });
        setSelectedVariants(initialVariants);
      } else {
        setSelectedVariants({});
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariants);
    setAddedToCartSuccess(true);
    setTimeout(() => setAddedToCartSuccess(false), 2500);
  };

  const handleWhatsAppConsult = () => {
    const variantText = Object.entries(selectedVariants).length > 0
      ? ` (${Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')})`
      : '';
    const message = encodeURIComponent(
      `Hola Sweet Home & Boutique CR! 💕 Me gustaría consultar sobre el producto: ${product.name}${variantText} por ₡${product.price.toLocaleString('es-CR')}. ¿Tienen disponibilidad?`
    );
    window.open(`https://wa.me/50664656625?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Fondo oscuro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-night-950/85 backdrop-blur-md"
        />

        {/* Modal Principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-gradient-to-b from-night-800/95 via-night-900/95 to-night-950/95 border border-gold-DEFAULT/40 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-night-950/80 border border-gold-DEFAULT/30 text-text-secondary hover:text-gold-light hover:border-gold-DEFAULT/70 transition-all shadow-md"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 p-5 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Galería de imágenes */}
              <ProductGallery
                images={product.images}
                productName={product.name}
                hasDiscount={hasDiscount}
                discountPercent={discountPercent}
                isNew={product.isNew}
                isAdult={product.isAdult}
              />

              {/* Información, variantes y compra */}
              <div className="lg:col-span-6 space-y-6">
                {/* Categoría y SKU */}
                <div className="flex items-center justify-between text-xs text-text-muted border-b border-night-700/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gold-bright uppercase tracking-wider font-semibold">
                      {product.category?.name || 'Boutique'}
                    </span>
                    {product.subcategory?.name && (
                      <>
                        <span>•</span>
                        <span className="text-text-secondary">{product.subcategory.name}</span>
                      </>
                    )}
                  </div>
                  <span>SKU: {product.sku}</span>
                </div>

                {/* Título del Producto */}
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-gold-bright">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-text-primary">
                      {product.rating || '5.0'}
                    </span>
                    <span className="text-xs text-text-muted">
                      ({product.reviewCount || 12} reseñas de clientas)
                    </span>
                  </div>
                </div>

                {/* Precios en Colones */}
                <div className="p-4 rounded-2xl bg-night-900/80 border border-gold-DEFAULT/25 space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-bold text-gold-gradient tracking-tight">
                      ₡{product.price.toLocaleString('es-CR')}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm sm:text-base text-text-muted line-through font-medium">
                        ₡{product.compareAtPrice.toLocaleString('es-CR')}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-text-muted flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-status-success" />
                    <span>IVA del 13% incluido • Pagos por SINPE Móvil o Transferencia</span>
                  </div>
                </div>

                {/* Estado de Stock */}
                <div className="flex items-center gap-2 text-xs">
                  {isOutOfStock ? (
                    <span className="flex items-center gap-1.5 text-status-error font-semibold">
                      <AlertTriangle className="w-4 h-4" />
                      Agotado temporalmente en tienda
                    </span>
                  ) : isLowStock ? (
                    <span className="flex items-center gap-1.5 text-status-warning font-semibold animate-pulse">
                      <AlertTriangle className="w-4 h-4" />
                      ¡Solo quedan {product.stock} unidades en existencia!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-status-success font-semibold">
                      <Check className="w-4 h-4" />
                      En existencia ({product.stock} disponibles)
                    </span>
                  )}
                </div>

                {/* Variantes */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4 pt-2 border-t border-night-700/60">
                    {product.variants.map((v) => {
                      let optionsList = [];
                      try {
                        optionsList = typeof v.options === 'string' ? JSON.parse(v.options) : v.options;
                      } catch (e) {
                        optionsList = [v.options];
                      }

                      return (
                        <div key={v.id || v.name} className="space-y-2">
                          <label className="text-xs font-semibold text-gold-light uppercase tracking-wider flex items-center justify-between">
                            <span>{v.name}:</span>
                            <span className="text-text-primary normal-case font-medium">
                              {selectedVariants[v.name] || 'Seleccionar'}
                            </span>
                          </label>

                          <div className="flex flex-wrap gap-2">
                            {optionsList.map((opt) => {
                              const isSelected = selectedVariants[v.name] === opt;
                              return (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    setSelectedVariants((prev) => ({ ...prev, [v.name]: opt }))
                                  }
                                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                    isSelected
                                      ? 'bg-gold-metallic text-night-950 border border-gold-bright shadow-gold-sm scale-105'
                                      : 'bg-night-800 text-text-secondary border border-night-700 hover:border-gold-DEFAULT/40 hover:text-text-primary'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Cantidad y Botones de Compra */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-night-700 rounded-xl bg-night-900/90 p-1">
                      <button
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-gold-light hover:bg-night-800 disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-text-primary">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                        disabled={quantity >= product.stock || isOutOfStock}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:text-gold-light hover:bg-night-800 disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex-1">
                      <Button
                        variant={addedToCartSuccess ? 'outline' : 'secondary'}
                        size="md"
                        className="w-full justify-center"
                        icon={addedToCartSuccess ? Check : ShoppingBag}
                        disabled={isOutOfStock}
                        onClick={handleAddToCart}
                      >
                        {addedToCartSuccess ? '¡Agregado!' : isOutOfStock ? 'Agotado' : 'Agregar'}
                      </Button>
                    </div>

                    <div className="flex-1">
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full justify-center"
                        disabled={isOutOfStock}
                        onClick={handleBuyNow}
                      >
                        Comprar Ahora
                      </Button>
                    </div>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-3 rounded-2xl border transition-all ${
                        isFavorited
                          ? 'border-nebula-magenta bg-nebula-magenta/20 text-nebula-light'
                          : 'border-night-700 bg-night-800/80 text-text-secondary hover:text-nebula-light hover:border-nebula-magenta/40'
                      }`}
                      title={isFavorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <button
                    onClick={handleWhatsAppConsult}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#25D366]/25 transition-all shadow-sm cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Pedir o Consultar por WhatsApp</span>
                  </button>
                </div>

                {/* Beneficios Rápidos */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-night-700/60 text-center text-[10px] text-text-muted">
                  <div className="p-2 rounded-xl bg-night-800/50 space-y-1">
                    <Truck className="w-4 h-4 text-gold-bright mx-auto" />
                    <span className="block font-medium text-text-secondary">Envíos Costa Rica</span>
                    <span>GAM y Provincias</span>
                  </div>
                  <div className="p-2 rounded-xl bg-night-800/50 space-y-1">
                    <ShieldCheck className="w-4 h-4 text-gold-bright mx-auto" />
                    <span className="block font-medium text-text-secondary">SINPE Oficial</span>
                    <span>Validación directa</span>
                  </div>
                  <div className="p-2 rounded-xl bg-night-800/50 space-y-1">
                    <Sparkles className="w-4 h-4 text-gold-bright mx-auto" />
                    <span className="block font-medium text-text-secondary">Empaque con Amor</span>
                    <span>Caja y aroma</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pestañas inferiores */}
            <ProductInfoTabs product={product} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductDetailModal;
