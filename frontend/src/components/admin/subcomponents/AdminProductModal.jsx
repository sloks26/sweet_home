import React, { useState, useRef } from 'react';
import {
  Check,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
  Star,
  Loader2,
  Plus
} from 'lucide-react';
import Button from '../../ui/Button';
import Input, { Textarea } from '../../ui/Input';
import Modal from '../../ui/Modal';
import PhotoEditorModal from '../PhotoEditorModal';

export const AdminProductModal = ({
  isOpen,
  onClose,
  editingProduct,
  categories = [],
  name,
  setName,
  sku,
  setSku,
  categoryId,
  setCategoryId,
  subcategoryId,
  setSubcategoryId,
  price,
  setPrice,
  compareAtPrice,
  setCompareAtPrice,
  stock,
  setStock,
  description,
  setDescription,
  shortDescription,
  setShortDescription,
  isFeatured,
  setIsFeatured,
  isNew,
  setIsNew,
  isBestSeller,
  setIsBestSeller,
  isAdult,
  setIsAdult,
  images = [],
  setImages,
  onSave,
  isSaving
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [editingImageSrc, setEditingImageSrc] = useState('');

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);
  const availableSubcategories = selectedCategoryObj?.subcategories || [];

  // Helper para obtener URL normalizada
  const getImgUrl = (img) => (typeof img === 'string' ? img : img?.url || '');

  // Subir fotos directamente desde Móvil (Cámara/Galería) o PC
  const handleDirectUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    setUploadStatus(`Subiendo ${files.length} imagen(es)...`);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const newUrls = result.data.map((item) => item.url);
        setImages((prev) => [...prev, ...newUrls]);
      } else {
        alert(result.message || 'Error al subir las imágenes');
      }
    } catch (err) {
      console.error('Error subiendo imágenes:', err);
      alert('Error de conexión al subir imágenes');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    setImages((prev) => [...prev, manualUrl.trim()]);
    setManualUrl('');
    setShowManualUrl(false);
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const setAsCover = (idx) => {
    if (idx === 0) return;
    setImages((prev) => {
      const selected = prev[idx];
      const remaining = prev.filter((_, i) => i !== idx);
      return [selected, ...remaining];
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        subtitle="Configura precios en colones (₡), inventario y sube fotos desde tu celular o computadora"
      >
        <form onSubmit={onSave} className="space-y-5 pb-4">
          {/* Nombre y SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Nombre del Producto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Difusor Aromático Luna Dorada"
                required
              />
            </div>
            <div>
              <Input
                label="SKU / Código"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Autogenerado si vacío"
              />
            </div>
          </div>

          {/* Categoría y Subcategoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Categoría Principal *</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubcategoryId('');
                }}
                className="w-full bg-night-800 text-text-primary rounded-xl px-3.5 py-2.5 text-sm border border-night-600 focus:outline-none focus:border-gold-DEFAULT cursor-pointer"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isAdult ? '(+18)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Subcategoría (Opcional)</label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full bg-night-800 text-text-primary rounded-xl px-3.5 py-2.5 text-sm border border-night-600 focus:outline-none focus:border-gold-DEFAULT cursor-pointer"
              >
                <option value="">Ninguna</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Precios (₡) y Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Precio de Venta (₡) *"
              type="number"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej: 14500"
              required
            />
            <Input
              label="Precio Regular / Comparación (₡)"
              type="number"
              inputMode="numeric"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="Ej: 18000"
            />
            <Input
              label="Inventario / Stock en Tienda *"
              type="number"
              inputMode="numeric"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Ej: 15"
              required
            />
          </div>

          {/* Descripciones */}
          <Textarea
            label="Descripción Detallada"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Materiales, detalles de aroma, medidas o recomendaciones de uso..."
            required
          />

          <Input
            label="Descripción Corta (aparece en listados)"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Ej: Difusor ultrasónico con luz LED cálida y temporizador."
          />

          {/* GESTOR DE FOTOGRAFÍAS MULTI-FOTO */}
          <div className="space-y-3 pt-3 border-t border-night-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-gold-bright uppercase tracking-wider block">
                  Fotografías del Producto (Múltiples Fotos)
                </span>
                <span className="text-[11px] text-text-muted">
                  Puedes agregar 3 o más fotos. La primera será la foto de portada.
                </span>
              </div>

              {images.length > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  icon={ImageIcon}
                  onClick={() => {
                    setEditingImageSrc(getImgUrl(images[0]));
                    setIsPhotoEditorOpen(true);
                  }}
                >
                  Editor de Fotos
                </Button>
              )}
            </div>

            {/* Input oculto para subir archivos */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleDirectUpload}
              className="hidden"
            />

            {/* Botón principal de subida */}
            <div className="p-4 rounded-2xl bg-night-900 border-2 border-dashed border-gold-DEFAULT/40 hover:border-gold-DEFAULT text-center transition-colors">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 py-3 px-4 cursor-pointer text-text-primary hover:text-gold-light focus:outline-none"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-gold-DEFAULT animate-spin" />
                    <span className="text-xs font-semibold text-gold-light">{uploadStatus}</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-gold-DEFAULT/15 text-gold-bright flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">
                        📷 Subir fotos desde Celular o PC
                      </span>
                      <span className="text-[11px] text-text-muted mt-0.5 block">
                        Toca aquí para seleccionar de tu galería o cámara (puedes elegir varias fotos a la vez)
                      </span>
                    </div>
                  </>
                )}
              </button>

              {/* Opción secundaria para pegar URL manual si fuera necesario */}
              <div className="mt-2 pt-2 border-t border-night-800 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[11px] text-text-muted hover:text-gold-bright underline"
                >
                  {showManualUrl ? 'Ocultar opción de URL manual' : '¿Prefieres pegar un enlace web de imagen?'}
                </button>
              </div>

              {showManualUrl && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    placeholder="https://... o /uploads/..."
                    className="flex-1 bg-night-950 text-text-primary rounded-xl px-3 py-1.5 text-xs border border-night-700 focus:outline-none focus:border-gold-DEFAULT"
                  />
                  <Button type="button" variant="outline" size="xs" onClick={handleAddManualUrl}>
                    Agregar
                  </Button>
                </div>
              )}
            </div>

            {/* Cuadrícula de fotos cargadas con opción de hacer Portada */}
            {images.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{images.length} foto(s) agregada(s)</span>
                  <span className="text-[11px] text-gold-bright">Haz clic en "Hacer Portada" para cambiar la principal</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {images.map((img, idx) => {
                    const url = getImgUrl(img);
                    const isCover = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 group transition-all ${
                          isCover ? 'border-gold-DEFAULT shadow-md shadow-gold-DEFAULT/20' : 'border-night-700 hover:border-gold-DEFAULT/50'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&q=80';
                          }}
                        />

                        {isCover ? (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-gold-DEFAULT text-[9px] font-bold text-night-950 flex items-center gap-0.5 shadow">
                            <Star className="w-2.5 h-2.5 fill-night-950" />
                            <span>Portada</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAsCover(idx)}
                            className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-night-900/90 text-gold-light text-[9px] font-semibold opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold-DEFAULT hover:text-night-950"
                          >
                            Hacer Portada
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-status-error text-white opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                          title="Eliminar foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Insignias y Estados */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-night-700 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded accent-gold-DEFAULT"
              />
              <span>Destacado Home</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="rounded accent-gold-DEFAULT"
              />
              <span>Es Novedad</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded accent-gold-DEFAULT"
              />
              <span>Más Vendido</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAdult}
                onChange={(e) => setIsAdult(e.target.checked)}
                className="rounded accent-gold-DEFAULT"
              />
              <span>🔞 +18 Discreto</span>
            </label>
          </div>

          {/* Botones de Acción Fijos en la parte inferior */}
          <div className="sticky bottom-0 -mx-4 -mb-4 p-4 bg-night-950/95 backdrop-blur-md border-t border-gold-DEFAULT/25 flex items-center justify-end gap-3 z-20">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Check}
              isLoading={isSaving}
              className="min-h-[44px] shadow-lg"
            >
              {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Editor de Fotos 1:1 */}
      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
        imageSrc={editingImageSrc || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'}
        onSave={(newImg) => {
          setImages((prev) => [...prev, newImg.url]);
        }}
      />
    </>
  );
};

export default AdminProductModal;
