import React, { useState } from 'react';
import { Truck, Mail, Store, Copy, Check } from 'lucide-react';
import Button from '../../ui/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export const DashboardShippingSummary = ({ orders = [], onNavigate }) => {
  const [copied, setCopied] = useState(false);

  // Clasificar pedidos por método de envío
  const correosOrders = orders.filter((o) =>
    (o.shippingMethod || '').toLowerCase().includes('correo')
  );
  const expressOrders = orders.filter(
    (o) =>
      (o.shippingMethod || '').toLowerCase().includes('mensajer') ||
      (o.shippingMethod || '').toLowerCase().includes('express') ||
      (o.shippingMethod || '').toLowerCase().includes('gam')
  );
  const pickupOrders = orders.filter(
    (o) =>
      (o.shippingMethod || '').toLowerCase().includes('retiro') ||
      (o.shippingMethod || '').toLowerCase().includes('tienda')
  );

  const handleCopyShippingList = async () => {
    if (orders.length === 0) {
      alert('No hay pedidos listos para envío en este momento.');
      return;
    }

    const now = new Date();
    let text = `📦 LISTA DE ENVÍOS - SWEET HOME & BOUTIQUE CR\n`;
    text += `Fecha: ${now.toLocaleDateString('es-CR')} ${now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}\n`;
    text += `Total de paquetes: ${orders.length}\n\n`;

    orders.forEach((ord, idx) => {
      text += `${idx + 1}. Pedido: ${ord.orderNumber}\n`;
      text += `   • Cliente: ${ord.customerName}\n`;
      text += `   • Teléfono: ${ord.customerPhone}\n`;
      text += `   • Método: ${ord.shippingMethod || 'Envío estándar'}\n`;
      text += `   • Dirección: ${ord.shippingAddress || 'Por coordinar'}\n`;
      text += `   • Total: ₡${(ord.total || 0).toLocaleString('es-CR')}\n\n`;
    });

    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#180C2C]/95 to-[#110720]/95 border border-white/[0.07] border-t-sky-400/35 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] space-y-4 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-300 shadow-sm">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-text-primary">
              Despachos y Envíos ({orders.length})
            </h3>
            <p className="text-xs text-text-secondary">
              Paquetes listos para entrega por Correos de Costa Rica o mensajero.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={copied ? Check : Copy}
          onClick={handleCopyShippingList}
          className="bg-sky-500/10 border-sky-400/35 text-sky-300 hover:bg-sky-500/20 shrink-0"
        >
          {copied ? '¡Copiado para WhatsApp!' : 'Copiar Lista Envíos'}
        </Button>
      </div>

      {/* 3 Contadores rápidos */}
      <div className="grid grid-cols-3 gap-2.5 text-center tabular-nums">
        <div className="p-3.5 rounded-xl bg-[#0D0518]/80 border border-white/[0.06] border-t-amber-400/25">
          <Mail className="w-4 h-4 mx-auto text-amber-300 mb-1" />
          <span className="text-lg font-extrabold text-white block">{correosOrders.length}</span>
          <span className="text-[10px] text-text-muted block">Correos CR</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0D0518]/80 border border-white/[0.06] border-t-sky-400/25">
          <Truck className="w-4 h-4 mx-auto text-sky-400 mb-1" />
          <span className="text-lg font-extrabold text-white block">{expressOrders.length}</span>
          <span className="text-[10px] text-text-muted block">Mensajería GAM</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0D0518]/80 border border-white/[0.06] border-t-emerald-400/25">
          <Store className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <span className="text-lg font-extrabold text-white block">{pickupOrders.length}</span>
          <span className="text-[10px] text-text-muted block">Retiro Tienda</span>
        </div>
      </div>

      {/* Lista reciente de paquetes */}
      {orders.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          {orders.slice(0, 4).map((ord) => (
            <div
              key={ord.id}
              onClick={() => onNavigate && onNavigate('orders')}
              className="p-2.5 rounded-xl bg-[#0D0518]/70 border border-white/[0.06] hover:border-sky-400/40 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer group"
            >
              <div className="min-w-0">
                <span className="font-semibold text-sky-300 block group-hover:underline">
                  {ord.orderNumber} • {ord.customerName}
                </span>
                <span className="text-[10px] text-text-muted truncate block">
                  {ord.shippingMethod} • Tel: {ord.customerPhone}
                </span>
              </div>
              <span className="font-bold text-white shrink-0 tabular-nums">
                ₡{(ord.total || 0).toLocaleString('es-CR')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardShippingSummary;
