import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio de uploads
const uploadDir = config.uploadDir;
const tempDir = path.join(uploadDir, 'temp');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Configuración de Multer para recibir archivos en directorio temporal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `raw_${Date.now()}_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen no permitido. Usa JPG, PNG o WebP.'));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

/**
 * Procesa una imagen subida y genera pipeline multi-resolución:
 * 1. Genera variantes en WebP y AVIF en anchos: 480, 768, 1200 y 1920px.
 * 2. Genera miniatura 400x400 para panel admin.
 * 3. Genera LQIP (Low Quality Image Placeholder) borroso de 20px para carga instantánea sin CLS.
 * 4. Elimina el archivo original sin procesar.
 * 
 * @param {string} tempFilePath - Ruta temporal del archivo
 * @param {Object} [options]
 * @returns {Promise<{ filename: string, url: string, thumbUrl: string, lqip: string, sizes: Object, width: number, height: number, size: number }>}
 */
export async function processAndSaveImage(tempFilePath, options = {}) {
  const fileHash = crypto.randomBytes(8).toString('hex');
  const baseName = `img_${Date.now()}_${fileHash}`;
  const outputFilename = `${baseName}.webp`;
  const thumbFilename = `${baseName}_thumb.webp`;

  const outputPath = path.join(uploadDir, outputFilename);
  const thumbPath = path.join(uploadDir, thumbFilename);

  try {
    let pipeline = sharp(tempFilePath);

    // Ajustes de rotación si se enviaron
    if (options.rotate) {
      pipeline = pipeline.rotate(options.rotate);
    }

    // Ajustes de color: brillo y saturación
    if (options.brightness || options.saturation) {
      pipeline = pipeline.modulate({
        brightness: options.brightness ? options.brightness / 100 : 1,
        saturation: options.saturation ? options.saturation / 100 : 1
      });
    }

    const metadata = await sharp(tempFilePath).metadata();
    const origWidth = metadata.width || 1200;
    const origHeight = metadata.height || 1200;

    // Guardar versión principal optimizada en WebP (máximo 1920px)
    const mainInfo = await pipeline
      .clone()
      .resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    // Generar variantes multi-resolución en WebP y AVIF (480, 768, 1200)
    const widths = [480, 768, 1200];
    const generatedVariants = {
      webp: {},
      avif: {}
    };

    for (const w of widths) {
      const webpName = `${baseName}_${w}.webp`;
      const avifName = `${baseName}_${w}.avif`;
      const webpPath = path.join(uploadDir, webpName);
      const avifPath = path.join(uploadDir, avifName);

      await Promise.all([
        sharp(tempFilePath)
          .resize({ width: w, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82, effort: 3 })
          .toFile(webpPath)
          .then(() => { generatedVariants.webp[w] = `/uploads/${webpName}`; })
          .catch(() => {}),
        sharp(tempFilePath)
          .resize({ width: w, fit: 'inside', withoutEnlargement: true })
          .avif({ quality: 75, effort: 2 })
          .toFile(avifPath)
          .then(() => { generatedVariants.avif[w] = `/uploads/${avifName}`; })
          .catch(() => {})
      ]);
    }

    // Generar miniatura optimizada para panel de control
    await sharp(tempFilePath)
      .resize({ width: 400, height: 400, fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    // Generar LQIP (placeholder borroso de 20px en base64)
    let lqipBase64 = null;
    try {
      const lqipBuffer = await sharp(tempFilePath)
        .resize({ width: 20, fit: 'inside' })
        .blur(2)
        .webp({ quality: 20 })
        .toBuffer();
      lqipBase64 = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;
    } catch (_) {}

    // Eliminar archivo temporal
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return {
      filename: outputFilename,
      thumbFilename,
      url: `/uploads/${outputFilename}`,
      thumbUrl: `/uploads/${thumbFilename}`,
      lqip: lqipBase64,
      variants: generatedVariants,
      size: mainInfo.size,
      width: mainInfo.width,
      height: mainInfo.height
    };
  } catch (err) {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    throw err;
  }
}

/**
 * Elimina una imagen y su miniatura del almacenamiento
 * @param {string} filename 
 */
export async function deleteImageFile(filename) {
  try {
    const cleanName = path.basename(filename);
    const mainPath = path.join(uploadDir, cleanName);
    const thumbName = cleanName.replace('.webp', '_thumb.webp');
    const thumbPath = path.join(uploadDir, thumbName);

    if (fs.existsSync(mainPath)) fs.unlinkSync(mainPath);
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);

    // Eliminar variantes de tamaño y formato si existen
    const baseWithoutExt = cleanName.replace(/\.[^.]+$/, '');
    for (const w of [480, 768, 1200]) {
      const wWebp = path.join(uploadDir, `${baseWithoutExt}_${w}.webp`);
      const wAvif = path.join(uploadDir, `${baseWithoutExt}_${w}.avif`);
      if (fs.existsSync(wWebp)) fs.unlinkSync(wWebp);
      if (fs.existsSync(wAvif)) fs.unlinkSync(wAvif);
    }

    return true;
  } catch (err) {
    console.error('Error al eliminar archivo:', err);
    return false;
  }
}
