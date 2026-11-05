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
  const maxVal = Math.max(
    ...currentData.map((d) => {
      if (viewMode === 'income') return d.income || 0;
      if (viewMode === 'expense') return d.expense || 0;
      return Math.max(d.income || 0, d.expense || 0);
    }),
    10000 // Escala mínima si no hay datos
  );

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

      {/* Leyenda explicativa interactiva */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-text-secondary pt-2 border-t border-white/[0.06]">
        {(viewMode === 'comparative' || viewMode === 'income') && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-gradient-to-t from-emerald-600 to-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
            <span>Ingresos (₡)</span>
          </div>
        )}
        {(viewMode === 'comparative' || viewMode === 'expense') && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-gradient-to-t from-rose-600 to-rose-400 inline-block shadow-[0_0_8px_rgba(251,113,133,0.4)]" />
            <span>Egresos / Gastos (₡)</span>
          </div>
        )}
        {viewMode === 'comparative' && (
          <div className="flex items-center gap-1.5 text-gold-light">
            <Sparkles className="w-3.5 h-3.5 text-gold-bright" />
            <span>Balance neto (Ingresos − Gastos)</span>
          </div>
        )}
      </div>

      {/* Contenedor de la Gráfica con barras animadas y números 100% visibles */}
      <div className="w-full overflow-x-auto pt-4 pb-1">
        <div className="min-w-[440px] sm:min-w-full flex flex-col rounded-2xl bg-[#0B0414]/70 border border-white/[0.05] p-3 sm:p-4">
          {/* Zona de Barras: Altura garantizada con líneas guía financieras */}
          <div className="h-48 sm:h-52 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-16 border-b border-white/[0.12] relative">
            {/* Líneas guía horizontales sutiles de terminal financiera */}
            <div className="pointer-events-none absolute inset-x-2 top-16 bottom-0 flex flex-col justify-between">
              <div className="border-b border-dashed border-white/[0.05] w-full" />
              <div className="border-b border-dashed border-white/[0.05] w-full" />
              <div className="border-b border-dashed border-white/[0.05] w-full" />
            </div>

            <AnimatePresence mode="wait">
              {currentData.map((item, idx) => {
                const incomeHeight = Math.max(6, Math.round(((item.income || 0) / maxVal) * 125));
                const expenseHeight = Math.max(6, Math.round(((item.expense || 0) / maxVal) * 125));
                const net = (item.income || 0) - (item.expense || 0);

                const barWidthClass =
                  viewMode === 'comparative'
                    ? 'max-w-[18px] sm:max-w-[26px]'
                    : 'max-w-[32px] sm:max-w-[46px]';

                return (
                  <div
                    key={`${activePeriod}-${viewMode}-${idx}`}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative z-10"
                  >
                    {/* Tooltip flotante al pasar el cursor o dedo */}
                    <div className="absolute top-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 bg-[#120722]/98 text-white px-3.5 py-2 rounded-xl border border-gold-DEFAULT/50 shadow-2xl text-[11px] whitespace-nowrap tabular-nums">
                      <p className="font-bold text-gold-light mb-0.5">{item.label || item.month}</p>
                      {(viewMode === 'comparative' || viewMode === 'income') && (
                        <p className="text-emerald-400 font-semibold">
                          Ingresos: ₡{(item.income || 0).toLocaleString('es-CR')}
                        </p>
                      )}
                      {(viewMode === 'comparative' || viewMode === 'expense') && (
                        <p className="text-rose-400 font-semibold">
                          Egresos: ₡{(item.expense || 0).toLocaleString('es-CR')}
                        </p>
                      )}
                      {viewMode === 'comparative' && (
                        <p
                          className={
                            net >= 0 ? 'text-gold-bright font-bold' : 'text-red-400 font-bold'
                          }
                        >
                          Neto: ₡{net.toLocaleString('es-CR')}
                        </p>
                      )}
                    </div>

                    {/* Barras animadas posadas sobre la línea base del eje */}
                    <div className="flex items-end gap-1 sm:gap-1.5 w-full justify-center">
                      {(viewMode === 'comparative' || viewMode === 'income') && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${incomeHeight}px` }}
                          transition={{ duration: 0.5, delay: idx * 0.03 }}
                          className={`w-full ${barWidthClass} bg-gradient-to-t from-emerald-600/90 via-emerald-500 to-emerald-300 border-t border-emerald-200 rounded-t-md shadow-[0_0_12px_rgba(16,185,129,0.25)] relative group-hover:brightness-125 transition-all`}
                        />
                      )}
                      {(viewMode === 'comparative' || viewMode === 'expense') && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${expenseHeight}px` }}
                          transition={{ duration: 0.5, delay: idx * 0.03 }}
                          className={`w-full ${barWidthClass} bg-gradient-to-t from-rose-600/90 via-rose-500 to-rose-300 border-t border-rose-200 rounded-t-md shadow-[0_0_12px_rgba(244,63,94,0.25)] relative group-hover:brightness-125 transition-all`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Fila del Eje X: Etiquetas de Día/Mes y Montos en Colones completamente despegados y legibles */}
          <div className="flex items-start justify-between gap-2 sm:gap-4 px-2 pt-3 pb-1">
            {currentData.map((item, idx) => {
              const net = (item.income || 0) - (item.expense || 0);

              const formatCompactAmount = (amt) => {
                if (!amt || amt === 0) return '₡0';
                const abs = Math.abs(amt);
                if (abs >= 1000000) {
                  return `₡${(amt / 1000000).toFixed(1).replace('.0', '')}M`;
                }
                if (abs >= 1000) {
                  return `₡${(amt / 1000).toFixed(0)}k`;
                }
                return `₡${amt.toLocaleString('es-CR')}`;
              };

              return (
                <div key={idx} className="flex-1 text-center min-w-0 tabular-nums">
                  <span className="block text-[11px] font-semibold text-text-primary capitalize truncate">
                    {item.label || item.month}
                  </span>
                  <span
                    className={`block text-xs font-bold mt-1 tracking-tight leading-normal ${
                      viewMode === 'income'
                        ? 'text-emerald-400'
                        : viewMode === 'expense'
                          ? 'text-rose-400'
                          : net > 0
                            ? 'text-emerald-400'
                            : net < 0
                              ? 'text-rose-400'
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
  );
};

export default AccountingChart;
