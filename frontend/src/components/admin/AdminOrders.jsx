import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, Trash2, PackageCheck, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import AdminOrderDetailModal from './subcomponents/AdminOrderDetailModal';
import AdminOrdersMobileList from './subcomponents/AdminOrdersMobileList';

export const AdminOrders = ({ initialStatusFilter = 'ALL' }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  const fetchOrders = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Polling casi en tiempo real cada 45 segundos para detectar comprobantes nuevos
  useEffect(() => {
    const timer = setInterval(() => {
      fetchOrders(true);
    }, 45000);
    return () => clearInterval(timer);
  }, [statusFilter, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus, extraData = {}) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const payload = {
        status: newStatus,
        ...extraData
      };

      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedOrder(data.data);
        fetchOrders();
      } else {
        alert(data.message || 'Error al actualizar pedido');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servidor');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleApproveVoucher = () => {
    handleUpdateStatus('PAYMENT_CONFIRMED');
  };

  const handleRejectVoucher = (customReason) => {
    const reason =
      typeof customReason === 'string' && customReason.trim()
        ? customReason.trim()
        : prompt(
            'Ingrese el motivo del rechazo del comprobante (ej: comprobante ilegible, monto no coincide):'
          );
    if (!reason) return;
    handleUpdateStatus('PENDING_PAYMENT', { rejectionReason: reason });
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (
      !window.confirm(
        `¿Estás segura de eliminar permanentemente el pedido ${orderNumber}? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
        fetchOrders();
      } else {
        alert(data.message || 'Error al eliminar pedido');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servidor');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return (
          <Badge variant="outline" size="sm">
            Pendiente de Pago
          </Badge>
        );
      case 'VOUCHER_RECEIVED':
        return (
          <Badge variant="warning" size="sm" withDot>
            Comprobante por Verificar
          </Badge>
        );
      case 'PAYMENT_CONFIRMED':
        return (
          <Badge variant="success" size="sm">
            Pago Confirmado
          </Badge>
        );
      case 'PREPARING':
        return (
          <Badge variant="gold" size="sm">
            En Preparación
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge variant="gold" size="sm">
            Enviado
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge variant="success" size="sm">
            Entregado
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="error" size="sm">
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" size="sm">
            {status}
          </Badge>
        );
    }
  };

  const openWhatsApp = (order) => {
    const phone = (order.customerPhone || '').replace(/\D/g, '');
    let text = `¡Hola ${order.customerName}! Te saludamos con mucho cariño de Sweet Home & Boutique CR 🌸 respecto a tu pedido *#${order.orderNumber}*.`;

    if (order.status === 'PAYMENT_CONFIRMED') {
      text += `\n\nHemos verificado con éxito tu comprobante de pago por ₡${(order.total || 0).toLocaleString('es-CR')}. Ya estamos preparando tu paquete con mucho amor. ✨`;
    } else if (order.status === 'SHIPPED') {
      text += `\n\nTu paquete ya va en camino mediante *${order.shippingMethod}*.`;
      if (order.trackingNumber) {
        text += `\nNúmero de guía para rastreo: *${order.trackingNumber}*`;
      }
    } else if (order.status === 'VOUCHER_RECEIVED') {
      text += `\n\nHemos recibido la captura de tu comprobante. Lo estamos validando en nuestro sistema y en breve te confirmamos. ¡Muchas gracias! 💕`;
    }

    const url = `https://wa.me/506${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Ejecutivo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1036] via-[#150A26] to-[#11071F] border border-white/[0.08] border-t-gold-DEFAULT/35 p-5 sm:p-7 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/35 text-gold-bright text-xs font-semibold mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Control de Ventas, Pagos & Despachos</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Gestión de Pedidos & Comprobantes
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
            Valida transferencias y SINPE Móvil en tiempo real, despacha envíos y mantén
            comunicación directa por WhatsApp.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => fetchOrders(false)}>
          Actualizar Lista
        </Button>
      </div>

      {/* Barra de Filtros por Estado */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-night-900 border border-gold-DEFAULT/15">
        {[
          { id: 'ALL', label: 'Todos' },
          { id: 'VOUCHER_RECEIVED', label: 'Por Verificar', highlight: true },
          { id: 'PENDING_PAYMENT', label: 'Pendiente Pago' },
          { id: 'PAYMENT_CONFIRMED', label: 'Confirmados' },
          { id: 'PREPARING', label: 'En Preparación' },
          { id: 'SHIPPED', label: 'Enviados' },
          { id: 'DELIVERED', label: 'Entregados' },
          { id: 'CANCELLED', label: 'Cancelados' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === tab.id
                ? 'bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark text-night-950 font-bold shadow-sm'
                : tab.highlight
                  ? 'text-amber-300 hover:bg-night-800'
                  : 'text-text-secondary hover:text-gold-light hover:bg-night-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Buscador y Filtros */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número (ej: SH-2026-74912), cliente, email o teléfono..."
            className="w-full bg-night-900 text-text-primary text-base sm:text-xs rounded-xl pl-9 pr-3 py-2.5 border border-night-700 focus:outline-none focus:border-gold-DEFAULT transition-colors"
          />
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-3.5 sm:top-2.5" />
        </div>
        <Button
          variant="outline"
          size="sm"
          type="submit"
          className="min-h-[44px] px-4 font-bold border-gold-DEFAULT/50 text-gold-light"
        >
          Buscar
        </Button>
      </form>

      {/* VISTA MÓVIL: LISTA DE TARJETAS EN VEZ DE TABLA HORIZONTAL (Pantallas < 1024px) */}
      <div className="lg:hidden">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-4 rounded-2xl bg-[#150B24] border border-night-800 animate-pulse space-y-3"
              >
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-night-700 rounded" />
                  <div className="h-5 w-20 bg-night-700 rounded-full" />
                </div>
                <div className="h-3 w-40 bg-night-800 rounded" />
                <div className="h-8 bg-night-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <AdminOrdersMobileList
            orders={orders}
            onOpenDetail={handleOpenDetail}
            onOpenWhatsApp={openWhatsApp}
            onDeleteOrder={handleDeleteOrder}
            getStatusBadge={getStatusBadge}
          />
        )}
      </div>

      {/* VISTA ESCRITORIO: TABLA COMPLETA CON SKELETON (Pantallas >= 1024px) */}
      <div className="hidden lg:block rounded-2xl bg-night-900 border border-gold-DEFAULT/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-night-800 bg-night-950/60 text-text-muted">
                <th className="py-3 px-4 font-semibold">Pedido</th>
                <th className="py-3 px-4 font-semibold">Fecha</th>
                <th className="py-3 px-4 font-semibold">Cliente</th>
                <th className="py-3 px-4 font-semibold">Método & Envío</th>
                <th className="py-3 px-4 font-semibold">Total</th>
                <th className="py-3 px-4 font-semibold">Comprobante</th>
                <th className="py-3 px-4 font-semibold">Estado</th>
                <th className="py-3 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-night-800">
              {loading ? (
                [1, 2, 3, 4, 5].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="py-3 px-4">
                      <div className="h-4 w-24 bg-night-800 rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 w-20 bg-night-800 rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 w-32 bg-night-800 rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3 w-28 bg-night-800 rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-16 bg-night-800 rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-20 bg-night-800 rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-5 w-24 bg-night-800 rounded-full" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="h-7 w-20 bg-night-800 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-muted">
                    <PackageCheck className="w-8 h-8 text-gold-light/40 mx-auto mb-2" />
                    <p className="font-semibold text-text-secondary">
                      No se encontraron pedidos con los filtros actuales.
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">
                      Prueba seleccionando "Todos" o limpiando el buscador.
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const hasVoucher = Boolean(ord.voucherUrl);
                  return (
                    <tr key={ord.id} className="hover:bg-night-800/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-gold-light">{ord.orderNumber}</td>
                      <td className="py-3 px-4 text-text-secondary whitespace-nowrap">
                        {new Date(ord.createdAt).toLocaleDateString('es-CR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text-primary">{ord.customerName}</div>
                        <div className="text-[11px] text-text-muted">{ord.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-text-primary">
                          {ord.paymentMethod === 'SINPE_MOVIL'
                            ? 'SINPE Móvil'
                            : 'Transferencia Bancaria'}
                        </div>
                        <div className="text-[11px] text-text-muted truncate max-w-[150px]">
                          {ord.shippingMethod}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-text-primary whitespace-nowrap">
                        ₡{ord.total.toLocaleString('es-CR')}
                      </td>
                      <td className="py-3 px-4">
                        {hasVoucher ? (
                          <button
                            onClick={() => handleOpenDetail(ord)}
                            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Captura</span>
                          </button>
                        ) : ['PAYMENT_CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'].includes(
                            ord.status
                          ) ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                            <span>Verificado ✓</span>
                          </span>
                        ) : ord.status === 'CANCELLED' ? (
                          <span className="text-[11px] text-text-muted">Cancelado</span>
                        ) : (
                          <span className="text-[11px] text-text-muted italic">Sin adjunto</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(ord.status)}</td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(ord)}
                            className="px-2.5 py-1 rounded-lg bg-night-800 hover:bg-night-700 text-gold-light text-xs font-medium border border-gold-DEFAULT/20 transition-colors cursor-pointer"
                          >
                            Detalle
                          </button>
                          {ord.customerPhone && (
                            <button
                              onClick={() => openWhatsApp(ord)}
                              title="Contactar al cliente por WhatsApp"
                              className="p-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors cursor-pointer"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                            title="Eliminar pedido"
                            className="p-1.5 rounded-lg border border-status-error/30 text-status-error hover:bg-status-error/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle de Pedido & Comprobante con Zoom */}
      <AdminOrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        selectedOrder={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onApproveVoucher={handleApproveVoucher}
        onRejectVoucher={handleRejectVoucher}
        onOpenWhatsApp={openWhatsApp}
        onDeleteOrder={handleDeleteOrder}
        isUpdatingStatus={isUpdatingStatus}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
};

export default AdminOrders;
