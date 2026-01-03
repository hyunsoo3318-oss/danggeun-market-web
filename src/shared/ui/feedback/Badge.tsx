import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'notification';
  className?: string;
}

export default function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary-light-hover text-primary',
    secondary: 'bg-bg-box text-text-secondary',
    success: 'bg-status-success-light text-status-success-text',
    error: 'bg-status-error-light text-status-error',
    warning: 'bg-status-warning-light text-status-warning-text',
    notification: 'bg-primary text-white',
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
