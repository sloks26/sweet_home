import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { uploadMiddleware } from '../services/imageService.js';
import { orderCreationLimiter, voucherUploadLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Crear nuevo pedido (público con rate limiting SEC-11)
router.post('/', orderCreationLimiter, orderController.createOrder);

// Consultar estado de pedido por número de orden (ej: SH-2026-1001)
router.get('/:orderNumber', orderController.getOrderByNumber);

// Subir comprobante de pago de SINPE Móvil o Transferencia (con rate limiting)
router.post(
  '/:orderNumber/voucher',
  voucherUploadLimiter,
  uploadMiddleware.single('voucher'),
  orderController.uploadVoucher
);

export default router;
