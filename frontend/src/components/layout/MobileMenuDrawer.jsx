import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Package,
  Lock,
  KeyRound,
  Sliders,
  LogOut,
  User,
  Search
} from 'lucide-react';
import Logo from '../ui/Logo';
import Badge from '../ui/Badge';
import { useAgeGateStore } from '../../store/ageGateStore';

const fallbackCategories = [
  { id: '1', name: 'Hogar', slug: 'hogar' },
  { id: '2', name: 'Moda', slug: 'moda' },
  { id: '3', name: 'Accesorios', slug: 'accesorios' },
  { id: '4', name: 'Belleza', slug: 'belleza' },
  { id: '5', name: 'Perfumes', slug: 'perfumes' },
  { id: '6', name: 'Maquillaje', slug: 'maquillaje' },
  { id: '7', name: 'Cuidado Personal', slug: 'cuidado-personal' },
  { id: '8', name: 'Bienestar Íntimo (+18)', slug: 'bienestar-intimo', isAdult: true },
  { id: '9', name: 'Novedades y Regalos', slug: 'novedades-regalos' },
  { id: '10', name: 'Omnilife y Más', slug: 'omnilife-y-mas' }
];

export const MobileMenuDrawer = ({
  isOpen,
  onClose,
  categories = [],
  authUser,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onLogout,
  onSelectCategory,
  onOpenTracking
}) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [drawerSearch, setDrawerSearch] = useState('');
  const { isAdultVerified, promptAgeGate } = useAgeGateStore();

  const displayCategories = categories && categories.length > 0 ? categories : fallbackCategories;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (drawerSearch.trim()) {
      onClose();
      if (onSelectCategory) {
        onSelectCategory(null, null, drawerSearch.trim());
      }
    }
  };

  const toggleAccordion = (slug) => {
    setExpandedCategory(expandedCategory === slug ? null : slug);
  };

  const handleCategoryClick = (cat) => {
    if (cat.isAdult && !isAdultVerified) {
      promptAgeGate(cat.slug);
      onClose();
      return;
    }
    toggleAccordion(cat.slug);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden lg:hidden">
          {/* Backdrop Oscuro y Sólido que cubre toda la pantalla */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-night-950/85 backdrop-blur-sm z-[100]"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10 z-[101]">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-xs sm:max-w-sm bg-[#0E051C] border-r border-gold-DEFAULT/30 shadow-2xl flex flex-col h-full overflow-hidden"
            >
              {/* Header del Menú Móvil */}
              <div className="p-4 border-b border-night-700/60 bg-night-950 flex items-center justify-between shrink-0">
                <Logo size="sm" />
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-gold-light hover:bg-night-800 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Buscador Rápido Superior */}
              <div className="p-3.5 border-b border-night-700/50 bg-night-900 shrink-0">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={drawerSearch}
                    onChange={(e) => setDrawerSearch(e.target.value)}
                    placeholder="Buscar producto, categoría..."
                    className="w-full bg-night-800 text-text-primary placeholder:text-text-muted/60 text-xs rounded-xl pl-9 pr-8 py-2.5 border border-gold-DEFAULT/25 focus:outline-none focus:border-gold-DEFAULT transition-all"
                  />
                  <Search className="w-4 h-4 text-gold-bright absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {drawerSearch && (
                    <button
                      type="button"
                      onClick={() => setDrawerSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>
              </div>

              {/* Categorías con Acordeón y Scroll fluido */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1 divide-y divide-night-700/40">
                <div className="pb-3 text-xs font-semibold text-gold-light uppercase tracking-wider">
                  Categorías Principales
                </div>

                {displayCategories.map((cat) => {
                  const isExpanded = expandedCategory === cat.slug;
                  const subcats = cat.subcategories || [];

                  return (
                    <div key={cat.id || cat.slug} className="pt-2">
                      <button
                        onClick={() => handleCategoryClick(cat)}
                        className="w-full flex items-center justify-between py-2 text-sm font-medium text-text-primary hover:text-gold-light transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          {cat.isAdult && <Badge variant="adult" size="sm">🔞 +18</Badge>}
                          <span>{cat.name}</span>
                        </span>
                        {subcats.length > 0 ? (
                          <ChevronDown
                            className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-gold-bright' : ''
                            }`}
                          />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-text-muted" />
                        )}
                      </button>

                      {/* Subcategorías desplegables */}
                      <AnimatePresence>
                        {isExpanded && subcats.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 py-1.5 space-y-2 border-l border-gold-DEFAULT/30 ml-2"
                          >
                            {subcats.map((sub) => (
                              <a
                                key={sub.id || sub.slug}
                                href={`#${cat.slug}-${sub.slug}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onClose();
                                  if (onSelectCategory) onSelectCategory(cat.slug, sub.slug);
                                }}
                                className="block text-xs text-text-secondary hover:text-gold-light py-1"
                              >
                                {sub.name}
                              </a>
                            ))}
                            <a
                              href={`#${cat.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                if (onSelectCategory) onSelectCategory(cat.slug, null);
                              }}
                              className="block text-xs text-gold-bright font-semibold pt-1"
                            >
                              Ver todo en {cat.name} →
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Enlaces Rápidos en Footer del Drawer */}
              <div className="p-4 border-t border-night-700/60 bg-night-950 shrink-0 space-y-2.5 text-xs text-text-secondary">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenTracking) onOpenTracking();
                  }}
                  className="flex items-center gap-2 hover:text-gold-light py-1 text-left w-full cursor-pointer"
                >
                  <Package className="w-4 h-4 text-gold-bright" />
                  <span>Seguimiento de Pedido</span>
                </button>
                <a
                  href="https://wa.me/50664656625?text=Hola%20Sweet%20Home,%20deseo%20hacer%20una%20consulta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gold-light py-1"
                >
                  <MessageCircle className="w-4 h-4 text-status-success" />
                  <span>Atención por WhatsApp</span>
                </a>
                {authUser ? (
                  <div className="pt-2 border-t border-night-700/60 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gold-light">
                      <User className="w-4 h-4 text-status-success" />
                      <span className="font-semibold">{authUser.name}</span>
                    </div>
                    {(authUser.role === 'ADMIN' || authUser.role === 'STAFF') && (
                      <button
                        onClick={() => {
                          onClose();
                          if (onOpenAdminPanel) onOpenAdminPanel();
                        }}
                        className="w-full flex items-center gap-2 text-xs text-gold-bright font-semibold hover:text-gold-light py-1 cursor-pointer"
                      >
                        <Sliders className="w-4 h-4" />
                        <span>Ir al Panel de Administración</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onClose();
                        if (onLogout) onLogout();
                      }}
                      className="w-full flex items-center gap-2 text-xs text-status-error hover:opacity-80 py-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenAdminLogin) onOpenAdminLogin();
                    }}
                    className="flex items-center gap-2 hover:text-gold-light py-1 text-left w-full cursor-pointer text-text-muted"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Iniciar Sesión / Mi Cuenta</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MobileMenuDrawer;