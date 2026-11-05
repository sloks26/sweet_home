import React, { useState, useEffect } from 'react';
import {
  Package,
  ArrowUpRight,
  Activity,
  ShoppingBag,
  FileSpreadsheet,
  Sparkles,
  Calendar
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { getAdminGreeting } from '../../utils/adminGreeting';
import AccountingKPIs from './subcomponents/AccountingKPIs';
import AccountingChart from './subcomponents/AccountingChart';
import AccountingClients from './subcomponents/AccountingClients';
import AccountingExpenses from './subcomponents/AccountingExpenses';
import DashboardSalesGoal from './subcomponents/DashboardSalesGoal';
import DashboardTopProducts from './subcomponents/DashboardTopProducts';
import DashboardShippingSummary from './subcomponents/DashboardShippingSummary';
import DashboardLowStockAlert from './subcomponents/DashboardLowStockAlert';
import DashboardActionCenter from './subcomponents/DashboardActionCenter';
import { exportAccountingToExcel } from './subcomponents/exportAccountingExcel';

export const AdminDashboard = ({ stats, onNavigate, authUser }) => {
  const [accountingData, setAccountingData] = useState(null);
  const [activeClientsTab, setActiveClientsTab] = useState('apartados');

  const fetchAccounting = async () => {
    try {
      const res = await fetch('/api/admin/accounting');
      const data = await res.json();
      if (data.success) {
        setAccountingData(data.data);
      }
    } catch (err) {
      console.error('Error cargando contabilidad:', err);
    }
  };

  useEffect(() => {
    fetchAccounting();
  }, []);

  const metrics = stats?.metrics || {
    totalRevenue: 0,
    pendingPaymentOrders: 0,
    voucherReceivedOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    lowStockCount: 0
  };

  const recentOrders = stats?.recentOrders || [];
  const recentLogs = stats?.recentLogs || [];
  const topProducts = stats?.topProducts || [];
  const shippingOrders = stats?.shippingOrders || [];
  const lowStockItems = stats?.lowStockItems || [];

  const combinedMetrics = {
    totalRevenue: accountingData?.metrics?.totalRevenue ?? metrics.totalRevenue,
    totalExpenses: accountingData?.metrics?.totalExpenses ?? 0,
    netProfit: accountingData?.metrics?.netProfit ?? metrics.totalRevenue,
    activeApartadosCount: accountingData?.metrics?.activeApartadosCount ?? 0,
    pendingApartadosAmount: accountingData?.metrics?.pendingApartadosAmount ?? 0,
    activeContraEntregaCount: accountingData?.metrics?.activeContraEntregaCount ?? 0,
    pendingContraEntregaAmount: accountingData?.metrics?.pendingContraEntregaAmount ?? 0
  };

  const handleExportExcel = () => {
    exportAccountingToExcel({
      metrics: combinedMetrics,
      charts: accountingData?.charts,
      layaways: accountingData?.allLayaways || [],
      expenses: accountingData?.allExpenses || []
    });
  };

  const formattedToday = new Date().toLocaleDateString('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-8">
      {/* 1. CABECERA EJECUTIVA PREMIUM (Cristal Obsidiana + Luz Imperial Dorada) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1036] via-[#150A26] to-[#11071F] border border-white/[0.08] border-t-gold-DEFAULT/35 p-5 sm:p-7 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.7)]">
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold-DEFAULT/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-gold-DEFAULT/20 to-gold-DEFAULT/5 border border-gold-DEFAULT/35 text-gold-bright text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold-bright" />
                <span>{getAdminGreeting(authUser)}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-muted capitalize">
                <Calendar className="w-3.5 h-3.5 text-gold-light/70" />
                <span>{formattedToday}</span>
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Panel de Control & Contabilidad CRM
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
              Monitoreo financiero en vivo en colones (₡), control de cartera de clientes a pagos,
              despachos contra entrega y validación de comprobantes SINPE.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              onClick={handleExportExcel}
              className="bg-emerald-500/10 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 shadow-sm whitespace-nowrap"
            >
              Exportar Contabilidad
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={ShoppingBag}
              onClick={() => onNavigate('orders')}
              className="bg-gold-DEFAULT/10 border-gold-DEFAULT/35 text-gold-light hover:bg-gold-DEFAULT/20 hover:border-gold-bright whitespace-nowrap"
            >
              Ver Pedidos
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Package}
              onClick={() => onNavigate('products')}
              className="bg-white/[0.03] border-white/[0.1] text-text-secondary hover:text-text-primary hover:bg-white/[0.08] whitespace-nowrap"
            >
              Productos
            </Button>
          </div>
        </div>
      </div>

      {/* 2. PRIMER BLOQUE: LO QUE NECESITA TU ATENCIÓN HOY (Accionable e interactivo) */}
      <DashboardActionCenter metrics={metrics} onNavigate={onNavigate} />

      {/* 3. CINCO TARJETAS DE MÉTRICAS CONTABLES (COLONES ₡) */}
      <AccountingKPIs
        metrics={combinedMetrics}
        onSelectTab={(tab) => {
          setActiveClientsTab(tab);
          const el = document.getElementById('accounting-clients-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. META MENSUAL DE VENTAS (BARRA DE PROGRESO) */}
      <DashboardSalesGoal currentSales={combinedMetrics.totalRevenue} />

      {/* 5. GRÁFICA ANIMADA DE INGRESOS VS EGRESOS (DÍA, SEMANA, MES) */}
      <AccountingChart charts={accountingData?.charts} onExportExcel={handleExportExcel} />

      {/* 6. FILA DOBLE: PRENDAS ESTRELLA (TOP 5) Y RESUMEN DE ENVÍOS / MENSAJERÍA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <DashboardTopProducts products={topProducts} onNavigate={onNavigate} />
        </div>
        <div className="lg:col-span-6">
          <DashboardShippingSummary orders={shippingOrders} onNavigate={onNavigate} />
        </div>
      </div>

      {/* 7. CONTROL DE CLIENTES A PAGOS (APARTADOS) Y CONTRA ENTREGA (CON COBRO WHATSAPP) */}
      <div id="accounting-clients-section">
        <AccountingClients
          layaways={accountingData?.allLayaways || []}
          onRefresh={fetchAccounting}
          activeTab={activeClientsTab}
          setActiveTab={setActiveClientsTab}
        />
      </div>

      {/* 8. FILA DOBLE: ALERTA DE STOCK CRÍTICO Y REGISTRO DE EGRESOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <DashboardLowStockAlert items={lowStockItems} onNavigate={onNavigate} />
        </div>
        <div className="lg:col-span-7">
          <AccountingExpenses
            expenses={accountingData?.allExpenses || []}
            onRefresh={fetchAccounting}
          />
        </div>
      </div>

      {/* 9. SECCIÓN DOBLE: ÚLTIMOS PEDIDOS Y BITÁCORA DE AUDITORÍA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-b from-[#180C2C]/95 to-[#110720]/95 border border-white/[0.07] border-t-gold-DEFAULT/30 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="font-serif text-xl font-bold text-text-primary">Últimos Pedidos</h3>
              <p className="text-[11px] text-text-secondary">
                Movimientos más recientes recibidos en la tienda en línea.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="px-3 py-1.5 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 text-xs text-gold-bright hover:bg-gold-DEFAULT/20 font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted bg-[#0C0517]/60 rounded-xl border border-white/[0.05]">
                Aún no hay pedidos registrados. Los nuevos pedidos aparecerán aquí automáticamente.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-wider text-gold-light/70">
                    <th className="pb-3 font-semibold">Pedido</th>
                    <th className="pb-3 font-semibold">Cliente</th>
                    <th className="pb-3 font-semibold">Método</th>
                    <th className="pb-3 font-semibold">Monto</th>
                    <th className="pb-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {recentOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => onNavigate('orders')}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 font-semibold text-gold-bright">{ord.orderNumber}</td>
                      <td className="py-3.5 text-text-primary font-medium">{ord.customerName}</td>
                      <td className="py-3.5 text-text-secondary">
                        {ord.paymentMethod === 'SINPE_MOVIL' ? 'SINPE Móvil' : 'Transferencia'}
                      </td>
                      <td className="py-3.5 font-bold text-text-primary tabular-nums">
                        ₡{(ord.total || 0).toLocaleString('es-CR')}
                      </td>
                      <td className="py-3.5">
                        {ord.status === 'VOUCHER_RECEIVED' ? (
                          <Badge variant="warning" size="sm">
                            Validar
                          </Badge>
                        ) : ord.status === 'PAYMENT_CONFIRMED' ? (
                          <Badge variant="success" size="sm">
                            Confirmado
                          </Badge>
                        ) : ord.status === 'SHIPPED' ? (
                          <Badge variant="gold" size="sm">
                            Enviado
                          </Badge>
                        ) : (
                          <Badge variant="outline" size="sm">
                            {ord.status}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Bitácora de Auditoría */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-[#180C2C]/95 to-[#110720]/95 border border-white/[0.07] border-t-gold-DEFAULT/30 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="font-serif text-xl font-bold text-text-primary flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 text-gold-bright">
                <Activity className="w-4 h-4" />
              </div>
              <span>Bitácora de Actividad</span>
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-semibold text-emerald-300">
              Seguridad activa
            </span>
          </div>

          <div className="space-y-2.5">
            {recentLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted bg-[#0C0517]/60 rounded-xl border border-white/[0.05]">
                Sin registros recientes.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#0D0518]/80 border border-white/[0.06] hover:border-gold-DEFAULT/25 transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gold-light flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-bright" />
                      {log.action}
                    </span>
                    <span className="text-[10px] text-text-muted tabular-nums">
                      {new Date(log.createdAt).toLocaleTimeString('es-CR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-secondary truncate pl-3">
                    Por: {log.user?.name || 'Sistema'} • Módulo: {log.module}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
