import React from 'react';
import { Coins } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Modal from '../../ui/Modal';

export const CreateClientModal = ({
  isOpen,
  onClose,
  createType,
  onSubmit,
  isSubmitting,
  formState,
  setFormState
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={createType === 'APARTADO' ? 'Nuevo Apartado / A Pagos' : 'Nuevo Pedido Contra Entrega'}
      subtitle="Registra los datos del cliente, prendas y montos en colones"
    >
      <form onSubmit={onSubmit} className="space-y-4 pb-2">
        <Input
          label="Nombre Completo del Cliente *"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          placeholder="Ej: Laura Castro Vargas"
          required
        />
        <Input
          label="Número de Teléfono / WhatsApp *"
          value={formState.phone}
          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
          placeholder="Ej: 8888-9999"
          required
        />
        <Input
          label="Prendas o Artículos *"
          value={formState.details}
          onChange={(e) => setFormState({ ...formState, details: e.target.value })}
          placeholder="Ej: Vestido Esmeralda M, Set Joyería Oro Rosa"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Monto Total (₡) *"
            type="number"
            value={formState.total}
            onChange={(e) => setFormState({ ...formState, total: e.target.value })}
            placeholder="Ej: 28500"
            required
          />
          {createType === 'APARTADO' ? (
            <Input
              label="Abono Inicial (₡)"
              type="number"
              value={formState.initialPaid}
              onChange={(e) => setFormState({ ...formState, initialPaid: e.target.value })}
              placeholder="Ej: 10000"
            />
          ) : (
            <Input
              label="Fecha de Entrega Estimada"
              type="date"
              value={formState.dueDate}
              onChange={(e) => setFormState({ ...formState, dueDate: e.target.value })}
            />
          )}
        </div>

        {createType === 'APARTADO' && (
          <Input
            label="Fecha Límite para Liquidar"
            type="date"
            value={formState.dueDate}
            onChange={(e) => setFormState({ ...formState, dueDate: e.target.value })}
          />
        )}

        <Input
          label="Notas Adicionales (Opcional)"
          value={formState.notes}
          onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
          placeholder="Ej: Recoge en boutique el sábado"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-night-700">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
            Guardar Registro
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const AddPaymentModal = ({
  isOpen,
  onClose,
  selectedLayaway,
  paymentAmount,
  setPaymentAmount,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Abono a Cuenta"
      subtitle={
        selectedLayaway
          ? `Cliente: ${selectedLayaway.customerName} • Saldo: ₡${(selectedLayaway.remainingAmount || 0).toLocaleString('es-CR')}`
          : ''
      }
    >
      <form onSubmit={onSubmit} className="space-y-4 pb-2">
        <Input
          label="Monto del Abono en Colones (₡) *"
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          placeholder="Ej: 5000"
          required
          autoFocus
        />

        <div className="p-3 rounded-xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 text-xs text-gold-light">
          Al registrar este abono, se incrementará el total de ingresos de la tienda y se descontará del saldo pendiente de la cliente.
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-night-700">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" icon={Coins} isLoading={isSubmitting}>
            Confirmar Abono
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClientModal;
