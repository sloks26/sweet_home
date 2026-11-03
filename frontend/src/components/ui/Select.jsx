import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({
  label,
  error,
  helperText,
  children,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-text-secondary tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          className={twMerge(
            clsx(
              'w-full bg-night-800/90 text-text-primary rounded-xl px-3.5 py-2.5 text-sm appearance-none cursor-pointer',
              'border border-night-600/80',
              'transition-all duration-200 pr-10',
              'focus:outline-none focus:border-gold-DEFAULT focus:ring-2 focus:ring-gold-DEFAULT/25 focus:bg-night-800',
              'disabled:opacity-50 disabled:bg-night-900',
              error && 'border-status-error focus:border-status-error focus:ring-status-error/25',
              className
            )
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3.5 text-text-muted pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error ? (
        <span className="text-xs text-status-error mt-0.5">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-text-muted mt-0.5">{helperText}</span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
