import { ReactNode } from 'react';

interface StatProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export function Stat({ icon, label, value, className = '' }: StatProps) {
  return (
    <span className={`text-text-muted text-[13px] flex items-center gap-1 ${className}`}>
      {icon}
      {label && <span className="sr-only">{label}</span>}
      <span>{value}</span>
    </span>
  );
}

interface StatGroupProps {
  children: ReactNode;
  className?: string;
}

export function StatGroup({ children, className = '' }: StatGroupProps) {
  return (
    <div className={`flex gap-3 items-center ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  variant?: 'outline' | 'primary' | 'secondary'; // Button의 variant 시스템 반영
}

export function StatCard({ 
  label, 
  value, 
  unit, 
  className = '', 
  layout = 'vertical',
  variant = 'outline' 
}: StatCardProps) {
  const isVertical = layout === 'vertical';

  // Button 컴포넌트의 스타일을 그대로 가져옴
  const variantStyles = {
    primary: "bg-primary text-text-inverse border-transparent",
    secondary: "bg-bg-box-alt text-text-body border-transparent",
    outline: "border-border-medium text-text-body bg-bg-page", // 회색 대신 페이지 배경색 사용
  };

  return (
    <div className={`
      border 
      rounded-lg 
      flex 
      ${variantStyles[variant]}
      ${isVertical 
        ? 'flex-col items-center justify-center p-8' 
        : 'flex-row items-center justify-start gap-3 p-4'} 
      ${className}
    `}>
      <span className={`
        font-medium 
        ${variant === 'primary' ? 'text-text-inverse/80' : 'text-text-secondary'}
        ${isVertical ? 'mb-2 text-lg' : 'text-base'}
      `}>
        {label}:
      </span>
      <div className={`font-bold flex items-baseline gap-1 ${variant === 'primary' ? 'text-text-inverse' : 'text-primary'}`}>
        <span className={isVertical ? 'text-5xl' : 'text-lg'}>
          {value}
        </span>
        {unit && (
          <span className={`
            font-normal 
            ${variant === 'primary' ? 'text-text-inverse/70' : 'text-text-muted'}
            ${isVertical ? 'text-2xl' : 'text-sm'}
          `}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}