import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { uploadMiddleware } from '../services/imageService.js';

const router = Router();

// Crear nuevo pedido (público)
router.post('/', orderController.createOrder);

// Consultar estado de pedido por número de orden (ej: SH-2026-1001)
router.get('/:orderNumber', orderController.getOrderByNumber);

// Subir comprobante de pago de SINPE Móvil o Transferencia
router.post('/:orderNumber/voucher', uploadMiddleware.single('voucher'), orderController.uploadVoucher);

export default router;
