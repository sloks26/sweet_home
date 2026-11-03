import { Router } from 'express';
import { config } from '../config/index.js';
import authRoutes from '../routes/auth.routes.js';
import catalogRoutes from '../routes/catalog.routes.js';
import adminRoutes from '../routes/admin.routes.js';
import orderRoutes from '../routes/order.routes.js';

export const apiRouter = Router();

// Rutas de API base
apiRouter.use('/auth', authRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/', catalogRoutes);

// Endpoints de salud y metadatos de marca
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    store: config.store.name,
    version: '1.0.0',
    port: config.port
  });
});

apiRouter.get('/brand', (req, res) => {
  res.json({
    name: config.store.name,
    slogan: config.store.slogan,
    footerSlogan: config.store.footerSlogan,
    currency: config.store.currency,
    symbol: config.store.symbol,
    sinpe: config.store.sinpe,
    banks: config.store.banks,
    social: config.store.social,
    contact: {
      phone: config.store.phone,
      whatsapp: config.store.whatsapp,
      email: config.store.email,
      address: config.store.address
    }
  });
});

export default apiRouter;
