/**
 * Constantes oficiales y mapeo de estados de pedidos, métodos de pago y envíos
 */

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  VOUCHER_RECEIVED: 'VOUCHER_RECEIVED',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  PREPARING: 'PREPARING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const ORDER_STATUS_DETAILS = {
  [ORDER_STATUS.PENDING_PAYMENT]: {
    label: 'Pendiente de Pago',
    shortLabel: 'Pendiente',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-400',
    description: 'Pedido registrado, esperando que el cliente suba el comprobante'
  },
  [ORDER_STATUS.VOUCHER_RECEIVED]: {
    label: 'Comprobante Recibido',
    shortLabel: 'Comprobante',
    badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    dotClass: 'bg-blue-400',
    description: 'Comprobante subido, pendiente de verificación manual por la dueña'
  },
  [ORDER_STATUS.PAYMENT_CONFIRMED]: {
    label: 'Pago Confirmado',
    shortLabel: 'Confirmado',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    description: 'Pago validado en cuenta bancaria, listo para empacar'
  },
  [ORDER_STATUS.PREPARING]: {
    label: 'En Preparación',
    shortLabel: 'Preparando',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    dotClass: 'bg-purple-400',
    description: 'Empacando prendas con empaque boutique oficial'
  },
  [ORDER_STATUS.SHIPPED]: {
    label: 'En Camino con Mensajería',
    shortLabel: 'Enviado',
    badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    dotClass: 'bg-cyan-400',
    description: 'Despachado con número de guía de Correos o mensajero privado'
  },
  [ORDER_STATUS.DELIVERED]: {
    label: 'Entregado a Satisfacción',
    shortLabel: 'Entregado',
    badgeClass: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
    dotClass: 'bg-emerald-300',
    description: 'Paquete entregado a la clienta'
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Cancelado',
    shortLabel: 'Cancelado',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    description: 'Pedido cancelado por falta de pago o rechazo'
  }
};

export const PAYMENT_METHODS = {
  SINPE_MOVIL: {
    label: 'SINPE Móvil',
    shortLabel: 'SINPE',
    description: 'Transferencia electrónica por SINPE Móvil'
  },
  TRANSFER: {
    label: 'Transferencia Bancaria',
    shortLabel: 'Banco',
    description: 'Depósito a cuenta IBAN (BAC o Banco Nacional)'
  },
  CONTRA_ENTREGA: {
    label: 'Contra Entrega',
    shortLabel: 'Efectivo',
    description: 'Pago en efectivo o SINPE al momento de recibir'
  }
};
