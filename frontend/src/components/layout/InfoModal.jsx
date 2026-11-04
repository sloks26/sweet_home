import React from 'react';
import { motion } from 'framer-motion';
import { X, Truck, HelpCircle, FileText, Lock, MessageCircle } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose, topic = 'envios', storeSettings }) => {
  if (!isOpen) return null;

  const sinpePhone = storeSettings?.sinpePhone || '6465-6625';
  const sinpeHolder = storeSettings?.sinpeHolder || 'Maureen Vanessa Sanchez Martinez';
  const bankHolder = storeSettings?.bankHolder || 'Maureen Vanessa Sanchez Martinez';
  const bacName = storeSettings?.bankName || 'BAC Credomatic (San José)';
  const bacIban = storeSettings?.bankIban || 'CR84010200009659820931';
  const popularName = storeSettings?.popularBankName || 'Banco Popular';
  const popularIban = storeSettings?.popularBankIban || 'CR64016111056166941071';
  const freeThreshold = storeSettings?.freeShippingThreshold
    ? `₡${Number(storeSettings.freeShippingThreshold).toLocaleString('es-CR')}`
    : '₡35,000';
  const correosCostText = storeSettings?.shippingCorreosCost
    ? `₡${Number(storeSettings.shippingCorreosCost).toLocaleString('es-CR')}`
    : '₡3,500';
  const gamCostText = storeSettings?.shippingExpressGamCost
    ? `₡${Number(storeSettings.shippingExpressGamCost).toLocaleString('es-CR')}`
    : '₡2,500';
  const gamDescText =
    storeSettings?.shippingExpressGamDesc ||
    'Cobertura en zonas centrales de San José, Heredia, Alajuela y Cartago.';
  const whatsappClean = (storeSettings?.whatsapp || '50664656625').replace(/\D/g, '');
  const pickupNote = storeSettings?.pickupNote || 'Previa confirmación de pago por WhatsApp';

  const INFO_CONTENT = {
    envios: {
      title: 'Envíos y Entregas en Costa Rica',
      icon: Truck,
      content: (
        <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
          <p>
            En <strong className="text-text-primary">Sweet Home & Boutique CR</strong> nos
            aseguramos de que cada paquete viaje protegido y con la mejor presentación hasta la
            puerta de tu hogar o lugar de trabajo.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-night-950/80 border border-gold-DEFAULT/25 space-y-1">
              <span className="font-semibold text-gold-bright block text-sm">
                Correos de Costa Rica (Todo el País)
              </span>
              <p>
                • Tarifa estándar: {correosCostText} colones para cualquier provincia.
                <br />• <strong className="text-status-success">¡Envío GRATIS!</strong> en todas las
                compras de {freeThreshold} o más.
                <br />
                • Plazo de entrega: de 2 a 4 días hábiles una vez confirmado el pago.
                <br />• Te compartimos tu número de guía para que rastrees tu paquete directamente
                en correos.go.cr.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-night-950/80 border border-gold-DEFAULT/25 space-y-1">
              <span className="font-semibold text-gold-bright block text-sm">
                Mensajería Express GAM
              </span>
              <p>
                • Tarifa: {gamCostText} colones.
                <br />
                • {gamDescText}
                <br />• Entrega rápida en 24 a 48 horas hábiles.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-night-950/80 border border-gold-DEFAULT/25 space-y-1">
              <span className="font-semibold text-gold-bright block text-sm">
                Retiro en Tienda Física (Sweet Home CR)
              </span>
              <p>
                • Costo: ₡0 (Totalmente gratuito).
                <br />• {pickupNote}.
              </p>
            </div>
          </div>
        </div>
      )
    },
    faq: {
      title: 'Preguntas Frecuentes',
      icon: HelpCircle,
      content: (
        <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-night-950/80 border border-night-700 space-y-1">
            <strong className="text-text-primary block text-sm">
              ¿Cómo realizo el pago por SINPE Móvil?
            </strong>
            <p>
              Al finalizar tu compra en el checkout, selecciona SINPE Móvil y transfiere el monto
              exacto al número <strong className="text-gold-bright font-mono">{sinpePhone}</strong>{' '}
              a nombre de <strong className="text-text-primary">{sinpeHolder}</strong>. Luego
              adjunta tu comprobante por WhatsApp o en la misma web.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-night-950/80 border border-night-700 space-y-1">
            <strong className="text-text-primary block text-sm">
              ¿Tienen número de cuenta IBAN bancaria?
            </strong>
            <p>
              Sí, contamos con cuentas en colones:{' '}
              <strong className="text-gold-bright font-mono">
                {bacName}: {bacIban}
              </strong>{' '}
              y{' '}
              <strong className="text-gold-bright font-mono">
                {popularName}: {popularIban}
              </strong>{' '}
              a nombre de <strong className="text-text-primary">{bankHolder}</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-night-950/80 border border-night-700 space-y-1">
            <strong className="text-text-primary block text-sm">
              ¿Los paquetes incluyen empaque de regalo?
            </strong>
            <p>
              ¡Sí! Todos nuestros envíos se preparan con papel seda, lazo de satín y perfume
              insignia. Si deseas una tarjeta con dedicatoria personalizada, puedes indicárnoslo en
              las notas de tu pedido sin costo extra.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-night-950/80 border border-night-700 space-y-1">
            <strong className="text-text-primary block text-sm">
              ¿Los productos de Bienestar Íntimo son discretos?
            </strong>
            <p>
              Absolutamente. Se envían en cajas rígidas totalmente selladas y opacas, sin ninguna
              etiqueta o mención externa sobre el contenido, garantizando tu total privacidad.
            </p>
          </div>
        </div>
      )
    },
    terminos: {
      title: 'Términos y Condiciones',
      icon: FileText,
      content: (
        <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
          <p>
            Bienvenido a Sweet Home & Boutique CR. Al realizar compras en nuestra plataforma aceptas
            nuestras políticas de venta transparente y entrega garantizada en el territorio
            costarricense.
          </p>
          <p>
            1. <strong>Precios y Moneda:</strong> Todos los precios están expresados en colones
            costarricenses (₡).
            <br />
            2. <strong>Confirmación de Pedidos:</strong> Los pedidos quedan en estado pendiente
            hasta la verificación manual del comprobante de SINPE Móvil o Transferencia Bancaria.
            <br />
            3. <strong>Disponibilidad de Inventario:</strong> Los productos se reservan por un plazo
            máximo de 24 horas a la espera del comprobante de pago.
            <br />
            4. <strong>Garantía de Satisfacción:</strong> Si un artículo presenta defecto de fábrica
            al momento de la entrega, te lo reemplazamos o reintegramos de inmediato coordinando por
            nuestro WhatsApp oficial.
          </p>
        </div>
      )
    },
    privacidad: {
      title: 'Política de Privacidad',
      icon: Lock,
      content: (
        <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
          <p>
            En Sweet Home & Boutique CR respetamos y protegemos la privacidad de nuestras clientas.
            Tus datos personales (nombre, teléfono, correo y dirección de entrega) son utilizados
            exclusivamente para coordinar el despacho de tus paquetes y brindarte asesoría de
            compra.
          </p>
          <p>
            No compartimos ni comercializamos tu información con terceros bajo ninguna
            circunstancia. Toda la comunicación de pago se maneja de forma segura y directa por
            canales oficiales.
          </p>
        </div>
      )
    }
  };

  const currentTopic = INFO_CONTENT[topic] || INFO_CONTENT.envios;
  const Icon = currentTopic.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-night-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-gradient-to-b from-night-800 to-night-900 border border-gold-DEFAULT/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        <div className="p-5 sm:p-6 border-b border-night-700/60 flex items-center justify-between bg-night-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 flex items-center justify-center text-gold-bright">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
                {currentTopic.title}
              </h2>
              <p className="text-xs text-text-secondary">Sweet Home & Boutique CR • Costa Rica</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-gold-light hover:bg-night-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh]">
          {currentTopic.content}

          <div className="pt-6 mt-6 border-t border-night-700/60 flex items-center justify-between">
            <a
              href={`https://wa.me/${whatsappClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-status-success hover:underline flex items-center gap-1.5 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>¿Tienes dudas? Escríbenos por WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-night-800 text-gold-light text-xs font-semibold hover:bg-night-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoModal;
