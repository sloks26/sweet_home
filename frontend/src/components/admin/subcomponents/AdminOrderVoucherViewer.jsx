import React from 'react';
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Clock,
  AlertTriangle,
  Check
} from 'lucide-react';
import Button from '../../ui/Button';
import { formatColones } from '../../../utils/currency';

const QUICK_REJECTION_REASONS = [
  'El monto transferido no coincide con el total',
  'Comprobante borroso o ilegible',
  'Comprobante duplicado / ya utilizado',
  'No se visualiza acreditación en cuenta bancaria',
  'Faltan datos de referencia del depósito'
];

export const AdminOrderVoucherViewer = ({
  selectedOrder,
  zoomLevel,
  setZoomLevel,
  rotation,
  setRotation,
  showRejectBox,
  setShowRejectBox,
  rejectionReason,
  setRejectionReason,
  onApproveVoucher,
  handleConfirmRejection,
  isUpdatingStatus
}) => {
  const toggleImageZoom = () => {
    setZoomLevel((prev) => (prev >= 2.5 ? 1 : prev + 0.75));
  };

  return (
    <div className="p-4 rounded-xl bg-night-900 border border-gold-DEFAULT/30 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gold-light text-sm flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          <span>Comprobante de Pago</span>
        </h4>
        {selectedOrder.voucherUrl && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
              className="p-1 rounded bg-night-800 text-text-secondary hover:text-text-primary"
              title="Acercar zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
              className="p-1 rounded bg-night-800 text-text-secondary hover:text-text-primary"
              title="Alejar zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-1 rounded bg-night-800 text-text-secondary hover:text-text-primary"
              title="Rotar imagen"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {selectedOrder.voucherUrl ? (
        <div className="space-y-3">
          {/* Comparador Rápido: Monto Esperado vs Referencia */}
          <div className="p-3 rounded-xl bg-night-950 border border-gold-DEFAULT/30 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider block">
                Monto Esperado
              </span>
              <span className="text-base font-extrabold text-gold-bright">
                {formatColones(selectedOrder.total)}
              </span>
            </div>
            <div>
              <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider block">
                Referencia Cliente
              </span>
              <span
                className="font-mono text-xs font-semibold text-text-primary truncate block"
                title={selectedOrder.voucherNotes || ''}
              >
                {selectedOrder.voucherNotes || 'Sin referencia'}
              </span>
            </div>
          </div>

          <div className="relative w-full h-72 bg-night-950 rounded-xl overflow-hidden border border-night-800 flex items-center justify-center p-2 select-none">
            <img
              src={selectedOrder.voucherUrl}
              alt="Comprobante de Pago"
              onDoubleClick={toggleImageZoom}
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
              className="max-h-full max-w-full object-contain cursor-zoom-in active:cursor-grabbing"
              title="Doble clic para zoom"
            />
          </div>

          {/* Formulario Elegante de Rechazo */}
          {showRejectBox ? (
            <div className="p-3.5 rounded-xl bg-status-error/10 border border-status-error/30 space-y-2.5">
              <div className="flex items-center gap-1.5 text-status-error font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Motivo del Rechazo del Comprobante</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REJECTION_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRejectionReason(r)}
                    className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${
                      rejectionReason === r
                        ? 'bg-status-error/20 border-status-error text-status-error font-semibold'
                        : 'bg-night-950 border-night-700 text-text-secondary hover:border-night-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Escribe o ajusta el motivo de rechazo..."
                className="w-full bg-night-950 text-text-primary text-xs rounded-xl px-3 py-2 border border-night-700 focus:outline-none focus:border-status-error"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button variant="ghost" size="xs" onClick={() => setShowRejectBox(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="border-status-error text-status-error hover:bg-status-error/15"
                  onClick={handleConfirmRejection}
                  disabled={isUpdatingStatus}
                >
                  Confirmar Rechazo
                </Button>
              </div>
            </div>
          ) : (
            /* Botones de Aprobación / Rechazo Rápido */
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                onClick={onApproveVoucher}
                disabled={isUpdatingStatus || selectedOrder.status === 'PAYMENT_CONFIRMED'}
              >
                Aprobar Pago
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectBox(true)}
                disabled={isUpdatingStatus}
                className="border-status-error/40 text-status-error hover:bg-status-error/10"
              >
                Rechazar Comprobante
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-night-950 rounded-xl border border-dashed border-night-700 text-text-muted space-y-2">
          <Clock className="w-8 h-8 mx-auto text-amber-400/80" />
          <p className="font-semibold text-text-secondary">
            Aún no se ha adjuntado comprobante
          </p>
          <p className="text-[11px]">
            El cliente puede subirlo desde la pantalla de confirmación o enviártelo por WhatsApp.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOrderVoucherViewer;
