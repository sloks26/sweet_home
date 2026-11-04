import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import Button from '../ui/Button';

export const CartDrawer = ({ onOpenCheckout }) => {
  const { isDrawerOpen, closeDrawer, items, removeItem, updateQuantity, getSubtotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const freeShippingThreshold = 35000; // ₡35,000
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-night-950/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-gradient-to-b from-night-800 to-night-900 border-l border-gold-DEFAULT/30 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-night-600/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold-bright" />
                  <h2 className="font-serif text-xl font-bold text-text-primary">Tu Carrito</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-DEFAULT/15 text-gold-light font-medium">
                    {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
                  </span>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-gold-light hover:bg-night-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Barra de progreso para Envío Gratis */}
              <div className="p-4 bg-night-900/90 border-b border-night-600/40">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-secondary">
                    {missingForFreeShipping === 0 ? (
                      <strong className="text-status-success flex items-center gap-1">
                        ✨ ¡Felicidades! Tienes Envío GRATIS
                      </strong>
                    ) : (
                      <>
                        Agrega{' '}
                        <strong className="text-gold-light">
                          ₡{missingForFreeShipping.toLocaleString('es-CR')}
                        </strong>{' '}
                        más para Envío Gratis
                      </>
                    )}
                  </span>
                  <span className="text-gold-bright font-semibold text-[11px]">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-night-700 overflow-hidden">
                  <div
                    className="h-full bg-gold-metallic transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8">
                    <div className="w-16 h-16 rounded-full bg-night-700/80 border border-gold-DEFAULT/20 flex items-center justify-center text-gold-light">
                      <ShoppingBag className="w-8 h-8 opacity-60" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-text-primary">
                        Tu carrito está vacío
                      </h3>
                      <p className="text-xs text-text-secondary mt-1 max-w-xs">
                        Explora nuestras colecciones exclusivas para tu hogar, fragancias y estilo.
                      </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={closeDrawer} icon={ArrowRight}>
                      Explorar la Tienda
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.key}
                      className="p-3.5 rounded-xl bg-night-700/60 border border-gold-DEFAULT/15 flex gap-3.5 items-center transition-all hover:border-gold-DEFAULT/40"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-18 h-18 w-16 h-16 rounded-lg object-cover bg-night-900 border border-night-600 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-semibold text-text-primary truncate">
                          {item.name}
                        </h4>
                        {item.variantName && (
                          <span className="text-[11px] text-gold-bright/90 block">
                            {item.variantName}
                          </span>
                        )}
                        <div className="text-xs font-bold text-gold-light mt-1">
                          ₡{item.price.toLocaleString('es-CR')}
                        </div>

                        {/* Cantidad y Eliminar */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-night-600 rounded-lg bg-night-900 overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className="p-1 text-text-secondary hover:text-gold-light hover:bg-night-800"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-medium text-text-primary">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className="p-1 text-text-secondary hover:text-gold-light hover:bg-night-800"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.key)}
                            className="p-1 text-text-muted hover:text-status-error transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Checkout */}
              {items.length > 0 && (
                <div className="p-5 border-t border-night-600/50 bg-night-900/90 space-y-3.5">
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-text-primary font-semibold">
                        ₡{subtotal.toLocaleString('es-CR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>
                        {missingForFreeShipping === 0 ? (
                          <span className="text-status-success font-semibold">Gratis</span>
                        ) : (
                          'Se calcula en checkout'
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-text-primary pt-2 border-t border-night-700">
                      <span>Total Estimado</span>
                      <span className="text-gold-gradient text-lg">
                        ₡{subtotal.toLocaleString('es-CR')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      iconRight={ArrowRight}
                      onClick={() => {
                        closeDrawer();
                        if (onOpenCheckout) {
                          onOpenCheckout();
                        }
                      }}
                    >
                      Continuar Compra
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-bright" />
                      <span>Pago seguro por SINPE Móvil y Transferencia</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
