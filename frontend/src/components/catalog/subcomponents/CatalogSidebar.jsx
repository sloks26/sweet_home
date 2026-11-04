import React from 'react';
import { SlidersHorizontal, RotateCcw, Search, X, Check } from 'lucide-react';
import Badge from '../../ui/Badge';

export const CatalogSidebar = ({
  searchQuery,
  setSearchQuery,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  activeSubcategories = [],
  priceRange,
  setPriceRange,
  maxDbPrice,
  onlyInStock,
  setOnlyInStock,
  onlyOnSale,
  setOnlyOnSale,
  onResetFilters
}) => {
  return (
    <div className="p-6 rounded-3xl bg-night-800/80 border border-gold-DEFAULT/25 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-night-700/60 pb-3">
        <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gold-bright" />
          <span>Filtros</span>
        </h3>
        <button
          onClick={onResetFilters}
          className="text-xs text-text-muted hover:text-gold-light flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpiar</span>
        </button>
      </div>

      {/* Búsqueda por texto */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gold-bright uppercase tracking-wider block">
          Búsqueda
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en catálogo..."
            className="w-full bg-night-900 text-text-primary text-xs rounded-xl pl-8 pr-3 py-2 border border-night-600 focus:outline-none focus:border-gold-DEFAULT"
          />
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-primary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Lista de Categorías */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gold-bright uppercase tracking-wider block">
          Categorías
        </label>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubcategory(null);
            }}
            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
              !selectedCategory
                ? 'bg-gold-DEFAULT/20 text-gold-light font-bold border border-gold-DEFAULT/40'
                : 'text-text-secondary hover:text-gold-light hover:bg-night-700/50'
            }`}
          >
            <span>Todas</span>
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => {
                  setSelectedCategory(isSelected ? null : cat.slug);
                  setSelectedSubcategory(null);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gold-DEFAULT/20 text-gold-light font-bold border border-gold-DEFAULT/40'
                    : 'text-text-secondary hover:text-gold-light hover:bg-night-700/50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {cat.isAdult && (
                  <Badge variant="adult" size="sm">
                    +18
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategorías de la categoría activa */}
      {activeSubcategories.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-night-700/60">
          <label className="text-xs font-semibold text-gold-bright uppercase tracking-wider block">
            Subcategorías
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {activeSubcategories.map((sub) => {
              const isSelected = selectedSubcategory === sub.slug;
              return (
                <button
                  key={sub.id || sub.slug}
                  onClick={() => setSelectedSubcategory(isSelected ? null : sub.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gold-metallic text-night-950 font-bold'
                      : 'text-text-secondary hover:text-gold-light hover:bg-night-700/40'
                  }`}
                >
                  <span className="truncate">{sub.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rango de Precios en Colones ₡ */}
      <div className="space-y-3 pt-2 border-t border-night-700/60">
        <label className="text-xs font-semibold text-gold-bright uppercase tracking-wider flex items-center justify-between">
          <span>Precio Máximo</span>
          <span className="text-gold-light font-bold">
            ₡{priceRange[1].toLocaleString('es-CR')}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max={maxDbPrice}
          step="1000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value, 10)])}
          className="w-full accent-gold-DEFAULT cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-text-muted">
          <span>₡0</span>
          <span>₡{maxDbPrice.toLocaleString('es-CR')}</span>
        </div>
      </div>

      {/* Filtros de Disponibilidad */}
      <div className="space-y-2.5 pt-2 border-t border-night-700/60 text-xs">
        <label className="flex items-center gap-2.5 cursor-pointer text-text-secondary hover:text-text-primary">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="rounded text-gold-DEFAULT focus:ring-gold-DEFAULT accent-gold-DEFAULT"
          />
          <span>Solo productos en existencia</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-text-secondary hover:text-text-primary">
          <input
            type="checkbox"
            checked={onlyOnSale}
            onChange={(e) => setOnlyOnSale(e.target.checked)}
            className="rounded text-gold-DEFAULT focus:ring-gold-DEFAULT accent-gold-DEFAULT"
          />
          <span>Solo artículos en oferta</span>
        </label>
      </div>
    </div>
  );
};

export default CatalogSidebar;
