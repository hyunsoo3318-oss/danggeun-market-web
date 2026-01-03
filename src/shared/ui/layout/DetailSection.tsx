import { ReactNode, CSSProperties } from 'react';

interface DetailSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function DetailSection({ children, className = '', style }: DetailSectionProps) {
  return (
    <section className={`bg-bg-page rounded-lg border border-border-medium p-6 overflow-hidden ${className}`} style={style}>
      {children}
    </section>
  );
}
