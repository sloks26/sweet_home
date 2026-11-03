import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={twMerge(
        clsx(
          'relative rounded-2xl bg-gradient-to-b from-night-700/90 to-night-800/95',
          'border border-gold-DEFAULT/20 text-text-primary backdrop-blur-sm',
          'shadow-[0_10px_30px_-10px_rgba(18,7,31,0.8)]',
          'transition-all duration-300 ease-out',
          hoverEffect && 'hover:border-gold-DEFAULT/50 hover:shadow-galaxy-card-hover hover:-translate-y-1',
          glow && 'border-gold-DEFAULT/40 shadow-gold-sm',
          className
        )
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={twMerge('p-6 pb-3 flex flex-col gap-1.5', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component
    className={twMerge('font-serif text-xl sm:text-2xl font-semibold text-text-primary tracking-tight', className)}
    {...props}
  >
    {children}
  </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={twMerge('text-sm text-text-secondary leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={twMerge('p-6 pt-3', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={twMerge('p-6 pt-0 flex items-center justify-between border-t border-night-600/50 mt-4', className)} {...props}>
    {children}
  </div>
);

export default Card;
