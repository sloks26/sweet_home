import React from 'react';
import {
  FileCheck2,
  Clock,
  Truck,
  AlertTriangle,
  MessageSquareHeart,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const DashboardActionCenter = ({ metrics = {}, onNavigate }) => {
  const pendingVouchers = metrics.voucherReceivedOrders || 0;
  const pendingPayment = metrics.pendingPaymentOrders || 0;
  const ordersToShip = metrics.ordersToShipCount || 0;
  const lowStock = metrics.lowStockCount || 0;
  const pendingReviews = metrics.pendingReviewsCount || 0;

  const totalUrgent = pendingVouchers + pendingPayment + ordersToShip + lowStock + pendingReviews;

  const actionCards = [
    {
      id: 'vouchers',
      title: 'Comprobantes por verificar',
      count: pendingVouchers,
      description: pendingVouchers === 1 ? '1 comprobante recibido' : `${pendingVouchers} comprobantes por validar`,
      actionText: 'Validar SINPE',
      icon: FileCheck2,
      isUrgent: pendingVouchers > 0,
      colorTheme: 'amber',
      onClick: () => onNavigate('orders', { filter: 'VOUCHER_RECEIVED' })
    },
    {
      id: 'pending_payment',
      title: 'Pendientes de pago',
      count: pendingPayment,
      description: pendingPayment === 1 ? '1 pedido en espera' : `${pendingPayment} pedidos sin pagar`,
      actionText: 'Ver pedidos',
      icon: Clock,
      isUrgent: false,
      colorTheme: 'sky',
      onClick: () => onNavigate('orders', { filter: 'PENDING_PAYMENT' })
    },
    {
      id: 'to_ship',
      title: 'Pedidos por enviar',
      count: ordersToShip,
      description: ordersToShip === 1 ? '1 paquete por despachar' : `${ordersToShip} paquetes listos`,
      actionText: 'Ver despachos',
      icon: Truck,
      isUrgent: ordersToShip > 0,
      colorTheme: 'emerald',
      onClick: () => onNavigate('orders', { filter: 'READY_TO_SHIP' })
    },
    {
      id: 'low_stock',
      title: 'Stock crítico (≤ 3)',
      count: lowStock,
      description: lowStock === 1 ? '1 producto por agotarse' : `${lowStock} productos en alerta`,
      actionText: 'Reabastecer',
      icon: AlertTriangle,
      isUrgent: lowStock > 0,
      colorTheme: 'rose',
      onClick: () => onNavigate('products', { filter: 'low-stock' })
    },
    {
      id: 'reviews',
      title: 'Reseñas por aprobar',
      count: pendingReviews,
      description: pendingReviews === 1 ? '1 reseña de clienta' : `${pendingReviews} opiniones nuevas`,
      actionText: 'Moderar',
      icon: MessageSquareHeart,
      isUrgent: pendingReviews > 0,
      colorTheme: 'purple',
      onClick: () => onNavigate('products', { tab: 'reviews' })
    }
  ];

  return (
    <section className="space-y-3.5">
      {/* Encabezado del bloque de atención */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 flex items-center justify-center text-gold-bright">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2">
              <span>Lo que necesita tu atención hoy</span>
              {totalUrgent > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-night-950">
                  {totalUrgent}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Al día
                </span>
              )}
            </h2>
            <p className="text-xs text-text-secondary">
              Toca cualquier tarjeta para ir directamente a la lista filtrada y gestionarla en un toque.
            </p>
          </div>
        </div>
      </div>

      {/* Grid responsivo: 2 columnas en celular (375/390px) y 5 columnas en desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {actionCards.map((card) => {
          const Icon = card.icon;

          // Temas de color con alto contraste AA
          const themeStyles = {
            amber: {
              card: card.isUrgent
                ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-[#150B24] border-night-700/80 hover:border-gold-DEFAULT/40',
              badge: card.isUrgent ? 'bg-amber-400 text-night-950' : 'bg-night-800 text-text-secondary',
              iconBg: card.isUrgent ? 'bg-amber-500/20 text-amber-300' : 'bg-night-800 text-text-muted',
              accent: 'text-amber-300'
            },
            sky: {
              card: 'bg-[#150B24] border-night-700/80 hover:border-sky-500/50',
              badge: card.count > 0 ? 'bg-sky-500/25 text-sky-200 border border-sky-500/40' : 'bg-night-800 text-text-muted',
              iconBg: 'bg-sky-500/15 text-sky-400',
              accent: 'text-sky-300'
            },
            emerald: {
              card: card.isUrgent
                ? 'bg-emerald-950/35 border-emerald-500/45 hover:border-emerald-400'
                : 'bg-[#150B24] border-night-700/80 hover:border-emerald-500/40',
              badge: card.count > 0 ? 'bg-emerald-500 text-night-950' : 'bg-night-800 text-text-muted',
              iconBg: 'bg-emerald-500/20 text-emerald-300',
              accent: 'text-emerald-300'
            },
            rose: {
              card: card.isUrgent
                ? 'bg-rose-950/35 border-rose-500/45 hover:border-rose-400'
                : 'bg-[#150B24] border-night-700/80 hover:border-rose-500/40',
              badge: card.count > 0 ? 'bg-rose-500 text-white' : 'bg-night-800 text-text-muted',
              iconBg: 'bg-rose-500/20 text-rose-300',
              accent: 'text-rose-300'
            },
            purple: {
              card: 'bg-[#150B24] border-night-700/80 hover:border-purple-400/50',
              badge: card.count > 0 ? 'bg-purple-500 text-white' : 'bg-night-800 text-text-muted',
              iconBg: 'bg-purple-500/15 text-purple-300',
              accent: 'text-purple-300'
            }
          }[card.colorTheme];

          return (
            <button
              key={card.id}
              onClick={card.onClick}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 group cursor-pointer relative overflow-hidden min-h-[125px] sm:min-h-[135px] active:scale-[0.98] ${themeStyles.card}`}
            >
              {/* Parte Superior: Ícono + Contador */}
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-xl shrink-0 ${themeStyles.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-lg sm:text-xl font-extrabold px-2.5 py-0.5 rounded-full ${themeStyles.badge}`}>
                  {card.count}
                </span>
              </div>

              {/* Información y Título */}
              <div className="mt-2.5">
                <h3 className="font-serif text-xs sm:text-sm font-bold text-text-primary line-clamp-1 group-hover:text-gold-light transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
                  {card.description}
                </p>
              </div>

              {/* Llamado a la acción rápido */}
              <div className="mt-2 pt-2 border-t border-night-750 flex items-center justify-between text-[11px] font-semibold">
                <span className={themeStyles.accent}>{card.actionText}</span>
                <ArrowRight className="w-3 h-3 text-text-muted group-hover:translate-x-1 group-hover:text-gold-light transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardActionCenter;
