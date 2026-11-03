import React, { useState, useEffect } from 'react';
import { Sparkles, Package, MessageCircle } from 'lucide-react';

export const HeaderPromoBar = ({ isScrolled, onOpenTracking, storeSettings }) => {
  const [promoMessageIndex, setPromoMessageIndex] = useState(0);

  const promoMessages = [
    '✨ Envíos a todo Costa Rica por Correos de CR y Mensajería Express GAM',
    '🎁 Envío GRATIS en pedidos superiores a ₡35,000 colones',
    '💜 Paga fácil y seguro con tu SINPE Móvil o Transferencia Bancaria',
    '🌸 Empacamos cada detalle con amor para ti o para tu persona especial'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoMessageIndex((prev) => (prev + 1) % promoMessages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promoMessages.length]);

  return (
    <div
      className={`bg-night-950/95 border-b border-gold-DEFAULT/15 text-xs px-4 select-none transition-all duration-300 overflow-hidden ${
        isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-8 opacity-100 py-1'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center md:text-left overflow-hidden">
          <span className="inline-flex items-center gap-1.5 text-gold-light/90 text-xs sm:text-[13px] font-medium tracking-wide">
            <Sparkles className="w-3 h-3 text-gold-bright animate-pulse" />
            <span>{promoMessages[promoMessageIndex]}</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-text-secondary text-xs sm:text-[13px]">
          <button
            onClick={onOpenTracking}
            className="hover:text-gold-light flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-gold-bright" />
            <span>Rastreo de Pedido</span>
          </button>
          <a
            href={`https://wa.me/${(storeSettings?.whatsapp || '50664656625').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-light flex items-center gap-1 text-status-success transition-colors font-medium"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp: {storeSettings?.phone || '6465-6625'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderPromoBar;
