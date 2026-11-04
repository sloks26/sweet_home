import React from 'react';
import { Phone, Landmark, CheckCircle2, Check, Copy, ShieldCheck } from 'lucide-react';
import Button from '../../ui/Button';

export const CheckoutStep2Payment = ({
  paymentMethod,
  setPaymentMethod,
  sinpePhone,
  sinpeClean,
  sinpeHolder,
  bacName,
  bacIban,
  popularName,
  popularIban,
  bankHolder,
  orderTotal,
  copiedField,
  onCopy,
  onBack,
  onConfirm,
  isSubmitting
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-lg font-bold text-text-primary">
          Selecciona tu Método de Pago
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Realiza tu pago por SINPE Móvil o Transferencia Bancaria y confirma tu orden.
        </p>
      </div>

      {/* Selector de Método */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPaymentMethod('SINPE_MOVIL')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            paymentMethod === 'SINPE_MOVIL'
              ? 'bg-night-700 border-gold-DEFAULT shadow-md'
              : 'bg-night-900/70 border-night-700 hover:border-night-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gold-light flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-gold-bright" />
              <span>SINPE Móvil</span>
            </span>
            {paymentMethod === 'SINPE_MOVIL' && (
              <CheckCircle2 className="w-4 h-4 text-gold-bright" />
            )}
          </div>
          <p className="text-[11px] text-text-secondary">
            Pago instantáneo al número oficial de la boutique
          </p>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('TRANSFER')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            paymentMethod === 'TRANSFER'
              ? 'bg-night-700 border-gold-DEFAULT shadow-md'
              : 'bg-night-900/70 border-night-700 hover:border-night-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gold-light flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-gold-bright" />
              <span>Transferencia Bancaria</span>
            </span>
            {paymentMethod === 'TRANSFER' && <CheckCircle2 className="w-4 h-4 text-gold-bright" />}
          </div>
          <p className="text-[11px] text-text-secondary">
            BAC Credomatic o Banco Popular (Colones)
          </p>
        </button>
      </div>

      {/* Ficha de Información de Pago */}
      {paymentMethod === 'SINPE_MOVIL' ? (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-night-950 to-night-900 border border-gold-DEFAULT/30 space-y-4">
          <div className="flex items-center justify-between border-b border-night-700/60 pb-3">
            <span className="text-xs font-semibold text-gold-light uppercase tracking-wider">
              Datos para SINPE Móvil
            </span>
            <span className="text-[11px] text-status-success font-medium">Activo 24/7</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-night-900/80 p-3 rounded-xl border border-night-700">
              <div>
                <span className="text-[10px] text-text-muted block">Número SINPE Móvil</span>
                <strong className="text-base font-mono text-gold-bright">{sinpePhone}</strong>
              </div>
              <button
                type="button"
                onClick={() => onCopy(sinpeClean, 'sinpe')}
                className="px-3 py-1.5 rounded-lg bg-gold-DEFAULT/20 hover:bg-gold-DEFAULT/30 text-gold-light text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedField === 'sinpe' ? (
                  <Check className="w-3.5 h-3.5 text-status-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedField === 'sinpe' ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <div className="text-xs text-text-secondary space-y-1">
              <div>
                Titular: <strong className="text-text-primary">{sinpeHolder}</strong>
              </div>
              <div>
                Monto Exacto:{' '}
                <strong className="text-gold-light font-bold">
                  ₡{orderTotal.toLocaleString('es-CR')}
                </strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-night-950 to-night-900 border border-gold-DEFAULT/30 space-y-4">
          <div className="flex items-center justify-between border-b border-night-700/60 pb-3">
            <span className="text-xs font-semibold text-gold-light uppercase tracking-wider">
              Cuentas para Transferencia Bancaria
            </span>
            <span className="text-[11px] text-gold-bright font-medium">Colones ₡</span>
          </div>

          <div className="space-y-3">
            {/* Cuenta BAC Credomatic */}
            <div className="bg-night-900/80 p-3 rounded-xl border border-night-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  <span>{bacName || 'BAC Credomatic (San José)'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(bacIban, 'bac')}
                  className="px-2.5 py-1 rounded-lg bg-gold-DEFAULT/20 hover:bg-gold-DEFAULT/30 text-gold-light text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedField === 'bac' ? (
                    <Check className="w-3 h-3 text-status-success" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedField === 'bac' ? '¡Copiado!' : 'Copiar IBAN'}</span>
                </button>
              </div>
              <strong className="text-xs font-mono text-gold-bright tracking-wider block">
                {bacIban}
              </strong>
            </div>

            {/* Cuenta Banco Popular */}
            <div className="bg-night-900/80 p-3 rounded-xl border border-night-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>{popularName || 'Banco Popular'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(popularIban, 'popular')}
                  className="px-2.5 py-1 rounded-lg bg-gold-DEFAULT/20 hover:bg-gold-DEFAULT/30 text-gold-light text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedField === 'popular' ? (
                    <Check className="w-3 h-3 text-status-success" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedField === 'popular' ? '¡Copiado!' : 'Copiar IBAN'}</span>
                </button>
              </div>
              <strong className="text-xs font-mono text-gold-bright tracking-wider block">
                {popularIban}
              </strong>
            </div>

            <div className="text-xs text-text-secondary space-y-1 pt-1">
              <div>
                Titular de las cuentas: <strong className="text-text-primary">{bankHolder}</strong>
              </div>
              <div>
                Monto Exacto:{' '}
                <strong className="text-gold-light font-bold">
                  ₡{orderTotal.toLocaleString('es-CR')}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones de Navegación del Paso 2 */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" size="md" onClick={onBack} disabled={isSubmitting}>
          Regresar a Datos
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onConfirm}
          isLoading={isSubmitting}
          icon={ShieldCheck}
        >
          Confirmar y Generar Pedido
        </Button>
      </div>
    </div>
  );
};

export default CheckoutStep2Payment;
