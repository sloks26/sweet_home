import React, { useState } from 'react';
import { Star, Send, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import Button from '../../ui/Button';

export const ProductInfoTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  // Formulario para dejar reseña del producto
  const [customerName, setCustomerName] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const approvedReviews = Array.isArray(product?.reviews) ? product.reviews : [];

  const handleSubmitProductReview = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !comment.trim()) {
      setErrorMsg('Por favor ingresa tu nombre y tu comentario.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerLocation: customerLocation.trim() || 'Costa Rica',
          rating,
          comment: comment.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        setCustomerName('');
        setCustomerLocation('');
        setRating(5);
        setComment('');
      } else {
        setErrorMsg(data.message || 'No se pudo enviar tu opinión.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión al enviar tu opinión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 pt-6 border-t border-night-700/70 space-y-5">
      <div className="flex flex-wrap items-center gap-6 border-b border-night-700/60 pb-2 text-sm font-serif">
        <button
          onClick={() => setActiveTab('description')}
          className={`pb-2 transition-all font-bold cursor-pointer ${
            activeTab === 'description'
              ? 'text-gold-light border-b-2 border-gold-bright'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Descripción Detallada
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`pb-2 transition-all font-bold cursor-pointer ${
            activeTab === 'shipping'
              ? 'text-gold-light border-b-2 border-gold-bright'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Envíos y Entregas en Costa Rica
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2 transition-all font-bold cursor-pointer ${
            activeTab === 'reviews'
              ? 'text-gold-light border-b-2 border-gold-bright'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Opiniones de Clientas ({approvedReviews.length})
        </button>
      </div>

      {activeTab === 'description' && (
        <div className="text-xs sm:text-sm text-text-secondary leading-relaxed space-y-3 font-sans">
          <p>{product.description}</p>
          {product.shortDescription && (
            <p className="italic text-gold-light/90">&ldquo;{product.shortDescription}&rdquo;</p>
          )}
        </div>
      )}

      {activeTab === 'shipping' && (
        <div className="text-xs text-text-secondary space-y-3 font-sans">
          <p>
            📦 <strong>Correos de Costa Rica:</strong> Entregas de 2 a 4 días hábiles en todo el
            país con número de guía para seguimiento.
          </p>
          <p>
            🚚 <strong>Mensajería Express GAM:</strong> Disponible en el Gran Área Metropolitana
            para entregas de 24 a 48 horas.
          </p>
          <p>
            ✨ <strong>Envío Gratis:</strong> En compras superiores a ₡35.000.
          </p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans text-xs">
          {/* Lista de Reseñas Reales Aprobadas */}
          <div className="lg:col-span-7 space-y-3">
            {approvedReviews.length === 0 ? (
              <div className="p-6 rounded-2xl bg-night-900/60 border border-gold-DEFAULT/20 text-center space-y-2">
                <MessageSquarePlus className="w-6 h-6 text-gold-bright mx-auto opacity-80" />
                <p className="font-semibold text-text-primary text-sm">
                  Aún no hay opiniones publicadas para este producto
                </p>
                <p className="text-text-secondary text-xs">
                  ¿Ya lo compraste? Escribe tu opinión en el formulario adjunto.
                </p>
              </div>
            ) : (
              approvedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-night-900/60 border border-gold-DEFAULT/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">{rev.customerName}</span>
                    <span className="text-[10px] text-text-muted">
                      {rev.customerEmail || 'Costa Rica'}
                    </span>
                  </div>
                  <div className="flex text-gold-bright gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (rev.rating || 5) ? 'fill-current text-gold-bright' : 'text-night-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-text-secondary pt-1 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Formulario para enviar nueva reseña */}
          <div className="lg:col-span-5">
            {submittedSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
                <h4 className="font-serif text-base font-bold text-text-primary">
                  ¡Gracias por tu opinión!
                </h4>
                <p className="text-xs text-text-secondary">
                  Tu reseña ha sido enviada y se mostrará aquí en cuanto sea aprobada por la
                  administración.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(false)}
                  className="text-xs text-gold-bright underline pt-1 cursor-pointer"
                >
                  Escribir otra opinión
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitProductReview}
                className="p-4 rounded-2xl bg-night-900/80 border border-gold-DEFAULT/25 space-y-3"
              >
                <h4 className="font-serif text-sm font-bold text-gold-light">
                  Calificar este producto
                </h4>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-status-error/15 border border-status-error/30 text-status-error text-[11px]">
                    {errorMsg}
                  </div>
                )}

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            active ? 'fill-gold-bright text-gold-bright' : 'text-night-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-[11px] text-text-secondary ml-1.5">{rating}/5</span>
                </div>

                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Tu nombre *"
                  className="w-full rounded-xl bg-night-950 border border-night-700 px-3 py-2 text-xs text-text-primary focus:border-gold-DEFAULT focus:outline-none"
                />

                <input
                  type="text"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  placeholder="Tu provincia o cantón (opcional)"
                  className="w-full rounded-xl bg-night-950 border border-night-700 px-3 py-2 text-xs text-text-primary focus:border-gold-DEFAULT focus:outline-none"
                />

                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="¿Qué te pareció este producto? *"
                  className="w-full rounded-xl bg-night-950 border border-night-700 px-3 py-2 text-xs text-text-primary focus:border-gold-DEFAULT focus:outline-none"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={Send}
                  isLoading={submitting}
                  className="w-full justify-center"
                >
                  Enviar Opinión
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfoTabs;
