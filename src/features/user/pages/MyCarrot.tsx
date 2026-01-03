import { useNavigate } from 'react-router-dom';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import UserProfile from '@/features/user/components/UserProfile';
import CoinTab from '@/features/pay/pages/CoinTab';
import PasswordTab from '@/features/user/components/PasswordTab';
import TransactionTab from '@/features/pay/components/transaction/TransactionTab';
import { useAuth } from '@/features/auth/hooks/store';
import { Loading, Button, Avatar, DetailHeader } from '@/shared/ui';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { useTranslation } from '@/shared/i18n';

import { useOnboarding } from '@/features/user/hooks/useUser';
import { useUser } from '@/features/user/hooks/useUser';
import { POLLING_CONFIG } from '@/shared/config/polling';

type TabType = 'products' | 'profile' | 'coin' | 'transactions' | 'password';

interface MyCarrotProps {
  initialTab?: TabType;
}

function MyCarrot({ initialTab }: MyCarrotProps) {
  const { user } = useUser({ refetchInterval: POLLING_CONFIG.USER_BALANCE });
  const { logout } = useAuth();
  const navigate = useNavigate();
  const onboardingMutation = useOnboarding();
  const t = useTranslation();

  const MENU_ITEMS: { id: TabType; label: string; to: string }[] = [
    { id: 'products', label: t.user.myProducts, to: '/my/products' },
    { id: 'profile', label: t.user.editProfile, to: '/my/profile' },
    { id: 'coin', label: t.pay.coinManagement, to: '/my/coin' },
    { id: 'transactions', label: t.pay.transactionHistory, to: '/my/transactions' },
    { id: 'password', label: t.user.changePassword, to: '/my/password' },
  ];

  if (!user) return <Loading />;

  const updateProfile = async (data: { nickname: string; region_id: string; profile_image: string }) => {
    if (!user) return;
    try {
      await onboardingMutation.mutateAsync(data);
      alert(t.user.infoUpdated);
    } catch (err) {
      console.error(err);
      alert(t.user.errorOccurred);
    }
  };

  // First layer: Menu list
  if (!initialTab) {
    return (
      <PageContainer>
        <div className="flex justify-between items-center mb-7.5">
          <h2 className="text-2xl font-extrabold m-0">{t.user.myCarrot}</h2>
          <Button onClick={() => { logout(); navigate('/products'); }} variant="outline" size="sm">{t.auth.logout}</Button>
        </div>

        {/* User info section - 코인관리 스타일 적용 */}
        <div className="rounded-lg bg-bg-page p-8 mb-6 flex flex-col items-center">
          <Avatar
            src={user.profile_image || undefined}
            alt={user.nickname || t.common.unknown}
            size="lg"
          />
          <div className="mt-4 text-center">
            <div className="text-xl font-bold text-text-heading">{user.nickname || t.common.unknown}</div>
            <div className="text-sm text-text-secondary mt-1">{user.email}</div>
          </div>
        </div>

        {/* Menu list - 코인관리 버튼 스타일 적용 */}
        <div className="flex flex-col gap-3">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.to)}
              className="flex items-center justify-between w-full p-4 text-left border border-border-medium rounded-lg bg-bg-page hover:border-primary hover:text-primary transition-colors"
            >
              <span className="text-base font-medium text-text-heading">{item.label}</span>
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </PageContainer>
    );
  }

  // Second layer: Tab content with back button
  return (
    <PageContainer>
      <DetailHeader />
      <h2 className="text-2xl font-extrabold mb-6">
        {MENU_ITEMS.find(item => item.id === initialTab)?.label}
      </h2>

      <div className="content-area">
        {initialTab === 'products' && <UserProfile />}
        {initialTab === 'profile' && (
          <ProfileEditForm
            initialEmail={user.email}
            initialNickname={user.nickname || ''}
            initialRegionId={user.region?.id || ''}
            initialProfileImage={user.profile_image || ''}
            forceGPS={true}
            onSubmit={updateProfile}
          />
        )}
        {initialTab === 'coin' && <CoinTab />}
        {initialTab === 'transactions' && <TransactionTab />}
        {initialTab === 'password' && <PasswordTab />}
      </div>
    </PageContainer>
  );
}

export default MyCarrot;