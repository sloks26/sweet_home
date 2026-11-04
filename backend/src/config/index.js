import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env de la raíz del proyecto o del server
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback local

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8081', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8081',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_in_production_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mongoUri: process.env.MONGODB_URI || '',
  uploadDir: path.resolve(__dirname, '../../uploads'),
  initialAdmin: {
    name: process.env.INITIAL_ADMIN_NAME || 'Dueña y Administradora',
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
