import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import StarBackground from './components/ui/StarBackground';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';
import AgeVerificationModal from './components/layout/AgeVerificationModal';
import WhatsAppFloatingBtn from './components/layout/WhatsAppFloatingBtn';
import HeroCarousel from './components/home/HeroCarousel';
import CategoryGrid from './components/home/CategoryGrid';
import ProductSection from './components/home/ProductSection';
import PromoBanner from './components/home/PromoBanner';
import OurStorySection from './components/home/OurStorySection';
import BenefitsSection from './components/home/BenefitsSection';
import TestimonialsSection from './components/home/TestimonialsSection';
import InstagramFeedSection from './components/home/InstagramFeedSection';
const AdminLoginModal = lazy(() => import('./components/admin/AdminLoginModal'));
const AdminView = lazy(() => import('./components/admin/AdminView'));
const CatalogPage = lazy(() => import('./components/catalog/CatalogPage'));
const ProductDetailModal = lazy(() => import('./components/catalog/ProductDetailModal'));
const FullStoryModal = lazy(() => import('./components/home/FullStoryModal'));
const CheckoutModal = lazy(() => import('./components/checkout/CheckoutModal'));
const OrderTrackingModal = lazy(() => import('./components/layout/OrderTrackingModal'));
const InfoModal = lazy(() => import('./components/layout/InfoModal'));

const defaultCategories = [
  {
    id: '1',
    name: 'Hogar',
    slug: 'hogar',
    description: 'Todo para hacer de tu hogar un lugar único y especial.',
    icon: 'Home'
  },
  {
    id: '2',
    name: 'Moda',
    slug: 'moda',
    description: 'Estilos que te hacen brillar cada día.',
    icon: 'Shirt'
  },
  {
    id: '3',
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Los detalles que complementan tu esencia.',
    icon: 'Watch'
  },
  {
    id: '4',
    name: 'Belleza',
    slug: 'belleza',
    description: 'Cuídate, quiérete y resalta tu belleza natural.',
    icon: 'Sparkles'
  },
  {
    id: '5',
    name: 'Perfumes',
    slug: 'perfumes',
    description: 'Aromas que cuentan tu historia y dejan huella.',
    icon: 'Heart'
  },
  {
    id: '6',
    name: 'Maquillaje',
    slug: 'maquillaje',
    description: 'Colores que realzan tu belleza y tu personalidad.',
    icon: 'Smile'
  },
  {
    id: '7',
    name: 'Cuidado Personal',
    slug: 'cuidado-personal',
    description: 'Productos que miman tu piel y tu cuerpo.',
    icon: 'Shield'
  },
  {
    id: '8',
    name: 'Bienestar Íntimo (+18)',
    slug: 'bienestar-intimo',
    description: 'Bienestar, confianza y momentos para ti. Descúbrelo con libertad y discreción.',
    icon: 'Lock',
    isAdult: true
  },
  {
    id: '9',
    name: 'Novedades y Regalos',
    slug: 'novedades-regalos',
    description: 'Descubre lo nuevo que llega para ti cada semana.',
    icon: 'Gift'
  },
  {
    id: '10',
    name: 'Omnilife y Más',
    slug: 'omnilife-y-mas',
    description: 'Productos que apoyan tu bienestar y tu día a día.',
    icon: 'Activity'
  }
];

