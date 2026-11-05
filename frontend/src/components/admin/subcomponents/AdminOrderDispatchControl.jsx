import React from 'react';
import { Truck } from 'lucide-react';
import Button from '../../ui/Button';

export const AdminOrderDispatchControl = ({
  selectedOrder,
  trackingNumberInput,
  setTrackingNumberInput,
  internalNotesInput,
  setInternalNotesInput,
  onUpdateStatus,
  isUpdatingStatus
}) => {
  return (
    <div className="space-y-4">
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
              onClick={() => onUpdateStatus('PREPARING', { trackingNumber: trackingNumberInput })}
              disabled={isUpdatingStatus}
            >
              En Preparación
            </Button>
            <Button
              variant="primary"
              size="xs"
              onClick={() => onUpdateStatus('SHIPPED', { trackingNumber: trackingNumberInput })}
              disabled={isUpdatingStatus}
            >
              Marcar como Enviado
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onUpdateStatus('DELIVERED', { trackingNumber: trackingNumberInput })}
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
  );
};

export default AdminOrderDispatchControl;
