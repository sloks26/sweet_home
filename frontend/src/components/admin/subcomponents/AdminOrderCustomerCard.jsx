import React from 'react';
import { User, MapPin, Package, Trash2 } from 'lucide-react';
import { formatColones } from '../../../utils/currency';

export const AdminOrderCustomerCard = ({ selectedOrder, onDeleteOrder }) => {
  return (
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
            className="text-[11px] text-status-error hover:underline flex items-center gap-1 font-medium cursor-pointer"
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
                  <div className="font-semibold text-text-primary truncate">{item.productName}</div>
                  <div className="text-[10px] text-text-muted">
                    Cant: {item.quantity} {item.variantName ? `• ${item.variantName}` : ''}
                  </div>
                </div>
              </div>
              <div className="font-bold text-text-primary shrink-0">
                {formatColones(item.subtotal)}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de totales */}
        <div className="pt-2 border-t border-night-800 space-y-1 text-right">
          <div className="text-text-muted">
            Subtotal: {formatColones(selectedOrder.subtotal)}
          </div>
          <div className="text-text-muted">
            Envío: {formatColones(selectedOrder.shippingCost)}
          </div>
          <div className="text-sm font-bold text-gold-light">
            Total: {formatColones(selectedOrder.total)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderCustomerCard;