export function App() {
  const [categories, setCategories] = useState(defaultCategories);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [ourStory, setOurStory] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  // Estados de Navegación de Tienda
  const [currentView, setCurrentView] = useState('home');
  const [catalogCategory, setCatalogCategory] = useState(null);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Estados del Panel Administrativo
  const isInitialAdminHash =
    typeof window !== 'undefined' &&
    (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin'));
  const [isAdminView, setIsAdminView] = useState(isInitialAdminHash);
  const [isVerifyingAdminAuth, setIsVerifyingAdminAuth] = useState(isInitialAdminHash);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [adminStats, setAdminStats] = useState(null);

  // Modales
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFullStoryOpen, setIsFullStoryOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [infoModalTopic, setInfoModalTopic] = useState(null);

  const fetchAdminStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setAdminStats(data.data);
      }
    } catch (err) {
      console.error('Error al cargar métricas del panel:', err);
    }
  }, []);

  useEffect(() => {
    fetch('/api/home')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.categories?.length > 0) setCategories(res.data.categories);
          if (res.data.featuredProducts?.length > 0) setProducts(res.data.featuredProducts);
          if (res.data.banners?.length > 0) setBanners(res.data.banners);
          if (res.data.ourStory) setOurStory(res.data.ourStory);
          if (res.data.testimonials?.length > 0) setTestimonials(res.data.testimonials);
          if (res.data.storeSettings) setStoreSettings(res.data.storeSettings);
        }
      })
      .catch((err) => console.warn('Error al cargar datos del Home:', err));

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        const isAdminRoute =
          window.location.hash === '#admin' || window.location.pathname.startsWith('/admin');
        if (data.authenticated) {
          setAuthUser(data.user);
          if (isAdminRoute) {
            setIsAdminView(true);
            setIsVerifyingAdminAuth(false);
            fetchAdminStats();
          }
        } else {
          setIsVerifyingAdminAuth(false);
          setAuthUser((prev) => {
            if (prev) return prev;
            if (isAdminRoute) {
              setIsAdminView(false);
              setIsLoginModalOpen(true);
            }
            return null;
          });
        }
      })
      .catch(() => {
        setIsVerifyingAdminAuth(false);
      });
  }, [fetchAdminStats]);

  const handleOpenAdminPanel = () => {
    setIsAdminView(true);
    if (window.location.hash !== '#admin') {
      window.location.hash = '#admin';
    }
    fetchAdminStats();
  };

  const handleExitAdmin = () => {
    setIsAdminView(false);
    setIsVerifyingAdminAuth(false);
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
    fetch('/api/home')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.categories?.length > 0) setCategories(res.data.categories);
          if (res.data.featuredProducts?.length > 0) setProducts(res.data.featuredProducts);
          if (res.data.banners?.length > 0) setBanners(res.data.banners);
          if (res.data.ourStory) setOurStory(res.data.ourStory);
          if (res.data.testimonials?.length > 0) setTestimonials(res.data.testimonials);
          if (res.data.storeSettings) setStoreSettings(res.data.storeSettings);
        }
      })
      .catch(() => {});
  };

  const handleSelectCategory = (catSlug, subSlug = null, search = '') => {
    setCatalogCategory(catSlug);
    setCatalogSearch(search || '');
    setCurrentView('catalog');
    window.location.hash = catSlug ? `catalogo/${catSlug}` : 'catalogo';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (prod) => {
    setSelectedDetailProduct(prod);
    setIsDetailModalOpen(true);
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    setCatalogCategory(null);
    setCatalogSearch('');
    if (window.location.hash.startsWith('#catalogo')) {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        if (authUser && (authUser.role === 'ADMIN' || authUser.role === 'STAFF')) {
          setIsAdminView(true);
          fetchAdminStats();
        } else if (!authUser && !isVerifyingAdminAuth) {
          setIsLoginModalOpen(true);
        }
      } else if (hash.startsWith('#catalogo')) {
        const parts = hash.replace('#catalogo', '').replace(/^\//, '');
        setCatalogCategory(parts || null);
        setCurrentView('catalog');
      } else if (hash === '#seguimiento') {
        setIsTrackingModalOpen(true);
      } else if (hash === '#envios') {
        setInfoModalTopic('envios');
      } else if (hash === '#faq') {
        setInfoModalTopic('faq');
      } else if (hash === '#terminos') {
        setInfoModalTopic('terminos');
      } else if (hash === '#privacidad') {
        setInfoModalTopic('privacidad');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [authUser, isVerifyingAdminAuth]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthUser(null);
      setIsAdminView(false);
      if (window.location.hash === '#admin') {
        window.history.pushState(null, '', window.location.pathname);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isVerifyingAdminAuth) {
    return (
      <div className="min-h-screen bg-night-950 flex flex-col items-center justify-center text-gold-light space-y-3">
        <div className="w-10 h-10 border-2 border-gold-DEFAULT/30 border-t-gold-bright rounded-full animate-spin" />
        <span className="font-serif text-base tracking-wide text-gold-light">
          Cargando Panel Administrativo...
        </span>
      </div>
    );
  }

  if (isAdminView) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-night-950 flex flex-col items-center justify-center text-gold-light space-y-3">
            <div className="w-10 h-10 border-2 border-gold-DEFAULT/30 border-t-gold-bright rounded-full animate-spin" />
            <span className="font-serif text-base tracking-wide text-gold-light">
              Cargando Panel Administrativo...
            </span>
          </div>
        }
      >
        <AdminView
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          adminStats={adminStats}
          fetchAdminStats={fetchAdminStats}
          handleExitAdmin={handleExitAdmin}
          authUser={authUser}
          handleLogout={handleLogout}
          setStoreSettings={setStoreSettings}
        />
      </Suspense>
    );
  }

  return (
    <div className="relative min-h-screen text-text-primary selection:bg-gold-base/30 selection:text-gold-light bg-night-900">
      <StarBackground />

      {/* Header Smart Sticky */}
      <Header
        categories={categories}
        authUser={authUser}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        onOpenAdminPanel={handleOpenAdminPanel}
        onLogout={handleLogout}
        onSelectCategory={handleSelectCategory}
        onSelectProduct={handleSelectProduct}
        onNavigateHome={handleNavigateHome}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onMegaMenuToggle={(isOpen) => setIsMegaMenuOpen(isOpen)}
        storeSettings={storeSettings}
      />

      {/* VISTA DINÁMICA: CATÁLOGO O HOME */}
      <div className="pt-16 sm:pt-24">
        {currentView === 'catalog' ? (
          <Suspense
            fallback={
              <div className="min-h-[500px] flex items-center justify-center text-gold-light font-serif text-lg">
                Cargando catálogo exclusivo...
              </div>
            }
          >
            <CatalogPage
              initialCategory={catalogCategory}
              initialSearch={catalogSearch}
              categories={categories}
              onSelectProduct={handleSelectProduct}
              onBackToHome={handleNavigateHome}
            />
          </Suspense>
        ) : (
          <main className="space-y-0">
            <HeroCarousel
              banners={banners}
              isMenuOpen={isMegaMenuOpen}
              onSelectCategory={handleSelectCategory}
            />
            <CategoryGrid categories={categories} onSelectCategory={handleSelectCategory} />
            <div className="content-visibility-auto">
              <ProductSection
                products={products}
                onSelectProduct={handleSelectProduct}
                storeSettings={storeSettings}
                onNavigateCatalog={() => {
                  setCurrentView('catalog');
                  setCatalogCategory(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
            <div className="content-visibility-auto">
              <PromoBanner />
            </div>
            <div className="content-visibility-auto">
              <OurStorySection
                storyData={ourStory}
                onOpenFullStory={() => setIsFullStoryOpen(true)}
                authUser={authUser}
              />
            </div>
            <div className="content-visibility-auto">
              <BenefitsSection />
            </div>
            <div className="content-visibility-auto">
              <TestimonialsSection testimonials={testimonials} />
            </div>
            <div className="content-visibility-auto">
              <InstagramFeedSection />
            </div>
          </main>
        )}
      </div>

      {/* Footer */}
      <Footer
        categories={categories}
        onOpenAdminLogin={() => (authUser ? handleOpenAdminPanel() : setIsLoginModalOpen(true))}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onOpenInfo={(t) => setInfoModalTopic(t)}
        authUser={authUser}
        storeSettings={storeSettings}
      />

      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <AgeVerificationModal />
      <WhatsAppFloatingBtn whatsapp={storeSettings?.whatsapp} />

      {/* Modales */}
      <Suspense fallback={null}>
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            storeSettings={storeSettings}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isDetailModalOpen && (
          <ProductDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            product={selectedDetailProduct}
            storeSettings={storeSettings}
            onSelectRelated={(p) => setSelectedDetailProduct(p)}
            onBuyNow={() => setIsCheckoutOpen(true)}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isTrackingModalOpen && (
          <OrderTrackingModal
            isOpen={isTrackingModalOpen}
            onClose={() => {
              setIsTrackingModalOpen(false);
              if (window.location.hash === '#seguimiento') {
                window.history.pushState(null, '', window.location.pathname);
              }
            }}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {infoModalTopic && (
          <InfoModal
            isOpen={!!infoModalTopic}
            topic={infoModalTopic}
            storeSettings={storeSettings}
            onClose={() => {
              setInfoModalTopic(null);
              if (['#envios', '#faq', '#terminos', '#privacidad'].includes(window.location.hash)) {
                window.history.pushState(null, '', window.location.pathname);
              }
            }}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isFullStoryOpen && (
          <FullStoryModal
            isOpen={isFullStoryOpen}
            onClose={() => setIsFullStoryOpen(false)}
            storyData={ourStory}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isLoginModalOpen && (
          <AdminLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={(user) => {
              setAuthUser(user);
              if (user.role === 'ADMIN' || user.role === 'STAFF') {
                handleOpenAdminPanel();
              }
            }}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;
