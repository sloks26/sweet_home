import React, { useState, useEffect } from 'react';
import {
  Settings,
  Phone,
  MessageCircle,
  Smartphone,
  Building,
  CreditCard,
  Mail,
  MapPin,
  Truck,
  Check,
  Star,
  AlertTriangle,
  Info,
  Share2,
  ExternalLink
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import PaymentPreviewBox from './subcomponents/PaymentPreviewBox';

export const AdminSettings = ({ onSaveSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Campos de Configuración
  const [phone, setPhone] = useState('+506 6465-6625');
  const [whatsapp, setWhatsapp] = useState('50664656625');
  const [sinpePhone, setSinpePhone] = useState('6465-6625');
  const [sinpeHolder, setSinpeHolder] = useState('Maureen Vanessa Sanchez Martinez');
  const [bankHolder, setBankHolder] = useState('Maureen Vanessa Sanchez Martinez');
  const [bankName, setBankName] = useState('BAC Credomatic (San José)');
  const [bankIban, setBankIban] = useState('CR84010200009659820931');
  const [popularBankName, setPopularBankName] = useState('Banco Popular');
  const [popularBankIban, setPopularBankIban] = useState('CR64016111056166941071');
  const [bankIdNumber, setBankIdNumber] = useState('');
  const [storeAddress, setStoreAddress] = useState('San José, Costa Rica');
  const [pickupNote, setPickupNote] = useState('Previa coordinación por WhatsApp');
  const [contactEmail, setContactEmail] = useState('info@sweethomeboutiquecr.com');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('35000');

  // Redes Sociales
  const [instagramHandle, setInstagramHandle] = useState('@sweethomeandboutiquecr');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/sweethomeandboutiquecr');
  const [tiktokHandle, setTiktokHandle] = useState('@sweet.home.boutique.cr');
  const [tiktokUrl, setTiktokUrl] = useState('https://tiktok.com/@sweet.home.boutique.cr');
  const [facebookName, setFacebookName] = useState('Sweet Home & Boutique CR');
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/SweetHomeAndBoutiqueCR');

  useEffect(() => {
    fetch('/api/content/store_settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setPhone(d.phone || '+506 6465-6625');
          setWhatsapp(d.whatsapp || '50664656625');
          setSinpePhone(d.sinpePhone || '6465-6625');
          setSinpeHolder(d.sinpeHolder || 'Maureen Vanessa Sanchez Martinez');
          setBankHolder(d.bankHolder || 'Maureen Vanessa Sanchez Martinez');
          setBankName(d.bankName || 'BAC Credomatic (San José)');
          setBankIban(d.bankIban || 'CR84010200009659820931');
          setPopularBankName(d.popularBankName || 'Banco Popular');
          setPopularBankIban(d.popularBankIban || 'CR64016111056166941071');
          setBankIdNumber(d.bankIdNumber || '');
          setStoreAddress(d.storeAddress || 'San José, Costa Rica');
          setPickupNote(d.pickupNote || 'Previa coordinación por WhatsApp');
          setContactEmail(d.contactEmail || 'info@sweethomeboutiquecr.com');
          setFreeShippingThreshold(d.freeShippingThreshold ? d.freeShippingThreshold.toString() : '35000');

          if (d.social) {
            if (d.social.instagram) {
              setInstagramHandle(d.social.instagram.handle || '@sweethomeandboutiquecr');
              setInstagramUrl(d.social.instagram.url || 'https://instagram.com/sweethomeandboutiquecr');
            }
            if (d.social.tiktok) {
              setTiktokHandle(d.social.tiktok.handle || '@sweet.home.boutique.cr');
              setTiktokUrl(d.social.tiktok.url || 'https://tiktok.com/@sweet.home.boutique.cr');
            }
            if (d.social.facebook) {
              setFacebookName(d.social.facebook.name || 'Sweet Home & Boutique CR');
              setFacebookUrl(d.social.facebook.url || 'https://facebook.com/SweetHomeAndBoutiqueCR');
            }
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const payload = {
      phone: phone.trim(),
      whatsapp: whatsapp.replace(/\D/g, ''),
      sinpePhone: sinpePhone.trim(),
      sinpeHolder: sinpeHolder.trim(),
      bankName: bankName.trim(),
      bankHolder: bankHolder.trim(),
      bankIban: bankIban.trim(),
      popularBankName: popularBankName.trim(),
      popularBankIban: popularBankIban.trim(),
      bankIdNumber: bankIdNumber.trim(),
      storeAddress: storeAddress.trim(),
      pickupNote: pickupNote.trim(),
      contactEmail: contactEmail.trim(),
      freeShippingThreshold: parseFloat(freeShippingThreshold) || 35000,
      social: {
        instagram: {
          handle: instagramHandle.trim(),
          url: instagramUrl.trim()
        },
        tiktok: {
          handle: tiktokHandle.trim(),
          url: tiktokUrl.trim()
        },
        facebook: {
          name: facebookName.trim(),
          url: facebookUrl.trim()
        }
      }
    };

    try {
      const res = await fetch('/api/admin/content/store_settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload })
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setIsDirty(false);
        if (onSaveSuccess) onSaveSuccess(payload);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert(data.message || 'Error al guardar ajustes');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary flex items-center gap-2.5">
            <Settings className="w-8 h-8 text-gold-DEFAULT" />
            <span>Ajustes Generales de la Boutique</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Reemplaza aquí los datos de contacto (SINPE Móvil, teléfono, WhatsApp, cuentas bancarias BAC / Popular y correos) por tus datos reales.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Check}
          isLoading={saving}
          onClick={handleSave}
        >
          Guardar Ajustes
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 shadow-sm">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>¡Ajustes actualizados con éxito en toda la tienda pública (Header, Footer, Checkout, Modal de Envío y WhatsApp)!</span>
        </div>
      )}

      {/* Formulario de Ajustes Centralizados */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Bloque 1: Canales de Atención y Contacto */}
        <div className="p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/25 space-y-4">
          <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2 border-b border-night-700/60 pb-3">
            <MessageCircle className="w-5 h-5 text-gold-bright" />
            <span>Teléfonos y Canales de Atención</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Teléfono Visible al Público"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Ej: +506 8765-4321"
              required
            />
            <div className="space-y-1.5">
              <Input
                label="Número de WhatsApp (con código 506 sin espacios)"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Ej: 50687654321"
                required
              />
              <div className="flex items-center justify-between text-[11px] px-1">
                <span className={whatsapp.replace(/\D/g, '').length >= 8 ? 'text-emerald-400' : 'text-amber-300'}>
                  {whatsapp.replace(/\D/g, '').length >= 8 ? '✓ Formato Costa Rica detectado' : '⚠ 506 seguido de 8 dígitos'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const clean = whatsapp.replace(/\D/g, '');
                    const phone = clean.startsWith('506') ? clean : `506${clean}`;
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Hola Sweet Home, prueba de enlace ✨')}`, '_blank');
                  }}
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Probar enlace de WhatsApp</span>
                </button>
              </div>
            </div>
            <Input
              label="Correo de Contacto"
              value={contactEmail}
              onChange={(e) => {
                setContactEmail(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Ej: boutique@sweethomecr.com"
              required
            />
            <Input
              label="Ubicación / Tienda Física"
              value={storeAddress}
              onChange={(e) => {
                setStoreAddress(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Ej: San José, Curridabat, Costa Rica"
              required
            />
          </div>
        </div>

        {/* Bloque 2: Redes Sociales Oficiales */}
        <div className="p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/25 space-y-4">
          <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2 border-b border-night-700/60 pb-3">
            <Share2 className="w-5 h-5 text-gold-bright" />
            <span>Redes Sociales Oficiales</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Instagram: Usuario / Handle"
              value={instagramHandle}
              onChange={(e) => {
                setInstagramHandle(e.target.value);
                setIsDirty(true);
              }}
              placeholder="@sweethomeandboutiquecr"
            />
            <Input
              label="Instagram: Enlace Completo (URL)"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/sweethomeandboutiquecr"
            />
            <Input
              label="TikTok: Usuario / Handle"
              value={tiktokHandle}
              onChange={(e) => setTiktokHandle(e.target.value)}
              placeholder="@sweet.home.boutique.cr"
            />
            <Input
              label="TikTok: Enlace Completo (URL)"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://tiktok.com/@sweet.home.boutique.cr"
            />
            <Input
              label="Facebook: Nombre de Página"
              value={facebookName}
              onChange={(e) => setFacebookName(e.target.value)}
              placeholder="Sweet Home & Boutique CR"
            />
            <Input
              label="Facebook: Enlace Completo (URL)"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/SweetHomeAndBoutiqueCR"
            />
          </div>
        </div>

        {/* Bloque 3: Medios Oficiales de Pago (SINPE Móvil y Transferencias Bancarias) */}
        <div className="p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/25 space-y-4">
          <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2 border-b border-night-700/60 pb-3">
            <Smartphone className="w-5 h-5 text-gold-bright" />
            <span>Medios de Pago Oficiales (SINPE Móvil & Bancos)</span>
          </h3>

          <div className="space-y-4">
            {/* SINPE Móvil */}
            <div className="p-4 rounded-xl bg-night-900/60 border border-gold-DEFAULT/20 space-y-3">
              <h4 className="text-xs font-bold text-gold-bright uppercase tracking-wider">
                1. SINPE Móvil
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Número de Teléfono SINPE Móvil"
                  value={sinpePhone}
                  onChange={(e) => setSinpePhone(e.target.value)}
                  placeholder="Ej: 6465-6625"
                  required
                />
                <Input
                  label="Titular de la Línea SINPE Móvil"
                  value={sinpeHolder}
                  onChange={(e) => setSinpeHolder(e.target.value)}
                  placeholder="Ej: Maureen Vanessa Sanchez Martinez"
                  required
                />
              </div>
            </div>

            {/* Transferencias Bancarias */}
            <div className="p-4 rounded-xl bg-night-900/60 border border-gold-DEFAULT/20 space-y-3">
              <h4 className="text-xs font-bold text-gold-bright uppercase tracking-wider">
                2. Transferencias Bancarias
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Titular General de las Cuentas Bancarias"
                    value={bankHolder}
                    onChange={(e) => setBankHolder(e.target.value)}
                    placeholder="Ej: Maureen Vanessa Sanchez Martinez"
                    required
                  />
                </div>
                <Input
                  label="Banco 1: Nombre"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="BAC Credomatic (San José)"
                  required
                />
                <Input
                  label="Banco 1: Cuenta IBAN (Colones)"
                  value={bankIban}
                  onChange={(e) => setBankIban(e.target.value)}
                  placeholder="CR84010200009659820931"
                  required
                />
                <Input
                  label="Banco 2: Nombre"
                  value={popularBankName}
                  onChange={(e) => setPopularBankName(e.target.value)}
                  placeholder="Banco Popular"
                  required
                />
                <Input
                  label="Banco 2: Cuenta IBAN (Colones)"
                  value={popularBankIban}
                  onChange={(e) => {
                    setPopularBankIban(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="CR64016111056166941071"
                  required
                />
              </div>
            </div>

            {/* Vista Previa de Pago en Vivo */}
            <PaymentPreviewBox
              sinpePhone={sinpePhone}
              sinpeHolder={sinpeHolder}
              bankName={bankName}
              bankIban={bankIban}
              bankHolder={bankHolder}
              popularBankName={popularBankName}
              popularBankIban={popularBankIban}
            />
          </div>
        </div>

        {/* Bloque 4: Políticas de Envío y Retiro */}
        <div className="p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/25 space-y-4">
          <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2 border-b border-night-700/60 pb-3">
            <Truck className="w-5 h-5 text-gold-bright" />
            <span>Políticas de Envío y Retiro</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Monto Mínimo para Envío GRATIS (en Colones ₡)"
              value={freeShippingThreshold}
              onChange={(e) => {
                setFreeShippingThreshold(e.target.value);
                setIsDirty(true);
              }}
              placeholder="35000"
              required
            />
            <Input
              label="Nota para Retiro en Tienda"
              value={pickupNote}
              onChange={(e) => {
                setPickupNote(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Ej: Previa coordinación por WhatsApp"
              required
            />
          </div>
        </div>

        {/* Notificación de datos de ejemplo */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-300">Sincronización en Tiempo Real</h4>
            <p className="leading-relaxed text-[#D6C8DD]">
              Al guardar tus datos en este formulario, se actualizarán en vivo y de manera inmediata en toda la plataforma (Header, Footer, Checkout, Modal de Envío y WhatsApp).
            </p>
          </div>
        </div>

        {/* Barra Fija de Guardado (Sticky Bottom) para Celular y Escritorio */}
        <div className="sticky bottom-16 lg:bottom-4 z-30 p-3.5 sm:p-4 rounded-2xl bg-night-950/95 backdrop-blur-md border border-gold-DEFAULT/30 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isDirty ? (
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                <span className="hidden sm:inline">Tienes cambios sin guardar</span>
                <span className="sm:hidden">Cambios pendientes</span>
              </span>
            ) : savedSuccess ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 shrink-0" />
                <span>Ajustes guardados correctamente</span>
              </span>
            ) : (
              <span className="text-xs text-text-muted">Todos los cambios guardados</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Check}
            isLoading={saving}
            className="shadow-lg min-h-[44px]"
          >
            Guardar Ajustes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
