import React, { useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Instagram,
  Facebook
} from 'lucide-react';
import Logo from '../ui/Logo';

export const Footer = ({
  categories = [],
  onOpenAdminLogin,
  onOpenTracking,
  onOpenInfo,
  authUser,
  storeSettings
}) => {
  const currentPhone = storeSettings?.phone || '+506 6465-6625';
  const currentWhatsapp = storeSettings?.whatsapp || '50664656625';
  const currentEmail = storeSettings?.contactEmail || 'info@sweethomeboutiquecr.com';
  const currentSinpe = storeSettings?.sinpePhone || '6465-6625';
  const currentSinpeHolder = storeSettings?.sinpeHolder || 'Maureen Vanessa Sanchez Martinez';
  const currentBankHolder = storeSettings?.bankHolder || 'Maureen Vanessa Sanchez Martinez';
  const currentBac = storeSettings?.bankIban || 'CR84010200009659820931';
  const currentPopular = storeSettings?.popularBankIban || 'CR64016111056166941071';
  const social = storeSettings?.social || {
    instagram: {
      handle: '@sweethomeandboutiquecr',
      url: 'https://instagram.com/sweethomeandboutiquecr'
    },
    tiktok: {
      handle: '@sweet.home.boutique.cr',
      url: 'https://tiktok.com/@sweet.home.boutique.cr'
    },
    facebook: {
      name: 'Sweet Home & Boutique CR',
      url: 'https://facebook.com/SweetHomeAndBoutiqueCR'
    }
  };

  // Acceso discreto al panel administrativo: 5 o más toques en el texto de copyright
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);

  const handleSecretAdminTrigger = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    tapCountRef.current += 1;

    // A partir del 5to toque (5, 6, 7, 8... toques rápidos), abre el login y se mantiene abierto
    if (tapCountRef.current >= 5) {
      if (onOpenAdminLogin) onOpenAdminLogin();
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 5000);
      return;
    }

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2500);
  };
  return (
    <footer className="border-t border-gold-DEFAULT/20 bg-gradient-to-b from-night-900 via-night-950 to-[#0A0312] text-text-secondary pt-16 pb-10 px-4 sm:px-8 mt-24 relative overflow-hidden">
      {/* Resplandor sutil en esquinas */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-galaxy-light/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-nebula-magenta/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Eslogan Secundario Destacado */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-night-800/80 via-night-700/60 to-night-800/80 border border-gold-DEFAULT/25 text-center space-y-2.5 max-w-4xl mx-auto shadow-galaxy-card">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-gold-bright tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nuestra Promesa</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className="font-serif text-xl sm:text-2xl text-text-primary italic leading-relaxed">
            "Variedad, calidad y amor en cada detalle. Para ti, para tu hogar, para cada momento
            especial."
          </p>
          <span className="text-xs text-gold-light/80 font-sans block pt-1">
            Sweet Home & Boutique CR — Iluminando tus momentos en Costa Rica 🇨🇷
          </span>
        </div>

        {/* 4 Columnas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
          {/* Columna 1: Marca & Contacto */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="default" />
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm pt-2">
              Boutique costarricense especializada en hacer de tu hogar un espacio mágico y en
              resaltar tu estilo con piezas exclusivas y empaques preparados con amor.
            </p>

            <div className="space-y-2 text-[13px] pt-2">
              <a
                href={`https://wa.me/${currentWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-text-secondary hover:text-gold-light transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-status-success shrink-0" />
                <span>WhatsApp: {currentPhone}</span>
              </a>
              <div className="flex items-center gap-2.5 text-text-secondary">
                <Mail className="w-4 h-4 text-gold-bright shrink-0" />
                <span>{currentEmail}</span>
              </div>
              <div className="flex items-center gap-2.5 text-text-secondary">
                <MapPin className="w-4 h-4 text-nebula-pink shrink-0" />
                <span>Tienda en Costa Rica • Envíos a todo el país</span>
              </div>
            </div>

            {/* Redes Sociales Oficiales */}
            <div className="pt-3 border-t border-night-800/80">
              <span className="text-[11px] font-semibold text-gold-bright uppercase tracking-wider block mb-2">
                Síguenos en Redes Sociales
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-night-800 border border-gold-DEFAULT/30 hover:border-gold-bright flex items-center justify-center text-text-secondary hover:text-pink-400 transition-all hover:scale-110"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={social.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-8 h-8 rounded-full bg-night-800 border border-gold-DEFAULT/30 hover:border-gold-bright flex items-center justify-center text-text-secondary hover:text-cyan-400 transition-all hover:scale-110"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                  </svg>
                </a>
                <a
                  href={social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-night-800 border border-gold-DEFAULT/30 hover:border-gold-bright flex items-center justify-center text-text-secondary hover:text-blue-400 transition-all hover:scale-110"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${currentWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-full bg-night-800 border border-gold-DEFAULT/30 hover:border-gold-bright flex items-center justify-center text-text-secondary hover:text-emerald-400 transition-all hover:scale-110"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Columna 2: Categorías Principales */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif text-lg font-bold text-text-primary tracking-wide">
              Categorías
            </h3>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id || cat.slug}>
                  <a
                    href={`#${cat.slug}`}
                    className="hover:text-gold-light hover:translate-x-1 transition-all inline-block"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#catalogo"
                  className="text-gold-bright hover:text-gold-light font-semibold"
                >
                  Ver todas las categorías →
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información & Ayuda */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-serif text-lg font-bold text-text-primary tracking-wide">
              Servicio al Cliente
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-gold-light transition-colors text-left"
                >
                  Seguimiento de Pedido
                </button>
              </li>
              <li>
                <a href="#nuestra-historia" className="hover:text-gold-light transition-colors">
                  Nuestra Historia
                </a>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo && onOpenInfo('envios')}
                  className="hover:text-gold-light transition-colors text-left"
                >
                  Envíos y Entregas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo && onOpenInfo('faq')}
                  className="hover:text-gold-light transition-colors text-left"
                >
                  Preguntas Frecuentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo && onOpenInfo('terminos')}
                  className="hover:text-gold-light transition-colors text-left"
                >
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo && onOpenInfo('privacidad')}
                  className="hover:text-gold-light transition-colors text-left"
                >
                  Política de Privacidad
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 4: Medios de Pago Oficiales (SINPE y Transferencia) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-serif text-lg font-bold text-text-primary tracking-wide">
              Métodos de Pago
            </h3>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Comodidad y seguridad total en Costa Rica:
            </p>

            <div className="space-y-2.5">
              {/* Badge SINPE Móvil */}
              <div className="p-3 rounded-2xl bg-night-800/90 border border-gold-DEFAULT/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/15 border border-gold-DEFAULT/40 flex items-center justify-center font-bold text-gold-bright text-xs shrink-0">
                  SINPE
                </div>
                <div>
                  <span className="text-xs font-semibold text-text-primary block">
                    SINPE Móvil: {currentSinpe}
                  </span>
                  <span className="text-[11px] text-text-muted block truncate max-w-[210px]">
                    Titular: {currentSinpeHolder}
                  </span>
                </div>
              </div>

              {/* Badge Transferencia */}
              <div className="p-3 rounded-2xl bg-night-800/90 border border-gold-DEFAULT/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-galaxy-DEFAULT/20 border border-galaxy-light/40 flex items-center justify-center font-bold text-galaxy-light text-xs shrink-0">
                  IBAN
                </div>
                <div>
                  <span className="text-xs font-semibold text-text-primary block">
                    BAC San José & Banco Popular
                  </span>
                  <span className="text-[11px] text-text-muted block truncate max-w-[210px]">
                    Titular: {currentBankHolder}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[13px] text-text-muted pt-1">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>Verificación de comprobantes respaldada</span>
            </div>
          </div>
        </div>

        {/* Barra Inferior Copyright */}
        <div className="pt-8 border-t border-night-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted text-center sm:text-left">
          <div
            id="secret-admin-trigger"
            onClick={handleSecretAdminTrigger}
            className="select-none cursor-default active:opacity-75 transition-opacity"
            title=""
          >
            Sweet Home & Boutique CR © {new Date().getFullYear()} • Todos los derechos reservados
          </div>
          <div className="flex items-center gap-4 text-text-secondary text-xs sm:text-[13px]">
            <span>Hecho con ❤️ en Costa Rica</span>
            <span>•</span>
            <span>Emprendimiento 100% Tico</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
