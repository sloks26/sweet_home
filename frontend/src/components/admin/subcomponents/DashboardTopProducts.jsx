import React from 'react';
import { Crown, Sparkles, ArrowUpRight, Package } from 'lucide-react';

export const DashboardTopProducts = ({ products = [], onNavigate }) => {
  const getImgUrl = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      const first = images[0];
      return typeof first === 'string' ? first : first?.url || '';
    }
    return '';
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/25 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gold-DEFAULT/15 text-gold-bright">
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
            className="text-xs text-gold-bright hover:underline font-medium flex items-center gap-1"
          >
            <span>Ver catálogo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {products.length === 0 ? (
          <div className="p-6 text-center text-xs text-text-muted">
            Los productos estrella aparecerán aquí conforme registres pedidos.
          </div>
        ) : (
          products.map((item, index) => {
            const imgUrl = getImgUrl(item.images);
            return (
              <div
                key={item.id}
                onClick={() => onNavigate && onNavigate('products')}
                className="p-3 rounded-xl bg-night-950/70 border border-night-800 hover:border-gold-DEFAULT/40 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Puesto / Ranking */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm ${
                      index === 0
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300/50'
                        : index === 1
                        ? 'bg-stone-200 text-slate-950'
                        : index === 2
                        ? 'bg-amber-700 text-amber-50'
                        : 'bg-night-800 text-text-muted border border-night-700'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Foto miniatura */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-night-900 border border-night-700 shrink-0">
                    {imgUrl ? (
                      <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Datos del producto */}
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white truncate block group-hover:text-gold-light">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-text-muted block">
                      Stock: {item.stock} unidades {item.sku ? `• SKU: ${item.sku}` : ''}
                    </span>
                  </div>
                </div>

                {/* Precio en colones */}
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-gold-bright block">
                    ₡{(item.price || 0).toLocaleString('es-CR')}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-DEFAULT/10 text-gold-light font-medium uppercase">
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
