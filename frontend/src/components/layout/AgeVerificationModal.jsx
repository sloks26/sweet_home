import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAgeGateStore } from '../../store/ageGateStore';
import Button from '../ui/Button';

export const AgeVerificationModal = () => {
  const { isModalOpen, verifyAge, closeModal } = useAgeGateStore();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-night-950/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-gradient-to-b from-night-800 to-night-900 border border-gold-DEFAULT/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-night-700/80 border border-gold-DEFAULT/40 flex items-center justify-center mx-auto text-gold-bright shadow-gold-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-serif font-bold tracking-widest text-gold-bright uppercase block">
                Verificación Requerida • +18 Años
              </span>
              <h3 className="font-serif text-2xl font-bold text-text-primary">Bienestar Íntimo</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Esta sección contiene productos de cuidado y bienestar destinados exclusivamente a
                personas mayores de edad (+18).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-night-900/80 border border-night-600/60 text-[11px] text-text-muted space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-gold-light font-semibold">
                <span>🔒 Política de Discreción Sweet Home:</span>
              </div>
              <p>
                Tus pedidos se entregan en empaques neutros y discretos sin logos ni descripciones
                explícitas para tu absoluta privacidad.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={CheckCircle}
                onClick={verifyAge}
              >
                Soy mayor de 18 años
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-text-secondary"
                icon={ArrowLeft}
                onClick={closeModal}
              >
                Regresar a la tienda
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AgeVerificationModal;
