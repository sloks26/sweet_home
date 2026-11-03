import React from 'react';

export const CheckoutStepsIndicator = ({ step }) => {
  return (
    <div className="px-6 py-3 bg-night-900/90 border-b border-night-700/40 flex items-center justify-between text-xs">
      <div className={`flex items-center gap-1.5 font-medium ${step >= 1 ? 'text-gold-bright' : 'text-text-muted'}`}>
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step >= 1 ? 'bg-gold-metallic text-night-950 font-bold' : 'bg-night-700 text-text-muted'
          }`}
        >
          1
        </span>
        <span>Envío y Datos</span>
      </div>

      <div className="w-8 h-px bg-night-700" />

      <div className={`flex items-center gap-1.5 font-medium ${step >= 2 ? 'text-gold-bright' : 'text-text-muted'}`}>
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step >= 2 ? 'bg-gold-metallic text-night-950 font-bold' : 'bg-night-700 text-text-muted'
          }`}
        >
          2
        </span>
        <span>Pago SINPE / Transferencia</span>
      </div>

      <div className="w-8 h-px bg-night-700" />

      <div className={`flex items-center gap-1.5 font-medium ${step >= 3 ? 'text-gold-bright' : 'text-text-muted'}`}>
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step >= 3 ? 'bg-gold-metallic text-night-950 font-bold' : 'bg-night-700 text-text-muted'
          }`}
        >
          3
        </span>
        <span>Comprobante</span>
      </div>
    </div>
  );
};

export default CheckoutStepsIndicator;
