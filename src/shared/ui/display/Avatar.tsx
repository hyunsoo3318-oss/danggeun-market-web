import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ src, alt = 'Profile', size = 'md', className = '' }: AvatarProps) {
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-[120px] h-[120px]',
  };

  const spinnerSizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const DefaultIcon = () => (
    <div className={`${sizeClasses[size]} rounded-full bg-bg-box-alt border border-border-base flex items-center justify-center text-text-placeholder`}>
      <svg className={`${iconSizes[size]} opacity-50`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
  );

  // src가 없으면 바로 기본 아이콘 표시
  if (!src || hasError) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <DefaultIcon />
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 rounded-full bg-bg-box border border-border-base flex items-center justify-center">
          <div className={`${spinnerSizes[size]} border-border-base border-t-primary rounded-full animate-spin`}></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover border border-border-base bg-bg-box-alt ${sizeClasses[size]} ${isLoading ? 'invisible' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
