import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  rightAction?: React.ReactNode;
  fullWidth?: boolean;
}

export function PageContainer({ title, rightAction, children, fullWidth = false }: PageContainerProps) {
  // 모바일 친화적인 최대 너비 설정 (기본 600px, fullWidth시 100%)
  const maxWidthClass = fullWidth ? 'w-full' : 'w-full max-w-[1000px] mx-auto'; 
  // fullWidth인 경우(지도, 채팅 등) 패딩 제거
  const paddingClass = fullWidth ? '' : 'px-4 py-6';

  return (
    <div className={`flex flex-col min-h-[calc(100vh-60px)] ${maxWidthClass} ${paddingClass}`}>
      {title && (
        <header className="mb-6 flex items-center justify-between px-4 sm:px-0">
          <h1 className="text-2xl font-bold text-text-heading">{title}</h1>
          {rightAction && <div>{rightAction}</div>}
        </header>
      )}
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
    </div>
  );
}
