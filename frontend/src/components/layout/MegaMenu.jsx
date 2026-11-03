import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronRight, ShieldAlert, Lock } from 'lucide-react';

export const MegaMenu = ({
  category,
  isOpen,
  onClose,
  onSelectCategory,
  onMouseEnter,
  onMouseLeave
}) => {
  const [displayCategory, setDisplayCategory] = useState(category);
  const [isFading, setIsFading] = useState(false);

  // Transición suave (150ms) entre categorías sin parpadeos de apertura/cierre
  useEffect(() => {
    if (!category) return;
    if (category.slug !== displayCategory?.slug) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setDisplayCategory(category);
        setIsFading(false);
      }, 120);
      return () => clearTimeout(timer);
    } else {
      setDisplayCategory(category);
    }
  }, [category]);

  if (!isOpen || !displayCategory) return null;

  const currentCat = displayCategory;
  const subcategories = currentCat.subcategories || [];

  // Regla A1: "Bienestar Íntimo (+18): sin fotografía en el menú. Solo texto, íconos y la etiqueta +18."
  // Además, si category.image es nulo o vacío, NO mostrar la tarjeta de foto.
  const hasImage = Boolean(currentCat.image && !currentCat.isAdult);

  const handleSubClick = (e, subSlug) => {
    e.preventDefault();
    onClose();
    if (onSelectCategory) {
      onSelectCategory(currentCat.slug, subSlug);
    }
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="region"
      aria-label={`Mega menú de ${currentCat.name}`}
      className="absolute top-full left-0 right-0 z-50 bg-[#12071F] border-b-2 border-gold-DEFAULT/30 shadow-2xl transition-all select-none"
      style={{
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(212, 175, 55, 0.08)'
      }}
    >
      {/* Zona puente de tolerancia para evitar que el cursor pierda foco al bajar al menú */}
      <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent pointer-events-auto" />

      <div
        className={`max-w-7xl mx-auto py-8 px-6 lg:px-12 transition-opacity duration-150 ease-out ${
          isFading ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Columna 1: Presentación de la Categoría */}
          <div
            className={`${
              hasImage ? 'col-span-12 lg:col-span-3' : 'col-span-12 lg:col-span-4'
            } space-y-3.5 pr-6 border-b lg:border-b-0 lg:border-r border-night-700/60 pb-6 lg:pb-0`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/35 text-gold-light text-xs font-semibold tracking-wide">
              {currentCat.isAdult ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-bold">Verificación +18</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-gold-bright" />
                  <span>{currentCat.menuBadge || 'Colección Selecta'}</span>
                </>
              )}
            </div>

            <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {currentCat.name}
            </h3>

            <p className="text-[14px] text-[#D8CCE0] leading-relaxed font-sans">
              {currentCat.description || 'Detalles únicos preparados con el estándar de elegancia y amor de Sweet Home & Boutique CR.'}
            </p>

            {currentCat.isAdult && (
              <div className="p-3 rounded-xl bg-night-900/90 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
                <span className="font-bold flex items-center gap-1 text-amber-300">
                  <ShieldAlert className="w-4 h-4" /> Discreción Absoluta
                </span>
                <p className="text-[13px] leading-snug text-[#E2D4E8]">
                  Envío 100% confidencial en paquete neutro sellado sin marcas exteriores.
                </p>
              </div>
            )}

            <a
              href={`#${currentCat.slug}`}
              onClick={(e) => handleSubClick(e, null)}
              className="inline-flex items-center gap-2 text-sm text-gold-bright font-bold hover:text-gold-light transition-colors pt-2 group"
            >
              <span>Ver todo en {currentCat.name}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Columna 2: Subcategorías (Se expande si no hay imagen para no dejar huecos) */}
          <div
            className={`${
              hasImage
                ? 'col-span-12 lg:col-span-5 grid grid-cols-2 gap-6'
                : 'col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-6'
            }`}
          >
            {hasImage ? (
              // 2 Columnas balanceadas cuando hay foto destacada
              <>
                <div>
                  <span className="text-[13px] font-semibold text-gold-light/95 uppercase tracking-widest block mb-3 border-b border-gold-DEFAULT/25 pb-1.5">
                    Líneas Destacadas
                  </span>
                  <ul className="space-y-1.5">
                    {subcategories.slice(0, Math.ceil(subcategories.length / 2)).map((sub) => (
                      <li key={sub.id || sub.slug}>
                        <a
                          href={`#${currentCat.slug}-${sub.slug}`}
                          onClick={(e) => handleSubClick(e, sub.slug)}
                          className="text-[15px] font-medium text-[#EAE0EE] hover:text-gold-light flex items-center gap-2 py-1.5 group transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-gold-bright/60 group-hover:text-gold-bright group-hover:translate-x-1 transition-all" />
                          <span>{sub.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[13px] font-semibold text-gold-light/95 uppercase tracking-widest block mb-3 border-b border-gold-DEFAULT/25 pb-1.5">
                    Variedades
                  </span>
                  <ul className="space-y-1.5">
                    {subcategories.slice(Math.ceil(subcategories.length / 2)).map((sub) => (
                      <li key={sub.id || sub.slug}>
                        <a
                          href={`#${currentCat.slug}-${sub.slug}`}
                          onClick={(e) => handleSubClick(e, sub.slug)}
                          className="text-[15px] font-medium text-[#EAE0EE] hover:text-gold-light flex items-center gap-2 py-1.5 group transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-gold-bright/60 group-hover:text-gold-bright group-hover:translate-x-1 transition-all" />
                          <span>{sub.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              // 3 Columnas balanceadas cuando NO hay foto (ej: Bienestar Íntimo o categorías sin foto)
              Array.from({ length: 3 }).map((_, colIdx) => {
                const chunkSize = Math.ceil(subcategories.length / 3);
                const colSubs = subcategories.slice(colIdx * chunkSize, (colIdx + 1) * chunkSize);
                if (colSubs.length === 0) return null;

                const colTitles = ['Líneas Principales', 'Opciones & Variedad', 'Complementos'];

                return (
                  <div key={colIdx}>
                    <span className="text-[13px] font-semibold text-gold-light/95 uppercase tracking-widest block mb-3 border-b border-gold-DEFAULT/25 pb-1.5">
                      {colTitles[colIdx] || 'Líneas'}
                    </span>
                    <ul className="space-y-1.5">
                      {colSubs.map((sub) => (
                        <li key={sub.id || sub.slug}>
                          <a
                            href={`#${currentCat.slug}-${sub.slug}`}
                            onClick={(e) => handleSubClick(e, sub.slug)}
                            className="text-[15px] font-medium text-[#EAE0EE] hover:text-gold-light flex items-center gap-2 py-1.5 group transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-gold-bright/60 group-hover:text-gold-bright group-hover:translate-x-1 transition-all" />
                            <span>{sub.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>

          {/* Columna 3: Tarjeta Fotográfica Destacada (SOLO SI TIENE FOTO Y NO ES ADULTO) */}
          {hasImage && (
            <div className="col-span-12 lg:col-span-4 pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-night-700/60 pt-6 lg:pt-0">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-night-950 border border-gold-DEFAULT/30 group shadow-xl">
                <img
                  src={currentCat.image}
                  alt={currentCat.menuTitle || currentCat.name}
                  width="480"
                  height="300"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                />

                {/* Degradado para legibilidad del texto sin apagar la foto */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12071F] via-[#12071F]/40 to-transparent flex flex-col justify-end p-5">
                  {currentCat.menuBadge && (
                    <span className="text-[13px] text-gold-bright font-bold uppercase tracking-wider block mb-1">
                      {currentCat.menuBadge}
                    </span>
                  )}

                  <h4 className="font-serif text-lg font-bold text-white tracking-tight">
                    {currentCat.menuTitle || currentCat.name}
                  </h4>

                  <a
                    href={currentCat.menuLink || `#${currentCat.slug}`}
                    onClick={(e) => handleSubClick(e, null)}
                    className="mt-2.5 text-[14px] text-gold-light inline-flex items-center gap-1.5 hover:text-gold-bright font-semibold group/btn"
                  >
                    <span>Explorar catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
