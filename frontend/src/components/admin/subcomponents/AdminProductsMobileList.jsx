import React from 'react';
import {
  Edit2,
  Trash2,
  Package,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import Badge from '../../ui/Badge';

export const AdminProductsMobileList = ({
  products = [],
  onEdit,
  onDelete,
  onToggleActive,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="lg:hidden space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="p-4 rounded-2xl bg-night-900/60 border border-night-700/60 animate-pulse flex items-center gap-3.5"
          >
            <div className="w-14 h-14 rounded-xl bg-night-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-night-850 rounded w-3/4" />
              <div className="h-3 bg-night-850 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="lg:hidden p-8 rounded-2xl bg-[#140A22] border border-dashed border-night-700 text-center space-y-2.5">
        <Package className="w-10 h-10 text-gold-light/60 mx-auto" />
        <h3 className="font-serif text-base font-bold text-text-primary">
          No se encontraron productos
        </h3>
        <p className="text-xs text-text-secondary max-w-xs mx-auto">
          Prueba cambiando el término de búsqueda o los filtros de categoría y stock.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-3">
      {products.map((p) => {
        const primaryImg =
          p.images?.[0]?.url || (typeof p.images?.[0] === 'string' ? p.images[0] : null);
        const isOutOfStock = p.stock <= 0;
        const isLowStock = p.stock > 0 && p.stock <= 5;

        return (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl bg-[#150B24] border border-gold-DEFAULT/25 shadow-md space-y-3 relative overflow-hidden"
          >
            {/* Fila Principal: Miniatura de 52px + Datos */}
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-night-950 border border-gold-DEFAULT/20 shrink-0 flex items-center justify-center relative">
                {primaryImg ? (
                  <img
                    src={primaryImg}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&q=80';
                    }}
                  />
                ) : (
                  <Package className="w-6 h-6 text-text-muted" />
                )}
                {p.isFeatured && (
                  <span
                    className="absolute top-1 left-1 p-0.5 rounded bg-gold-DEFAULT text-night-950"
                    title="Destacado"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-bold text-sm text-text-primary line-clamp-1">{p.name}</h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      p.isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-night-800 text-text-muted border border-night-700'
                    }`}
                  >
                    {p.isActive ? 'Activo' : 'Pausado'}
                  </span>
                </div>

                <div className="text-[11px] text-text-secondary mt-0.5 flex items-center gap-2">
                  <span className="truncate">{p.category?.name || 'Sin categoría'}</span>
                  {p.sku && <span className="text-text-muted font-mono">SKU: {p.sku}</span>}
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-night-800">
                  <div className="text-sm font-extrabold text-gold-bright">
                    ₡{Number(p.price || 0).toLocaleString('es-CR')}
                  </div>

                  <div>
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-md border border-rose-500/30">
                        <XCircle className="w-3 h-3" /> Agotado
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" /> {p.stock} unid. (Bajo)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> {p.stock} unid.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Fila de Acciones Táctiles (Mínimo 44px de área de toque) */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-night-800">
              <button
                type="button"
                onClick={() => onToggleActive(p.id)}
                className={`min-h-[44px] rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  p.isActive
                    ? 'border-night-700 text-text-secondary hover:bg-night-800'
                    : 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20'
                }`}
                title={
                  p.isActive ? 'Pausar producto en la tienda' : 'Activar producto en la tienda'
                }
              >
                {p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{p.isActive ? 'Pausar' : 'Activar'}</span>
              </button>

              <button
                type="button"
                onClick={() => onEdit(p)}
                className="min-h-[44px] rounded-xl border border-gold-DEFAULT/40 bg-gold-DEFAULT/10 text-gold-light hover:bg-gold-DEFAULT/20 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(p.id, p.name)}
                className="min-h-[44px] rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminProductsMobileList;
