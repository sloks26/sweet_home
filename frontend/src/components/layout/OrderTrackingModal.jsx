import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  Upload,
  Calendar,
  Wallet
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { copyToClipboard } from '../../utils/clipboard';

const STATUS_MAP = {
  PENDING_PAYMENT: {
    label: 'Pendiente de Pago / Comprobante',
    color: 'text-gold-bright bg-gold-DEFAULT/15 border-gold-DEFAULT/40',
    desc: 'Hemos recibido tu orden. Por favor envía tu comprobante de SINPE Móvil o Transferencia para iniciar el empaque.'
  },
  VOUCHER_RECEIVED: {
    label: 'Comprobante en Revisión',
    color: 'text-status-info bg-status-info/15 border-status-info/40',
    desc: 'Tu comprobante fue recibido y está en cola de verificación manual por la administradora.'
  },
  PAYMENT_CONFIRMED: {
    label: 'Pago Confirmado',
    color: 'text-status-success bg-status-success/15 border-status-success/40',
    desc: '¡Tu pago ha sido validado exitosamente! Tu pedido pasa a la mesa de preparación.'
  },
  PREPARING: {
    label: 'Preparando con Amor',
    color: 'text-nebula-magenta bg-nebula-magenta/15 border-nebula-magenta/40',
    desc: 'Estamos empacando tus artículos con nuestra fragancia insignia y lazo de satín.'
  },
  SHIPPED: {
    label: 'Enviado con Guía',
    color: 'text-status-info bg-status-info/20 border-status-info/50',
    desc: 'Tu paquete ya está en manos del transportista y viaja rumbo a tu dirección.'
  },
  DELIVERED: {
    label: 'Entregado a Satisfacción',
    color: 'text-status-success bg-status-success/20 border-status-success/50',
    desc: '¡El paquete ha sido entregado! Esperamos que ilumine tu hogar y tu estilo.'
  },
  CANCELLED: {
    label: 'Pedido Cancelado',
    color: 'text-status-error bg-status-error/15 border-status-error/40',
    desc: 'El pedido fue cancelado o expiró el plazo para subir el comprobante.'
  }
};

export const OrderTrackingModal = ({ isOpen, onClose, defaultOrderNumber = '' }) => {
  const [orderQuery, setOrderQuery] = useState(defaultOrderNumber);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setOrderData(null);

    try {
      const cleanNumber = orderQuery.trim().toUpperCase();
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanNumber)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.message || 'No encontramos ningún pedido con ese código. Verifica el número ingresado.');
      }

      setOrderData(data.data);
    } catch (err) {
      setErrorMessage(err.message || 'Error al consultar pedido.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTracking = async (tracking) => {
    const ok = await copyToClipboard(tracking);
    if (ok) {
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2500);
    }
  };

  const statusInfo = orderData ? (STATUS_MAP[orderData.status] || STATUS_MAP.PENDING_PAYMENT) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-night-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-gradient-to-b from-night-800 to-night-900 border border-gold-DEFAULT/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-night-700/60 flex items-center justify-between bg-night-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 flex items-center justify-center text-gold-bright">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
                Seguimiento de Pedido
              </h2>
              <p className="text-xs text-text-secondary">
                Ingresa tu número de orden (ej. SH-2026-58291)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-gold-light hover:bg-night-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador de Pedido */}
        <div className="p-5 sm:p-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="SH-2026-XXXX"
                className="w-full bg-night-900 text-text-primary placeholder:text-text-muted text-xs rounded-xl pl-9 pr-3 py-3 border border-gold-DEFAULT/30 focus:outline-none focus:border-gold-DEFAULT font-mono uppercase"
              />
              <Search className="w-4 h-4 text-gold-bright absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
            >
              Consultar
            </Button>
          </form>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-status-error/15 border border-status-error/30 text-xs text-status-error flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Información del Pedido Encontrado */}
          {orderData && (
            <div className="space-y-5 pt-2 animate-fadeIn">
              {/* Tarjeta de Estado Principal */}
              <div className="p-5 rounded-2xl bg-night-950/80 border border-gold-DEFAULT/25 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-night-700/60 pb-3">
                  <div>
                    <span className="text-[10px] text-text-muted block">Número de Pedido</span>
                    <strong className="text-lg font-mono text-gold-bright">{orderData.orderNumber}</strong>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {statusInfo.desc}
                </p>

                {/* Número de Guía si fue despachado */}
                {orderData.trackingNumber && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-night-900 border border-night-700">
                    <div>
                      <span className="text-[10px] text-text-muted block">Número de Guía de Entrega</span>
                      <strong className="text-xs font-mono text-text-primary">{orderData.trackingNumber}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyTracking(orderData.trackingNumber)}
                      className="px-2.5 py-1 rounded-lg bg-gold-DEFAULT/20 text-gold-light text-xs font-semibold flex items-center gap-1.5"
                    >
                      {copiedTracking ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTracking ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Detalles de Entrega y Productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-night-900/60 border border-night-700 space-y-1">
                  <span className="text-text-muted block flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-gold-bright" />
                    <span>Método de Envío</span>
                  </span>
                  <strong className="text-text-primary block">{orderData.shippingMethod}</strong>
                  <span className="text-[11px] text-text-secondary block truncate">{orderData.shippingAddress}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-night-900/60 border border-night-700 space-y-1">
                  <span className="text-text-muted block flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-gold-bright" />
                    <span>Pago y Total</span>
                  </span>
                  <strong className="text-text-primary block">
                    {orderData.paymentMethod === 'SINPE_MOVIL' ? 'SINPE Móvil' : 'Transferencia Bancaria'}
                  </strong>
                  <span className="text-gold-light font-bold text-sm block">₡{orderData.total.toLocaleString('es-CR')}</span>
                </div>
              </div>

              {/* Artículos de la orden */}
              {orderData.items && orderData.items.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gold-light uppercase tracking-wider block">
                    Artículos en el Paquete ({orderData.items.length})
                  </span>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {orderData.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-night-900/80 border border-night-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {it.image ? (
                            <img src={it.image} alt={it.name} className="w-9 h-9 rounded-lg object-cover bg-night-950 shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-night-950 flex items-center justify-center text-text-muted shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0 truncate">
                            <span className="font-semibold text-text-primary block truncate">{it.name}</span>
                            {it.variant && <span className="text-[10px] text-gold-bright block">{it.variant}</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-2">
                          <span className="text-text-muted block">Cant: {it.quantity}</span>
                          <span className="font-bold text-gold-light">₡{(it.price * it.quantity).toLocaleString('es-CR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón WhatsApp de Consulta */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/50664656625?text=${encodeURIComponent(
                    `Hola Sweet Home CR! Me gustaría consultar sobre el estado de mi pedido *${orderData.orderNumber}* a nombre de ${orderData.customerName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-status-success/20 hover:bg-status-success/30 border border-status-success/40 text-status-success font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar con la Dueña por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OrderTrackingModal;
