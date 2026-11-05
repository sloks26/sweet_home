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
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#180C2C]/95 to-[#110720]/95 border border-white/[0.07] border-t-amber-400/35 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] space-y-4 h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 shadow-sm">
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
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-300 hover:bg-amber-500/20 font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0"
          >
            <span>Reponer</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-muted bg-[#0C0517]/60 rounded-xl border border-white/[0.05]">
            ✨ ¡Excelente! Todo tu inventario tiene stock suficiente en este momento.
          </div>
        ) : (
          items.map((prod) => {
            const imgUrl = getImgUrl(prod.images);
            return (
              <div
                key={prod.id}
                onClick={() => onNavigate && onNavigate('products')}
                className="p-3 rounded-xl bg-[#0D0518]/80 border border-white/[0.06] hover:border-amber-400/40 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-night-900 border border-white/[0.08] shrink-0">
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
                    <span className="text-[10px] text-text-muted block tabular-nums">
                      {prod.sku ? `SKU: ${prod.sku} • ` : ''}₡
                      {(prod.price || 0).toLocaleString('es-CR')}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase block tabular-nums ${
                      prod.stock === 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
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
