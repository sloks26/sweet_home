import React from 'react';
import { LOGO_EMBLEM_DATA_URI } from './logoData';

export const LogoEmblem = ({ className = 'w-12 h-12', withGlow = true }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 bg-[#12071F] rounded-full ${className}`}
    >
      {withGlow && (
        <div className="absolute inset-0 bg-gold-DEFAULT/25 rounded-full blur-sm -z-10" />
      )}
      <img
        src={LOGO_EMBLEM_DATA_URI}
        alt="Sweet Home & Boutique CR"
        width={48}
        height={48}
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        className="w-full h-full object-cover rounded-full border border-gold-DEFAULT/40 shadow-gold-sm"
      />
    </div>
  );
};

export const Logo = ({
  size = 'default',
  showSlogan = false,
  showFullImage = false,
  className = ''
}) => {
  const isSmall = size === 'sm' || size === 'small';
  const isLarge = size === 'lg' || size === 'large';

  if (showFullImage) {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <img
          src="/images/logo.webp"
          alt="Sweet Home & Boutique CR"
          loading="eager"
          decoding="sync"
          className={
            isSmall
              ? 'w-28 h-28 object-contain rounded-2xl shadow-galaxy-card'
              : isLarge
                ? 'w-64 h-64 object-contain rounded-3xl shadow-galaxy-card'
                : 'w-44 h-44 object-contain rounded-2xl shadow-galaxy-card'
          }
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      <LogoEmblem
        className={isSmall ? 'w-10 h-10 sm:w-11 sm:h-11' : isLarge ? 'w-16 h-16' : 'w-12 h-12'}
      />
      <div className="flex flex-col justify-center min-w-0 overflow-visible">
        <span
          className={`font-script text-gold-gradient tracking-wide leading-snug pt-0.5 whitespace-nowrap overflow-visible ${
            isSmall ? 'text-2xl sm:text-[26px]' : isLarge ? 'text-4xl' : 'text-3xl'
          }`}
        >
          Sweet Home
        </span>
        <span
          className={`font-serif tracking-[0.22em] text-gold-light/90 uppercase font-semibold leading-normal whitespace-nowrap ${
            isSmall ? 'text-[9px] sm:text-[10px]' : isLarge ? 'text-xs' : 'text-[11px]'
          }`}
        >
          & Boutique CR
        </span>
        {showSlogan && (
          <span className="text-[11px] text-text-secondary font-sans italic mt-1 text-gold-bright/80 whitespace-nowrap">
            Donde cada detalle ilumina tu hogar y tu estilo
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
