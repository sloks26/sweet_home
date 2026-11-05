import React from 'react';
import { Crown, ArrowUpRight, Package } from 'lucide-react';

export const DashboardTopProducts = ({ products = [], onNavigate }) => {
  const getImgUrl = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      const first = images[0];
      return typeof first === 'string' ? first : first?.url || '';
    }
    return '';
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#180C2C]/95 to-[#110720]/95 border border-white/[0.07] border-t-gold-DEFAULT/30 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] space-y-4 h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-gold-DEFAULT/25 to-gold-DEFAULT/5 border border-gold-DEFAULT/35 text-gold-bright shadow-sm">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Prendas y Productos Estrella
            </h3>
            <p className="text-xs text-text-secondary">
              Los artículos más solicitados y con mayor movimiento en la boutique.
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="px-3 py-1.5 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 text-xs text-gold-bright hover:bg-gold-DEFAULT/20 font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0"
          >
            <span>Ver catálogo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {products.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-muted bg-[#0C0517]/60 rounded-xl border border-white/[0.05]">
            Los productos estrella aparecerán aquí conforme registres pedidos.
          </div>
        ) : (
          products.map((item, index) => {
            const imgUrl = getImgUrl(item.images);
            return (
              <div
                key={item.id}
                onClick={() => onNavigate && onNavigate('products')}
                className="p-3 rounded-xl bg-[#0D0518]/80 border border-white/[0.06] hover:border-gold-DEFAULT/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Puesto / Ranking */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm tabular-nums ${
                      index === 0
                        ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 ring-2 ring-amber-300/40'
                        : index === 1
                          ? 'bg-stone-200 text-slate-950'
                          : index === 2
                            ? 'bg-amber-700 text-amber-50'
                            : 'bg-white/[0.06] text-text-muted border border-white/[0.08]'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Foto miniatura */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-night-900 border border-white/[0.08] shrink-0">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Datos del producto */}
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white truncate block group-hover:text-gold-light transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-text-muted block">
                      Stock: {item.stock} unidades {item.sku ? `• SKU: ${item.sku}` : ''}
                    </span>
                  </div>
                </div>

                {/* Precio en colones */}
                <div className="text-right shrink-0 tabular-nums">
                  <span className="text-xs font-bold text-gold-bright block">
                    ₡{(item.price || 0).toLocaleString('es-CR')}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-DEFAULT/15 border border-gold-DEFAULT/25 text-gold-light font-semibold uppercase">
                    Destacado
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

export default DashboardTopProducts;
