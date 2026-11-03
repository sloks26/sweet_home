import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../ui/Button';
import ApartadosTable from './ApartadosTable';
import ContraEntregaTable from './ContraEntregaTable';
import { CreateClientModal, AddPaymentModal } from './AccountingClientModals';

export const AccountingClients = ({
  layaways = [],
  onRefresh
}) => {
  const [filterMode, setFilterMode] = useState('both'); // 'both' | 'apartados' | 'contra_entrega'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState('APARTADO');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLayaway, setSelectedLayaway] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    details: '',
    total: '',
    initialPaid: '',
    dueDate: '',
    notes: ''
  });

  const apartados = layaways.filter((l) => l.type === 'APARTADO');
  const contraEntrega = layaways.filter((l) => l.type === 'CONTRA_ENTREGA');

  const pendingApartadosSaldo = apartados.reduce(
    (sum, l) => sum + (l.status !== 'COMPLETED' ? (l.remainingAmount || 0) : 0),
    0
  );
  const pendingContraEntregaSaldo = contraEntrega.reduce(
    (sum, l) => sum + (l.status !== 'COMPLETED' ? (l.totalAmount || 0) : 0),
    0
  );

  const openCreateModal = (type) => {
    setCreateType(type);
    setFormState({
      name: '',
      phone: '',
      details: '',
      total: '',
      initialPaid: '',
      dueDate: '',
      notes: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.phone || !formState.total) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/layaways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formState.name,
          customerPhone: formState.phone,
          productDetails: formState.details || 'Artículos varios',
          totalAmount: parseFloat(formState.total),
          paidAmount: parseFloat(formState.initialPaid) || 0,
          type: createType,
          dueDate: formState.dueDate || null,
          notes: formState.notes || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Error al guardar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddPaymentModal = (layaway) => {
    setSelectedLayaway(layaway);
    setPaymentAmount('');
    setIsPaymentModalOpen(true);
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!selectedLayaway || !paymentAmount || Number(paymentAmount) <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/layaways/${selectedLayaway.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(paymentAmount) })
      });
      const data = await res.json();
      if (data.success) {
        setIsPaymentModalOpen(false);
        if (onRefresh) onRefresh();
      } else {
        alert(data.message || 'Error al abonar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsCompleted = async (item) => {
    try {
      const res = await fetch(`/api/admin/layaways/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED', paidAmount: item.totalAmount })
      });
      const data = await res.json();
      if (data.success && onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRecord = async (id, name) => {
    if (!window.confirm(`¿Segura(o) que deseas eliminar el registro de ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/layaways/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCleanPhone = (phone) => {
    const digits = (phone || '').replace(/\D/g, '');
    return digits.length === 8 ? `506${digits}` : digits;
  };

  const getApartadoWhatsAppLink = (item) => {
    const phone = formatCleanPhone(item.customerPhone);
    const msg = `¡Hola ${item.customerName}! 💕 Te saludamos de Sweet Home & Boutique CR ✨. Te recordamos tu apartado de "${item.productDetails}". Tienes un saldo de ₡${(item.remainingAmount || 0).toLocaleString('es-CR')}. Puedes abonar por SINPE Móvil al 6465-6625 (Maureen Sanchez). ¡Estamos a tu orden! 🌸`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const getContraEntregaWhatsAppLink = (item) => {
    const phone = formatCleanPhone(item.customerPhone);
    const msg = `¡Hola ${item.customerName}! 💕 Te saludamos de Sweet Home & Boutique CR ✨. Tu pedido contra entrega de "${item.productDetails}" por ₡${(item.totalAmount || 0).toLocaleString('es-CR')} está listo. ¿Nos confirmas para coordinar la entrega? ¡Muchas gracias! 🌸`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6">
      {/* BARRA SUPERIOR DE CONTROL */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/25 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-text-primary">
            Control de Clientes: A Pagos y Contra Entrega
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Ambas listas visibles simultáneamente en pantalla para gestionar apartados y entregas sin perder ningún cliente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Vista: Ver Ambos | Solo Apartados | Solo Contra Entrega */}
          <div className="flex rounded-xl bg-night-950 p-1 border border-night-700 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('both')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === 'both'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Ver Ambos
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('apartados')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === 'apartados'
                  ? 'bg-amber-500 text-night-950 font-bold shadow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              A Pagos ({apartados.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('contra_entrega')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === 'contra_entrega'
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Contra Entrega ({contraEntrega.length})
            </button>
          </div>

          {/* Botones Rápidos de Nuevo Registro */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => openCreateModal('APARTADO')}
            >
              + Apartado
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => openCreateModal('CONTRA_ENTREGA')}
              className="border-sky-500/40 text-sky-300 hover:bg-sky-500/15"
            >
              + Contra Entrega
            </Button>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: CLIENTES A PAGOS / APARTADOS */}
      {(filterMode === 'both' || filterMode === 'apartados') && (
        <ApartadosTable
          apartados={apartados}
          pendingSaldo={pendingApartadosSaldo}
          onOpenCreate={() => openCreateModal('APARTADO')}
          onOpenPayment={openAddPaymentModal}
          onDelete={handleDeleteRecord}
          formatCleanPhone={formatCleanPhone}
          getWhatsAppLink={getApartadoWhatsAppLink}
        />
      )}

      {/* SECCIÓN 2: PEDIDOS CONTRA ENTREGA */}
      {(filterMode === 'both' || filterMode === 'contra_entrega') && (
        <ContraEntregaTable
          contraEntrega={contraEntrega}
          pendingSaldo={pendingContraEntregaSaldo}
          onOpenCreate={() => openCreateModal('CONTRA_ENTREGA')}
          onMarkAsCompleted={handleMarkAsCompleted}
          onDelete={handleDeleteRecord}
          formatCleanPhone={formatCleanPhone}
          getWhatsAppLink={getContraEntregaWhatsAppLink}
        />
      )}

      {/* MODALES REUTILIZABLES */}
      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        createType={createType}
        onSubmit={handleCreateRecord}
        isSubmitting={isSubmitting}
        formState={formState}
        setFormState={setFormState}
      />

      <AddPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedLayaway={selectedLayaway}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        onSubmit={handleAddPayment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AccountingClients;
