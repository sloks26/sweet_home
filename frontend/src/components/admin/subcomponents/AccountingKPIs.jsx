import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Clock, Truck, ArrowUpRight } from 'lucide-react';

// Componente para animación de conteo numérico progresivo
export const AnimatedCounter = ({ targetValue = 0, duration = 1200, isCurrency = true }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayValue;
    const endValue = Number(targetValue) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing suave (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startValue + (endValue - startValue) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetValue, duration]);

  if (isCurrency) {
    return <span className="tabular-nums tracking-tight">₡{displayValue.toLocaleString('es-CR')}</span>;
  }
  return <span className="tabular-nums tracking-tight">{displayValue.toLocaleString('es-CR')}</span>;
};

export const AccountingKPIs = ({ metrics, onSelectTab }) => {
  const {
    totalRevenue = 0,
    totalExpenses = 0,
    netProfit = 0,
    activeApartadosCount = 0,
    pendingApartadosAmount = 0,
    activeContraEntregaCount = 0,
    pendingContraEntregaAmount = 0
  } = metrics || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* 1. INGRESOS TOTALES */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1E1035] to-[#120822] border border-white/[0.07] border-t-gold-DEFAULT/40 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.65)] space-y-2 hover:border-gold-DEFAULT/60 transition-all">
        <div className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gold-DEFAULT/15 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gold-light/90 truncate">
            Ingresos Totales
          </span>
          <div className="p-2 rounded-xl bg-gradient-to-br from-gold-DEFAULT/25 to-gold-DEFAULT/5 border border-gold-DEFAULT/30 text-gold-bright shrink-0 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="relative text-lg sm:text-2xl font-extrabold text-[#FFE08A] drop-shadow-[0_2px_8px_rgba(242,193,78,0.25)]">
          <AnimatedCounter targetValue={totalRevenue} />
        </div>
        <div className="relative pt-1.5 border-t border-white/[0.05] flex items-center justify-between text-[10px] sm:text-[11px] text-text-secondary">
          <span className="truncate">Ventas tienda + abonos</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-bright" />
        </div>
      </div>

      {/* 2. EGRESOS TOTALES */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1E1032] to-[#120822] border border-white/[0.07] border-t-rose-500/35 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.65)] space-y-2 hover:border-rose-500/55 transition-all">
        <div className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 rounded-full bg-rose-500/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-300/90 truncate">
            Egresos / Gastos
          </span>
          <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/25 text-rose-300 shrink-0 shadow-sm">
            <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="relative text-lg sm:text-2xl font-extrabold text-rose-300">
          <AnimatedCounter targetValue={totalExpenses} />
        </div>
        <div className="relative pt-1.5 border-t border-white/[0.05] flex items-center justify-between text-[10px] sm:text-[11px] text-text-secondary">
          <span className="truncate">Gastos y compras</span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        </div>
      </div>

      {/* 3. GANANCIA NETA */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#132328] via-[#131229] to-[#110820] border border-emerald-500/25 border-t-emerald-400/50 shadow-[0_12px_30px_-10px_rgba(16,185,129,0.2)] space-y-2 hover:border-emerald-400/70 transition-all">
        <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-emerald-500/15 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-300 truncate">
            Ganancia Neta
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 shrink-0 shadow-sm">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div
          className={`relative text-lg sm:text-2xl font-extrabold ${netProfit >= 0 ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.25)]' : 'text-rose-400'}`}
        >
          <AnimatedCounter targetValue={netProfit} />
        </div>
        <div className="relative pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] sm:text-[11px] text-emerald-200/80">
          <span className="truncate">Balance (Ingresos - Gastos)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        </div>
      </div>

      {/* 4. APARTADOS / A PAGOS */}
      <div
        onClick={() => onSelectTab && onSelectTab('apartados')}
        className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1E1032] to-[#120822] border border-white/[0.07] border-t-amber-400/35 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.65)] space-y-2 cursor-pointer hover:border-amber-400/60 transition-all group"
      >
        <div className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 rounded-full bg-amber-500/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300/90 truncate">
            A Pagos / Apartados
          </span>
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-300 group-hover:bg-amber-500/25 shrink-0 transition-colors">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="relative text-lg sm:text-2xl font-extrabold text-amber-300">
          <AnimatedCounter targetValue={pendingApartadosAmount} />
        </div>
        <div className="relative pt-1.5 border-t border-white/[0.05] text-[10px] sm:text-[11px] text-text-secondary flex items-center justify-between">
          <span className="truncate">
            {activeApartadosCount}{' '}
            {activeApartadosCount === 1 ? 'cliente activo' : 'clientes activos'}
          </span>
          <span className="text-amber-300 font-semibold text-[10px] flex items-center shrink-0 group-hover:translate-x-0.5 transition-transform">
            Ver <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>

      {/* 5. CONTRA ENTREGA (Ocupa ancho completo en 2 columnas de móvil para balance perfecto) */}
      <div
        onClick={() => onSelectTab && onSelectTab('contra_entrega')}
        className="col-span-2 sm:col-span-1 lg:col-span-1 relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1E1032] to-[#120822] border border-white/[0.07] border-t-sky-400/35 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.65)] space-y-2 cursor-pointer hover:border-sky-400/60 transition-all group"
      >
        <div className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 rounded-full bg-sky-500/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-sky-300/90 truncate">
            Contra Entrega
          </span>
          <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/25 text-sky-300 group-hover:bg-sky-500/25 shrink-0 transition-colors">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="relative text-lg sm:text-2xl font-extrabold text-sky-300">
          <AnimatedCounter targetValue={pendingContraEntregaAmount} />
        </div>
        <div className="relative pt-1.5 border-t border-white/[0.05] text-[10px] sm:text-[11px] text-text-secondary flex items-center justify-between">
          <span className="truncate">
            {activeContraEntregaCount}{' '}
            {activeContraEntregaCount === 1 ? 'pedido por cobrar' : 'pedidos por cobrar'}
          </span>
          <span className="text-sky-300 font-semibold text-[10px] flex items-center shrink-0 group-hover:translate-x-0.5 transition-transform">
            Ver <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountingKPIs;
