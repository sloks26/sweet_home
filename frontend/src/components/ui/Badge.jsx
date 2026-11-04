import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Badge = ({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
  withDot = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide select-none';

  const variants = {
    gold: 'bg-gold-DEFAULT/15 text-gold-light border border-gold-DEFAULT/30 shadow-[0_0_8px_rgba(242,193,78,0.15)]',
    nebula: 'bg-nebula-magenta/15 text-nebula-light border border-nebula-magenta/30',
    adult:
      'bg-night-800 text-gold-bright border border-gold-dark/60 font-serif font-bold tracking-wider px-2 shadow-sm', // Etiqueta +18 discreta y elegante
    success: 'bg-status-success/15 text-status-success border border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border border-status-warning/30',
    error: 'bg-status-error/15 text-status-error border border-status-error/30',
    outline: 'bg-transparent text-text-secondary border border-night-600',
    metallic: 'bg-gold-metallic text-night-950 font-semibold shadow-gold-sm'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  };

  const dotColors = {
    gold: 'bg-gold-bright',
    nebula: 'bg-nebula-pink',
    adult: 'bg-gold-dark',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    error: 'bg-status-error',
    outline: 'bg-text-secondary',
    metallic: 'bg-night-900'
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {withDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-current'} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
