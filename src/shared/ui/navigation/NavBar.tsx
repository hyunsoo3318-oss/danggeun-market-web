import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/shared/store/themeStore';
import { useLanguage } from '@/shared/store/languageStore';
import { useTranslation } from '@/shared/i18n';
import { useChatRooms } from '@/features/chat/hooks/useChat';
import { Button } from '../display/Button';
import { Badge } from '../feedback';
import { POLLING_CONFIG, getPollingInterval } from '@/shared/config/polling';
import { useProductFiltersStore } from '@/features/product/store/productFiltersStore';

export default function NavBar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { toggleLanguage } = useLanguage();
  const t = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getProductSearchParams = useProductFiltersStore((state) => state.getSearchParams);

  const MENUS = [
    { id: 'products', label: t.nav.products, path: '/products' },
    { id: 'chat', label: t.nav.chat, path: '/chat' },
  ];

  // 로그인 상태일 때 읽지 않은 메시지 수 폴링 (React Query handles caching & deduplication)
  const { totalUnreadCount } = useChatRooms({
    refetchInterval: getPollingInterval(POLLING_CONFIG.UNREAD_COUNT, isLoggedIn),
    enabled: isLoggedIn,
  });

  const handleNav = (path: string) => {
    if (path === '/products') {
      navigate(path + getProductSearchParams());
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const NavItem = ({ label, path, mobile = false }: { label: string, path: string, mobile?: boolean }) => {
    const isActive = pathname.startsWith(path);
    const mobileStyle = mobile ? "w-full text-left text-lg" : "";
    const activeStyle = isActive ? "text-primary font-bold" : "text-text-body font-medium";
    const isChat = path === '/chat';
    const showBadge = isChat && totalUnreadCount > 0;

    return (
      <Button
        onClick={() => handleNav(path)}
        variant="ghost"
        className={`${mobileStyle} ${activeStyle} gap-2`}
      >
        {label}
        {showBadge && (
          <Badge variant="notification">
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </Badge>
        )}
      </Button>
    );
  };

  const authItem = { label: isLoggedIn ? t.nav.myCarrot : t.nav.login, path: isLoggedIn ? '/my' : '/auth/login' };

  return (
    <>
      <nav className="flex h-16 w-full items-center justify-between bg-bg-page px-5 shadow-sm">
        <div className="flex items-center gap-10">
          <h1 onClick={() => handleNav('/products')} className="cursor-pointer text-2xl font-bold text-primary">
            {t.nav.carrotMarket}
          </h1>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {MENUS.map(menu => <NavItem key={menu.id} {...menu} />)}
            <NavItem {...authItem} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 언어 토글 */}
          <Button
            onClick={toggleLanguage}
            variant="ghost"
            className="p-2 text-sm font-medium"
            aria-label={t.nav.langToggle}
          >
            {t.nav.langLabel}
          </Button>

          {/* 다크모드 토글 */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className="p-2"
            aria-label={t.nav.themeToggle}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>

          {/* 모바일 햄버거 버튼 */}
          <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <MenuIcon />
          </Button>
        </div>
      </nav>

      {/* 모바일 메뉴 오버레이 */}
      <div className={`fixed inset-0 z-2000 bg-bg-overlay transition-opacity ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} onClick={() => setIsMenuOpen(false)}>
        <div
          className={`absolute right-0 h-full w-[70%] max-w-75 bg-bg-page shadow-xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4">
            <span className="text-lg font-bold text-primary">{t.nav.carrotMarket}</span>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleLanguage}
                variant="ghost"
                className="p-2 text-sm font-medium"
                aria-label={t.nav.langToggle}
              >
                {t.nav.langLabel}
              </Button>
              <Button
                onClick={toggleTheme}
                variant="ghost"
                className="p-2"
                aria-label={t.nav.themeToggle}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </Button>
              <Button variant="ghost" onClick={() => setIsMenuOpen(false)}><CloseIcon /></Button>
            </div>
          </div>

          <div className="flex flex-col py-2">
            {MENUS.map(menu => <NavItem key={menu.id} {...menu} mobile />)}
            <NavItem {...authItem} mobile />
          </div>
        </div>
      </div>
    </>
  );
}

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
