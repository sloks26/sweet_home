import React from 'react';
import { Smartphone, Building, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../../../utils/clipboard';

export const PaymentPreviewBox = ({
  sinpePhone,
  sinpeHolder,
  bankName,
  bankIban,
  bankHolder,
  popularBankName,
  popularBankIban
}) => {
  const [copiedKey, setCopiedKey] = React.useState(null);

  const handleCopy = (text, key) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#160B24] border border-gold-DEFAULT/30 space-y-4">
      <div className="border-b border-night-700 pb-2.5">
        <h4 className="font-serif text-sm sm:text-base font-bold text-gold-light flex items-center gap-2">
          <span>Vista Previa: Así ven los clientes los datos de pago</span>
        </h4>
        <p className="text-[11px] text-text-secondary mt-0.5">
          Esta es la tarjeta interactiva que tus clientas verán al finalizar su pedido en la tienda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Tarjeta SINPE Móvil */}
        <div className="p-3.5 rounded-xl bg-night-950 border border-gold-DEFAULT/25 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-bright flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>SINPE Móvil</span>
            </span>
            <button
              type="button"
              onClick={() => handleCopy(sinpePhone?.replace(/\D/g, ''), 'sinpe')}
              className="text-[10px] px-2 py-0.5 rounded-md bg-gold-DEFAULT/15 text-gold-light border border-gold-DEFAULT/30 flex items-center gap-1 hover:bg-gold-DEFAULT/25"
            >
              {copiedKey === 'sinpe' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'sinpe' ? 'Copiado' : 'Copiar número'}</span>
            </button>
          </div>
          <div className="text-base font-extrabold text-white tracking-wider font-mono">
            {sinpePhone || '6465-6625'}
          </div>
          <div className="text-[11px] text-text-secondary">
            Titular: <strong className="text-white">{sinpeHolder || 'Maureen Vanessa Sanchez M.'}</strong>
          </div>
        </div>

        {/* Tarjeta Transferencia Bancaria */}
        <div className="p-3.5 rounded-xl bg-night-950 border border-gold-DEFAULT/25 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-bright flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>{bankName || 'BAC Credomatic'}</span>
            </span>
            <button
              type="button"
              onClick={() => handleCopy(bankIban?.replace(/\s/g, ''), 'iban1')}
              className="text-[10px] px-2 py-0.5 rounded-md bg-gold-DEFAULT/15 text-gold-light border border-gold-DEFAULT/30 flex items-center gap-1 hover:bg-gold-DEFAULT/25"
            >
              {copiedKey === 'iban1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'iban1' ? 'Copiado' : 'Copiar IBAN'}</span>
            </button>
          </div>
          <div className="text-xs font-bold text-white font-mono break-all">
            {bankIban || 'CR84010200009659820931'}
          </div>
          <div className="text-[11px] text-text-secondary">
            Titular: <strong className="text-white">{bankHolder || 'Maureen Vanessa Sanchez M.'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPreviewBox;
