import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export const HeaderSearchBar = ({
  onSelectCategory,
  onSelectProduct,
  isMobileSearchOpen,
  setIsMobileSearchOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounce = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) setSearchResults(res.data || []);
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    if (onSelectCategory && searchQuery.trim()) {
      onSelectCategory(null, null, searchQuery.trim());
    }
  };

  return (
    <>
      {/* Centro: Buscador Amplio y Centrado en Escritorio */}
      <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg mx-auto relative">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsSearchOpen(false);
                if (onSelectCategory) onSelectCategory(null, null, searchQuery);
              }
            }}
            placeholder="Buscar en fragancias, cuidado, moda, hogar..."
            className="w-full bg-night-800/90 text-text-primary placeholder:text-text-muted/65 text-xs rounded-full pl-9 pr-8 py-2.5 border border-gold-DEFAULT/25 focus:outline-none focus:border-gold-DEFAULT shadow-inner transition-all"
          />
          <Search className="w-4 h-4 text-gold-bright absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Resultados Flotantes de Búsqueda */}
        {isSearchOpen && searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-night-950 border border-gold-DEFAULT/30 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-night-800 animate-fadeIn">
            {isSearching ? (
              <div className="p-4 text-center text-xs text-text-muted">Buscando en catálogo...</div>
            ) : searchResults.length > 0 ? (
              <>
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      if (onSelectProduct) onSelectProduct(item);
                    }}
                    className="p-3 flex items-center gap-3 hover:bg-night-850 transition-colors cursor-pointer"
                  >
                    <img
                      src={item.images?.[0]?.url}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-night-900 shrink-0 border border-night-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-text-primary truncate">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-text-muted block">
                        {item.category?.name}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gold-light">
                      ₡{item.price.toLocaleString('es-CR')}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    if (onSelectCategory) onSelectCategory(null, null, searchQuery);
                  }}
                  className="w-full p-2.5 text-center text-xs text-gold-bright hover:text-gold-light bg-night-900 font-medium"
                >
                  Ver todos los resultados para "{searchQuery}" →
                </button>
              </>
            ) : (
              <div className="p-4 text-center text-xs text-text-muted">
                No encontramos resultados para "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desplegable de Búsqueda Móvil */}
      {isMobileSearchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 p-3 bg-night-950/98 border-b border-gold-DEFAULT/30 shadow-2xl animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, marcas, colecciones..."
              className="w-full bg-night-800 text-text-primary placeholder:text-text-muted text-xs rounded-xl pl-9 pr-8 py-2.5 border border-gold-DEFAULT/30 focus:outline-none focus:border-gold-DEFAULT"
            />
            <Search className="w-4 h-4 text-gold-bright absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default HeaderSearchBar;
