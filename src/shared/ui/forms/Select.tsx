import { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, error, className = '', disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block mb-2 font-bold text-sm text-text-secondary">{label}</label>}
        <select
          ref={ref}
          disabled={disabled}
          className={`w-full rounded-xl border p-4 text-base outline-none transition-all appearance-none ${
            disabled
              ? 'bg-bg-secondary border-border-light text-text-tertiary cursor-not-allowed opacity-60'
              : 'bg-bg-page border-border-medium focus:border-primary focus:ring-1 focus:ring-primary/20'
          } ${error ? 'border-status-error/50 ring-1 ring-status-error/20' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-status-error ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
