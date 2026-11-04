import React from 'react';
import { Truck, Sparkles, MapPin } from 'lucide-react';
import Input from '../../ui/Input';

/**
 * Sección configurable de Políticas y Tarifas de Envío en Costa Rica
 * Permite a la clienta (Vanessa/Jendry) ajustar montos de GAM, Correos y Envío Gratis en vivo.
 */
export const ShippingSettingsSection = ({
  shippingExpressGamCost,
  setShippingExpressGamCost,
  shippingExpressGamDesc,
  setShippingExpressGamDesc,
  shippingCorreosCost,
  setShippingCorreosCost,
  shippingCorreosDesc,
  setShippingCorreosDesc,
  freeShippingThreshold,
  setFreeShippingThreshold,
  pickupNote,
  setPickupNote,
  setIsDirty
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#140A22] border border-gold-DEFAULT/25 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-night-700/60 pb-3">
        <h3 className="font-serif text-lg font-bold text-text-primary flex items-center gap-2">
          <Truck className="w-5 h-5 text-gold-bright" />
          <span>Tarifas y Zonas de Envío en Costa Rica</span>
        </h3>
        <span className="text-[11px] text-text-muted">
          Se refleja en tiempo real en el Carrito y Checkout
        </span>
      </div>

      {/* Grid de Configuración de Envíos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Mensajería Express GAM */}
        <div className="p-4 rounded-xl bg-night-900/80 border border-night-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-bright uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              1. Mensajería Express GAM
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              Urbano / Rápido
            </span>
          </div>

          <Input
            label="Tarifa GAM en Colones (₡)"
            value={shippingExpressGamCost}
            onChange={(e) => {
              setShippingExpressGamCost(e.target.value);
              setIsDirty(true);
            }}
            placeholder="2500"
            required
          />

          <Input
            label="Zonas y Tiempo de Entrega GAM"
            value={shippingExpressGamDesc}
            onChange={(e) => {
              setShippingExpressGamDesc(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Ej: San José, Alajuela, Heredia y Cartago central (24 a 48 hrs)"
            required
          />
        </div>

        {/* 2. Correos de Costa Rica */}
        <div className="p-4 rounded-xl bg-night-900/80 border border-night-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-bright uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              2. Correos de Costa Rica
            </span>
            <span className="text-[10px] text-sky-400 font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30">
              Nacional / Provincias
            </span>
          </div>

          <Input
            label="Tarifa Correos en Colones (₡)"
            value={shippingCorreosCost}
            onChange={(e) => {
              setShippingCorreosCost(e.target.value);
              setIsDirty(true);
            }}
            placeholder="3500"
            required
          />

          <Input
            label="Zonas y Tiempo de Entrega Correos"
            value={shippingCorreosDesc}
            onChange={(e) => {
              setShippingCorreosDesc(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Ej: Entrega a todo el país (2 a 4 días hábiles) con número de guía"
            required
          />
        </div>

        {/* 3. Umbral de Envío Gratis */}
        <div className="p-4 rounded-xl bg-night-900/80 border border-night-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-bright uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              3. Beneficio de Envío Gratis
            </span>
          </div>

          <Input
            label="Monto Mínimo de Compra (en Colones ₡)"
            value={freeShippingThreshold}
            onChange={(e) => {
              setFreeShippingThreshold(e.target.value);
              setIsDirty(true);
            }}
            placeholder="35000"
            required
          />
          <p className="text-[10px] text-text-muted">
            Pedidos que alcancen este subtotal recibirán envío gratis automáticamente en el checkout.
          </p>
        </div>

        {/* 4. Retiro en Tienda */}
        <div className="p-4 rounded-xl bg-night-900/80 border border-night-700 space-y-3">
          <span className="text-xs font-bold text-gold-bright uppercase tracking-wider block">
            4. Retiro en Tienda Física (Siempre ₡0)
          </span>

          <Input
            label="Instrucciones para Retiro"
            value={pickupNote}
            onChange={(e) => {
              setPickupNote(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Ej: Previa coordinación por WhatsApp"
            required
          />
          <p className="text-[10px] text-text-muted">
            Mensaje informativo que verá la clienta si selecciona retirar el paquete en local.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingSettingsSection;
