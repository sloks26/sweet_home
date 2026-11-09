import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquareHeart,
  Star,
  Check,
  Trash2,
  EyeOff,
  RefreshCw,
  ShoppingBag,
  Store,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export const AdminReviews = ({ onReviewsUpdated }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING'); // PENDING, APPROVED, ALL
  const [processingId, setProcessingId] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApproveToggle = async (item, targetApproved) => {
    setProcessingId(`${item.kind}-${item.id}`);
    try {
      const res = await fetch(`/api/admin/reviews/${item.kind}/${item.id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: targetApproved })
      });
      const data = await res.json();
      if (data.success) {
        await fetchReviews();
        if (onReviewsUpdated) onReviewsUpdated();
      } else {
        alert(data.message || 'Error al actualizar reseña');
      }
    } catch (err) {
      alert('Error de conexión al actualizar la reseña');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (item) => {
    if (
      !window.confirm(
        `¿Estás segura de eliminar permanentemente la reseña de "${item.customerName}"?`
      )
    ) {
      return;
    }

    setProcessingId(`${item.kind}-${item.id}`);
    try {
      const res = await fetch(`/api/admin/reviews/${item.kind}/${item.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        await fetchReviews();
        if (onReviewsUpdated) onReviewsUpdated();
      } else {
        alert(data.message || 'Error al eliminar reseña');
      }
    } catch (err) {
      alert('Error de conexión al eliminar la reseña');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'PENDING') return !r.isApproved;
    if (filter === 'APPROVED') return r.isApproved;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado Ejecutivo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1036] via-[#150A26] to-[#11071F] border border-white/[0.08] border-t-gold-DEFAULT/35 p-5 sm:p-7 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-DEFAULT/15 border border-gold-DEFAULT/35 text-gold-bright text-xs font-semibold mb-1">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>Moderación de Opiniones & Testimonios Reales</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Reseñas de Clientas
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
            Revisa cada opinión enviada por tus clientes antes de publicarla: acepta las reseñas
            positivas para mostrarlas en la tienda o elimina las que no desees publicar.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchReviews}>
          Actualizar
        </Button>
      </div>

      {/* Píldoras de Filtro */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-night-900 border border-gold-DEFAULT/15">
        {[
          {
            id: 'PENDING',
            label: `Por Revisar (${pendingCount})`,
            highlight: pendingCount > 0
          },
          {
            id: 'APPROVED',
            label: `Aceptadas y Visibles (${approvedCount})`
          },
          {
            id: 'ALL',
            label: `Todas (${reviews.length})`
          }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark text-night-950 font-bold shadow-sm'
                : tab.highlight
                  ? 'text-amber-300 hover:bg-night-800'
                  : 'text-text-secondary hover:text-gold-light hover:bg-night-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista de Reseñas */}
      {loading ? (
        <div className="p-12 text-center text-xs text-text-muted">
          Cargando reseñas de clientas...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#140A22] border border-gold-DEFAULT/20 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400/80 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-text-primary">
            {filter === 'PENDING'
              ? 'No tienes reseñas pendientes por revisar'
              : 'No hay reseñas en esta sección todavía'}
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            {filter === 'PENDING'
              ? 'Cuando una clienta envíe una opinión desde la página principal o desde un producto, aparecerá aquí para que decidas si la aceptas o la eliminas.'
              : 'Las reseñas que apruebes se mostrarán automáticamente en la sección "Lo que dicen nuestras clientas" de la tienda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReviews.map((item) => {
            const isPositive = (item.rating || 5) >= 4;
            const isBusy = processingId === `${item.kind}-${item.id}`;

            return (
              <div
                key={`${item.kind}-${item.id}`}
                className={`p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                  !item.isApproved
                    ? 'bg-gradient-to-r from-[#1A0D2E] to-[#140A22] border-amber-400/40 shadow-[0_8px_25px_-8px_rgba(245,158,11,0.2)]'
                    : 'bg-[#140A22] border-white/[0.08] hover:border-gold-DEFAULT/35'
                }`}
              >
                {/* Contenido de la Reseña */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={item.isApproved ? 'success' : 'warning'} size="sm" withDot>
                      {item.isApproved ? 'Publicada en Tienda' : 'Pendiente de Aprobación'}
                    </Badge>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        isPositive
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-400/30'
                      }`}
                    >
                      <span>{isPositive ? 'Positiva' : 'Calificación Baja'}</span>
                      <span>• {item.rating}/5 ★</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] text-gold-light/90 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                      {item.kind === 'PRODUCT' ? (
                        <>
                          <ShoppingBag className="w-3 h-3 text-gold-bright" />
                          <span>Producto: {item.productName}</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-3 h-3 text-gold-bright" />
                          <span>Testimonio General (Portada)</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Estrellas y Autora */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-0.5 text-gold-bright">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (item.rating || 5)
                              ? 'fill-current text-gold-bright'
                              : 'text-night-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-serif text-base font-bold text-text-primary">
                      {item.customerName}
                    </span>
                    <span className="text-xs text-text-secondary">• {item.locationOrEmail}</span>
                    <span className="text-[11px] text-text-muted">
                      •{' '}
                      {new Date(item.createdAt).toLocaleDateString('es-CR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Texto del Comentario */}
                  <p className="text-xs sm:text-sm text-text-primary/95 italic bg-night-950/60 p-3.5 rounded-xl border border-white/[0.05] leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                {/* Botones de Acción (Aceptar / Eliminar) */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                  {!item.isApproved ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Check}
                      disabled={isBusy}
                      onClick={() => handleApproveToggle(item, true)}
                    >
                      Aceptar y Publicar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={EyeOff}
                      disabled={isBusy}
                      onClick={() => handleApproveToggle(item, false)}
                    >
                      Ocultar
                    </Button>
                  )}

                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDelete(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-status-error/40 bg-status-error/10 hover:bg-status-error hover:text-white text-status-error text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                    title="Eliminar reseña permanentemente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
