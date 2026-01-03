import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`w-full rounded-xl bg-bg-page border border-border-medium p-4 text-base outline-none transition-all placeholder:text-text-placeholder focus:border-primary focus:ring-1 focus:ring-primary/20 ${
             error ? 'border-status-error/50 ring-1 ring-status-error/20' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-status-error ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
