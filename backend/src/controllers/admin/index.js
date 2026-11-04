import { getDashboardStats, updateSiteContent } from './adminDashboard.controller.js';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners
} from './adminBanners.controller.js';
import { listMedia, uploadMedia, deleteMedia } from './adminMedia.controller.js';
import {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleAdminProduct
} from './adminProducts.controller.js';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  reorderAdminCategories,
  createAdminSubcategory,
  updateAdminSubcategory,
  deleteAdminSubcategory
} from './adminCategories.controller.js';
import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  deleteAdminOrder
} from './adminOrders.controller.js';
import { adminAccountingController } from './adminAccounting.controller.js';
import {
  getAdminUsers,
  createAdminUser,
  toggleAdminUser,
  deleteAdminUser
} from './adminUsers.controller.js';

export const adminController = {
  // Contabilidad, Egresos y Control de Apartados / Contra Entrega
  getAccountingDashboard: adminAccountingController.getAccountingDashboard,
  createExpense: adminAccountingController.createExpense,
  deleteExpense: adminAccountingController.deleteExpense,
  getLayaways: adminAccountingController.getLayaways,
  createLayaway: adminAccountingController.createLayaway,
  updateLayaway: adminAccountingController.updateLayaway,
  deleteLayaway: adminAccountingController.deleteLayaway,

  // Dashboard & Content
  getDashboardStats,
  updateSiteContent,

  // Banners
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,

  // Media
  listMedia,
  uploadMedia,
  deleteMedia,

  // Products
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleAdminProduct,

  // Categories & Subcategories
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  reorderAdminCategories,
  createAdminSubcategory,
  updateAdminSubcategory,
  deleteAdminSubcategory,

  // Orders
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  deleteAdminOrder,

  // Users & Staff
  getAdminUsers,
  createAdminUser,
  toggleAdminUser,
  deleteAdminUser
};

export default adminController;
