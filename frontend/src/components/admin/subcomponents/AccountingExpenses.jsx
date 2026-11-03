import React, { useState } from 'react';
import { TrendingDown, Plus, Trash2, Tag, Calendar } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Modal from '../../ui/Modal';

export const AccountingExpenses = ({ expenses = [], onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [concept, setConcept] = useState('');
  const [category, setCategory] = useState('EMPAQUE');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    setConcept('');
    setCategory('EMPAQUE');
    setAmount('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!concept || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: concept.trim(),
          category,
          amount: parseFloat(amount),
          notes: notes.trim() || null,
          date
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Error al guardar gasto');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id, expConcept) => {
    if (!window.confirm(`¿Eliminar el gasto "${expConcept}"?`)) return;
    try {
      const res = await fetch(`/api/admin/expenses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const categoryLabels = {
    MERCADERIA: 'Inventario / Mercadería',
    ENVIOS: 'Envíos y Mensajería',
    EMPAQUE: 'Empaques y Cajas',
    PUBLICIDAD: 'Publicidad y Redes',
    LOCAL: 'Local / Alquiler / Servicios',
    OTRO: 'Otros Gastos'
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#140A22] border border-rose-500/25 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-rose-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-text-primary">
              Registro de Egresos y Gastos (₡)
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Lleva el control de todos los costos de la boutique para calcular tu ganancia real.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={openModal}>
          + Registrar Gasto
        </Button>
      </div>

      <div className="overflow-x-auto">
        {expenses.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            No tienes gastos registrados. Registra insumos, bolsas, envíos o compras de mercadería.
          </div>
        ) : (
          <table className="w-full text-left text-xs min-w-[550px]">
            <thead>
              <tr className="border-b border-night-700 text-text-muted">
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium">Concepto</th>
                <th className="pb-3 font-medium">Categoría</th>
                <th className="pb-3 font-medium">Monto (₡)</th>
                <th className="pb-3 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-night-800">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#1E1033] transition-colors">
                  <td className="py-3 text-text-muted whitespace-nowrap">
                    {exp.date ? new Date(exp.date).toLocaleDateString('es-CR') : 'Hoy'}
                  </td>
                  <td className="py-3 font-medium text-white max-w-[200px] truncate" title={exp.concept}>
                    <div>{exp.concept}</div>
                    {exp.notes && (
                      <div className="text-[10px] text-text-muted">{exp.notes}</div>
                    )}
                  </td>
                  <td className="py-3 text-text-secondary">
                    <span className="px-2 py-0.5 rounded-md bg-night-900 border border-night-700 text-[10px] font-medium">
                      {categoryLabels[exp.category] || exp.category}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-rose-300">
                    ₡{(exp.amount || 0).toLocaleString('es-CR')}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(exp.id, exp.concept)}
                      className="p-1 rounded text-text-muted hover:text-rose-400 transition-colors"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL REGISTRAR GASTO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Gasto / Egreso"
        subtitle="Agrega compras de bolsas, envíos o mercadería para deducirlos del balance"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4 pb-2">
          <Input
            label="Concepto del Gasto *"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Ej: 50 Bolsas de regalo y cinta dorada"
            required
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Categoría *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-night-800 text-text-primary rounded-xl px-3 py-2.5 text-xs border border-night-600 focus:outline-none focus:border-gold-DEFAULT cursor-pointer"
              >
                <option value="EMPAQUE">Empaques y Cajas</option>
                <option value="ENVIOS">Envíos y Mensajería</option>
                <option value="MERCADERIA">Inventario / Mercadería</option>
                <option value="PUBLICIDAD">Publicidad y Redes</option>
                <option value="LOCAL">Local / Servicios</option>
                <option value="OTRO">Otros Gastos</option>
              </select>
            </div>

            <Input
              label="Monto en Colones (₡) *"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 12000"
              required
            />
          </div>

          <Input
            label="Fecha del Gasto"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <Input
            label="Notas Adicionales (Opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Factura #4589"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-night-700">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              Guardar Gasto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AccountingExpenses;
