import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export const CatalogToolbar = ({
  totalProducts,
  activeCategoryObj,
  selectedCategory,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-night-700/60">
      <div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-text-primary tracking-tight">
          {activeCategoryObj ? activeCategoryObj.name : 'Catálogo Exclusivo'}
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Mostrando <strong>{totalProducts}</strong> productos de alta calidad y diseño boutique
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* Selector de Orden */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-text-muted hidden md:inline">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-night-900 text-text-primary rounded-xl px-3 py-2 text-xs border border-night-600 focus:outline-none focus:border-gold-DEFAULT cursor-pointer"
          >
            <option value="newest">Más recientes</option>
            <option value="price_asc">Precio: de menor a mayor</option>
            <option value="price_desc">Precio: de mayor a menor</option>
            <option value="best_seller">Más populares</option>
            <option value="rating">Mejor calificados</option>
          </select>
        </div>

        {/* Toggle de Cuadrícula / Lista */}
        <div className="flex items-center border border-night-700 rounded-xl overflow-hidden bg-night-900 p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-gold-metallic text-night-950 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
            title="Vista en Cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-gold-metallic text-night-950 shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
            title="Vista en Lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogToolbar;
