import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Crop,
  Search,
  Image as ImageIcon,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Button from '../ui/Button';
import PhotoEditorModal from './PhotoEditorModal';
import { copyToClipboard } from '../../utils/clipboard';

export const AdminMedia = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  // Editor de fotos modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingImageSrc, setEditingImageSrc] = useState(null);

  const fileInputRef = useRef(null);

  const fetchMedia = () => {
    setLoading(true);
    fetch('/api/admin/media')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setMediaList(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUploadFiles = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        fetchMedia();
      } else {
        alert(data.message || 'Error al subir imágenes');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteMedia = async (filename) => {
    if (!confirm('¿Segura que deseas eliminar esta imagen de forma permanente?')) return;

    try {
      const res = await fetch(`/api/admin/media/${filename}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchMedia();
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleCopy = async (url) => {
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  const openEditorForImage = (url) => {
    setEditingImageSrc(url);
    setIsEditorOpen(true);
  };

  const filteredMedia = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary">
            Biblioteca de Medios & Editor
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Sube fotos, edítalas en el navegador con relaciones 1:1, 16:9 o 3:4 y optimízalas
            automáticamente a WebP con Sharp.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleUploadFiles}
            className="hidden"
          />
          <Button
            variant="primary"
            size="md"
            icon={Upload}
            isLoading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            Subir Imágenes
          </Button>
        </div>
      </div>

      {/* Zona de Arrastrar y Soltar */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-8 rounded-3xl border-2 border-dashed border-gold-DEFAULT/30 hover:border-gold-DEFAULT/70 bg-night-800/40 hover:bg-night-800/80 transition-all cursor-pointer text-center space-y-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gold-DEFAULT/15 text-gold-bright flex items-center justify-center mx-auto shadow-gold-sm">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-serif text-base font-bold text-text-primary">
            Haz clic aquí o arrastra imágenes para subir
          </h4>
          <p className="text-xs text-text-secondary mt-1">
            Formatos soportados: JPG, PNG, WebP. Optimización automática a WebP al guardar.
          </p>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-gold-bright absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre de archivo..."
            className="w-full bg-night-800 text-xs rounded-xl pl-9 pr-3.5 py-2.5 border border-night-600 focus:outline-none focus:border-gold-DEFAULT"
          />
        </div>
        <span className="text-xs text-text-muted">
          Total: <strong className="text-gold-light">{filteredMedia.length}</strong> archivo(s)
        </span>
      </div>

      {/* Cuadrícula de Medios */}
      {loading ? (
        <div className="p-12 text-center text-xs text-text-muted">
          Cargando biblioteca de medios...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-12 text-center text-xs text-text-muted bg-night-800/40 rounded-2xl border border-night-700">
          No hay imágenes subidas aún. Sube la primera fotografía con el botón superior.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.filename}
              className="group p-2.5 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/20 hover:border-gold-DEFAULT/50 transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-night-950 border border-night-700">
                <img
                  src={item.thumbUrl}
                  alt={item.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Acciones flotantes */}
                <div className="absolute inset-0 bg-night-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEditorForImage(item.url)}
                    className="p-2 rounded-lg bg-gold-DEFAULT text-night-950 hover:bg-gold-light transition-colors"
                    title="Editar en el navegador"
                  >
                    <Crop className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(item.url)}
                    className="p-2 rounded-lg bg-night-800 text-text-primary hover:text-gold-light transition-colors"
                    title="Copiar URL"
                  >
                    {copiedUrl === item.url ? (
                      <Check className="w-4 h-4 text-status-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(item.filename)}
                    className="p-2 rounded-lg bg-status-error/20 text-status-error hover:bg-status-error/40 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <span
                  className="text-[10px] text-text-muted truncate block font-mono"
                  title={item.filename}
                >
                  {item.filename}
                </span>
                <span className="text-[10px] text-gold-light font-medium block">
                  {(item.size / 1024).toFixed(1)} KB • WebP
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editor de Fotos */}
      <PhotoEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        imageSrc={editingImageSrc}
        onSave={() => fetchMedia()}
      />
    </div>
  );
};

export default AdminMedia;
