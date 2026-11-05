import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env de la raíz del proyecto o del server
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback local

// Esquema de validación estricto de variables de entorno (SEC-03)
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8081'),
  CLIENT_URL: z.string().default('http://localhost:8081'),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET debe tener al menos 16 caracteres de entropía')
    .refine(
      (secret) =>
        process.env.NODE_ENV !== 'production' ||
        secret !== 'fallback_secret_change_in_production_key',
      {
        message: 'JWT_SECRET no puede usar la clave de fallback en producción'
      }
    ),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.string().optional(),
  MONGODB_URI: z.string().optional()
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error('❌ Error crítico en variables de entorno:', parsedEnv.error.format());
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Configuración de entorno inválida en producción. Revisa el archivo .env');
  }
}

const envData = parsedEnv.success ? parsedEnv.data : process.env;

const uploadDir = path.resolve(__dirname, '../../uploads');
const privateVoucherDir = path.resolve(__dirname, '../../private/vouchers');

// Asegurar existencia de directorios de almacenamiento
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(privateVoucherDir)) fs.mkdirSync(privateVoucherDir, { recursive: true });

export const config = {
  env: envData.NODE_ENV || 'development',
  port: parseInt(envData.PORT || '8081', 10),
  clientUrl: envData.CLIENT_URL || 'http://localhost:8081',
  jwtSecret: envData.JWT_SECRET,
  jwtExpiresIn: envData.JWT_EXPIRES_IN || '7d',
  mongoUri: process.env.MONGODB_URI || process.env.DATABASE_URL || '',
  uploadDir,
  privateVoucherDir,
  initialAdmin: {
    name: process.env.INITIAL_ADMIN_NAME || 'Vanessa',
    email: process.env.INITIAL_ADMIN_EMAIL || 'admin@sweethomeboutiquecr.com',
    password: process.env.INITIAL_ADMIN_PASSWORD || 'SweetHomeCR2026!#'
  },
  store: {
    name: process.env.STORE_NAME || 'Sweet Home & Boutique CR',
    slogan: 'Donde cada detalle ilumina tu hogar y tu estilo.',
    footerSlogan:
      'Variedad, calidad y amor en cada detalle. Para ti, para tu hogar, para cada momento especial.',
    currency: 'CRC',
    symbol: '₡',
    phone: process.env.STORE_PHONE || '+506 6465-6625',
    whatsapp: process.env.STORE_WHATSAPP || '50664656625',
    email: process.env.STORE_EMAIL || 'info@sweethomeboutiquecr.com',
    address: process.env.STORE_ADDRESS || 'San José, Costa Rica',
    social: {
      instagram: {
        handle: process.env.INSTAGRAM_HANDLE || '@sweethomeandboutiquecr',
        url: process.env.INSTAGRAM_URL || 'https://instagram.com/sweethomeandboutiquecr'
      },
      tiktok: {
        handle: process.env.TIKTOK_HANDLE || '@sweet.home.boutique.cr',
        url: process.env.TIKTOK_URL || 'https://tiktok.com/@sweet.home.boutique.cr'
      },
      facebook: {
        name: process.env.FACEBOOK_NAME || 'Sweet Home & Boutique CR',
        url: process.env.FACEBOOK_URL || 'https://facebook.com/SweetHomeAndBoutiqueCR'
      }
    },
    sinpe: {
      phone: process.env.SINPE_PHONE || '6465-6625',
      holder: process.env.SINPE_HOLDER || 'Maureen Vanessa Sanchez Martinez'
    },
    banks: {
      holder: process.env.BANK_HOLDER || 'Maureen Vanessa Sanchez Martinez',
      bac: {
        name: process.env.BAC_BANK_NAME || 'BAC Credomatic (San José)',
        iban: process.env.BAC_IBAN || 'CR84010200009659820931'
      },
      popular: {
        name: process.env.POPULAR_BANK_NAME || 'Banco Popular',
        iban: process.env.POPULAR_IBAN || 'CR64016111056166941071'
      }
    }
  }
};
