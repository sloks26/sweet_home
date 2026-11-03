import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const ProductInfoTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="mt-10 pt-6 border-t border-night-700/70 space-y-5">
      <div className="flex items-center gap-6 border-b border-night-700/60 pb-2 text-sm font-serif">
        <button
          onClick={() => setActiveTab('description')}
          className={`pb-2 transition-all font-bold ${
            activeTab === 'description'
              ? 'text-gold-light border-b-2 border-gold-bright'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Descripción Detallada
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`pb-2 transition-all font-bold ${
            activeTab === 'shipping'
              ? 'text-gold-light border-b-2 border-gold-bright'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Envíos y Entregas en Costa Rica
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2 transition-all font-bold ${
            activeTab === 'reviews'
              ? 'text-gold-light border-b-2 border-gold-bright'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Opiniones de Clientas ({product.reviewCount || 12})
        </button>
      </div>

      {activeTab === 'description' && (
        <div className="text-xs sm:text-sm text-text-secondary leading-relaxed space-y-3 font-sans">
          <p>{product.description}</p>
          {product.shortDescription && (
            <p className="italic text-gold-light/90">"{product.shortDescription}"</p>
          )}
        </div>
      )}

      {activeTab === 'shipping' && (
        <div className="text-xs text-text-secondary space-y-3 font-sans">
          <p>
            📦 <strong>Correos de Costa Rica:</strong> Entregas en 24 a 48 horas en todo el país. Tarifa plana de ₡2.800 dentro del GAM y ₡3.500 fuera del GAM.
          </p>
          <p>
            🚚 <strong>Mensajería Privada:</strong> Disponible en el Gran Área Metropolitana para entregas el mismo día o al día siguiente.
          </p>
          <p>
            ✨ <strong>Envío Gratis:</strong> En compras superiores a ₡35.000.
          </p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4 font-sans text-xs">
          <div className="p-4 rounded-2xl bg-night-900/60 border border-gold-DEFAULT/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text-primary">Mariana Solano R.</span>
              <span className="text-[10px] text-text-muted">San José, CR</span>
            </div>
            <div className="flex text-gold-bright">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-text-secondary pt-1">
              "¡Me encantó! Llegó super rápido por Correos de Costa Rica y el empaque venía perfumado, se nota el cariño en cada detalle. Totalmente recomendado."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfoTabs;
