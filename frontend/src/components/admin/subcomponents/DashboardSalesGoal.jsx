import React, { useState, useEffect } from 'react';
import { Target, Sparkles, TrendingUp, Edit3, Check } from 'lucide-react';
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
    <div className="p-5 sm:p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/25 space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gold-DEFAULT/15 text-gold-bright">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-text-primary capitalize flex items-center gap-2">
              <span>Meta Mensual • {currentMonthName}</span>
              {percentage >= 100 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
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
            className="text-xs text-gold-bright hover:underline flex items-center gap-1 font-medium"
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
              className="w-24 bg-night-950 text-white rounded-lg px-2 py-1 text-xs border border-gold-DEFAULT focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSaveGoal}
              className="p-1 rounded bg-gold-DEFAULT text-night-950 hover:bg-gold-light"
              title="Guardar meta"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Montos y Porcentaje */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-gold-bright">
            ₡{currentSales.toLocaleString('es-CR')}
          </span>
          <span className="text-xs text-text-muted">de ₡{goal.toLocaleString('es-CR')}</span>
        </div>
        <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span>{percentage}% Alcanzado</span>
        </div>
      </div>

      {/* Barra de Progreso Animada */}
      <div className="space-y-1.5">
        <div className="w-full h-3.5 rounded-full bg-night-950 overflow-hidden border border-night-700 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold-DEFAULT to-gold-light shadow-sm"
          />
        </div>
        <div className="flex justify-between text-[11px] text-text-muted pt-0.5">
          <span>0%</span>
          {remainingToGoal > 0 ? (
            <span className="text-amber-300 font-medium">
              Faltan ₡{remainingToGoal.toLocaleString('es-CR')}
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
