import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';
import apiRouter from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  // Compresión gzip / deflate para todas las respuestas HTTP
  app.use(compression());

  // Asegurar directorios de almacenamiento
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
  }
  if (!fs.existsSync(config.privateVoucherDir)) {
    fs.mkdirSync(config.privateVoucherDir, { recursive: true });
  }

  // Middlewares de seguridad (SEC-15: Content Security Policy adaptada para HTTP/IP y preparación SSL)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
      hsts: false
    })
  );

  // Lista blanca estricta de CORS (SEC-06)
  const allowedOrigins = [
    config.clientUrl,
    'http://localhost:8081',
    'http://localhost:5173',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:5173',
    'http://174.138.62.86:8081',
    'http://sweethomeandboutiquecr.com',
    'https://sweethomeandboutiquecr.com',
    'http://www.sweethomeandboutiquecr.com',
    'https://www.sweethomeandboutiquecr.com',
    'https://sweethomeboutiquecr.com',
    'https://www.sweethomeboutiquecr.com'
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Permitir solicitudes internas, apps móviles o herramientas CLI sin cabecera origin
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          origin.includes('sweethomeandboutiquecr.com') ||
          origin.includes('174.138.62.86') ||
          origin.includes('localhost') ||
          origin.includes('127.0.0.1')
        ) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Servir archivos multimedia locales públicos (productos y banners)
  // NOTA: Los comprobantes bancarios están en privateVoucherDir y NO se sirven estáticamente (SEC-02)
  app.use(
    '/uploads',
    express.static(config.uploadDir, {
      maxAge: '30d',
      immutable: true
    })
  );

  // Router de API
  app.use('/api', apiRouter);

  // En producción o si el frontend está compilado, servir la SPA de React con cabeceras de alto rendimiento
  const frontendDistPath = path.resolve(__dirname, '../../../frontend/dist');
  if (fs.existsSync(frontendDistPath)) {
    app.use(
      '/assets',
      express.static(path.join(frontendDistPath, 'assets'), {
        maxAge: '1y',
        immutable: true
      })
    );

    app.use(
      '/images',
      express.static(path.join(frontendDistPath, 'images'), {
        maxAge: '30d',
        immutable: true
      })
    );

    app.use(
      express.static(frontendDistPath, {
        maxAge: 0,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
          }
        }
      })
    );

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      if (req.path.startsWith('/assets')) {
        return res.status(404).send('Asset not found');
      }
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      res.send(`
        <div style="font-family: sans-serif; background: #12071F; color: #F8F1FF; padding: 40px; text-align: center;">
          <h1 style="color: #F2C14E;">Sweet Home & Boutique CR</h1>
          <p>Servidor API activo en puerto ${config.port}. Compilando frontend...</p>
        </div>
      `);
    });
  }

  // Manejador centralizado de errores
  app.use((err, req, res, _next) => {
    console.error('[Error de servidor]:', err);
    res.status(err.status || 500).json({
      error: true,
      message: err.message || 'Error interno del servidor',
      code: err.code || 'INTERNAL_ERROR'
    });
  });

  return app;
}

export default createApp;
