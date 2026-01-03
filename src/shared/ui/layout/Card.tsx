import { ReactNode, useState } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = true }: CardProps) {
  const hoverClass = hoverable ? 'transition-transform duration-200 hover:-translate-y-1' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`flex flex-col ${hoverClass} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  src?: string | null;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  className?: string;
  onError?: () => void;
}

export function CardImage({ src, alt, aspectRatio = 'square', className = '', onError }: CardImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'video' ? 'aspect-video' : '';

  return (
    <div className={`relative mb-3 w-full overflow-hidden rounded-xl bg-bg-page border border-border-light/20 ${aspectClass} ${className}`}>
      {isLoading && src && (
        <div className="absolute inset-0 bg-bg-page flex items-center justify-center animate-pulse">
          <span className="text-4xl text-text-placeholder">📷</span>
        </div>
      )}
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            try { onError?.(); } catch {}
          }}
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-bg-page flex items-center justify-center text-text-muted">
          <span className="text-4xl">🖼️</span>
        </div>
      )}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`px-0.5 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`mb-1.5 line-clamp-2 text-base font-medium leading-snug text-text-heading ${className}`}>
      {children}
    </h3>
  );
}

interface CardMetaProps {
  children: ReactNode;
  className?: string;
}

export function CardMeta({ children, className = '' }: CardMetaProps) {
  return (
    <div className={`text-[13px] text-text-secondary ${className}`}>
      {children}
    </div>
  );
}
