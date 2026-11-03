import React from 'react';

/**
 * Fondo Galaxia Estático de Alto Rendimiento
 * - Sin loops de animación ni requestAnimationFrame
 * - Sin filtros blur pesados en capas fixed
 * - Cero impacto en CPU y GPU, permitiendo 60fps constantes en móviles
 */
export const StarBackground = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Fondo Noche Base */}
      <div className="absolute inset-0 bg-[#12071F]" />

      {/* Degradado Radial Galaxia Estático Liviano */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 15% 20%, rgba(91, 33, 182, 0.28) 0%, transparent 45%), radial-gradient(circle at 85% 65%, rgba(192, 38, 211, 0.18) 0%, transparent 40%)'
        }}
      />
    </div>
  );
};

export default StarBackground;
