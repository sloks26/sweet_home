import React, { useState, Suspense, lazy } from 'react';
import StarBackground from '../ui/StarBackground';

const AdminLayout = lazy(() => import('./AdminLayout'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const AdminOrders = lazy(() => import('./AdminOrders'));
const AdminBanners = lazy(() => import('./AdminBanners'));
const AdminMedia = lazy(() => import('./AdminMedia'));
const AdminOurStory = lazy(() => import('./AdminOurStory'));
const AdminProducts = lazy(() => import('./AdminProducts'));
const AdminCategories = lazy(() => import('./AdminCategories'));
const AdminSettings = lazy(() => import('./AdminSettings'));
const AdminUsersSection = lazy(() => import('./subcomponents/AdminUsersSection'));

export const AdminView = ({
  adminTab,
  setAdminTab,
  adminStats,
  fetchAdminStats,
  handleExitAdmin,
  authUser,
  handleLogout,
  setStoreSettings
}) => {
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [productStockFilter, setProductStockFilter] = useState('');

  const handleAdminNavigation = (tab, options = {}) => {
    setAdminTab(tab);
    if (options?.filter) {
      if (tab === 'orders') setOrderFilter(options.filter);
      if (tab === 'products') setProductStockFilter(options.filter);
    }
    if (tab === 'dashboard' || tab === 'orders') fetchAdminStats();
  };

  return (
    <div className="relative min-h-screen text-text-primary bg-night-950 selection:bg-gold-base/30 selection:text-gold-light">
      <StarBackground />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-gold-light font-serif text-lg">
          Cargando panel de administración seguro...
        </div>
      }>
        <AdminLayout
          activeTab={adminTab}
          pendingVouchersCount={adminStats?.metrics?.voucherReceivedOrders || 0}
          onSelectTab={(tab) => handleAdminNavigation(tab)}
          onExitAdmin={handleExitAdmin}
          authUser={authUser}
          onLogout={handleLogout}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              stats={adminStats}
              onNavigate={handleAdminNavigation}
            />
          )}
          {adminTab === 'orders' && <AdminOrders initialStatusFilter={orderFilter} />}
          {adminTab === 'products' && <AdminProducts initialStockStatus={productStockFilter} />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'banners' && <AdminBanners />}
          {adminTab === 'media' && <AdminMedia />}
          {adminTab === 'our-story' && <AdminOurStory />}
          {adminTab === 'users' && <AdminUsersSection currentUserId={authUser?.id} />}
          {adminTab === 'settings' && (
            <AdminSettings
              onSaveSuccess={(payload) => setStoreSettings((prev) => ({ ...(prev || {}), ...payload }))}
            />
          )}
        </AdminLayout>
      </Suspense>
    </div>
  );
};

export default AdminView;
