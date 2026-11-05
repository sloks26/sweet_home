import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  RotateCw,
  ZoomIn,
  Check,
  Crop
} from 'lucide-react';
import Button from '../ui/Button';

export const PhotoEditorModal = ({ isOpen, onClose, imageSrc, onSave }) => {
  const [aspectRatio, setAspectRatio] = useState('1:1'); // '1:1', '16:9', '3:4', 'free'
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');

    // Determinar dimensiones del canvas según relación de aspecto
    let targetWidth = 800;
    let targetHeight = 800;

    if (aspectRatio === '16:9') {
      targetWidth = 1280;
      targetHeight = 720;
    } else if (aspectRatio === '4:5') {
      targetWidth = 800;
      targetHeight = 1000;
    } else if (aspectRatio === '3:4') {
      targetWidth = 750;
      targetHeight = 1000;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // Aplicar filtros CSS de canvas
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

    ctx.save();
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Dibujar imagen centrada y escalada para cubrir el aspecto
    const imgAspect = img.width / img.height;
    const canvasAspect = targetWidth / targetHeight;

    let drawW, drawH;
    if (imgAspect > canvasAspect) {
      drawH = targetHeight;
      drawW = targetHeight * imgAspect;
    } else {
      drawW = targetWidth;
      drawH = targetWidth / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [aspectRatio, zoom, rotation, brightness, contrast, saturation]);

  // Cargar imagen en memoria
  useEffect(() => {
    if (!imageSrc || !isOpen) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      renderCanvas();
    };
  }, [imageSrc, isOpen, renderCanvas]);

  // Re-renderizar canvas cuando cambien los filtros
  useEffect(() => {
    if (imageRef.current) {
      renderCanvas();
    }
  }, [renderCanvas]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    canvas.toBlob(
      async (blob) => {
        try {
          const formData = new FormData();
          formData.append('images', blob, `edited_${Date.now()}.webp`);

          const res = await fetch('/api/admin/media', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();

          if (data.success && data.data?.[0]) {
            onSave(data.data[0]);
            onClose();
          } else {
            alert(data.message || 'Error al guardar la imagen');
          }
        } catch (err) {
          console.error(err);
          alert('Error de conexión al guardar imagen');
        } finally {
          setIsProcessing(false);
        }
      },
      'image/webp',
      0.9
    );
  };

  const resetFilters = () => {
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-night-950/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-night-800 to-night-900 border border-gold-DEFAULT/40 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-night-700/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/15 text-gold-bright flex items-center justify-center border border-gold-DEFAULT/30 shadow-gold-sm">
                <Crop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-text-primary">
                  Editor de Fotos Integrado
                </h3>
                <p className="text-xs text-text-secondary">
                  Recorta, ajusta brillo y optimiza automáticamente a WebP para la boutique.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-secondary hover:text-gold-light hover:bg-night-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Lienzo Canvas de Previsualización */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-night-950/80 rounded-2xl p-4 border border-night-700/60 min-h-[340px] relative overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-h-[360px] max-w-full rounded-xl shadow-lg object-contain border border-gold-DEFAULT/20"
              />
              <span className="text-[11px] text-text-muted mt-2">
                Relación de aspecto activa:{' '}
                <strong className="text-gold-light">{aspectRatio}</strong>
              </span>
            </div>

            {/* Controles de Edición */}
            <div className="lg:col-span-5 space-y-5">
              {/* Selector de Relación de Aspecto */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gold-bright uppercase tracking-wider block">
                  Encuadre / Aspecto
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '4:5', label: '4:5 Editorial', note: 'Catálogo Lujo' },
                    { id: '1:1', label: '1:1 Cuadrado', note: 'Productos' },
                    { id: '16:9', label: '16:9 Banner', note: 'Carrusel' },
                    { id: '3:4', label: '3:4 Retrato', note: 'Fundadora' }
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setAspectRatio(ratio.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        aspectRatio === ratio.id
                          ? 'border-gold-bright bg-gold-DEFAULT/20 text-gold-light shadow-sm'
                          : 'border-night-700 bg-night-800 text-text-secondary hover:border-gold-DEFAULT/40'
                      }`}
                    >
                      <span className="text-xs font-bold block">{ratio.label}</span>
                      <span className="text-[9px] text-text-muted">{ratio.note}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom & Rotación */}
              <div className="space-y-3 pt-2 border-t border-night-700/60">
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ZoomIn className="w-3.5 h-3.5 text-gold-bright" />
                    Zoom ({zoom.toFixed(1)}x)
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="accent-gold-DEFAULT w-32 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span className="flex items-center gap-1.5 font-medium">
                    <RotateCw className="w-3.5 h-3.5 text-gold-bright" />
                    Rotación ({rotation}°)
                  </span>
                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="px-3 py-1 rounded-lg bg-night-700 hover:bg-night-600 text-xs font-semibold text-text-primary"
                  >
                    Girar +90°
                  </button>
                </div>
              </div>

              {/* Ajustes de Color */}
              <div className="space-y-3 pt-2 border-t border-night-700/60">
                <span className="text-xs font-semibold text-gold-bright uppercase tracking-wider block">
                  Ajustes de Color
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Brillo ({brightness}%)</span>
                    <input
                      type="range"
                      min="60"
                      max="140"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                      className="accent-gold-DEFAULT w-32 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Contraste ({contrast}%)</span>
                    <input
                      type="range"
                      min="60"
                      max="140"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                      className="accent-gold-DEFAULT w-32 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Saturación ({saturation}%)</span>
                    <input
                      type="range"
                      min="40"
                      max="160"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value, 10))}
                      className="accent-gold-DEFAULT w-32 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Botones */}
          <div className="flex items-center justify-between pt-4 border-t border-night-700/60">
            <button
              onClick={resetFilters}
              className="text-xs text-text-muted hover:text-gold-light transition-colors"
            >
              Restablecer valores
            </button>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={Check}
                isLoading={isProcessing}
                onClick={handleSave}
              >
                Guardar y Optimizar a WebP
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PhotoEditorModal;
