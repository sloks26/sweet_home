import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      iconRight: IconRight,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-text-secondary tracking-wide flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 text-text-muted pointer-events-none flex items-center">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={twMerge(
              clsx(
                'w-full bg-night-800/90 text-text-primary rounded-xl px-3.5 py-2.5 text-base sm:text-sm min-h-[44px]',
                'border border-night-600/80 placeholder:text-text-muted/70',
                'transition-all duration-200',
                'focus:outline-none focus:border-gold-DEFAULT focus:ring-2 focus:ring-gold-DEFAULT/25 focus:bg-night-800',
                'disabled:opacity-50 disabled:bg-night-900',
                Icon && 'pl-10',
                IconRight && 'pr-10',
                error && 'border-status-error focus:border-status-error focus:ring-status-error/25',
                className
              )
            )}
            {...props}
          />
          {IconRight && (
            <div className="absolute right-3.5 text-text-muted flex items-center">{IconRight}</div>
          )}
        </div>
        {error ? (
          <span className="text-xs text-status-error mt-0.5">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-text-muted mt-0.5">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef(
  ({ label, error, helperText, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-text-secondary tracking-wide"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={twMerge(
            clsx(
              'w-full bg-night-800/90 text-text-primary rounded-xl px-3.5 py-2.5 text-base sm:text-sm',
              'border border-night-600/80 placeholder:text-text-muted/70 resize-y',
              'transition-all duration-200',
              'focus:outline-none focus:border-gold-DEFAULT focus:ring-2 focus:ring-gold-DEFAULT/25 focus:bg-night-800',
              'disabled:opacity-50 disabled:bg-night-900',
              error && 'border-status-error focus:border-status-error focus:ring-status-error/25',
              className
            )
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-status-error mt-0.5">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-text-muted mt-0.5">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;
