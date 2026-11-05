import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, FileSpreadsheet, Sparkles } from 'lucide-react';
import Button from '../../ui/Button';

export const AccountingChart = ({ charts, onExportExcel }) => {
  const [activePeriod, setActivePeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [viewMode, setViewMode] = useState('comparative'); // 'comparative' | 'income' | 'expense'

  const currentData =
    activePeriod === 'daily'
      ? charts?.daily || []
      : activePeriod === 'weekly'
        ? charts?.weekly || []
        : charts?.monthly || [];

  // Encontrar el valor máximo para escalar la altura de las barras
  const rawMax = Math.max(
    ...currentData.map((d) => {
      if (viewMode === 'income') return d.income || 0;
      if (viewMode === 'expense') return d.expense || 0;
      return Math.max(d.income || 0, d.expense || 0);
    }),
    10000 // Escala mínima si no hay datos
  );
  // Redondear tope de escala para eje Y limpio
  const maxVal = Math.ceil(rawMax / 5000) * 5000;

  const formatCompactAmount = (amt) => {
    if (!amt || amt === 0) return '₡0';
    const abs = Math.abs(amt);
    if (abs >= 1000000) {
      return `₡${(amt / 1000000).toFixed(1).replace('.0', '')}M`;
    }
    if (abs >= 1000) {
      return `₡${(amt / 1000).toFixed(amt % 1000 === 0 ? 0 : 1).replace('.0', '')}k`;
    }
    return `₡${amt.toLocaleString('es-CR')}`;
  };

  const periodTotals = currentData.reduce(
    (acc, item) => {
      acc.income += item.income || 0;
      acc.expense += item.expense || 0;
      return acc;
    },
    { income: 0, expense: 0 }
  );
  const periodNet = periodTotals.income - periodTotals.expense;

  const yAxisTicks = [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#180C2C]/95 to-[#110720]/95 border border-white/[0.07] border-t-gold-DEFAULT/30 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] space-y-5">
      {/* Encabezado y Filtros */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-gold-DEFAULT/25 to-gold-DEFAULT/5 border border-gold-DEFAULT/35 text-gold-bright shrink-0 shadow-sm mt-0.5">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-text-primary">
              {viewMode === 'income'
                ? 'Gráfica de Ingresos y Ventas (₡)'
                : viewMode === 'expense'
                  ? 'Gráfica de Egresos y Gastos (₡)'
                  : 'Gráfica de Ingresos vs Egresos (₡)'}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {viewMode === 'income'
                ? 'Visualiza el crecimiento de ingresos por ventas y abonos en colones.'
                : viewMode === 'expense'
                  ? 'Controla los desembolsos en mercadería, empaques y envíos.'
                  : 'Monitorea el flujo financiero de la boutique comparando ingresos contra egresos.'}
            </p>
          </div>
        </div>

        {/* Acciones: Selector de Vista, Filtros de período y botón de Excel */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Modo: Comparativa | Solo Ingresos | Solo Egresos */}
          <div className="flex rounded-xl bg-[#0A0412] p-1 border border-white/[0.07] text-xs shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('comparative')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'comparative'
                  ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Comparativa
            </button>
            <button
              type="button"
              onClick={() => setViewMode('income')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'income'
                  ? 'bg-emerald-500 text-white font-bold shadow-sm'
                  : 'text-text-secondary hover:text-emerald-400'
              }`}
            >
              Solo Ingresos
            </button>
            <button
              type="button"
              onClick={() => setViewMode('expense')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'expense'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'text-text-secondary hover:text-rose-400'
              }`}
            >
              Solo Egresos
            </button>
          </div>

          {/* Tabs Período: Día, Semana, Mes */}
          <div className="flex rounded-xl bg-[#0A0412] p-1 border border-white/[0.07] text-xs shadow-inner">
            <button
              type="button"
              onClick={() => setActivePeriod('daily')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activePeriod === 'daily'
                  ? 'bg-[#21113A] text-gold-bright font-bold shadow-sm border border-gold-DEFAULT/35'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Por Día
            </button>
            <button
              type="button"
              onClick={() => setActivePeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activePeriod === 'weekly'
                  ? 'bg-[#21113A] text-gold-bright font-bold shadow-sm border border-gold-DEFAULT/35'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Por Semana
            </button>
            <button
              type="button"
              onClick={() => setActivePeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activePeriod === 'monthly'
                  ? 'bg-[#21113A] text-gold-bright font-bold shadow-sm border border-gold-DEFAULT/35'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Por Mes
            </button>
          </div>

          {/* Botón Exportar a Excel */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={onExportExcel}
            className="bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20"
          >
            Exportar a Excel
          </Button>
        </div>
      </div>

      {/* Resumen Financiero del Período + Leyenda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.07]">
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
          {(viewMode === 'comparative' || viewMode === 'income') && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gradient-to-t from-emerald-600 to-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
              <span>Ingresos:</span>
              <strong className="text-emerald-300 tabular-nums">
                ₡{periodTotals.income.toLocaleString('es-CR')}
              </strong>
            </div>
          )}
          {(viewMode === 'comparative' || viewMode === 'expense') && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gradient-to-t from-rose-600 to-rose-400 inline-block shadow-[0_0_8px_rgba(251,113,133,0.4)]" />
              <span>Egresos:</span>
              <strong className="text-rose-300 tabular-nums">
                ₡{periodTotals.expense.toLocaleString('es-CR')}
              </strong>
            </div>
          )}
          {viewMode === 'comparative' && (
            <div className="flex items-center gap-1.5 text-gold-light">
              <Sparkles className="w-3.5 h-3.5 text-gold-bright" />
              <span>Balance del período:</span>
              <strong
                className={`tabular-nums ${periodNet >= 0 ? 'text-[#FFE08A]' : 'text-rose-400'}`}
              >
                {periodNet >= 0 ? '+' : ''}₡{periodNet.toLocaleString('es-CR')}
              </strong>
            </div>
          )}
        </div>
        <span className="text-[11px] text-text-muted">
          Pasa el cursor sobre cualquier columna para ver el desglose exacto
        </span>
      </div>

      {/* Contenedor de la Gráfica Financiera con Eje Y Real y Etiquetas Claras */}
      <div className="w-full overflow-x-auto pt-2 pb-1">
        <div className="min-w-[540px] sm:min-w-full rounded-2xl bg-[#090312] border border-white/[0.08] p-4 sm:p-6">
          <div className="flex items-stretch gap-3">
            {/* Eje Y Izquierdo (Escala en Colones) */}
            <div className="flex flex-col justify-between text-right pr-2 pt-10 pb-14 text-[10px] font-semibold text-text-muted tabular-nums select-none w-12 shrink-0">
              {yAxisTicks.map((val, i) => (
                <span key={i} className="leading-none">
                  {formatCompactAmount(val)}
                </span>
              ))}
            </div>

            {/* Área Principal del Gráfico */}
            <div className="flex-1 flex flex-col">
              {/* Zona de Barras con Cuadrícula Financiera */}
              <div className="h-56 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-10 border-b border-l border-white/[0.15] relative">
                {/* 4 Líneas guía horizontales */}
                <div className="pointer-events-none absolute inset-x-0 top-10 bottom-0 flex flex-col justify-between">
                  <div className="border-b border-dashed border-white/[0.07] w-full" />
                  <div className="border-b border-dashed border-white/[0.07] w-full" />
                  <div className="border-b border-dashed border-white/[0.07] w-full" />
                  <div className="border-b border-dashed border-white/[0.07] w-full" />
                  <div className="w-full" />
                </div>

                <AnimatePresence mode="wait">
                  {currentData.map((item, idx) => {
                    const inc = item.income || 0;
                    const exp = item.expense || 0;
                    const net = inc - exp;

                    const incomeHeight = inc > 0 ? Math.max(14, Math.round((inc / maxVal) * 175)) : 3;
                    const expenseHeight = exp > 0 ? Math.max(14, Math.round((exp / maxVal) * 175)) : 3;

                    const barWidthClass =
                      viewMode === 'comparative'
                        ? 'w-5 sm:w-7'
                        : 'w-8 sm:w-11';

                    return (
                      <div
                        key={`${activePeriod}-${viewMode}-${idx}`}
                        className="flex-1 flex flex-col items-center justify-end h-full group relative z-10 cursor-pointer"
                      >
                        {/* Fondo de columna sutil al hacer hover */}
                        <div className="pointer-events-none absolute inset-x-1 top-2 bottom-0 rounded-xl bg-white/[0.0] group-hover:bg-white/[0.03] transition-colors" />

                        {/* Tooltip Flotante 100% SÓLIDO Y OPACO arriba de la columna (Nunca tapa las barras) */}
                        <div
                          style={{ backgroundColor: '#090312' }}
                          className="pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 absolute -top-3 -translate-y-full left-1/2 -translate-x-1/2 z-40 px-3.5 py-2.5 rounded-xl border border-gold-DEFAULT shadow-[0_14px_35px_rgba(0,0,0,0.95)] text-[11px] whitespace-nowrap tabular-nums"
                        >
                          <p className="font-bold text-[#FFE08A] border-b border-white/10 pb-1 mb-1 text-xs">
                            {item.label || item.month}
                          </p>
                          {(viewMode === 'comparative' || viewMode === 'income') && (
                            <p className="text-emerald-300 font-semibold flex items-center justify-between gap-3">
                              <span>Ingresos:</span>
                              <span className="font-bold">₡{inc.toLocaleString('es-CR')}</span>
                            </p>
                          )}
                          {(viewMode === 'comparative' || viewMode === 'expense') && (
                            <p className="text-rose-300 font-semibold flex items-center justify-between gap-3">
                              <span>Egresos:</span>
                              <span className="font-bold">₡{exp.toLocaleString('es-CR')}</span>
                            </p>
                          )}
                          {viewMode === 'comparative' && (
                            <p
                              className={`pt-1 mt-1 border-t border-white/10 flex items-center justify-between gap-3 font-extrabold ${
                                net >= 0 ? 'text-[#FFE08A]' : 'text-rose-400'
                              }`}
                            >
                              <span>Neto:</span>
                              <span>₡{net.toLocaleString('es-CR')}</span>
                            </p>
                          )}
                        </div>

                        {/* Barras con su etiqueta numérica clara encima de cada barra activa */}
                        <div className="flex items-end gap-1.5 sm:gap-2 w-full justify-center relative z-10">
                          {(viewMode === 'comparative' || viewMode === 'income') && (
                            <div className="flex flex-col items-center">
                              {inc > 0 && (
                                <span
                                  style={{ backgroundColor: '#0B0414' }}
                                  className="mb-1 px-1.5 py-0.5 rounded border border-emerald-400/50 text-[10px] font-extrabold text-emerald-300 shadow-md tabular-nums whitespace-nowrap"
                                >
                                  {formatCompactAmount(inc)}
                                </span>
                              )}
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${incomeHeight}px` }}
                                transition={{ duration: 0.5, delay: idx * 0.03 }}
                                className={`${barWidthClass} ${
                                  inc > 0
                                    ? 'bg-gradient-to-t from-emerald-700 via-emerald-500 to-emerald-300 border-t-2 border-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.35)]'
                                    : 'bg-white/[0.08]'
                                } rounded-t-md group-hover:brightness-110 transition-all`}
                              />
                            </div>
                          )}

                          {(viewMode === 'comparative' || viewMode === 'expense') && (
                            <div className="flex flex-col items-center">
                              {exp > 0 && (
                                <span
                                  style={{ backgroundColor: '#0B0414' }}
                                  className="mb-1 px-1.5 py-0.5 rounded border border-rose-400/50 text-[10px] font-extrabold text-rose-300 shadow-md tabular-nums whitespace-nowrap"
                                >
                                  {formatCompactAmount(exp)}
                                </span>
                              )}
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${expenseHeight}px` }}
                                transition={{ duration: 0.5, delay: idx * 0.03 }}
                                className={`${barWidthClass} ${
                                  exp > 0
                                    ? 'bg-gradient-to-t from-rose-700 via-rose-500 to-rose-300 border-t-2 border-rose-100 shadow-[0_0_16px_rgba(244,63,94,0.35)]'
                                    : 'bg-white/[0.08]'
                                } rounded-t-md group-hover:brightness-110 transition-all`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Fila del Eje X: Etiquetas de Día/Mes y Balance Neto */}
              <div className="flex items-start justify-between gap-2 sm:gap-4 px-2 pt-3 pb-1">
                {currentData.map((item, idx) => {
                  const net = (item.income || 0) - (item.expense || 0);

                  return (
                    <div key={idx} className="flex-1 text-center min-w-0 tabular-nums">
                      <span className="block text-xs font-bold text-text-primary capitalize truncate">
                        {item.label || item.month}
                      </span>
                      <span
                        className={`inline-block text-[11px] font-extrabold mt-1 px-1.5 py-0.5 rounded ${
                          viewMode === 'income'
                            ? (item.income || 0) > 0
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'text-text-muted'
                            : viewMode === 'expense'
                              ? (item.expense || 0) > 0
                                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                : 'text-text-muted'
                              : net > 0
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : net < 0
                                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                  : 'text-text-muted'
                        }`}
                      >
                        {viewMode === 'income'
                          ? formatCompactAmount(item.income)
                          : viewMode === 'expense'
                            ? formatCompactAmount(item.expense)
                            : net > 0
                              ? `+${formatCompactAmount(net)}`
                              : net < 0
                                ? `-${formatCompactAmount(Math.abs(net))}`
                                : '₡0'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingChart;
