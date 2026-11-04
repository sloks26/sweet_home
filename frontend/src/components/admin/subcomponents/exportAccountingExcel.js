/**
 * Exportador de Contabilidad a CSV compatible con Microsoft Excel (UTF-8 con BOM)
 */
export const exportAccountingToExcel = ({ metrics, charts, layaways = [], expenses = [] }) => {
  const formatCRC = (num) => `₡${(num || 0).toLocaleString('es-CR')}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CR');

  let csvContent = '\uFEFF'; // BOM para que Excel abra UTF-8 con tildes y símbolos de colones correctamente

  // 1. TÍTULO Y FECHA
  csvContent += `"REPORTE CONTABLE Y FINANCIERO - SWEET HOME & BOUTIQUE"\n`;
  csvContent += `"Fecha de Generación:","${dateStr} ${now.toLocaleTimeString('es-CR')}"\n`;
  csvContent += `"Moneda:","Colones Costarricenses (₡)"\n\n`;

  // 2. RESUMEN FINANCIERO
  csvContent += `"=== RESUMEN GENERAL ==="\n`;
  csvContent += `"Concepto","Monto (₡)"\n`;
  csvContent += `"Ingresos Totales (Ventas + Abonos)","${formatCRC(metrics?.totalRevenue)}"\n`;
  csvContent += `"Egresos Totales (Gastos Registrados)","${formatCRC(metrics?.totalExpenses)}"\n`;
  csvContent += `"GANANCIA NETA","${formatCRC(metrics?.netProfit)}"\n`;
  csvContent += `"Apartados Activos por Cobrar","${formatCRC(metrics?.pendingApartadosAmount)} (${metrics?.activeApartadosCount || 0} clientes)"\n`;
  csvContent += `"Contra Entrega por Cobrar","${formatCRC(metrics?.pendingContraEntregaAmount)} (${metrics?.activeContraEntregaCount || 0} pedidos)"\n\n`;

  // 3. BALANCE MENSUAL (AÑO ACTUAL)
  csvContent += `"=== INGRESOS VS EGRESOS POR MES ==="\n`;
  csvContent += `"Mes","Ingresos (₡)","Egresos (₡)","Ganancia Neta (₡)"\n`;
  (charts?.monthly || []).forEach((m) => {
    csvContent += `"${m.month}","${formatCRC(m.income)}","${formatCRC(m.expense)}","${formatCRC(m.net)}"\n`;
  });
  csvContent += `\n`;

  // 4. CONTROL DE CLIENTES A PAGOS (APARTADOS)
  csvContent += `"=== CONTROL DE CLIENTES A PAGOS (APARTADOS) ==="\n`;
  csvContent += `"Cliente","Teléfono / WhatsApp","Prendas / Artículos","Monto Total (₡)","Abonado (₡)","Saldo Pendiente (₡)","Estado","Fecha Límite","Notas"\n`;
  const apartados = layaways.filter((l) => l.type === 'APARTADO');
  if (apartados.length === 0) {
    csvContent += `"Sin registros de apartados","","","","","","","",""\n`;
  } else {
    apartados.forEach((l) => {
      const due = l.dueDate ? new Date(l.dueDate).toLocaleDateString('es-CR') : 'Sin fecha';
      csvContent += `"${l.customerName}","${l.customerPhone}","${(l.productDetails || '').replace(/"/g, '""')}","${formatCRC(l.totalAmount)}","${formatCRC(l.paidAmount)}","${formatCRC(l.remainingAmount)}","${l.status === 'COMPLETED' ? 'LIQUIDADO' : 'ACTIVO'}","${due}","${(l.notes || '').replace(/"/g, '""')}"\n`;
    });
  }
  csvContent += `\n`;

  // 5. CONTROL DE PEDIDOS CONTRA ENTREGA
  csvContent += `"=== CONTROL DE CLIENTES CONTRA ENTREGA ==="\n`;
  csvContent += `"Cliente","Teléfono / WhatsApp","Detalle Pedido","Monto a Cobrar (₡)","Estado","Notas"\n`;
  const contraEntrega = layaways.filter((l) => l.type === 'CONTRA_ENTREGA');
  if (contraEntrega.length === 0) {
    csvContent += `"Sin pedidos contra entrega","","","","",""\n`;
  } else {
    contraEntrega.forEach((c) => {
      csvContent += `"${c.customerName}","${c.customerPhone}","${(c.productDetails || '').replace(/"/g, '""')}","${formatCRC(c.totalAmount)}","${c.status === 'COMPLETED' ? 'COBRADO' : 'PENDIENTE'}","${(c.notes || '').replace(/"/g, '""')}"\n`;
    });
  }
  csvContent += `\n`;

  // 6. DETALLE DE GASTOS Y EGRESOS
  csvContent += `"=== DETALLE DE EGRESOS / GASTOS REGISTRADOS ==="\n`;
  csvContent += `"Fecha","Concepto","Categoría","Monto (₡)","Notas"\n`;
  if (expenses.length === 0) {
    csvContent += `"Sin gastos registrados","","","",""\n`;
  } else {
    expenses.forEach((e) => {
      const expDate = e.date ? new Date(e.date).toLocaleDateString('es-CR') : '';
      csvContent += `"${expDate}","${(e.concept || '').replace(/"/g, '""')}","${e.category}","${formatCRC(e.amount)}","${(e.notes || '').replace(/"/g, '""')}"\n`;
    });
  }

  // Descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanDate = now.toISOString().split('T')[0];
  link.setAttribute('download', `SweetHome_Contabilidad_${cleanDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default exportAccountingToExcel;
