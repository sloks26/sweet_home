import React, { useState } from 'react';
import { Target, TrendingUp, Edit3, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardSalesGoal = ({ currentSales = 0 }) => {
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('sh_monthly_goal');
    return saved ? parseFloat(saved) : 1000000; // ₡1,000,000 por defecto
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal.toString());

  const now = new Date();
  const currentMonthName = now.toLocaleDateString('es-CR', { month: 'long' });
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();

  const percentage = Math.min(100, Math.round(((currentSales || 0) / (goal || 1)) * 100));
  const remainingToGoal = Math.max(0, goal - currentSales);

  const handleSaveGoal = () => {
    const val = parseFloat(tempGoal);
    if (val && val > 0) {
      setGoal(val);
      localStorage.setItem('sh_monthly_goal', val.toString());
    }
    setIsEditing(false);
  };

  return (
    <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#180C2C] via-[#130922] to-[#180C2C] border border-white/[0.07] border-t-gold-DEFAULT/35 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] space-y-4">
      <div className="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gold-DEFAULT/10 blur-3xl" />

      {/* Encabezado */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-gold-DEFAULT/25 to-gold-DEFAULT/5 border border-gold-DEFAULT/35 text-gold-bright shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-text-primary capitalize flex items-center gap-2">
              <span>Meta Mensual • {currentMonthName}</span>
              {percentage >= 100 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  ¡Meta Cumplida! 🎉
                </span>
              )}
            </h3>
            <p className="text-xs text-text-secondary">
              Quedan {daysLeft} {daysLeft === 1 ? 'día' : 'días'} para cerrar el mes con éxito.
            </p>
          </div>
        </div>

        {/* Botón editar meta */}
        {!isEditing ? (
          <button
            type="button"
            onClick={() => {
              setTempGoal(goal.toString());
              setIsEditing(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 text-xs text-gold-bright hover:bg-gold-DEFAULT/20 flex items-center gap-1.5 font-semibold transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ajustar Meta</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              className="w-28 bg-[#0B0414] text-white rounded-xl px-2.5 py-1.5 text-xs border border-gold-DEFAULT focus:outline-none tabular-nums"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSaveGoal}
              className="p-1.5 rounded-xl bg-gold-DEFAULT text-night-950 hover:bg-gold-light cursor-pointer"
              title="Guardar meta"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Montos y Porcentaje */}
      <div className="relative flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#FFE08A] drop-shadow-[0_2px_10px_rgba(242,193,78,0.25)] tabular-nums">
            ₡{currentSales.toLocaleString('es-CR')}
          </span>
          <span className="text-xs font-medium text-text-secondary tabular-nums">
            de ₡{goal.toLocaleString('es-CR')}
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300 inline-flex items-center gap-1.5 w-fit tabular-nums">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{percentage}% Alcanzado</span>
        </div>
      </div>

      {/* Barra de Progreso Animada con Efecto Oro Líquido */}
      <div className="relative space-y-1.5">
        <div className="w-full h-4 rounded-full bg-[#0A0412] overflow-hidden border border-white/[0.08] p-0.5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-gold-DEFAULT to-amber-200 shadow-[0_0_16px_rgba(242,193,78,0.45)]"
          />
        </div>
        <div className="flex justify-between text-[11px] text-text-muted pt-0.5 tabular-nums">
          <span>0%</span>
          {remainingToGoal > 0 ? (
            <span className="text-amber-300/90 font-semibold">
              Faltan ₡{remainingToGoal.toLocaleString('es-CR')} para la meta
            </span>
          ) : (
            <span className="text-emerald-400 font-bold">¡Objetivo superado!</span>
          )}
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSalesGoal;
