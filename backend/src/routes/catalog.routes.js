import { Router } from 'express';
import { catalogController } from '../controllers/catalog.controller.js';
import { reviewSubmissionLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Endpoint unificado de alto rendimiento para el Home
router.get('/home', catalogController.getHomeData);

router.get('/categories', catalogController.getCategories);
router.get('/products', catalogController.getProducts);
router.get('/products/:slug', catalogController.getProductBySlug);
router.get('/banners', catalogController.getBanners);
router.get('/content/:key', catalogController.getSiteContent);
router.get('/testimonials', catalogController.getTestimonials);
router.post('/testimonials', reviewSubmissionLimiter, catalogController.createPublicTestimonial);
router.post('/products/:productId/reviews', reviewSubmissionLimiter, catalogController.createProductReview);

export default router;
