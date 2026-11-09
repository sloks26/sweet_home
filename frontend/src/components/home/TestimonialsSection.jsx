import React, { useState, useEffect } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Quote,
  MessageSquarePlus,
  CheckCircle2,
  Send,
  X
} from 'lucide-react';
import Button from '../ui/Button';

export const TestimonialsSection = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Estado del formulario público para dejar reseña
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const list = Array.isArray(testimonials) ? testimonials : [];

  // Autoplay suave cada 6 segundos cuando hay más de 1 reseña real
  useEffect(() => {
    if (isPaused || list.length <= 1 || isFormOpen) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, list.length, isFormOpen]);

  const handlePrev = () => {
    if (list.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNext = () => {
    if (list.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim() || !comment.trim()) {
      setErrorMsg('Por favor completa tu nombre y tu comentario.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientLocation: clientLocation.trim() || 'Costa Rica',
          rating,
          comment: comment.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        setClientName('');
        setClientLocation('');
        setRating(5);
        setComment('');
      } else {
        setErrorMsg(data.message || 'No se pudo enviar tu reseña.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión al enviar tu reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentItem = list[currentIndex] || list[0] || null;

  return (
    <section
      className="w-full bg-[#FDF7FA] text-[#1A0D26] py-20 px-4 sm:px-8 border-b border-[#EEDDE8]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Encabezado */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-galaxy-light uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>Experiencias Reales Sweet Home</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A0D26] tracking-tight">
            Lo que dicen{' '}
            <span className="italic font-normal text-galaxy-DEFAULT">nuestras clientas</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#685B78]">
            Opiniones verificadas de personas reales en Costa Rica que confían en nuestra boutique.
          </p>
        </div>

        {/* Carrusel de Reseñas Aprobadas o Invitación Inicial */}
        <div className="relative max-w-3xl mx-auto">
          {currentItem ? (
            <>
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#EBDCE6] shadow-sm flex flex-col items-center text-center space-y-6 relative overflow-hidden transition-all duration-500">
                <Quote className="w-10 h-10 text-gold-DEFAULT/30" />

                <div className="flex items-center gap-1.5 text-gold-dark">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (currentItem.rating || 5)
                          ? 'fill-current text-gold-dark'
                          : 'text-[#E0D4DC]'
                      }`}
                    />
                  ))}
                </div>

                <p className="font-serif text-base sm:text-xl text-[#3A2C4B] italic leading-relaxed max-w-2xl">
                  &ldquo;{currentItem.comment}&rdquo;
                </p>

                <div className="flex items-center gap-3.5 pt-4 border-t border-[#F2E8F0] w-full justify-center">
                  {currentItem.clientAvatar ? (
                    <img
                      src={currentItem.clientAvatar}
                      alt={currentItem.clientName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-gold-DEFAULT/40 shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2B124C] to-[#1A0B2E] text-gold-light font-serif font-bold text-base flex items-center justify-center border-2 border-gold-DEFAULT/50 shadow-sm shrink-0">
                      {(currentItem.clientName || 'C').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <h3 className="font-serif text-base font-bold text-[#1A0D26]">
                      {currentItem.clientName}
                    </h3>
                    <span className="text-xs text-galaxy-light font-medium block">
                      {currentItem.clientLocation || 'Costa Rica'}
                    </span>
                  </div>
                </div>
              </div>

              {list.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#EBDCE6] text-[#1A0D26] hover:text-galaxy-DEFAULT hover:border-gold-DEFAULT shadow-md flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Testimonio anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#EBDCE6] text-[#1A0D26] hover:text-galaxy-DEFAULT hover:border-gold-DEFAULT shadow-md flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Siguiente testimonio"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="flex items-center justify-center gap-2 pt-6">
                    {list.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          currentIndex === idx
                            ? 'w-6 bg-gold-dark'
                            : 'w-2 bg-[#D9C8D6] hover:bg-gold-DEFAULT/50'
                        }`}
                        aria-label={`Ir al testimonio ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EBDCE6] shadow-sm text-center space-y-3">
              <Quote className="w-9 h-9 text-gold-DEFAULT/40 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#1A0D26]">
                ¿Ya recibiste tu pedido de Sweet Home & Boutique CR?
              </h3>
              <p className="text-xs sm:text-sm text-[#685B78] max-w-lg mx-auto leading-relaxed">
                Aquí solo mostramos reseñas 100% reales de nuestras clientas. ¡Sé la primera en
                compartir tu experiencia con nosotros!
              </p>
            </div>
          )}
        </div>

        {/* Botón y Formulario para que el Cliente Real deje su Reseña */}
        <div className="max-w-2xl mx-auto">
          {submittedSuccess ? (
            <div className="p-6 rounded-3xl bg-white border-2 border-emerald-500/40 shadow-md text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-xl font-bold text-[#1A0D26]">
                ¡Muchas gracias por tu reseña!
              </h4>
              <p className="text-xs sm:text-sm text-[#5A4B69] max-w-md mx-auto">
                Tu comentario fue enviado con éxito y será publicado en nuestra tienda una vez que
                sea revisado por la administración.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmittedSuccess(false);
                  setIsFormOpen(false);
                }}
                className="text-xs font-semibold text-galaxy-DEFAULT hover:underline pt-1 cursor-pointer"
              >
                Cerrar mensaje
              </button>
            </div>
          ) : !isFormOpen ? (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1A0D26] hover:bg-[#2A153D] text-gold-light font-semibold text-xs sm:text-sm shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <MessageSquarePlus className="w-4 h-4 text-gold-bright" />
                <span>Escribir mi Reseña</span>
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmitReview}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2CFE0] shadow-lg space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#F2E8F0] pb-3">
                <div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1A0D26]">
                    Comparte tu experiencia
                  </h4>
                  <p className="text-xs text-[#685B78]">
                    Tu opinión nos ayuda a seguir creciendo y brindando el mejor servicio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-full text-[#685B78] hover:text-[#1A0D26] hover:bg-[#F5ECF3] cursor-pointer"
                  aria-label="Cerrar formulario"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Selector de Estrellas */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3B59]">
                  Tu Calificación
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 cursor-pointer"
                        aria-label={`${star} estrellas`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            active ? 'fill-amber-400 text-amber-500' : 'text-[#D8C9D5]'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-semibold text-[#5A4B69]">
                    {rating} de 5 estrellas
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B59] mb-1">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej: Valeria Morales"
                    className="w-full rounded-xl border border-[#DFCEDA] bg-[#FCF9FB] px-3.5 py-2.5 text-xs text-[#1A0D26] focus:border-gold-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A3B59] mb-1">
                    Cantón o Provincia (Opcional)
                  </label>
                  <input
                    type="text"
                    value={clientLocation}
                    onChange={(e) => setClientLocation(e.target.value)}
                    placeholder="Ej: Heredia, Costa Rica"
                    className="w-full rounded-xl border border-[#DFCEDA] bg-[#FCF9FB] px-3.5 py-2.5 text-xs text-[#1A0D26] focus:border-gold-dark focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B59] mb-1">
                  Tu Comentario *
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuéntanos qué compraste y cómo fue tu experiencia..."
                  className="w-full rounded-xl border border-[#DFCEDA] bg-[#FCF9FB] px-3.5 py-2.5 text-xs text-[#1A0D26] focus:border-gold-dark focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#685B78] hover:bg-[#F5ECF3] cursor-pointer"
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={Send}
                  isLoading={submitting}
                >
                  Enviar Reseña
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
