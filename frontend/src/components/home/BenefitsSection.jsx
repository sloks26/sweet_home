import React from 'react';
import { Truck, Smartphone, MessageCircle, Heart } from 'lucide-react';

export const BenefitsSection = () => {
  const benefits = [
    {
      title: 'Envíos a Todo Costa Rica',
      desc: 'Entregas seguras por Correos de Costa Rica y mensajería express en el GAM. Envío gratis en compras mayores a ₡35,000.',
      icon: Truck
    },
    {
      title: 'Pago con SINPE Móvil Oficial',
      desc: 'Paga directo con SINPE Móvil o transferencia bancaria, de forma simple, inmediata y segura.',
      icon: Smartphone
    },
    {
      title: 'Asesoría Cálida por WhatsApp',
      desc: 'Te ayudamos con cariño sobre aromas, medidas, disponibilidad y sugerencias de regalos para tus fechas especiales.',
      icon: MessageCircle
    },
    {
      title: 'Empaque Hecho con Amor',
      desc: 'Cada compra es empacada a mano, perfumada con nuestra esencia insignia y sellada con un detalle especial.',
      icon: Heart
    }
  ];

  return (
    <section className="w-full bg-[#FBF6F0] text-[#1A0D26] py-16 px-4 sm:px-8 border-y border-[#EAE0D5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y sm:divide-y-0 lg:divide-x divide-[#E8DDD2]">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center text-center space-y-3 px-4 ${idx !== 0 ? 'pt-6 sm:pt-0' : ''}`}
            >
              {/* Ícono Lineal Dorado Fino */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-light/25 via-gold-DEFAULT/15 to-transparent border border-gold-DEFAULT/40 flex items-center justify-center text-[#B8860B] shadow-sm mb-1">
                <Icon className="w-7 h-7 stroke-[1.75]" />
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#160826] tracking-tight">
                {b.title}
              </h3>

              <p className="text-[15px] text-[#453755] leading-relaxed max-w-xs font-sans">
                {b.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BenefitsSection;
