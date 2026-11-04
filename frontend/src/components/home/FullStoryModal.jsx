import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Heart,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Star,
  Users,
  Compass,
  Gift,
  Smile
} from 'lucide-react';
import Button from '../ui/Button';

export const FullStoryModal = ({ isOpen, onClose, storyData }) => {
  if (!isOpen) return null;

  const defaultStory = {
    title: 'Nuestra Historia, Misión y Valores',
    subtitle: 'Donde cada detalle ilumina tu hogar y tu estilo',
    founderName: 'Fundadora & Directora Creativa',
    founderRole: 'Sweet Home & Boutique CR',
    founderPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
  };

  const data = storyData || defaultStory;

  const pilares = [
    { title: 'Productos de Calidad', desc: 'Que hacen la diferencia en cada rincón.' },
    { title: 'Variedad Integral', desc: 'Para tu hogar, tu estilo y tu bienestar íntimo.' },
    { title: 'Atención Personalizada', desc: 'Trato cercano, amable y asesoría con amor.' },
    { title: 'Envíos Seguros', desc: 'Entregas confiables y cuidadosas a todo el país.' },
    { title: 'Detalles que Iluminan', desc: 'Pequeños toques que transforman tu día a día.' }
  ];

  const valores = [
    { name: 'Calidad', desc: 'Seleccionamos con cuidado productos de excelente calidad para ti.' },
    {
      name: 'Confianza',
      desc: 'Construimos relaciones basadas en la confianza, honestidad y respeto.'
    },
    { name: 'Atención', desc: 'Te brindamos un trato cercano, amable y personalizado.' },
    {
      name: 'Compromiso',
      desc: 'Nos comprometemos a ofrecerte una experiencia segura y satisfactoria.'
    },
    { name: 'Pasión', desc: 'Amamos lo que hacemos y ponemos el corazón en cada detalle.' },
    { name: 'Inspiración', desc: 'Queremos inspirarte a crear un hogar que refleje tu esencia.' },
    { name: 'Empoderamiento', desc: 'Celebramos tu belleza, tu estilo y tu esencia única.' },
    {
      name: 'Bienestar Íntimo',
      desc: 'Promovemos tu bienestar integral con productos que te hacen sentir bien.'
    },
    { name: 'Detalles', desc: 'Creemos que los pequeños detalles hacen grandes momentos.' },
    { name: 'Comunidad', desc: 'Somos más que una tienda, somos una comunidad que crece contigo.' }
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
          className="relative w-full max-w-4xl bg-gradient-to-b from-night-800 via-night-900 to-night-950 border border-gold-DEFAULT/35 rounded-3xl overflow-hidden shadow-2xl z-10 my-8 p-6 sm:p-10 space-y-8 max-h-[90vh] overflow-y-auto"
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
              className="p-2 rounded-xl bg-night-900/80 text-text-secondary hover:text-gold-light hover:bg-night-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Misión y ¿Quiénes Somos? */}
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
              <div className="p-4 rounded-2xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/25 text-gold-light space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-bright block font-sans">
                  Nuestra Misión
                </span>
                <p className="text-sm font-sans leading-relaxed">
                  Brindar productos de calidad que hagan tu vida más fácil, bonita y especial.
                  Inspiramos tu hogar, realzamos tu belleza, tu estilo y cuidamos tu bienestar
                  íntimo. Creemos firmemente que cada detalle tiene el poder de transformar tu día a
                  día.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-text-primary">¿Quiénes Somos?</h3>
                <p>
                  Somos tu tienda de confianza, donde encontrarás productos seleccionados con amor
                  para el hogar, la belleza, tu estilo y tu bienestar íntimo. Creemos que cada
                  detalle cuenta y tiene el poder de transformar tu día a día.
                </p>
                <p>
                  Desde San José con envíos a todo Costa Rica, cuidamos cada paquete para que al
                  abrirlo sientas la dedicación y el cariño con el que fue preparado.
                </p>
              </div>
            </div>
          </div>

          {/* En Sweet Home & Boutique CR Encontrarás */}
          <div className="space-y-4 pt-4 border-t border-night-700/60">
            <h3 className="font-serif text-2xl font-bold text-text-primary text-center">
              En Sweet Home & Boutique CR Encontrarás:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pilares.map((pil, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-night-800/70 border border-gold-DEFAULT/15 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-gold-bright shrink-0" />
                    <span className="font-semibold text-xs text-text-primary">{pil.title}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-snug">{pil.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 10 Valores de la Marca */}
          <div className="space-y-4 pt-4 border-t border-night-700/60">
            <h3 className="font-serif text-2xl font-bold text-text-primary text-center">
              Nuestros 10 Valores Fundamentales
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {valores.map((val, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-night-800/80 border border-gold-DEFAULT/20 text-center flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-gold-light uppercase tracking-wider block mb-1">
                    {val.name}
                  </span>
                  <p className="text-[10px] text-text-secondary leading-tight">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Call to Action */}
          <div className="pt-4 border-t border-night-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-xs text-gold-light font-semibold">
                Gracias por ser parte de nuestra familia 💖
              </div>
              <div className="text-[11px] text-text-muted italic">
                Tu hogar, tu estilo, tu esencia.
              </div>
            </div>
            <Button variant="primary" size="md" icon={ShoppingBag} onClick={onClose}>
              Explorar la Boutique
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FullStoryModal;
