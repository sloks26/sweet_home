import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authenticate, requireAuth, requireStaff, requireAdmin } from '../middlewares/auth.js';
import { uploadMiddleware } from '../services/imageService.js';

const router = Router();

// Todos los endpoints de administración requieren autenticación base de staff o admin
router.use(authenticate, requireAuth, requireStaff);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Contabilidad y Finanzas (SEC-10: Exclusivo para ADMIN)
router.get('/accounting', requireAdmin, adminController.getAccountingDashboard);
router.post('/expenses', requireAdmin, adminController.createExpense);
router.delete('/expenses/:id', requireAdmin, adminController.deleteExpense);

// Control de Apartados y Contra Entrega (Operativo para STAFF y ADMIN)
router.get('/layaways', adminController.getLayaways);
router.post('/layaways', adminController.createLayaway);
router.put('/layaways/:id', adminController.updateLayaway);
router.delete('/layaways/:id', requireAdmin, adminController.deleteLayaway);

// Banners y Hero Carrusel
router.get('/banners', adminController.getBanners);
router.post('/banners', adminController.createBanner);
router.put('/banners/:id', adminController.updateBanner);
router.delete('/banners/:id', requireAdmin, adminController.deleteBanner);
router.put('/banners-reorder', adminController.reorderBanners);

// Gestor de Imágenes y Medios
router.get('/media', adminController.listMedia);
router.post('/media', uploadMiddleware.array('images', 10), adminController.uploadMedia);
router.delete('/media/:filename', requireAdmin, adminController.deleteMedia);

// Contenido del Sitio y Ajustes (SEC-10: Exclusivo para ADMIN)
router.put('/content/:key', requireAdmin, adminController.updateSiteContent);

// Gestión de Productos
router.get('/products', adminController.getAdminProducts);
router.get('/products/:id', adminController.getAdminProductById);
router.post('/products', adminController.createAdminProduct);
router.put('/products/:id', adminController.updateAdminProduct);
router.delete('/products/:id', requireAdmin, adminController.deleteAdminProduct);
router.patch('/products/:id/toggle', adminController.toggleAdminProduct);

// Gestión de Categorías y Subcategorías
router.get('/categories', adminController.getAdminCategories);
router.post('/categories', adminController.createAdminCategory);
router.put('/categories/reorder', adminController.reorderAdminCategories);
router.put('/categories/:id', adminController.updateAdminCategory);
router.delete('/categories/:id', requireAdmin, adminController.deleteAdminCategory);

// Subcategorías
router.post('/categories/:categoryId/subcategories', adminController.createAdminSubcategory);
router.put('/subcategories/:id', adminController.updateAdminSubcategory);
router.delete('/subcategories/:id', requireAdmin, adminController.deleteAdminSubcategory);

// Gestión de Pedidos y Comprobantes Protegidos
router.get('/orders', adminController.getAdminOrders);
router.get('/orders/:id', adminController.getAdminOrderById);
router.get('/orders/:id/voucher', adminController.getAdminOrderVoucher); // SEC-02: Comprobante bancario protegido
router.patch('/orders/:id/status', adminController.updateAdminOrderStatus);
router.delete('/orders/:id', requireAdmin, adminController.deleteAdminOrder); // SEC-10

// Gestión de Usuarios y Equipo (SEC-10: Exclusivo para ADMIN)
router.get('/users', requireAdmin, adminController.getAdminUsers);
router.post('/users', requireAdmin, adminController.createAdminUser);
router.patch('/users/:id/toggle', requireAdmin, adminController.toggleAdminUser);
router.delete('/users/:id', requireAdmin, adminController.deleteAdminUser);

// Moderación de Reseñas y Testimonios de Clientes
router.get('/reviews', adminController.getAdminReviews);
router.patch('/reviews/:kind/:id/approve', adminController.approveAdminReview);
router.delete('/reviews/:kind/:id', adminController.deleteAdminReview);

export default router;
