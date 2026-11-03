import React from 'react';
import { AlertTriangle, Package, ArrowUpRight } from 'lucide-react';

export const DashboardLowStockAlert = ({ items = [], onNavigate }) => {
  const getImgUrl = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      const first = images[0];
      return typeof first === 'string' ? first : first?.url || '';
    }
    return '';
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#140A22] border border-amber-500/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Alerta de Inventario Crítico
            </h3>
            <p className="text-xs text-text-secondary">
              Artículos con 3 o menos existencias físicas en la boutique.
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="text-xs text-amber-300 hover:underline font-medium flex items-center gap-1"
          >
            <span>Reponer stock</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-muted">
            ✨ ¡Excelente! Todo tu inventario tiene stock suficiente en este momento.
          </div>
        ) : (
          items.map((prod) => {
            const imgUrl = getImgUrl(prod.images);
            return (
              <div
                key={prod.id}
                onClick={() => onNavigate && onNavigate('products')}
                className="p-3 rounded-xl bg-night-950/70 border border-night-800 hover:border-amber-500/40 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-night-900 border border-night-700 shrink-0">
                    {imgUrl ? (
                      <img src={imgUrl} alt={prod.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white truncate block group-hover:text-amber-200">
                      {prod.name}
                    </span>
                    <span className="text-[10px] text-text-muted block">
                      {prod.sku ? `SKU: ${prod.sku} • ` : ''}₡{(prod.price || 0).toLocaleString('es-CR')}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase block ${
                      prod.stock === 0
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {prod.stock === 0 ? 'Agotado' : `Quedan ${prod.stock}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DashboardLowStockAlert;
