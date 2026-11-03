import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, ShieldCheck, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export const FullStoryModal = ({ isOpen, onClose, storyData }) => {
  if (!isOpen) return null;

  const defaultStory = {
    title: 'Nuestra Historia Completa',
    subtitle: 'El sueño y la pasión que dan vida a Sweet Home & Boutique CR',
    founderName: 'Fundadora & Directora Creativa',
    founderRole: 'Sweet Home & Boutique CR',
    founderPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
  };

  const data = storyData || defaultStory;

  const values = [
    { title: 'Amor en Cada Detalle', desc: 'Preparamos, perfumamos e inspeccionamos cada paquete a mano con dedicación artesanal.', icon: Heart },
    { title: 'Calidad Premium Seleccionada', desc: 'No vendemos nada que no pondríamos con orgullo en nuestro propio hogar.', icon: ShieldCheck },
    { title: 'Cercanía y Confianza Tica', desc: 'Atención cálida y directa por WhatsApp, pagos seguros por SINPE y entregas puntuales.', icon: Truck },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-night-950/90 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-night-800 via-night-900 to-night-950 border border-gold-DEFAULT/35 rounded-3xl overflow-hidden shadow-2xl z-10 my-8 p-6 sm:p-10 space-y-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-night-700/60 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gold-bright uppercase tracking-wider block">
                Sobre Nosotros
              </span>
              <h2 className="font-script text-4xl sm:text-5xl text-gold-gradient">
                Sweet Home & Boutique CR
              </h2>
              <p className="font-serif text-sm text-text-secondary italic">
                "Donde cada detalle ilumina tu hogar y tu estilo"
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-night-900/80 text-text-secondary hover:text-gold-light hover:bg-night-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Relato Extendido */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-gold-DEFAULT/30 shadow-lg aspect-[3/4] bg-night-950">
                <img
                  src={data.founderPhoto}
                  alt={data.founderName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-4 font-serif text-sm sm:text-base text-text-secondary leading-relaxed">
              <p>
                Todo comenzó en una tarde costarricense, entre aromas a café y el deseo de crear un espacio donde las personas pudieran encontrar detalles especiales que llenaran sus hogares de luz, armonía y distinción.
              </p>
              <p>
                Con el paso del tiempo y escuchando a nuestras clientas, Sweet Home evolucionó para convertirse en una boutique integral: no solo cuidamos tu sala o tu dormitorio con difusores y textiles suaves, sino que también realzamos tu belleza personal con fragancias exclusivas, moda y accesorios seleccionados a mano.
              </p>
              <p>
                Hoy operamos como una tienda física y boutique virtual con envíos directos a las 7 provincias de Costa Rica. Nuestro mayor orgullo es recibir los mensajes de alegría de cada clienta cuando abre su caja y siente el aroma y el cariño con el que fue preparada.
              </p>
            </div>
          </div>

          {/* Valores de la Marca */}
          <div className="space-y-4 pt-4 border-t border-night-700/60">
            <h3 className="font-serif text-2xl font-bold text-text-primary text-center">
              Nuestros Valores
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-night-800/80 border border-gold-DEFAULT/20 space-y-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-gold-DEFAULT/15 text-gold-bright flex items-center justify-center mx-auto">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-base font-semibold text-text-primary">
                      {val.title}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Call to Action */}
          <div className="pt-4 border-t border-night-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[13px] text-text-secondary font-medium">
              Sweet Home & Boutique CR • San José, Costa Rica
            </span>
            <Button
              variant="primary"
              size="md"
              icon={ShoppingBag}
              onClick={onClose}
            >
              Explorar la Boutique
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FullStoryModal;
