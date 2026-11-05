import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Check,
  Layers,
  Plus,
  Package
} from 'lucide-react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

export const AdminCategoryRow = ({
  cat,
  index,
  totalCount,
  onMoveOrder,
  onEdit,
  onDelete,
  addingSubcatFor,
  setAddingSubcatFor,
  newSubcatName,
  setNewSubcatName,
  onAddSubcategory,
  onDeleteSubcategory
}) => {
  const subcats = cat.subcategories || [];
  const prodCount = cat._count?.products || 0;

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#180C2C]/95 to-[#110720]/95 border border-white/[0.07] border-t-gold-DEFAULT/30 overflow-hidden transition-all shadow-[0_12px_30px_-10px_rgba(0,0,0,0.55)]">
      {/* Fila Principal de la Categoría */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Controles de orden flechas */}
          <div className="flex flex-col border border-white/[0.08] rounded-xl overflow-hidden bg-[#0B0414] shrink-0">
            <button
              disabled={index === 0}
              onClick={() => onMoveOrder(index, -1)}
              className="p-1.5 text-text-muted hover:text-gold-bright hover:bg-white/[0.05] disabled:opacity-20 cursor-pointer"
              title="Subir posición en el menú de la tienda"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={index === totalCount - 1}
              onClick={() => onMoveOrder(index, 1)}
              className="p-1.5 text-text-muted hover:text-gold-bright hover:bg-white/[0.05] disabled:opacity-20 cursor-pointer"
              title="Bajar posición en el menú de la tienda"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Número de orden */}
          <div className="px-2.5 py-1.5 rounded-xl bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 text-gold-bright font-extrabold text-xs flex flex-col items-center justify-center shrink-0 tabular-nums">
            <span className="text-[9px] uppercase tracking-wider text-gold-light/70 leading-none">
              Posición
            </span>
            <span className="mt-0.5">#{index + 1}</span>
          </div>

          {/* Info de la Categoría */}
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-text-primary">
                {cat.name}
              </h3>
              {cat.isAdult && (
                <Badge variant="adult" size="sm">
                  🔞 +18
                </Badge>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-medium text-text-secondary tabular-nums">
                <Package className="w-3 h-3 text-gold-bright" />
                {prodCount} {prodCount === 1 ? 'producto' : 'productos'}
              </span>
            </div>
            <p className="text-xs text-text-secondary truncate max-w-xl">
              {cat.description || 'Departamento visible en el menú principal de la tienda'}
            </p>
          </div>
        </div>

        {/* Acciones de la Categoría Principal */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <Button
            variant="secondary"
            size="sm"
            icon={Edit2}
            onClick={() => onEdit(cat)}
            className="border-white/[0.1] hover:border-gold-DEFAULT/50"
          >
            Editar Nombre
          </Button>

          <button
            onClick={() => onDelete(cat.id, cat.name)}
            className="p-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
            title="Eliminar categoría"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subcategorías Siempre Visibles y Fáciles de Entender */}
      <div className="bg-[#0B0414]/75 border-t border-white/[0.06] px-5 py-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <Layers className="w-3.5 h-3.5 text-gold-bright" />
            <span className="font-semibold text-gold-light">
              Subcategorías dentro de {cat.name} ({subcats.length}):
            </span>
          </div>

          {/* Botón directo para agregar subcategoría */}
          {addingSubcatFor !== cat.id && (
            <button
              onClick={() => setAddingSubcatFor(cat.id)}
              className="px-2.5 py-1 rounded-lg bg-gold-DEFAULT/15 border border-gold-DEFAULT/35 text-xs text-gold-bright hover:bg-gold-DEFAULT/25 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Subcategoría</span>
            </button>
          )}
        </div>

        {/* Formulario rápido de agregar subcategoría */}
        {addingSubcatFor === cat.id && (
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-3 rounded-xl bg-[#160B28] border border-gold-DEFAULT/40">
            <input
              type="text"
              value={newSubcatName}
              onChange={(e) => setNewSubcatName(e.target.value)}
              placeholder={`Nueva subcategoría en ${cat.name} (ej. Cocina, Sala, Bolsos...)`}
              className="flex-1 bg-[#090312] text-text-primary text-xs rounded-xl px-3 py-2 border border-white/[0.12] focus:outline-none focus:border-gold-DEFAULT"
              autoFocus
            />
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={() => onAddSubcategory(cat.id)}
            >
              Guardar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAddingSubcatFor(null);
                setNewSubcatName('');
              }}
            >
              Cancelar
            </Button>
          </div>
        )}

        {/* Chips / Etiquetas de Subcategorías siempre visibles */}
        {subcats.length === 0 ? (
          <div className="text-xs text-text-muted italic py-1">
            Este departamento aún no tiene subcategorías. Haz clic en "+ Agregar Subcategoría".
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subcats.map((sub) => (
              <div
                key={sub.id}
                className="px-3 py-1.5 rounded-xl bg-[#170B2A] border border-white/[0.08] hover:border-gold-DEFAULT/35 flex items-center gap-2 text-xs transition-colors"
              >
                <span className="font-medium text-text-primary">{sub.name}</span>
                <button
                  onClick={() => onDeleteSubcategory(sub.id, sub.name)}
                  className="text-text-muted hover:text-rose-400 transition-colors cursor-pointer"
                  title={`Eliminar subcategoría ${sub.name}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryRow;
