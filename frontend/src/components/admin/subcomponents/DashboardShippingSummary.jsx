import React, { useState } from 'react';
import { Truck, Mail, Store, Copy, Check, ArrowUpRight } from 'lucide-react';
import Button from '../../ui/Button';
import { copyToClipboard } from '../../../utils/clipboard';

export const DashboardShippingSummary = ({ orders = [], onNavigate }) => {
  const [copied, setCopied] = useState(false);

  // Clasificar pedidos por método de envío
  const correosOrders = orders.filter((o) =>
    (o.shippingMethod || '').toLowerCase().includes('correo')
  );
  const expressOrders = orders.filter((o) =>
    (o.shippingMethod || '').toLowerCase().includes('mensajer') ||
    (o.shippingMethod || '').toLowerCase().includes('express') ||
    (o.shippingMethod || '').toLowerCase().includes('gam')
  );
  const pickupOrders = orders.filter((o) =>
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
    <div className="p-5 sm:p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/25 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
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
          className="border-sky-500/40 text-sky-300 hover:bg-sky-500/15"
        >
          {copied ? '¡Copiado para WhatsApp!' : 'Copiar Lista Envíos'}
        </Button>
      </div>

      {/* 3 Contadores rápidos */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-xl bg-night-950 border border-night-800">
          <Mail className="w-4 h-4 mx-auto text-amber-300 mb-1" />
          <span className="text-lg font-bold text-white block">{correosOrders.length}</span>
          <span className="text-[10px] text-text-muted block">Correos CR</span>
        </div>
        <div className="p-3 rounded-xl bg-night-950 border border-night-800">
          <Truck className="w-4 h-4 mx-auto text-sky-400 mb-1" />
          <span className="text-lg font-bold text-white block">{expressOrders.length}</span>
          <span className="text-[10px] text-text-muted block">Mensajería GAM</span>
        </div>
        <div className="p-3 rounded-xl bg-night-950 border border-night-800">
          <Store className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <span className="text-lg font-bold text-white block">{pickupOrders.length}</span>
          <span className="text-[10px] text-text-muted block">Retiro Tienda</span>
        </div>
      </div>

      {/* Lista reciente de paquetes */}
      {orders.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-night-800">
          {orders.slice(0, 4).map((ord) => (
            <div
              key={ord.id}
              onClick={() => onNavigate && onNavigate('orders')}
              className="p-2.5 rounded-xl bg-night-950/60 border border-night-800 hover:border-sky-500/40 transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer group"
            >
              <div className="min-w-0">
                <span className="font-semibold text-sky-300 block group-hover:underline">
                  {ord.orderNumber} • {ord.customerName}
                </span>
                <span className="text-[10px] text-text-muted truncate block">
                  {ord.shippingMethod} • Tel: {ord.customerPhone}
                </span>
              </div>
              <span className="font-bold text-white shrink-0">
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
