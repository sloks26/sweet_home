import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Check,
  Heart,
  Sparkles,
  Image,
  Eye,
  UploadCloud,
  Loader2
} from 'lucide-react';
import Button from '../ui/Button';
import Input, { Textarea } from '../ui/Input';
import PhotoEditorModal from './PhotoEditorModal';

export const AdminOurStory = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Campos de Nuestra Historia
  const [badge, setBadge] = useState('El corazón de nuestra boutique');
  const [title, setTitle] = useState('Nuestra Historia');
  const [subtitle, setSubtitle] = useState('Un sueño costarricense que nació para iluminar hogares');
  const [founderName, setFounderName] = useState('Fundadora & Directora Creativa');
  const [founderRole, setFounderRole] = useState('Sweet Home & Boutique CR');
  const [founderPhoto, setFounderPhoto] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80');
  const [paragraphsText, setParagraphsText] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [mobileTab, setMobileTab] = useState('edit');

  // Modal editor de foto
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);

  useEffect(() => {
    fetch('/api/content/our_story')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setBadge(d.badge || 'El corazón de nuestra boutique');
          setTitle(d.title || 'Nuestra Historia');
          setSubtitle(d.subtitle || '');
          setFounderName(d.founderName || 'Fundadora & Directora Creativa');
          setFounderRole(d.founderRole || 'Sweet Home & Boutique CR');
          setFounderPhoto(d.founderPhoto || '');
          setParagraphsText(Array.isArray(d.storyParagraphs) ? d.storyParagraphs.join('\n\n') : '');
          setIsActive(d.isActive !== undefined ? d.isActive : true);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const saveStory = async (extra = {}) => {
    const storyParagraphs = paragraphsText
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const payload = {
      badge,
      title,
      subtitle,
      founderName,
      founderRole,
      founderPhoto,
      storyParagraphs,
      isActive,
      isProvisional: false, // Al guardar por primera vez la dueña ya lo hace propio
      ...extra
    };

    const res = await fetch('/api/admin/content/our_story', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    });
    return await res.json();
  };

  // Subir fotografía directamente desde el celular o computadora
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
        const newPhotoUrl = data.data[0].url;
        setFounderPhoto(newPhotoUrl);
        // Guardado automático inmediato en la base de datos para no depender del botón
        const saved = await saveStory({ founderPhoto: newPhotoUrl });
        if (saved.success) {
          alert('✨ ¡Fotografía subida y guardada exitosamente en la tienda!');
        }
      } else {
        alert(data.message || 'Error al subir la fotografía');
      }
    } catch (err) {
      console.error('Error subiendo foto de fundadora:', err);
      alert('Error de conexión al subir la fotografía');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const data = await saveStory();
      if (data.success) {
        alert('✨ ¡Sección Nuestra Historia actualizada con éxito en la tienda!');
      } else {
        alert(data.message || 'Error al guardar');
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const storyParagraphsList = paragraphsText
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary">
            Editar "Nuestra Historia"
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Personaliza la sección especial del Home: tu fotografía, tu relato, firma y valores de marca.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Check}
          isLoading={saving}
          onClick={handleSave}
          className="hidden sm:inline-flex"
        >
          Guardar Cambios
        </Button>
      </div>

      {/* Pestañas para Móvil: Editar | Vista Previa */}
      <div className="lg:hidden flex rounded-xl bg-night-900 p-1 border border-night-700/80">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            mobileTab === 'edit'
              ? 'bg-gold-DEFAULT text-night-950 font-bold shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Editar Historia
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'bg-gold-DEFAULT text-night-950 font-bold shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vista Previa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario de Edición */}
        <div className={`lg:col-span-6 space-y-6 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4 rounded-2xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 text-xs text-gold-light space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-gold-bright">
              <Sparkles className="w-4 h-4" />
              <span>Conexión Emocional con tus Clientes</span>
            </span>
            <p>
              Esta sección transmite calidez y confianza a quienes compran en tu boutique. Puedes subir tu foto directamente desde tu celular o computadora.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Insignia Superior"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Ej: El corazón de nuestra boutique"
            />

            <Input
              label="Título Principal (Tipografía Script)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Nuestra Historia"
            />

            <Input
              label="Subtítulo"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ej: Un sueño costarricense que nació para iluminar hogares"
            />

            {/* SECCIÓN DE FOTOGRAFÍA DE LA FUNDADORA CON SUBIDA DIRECTA */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-night-900 border border-gold-DEFAULT/25">
              <label className="text-xs font-semibold text-gold-light uppercase tracking-wider block">
                Fotografía de la Fundadora (Retrato 3:4)
              </label>

              {/* Input oculto para subir desde teléfono o PC */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  icon={isUploadingPhoto ? Loader2 : UploadCloud}
                  disabled={isUploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploadingPhoto ? 'Subiendo foto...' : '📷 Subir foto desde Celular o PC'}
                </Button>

                {founderPhoto && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={Image}
                    onClick={() => setIsPhotoEditorOpen(true)}
                    title="Recortar y ajustar foto en el editor"
                  >
                    Recortar Foto
                  </Button>
                )}
              </div>

              <div className="pt-1">
                <input
                  type="text"
                  value={founderPhoto}
                  onChange={(e) => setFounderPhoto(e.target.value)}
                  className="w-full bg-night-950 text-text-primary rounded-xl px-3.5 py-2 text-xs border border-night-700 focus:outline-none focus:border-gold-DEFAULT"
                  placeholder="O pega URL (https://... o /uploads/...)"
                />
              </div>
            </div>

            <Textarea
              label="Párrafos del Relato (Separa cada párrafo con dos saltos de línea)"
              rows={8}
              value={paragraphsText}
              onChange={(e) => setParagraphsText(e.target.value)}
              placeholder="Escribe tu historia aquí..."
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre / Firma"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="Ej: Fundadora & Directora Creativa"
              />
              <Input
                label="Cargo / Subtítulo Firma"
                value={founderRole}
                onChange={(e) => setFounderRole(e.target.value)}
                placeholder="Ej: Sweet Home & Boutique CR"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="storyActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-gold-DEFAULT focus:ring-gold-DEFAULT accent-gold-DEFAULT cursor-pointer"
              />
              <label htmlFor="storyActive" className="text-xs text-text-primary cursor-pointer select-none">
                Mostrar sección "Nuestra Historia" activa en el Home
              </label>
            </div>
          </div>
        </div>

        {/* Vista Previa en Vivo (Side-by-side en Desktop, Pestaña en Móvil) */}
        <div className={`lg:col-span-6 space-y-3 sticky top-24 ${mobileTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gold-bright uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>Vista Previa en Tiempo Real</span>
            </span>
            <span className="text-[11px] text-text-muted">Como se ve en el Home</span>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FDF2F5] via-[#FDF0F4] to-[#FCEAEF] text-[#1A0B2E] border border-[#F3D5E2] shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Marco de Arco Dorado */}
              <div className="relative p-2 rounded-t-[90px] rounded-b-[25px] bg-gradient-to-b from-gold-light via-gold-DEFAULT to-gold-dark shadow-gold-md shrink-0">
                <div className="w-36 h-48 rounded-t-[84px] rounded-b-[20px] overflow-hidden bg-night-950 relative">
                  <img
                    src={founderPhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'}
                    alt="Fundadora"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/40 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#FFF5F8] border-2 border-gold-bright flex items-center justify-center shadow-sm">
                  <Heart className="w-4 h-4 text-gold-DEFAULT fill-gold-DEFAULT" />
                </div>
              </div>

              {/* Textos Previa */}
              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gold-DEFAULT/20 text-[#8C6D1F] border border-gold-DEFAULT/40 font-bold inline-block uppercase tracking-wider">
                  {badge}
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#1A0B2E] leading-tight truncate">
                  {title}
                </h3>
                <p className="text-xs text-[#5C4A6E] font-medium">
                  {subtitle}
                </p>
                <div className="pt-2">
                  <span className="font-script text-2xl text-[#B8860B] block">
                    {founderName}
                  </span>
                  <span className="text-[10px] text-[#7A6B8A] uppercase font-semibold">
                    {founderRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Párrafos Previa */}
            <div className="space-y-2 text-xs text-[#4A3D59] leading-relaxed border-t border-[#E8DACB] pt-4 max-h-48 overflow-y-auto pr-2">
              {storyParagraphsList.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botón Guardar Fijo para Celular (Formularios largos) */}
      <div className="lg:hidden sticky bottom-16 -mx-4 -mb-4 p-3 bg-night-950/95 backdrop-blur-md border-t border-gold-DEFAULT/25 z-20">
        <Button
          variant="primary"
          size="md"
          className="w-full py-3.5 text-sm font-bold shadow-lg"
          icon={Check}
          isLoading={saving}
          onClick={handleSave}
        >
          Guardar Cambios de Nuestra Historia
        </Button>
      </div>

      {/* Editor de Foto */}
      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
        imageSrc={founderPhoto}
        onSave={async (newImg) => {
          setFounderPhoto(newImg.url);
          const saved = await saveStory({ founderPhoto: newImg.url });
          if (saved.success) {
            alert('✨ ¡Fotografía recortada y guardada con éxito en la tienda!');
          }
        }}
      />
    </div>
  );
};

export default AdminOurStory;
