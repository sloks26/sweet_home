import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Image,
  BookOpen,
  ArrowUpRight,
  Activity,
  ShoppingBag,
  FileSpreadsheet,
  Coins,
  Receipt
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
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

export const AdminDashboard = ({ stats, onNavigate }) => {
  const [accountingData, setAccountingData] = useState(null);
  const [loadingAccounting, setLoadingAccounting] = useState(true);
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
    } finally {
      setLoadingAccounting(false);
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

  return (
    <div className="space-y-8">
      {/* 1. TÍTULO DE BIENVENIDA Y ACCESOS RÁPIDOS (Jerarquía limpia: Un solo botón principal) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Panel de Control y Contabilidad
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Resumen en vivo de ingresos en colones (₡), egresos, clientes a pagos, contra entrega y
            comprobantes SINPE.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={handleExportExcel}
            className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/15"
          >
            Exportar Contabilidad
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={ShoppingBag}
            onClick={() => onNavigate('orders')}
            className="border-gold-DEFAULT/40 text-gold-light hover:bg-[#1C0F30]"
          >
            Ver Pedidos
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Package}
            onClick={() => onNavigate('products')}
            className="border-night-700 text-text-secondary hover:text-text-primary hover:bg-[#1C0F30]"
          >
            Productos
          </Button>
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
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-text-primary">Últimos Pedidos</h3>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-xs text-gold-bright hover:underline font-medium flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted">
                Aún no hay pedidos registrados. Los nuevos pedidos aparecerán aquí automáticamente.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-night-700 text-text-muted">
                    <th className="pb-3 font-medium">Pedido</th>
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Método</th>
                    <th className="pb-3 font-medium">Monto</th>
                    <th className="pb-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-night-800">
                  {recentOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => onNavigate('orders')}
                      className="hover:bg-[#1F1035] transition-colors cursor-pointer"
                    >
                      <td className="py-3 font-semibold text-gold-light">{ord.orderNumber}</td>
                      <td className="py-3 text-text-secondary">{ord.customerName}</td>
                      <td className="py-3 text-gold-light/90">
                        {ord.paymentMethod === 'SINPE_MOVIL' ? 'SINPE Móvil' : 'Transferencia'}
                      </td>
                      <td className="py-3 font-bold text-text-primary">
                        ₡{(ord.total || 0).toLocaleString('es-CR')}
                      </td>
                      <td className="py-3">
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
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-text-primary flex items-center gap-2">
              <Activity className="w-5 h-5 text-gold-bright" />
              <span>Bitácora de Actividad</span>
            </h3>
            <span className="text-[11px] text-text-muted">Seguridad activa</span>
          </div>

          <div className="space-y-3">
            {recentLogs.length === 0 ? (
              <div className="p-4 text-center text-xs text-text-muted">
                Sin registros recientes.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-night-950/70 border border-night-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gold-light">{log.action}</span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(log.createdAt).toLocaleTimeString('es-CR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-secondary truncate">
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
