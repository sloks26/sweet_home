import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  ArrowUp,
  ArrowDown,
  Check,
  AlertTriangle,
  Image as ImageIcon,
  Calendar,
  Sparkles
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import PhotoEditorModal from './PhotoEditorModal';

export const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Formulario
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [ctaText, setCtaText] = useState('Ver Colección');
  const [ctaLink, setCtaLink] = useState('#catalogo');
  const [desktopImage, setDesktopImage] = useState('');
  const [mobileImage, setMobileImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);

  const fetchBanners = () => {
    setLoading(true);
    fetch('/api/admin/banners')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setBanners(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setBadgeText('Nueva Colección 2026');
    setCtaText('Ver Colección');
    setCtaLink('#catalogo');
    setDesktopImage('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80');
    setMobileImage('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80');
    setIsActive(true);
    setIsEditModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setBadgeText(banner.badge || '');
    setCtaText(banner.ctaText || 'Ver Colección');
    setCtaLink(banner.ctaLink || '#catalogo');
    setDesktopImage(banner.desktopImage);
    setMobileImage(banner.mobileImage || banner.desktopImage);
    setIsActive(banner.isActive);
    setIsEditModalOpen(true);
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    const payload = {
      title,
      subtitle,
      badge: badgeText,
      ctaText,
      ctaLink,
      desktopImage,
      mobileImage: mobileImage || desktopImage,
      isActive
    };

    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setIsEditModalOpen(false);
        fetchBanners();
      } else {
        alert(data.message || 'Error al guardar');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm('¿Estás segura de eliminar este banner del carrusel?')) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBanners();
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const newBanners = [...banners];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newBanners.length) return;

    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    setBanners(newBanners);

    const orderedIds = newBanners.map((b) => b.id);
    await fetch('/api/admin/banners-reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds })
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary">
            Banners y Hero Carrusel
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Administra las diapositivas principales de la tienda, textos, imágenes y orden de visualización.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={openCreateModal}
        >
          Agregar Diapositiva
        </Button>
      </div>

      {/* Lista de Banners */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">
            Cargando banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 rounded-2xl bg-night-800/60 border border-gold-DEFAULT/20 text-center space-y-3">
            <ImageIcon className="w-10 h-10 text-gold-bright mx-auto opacity-50" />
            <h4 className="font-serif text-lg font-bold text-text-primary">No hay banners creados</h4>
            <Button variant="primary" size="sm" onClick={openCreateModal}>
              Crear el Primer Banner
            </Button>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className="p-5 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/20 hover:border-gold-DEFAULT/40 transition-all flex flex-col lg:flex-row items-center gap-6"
            >
              {/* Miniatura del Banner */}
              <div className="w-full lg:w-64 h-36 rounded-xl overflow-hidden bg-night-950 border border-night-600 relative shrink-0 shadow-inner">
                <img
                  src={banner.desktopImage}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant={banner.isActive ? 'success' : 'outline'} size="sm">
                    {banner.isActive ? 'Activo' : 'Pausado'}
                  </Badge>
                </div>
              </div>

              {/* Información */}
              <div className="flex-1 space-y-1.5 min-w-0 text-center lg:text-left">
                {banner.badge && (
                  <span className="text-[11px] text-gold-bright font-semibold uppercase tracking-wider block">
                    {banner.badge}
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-text-primary truncate">
                  {banner.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {banner.subtitle || 'Sin subtítulo'}
                </p>
                <div className="text-xs text-text-muted pt-1">
                  Botón: <strong className="text-gold-light">{banner.ctaText}</strong> ({banner.ctaLink})
                </div>
              </div>

              {/* Controles de Orden y Acciones */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center border border-night-700 rounded-xl overflow-hidden bg-night-900">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveOrder(index, -1)}
                    className="p-2 text-text-secondary hover:text-gold-light hover:bg-night-800 disabled:opacity-30"
                    title="Subir posición"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === banners.length - 1}
                    onClick={() => handleMoveOrder(index, 1)}
                    className="p-2 text-text-secondary hover:text-gold-light hover:bg-night-800 disabled:opacity-30"
                    title="Bajar posición"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit2}
                  onClick={() => openEditModal(banner)}
                >
                  Editar
                </Button>

                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="p-2.5 rounded-xl border border-status-error/30 text-status-error hover:bg-status-error/20 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Crear / Editar Banner */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingBanner ? 'Editar Banner del Hero' : 'Nueva Diapositiva del Hero'}
        subtitle="Configura textos, imágenes y botones con vista previa instantánea"
      >
        <form onSubmit={handleSaveBanner} className="space-y-4">
          <Input
            label="Título Principal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Donde cada detalle ilumina tu hogar"
            required
          />

          <Input
            label="Subtítulo / Descripción Breve"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ej: Descubre aromas y piezas exclusivas con envíos a todo el país."
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Insignia / Badge"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="Ej: Nueva Colección 2026"
            />
            <Input
              label="Texto del Botón"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Ej: Ver Colección Hogar"
            />
          </div>

          <Input
            label="Enlace del Botón"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            placeholder="Ej: #hogar o #ofertas"
          />

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="URL Imagen Escritorio (1920x800 recomendado)"
                value={desktopImage}
                onChange={(e) => setDesktopImage(e.target.value)}
                placeholder="https://... o /uploads/..."
                required
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={ImageIcon}
              onClick={() => setIsPhotoEditorOpen(true)}
              className="mb-0.5 shrink-0"
              title="Recortar y editar foto para banner (16:9)"
            >
              Editor de Foto
            </Button>
          </div>

          <Input
            label="URL Imagen Móvil (opcional, vertical)"
            value={mobileImage}
            onChange={(e) => setMobileImage(e.target.value)}
            placeholder="https://... o /uploads/..."
          />

          {/* Switch de activación */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="bannerActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-gold-DEFAULT focus:ring-gold-DEFAULT accent-gold-DEFAULT cursor-pointer"
            />
            <label htmlFor="bannerActive" className="text-xs text-text-primary cursor-pointer select-none">
              Activar este banner en el carrusel de la tienda
            </label>
          </div>

          {/* Vista Previa en Vivo */}
          {desktopImage && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-gold-bright uppercase tracking-wider block">
                Vista Previa
              </span>
              <div className="relative h-44 rounded-2xl overflow-hidden bg-night-950 border border-gold-DEFAULT/30">
                <img src={desktopImage} alt="Previa" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-night-950/90 via-night-900/60 to-transparent flex flex-col justify-center p-5 space-y-1">
                  {badgeText && <Badge variant="gold" size="sm">{badgeText}</Badge>}
                  <h4 className="font-serif text-lg font-bold text-text-primary leading-tight">
                    {title || 'Título de muestra'}
                  </h4>
                  <p className="text-[11px] text-text-secondary line-clamp-1">{subtitle}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-night-700/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Check}
              isLoading={formSubmitting}
            >
              {editingBanner ? 'Guardar Cambios' : 'Publicar Banner'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Editor de Foto para Banners (Recorte 16:9) */}
      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
        imageSrc={desktopImage || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80'}
        onSave={(newImg) => setDesktopImage(newImg.url)}
      />
    </div>
  );
};

export default AdminBanners;
