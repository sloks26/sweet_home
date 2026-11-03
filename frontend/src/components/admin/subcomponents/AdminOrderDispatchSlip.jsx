import React from 'react';

export const AdminOrderDispatchSlip = ({ order }) => {
  if (!order) return null;

  return (
    <div id="dispatch-slip" className="hidden print:block p-8 bg-white text-black text-sm font-sans leading-tight">
      {/* Encabezado */}
      <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider">Sweet Home & Boutique CR</h1>
          <p className="text-xs text-gray-700 mt-0.5">San José, Costa Rica • WhatsApp: +506 6128-0902</p>
          <p className="text-xs text-gray-700">Comprobante Oficial de Despacho & Entrega</p>
        </div>
        <div className="text-right">
          <div className="text-base font-bold">PEDIDO #{order.orderNumber}</div>
          <div className="text-xs text-gray-600">Fecha: {new Date(order.createdAt).toLocaleDateString('es-CR')}</div>
          <div className="text-xs font-semibold mt-1 uppercase text-black">
            Estado: {order.status === 'PAYMENT_CONFIRMED' || order.status === 'PREPARING' || order.status === 'SHIPPED' ? 'PAGADO' : order.status}
          </div>
        </div>
      </div>

      {/* Datos del Destinatario */}
      <div className="grid grid-cols-2 gap-4 mb-5 p-3 border border-black rounded-lg">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide mb-1 text-gray-800">Destinatario / Entrega:</h2>
          <div className="text-base font-bold">{order.customerName}</div>
          <div className="text-sm font-semibold">Teléfono: {order.customerPhone}</div>
          {order.customerEmail && <div className="text-xs text-gray-600">{order.customerEmail}</div>}
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide mb-1 text-gray-800">Método de Envío:</h2>
          <div className="text-sm font-bold">{order.shippingMethod}</div>
          {order.trackingNumber && (
            <div className="text-sm font-mono mt-0.5 font-bold">Guía: {order.trackingNumber}</div>
          )}
        </div>
      </div>

      {/* Dirección Exacta */}
      <div className="mb-5 p-3 border border-black rounded-lg">
        <h2 className="text-xs font-bold uppercase tracking-wide mb-1 text-gray-800">Dirección Exacta de Entrega:</h2>
        <div className="text-sm font-medium whitespace-pre-wrap">{order.shippingAddress}</div>
        {order.notes && (
          <div className="mt-2 text-xs italic text-gray-700 border-t border-gray-300 pt-1">
            <strong>Indicaciones adicionales:</strong> {order.notes}
          </div>
        )}
      </div>

      {/* Detalle de Prendas / Artículos */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wide mb-2 text-gray-800">Artículos a Entregar:</h2>
        <table className="w-full text-left border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-400 text-xs font-bold uppercase">
              <th className="p-2 border-r border-gray-400 w-16 text-center">Cant.</th>
              <th className="p-2 border-r border-gray-400">Descripción del Producto</th>
              <th className="p-2 w-28 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr key={item.id || idx} className="border-b border-gray-300 text-xs">
                <td className="p-2 border-r border-gray-400 text-center font-bold">{item.quantity}</td>
                <td className="p-2 border-r border-gray-400">
                  <div className="font-semibold">{item.productName}</div>
                  {item.variantName && <div className="text-[11px] text-gray-600">{item.variantName}</div>}
                </td>
                <td className="p-2 text-right font-medium">₡{(item.subtotal || 0).toLocaleString('es-CR')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black font-bold text-xs">
              <td colSpan="2" className="p-2 text-right">Costo de Envío:</td>
              <td className="p-2 text-right">₡{(order.shippingCost || 0).toLocaleString('es-CR')}</td>
            </tr>
            <tr className="border-t-2 border-black font-extrabold text-sm bg-gray-50">
              <td colSpan="2" className="p-2 text-right">TOTAL PAGADO:</td>
              <td className="p-2 text-right">₡{(order.total || 0).toLocaleString('es-CR')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Firma de recibido */}
      <div className="mt-8 pt-4 border-t border-dashed border-gray-400 grid grid-cols-2 gap-8 text-xs text-center">
        <div>
          <div className="border-b border-black h-12 mb-1"></div>
          <p className="font-bold">Firma de Entrega (Mensajería / Tienda)</p>
        </div>
        <div>
          <div className="border-b border-black h-12 mb-1"></div>
          <p className="font-bold">Firma y Cédula de Quien Recibe</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDispatchSlip;
