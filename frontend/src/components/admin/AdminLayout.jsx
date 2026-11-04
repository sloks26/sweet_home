import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Sliders,
  Image as ImageIcon,
  BookOpen,
  ArrowLeft,
  LogOut,
  MoreHorizontal,
  X,
  ShieldCheck,
  Package,
  FolderTree,
  Settings
} from 'lucide-react';
import Logo, { LogoEmblem } from '../ui/Logo';
import Badge from '../ui/Badge';
import { getAdminGreeting } from '../../utils/adminGreeting';

export const AdminLayout = ({
  activeTab,
  onSelectTab,
  onExitAdmin,
  authUser,
  onLogout,
  pendingVouchersCount = 0,
  children
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Pedidos & SINPE',
      icon: ShoppingBag,
      badge: pendingVouchersCount > 0 ? pendingVouchersCount : null
    },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'categories', label: 'Categorías', icon: FolderTree },
    { id: 'banners', label: 'Banners y Carrusel', icon: Sliders },
    { id: 'media', label: 'Biblioteca de Medios', icon: ImageIcon },
    { id: 'our-story', label: 'Nuestra Historia', icon: BookOpen },
    { id: 'settings', label: 'Ajustes de Tienda', icon: Settings }
  ];

  const primaryMobileTabs = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Pedidos',
      icon: ShoppingBag,
      badge: pendingVouchersCount > 0 ? pendingVouchersCount : null
    },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'banners', label: 'Contenido', icon: Sliders }
  ];

  const secondaryMenuItems = [
    { id: 'categories', label: 'Categorías', icon: FolderTree },
    { id: 'media', label: 'Biblioteca de Medios', icon: ImageIcon },
    { id: 'our-story', label: 'Nuestra Historia', icon: BookOpen },
    { id: 'settings', label: 'Ajustes de Tienda', icon: Settings }
  ];

  const currentTabObj = menuItems.find((t) => t.id === activeTab) || menuItems[0];

  return (
    <div className="min-h-screen bg-[#0F071A] text-text-primary flex flex-col lg:flex-row">
      {/* Sidebar para Escritorio (Fijo a la izquierda) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#140A22] border-r border-gold-DEFAULT/20 p-5 shrink-0 justify-between min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          <div className="pb-4 border-b border-night-750">
            <Logo size="sm" />
            <div className="mt-3 flex items-center justify-between">
              <Badge variant="gold" size="sm" withDot>
                Panel Boutique
              </Badge>
              <span className="text-[10px] text-text-muted">v2.0</span>
            </div>
          </div>

          {/* Menú de Navegación Escritorio */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark text-night-950 font-bold shadow-gold-sm'
                      : 'text-text-secondary hover:text-gold-light hover:bg-[#1C0F30]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-400 text-night-950 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer del Sidebar Escritorio */}
        <div className="pt-4 border-t border-night-750 space-y-2.5">
          <div className="px-3 py-2.5 rounded-xl bg-[#1C0F30] border border-gold-DEFAULT/25">
            <p className="text-[10px] uppercase font-bold text-gold-DEFAULT tracking-wider">
              Sesión Activa
            </p>
            <p className="text-xs font-semibold text-text-primary mt-0.5 truncate">
              {getAdminGreeting(authUser)}
            </p>
            <p className="text-[10px] text-text-muted truncate">{authUser?.email}</p>
          </div>

          <button
            onClick={onExitAdmin}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-text-secondary hover:text-gold-light hover:bg-[#1C0F30] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gold-bright" />
            <span>Volver a la Tienda</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-status-error hover:bg-status-error/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Encabezado Compacto del Panel (Escritorio y Móvil) */}
        <header className="h-14 sm:h-16 border-b border-gold-DEFAULT/15 bg-[#140A22]/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="lg:hidden">
              <LogoEmblem className="w-8 h-8" withGlow={false} />
            </div>
            <div>
              <h1 className="font-serif text-base sm:text-xl font-bold text-text-primary leading-tight">
                {currentTabObj.label}
              </h1>
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sweet Home CR • San José</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C0F30] border border-gold-DEFAULT/25 text-xs text-gold-light">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
              <span className="font-semibold">{getAdminGreeting(authUser)}</span>
            </div>

            <button
              onClick={onExitAdmin}
              className="min-h-[40px] px-3 sm:px-3.5 py-1.5 rounded-xl border border-gold-DEFAULT/40 text-xs font-semibold text-gold-light hover:bg-[#1C0F30] hover:border-gold-bright transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gold-bright" />
              <span>Ver Tienda</span>
            </button>
          </div>
        </header>

        {/* Cuerpo del Panel (Con padding inferior en móvil para la barra de navegación) */}
        <main className="flex-1 p-3.5 sm:p-8 pb-28 lg:pb-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* BARRA INFERIOR FIJA PARA MÓVILES (Bottom Navigation Bar) */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#12071F]/98 border-t border-gold-DEFAULT/25 backdrop-blur-lg flex items-center justify-around h-16 px-1 shadow-[0_-4px_25px_rgba(0,0,0,0.6)]"
        aria-label="Navegación principal móvil"
      >
        {primaryMobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                onSelectTab(tab.id);
                setIsMoreMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 transition-all relative cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-gold-bright font-bold'
                  : 'text-text-secondary hover:text-gold-light'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${isActive ? 'scale-110 text-gold-bright drop-shadow-[0_0_8px_rgba(242,193,78,0.5)]' : ''}`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-amber-400 text-night-950 animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 tracking-tight ${isActive ? 'text-gold-bright font-bold' : ''}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Botón "Más" que abre el resto de secciones */}
        <button
          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 transition-all relative cursor-pointer active:scale-95 ${
            isMoreMenuOpen || secondaryMenuItems.some((s) => s.id === activeTab)
              ? 'text-gold-bright font-bold'
              : 'text-text-secondary hover:text-gold-light'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[11px] mt-1">Más</span>
        </button>
      </nav>

      {/* DRAWER / BOTTOM SHEET PARA "MÁS OPCIONES" EN MÓVIL */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            onClick={() => setIsMoreMenuOpen(false)}
            className="fixed inset-0 bg-night-950/80 backdrop-blur-sm transition-opacity"
          />
          <div className="relative bg-[#160B26] border-t border-gold-DEFAULT/30 rounded-t-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-night-700">
              <div className="flex items-center gap-2">
                <LogoEmblem className="w-7 h-7" withGlow={false} />
                <h3 className="font-serif text-base font-bold text-text-primary">
                  Más Secciones del Panel
                </h3>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#1C0F30] border border-gold-DEFAULT/25 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-gold-DEFAULT tracking-wider">
                  Sesión Activa
                </p>
                <p className="text-xs font-semibold text-text-primary mt-0.5">
                  {getAdminGreeting(authUser)}
                </p>
                <p className="text-[10px] text-text-muted truncate">{authUser?.email}</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-status-success shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {secondaryMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark text-night-950 font-bold border-gold-bright'
                        : 'bg-[#1C0F32] border-night-700/80 text-text-secondary hover:text-gold-light'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-night-700/80 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onExitAdmin();
                }}
                className="flex-1 min-h-[44px] py-2 px-3 rounded-xl border border-gold-DEFAULT/40 text-xs font-semibold text-gold-light flex items-center justify-center gap-2 hover:bg-[#1C0F30] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-gold-bright" />
                <span>Ver Tienda</span>
              </button>

              <button
                onClick={onLogout}
                className="min-h-[44px] py-2 px-4 rounded-xl border border-status-error/40 text-xs font-semibold text-status-error flex items-center justify-center gap-1.5 hover:bg-status-error/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
