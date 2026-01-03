import { useState } from 'react';

interface ThumbnailProps {
  src?: string | null;
  alt?: string;
  size?: number; // px
  className?: string;
}

export function Thumbnail({ src, alt = '', size = 56, className = '' }: ThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const sizeStyle = { width: `${size}px`, height: `${size}px` } as const;

  return (
    <div className={`rounded-lg overflow-hidden bg-bg-page ${className}`} style={sizeStyle}>
      {isLoading && src && (
        <div className="w-full h-full flex items-center justify-center animate-pulse">
          <span className="text-2xl text-text-placeholder">📷</span>
        </div>
      )}

      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setHasError(true); }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-text-muted bg-bg-page">
          <span className="text-xl">🖼️</span>
        </div>
      )}
    </div>
  );
}

export default Thumbnail;
