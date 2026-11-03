import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-bright/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

  const variants = {
    primary: 'bg-gold-metallic text-night-900 font-semibold shadow-gold-sm hover:shadow-gold-md hover:bg-gold-metallic-hover hover:-translate-y-0.5',
    secondary: 'bg-night-700/80 border border-gold-DEFAULT/30 text-text-primary hover:border-gold-DEFAULT/70 hover:bg-night-600 hover:text-gold-light shadow-sm',
    nebula: 'bg-gradient-to-r from-nebula-magenta via-nebula-pink to-galaxy-light text-white font-semibold shadow-nebula-sm hover:brightness-110 hover:-translate-y-0.5',
    outline: 'border border-gold-DEFAULT/40 text-gold-light bg-transparent hover:bg-gold-DEFAULT/10 hover:border-gold-DEFAULT',
    ghost: 'text-text-secondary hover:text-gold-light hover:bg-night-700/50',
    danger: 'bg-status-error/20 border border-status-error/40 text-status-error hover:bg-status-error/30',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl',
    icon: 'p-2.5 rounded-xl aspect-square',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
