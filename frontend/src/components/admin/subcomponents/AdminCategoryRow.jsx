import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Check,
  FolderTree,
  ChevronDown,
  Layers,
  Plus
} from 'lucide-react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

export const AdminCategoryRow = ({
  cat,
  index,
  totalCount,
  isExpanded,
  onToggleExpand,
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
    <div className="rounded-2xl bg-[#140A22] border border-gold-DEFAULT/20 overflow-hidden transition-all shadow-sm">
      {/* Fila Principal de la Categoría */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Controles de orden flechas */}
          <div className="flex flex-col border border-night-700 rounded-xl overflow-hidden bg-night-900 shrink-0">
            <button
              disabled={index === 0}
              onClick={() => onMoveOrder(index, -1)}
              className="p-1 text-text-muted hover:text-gold-light hover:bg-night-800 disabled:opacity-20"
              title="Subir posición"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={index === totalCount - 1}
              onClick={() => onMoveOrder(index, 1)}
              className="p-1 text-text-muted hover:text-gold-light hover:bg-night-800 disabled:opacity-20"
              title="Bajar posición"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Número de orden */}
          <span className="w-7 h-7 rounded-lg bg-night-700/80 text-gold-light font-bold text-xs flex items-center justify-center shrink-0">
            #{index + 1}
          </span>

          {/* Info de la Categoría */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-text-primary">{cat.name}</h3>
              {cat.isAdult && (
                <Badge variant="adult" size="sm">
                  🔞 +18
                </Badge>
              )}
              <span className="text-[11px] text-text-muted">({prodCount} productos)</span>
            </div>
            <p className="text-xs text-text-secondary truncate max-w-md">
              {cat.description || 'Sin descripción'}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          {/* Botón para desplegar subcategorías */}
          <button
            onClick={onToggleExpand}
            className="px-3 py-1.5 rounded-xl bg-night-700/70 hover:bg-night-600 text-xs text-text-secondary hover:text-gold-light flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-gold-bright" />
            <span>Subcategorías ({subcats.length})</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          <Button variant="secondary" size="sm" icon={Edit2} onClick={() => onEdit(cat)}>
            Editar
          </Button>

          <button
            onClick={() => onDelete(cat.id, cat.name)}
            className="p-2 rounded-xl border border-status-error/30 text-status-error hover:bg-status-error/20 transition-colors"
            title="Eliminar categoría"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subcategorías Desplegables */}
      {isExpanded && (
        <div className="bg-night-900/90 border-t border-night-700/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gold-bright uppercase tracking-wider flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              <span>Subcategorías de {cat.name}</span>
            </h4>

            {/* Botón para abrir campo de agregar subcategoría */}
            {addingSubcatFor !== cat.id && (
              <button
                onClick={() => setAddingSubcatFor(cat.id)}
                className="text-xs text-gold-bright hover:text-gold-light flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Subcategoría</span>
              </button>
            )}
          </div>

          {/* Formulario rápido de agregar subcategoría */}
          {addingSubcatFor === cat.id && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-night-800 border border-gold-DEFAULT/30">
              <input
                type="text"
                value={newSubcatName}
                onChange={(e) => setNewSubcatName(e.target.value)}
                placeholder="Nombre de la nueva subcategoría..."
                className="flex-1 bg-night-900 text-text-primary text-xs rounded-xl px-3 py-2 border border-night-600 focus:outline-none focus:border-gold-DEFAULT"
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

          {/* Chips / Lista de Subcategorías */}
          {subcats.length === 0 ? (
            <div className="text-xs text-text-muted italic">
              No hay subcategorías en este departamento aún.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {subcats.map((sub) => (
                <div
                  key={sub.id}
                  className="px-3 py-1.5 rounded-xl bg-night-800 border border-night-700 flex items-center gap-2 text-xs"
                >
                  <span className="font-medium text-text-primary">{sub.name}</span>
                  <button
                    onClick={() => onDeleteSubcategory(sub.id, sub.name)}
                    className="text-text-muted hover:text-status-error transition-colors"
                    title="Eliminar subcategoría"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCategoryRow;
