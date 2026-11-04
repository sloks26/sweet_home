import React from 'react';
import { User, Truck, MapPin, ArrowRight } from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

export const CR_PROVINCES = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón'
];

export const CheckoutStep1Customer = ({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerEmail,
  setCustomerEmail,
  shippingMethod,
  setShippingMethod,
  province,
  setProvince,
  canton,
  setCanton,
  district,
  setDistrict,
  details,
  setDetails,
  notes,
  setNotes,
  itemsCount,
  subtotal,
  shippingCost,
  orderTotal,
  onSubmit,
  onClose
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Información Personal */}
      <div className="space-y-3.5">
        <h3 className="font-serif text-base font-bold text-gold-light flex items-center gap-2">
          <User className="w-4 h-4 text-gold-bright" />
          <span>Información de Contacto</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <Input
              label="Nombre y Apellidos"
              placeholder="Ej: Marielos Vargas Fonseca"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Teléfono Celular (SINPE / WhatsApp)"
              placeholder="8888-8888"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="cliente@ejemplo.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Método de Entrega */}
      <div className="space-y-3.5 pt-2">
        <h3 className="font-serif text-base font-bold text-gold-light flex items-center gap-2">
          <Truck className="w-4 h-4 text-gold-bright" />
          <span>Método de Entrega en Costa Rica</span>
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Opción 1: Correos de Costa Rica */}
          <label
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              shippingMethod === 'CORREOS_CR'
                ? 'bg-night-700/80 border-gold-DEFAULT text-text-primary shadow-sm'
                : 'bg-night-900/60 border-night-700 text-text-secondary hover:border-night-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value="CORREOS_CR"
                checked={shippingMethod === 'CORREOS_CR'}
                onChange={() => setShippingMethod('CORREOS_CR')}
                className="text-gold-DEFAULT focus:ring-gold-DEFAULT"
              />
              <div>
                <div className="font-semibold text-xs text-text-primary flex items-center gap-2">
                  <span>Correos de Costa Rica</span>
                  {subtotal >= 35000 && (
                    <span className="px-2 py-0.5 rounded-full bg-status-success/20 text-status-success text-[10px] font-bold">
                      ¡Envío Gratis!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Entrega a todo el país (2 a 4 días hábiles) con número de guía
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-gold-light">
              {subtotal >= 35000 ? '₡0 (Gratis)' : '₡3,500'}
            </span>
          </label>

          {/* Opción 2: Express GAM */}
          <label
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              shippingMethod === 'EXPRESS_GAM'
                ? 'bg-night-700/80 border-gold-DEFAULT text-text-primary shadow-sm'
                : 'bg-night-900/60 border-night-700 text-text-secondary hover:border-night-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value="EXPRESS_GAM"
                checked={shippingMethod === 'EXPRESS_GAM'}
                onChange={() => setShippingMethod('EXPRESS_GAM')}
                className="text-gold-DEFAULT focus:ring-gold-DEFAULT"
              />
              <div>
                <div className="font-semibold text-xs text-text-primary">
                  Mensajería Express GAM
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  San José, Alajuela, Heredia y Cartago central (24 a 48 hrs)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-gold-light">₡2,500</span>
          </label>

          {/* Opción 3: Retiro en Tienda */}
          <label
            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              shippingMethod === 'RETIRO_TIENDA'
                ? 'bg-night-700/80 border-gold-DEFAULT text-text-primary shadow-sm'
                : 'bg-night-900/60 border-night-700 text-text-secondary hover:border-night-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value="RETIRO_TIENDA"
                checked={shippingMethod === 'RETIRO_TIENDA'}
                onChange={() => setShippingMethod('RETIRO_TIENDA')}
                className="text-gold-DEFAULT focus:ring-gold-DEFAULT"
              />
              <div>
                <div className="font-semibold text-xs text-text-primary">
                  Retiro en Tienda Física
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Coordina la recogida sin costo adicional en nuestro local
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-status-success">₡0</span>
          </label>
        </div>
      </div>

      {/* Dirección de Envío si aplica */}
      {shippingMethod !== 'RETIRO_TIENDA' && (
        <div className="space-y-3.5 pt-2">
          <h3 className="font-serif text-base font-bold text-gold-light flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-bright" />
            <span>Dirección de Destino</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Provincia
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-night-900 text-text-primary rounded-xl px-3 py-2 text-xs border border-night-600 focus:outline-none focus:border-gold-DEFAULT"
              >
                {CR_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Cantón"
                placeholder="Ej: Desamparados"
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Distrito"
                placeholder="Ej: San Rafael"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Input
              label="Dirección Exacta y Señas"
              placeholder="De la iglesia 150m norte, casa portón blanco con rejas negras..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {/* Notas del Pedido */}
      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Notas adicionales para el empaque o dedicatoria de regalo (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Ej: Es para un regalo de cumpleaños de mi mamá, incluir tarjeta..."
          className="w-full bg-night-900 text-text-primary rounded-xl p-3 text-xs border border-night-600 focus:outline-none focus:border-gold-DEFAULT resize-none placeholder:text-text-muted/60"
        />
      </div>

      {/* Resumen de Montos */}
      <div className="p-4 rounded-2xl bg-night-950/70 border border-gold-DEFAULT/20 space-y-2 text-xs">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal de Artículos ({itemsCount})</span>
          <span className="font-semibold text-text-primary">
            ₡{subtotal.toLocaleString('es-CR')}
          </span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Costo de Envío</span>
          <span className="font-semibold text-text-primary">
            {shippingCost === 0 ? (
              <span className="text-status-success font-bold">¡Gratis!</span>
            ) : (
              `₡${shippingCost.toLocaleString('es-CR')}`
            )}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold text-text-primary pt-2 border-t border-night-700">
          <span>Total a Pagar</span>
          <span className="text-gold-gradient text-lg">₡{orderTotal.toLocaleString('es-CR')}</span>
        </div>
      </div>

      {/* Botón Siguiente */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          Seguir Comprando
        </Button>
        <Button type="submit" variant="primary" size="md" iconRight={ArrowRight}>
          Continuar al Pago
        </Button>
      </div>
    </form>
  );
};

export default CheckoutStep1Customer;
