import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authenticate, requireAuth, requireStaff } from '../middlewares/auth.js';
import { uploadMiddleware } from '../services/imageService.js';

const router = Router();

// Todos los endpoints de administración requieren autenticación de staff o admin
router.use(authenticate, requireAuth, requireStaff);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Contabilidad: Ingresos, Egresos, Apartados y Contra Entrega
router.get('/accounting', adminController.getAccountingDashboard);
router.post('/expenses', adminController.createExpense);
router.delete('/expenses/:id', adminController.deleteExpense);
router.get('/layaways', adminController.getLayaways);
router.post('/layaways', adminController.createLayaway);
router.put('/layaways/:id', adminController.updateLayaway);
router.delete('/layaways/:id', adminController.deleteLayaway);

// Banners y Hero Carrusel
router.get('/banners', adminController.getBanners);
router.post('/banners', adminController.createBanner);
router.put('/banners/:id', adminController.updateBanner);
router.delete('/banners/:id', adminController.deleteBanner);
router.put('/banners-reorder', adminController.reorderBanners);

// Gestor de Imágenes y Medios
router.get('/media', adminController.listMedia);
router.post('/media', uploadMiddleware.array('images', 10), adminController.uploadMedia);
router.delete('/media/:filename', adminController.deleteMedia);

// Contenido del Sitio (Nuestra Historia, SINPE, etc.)
router.put('/content/:key', adminController.updateSiteContent);

// Gestión de Productos
router.get('/products', adminController.getAdminProducts);
router.get('/products/:id', adminController.getAdminProductById);
router.post('/products', adminController.createAdminProduct);
router.put('/products/:id', adminController.updateAdminProduct);
router.delete('/products/:id', adminController.deleteAdminProduct);
router.patch('/products/:id/toggle', adminController.toggleAdminProduct);

// Gestión de Categorías y Subcategorías
router.get('/categories', adminController.getAdminCategories);
router.post('/categories', adminController.createAdminCategory);
router.put('/categories/reorder', adminController.reorderAdminCategories);
router.put('/categories/:id', adminController.updateAdminCategory);
router.delete('/categories/:id', adminController.deleteAdminCategory);

// Subcategorías
router.post('/categories/:categoryId/subcategories', adminController.createAdminSubcategory);
router.put('/subcategories/:id', adminController.updateAdminSubcategory);
router.delete('/subcategories/:id', adminController.deleteAdminSubcategory);

// Gestión de Pedidos y Comprobantes SINPE Móvil
router.get('/orders', adminController.getAdminOrders);
router.get('/orders/:id', adminController.getAdminOrderById);
router.patch('/orders/:id/status', adminController.updateAdminOrderStatus);
router.delete('/orders/:id', adminController.deleteAdminOrder);

export default router;
