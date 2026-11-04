import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import CheckoutStepsIndicator from './subcomponents/CheckoutStepsIndicator';
import CheckoutStep1Customer from './subcomponents/CheckoutStep1Customer';
import CheckoutStep2Payment from './subcomponents/CheckoutStep2Payment';
import CheckoutStep3Confirmation from './subcomponents/CheckoutStep3Confirmation';
import { copyToClipboard } from '../../utils/clipboard';

export const CheckoutModal = ({ isOpen, onClose, storeSettings }) => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const sinpePhone = storeSettings?.sinpePhone || '6465-6625';
  const sinpeClean = sinpePhone.replace(/\D/g, '') || '64656625';
  const sinpeHolder = storeSettings?.sinpeHolder || 'Maureen Vanessa Sanchez Martinez';
  const bacName = storeSettings?.bankName || 'BAC Credomatic (San José)';
  const bacIban = storeSettings?.bankIban || 'CR84010200009659820931';
  const popularName = storeSettings?.popularBankName || 'Banco Popular';
  const popularIban = storeSettings?.popularBankIban || 'CR64016111056166941071';
  const bankHolder = storeSettings?.bankHolder || 'Maureen Vanessa Sanchez Martinez';

  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingMethod, setShippingMethod] = useState('CORREOS_CR');
  const [province, setProvince] = useState('San José');
  const [canton, setCanton] = useState('');
  const [district, setDistrict] = useState('');
  const [details, setDetails] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('SINPE_MOVIL');
  const [voucherNotes, setVoucherNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  const [copiedField, setCopiedField] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploadingVoucher, setIsUploadingVoucher] = useState(false);
  const [voucherSuccess, setVoucherSuccess] = useState(false);

  if (!isOpen) return null;

  let shippingCost = 0;
  if (shippingMethod === 'CORREOS_CR') {
    shippingCost = subtotal >= 35000 ? 0 : 3500;
  } else if (shippingMethod === 'EXPRESS_GAM') {
    shippingCost = 2500;
  } else {
    shippingCost = 0;
  }

  const orderTotal = subtotal + shippingCost;

  const handleCopy = async (text, field) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handleGoToPayment = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Por favor completa todos tus datos personales.');
      return;
    }

    if (shippingMethod !== 'RETIRO_TIENDA') {
      if (!canton.trim() || !district.trim() || !details.trim()) {
        setErrorMessage(
          'Por favor especifica tu cantón, distrito y dirección detallada para el envío.'
        );
        return;
      }
    }

    setStep(2);
  };

  const handleCreateOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingMethod,
        shippingAddress:
          shippingMethod !== 'RETIRO_TIENDA'
            ? {
                province,
                canton: canton.trim(),
                district: district.trim(),
                details: details.trim()
              }
            : undefined,
        paymentMethod,
        notes: notes.trim() || undefined,
        items: items.map((it) => ({
          id: it.productId,
          name: it.name,
          sku: it.sku || 'SH-CR',
          price: it.price,
          quantity: it.quantity,
          image: it.image,
          variantName: it.variantName || undefined
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.message || 'Error al procesar el pedido');
      } else {
        const orderData = data.order || data.data;
        setCreatedOrder(orderData);
        setStep(3);
        clearCart();
      }
    } catch (err) {
      setErrorMessage('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadVoucher = async () => {
    if (!selectedFile || !createdOrder) return;
    setIsUploadingVoucher(true);

    try {
      const formData = new FormData();
      formData.append('voucher', selectedFile);
      if (voucherNotes.trim()) {
        formData.append('notes', voucherNotes.trim());
      }

      const identifier = createdOrder.orderNumber || createdOrder.id;
      const res = await fetch(`/api/orders/${identifier}/voucher`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setVoucherSuccess(true);
      } else {
        alert(data.message || 'Error al subir el comprobante');
      }
    } catch (err) {
      alert('Error de conexión al subir comprobante');
    } finally {
      setIsUploadingVoucher(false);
    }
  };

  const whatsappMessage = createdOrder
    ? encodeURIComponent(
        `¡Hola Sweet Home & Boutique CR! 🌸 Acabo de generar mi pedido *${createdOrder.orderNumber}* por un total de ₡${createdOrder.total.toLocaleString('es-CR')} (${paymentMethod === 'SINPE_MOVIL' ? 'SINPE Móvil' : 'Transferencia Bancaria'}). Adjunto mi comprobante de pago.`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-night-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-gradient-to-b from-night-800 to-night-900 border border-gold-DEFAULT/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Cabecera del Modal */}
        <div className="p-5 sm:p-6 border-b border-night-700/60 flex items-center justify-between bg-night-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/30 flex items-center justify-center text-gold-bright">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
                Finalizar Compra
              </h2>
              <p className="text-xs text-text-secondary">
                Sweet Home & Boutique CR • Pago seguro por SINPE Móvil y Transferencia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-gold-light hover:bg-night-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indicador de Pasos */}
        <CheckoutStepsIndicator step={step} />

        {/* Cuerpo del Modal */}
        <div className="p-5 sm:p-8 overflow-y-auto max-h-[75vh] space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-status-error/15 border border-status-error/30 text-xs text-status-error flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 && (
            <CheckoutStep1Customer
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerPhone={customerPhone}
              setCustomerPhone={setCustomerPhone}
              customerEmail={customerEmail}
              setCustomerEmail={setCustomerEmail}
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              province={province}
              setProvince={setProvince}
              canton={canton}
              setCanton={setCanton}
              district={district}
              setDistrict={setDistrict}
              details={details}
              setDetails={setDetails}
              notes={notes}
              setNotes={setNotes}
              itemsCount={items.length}
              subtotal={subtotal}
              shippingCost={shippingCost}
              orderTotal={orderTotal}
              onSubmit={handleGoToPayment}
              onClose={onClose}
            />
          )}

          {step === 2 && (
            <CheckoutStep2Payment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              sinpePhone={sinpePhone}
              sinpeClean={sinpeClean}
              sinpeHolder={sinpeHolder}
              bacName={bacName}
              bacIban={bacIban}
              popularName={popularName}
              popularIban={popularIban}
              bankHolder={bankHolder}
              orderTotal={orderTotal}
              copiedField={copiedField}
              onCopy={handleCopy}
              onBack={() => setStep(1)}
              onConfirm={handleCreateOrder}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 3 && createdOrder && (
            <CheckoutStep3Confirmation
              createdOrder={createdOrder}
              whatsappMessage={whatsappMessage}
              storeWhatsapp={storeSettings?.whatsapp?.replace(/\D/g, '') || '50664656625'}
              voucherSuccess={voucherSuccess}
              selectedFile={selectedFile}
              filePreview={filePreview}
              voucherNotes={voucherNotes}
              setVoucherNotes={setVoucherNotes}
              isUploadingVoucher={isUploadingVoucher}
              onFileChange={handleFileChange}
              onUploadVoucher={handleUploadVoucher}
              onClose={onClose}
              sinpePhone={sinpePhone}
              sinpeClean={sinpeClean}
              sinpeHolder={sinpeHolder}
              bacName={bacName}
              bacIban={bacIban}
              popularName={popularName}
              popularIban={popularIban}
              bankHolder={bankHolder}
              copiedField={copiedField}
              onCopy={handleCopy}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
