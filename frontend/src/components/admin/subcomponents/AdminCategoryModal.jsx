import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  Lock,
  Image as ImageIcon,
  Crop,
  X,
  UploadCloud,
  Loader2
} from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Modal from '../../ui/Modal';
import PhotoEditorModal from '../PhotoEditorModal';

export const AdminCategoryModal = ({
  isOpen,
  onClose,
  editingCategory,
  onSaveSuccess
}) => {
  const catFileInputRef = useRef(null);
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('Sparkles');
  const [categoryImage, setCategoryImage] = useState('');
  const [menuBadge, setMenuBadge] = useState('');
  const [menuTitle, setMenuTitle] = useState('');
  const [menuLink, setMenuLink] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [featuredInMenu, setFeaturedInMenu] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name || '');
      setCategorySlug(editingCategory.slug || '');
      setCategoryDesc(editingCategory.description || '');
      setCategoryIcon(editingCategory.icon || 'Sparkles');
      setCategoryImage(editingCategory.image || '');
      setMenuBadge(editingCategory.menuBadge || '');
      setMenuTitle(editingCategory.menuTitle || '');
      setMenuLink(editingCategory.menuLink || '');
      setIsAdult(!!editingCategory.isAdult);
      setFeaturedInMenu(editingCategory.featuredInMenu ?? true);
    } else {
      setCategoryName('');
      setCategorySlug('');
      setCategoryDesc('');
      setCategoryIcon('Sparkles');
      setCategoryImage('');
      setMenuBadge('');
      setMenuTitle('');
      setMenuLink('');
      setIsAdult(false);
      setFeaturedInMenu(true);
    }
  }, [editingCategory, isOpen]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('images', file);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.data?.[0]?.url) {
        setCategoryImage(data.data[0].url);
      } else {
        alert(data.message || 'Error al subir la imagen');
      }
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      alert('Error de conexión al subir la imagen');
    } finally {
      setIsUploadingPhoto(false);
      if (catFileInputRef.current) catFileInputRef.current.value = '';
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) return;

    setIsSubmitting(true);
    const payload = {
      name: categoryName,
      slug: categorySlug.trim() || undefined,
      description: categoryDesc,
      icon: categoryIcon,
      image: isAdult ? null : (categoryImage.trim() || null),
      menuBadge: isAdult ? null : (menuBadge.trim() || null),
      menuTitle: isAdult ? null : (menuTitle.trim() || null),
      menuLink: isAdult ? null : (menuLink.trim() || null),
      isAdult,
      featuredInMenu
    };

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        onClose();
        if (onSaveSuccess) onSaveSuccess();
      } else {
        alert(data.message || 'Error al guardar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        subtitle="Configura el nombre, ícono y visibilidad en el menú de navegación"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 pb-4">
          <Input
            label="Nombre de la Categoría"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Ej: Joyería Fina"
            required
          />

          <Input
            label="Slug / Identificador URL (opcional)"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            placeholder="Ej: joyeria-fina"
          />

          <Input
            label="Descripción Corta"
            value={categoryDesc}
            onChange={(e) => setCategoryDesc(e.target.value)}
            placeholder="Ej: Piezas y detalles que complementan tu brillo."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Ícono Lineal</label>
              <select
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                className="w-full bg-night-950 text-text-primary rounded-xl px-3 py-2.5 text-xs border border-night-700 focus:outline-none focus:border-gold-DEFAULT cursor-pointer"
              >
                <option value="Home">Hogar (Home)</option>
                <option value="Shirt">Moda (Shirt)</option>
                <option value="Watch">Accesorios (Watch)</option>
                <option value="Sparkles">Belleza (Sparkles)</option>
                <option value="Heart">Perfumes (Heart)</option>
                <option value="Smile">Maquillaje (Smile)</option>
                <option value="Shield">Cuidado Personal (Shield)</option>
                <option value="Lock">Bienestar Íntimo (Lock)</option>
                <option value="Gift">Novedades y Regalos (Gift)</option>
                <option value="Activity">Omnilife y Más (Activity)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Enlace Destacado (opcional)</label>
              <input
                type="text"
                value={menuLink}
                onChange={(e) => setMenuLink(e.target.value)}
                placeholder="Ej: #joyeria-fina"
                className="w-full bg-night-950 text-text-primary rounded-xl px-3 py-2.5 text-xs border border-night-700 focus:outline-none focus:border-gold-DEFAULT"
              />
            </div>
          </div>

          {/* TARJETA DESTACADA DEL MEGA MENÚ */}
          <div className="p-4 rounded-2xl bg-night-950 border border-gold-DEFAULT/25 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gold-light uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-gold-bright" />
                <span>Tarjeta Destacada del Mega Menú</span>
              </h4>
              {categoryImage && !isAdult && (
                <button
                  type="button"
                  onClick={() => setCategoryImage('')}
                  className="text-[11px] text-status-error hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Quitar foto</span>
                </button>
              )}
            </div>

            {isAdult ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                🔒 <strong>Bienestar Íntimo (+18):</strong> Por política de discreción y privacidad del cliente, esta categoría <strong>no muestra fotografías</strong> en el menú desplegable. Las columnas se reacomodan automáticamente sin dejar espacios vacíos.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Rótulo Superior (opcional)"
                    value={menuBadge}
                    onChange={(e) => setMenuBadge(e.target.value)}
                    placeholder="Ej: Colección Nueva"
                  />
                  <Input
                    label="Título de la Tarjeta (opcional)"
                    value={menuTitle}
                    onChange={(e) => setMenuTitle(e.target.value)}
                    placeholder={categoryName || 'Nombre de la categoría'}
                  />
                </div>

                {/* Subir foto directa desde móvil o PC */}
                <input
                  type="file"
                  ref={catFileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary block">
                    Fotografía Destacada (WebP optimizada)
                  </label>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      icon={isUploadingPhoto ? Loader2 : UploadCloud}
                      disabled={isUploadingPhoto}
                      onClick={() => catFileInputRef.current?.click()}
                    >
                      {isUploadingPhoto ? 'Subiendo foto...' : '📷 Subir foto desde Celular o PC'}
                    </Button>

                    {categoryImage && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        icon={Crop}
                        onClick={() => setIsPhotoEditorOpen(true)}
                        title="Recortar foto en el editor"
                      >
                        Recortar Foto
                      </Button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={categoryImage}
                    onChange={(e) => setCategoryImage(e.target.value)}
                    placeholder="O pega URL (https://... o /uploads/...)"
                    className="w-full bg-night-900 text-text-primary rounded-xl px-3 py-2 text-xs border border-night-700 focus:outline-none focus:border-gold-DEFAULT"
                  />
                </div>

                {categoryImage ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[16/10] max-h-40 bg-night-900 border border-gold-DEFAULT/20">
                    <img
                      src={categoryImage}
                      alt={menuTitle || categoryName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/40 to-transparent p-3 flex flex-col justify-end">
                      {menuBadge && (
                        <span className="text-[10px] text-gold-bright font-bold uppercase">{menuBadge}</span>
                      )}
                      <span className="text-xs font-bold text-white">{menuTitle || categoryName}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-text-muted italic">
                    Sin imagen asignada: el mega menú desplegará las subcategorías en columnas completas sin dejar huecos.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Opciones Especiales */}
          <div className="space-y-2 pt-2 border-t border-night-700 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdult}
                onChange={(e) => {
                  setIsAdult(e.target.checked);
                  if (e.target.checked) setCategoryImage('');
                }}
                className="rounded accent-gold-DEFAULT"
              />
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-status-warning" />
                <span>Marcar como +18 (Requiere verificación de edad, sin fotos en menú)</span>
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredInMenu}
                onChange={(e) => setFeaturedInMenu(e.target.checked)}
                className="rounded accent-gold-DEFAULT"
              />
              <span>Mostrar en barra de navegación principal</span>
            </label>
          </div>

          {/* Botones al pie del modal con espaciado móvil */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-night-700">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Check}
              isLoading={isSubmitting}
            >
              {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
          </div>
        </form>
      </Modal>

      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
        imageSrc={categoryImage}
        onSave={(newImg) => setCategoryImage(newImg.url)}
      />
    </>
  );
};

export default AdminCategoryModal;
