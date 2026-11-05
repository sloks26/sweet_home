import React, { useState } from 'react';
import { Printer, Trash2, Check } from 'lucide-react';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import WhatsAppIcon from '../../ui/WhatsAppIcon';
import AdminOrderDispatchSlip from './AdminOrderDispatchSlip';
import AdminOrderCustomerCard from './AdminOrderCustomerCard';
import AdminOrderVoucherViewer from './AdminOrderVoucherViewer';
import AdminOrderDispatchControl from './AdminOrderDispatchControl';
import { formatDateTimeCR } from '../../../utils/currency';

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
  const [prevOrderId, setPrevOrderId] = useState(selectedOrder?.id);
  const [trackingNumberInput, setTrackingNumberInput] = useState(
    selectedOrder?.trackingNumber || ''
  );
  const [internalNotesInput, setInternalNotesInput] = useState(
    selectedOrder?.internalNotes || ''
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (selectedOrder && selectedOrder.id !== prevOrderId) {
    setPrevOrderId(selectedOrder.id);
    setTrackingNumberInput(selectedOrder.trackingNumber || '');
    setInternalNotesInput(selectedOrder.internalNotes || '');
    setZoomLevel(1);
    setRotation(0);
    setShowRejectBox(false);
    setRejectionReason('');
  }

  if (!selectedOrder) return null;

  const handleConfirmRejection = () => {
    const finalReason =
      rejectionReason.trim() || 'Comprobante no cumple con los requisitos de verificación';
    onRejectVoucher(finalReason);
    setShowRejectBox(false);
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
              Creado: {formatDateTimeCR(selectedOrder.createdAt)}
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
          <AdminOrderCustomerCard
            selectedOrder={selectedOrder}
            onDeleteOrder={onDeleteOrder}
          />

          {/* Columna Derecha: Visor de Comprobante & Control de Envío */}
          <div className="space-y-4">
            <AdminOrderVoucherViewer
              selectedOrder={selectedOrder}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              rotation={rotation}
              setRotation={setRotation}
              showRejectBox={showRejectBox}
              setShowRejectBox={setShowRejectBox}
              rejectionReason={rejectionReason}
              setRejectionReason={setRejectionReason}
              onApproveVoucher={onApproveVoucher}
              handleConfirmRejection={handleConfirmRejection}
              isUpdatingStatus={isUpdatingStatus}
            />

            <AdminOrderDispatchControl
              selectedOrder={selectedOrder}
              trackingNumberInput={trackingNumberInput}
              setTrackingNumberInput={setTrackingNumberInput}
              internalNotesInput={internalNotesInput}
              setInternalNotesInput={setInternalNotesInput}
              onUpdateStatus={onUpdateStatus}
              isUpdatingStatus={isUpdatingStatus}
            />
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
