import React, { useState, useEffect } from 'react';
import {
  Package,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  User,
  MapPin,
  Clock,
  Truck,
  Check,
  Trash2,
  Printer,
  XCircle,
  AlertTriangle,
  Receipt,
  Phone
} from 'lucide-react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Modal from '../../ui/Modal';
import WhatsAppIcon from '../../ui/WhatsAppIcon';
import AdminOrderDispatchSlip from './AdminOrderDispatchSlip';

const QUICK_REJECTION_REASONS = [
  'El monto transferido no coincide con el total',
  'Comprobante borroso o ilegible',
  'Comprobante duplicado / ya utilizado',
  'No se visualiza acreditación en cuenta bancaria',
  'Faltan datos de referencia del depósito'
];

export const AdminOrderDetailModal = ({
  isOpen,
  onClose,
  selectedOrder,
  onUpdateStatus,
  onApproveVoucher,
  onRejectVoucher,
  onOpenWhatsApp,
  onDeleteOrder,
  isUpdatingStatus,
  getStatusBadge
}) => {
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [internalNotesInput, setInternalNotesInput] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (selectedOrder) {
      setTrackingNumberInput(selectedOrder.trackingNumber || '');
      setInternalNotesInput(selectedOrder.internalNotes || '');
      setZoomLevel(1);
      setRotation(0);
      setShowRejectBox(false);
      setRejectionReason('');
    }
  }, [selectedOrder, isOpen]);

  if (!selectedOrder) return null;

  const handleConfirmRejection = () => {
    const finalReason =
      rejectionReason.trim() || 'Comprobante no cumple con los requisitos de verificación';
    onRejectVoucher(finalReason);
    setShowRejectBox(false);
  };

  const toggleImageZoom = () => {
    setZoomLevel((prev) => (prev >= 2.5 ? 1 : prev + 0.75));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pedido ${selectedOrder.orderNumber}`}
      size="xl"
    >
      <div className="space-y-6 text-xs text-text-primary">
        {/* Cabecera con Estado y Acciones Rápidas */}
        <div className="p-4 rounded-xl bg-night-950 border border-gold-DEFAULT/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {getStatusBadge(selectedOrder.status)}
            <span className="text-text-muted">
              Creado: {new Date(selectedOrder.createdAt).toLocaleString('es-CR')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={() => window.print()}
              title="Imprimir hoja de despacho para Correos de CR / Mensajero"
            >
              Imprimir Despacho
            </Button>

            {selectedOrder.customerPhone && (
              <Button
                variant="secondary"
                size="sm"
                icon={WhatsAppIcon}
                onClick={() => onOpenWhatsApp(selectedOrder)}
                className="bg-[#25D366]/15 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/25"
              >
                WhatsApp
              </Button>
            )}

            <button
              type="button"
              onClick={() =>
                onDeleteOrder && onDeleteOrder(selectedOrder.id, selectedOrder.orderNumber)
              }
              className="px-3 py-1.5 rounded-xl border border-status-error/40 text-status-error hover:bg-status-error/20 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Eliminar pedido permanentemente"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        </div>

        {/* Cuadrícula 2 columnas: Datos del Cliente y Comprobante */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda: Cliente & Envío & Productos */}
          <div className="space-y-4">
            {/* Datos del Cliente */}
            <div className="p-4 rounded-xl bg-night-900 border border-night-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gold-light text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Datos del Cliente</span>
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    onDeleteOrder && onDeleteOrder(selectedOrder.id, selectedOrder.orderNumber)
                  }
                  className="text-[11px] text-status-error hover:underline flex items-center gap-1 font-medium"
                  title="Eliminar pedido"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Eliminar</span>
                </button>
              </div>
              <div className="space-y-1 text-text-secondary">
                <div>
                  <strong>Nombre:</strong> {selectedOrder.customerName}
                </div>
                <div>
                  <strong>Email:</strong> {selectedOrder.customerEmail}
                </div>
                <div>
                  <strong>Teléfono:</strong> {selectedOrder.customerPhone}
                </div>
              </div>
            </div>

            {/* Envío */}
            <div className="p-4 rounded-xl bg-night-900 border border-night-800 space-y-2">
              <h4 className="font-bold text-gold-light text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Método y Dirección de Envío</span>
              </h4>
              <div className="space-y-1 text-text-secondary">
                <div>
                  <strong>Método:</strong> {selectedOrder.shippingMethod}
                </div>
                <div className="bg-night-950 p-2.5 rounded-lg border border-night-800 mt-1 whitespace-pre-wrap text-[11px] font-mono">
                  {selectedOrder.shippingAddress}
                </div>
                {selectedOrder.notes && (
                  <div className="mt-2 text-text-muted italic">
                    <strong>Notas del cliente:</strong> "{selectedOrder.notes}"
                  </div>
                )}
              </div>
            </div>

            {/* Artículos del Pedido */}
            <div className="p-4 rounded-xl bg-night-900 border border-night-800 space-y-3">
              <h4 className="font-bold text-gold-light text-sm flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                <span>Productos Ordenados ({selectedOrder.items?.length || 0})</span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg bg-night-950 border border-night-800"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-md border border-night-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-night-800 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-text-muted" />
                        </div>
                      )}
                      <div className="truncate">
                        <div className="font-semibold text-text-primary truncate">
                          {item.productName}
                        </div>
                        <div className="text-[10px] text-text-muted">
                          Cant: {item.quantity} {item.variantName ? `• ${item.variantName}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-text-primary shrink-0">
                      ₡{item.subtotal.toLocaleString('es-CR')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de totales */}
              <div className="pt-2 border-t border-night-800 space-y-1 text-right">
                <div className="text-text-muted">
                  Subtotal: ₡{selectedOrder.subtotal.toLocaleString('es-CR')}
                </div>
                <div className="text-text-muted">
                  Envío: ₡{selectedOrder.shippingCost.toLocaleString('es-CR')}
                </div>
                <div className="text-sm font-bold text-gold-light">
                  Total: ₡{selectedOrder.total.toLocaleString('es-CR')}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Visor de Comprobante & Acciones */}
          <div className="space-y-4">
            {/* Visor de Comprobante SINPE / Transferencia */}
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
                        ₡{(selectedOrder.total || 0).toLocaleString('es-CR')}
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
                      title="Doble clic o pellizco para zoom"
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
                    /* Botones de Aprobación / Rechazo Rápido (Desktop) */
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
                    El cliente puede subirlo desde la pantalla de confirmación o enviártelo por
                    WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {/* Despacho y Número de Guía */}
            <div className="p-4 rounded-xl bg-night-900 border border-night-800 space-y-3">
              <h4 className="font-bold text-gold-light text-sm flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                <span>Control de Envío & Guía</span>
              </h4>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    Número de Guía (Correos de CR / Mensajero)
                  </label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="Ej: CR123456789CR"
                    className="w-full bg-night-950 text-text-primary text-xs rounded-xl px-3 py-2 border border-night-700 focus:outline-none focus:border-gold-DEFAULT"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() =>
                      onUpdateStatus('PREPARING', { trackingNumber: trackingNumberInput })
                    }
                    disabled={isUpdatingStatus}
                  >
                    En Preparación
                  </Button>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() =>
                      onUpdateStatus('SHIPPED', { trackingNumber: trackingNumberInput })
                    }
                    disabled={isUpdatingStatus}
                  >
                    Marcar como Enviado
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      onUpdateStatus('DELIVERED', { trackingNumber: trackingNumberInput })
                    }
                    disabled={isUpdatingStatus}
                  >
                    Marcar como Entregado
                  </Button>
                </div>
              </div>
            </div>

            {/* Notas Internas Privadas */}
            <div className="p-4 rounded-xl bg-night-900 border border-night-800 space-y-2">
              <label className="block text-[11px] font-bold text-gold-light">
                Notas Internas del Equipo (Privadas)
              </label>
              <textarea
                rows={2}
                value={internalNotesInput}
                onChange={(e) => setInternalNotesInput(e.target.value)}
                placeholder="Anotaciones privadas del pedido..."
                className="w-full bg-night-950 text-text-primary text-xs rounded-xl p-2.5 border border-night-700 focus:outline-none focus:border-gold-DEFAULT resize-none"
              />
              <div className="text-right">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    onUpdateStatus(selectedOrder.status, {
                      trackingNumber: trackingNumberInput,
                      internalNotes: internalNotesInput
                    })
                  }
                  disabled={isUpdatingStatus}
                >
                  Guardar Notas
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Acciones Fija en Celular para Comprobantes */}
        {selectedOrder.voucherUrl && selectedOrder.status === 'VOUCHER_RECEIVED' && (
          <div className="lg:hidden sticky bottom-0 -mx-4 -mb-4 mt-4 p-3 bg-night-950/95 backdrop-blur-md border-t border-gold-DEFAULT/30 flex items-center gap-2 z-20">
            <Button
              variant="primary"
              size="sm"
              className="flex-1 py-3"
              icon={Check}
              onClick={onApproveVoucher}
              disabled={isUpdatingStatus}
            >
              Confirmar Pago
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 py-3 border-status-error/50 text-status-error hover:bg-status-error/10"
              onClick={() => setShowRejectBox(true)}
              disabled={isUpdatingStatus}
            >
              Rechazar
            </Button>
          </div>
        )}

        {/* Hoja de Despacho Oculta lista para Imprimir */}
        <AdminOrderDispatchSlip order={selectedOrder} />
      </div>
    </Modal>
  );
};

export default AdminOrderDetailModal;
