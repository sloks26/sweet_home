import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronRight, X, PackageX } from 'lucide-react';
import ProductCard from '../home/ProductCard';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import CatalogSidebar from './subcomponents/CatalogSidebar';
import CatalogToolbar from './subcomponents/CatalogToolbar';

export const CatalogPage = ({
  initialCategory = null,
  initialSearch = '',
  categories = [],
  onSelectProduct,
  onBackToHome
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxDbPrice, setMaxDbPrice] = useState(100000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sort: sortBy
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (priceRange[1] < maxDbPrice) params.append('maxPrice', priceRange[1]);
      if (onlyInStock) params.append('inStock', 'true');
      if (onlyOnSale) params.append('onSale', 'true');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        const prodList = Array.isArray(data.data) ? data.data : data.data?.products || [];
        const pagination = data.pagination || data.data?.pagination || {};
        setProducts(prodList);
        setTotalPages(pagination.totalPages || 1);
        setTotalProducts(pagination.total !== undefined ? pagination.total : prodList.length);

        const maxP = data.priceRange?.max || data.data?.maxPrice;
        if (maxP && maxP > maxDbPrice) {
          setMaxDbPrice(maxP);
        }
      }
    } catch (err) {
      console.error('Error fetching catalog products:', err);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    sortBy,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    priceRange,
    maxDbPrice,
    onlyInStock,
    onlyOnSale
  ]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setSelectedSubcategory(null);
      setCurrentPage(1);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setPriceRange([0, maxDbPrice]);
    setOnlyInStock(false);
    setOnlyOnSale(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const activeSubcategories = activeCategoryObj?.subcategories || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 select-none">
      {/* 1. Miga de Pan (Breadcrumbs) */}
      <nav className="flex items-center gap-2 text-xs text-text-muted">
        <button
          onClick={onBackToHome}
          className="hover:text-gold-light transition-colors cursor-pointer"
        >
          Inicio
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-secondary">Catálogo</span>
        {activeCategoryObj && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gold-light font-semibold">{activeCategoryObj.name}</span>
          </>
        )}
      </nav>

      {/* 2. Barra de Botones Móviles para Filtros */}
      <div className="flex lg:hidden items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          icon={Filter}
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex-1"
        >
          Filtrar Catálogo {selectedCategory ? `(${activeCategoryObj?.name})` : ''}
        </Button>
      </div>

      {/* 3. Barra Superior del Catálogo */}
      <CatalogToolbar
        totalProducts={totalProducts}
        activeCategoryObj={activeCategoryObj}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* 4. Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar para escritorio */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28">
          <CatalogSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            activeSubcategories={activeSubcategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxDbPrice={maxDbPrice}
            onlyInStock={onlyInStock}
            setOnlyInStock={setOnlyInStock}
            onlyOnSale={onlyOnSale}
            setOnlyOnSale={setOnlyOnSale}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Listado de Productos */}
        <section className="lg:col-span-9 space-y-8">
          {/* Pills de Filtros Activos */}
          {(selectedCategory ||
            selectedSubcategory ||
            searchQuery ||
            onlyInStock ||
            onlyOnSale) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-text-muted">Filtros activos:</span>
              {selectedCategory && (
                <span className="px-2.5 py-1 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 text-gold-light flex items-center gap-1.5">
                  {activeCategoryObj?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSubcategory && (
                <span className="px-2.5 py-1 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 text-gold-light flex items-center gap-1.5">
                  {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-full bg-night-700 border border-night-600 text-text-primary flex items-center gap-1.5">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {onlyInStock && (
                <span className="px-2.5 py-1 rounded-full bg-status-success/15 border border-status-success/30 text-status-success flex items-center gap-1.5">
                  En Stock
                  <button onClick={() => setOnlyInStock(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {onlyOnSale && (
                <span className="px-2.5 py-1 rounded-full bg-nebula-magenta/15 border border-nebula-magenta/30 text-nebula-light flex items-center gap-1.5">
                  En Oferta
                  <button onClick={() => setOnlyOnSale(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-gold-bright hover:underline ml-2 cursor-pointer"
              >
                Limpiar todos
              </button>
            </div>
          )}

          {/* Skeletons o Grid de Productos */}
          {loading ? (
            <div
              className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
              }`}
            >
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-gold-DEFAULT/15 p-3 space-y-3 bg-night-900/60"
                >
                  <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
                  <Skeleton className="w-3/4 h-4 rounded-lg" />
                  <Skeleton className="w-1/2 h-5 rounded-lg" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 px-4 space-y-4 rounded-3xl bg-night-900/40 border border-night-700/60">
              <div className="w-16 h-16 rounded-full bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 flex items-center justify-center mx-auto text-gold-bright">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
                No encontramos productos con estos filtros
              </h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                Prueba relajando tu búsqueda, cambiando la categoría o ajustando el rango de precios
                en colones.
              </p>
              <Button variant="primary" size="sm" onClick={handleResetFilters}>
                Ver Todo el Catálogo
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
              }`}
            >
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                />
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-night-700/60">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
              >
                Anterior
              </Button>
              <div className="text-xs text-text-secondary px-3">
                Página <strong className="text-gold-light">{currentPage}</strong> de {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
              >
                Siguiente
              </Button>
            </div>
          )}
        </section>
      </div>

      {/* Drawer Móvil de Filtros */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-night-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-sm bg-night-900 border-r border-gold-DEFAULT/30 h-full p-6 overflow-y-auto z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-night-700">
                <span className="font-serif text-lg font-bold text-text-primary">Filtros</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <CatalogSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
                activeSubcategories={activeSubcategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxDbPrice={maxDbPrice}
                onlyInStock={onlyInStock}
                setOnlyInStock={setOnlyInStock}
                onlyOnSale={onlyOnSale}
                setOnlyOnSale={setOnlyOnSale}
                onResetFilters={handleResetFilters}
              />

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Ver {totalProducts} Resultados
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogPage;
