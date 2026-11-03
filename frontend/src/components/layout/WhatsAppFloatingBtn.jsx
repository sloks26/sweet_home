import React, { useState } from 'react';
import { X } from 'lucide-react';
import WhatsAppIcon from '../ui/WhatsAppIcon';

export const WhatsAppFloatingBtn = ({ whatsapp = '50664656625' }) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const cleanPhone = (whatsapp || '50664656625').replace(/\D/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 select-none">
      {/* Tooltip de bienvenida */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-night-800 to-night-900 border border-gold-DEFAULT/30 shadow-2xl text-xs text-text-primary backdrop-blur-md animate-float max-w-xs">
          <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
          <span>¿Dudas con tu pedido? ¡Escríbenos por WhatsApp! 🌸</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-text-muted hover:text-text-primary p-0.5 ml-1 cursor-pointer"
            aria-label="Cerrar mensaje"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botón flotante Oficial WhatsApp */}
      <a
        href={`https://wa.me/${cleanPhone}?text=Hola%20Sweet%20Home,%20me%20gustar%C3%ADa%20hacer%20una%20consulta%20sobre%20un%20producto`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.45)] hover:shadow-[0_0_24px_rgba(37,211,102,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 text-white group-hover:scale-110 transition-transform drop-shadow" />
      </a>
    </div>
  );
};

export default WhatsAppFloatingBtn;
