import React, { useState, useRef } from 'react';
import { Sparkles, Flame, Award, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';

export const ProductSection = ({ products = [], onSelectProduct, onNavigateCatalog }) => {
  const [activeTab, setActiveTab] = useState('new'); // 'new', 'bestseller', 'offers'
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const scrollContainerRef = useRef(null);

  // Filtrar según la pestaña activa
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'new') return p.isNew;
    if (activeTab === 'bestseller') return p.isBestSeller;
    if (activeTab === 'offers') return p.compareAtPrice && p.compareAtPrice > p.price;
    return true;
  });

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  const tabs = [
    { id: 'new', label: 'Novedades', icon: Sparkles, desc: 'Recién llegados a la boutique' },
    { id: 'bestseller', label: 'Más Vendidos', icon: Award, desc: 'Los favoritos de nuestras clientas' },
    { id: 'offers', label: 'Ofertas Especiales', icon: Flame, desc: 'Precios especiales por tiempo limitado' },
  ];

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="ofertas" className="w-full bg-[#FDF7FA] text-[#1A0D26] py-16 sm:py-24 px-4 sm:px-8 border-b border-[#EEDDE8]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Encabezado Editorial y Pestañas Minimalistas */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E6D8E3] pb-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-galaxy-light tracking-widest uppercase block">
              Selección Exclusiva
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A0D26] tracking-tight">
              El Giro de <span className="italic font-normal text-galaxy-DEFAULT">Productos</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#685B78] max-w-lg leading-relaxed">
              Descubre las piezas preferidas por nuestras clientas y las novedades que iluminan tu espacio con estilo propio.
            </p>
          </div>

          {/* Pestañas Minimalistas (Diseño limpio y refinado sin cajas pesadas) */}
          <div className="flex items-center gap-1 sm:gap-2 self-start md:self-auto overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'btn-gold-metallic text-night-950 shadow-gold-sm scale-102'
                      : 'text-[#685B78] hover:text-[#1A0D26] hover:bg-white/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Carrusel Horizontal con Scroll-Snap */}
        <div className="relative group">
          {/* Contenedor Scroll-Snap Horizontal */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[240px] sm:w-[270px] lg:w-[285px]"
              >
                <ProductCard
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onClick={(p) => onSelectProduct && onSelectProduct(p)}
                />
              </div>
            ))}
          </div>

          {/* Flecha Anterior (Flotante) */}
          <button
            onClick={handleScrollLeft}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#EBDCE6] text-[#1A0D26] hover:text-galaxy-DEFAULT hover:border-gold-DEFAULT shadow-lg items-center justify-center transition-all cursor-pointer"
            aria-label="Productos anteriores"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Flecha Siguiente (Flotante) */}
          <button
            onClick={handleScrollRight}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#EBDCE6] text-[#1A0D26] hover:text-galaxy-DEFAULT hover:border-gold-DEFAULT shadow-lg items-center justify-center transition-all cursor-pointer"
            aria-label="Siguientes productos"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Botón Explorar Catálogo Completo */}
        {onNavigateCatalog && (
          <div className="text-center pt-4">
            <button
              onClick={onNavigateCatalog}
              className="px-6 py-3 rounded-full bg-white border border-galaxy-light/35 hover:border-galaxy-DEFAULT text-galaxy-DEFAULT font-semibold text-xs inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>Explorar Todo el Catálogo de Productos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal de Vista Rápida */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </section>
  );
};

export default ProductSection;
