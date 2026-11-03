import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse rounded-xl bg-night-700/80 border border-night-600/40 relative overflow-hidden',
          className
        )
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gold-DEFAULT/5 to-transparent" />
    </div>
  );
};

export default Skeleton;
