import { useState, forwardRef } from 'react';
import { Button } from '../display/Button';

import { useTranslation } from '@/shared/i18n';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [show, setShow] = useState(false);
    
    const t = useTranslation();

    return (
      <div className="w-full">
        {label && <label className="block font-bold mb-2 text-sm">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            type={show ? "text" : "password"}
            autoComplete="off"
            className={`w-full rounded-xl bg-bg-page border border-border-medium p-4 pr-12.5 text-base outline-none transition-all placeholder:text-text-placeholder focus:border-primary focus:ring-1 focus:ring-primary/20 ${
              error ? 'border-status-error/50 ring-1 ring-status-error/20' : ''
            } ${className}`}
            {...props}
          />
          <Button
            type="button"
            onClick={() => setShow(!show)}
            variant="ghost"
            size="sm"
            className="absolute right-3.75 top-1/2 -translate-y-1/2 text-[13px] font-semibold"
            tabIndex={-1}
          >
            {show ? t.common.hide : t.common.show}
          </Button>
        </div>
        {error && <p className="mt-1 text-sm text-status-error ml-1">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
