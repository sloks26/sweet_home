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
    return <span>₡{displayValue.toLocaleString('es-CR')}</span>;
  }
  return <span>{displayValue.toLocaleString('es-CR')}</span>;
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
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
      {/* 1. INGRESOS TOTALES */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#160B24] border border-gold-DEFAULT/25 shadow-sm space-y-1.5 sm:space-y-2 hover:border-gold-DEFAULT/50 transition-all">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gold-light truncate">
            Ingresos Totales
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-base sm:text-2xl font-bold bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark bg-clip-text text-transparent">
          <AnimatedCounter targetValue={totalRevenue} />
        </div>
        <span className="text-[10px] sm:text-[11px] text-text-secondary block truncate">
          Ventas tienda + abonos
        </span>
      </div>

      {/* 2. EGRESOS TOTALES */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#160B24] border border-rose-500/25 shadow-sm space-y-1.5 sm:space-y-2 hover:border-rose-500/50 transition-all">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-rose-300 truncate">
            Egresos / Gastos
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-rose-500/15 text-rose-400 shrink-0">
            <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-base sm:text-2xl font-bold text-rose-300">
          <AnimatedCounter targetValue={totalExpenses} />
        </div>
        <span className="text-[10px] sm:text-[11px] text-text-secondary block truncate">
          Gastos y compras
        </span>
      </div>

      {/* 3. GANANCIA NETA */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#160B24] border border-emerald-500/30 shadow-sm space-y-1.5 sm:space-y-2 hover:border-emerald-500/60 transition-all">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-300 truncate">
            Ganancia Neta
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div
          className={`text-base sm:text-2xl font-extrabold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
        >
          <AnimatedCounter targetValue={netProfit} />
        </div>
        <span className="text-[10px] sm:text-[11px] text-text-secondary block truncate">
          Balance (Ingresos - Gastos)
        </span>
      </div>

      {/* 4. APARTADOS / A PAGOS */}
      <div
        onClick={() => onSelectTab && onSelectTab('apartados')}
        className="p-3.5 sm:p-5 rounded-2xl bg-[#160B24] border border-amber-500/25 shadow-sm space-y-1.5 sm:space-y-2 cursor-pointer hover:border-amber-400/60 transition-all group"
      >
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-amber-300 truncate">
            A Pagos / Apartados
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-amber-500/15 text-amber-300 group-hover:bg-amber-500/25 shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-base sm:text-2xl font-bold text-amber-300">
          <AnimatedCounter targetValue={pendingApartadosAmount} />
        </div>
        <span className="text-[10px] sm:text-[11px] text-text-secondary flex items-center justify-between">
          <span className="truncate">
            {activeApartadosCount}{' '}
            {activeApartadosCount === 1 ? 'cliente activo' : 'clientes activos'}
          </span>
          <span className="text-amber-300 text-[10px] underline flex items-center shrink-0">
            Ver <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
          </span>
        </span>
      </div>

      {/* 5. CONTRA ENTREGA (Ocupa ancho completo en 2 columnas de móvil para balance perfecto) */}
      <div
        onClick={() => onSelectTab && onSelectTab('contra_entrega')}
        className="col-span-2 sm:col-span-1 lg:col-span-1 p-3.5 sm:p-5 rounded-2xl bg-[#160B24] border border-sky-500/25 shadow-sm space-y-1.5 sm:space-y-2 cursor-pointer hover:border-sky-400/60 transition-all group"
      >
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-sky-300 truncate">
            Contra Entrega
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-sky-500/15 text-sky-300 group-hover:bg-sky-500/25 shrink-0">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div className="text-base sm:text-2xl font-bold text-sky-300">
          <AnimatedCounter targetValue={pendingContraEntregaAmount} />
        </div>
        <span className="text-[10px] sm:text-[11px] text-text-secondary flex items-center justify-between">
          <span>
            {activeContraEntregaCount}{' '}
            {activeContraEntregaCount === 1 ? 'pedido por cobrar' : 'pedidos por cobrar'}
          </span>
          <span className="text-sky-300 text-[10px] underline flex items-center shrink-0">
            Ver <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
          </span>
        </span>
      </div>
    </div>
  );
};

export default AccountingKPIs;
