import React from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Upload,
  Copy,
  Check,
  Phone,
  Landmark,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

export const CheckoutStep3Confirmation = ({
  createdOrder,
  whatsappMessage,
  storeWhatsapp,
  voucherSuccess,
  selectedFile,
  filePreview,
  voucherNotes,
  setVoucherNotes,
  isUploadingVoucher,
  onFileChange,
  onUploadVoucher,
  onClose,
  sinpePhone,
  sinpeClean,
  sinpeHolder,
  bacName,
  bacIban,
  popularName,
  popularIban,
  bankHolder,
  copiedField,
  onCopy
}) => {
  if (!createdOrder) return null;

  const isSinpe = createdOrder.paymentMethod === 'SINPE_MOVIL';
  const totalFormatted = (createdOrder.total || 0).toLocaleString('es-CR');
  const waNumber = storeWhatsapp || '50664656625';

  return (
    <div className="space-y-6 text-center">
      {/* Icono de Éxito */}
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40 animate-pulse">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      {/* Titular */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 text-[11px] font-bold text-gold-bright tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          ¡Pedido Recibido con Éxito!
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mt-2">
          Gracias por tu compra
        </h3>
        <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
          Estimada(o) <strong className="text-text-primary">{createdOrder.customerName}</strong>, tu orden ha sido registrada. Sigue las instrucciones de abajo para validar tu pago y despachar tu paquete.
        </p>
      </div>

      {/* Tarjeta de Referencia del Pedido con Botón Copiar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-night-950/90 border-2 border-gold-DEFAULT/40 shadow-xl space-y-2">
        <span className="text-[11px] font-bold tracking-wider text-text-muted uppercase block">
          Número de Referencia de tu Pedido
        </span>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl sm:text-3xl font-mono font-black text-gold-bright tracking-wider">
            {createdOrder.orderNumber}
          </span>
          <button
            type="button"
            onClick={() => onCopy(createdOrder.orderNumber, 'ref')}
            className="px-3 py-1.5 rounded-xl bg-gold-DEFAULT/20 hover:bg-gold-DEFAULT/30 border border-gold-DEFAULT/40 text-gold-light text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            title="Copiar número de referencia"
          >
            {copiedField === 'ref' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gold-light" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-gold-light/80 italic">
          💡 Recuerda colocar este número exacto en el detalle o motivo de tu transferencia.
        </p>
      </div>

      {/* Estado del Pedido Visible */}
      <div className="flex items-center justify-center">
        {voucherSuccess || createdOrder.status === 'VOUCHER_RECEIVED' ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Estado: Comprobante Recibido • Verificación en Proceso</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Estado: Pendiente de Comprobante de Pago</span>
          </div>
        )}
      </div>

      {/* Instrucciones de Pago con Botones Copiar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-night-950 to-night-900 border border-gold-DEFAULT/30 text-left space-y-4">
        <div className="flex items-center justify-between border-b border-night-700/60 pb-3">
          <span className="text-xs font-bold text-gold-light uppercase tracking-wider flex items-center gap-2">
            {isSinpe ? <Phone className="w-4 h-4 text-gold-bright" /> : <Landmark className="w-4 h-4 text-gold-bright" />}
            <span>{isSinpe ? 'Datos para pagar por SINPE Móvil' : 'Cuentas para Transferencia Bancaria'}</span>
          </span>
          <span className="text-[11px] text-gold-bright font-medium">Colones ₡</span>
        </div>

        {isSinpe ? (
          <div className="space-y-3">
            {/* Teléfono SINPE */}
            <div className="flex items-center justify-between bg-night-900 p-3 rounded-xl border border-night-700">
              <div>
                <span className="text-[10px] text-text-muted uppercase block">Teléfono SINPE Móvil</span>
                <strong className="text-base sm:text-lg font-mono text-gold-bright">{sinpePhone || '6465-6625'}</strong>
              </div>
              <button
                type="button"
                onClick={() => onCopy(sinpeClean || '64656625', 'sinpe')}
                className="px-3 py-1.5 rounded-lg bg-gold-DEFAULT/20 hover:bg-gold-DEFAULT/30 border border-gold-DEFAULT/30 text-gold-light text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedField === 'sinpe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'sinpe' ? '¡Copiado!' : 'Copiar número'}</span>
              </button>
            </div>

            {/* Monto a transferir */}
            <div className="flex items-center justify-between bg-night-900 p-3 rounded-xl border border-night-700">
              <div>
                <span className="text-[10px] text-text-muted uppercase block">Monto Exacto a Transferir</span>
                <strong className="text-base sm:text-lg font-mono text-emerald-400">₡{totalFormatted}</strong>
              </div>
              <button
                type="button"
                onClick={() => onCopy(createdOrder.total?.toString() || '', 'amount')}
                className="px-3 py-1.5 rounded-lg bg-gold-DEFAULT/20 hover:bg-gold-DEFAULT/30 border border-gold-DEFAULT/30 text-gold-light text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'amount' ? '¡Copiado!' : 'Copiar monto'}</span>
              </button>
            </div>

            <div className="text-xs text-text-secondary pt-1">
              Titular: <strong className="text-text-primary">{sinpeHolder || 'Maureen Vanessa Sanchez Martinez'}</strong>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Cuenta BAC */}
            <div className="bg-night-900 p-3 rounded-xl border border-night-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  <span>{bacName || 'BAC Credomatic'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(bacIban, 'bac')}
                  className="px-2.5 py-1 rounded-lg bg-gold-DEFAULT/20 hover:bg-gold-DEFAULT/30 border border-gold-DEFAULT/30 text-gold-light text-[11px] font-semibold flex items-center gap-1"
                >
                  {copiedField === 'bac' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'bac' ? '¡Copiado!' : 'Copiar IBAN'}</span>
                </button>
              </div>
              <span className="text-xs font-mono text-gold-bright block">{bacIban}</span>
            </div>

            {/* Cuenta Banco Popular */}
            <div className="bg-night-900 p-3 rounded-xl border border-night-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>{popularName || 'Banco Popular'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(popularIban, 'popular')}
                  className="px-2.5 py-1 rounded-lg bg-gold-DEFAULT/20 hover:bg-gold-DEFAULT/30 border border-gold-DEFAULT/30 text-gold-light text-[11px] font-semibold flex items-center gap-1"
                >
                  {copiedField === 'popular' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'popular' ? '¡Copiado!' : 'Copiar IBAN'}</span>
                </button>
              </div>
              <span className="text-xs font-mono text-gold-bright block">{popularIban}</span>
            </div>

            {/* Monto a transferir */}
            <div className="flex items-center justify-between bg-night-900 p-3 rounded-xl border border-night-700">
              <div>
                <span className="text-[10px] text-text-muted uppercase block">Monto Exacto a Transferir</span>
                <strong className="text-base sm:text-lg font-mono text-emerald-400">₡{totalFormatted}</strong>
              </div>
              <button
                type="button"
                onClick={() => onCopy(createdOrder.total?.toString() || '', 'amount')}
                className="px-3 py-1.5 rounded-lg bg-gold-DEFAULT/20 hover:bg-gold-DEFAULT/30 border border-gold-DEFAULT/30 text-gold-light text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'amount' ? '¡Copiado!' : 'Copiar monto'}</span>
              </button>
            </div>

            <div className="text-xs text-text-secondary pt-1">
              Titular: <strong className="text-text-primary">{bankHolder || 'Maureen Vanessa Sanchez Martinez'}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Botón Principal: WhatsApp */}
      <div className="p-4 sm:p-5 rounded-2xl bg-night-900 border border-night-700 space-y-3">
        <span className="text-xs font-semibold text-text-primary block">
          Opción 1 (Recomendada): Enviar comprobante por WhatsApp
        </span>
        <a
          href={`https://wa.me/${waNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-night-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Enviar Comprobante por WhatsApp</span>
        </a>
        <p className="text-[11px] text-text-muted">
          Se abrirá WhatsApp con el mensaje prellenado incluyendo tu número de pedido <strong>{createdOrder.orderNumber}</strong>.
        </p>
      </div>

      {/* Opción 2: Subida Directa */}
      <div className="p-4 sm:p-5 rounded-2xl bg-night-900/60 border border-night-700/80 space-y-4 text-left">
        <span className="text-xs font-semibold text-text-primary block text-center">
          Opción 2: Subir foto o captura del comprobante aquí
        </span>

        {voucherSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block font-bold">¡Comprobante adjuntado con éxito!</strong>
              <span>Tu comprobante ya está registrado en el sistema. La dueña validará tu pago a la brevedad.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block">
              <span className="text-[11px] text-text-secondary block mb-1">
                Selecciona la foto desde tu galería o cámara:
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={onFileChange}
                className="block w-full text-xs text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold-DEFAULT/20 file:text-gold-light hover:file:bg-gold-DEFAULT/30 cursor-pointer"
              />
            </label>

            {filePreview && (
              <div className="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-gold-DEFAULT/40 mx-auto shadow-md">
                <img src={filePreview} alt="Vista previa del comprobante" className="w-full h-full object-cover" />
              </div>
            )}

            <Input
              label="Notas o número de transacción (opcional)"
              placeholder="Ej: Referencia SINPE #948271"
              value={voucherNotes}
              onChange={(e) => setVoucherNotes(e.target.value)}
            />

            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full"
              onClick={onUploadVoucher}
              disabled={!selectedFile}
              isLoading={isUploadingVoucher}
              icon={Upload}
            >
              Adjuntar Comprobante
            </Button>
          </div>
        )}
      </div>

      {/* Botón Finalizar */}
      <div className="pt-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onClose}
          className="w-full"
        >
          Volver a la Tienda
        </Button>
      </div>
    </div>
  );
};

export default CheckoutStep3Confirmation;