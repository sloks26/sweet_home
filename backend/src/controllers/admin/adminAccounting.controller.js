import prisma from '../../config/prisma.js';
import { logAudit } from '../../services/audit.js';

export const adminAccountingController = {
  /**
   * Obtiene métricas contables, balance de ingresos vs egresos y datos para gráficas
   */
  async getAccountingDashboard(req, res) {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();

      // 1. Ingresos por pedidos pagados
      const confirmedOrders = await prisma.order.findMany({
        where: {
          status: { in: ['PAYMENT_CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'] }
        },
        select: { total: true, createdAt: true }
      });

      // 2. Ingresos por abonos de apartados
      const allLayaways = await prisma.layaway.findMany();

      // 3. Egresos registrados
      const allExpenses = await prisma.expense.findMany({
        orderBy: { date: 'desc' }
      });

      const ordersRevenue = confirmedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const layawaysRevenue = allLayaways.reduce((sum, l) => sum + (l.paidAmount || 0), 0);
      const totalRevenue = ordersRevenue + layawaysRevenue;

      const totalExpenses = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      const netProfit = totalRevenue - totalExpenses;

      // Apartados y Contra Entrega
      const activeApartados = allLayaways.filter(l => l.type === 'APARTADO' && l.status === 'ACTIVE');
      const pendingApartadosAmount = activeApartados.reduce((sum, l) => sum + (l.remainingAmount || 0), 0);

      const activeContraEntrega = allLayaways.filter(l => l.type === 'CONTRA_ENTREGA' && l.status === 'ACTIVE');
      const pendingContraEntregaAmount = activeContraEntrega.reduce((sum, l) => sum + (l.remainingAmount || 0), 0);

      // Gráficas por DÍA (Últimos 7 días)
      const dailyMap = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('es-CR', { weekday: 'short', day: 'numeric' });
        dailyMap[key] = { label: dayLabel, date: key, income: 0, expense: 0, net: 0 };
      }

      // Gráficas por SEMANA (Últimas 4 semanas)
      const weeklyData = [
        { label: 'Sem 1 (Hace 3 sem)', weekIdx: 3, income: 0, expense: 0, net: 0 },
        { label: 'Sem 2 (Hace 2 sem)', weekIdx: 2, income: 0, expense: 0, net: 0 },
        { label: 'Sem 3 (Sem pasada)', weekIdx: 1, income: 0, expense: 0, net: 0 },
        { label: 'Sem 4 (Esta sem)', weekIdx: 0, income: 0, expense: 0, net: 0 }
      ];

      // Gráficas por MES (Año actual)
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthlyData = monthNames.map((name, index) => ({
        label: name,
        month: name,
        monthIndex: index,
        income: 0,
        expense: 0,
        net: 0
      }));

      const getWeekDiff = (date) => {
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) return 0; // Esta sem (weekIdx: 0 -> index 3)
        if (diffDays >= 7 && diffDays < 14) return 1; // Sem pasada (weekIdx: 1 -> index 2)
        if (diffDays >= 14 && diffDays < 21) return 2; // Hace 2 sem (weekIdx: 2 -> index 1)
        if (diffDays >= 21 && diffDays < 28) return 3; // Hace 3 sem (weekIdx: 3 -> index 0)
        return -1;
      };

      // Distribuir ingresos de pedidos
      confirmedOrders.forEach(o => {
        const d = new Date(o.createdAt);
        const dayKey = d.toISOString().split('T')[0];
        if (dailyMap[dayKey]) dailyMap[dayKey].income += o.total;

        const wDiff = getWeekDiff(d);
        if (wDiff >= 0 && wDiff <= 3) {
          const wItem = weeklyData.find(w => w.weekIdx === wDiff);
          if (wItem) wItem.income += o.total;
        }

        if (d.getFullYear() === currentYear) {
          monthlyData[d.getMonth()].income += o.total;
        }
      });

      // Distribuir abonos de apartados
      allLayaways.forEach(l => {
        if (l.paidAmount > 0) {
          const d = new Date(l.updatedAt || l.createdAt);
          const dayKey = d.toISOString().split('T')[0];
          if (dailyMap[dayKey]) dailyMap[dayKey].income += l.paidAmount;

          const wDiff = getWeekDiff(d);
          if (wDiff >= 0 && wDiff <= 3) {
            const wItem = weeklyData.find(w => w.weekIdx === wDiff);
            if (wItem) wItem.income += l.paidAmount;
          }

          if (d.getFullYear() === currentYear) {
            monthlyData[d.getMonth()].income += l.paidAmount;
          }
        }
      });

      // Distribuir egresos
      allExpenses.forEach(e => {
        const d = new Date(e.date);
        const dayKey = d.toISOString().split('T')[0];
        if (dailyMap[dayKey]) dailyMap[dayKey].expense += e.amount;

        const wDiff = getWeekDiff(d);
        if (wDiff >= 0 && wDiff <= 3) {
          const wItem = weeklyData.find(w => w.weekIdx === wDiff);
          if (wItem) wItem.expense += e.amount;
        }

        if (d.getFullYear() === currentYear) {
          monthlyData[d.getMonth()].expense += e.amount;
        }
      });

      // Calcular netos
      const dailyChart = Object.values(dailyMap).map(d => ({
        ...d,
        net: d.income - d.expense
      }));

      weeklyData.forEach(w => {
        w.net = w.income - w.expense;
      });

      monthlyData.forEach(m => {
        m.net = m.income - m.expense;
      });

      return res.json({
        success: true,
        data: {
          metrics: {
            totalRevenue,
            totalExpenses,
            netProfit,
            activeApartadosCount: activeApartados.length,
            pendingApartadosAmount,
            activeContraEntregaCount: activeContraEntrega.length,
            pendingContraEntregaAmount
          },
          charts: {
            daily: dailyChart,
            weekly: weeklyData,
            monthly: monthlyData
          },
          allExpenses,
          allLayaways,
          recentExpenses: allExpenses.slice(0, 10),
          recentLayaways: allLayaways.slice(0, 10)
        }
      });
    } catch (err) {
      console.error('Error obteniendo contabilidad:', err);
      return res.status(500).json({ error: true, message: 'Error interno obteniendo contabilidad' });
    }
  },

  /**
   * Crear nuevo egreso / gasto
   */
  async createExpense(req, res) {
    try {
      const { concept, category = 'OPERATIVO', amount, notes, date } = req.body;
      if (!concept || !amount || Number(amount) <= 0) {
        return res.status(400).json({ error: true, message: 'Concepto y monto válido son requeridos' });
      }

      const expense = await prisma.expense.create({
        data: {
          concept: concept.trim(),
          category: category.toUpperCase(),
          amount: parseFloat(amount),
          notes: notes ? notes.trim() : null,
          date: date ? new Date(date) : new Date()
        }
      });

      await logAudit({
        userId: req.user?.id,
        action: 'CREATE_EXPENSE',
        module: 'ACCOUNTING',
        details: { id: expense.id, concept: expense.concept, amount: expense.amount },
        req
      });

      return res.json({ success: true, message: 'Gasto registrado correctamente', data: expense });
    } catch (err) {
      console.error('Error creando gasto:', err);
      return res.status(500).json({ error: true, message: 'Error creando gasto' });
    }
  },

  /**
   * Eliminar un gasto
   */
  async deleteExpense(req, res) {
    try {
      const { id } = req.params;
      await prisma.expense.delete({ where: { id } });

      await logAudit({
        userId: req.user?.id,
        action: 'DELETE_EXPENSE',
        module: 'ACCOUNTING',
        details: { id },
        req
      });

      return res.json({ success: true, message: 'Gasto eliminado' });
    } catch (err) {
      console.error('Error eliminando gasto:', err);
      return res.status(500).json({ error: true, message: 'Error eliminando gasto' });
    }
  },

  /**
   * Listar clientes a pagos (apartados) o contra entrega
   */
  async getLayaways(req, res) {
    try {
      const { type } = req.query;
      const where = type ? { type: type.toUpperCase() } : {};
      const list = await prisma.layaway.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
      return res.json({ success: true, data: list });
    } catch (err) {
      console.error('Error listando apartados:', err);
      return res.status(500).json({ error: true, message: 'Error listando apartados' });
    }
  },

  /**
   * Crear nuevo registro de apartado o contra entrega
   */
  async createLayaway(req, res) {
    try {
      const {
        customerName,
        customerPhone,
        productDetails,
        totalAmount,
        paidAmount = 0,
        type = 'APARTADO',
        dueDate,
        notes
      } = req.body;

      if (!customerName || !customerPhone || !totalAmount) {
        return res.status(400).json({ error: true, message: 'Nombre, teléfono y monto total son obligatorios' });
      }

      const total = parseFloat(totalAmount);
      const paid = parseFloat(paidAmount) || 0;
      const remaining = Math.max(0, total - paid);
      const status = remaining <= 0 ? 'COMPLETED' : 'ACTIVE';

      const layaway = await prisma.layaway.create({
        data: {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          productDetails: productDetails ? productDetails.trim() : 'Artículos varios',
          totalAmount: total,
          paidAmount: paid,
          remainingAmount: remaining,
          type: type.toUpperCase(),
          status,
          dueDate: dueDate ? new Date(dueDate) : null,
          notes: notes ? notes.trim() : null
        }
      });

      await logAudit({
        userId: req.user?.id,
        action: 'CREATE_LAYAWAY',
        module: 'ACCOUNTING',
        details: { id: layaway.id, customer: layaway.customerName, type: layaway.type },
        req
      });

      return res.json({ success: true, message: 'Registro creado con éxito', data: layaway });
    } catch (err) {
      console.error('Error creando apartado:', err);
      return res.status(500).json({ error: true, message: 'Error creando registro' });
    }
  },

  /**
   * Registrar abono o actualizar estado de apartado / contra entrega
   */
  async updateLayaway(req, res) {
    try {
      const { id } = req.params;
      const { addPayment, status, notes } = req.body;

      const existing = await prisma.layaway.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: true, message: 'Registro no encontrado' });
      }

      let newPaid = existing.paidAmount;
      if (addPayment && Number(addPayment) > 0) {
        newPaid += parseFloat(addPayment);
      }

      const newRemaining = Math.max(0, existing.totalAmount - newPaid);
      const newStatus = status || (newRemaining <= 0 ? 'COMPLETED' : existing.status);

      const updated = await prisma.layaway.update({
        where: { id },
        data: {
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          status: newStatus,
          notes: notes !== undefined ? notes : existing.notes
        }
      });

      return res.json({ success: true, message: 'Apartado actualizado correctamente', data: updated });
    } catch (err) {
      console.error('Error actualizando apartado:', err);
      return res.status(500).json({ error: true, message: 'Error actualizando apartado' });
    }
  },

  /**
   * Eliminar un registro de apartado
   */
  async deleteLayaway(req, res) {
    try {
      const { id } = req.params;
      await prisma.layaway.delete({ where: { id } });
      return res.json({ success: true, message: 'Registro eliminado' });
    } catch (err) {
      console.error('Error eliminando apartado:', err);
      return res.status(500).json({ error: true, message: 'Error eliminando registro' });
    }
  }
};

export default adminAccountingController;
