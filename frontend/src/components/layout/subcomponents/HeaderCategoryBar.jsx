import React, { useRef } from 'react';
import {
  ChevronDown,
  Sparkles,
  Home,
  Shirt,
  Watch,
  Heart,
  Smile,
  ShieldCheck,
  Lock,
  Gift,
  Activity
} from 'lucide-react';
import MegaMenu from '../MegaMenu';
import { useAgeGateStore } from '../../../store/ageGateStore';

export const HeaderCategoryBar = ({
  categories = [],
  isScrolled,
  activeMegaMenu,
  setActiveMegaMenu,
  onSelectCategory
}) => {
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const { isAdultVerified, promptAgeGate } = useAgeGateStore();

  const handleMouseEnterCategory = (cat) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (activeMegaMenu) {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      setActiveMegaMenu(cat);
    } else {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      openTimerRef.current = setTimeout(() => {
        setActiveMegaMenu(cat);
      }, 120);
    }
  };

  const handleMouseLeaveCategory = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 250);
  };

  const handleKeepMenuOpen = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  const handleCategoryClick = (e, cat) => {
    const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;
    if (isTouch) {
      if (!activeMegaMenu || activeMegaMenu.slug !== cat.slug) {
        e.preventDefault();
        setActiveMegaMenu(cat);
        return;
      }
    }

    e.preventDefault();
    setActiveMegaMenu(null);
    if (cat.isAdult && !isAdultVerified) {
      promptAgeGate(cat.slug);
      return;
    }
    if (onSelectCategory) {
      onSelectCategory(cat.slug);
    }
  };

  const getCategoryIcon = (slug) => {
    const iconClass =
      'w-3.5 h-3.5 shrink-0 opacity-75 group-hover:opacity-100 group-hover:text-gold-bright transition-colors';
    switch (slug) {
      case 'hogar':
        return <Home className={iconClass} />;
      case 'moda':
        return <Shirt className={iconClass} />;
      case 'accesorios':
        return <Watch className={iconClass} />;
      case 'belleza':
        return <Sparkles className={iconClass} />;
      case 'perfumes':
        return <Heart className={iconClass} />;
      case 'maquillaje':
        return <Smile className={iconClass} />;
      case 'cuidado-personal':
        return <ShieldCheck className={iconClass} />;
      case 'bienestar-intimo':
        return <Lock className={iconClass} />;
      case 'novedades-regalos':
        return <Gift className={iconClass} />;
      case 'omnilife-y-mas':
        return <Activity className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div
      id="category-bar-container"
      onMouseEnter={handleKeepMenuOpen}
      onMouseLeave={handleMouseLeaveCategory}
      className={`hidden lg:block w-full border-b border-gold-DEFAULT/15 bg-night-950/95 backdrop-blur-md transition-all duration-300 ease-in-out relative ${
        isScrolled
          ? 'max-h-0 opacity-0 overflow-hidden py-0 border-transparent'
          : 'max-h-12 opacity-100 py-1.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 flex items-center justify-between xl:justify-center gap-0.5 xl:gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {categories.slice(0, 7).map((cat) => {
          const isMegaOpen = activeMegaMenu?.slug === cat.slug;

          return (
            <div
              key={cat.id || cat.slug}
              onMouseEnter={() => handleMouseEnterCategory(cat)}
              className="relative py-0.5 shrink-0"
            >
              <a
                href={`#${cat.slug}`}
                role="button"
                aria-haspopup="true"
                aria-expanded={isMegaOpen}
                onClick={(e) => handleCategoryClick(e, cat)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveMegaMenu(isMegaOpen ? null : cat);
                  } else if (e.key === 'Escape') {
                    setActiveMegaMenu(null);
                  }
                }}
                className={`px-2.5 xl:px-3 py-1 rounded-lg text-xs xl:text-[13px] font-medium tracking-wide flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isMegaOpen
                    ? 'text-gold-bright bg-night-800/90 shadow-sm'
                    : 'text-text-secondary hover:text-gold-light hover:bg-night-800/50'
                }`}
              >
                {getCategoryIcon(cat.slug)}
                <span className="whitespace-nowrap">{cat.name}</span>
                {cat.isAdult && (
                  <span className="text-[9px] px-1 py-0.5 rounded bg-night-900 text-gold-bright border border-gold-DEFAULT/25 font-bold leading-none shrink-0">
                    +18
                  </span>
                )}
                <ChevronDown
                  className={`w-3 h-3 text-text-muted transition-transform duration-200 shrink-0 ${isMegaOpen ? 'rotate-180 text-gold-bright' : 'opacity-50'}`}
                />
              </a>
            </div>
          );
        })}

        {categories.length > 7 && (
          <div
            onMouseEnter={() => handleMouseEnterCategory(categories[7])}
            className="relative py-0.5 shrink-0"
          >
            <button
              role="button"
              aria-haspopup="true"
              aria-expanded={
                activeMegaMenu && categories.slice(7).some((c) => c.slug === activeMegaMenu?.slug)
              }
              onClick={(e) => handleCategoryClick(e, categories[7])}
              className={`px-2.5 xl:px-3 py-1 rounded-lg text-xs xl:text-[13px] font-semibold text-gold-bright hover:text-gold-light hover:bg-night-800/50 flex items-center gap-1 whitespace-nowrap shrink-0 transition-all ${
                activeMegaMenu && categories.slice(7).some((c) => c.slug === activeMegaMenu?.slug)
                  ? 'bg-night-800/90 shadow-sm'
                  : ''
              }`}
            >
              <span className="whitespace-nowrap">Más Colecciones</span>
              <ChevronDown className="w-3 h-3 text-gold-bright shrink-0" />
            </button>
          </div>
        )}
      </div>

      {/* MEGA-MENÚ FLOTANTE */}
      <div id="mega-menu-container">
        <MegaMenu
          category={activeMegaMenu}
          isOpen={!!activeMegaMenu}
          onClose={() => setActiveMegaMenu(null)}
          onSelectCategory={onSelectCategory}
          onMouseEnter={handleKeepMenuOpen}
          onMouseLeave={handleMouseLeaveCategory}
        />
      </div>
    </div>
  );
};

export default HeaderCategoryBar;
