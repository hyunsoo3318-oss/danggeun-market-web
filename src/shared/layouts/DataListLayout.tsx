import React, { useState, useEffect, useRef } from 'react';
import { Loading, ErrorMessage } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

interface DataListLayoutProps {
  isLoading: boolean;
  error?: Error | null;
  isEmpty: boolean;
  emptyMessage?: string;
  filters?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DataListLayout({
  isLoading,
  error,
  isEmpty,
  emptyMessage,
  filters,
  children,
  className = ''
}: DataListLayoutProps) {
  const t = useTranslation();
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤을 내리면 필터 숨김, 올리면 필터 표시
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsFilterVisible(false);
      } else {
        setIsFilterVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const errorMsg = error?.message ?? null;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {filters && (
        <div
          className={`sticky top-0 z-10 bg-bg-page/95 backdrop-blur-sm py-2 transition-all duration-300 ${
            isFilterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
        >
          {filters}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loading />
        </div>
      ) : errorMsg ? (
        <div className="flex justify-center items-center py-20">
          <ErrorMessage message={errorMsg} />
        </div>
      ) : (
        <>
          {children}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <div className="text-4xl mb-2">📭</div>
              <p>{emptyMessage || t.common.noData}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
