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
      description:
        pendingVouchers === 1
          ? '1 comprobante recibido'
          : `${pendingVouchers} comprobantes por validar`,
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
      description:
        pendingPayment === 1 ? '1 pedido en espera' : `${pendingPayment} pedidos sin pagar`,
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
      description:
        ordersToShip === 1 ? '1 paquete por despachar' : `${ordersToShip} paquetes listos`,
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
      description:
        pendingReviews === 1 ? '1 reseña de clienta' : `${pendingReviews} opiniones nuevas`,
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
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-DEFAULT/25 to-gold-DEFAULT/5 border border-gold-DEFAULT/35 flex items-center justify-center text-gold-bright shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2.5">
              <span>Lo que necesita tu atención hoy</span>
              {totalUrgent > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-300 to-amber-500 text-night-950 shadow-sm">
                  {totalUrgent} pendientes
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Todo al día
                </span>
              )}
            </h2>
            <p className="text-xs text-text-secondary">
              Acceso rápido inteligente: toca cualquier tarjeta para filtrar y atender al instante.
            </p>
          </div>
        </div>
      </div>

      {/* Grid responsivo: 2 columnas en celular (375/390px) y 5 columnas en desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {actionCards.map((card, idx) => {
          const Icon = card.icon;
          const hasItems = card.count > 0;
          const isLastOddCard = idx === actionCards.length - 1;

          // Temas de color con alto contraste AA y diferenciación de urgencia
          const themeStyles = {
            amber: {
              card: hasItems
                ? 'bg-gradient-to-b from-amber-950/50 to-[#140A24] border-white/[0.08] border-t-amber-400/60 hover:border-amber-400 shadow-[0_10px_25px_-8px_rgba(245,158,11,0.2)]'
                : 'bg-[#120820]/80 border-white/[0.06] hover:border-gold-DEFAULT/35 opacity-85 hover:opacity-100',
              badge: hasItems
                ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-night-950 shadow-sm'
                : 'bg-white/[0.05] text-text-muted border border-white/[0.06]',
              iconBg: hasItems
                ? 'bg-amber-500/20 border border-amber-400/30 text-amber-300'
                : 'bg-white/[0.04] text-text-muted',
              accent: hasItems ? 'text-amber-300' : 'text-text-secondary'
            },
            sky: {
              card: hasItems
                ? 'bg-gradient-to-b from-sky-950/45 to-[#140A24] border-white/[0.08] border-t-sky-400/60 hover:border-sky-400 shadow-[0_10px_25px_-8px_rgba(56,189,248,0.18)]'
                : 'bg-[#120820]/80 border-white/[0.06] hover:border-sky-500/35 opacity-85 hover:opacity-100',
              badge: hasItems
                ? 'bg-sky-500/25 text-sky-200 border border-sky-400/40 shadow-sm'
                : 'bg-white/[0.05] text-text-muted border border-white/[0.06]',
              iconBg: hasItems
                ? 'bg-sky-500/20 border border-sky-400/30 text-sky-300'
                : 'bg-white/[0.04] text-text-muted',
              accent: hasItems ? 'text-sky-300' : 'text-text-secondary'
            },
            emerald: {
              card: hasItems
                ? 'bg-gradient-to-b from-emerald-950/45 to-[#140A24] border-white/[0.08] border-t-emerald-400/60 hover:border-emerald-400 shadow-[0_10px_25px_-8px_rgba(16,185,129,0.2)]'
                : 'bg-[#120820]/80 border-white/[0.06] hover:border-emerald-500/35 opacity-85 hover:opacity-100',
              badge: hasItems
                ? 'bg-emerald-400 text-night-950 shadow-sm'
                : 'bg-white/[0.05] text-text-muted border border-white/[0.06]',
              iconBg: hasItems
                ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
                : 'bg-white/[0.04] text-text-muted',
              accent: hasItems ? 'text-emerald-300' : 'text-text-secondary'
            },
            rose: {
              card: hasItems
                ? 'bg-gradient-to-b from-rose-950/45 to-[#140A24] border-white/[0.08] border-t-rose-400/60 hover:border-rose-400 shadow-[0_10px_25px_-8px_rgba(244,63,94,0.2)]'
                : 'bg-[#120820]/80 border-white/[0.06] hover:border-rose-500/35 opacity-85 hover:opacity-100',
              badge: hasItems
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/[0.05] text-text-muted border border-white/[0.06]',
              iconBg: hasItems
                ? 'bg-rose-500/20 border border-rose-400/30 text-rose-300'
                : 'bg-white/[0.04] text-text-muted',
              accent: hasItems ? 'text-rose-300' : 'text-text-secondary'
            },
            purple: {
              card: hasItems
                ? 'bg-gradient-to-b from-purple-950/45 to-[#140A24] border-white/[0.08] border-t-purple-400/60 hover:border-purple-400'
                : 'bg-[#120820]/80 border-white/[0.06] hover:border-purple-400/35 opacity-85 hover:opacity-100',
              badge: hasItems
                ? 'bg-purple-500 text-white shadow-sm'
                : 'bg-white/[0.05] text-text-muted border border-white/[0.06]',
              iconBg: hasItems
                ? 'bg-purple-500/20 border border-purple-400/30 text-purple-300'
                : 'bg-white/[0.04] text-text-muted',
              accent: hasItems ? 'text-purple-300' : 'text-text-secondary'
            }
          }[card.colorTheme];

          return (
            <button
              key={card.id}
              onClick={card.onClick}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 group cursor-pointer relative overflow-hidden min-h-[122px] sm:min-h-[130px] active:scale-[0.98] ${
                isLastOddCard ? 'col-span-2 lg:col-span-1' : ''
              } ${themeStyles.card}`}
            >
              {/* Parte Superior: Ícono + Contador */}
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-xl shrink-0 ${themeStyles.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-base sm:text-lg font-extrabold px-2.5 py-0.5 rounded-full tabular-nums ${themeStyles.badge}`}
                >
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
              <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-semibold">
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
