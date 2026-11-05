import React from 'react';
import { MessageCircle, Send, Trash2, Truck, Plus } from 'lucide-react';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import { formatColones } from '../../../utils/currency';

export const ContraEntregaTable = ({
  contraEntrega = [],
  pendingSaldo = 0,
  onOpenCreate,
  onMarkAsCompleted,
  onDelete,
  formatCleanPhone,
  getWhatsAppLink
}) => {
  return (
    <div
      id="section-contra-entrega"
      className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#180C2C]/95 to-[#110720]/95 border border-white/[0.07] border-t-sky-400/40 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] space-y-4 scroll-mt-24"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-300 shadow-sm">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-text-primary flex items-center gap-2">
              <span>Pedidos Contra Entrega</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 font-bold tabular-nums">
                {contraEntrega.length}
              </span>
            </h4>
            <p className="text-xs text-text-secondary tabular-nums">
              Por cobrar contra entrega:{' '}
              <strong className="text-sky-300">{formatColones(pendingSaldo)}</strong>
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Plus}
          onClick={onOpenCreate}
          className="bg-sky-500/10 border-sky-400/40 text-sky-300 hover:bg-sky-500/20"
        >
          + Nuevo Contra Entrega
        </Button>
      </div>

      {contraEntrega.length === 0 ? (
        <div className="p-6 text-center text-xs text-text-muted bg-[#0C0517]/60 rounded-xl border border-dashed border-white/[0.08]">
          No hay pedidos contra entrega registrados. Agrega uno con "+ Nuevo Contra Entrega".
        </div>
      ) : (
        <>
          {/* Vista de Tarjetas para Celular y Tablet (< 768px) - Cero Scroll Horizontal */}
          <div className="md:hidden space-y-3">
            {contraEntrega.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-night-950 border border-sky-500/25 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-text-primary">{item.customerName}</div>
                    <a
                      href={`https://wa.me/${formatCleanPhone(item.customerPhone)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{item.customerPhone}</span>
                    </a>
                  </div>
                  {item.status === 'COMPLETED' ? (
                    <Badge variant="success" size="sm">
                      Cobrado
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Por Cobrar
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-text-secondary bg-night-900 p-2 rounded-lg border border-night-800">
                  <span className="text-[10px] uppercase font-semibold text-text-muted block">
                    Detalle Pedido:
                  </span>
                  <span className="font-medium text-text-primary">{item.productDetails}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-t border-b border-night-800">
                  <span className="text-[11px] text-text-muted">Monto por Cobrar:</span>
                  <span className="text-sm font-extrabold text-sky-300">
                    {formatColones(item.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  {item.status !== 'COMPLETED' ? (
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        type="button"
                        onClick={() => onMarkAsCompleted(item)}
                        className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        Marcar Cobrado
                      </button>
                      <a
                        href={getWhatsAppLink(item)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Avisar WA</span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex-1 text-xs text-emerald-400 font-medium">
                      Pedido entregado y cobrado
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onDelete(item.id, item.customerName)}
                    className="min-h-[40px] px-3 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 text-xs font-semibold transition-colors flex items-center justify-center"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Vista de Tabla para Pantallas Grandes (Desktop >= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead>
                <tr className="border-b border-night-700 text-text-muted">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Detalle Pedido</th>
                  <th className="pb-3 font-medium">Por Cobrar (₡)</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-night-800">
                {contraEntrega.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1E1033] transition-colors">
                    <td className="py-3 font-medium text-white">
                      <div>{item.customerName}</div>
                      <a
                        href={`https://wa.me/${formatCleanPhone(item.customerPhone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{item.customerPhone}</span>
                      </a>
                    </td>
                    <td
                      className="py-3 text-text-secondary max-w-[200px] truncate"
                      title={item.productDetails}
                    >
                      {item.productDetails}
                    </td>
                    <td className="py-3 font-bold text-sky-300">
                      {formatColones(item.totalAmount)}
                    </td>
                    <td className="py-3">
                      {item.status === 'COMPLETED' ? (
                        <Badge variant="success" size="sm">
                          Cobrado
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm">
                          Por Cobrar
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                      {item.status !== 'COMPLETED' && (
                        <>
                          <a
                            href={getWhatsAppLink(item)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                            title="Avisar entrega por WhatsApp"
                          >
                            <Send className="w-3 h-3" />
                            <span>Avisar WA</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => onMarkAsCompleted(item)}
                            className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-[11px] font-semibold transition-colors"
                          >
                            Cobrado
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => onDelete(item.id, item.customerName)}
                        className="p-1 rounded text-text-muted hover:text-rose-400 transition-colors inline-block"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ContraEntregaTable;
