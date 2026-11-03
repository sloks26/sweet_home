import path from 'path';
import fs from 'fs';
import { config } from '../../config/index.js';
import { processAndSaveImage, deleteImageFile } from '../../services/imageService.js';
import { logAudit } from '../../services/audit.js';

export async function listMedia(req, res) {
  try {
    const uploadDir = config.uploadDir;
    if (!fs.existsSync(uploadDir)) {
      return res.json({ success: true, data: [] });
    }

    const files = fs.readdirSync(uploadDir);
    // Filtrar solo las imágenes principales (excluir miniaturas _thumb y variantes de ancho _480, _768, _1200)
    const imageFiles = files
      .filter((file) =>
        file.endsWith('.webp') &&
        !file.includes('_thumb.') &&
        !/_\d+\.webp$/.test(file)
      )
      .map((filename) => {
        const filePath = path.join(uploadDir, filename);
        const stats = fs.statSync(filePath);
        const thumbFilename = filename.replace('.webp', '_thumb.webp');
        const hasThumb = fs.existsSync(path.join(uploadDir, thumbFilename));

        return {
          filename,
          url: `/uploads/${filename}`,
          thumbUrl: hasThumb ? `/uploads/${thumbFilename}` : `/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.birthtime || stats.mtime
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ success: true, data: imageFiles });
  } catch (err) {
    console.error('Error listando medios:', err);
    return res.status(500).json({ error: true, message: 'Error listando medios' });
  }
}

export async function uploadMedia(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: true, message: 'No se seleccionaron archivos para subir' });
    }

    const processedResults = [];

    for (const file of req.files) {
      const result = await processAndSaveImage(file.path);
      processedResults.push(result);
    }

    await logAudit({
      userId: req.user.id,
      action: 'UPLOAD_MEDIA',
      module: 'MEDIA',
      details: { count: processedResults.length },
      req
    });

    return res.json({
      success: true,
      message: `${processedResults.length} imagen(es) procesada(s) y optimizada(s) a WebP.`,
      data: processedResults
    });
  } catch (err) {
    console.error('Error al subir medios:', err);
    return res.status(500).json({ error: true, message: err.message || 'Error al procesar imágenes' });
  }
}

export async function deleteMedia(req, res) {
  try {
    const { filename } = req.params;
    const success = await deleteImageFile(filename);

    if (!success) {
      return res.status(404).json({ error: true, message: 'Archivo no encontrado' });
    }

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_MEDIA',
      module: 'MEDIA',
      details: { filename },
      req
    });

    return res.json({ success: true, message: 'Imagen eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar medio:', err);
    return res.status(500).json({ error: true, message: 'Error al eliminar imagen' });
  }
}
