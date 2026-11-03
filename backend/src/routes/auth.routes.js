import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate, requireAuth } from '../middlewares/auth.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Límite amplio para administración y login fluido
const loginLimiter = rateLimiter({
  maxAttempts: 30,
  windowMs: 15 * 60 * 1000,
  message: 'Demasiados intentos de inicio de sesión desde esta dirección IP.'
});

router.post('/login', loginLimiter, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);
router.post('/change-password', authenticate, requireAuth, authController.changePassword);

export default router;
