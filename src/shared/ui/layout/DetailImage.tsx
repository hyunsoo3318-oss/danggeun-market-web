import { useState } from 'react';

interface DetailImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function DetailImage({ src, alt, className = '' }: DetailImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {isLoading && src && (
        <div className="absolute inset-0 bg-bg-page flex items-center justify-center animate-pulse">
          <span className="text-6xl text-text-placeholder">📷</span>
        </div>
      )}

      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className={`w-full max-h-[400px] object-contain transition-all ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setHasError(true); }}
        />
      ) : (
        <div className="w-full max-h-[400px] min-h-[120px] bg-bg-page flex items-center justify-center text-text-muted">
          <div className="text-center">
            <div className="text-6xl">🖼️</div>
            <div className="mt-2 text-sm">{alt}</div>
          </div>
        </div>
      )}
    </div>
  );
}
