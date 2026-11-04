import React from 'react';
import { Eye, Trash2, MapPin, Calendar, Smartphone, PackageCheck } from 'lucide-react';
import WhatsAppIcon from '../../ui/WhatsAppIcon';

export const AdminOrdersMobileList = ({
  orders = [],
  onOpenDetail,
  onOpenWhatsApp,
  onDeleteOrder,
  getStatusBadge
}) => {
  if (orders.length === 0) {
    return (
      <div className="lg:hidden p-8 rounded-2xl bg-[#140A22] border border-dashed border-night-700 text-center space-y-3">
        <PackageCheck className="w-10 h-10 text-gold-light/60 mx-auto" />
        <h3 className="font-serif text-base font-bold text-text-primary">
          No hay pedidos con este filtro
        </h3>
        <p className="text-xs text-text-secondary max-w-xs mx-auto">
          Todos los pedidos en esta categoría han sido procesados o no coinciden con la búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-3.5">
      {orders.map((ord) => {
        const hasVoucher = Boolean(ord.voucherUrl);

        return (
          <div
            key={ord.id}
            className="p-4 rounded-2xl bg-[#150B24] border border-gold-DEFAULT/25 shadow-md space-y-3 relative overflow-hidden"
          >
            {/* Fila 1: Número de Pedido, Estado y Fecha */}
            <div className="flex items-start justify-between gap-2 border-b border-night-750 pb-2.5">
              <div>
                <span className="font-serif text-base font-bold text-gold-light tracking-wide block">
                  {ord.orderNumber}
                </span>
                <span className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(ord.createdAt).toLocaleDateString('es-CR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="shrink-0">{getStatusBadge(ord.status)}</div>
            </div>

            {/* Fila 2: Cliente y Dirección */}
            <div className="space-y-1 text-xs text-text-secondary">
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary text-sm">{ord.customerName}</span>
                <span className="font-mono text-gold-bright font-extrabold text-sm">
                  ₡{ord.total.toLocaleString('es-CR')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-text-muted text-[11px]">
                <Smartphone className="w-3 h-3 text-gold-light" />
                <span>{ord.customerPhone}</span>
                <span>•</span>
                <span>{ord.paymentMethod === 'SINPE_MOVIL' ? 'SINPE Móvil' : 'Transferencia'}</span>
              </div>

              <div className="flex items-start gap-1.5 text-text-muted text-[11px] pt-1">
                <MapPin className="w-3 h-3 text-gold-light shrink-0 mt-0.5" />
                <span className="truncate max-w-[280px]">
                  {ord.shippingMethod} • {ord.shippingAddress || 'Retiro en tienda'}
                </span>
              </div>
            </div>

            {/* Fila 3: Miniatura o Estado de Comprobante */}
            {hasVoucher && (
              <div className="p-2 rounded-xl bg-night-950 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={ord.voucherUrl}
                    alt="Comprobante"
                    className="w-10 h-10 rounded-lg object-cover border border-amber-500/40"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">
                      Comprobante adjunto
                    </span>
                    <span className="text-[10px] text-text-muted">Listo para revisar</span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenDetail(ord)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1 hover:bg-amber-500/30"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver</span>
                </button>
              </div>
            )}

            {/* Fila 4: Acciones Principales con Áreas Táctiles >= 44px */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenDetail(ord)}
                className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-[#1C0F32] hover:bg-night-800 border border-gold-DEFAULT/30 text-gold-light font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Eye className="w-4 h-4 text-gold-bright" />
                <span>Gestionar Pedido</span>
              </button>

              {ord.customerPhone && (
                <button
                  onClick={() => onOpenWhatsApp(ord)}
                  title="Contactar por WhatsApp"
                  className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => onDeleteOrder(ord.id, ord.orderNumber)}
                title="Eliminar pedido"
                className="min-h-[44px] min-w-[44px] px-3 rounded-xl border border-status-error/30 text-status-error hover:bg-status-error/15 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                aria-label="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminOrdersMobileList;
