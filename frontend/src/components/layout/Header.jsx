import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingBag, User, Truck, Menu, Search, X } from 'lucide-react';
import Logo from '../ui/Logo';
import MobileMenuDrawer from './MobileMenuDrawer';
import HeaderPromoBar from './subcomponents/HeaderPromoBar';
import HeaderSearchBar from './subcomponents/HeaderSearchBar';
import HeaderCategoryBar from './subcomponents/HeaderCategoryBar';
import { getAdminGreeting } from '../../utils/adminGreeting';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

export const Header = ({
  categories = [],
  onOpenAdminLogin,
  onOpenAdminPanel,
  authUser,
  onLogout,
  onSelectCategory,
  onSelectProduct,
  onNavigateHome,
  onOpenTracking,
  onMegaMenuToggle,
  storeSettings
}) => {
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Estados de Smart Sticky Header
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);

  // Notificar al carrusel para pausar el autoplay cuando el menú esté abierto
  useEffect(() => {
    if (onMegaMenuToggle) {
      onMegaMenuToggle(!!activeMegaMenu);
    }
  }, [activeMegaMenu, onMegaMenuToggle]);

  const { getTotalCount, getSubtotal, openDrawer } = useCartStore();
  const wishlistCount = useWishlistStore((state) => state.getCount());

  const cartCount = getTotalCount();
  const cartSubtotal = getSubtotal();

  // Listener de Scroll Optimizado con Smart Header
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Se considera scrolleado después de 35px
          setIsScrolled(currentScrollY > 35);

          // Si hace scroll hacia abajo más de 80px y bajando, ocultar
          if (currentScrollY > 80 && currentScrollY > lastScrollYRef.current) {
            setIsHeaderHidden(true);
            setActiveMegaMenu(null);
          } else {
            // Si hace scroll hacia arriba o está arriba, mostrar
            setIsHeaderHidden(false);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
        isHeaderHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* 1. Franja de Anuncios Delgada */}
      <HeaderPromoBar
        isScrolled={isScrolled}
        onOpenTracking={onOpenTracking}
        storeSettings={storeSettings}
      />

      {/* 2. FILA PRINCIPAL COMPACTA DE ~64px (h-16) */}
      <div
        className={`w-full h-16 px-4 sm:px-8 transition-all duration-300 relative ${
          isScrolled
            ? 'bg-night-950/95 backdrop-blur-md border-b border-gold-DEFAULT/20 shadow-xl'
            : 'bg-night-900/90 backdrop-blur-sm border-b border-gold-DEFAULT/10'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-3 sm:gap-6">
          {/* Lado Izquierdo: Botón Menú Móvil + Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-text-secondary hover:text-gold-light hover:bg-night-800 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateHome) onNavigateHome();
              }}
              className="inline-block"
            >
              <Logo size="small" />
            </a>
          </div>

          {/* Centro: Buscador Amplio y Centrado */}
          <HeaderSearchBar
            onSelectCategory={onSelectCategory}
            onSelectProduct={onSelectProduct}
            isMobileSearchOpen={isMobileSearchOpen}
            setIsMobileSearchOpen={setIsMobileSearchOpen}
          />

          {/* Lado Derecho: Acciones (Búsqueda Móvil, Favoritos, Carrito, Usuario) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Ícono de Búsqueda en Móvil */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 rounded-xl text-text-secondary hover:text-gold-light hover:bg-night-800 transition-colors"
              aria-label="Buscar en la tienda"
            >
              {isMobileSearchOpen ? (
                <X className="w-5 h-5 text-gold-bright" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>

            {/* Favoritos */}
            <a
              href="#favoritos"
              className="relative p-2 rounded-xl text-text-secondary hover:text-gold-light hover:bg-night-800 transition-colors"
              title="Favoritos"
            >
              <Heart className="w-5 h-5 sm:w-4 sm:h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-nebula-magenta text-[9px] font-bold text-white flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>

            {/* Carrito de Compras con Contador */}
            <button
              onClick={openDrawer}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-night-800/90 border border-gold-DEFAULT/30 hover:border-gold-DEFAULT/70 hover:bg-night-700/80 transition-all shadow-gold-sm"
              aria-label="Abrir Carrito"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-gold-bright" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-gold-metallic text-[9px] font-bold text-night-950 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[9px] text-text-muted leading-none">Carrito</span>
                <span className="text-xs font-bold text-gold-light leading-none mt-0.5">
                  ₡{cartSubtotal.toLocaleString('es-CR')}
                </span>
              </div>
            </button>

            {/* Rastreo y Envíos (Camioncito de Envíos siempre presente) */}
            <button
              onClick={onOpenTracking}
              className="p-2 rounded-xl text-text-secondary hover:text-gold-light hover:bg-night-800 transition-colors"
              title="Rastreo y Estado de Pedido"
              aria-label="Rastreo de Pedido"
            >
              <Truck className="w-5 h-5 sm:w-4 sm:h-4 text-gold-bright" />
            </button>

            {/* Acceso de Administración (Solo visible cuando Vanessa/Staff ha iniciado sesión) */}
            {authUser && (
              <div className="flex items-center gap-1 pl-1 border-l border-gold-DEFAULT/20">
                <button
                  onClick={onOpenAdminPanel}
                  className="p-2 rounded-xl text-text-secondary hover:text-gold-light hover:bg-night-800 transition-colors"
                  title={getAdminGreeting(authUser)}
                >
                  <User className="w-5 h-5 sm:w-4 sm:h-4 text-gold-bright" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-xl text-text-muted hover:text-status-error hover:bg-status-error/10 transition-colors"
                  title="Cerrar sesión de administración"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BARRA DE CATEGORÍAS Y MEGA-MENÚ */}
      <HeaderCategoryBar
        categories={categories}
        isScrolled={isScrolled}
        activeMegaMenu={activeMegaMenu}
        setActiveMegaMenu={setActiveMegaMenu}
        onSelectCategory={onSelectCategory}
      />

      {/* Drawer Móvil Lateral */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        authUser={authUser}
        onOpenAdminLogin={onOpenAdminLogin}
        onOpenAdminPanel={onOpenAdminPanel}
        onLogout={onLogout}
        onSelectCategory={onSelectCategory}
        onOpenTracking={onOpenTracking}
      />
    </header>
  );
};

export default Header;
