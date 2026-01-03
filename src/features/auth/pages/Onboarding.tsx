import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileEditForm from '@/features/user/components/ProfileEditForm';
import { useOnboarding } from '@/features/user/hooks/useUser';
import { useTranslation } from '@/shared/i18n';
import { getErrorMessage } from '@/shared/api/types';

export default function Onboarding() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const t = useTranslation();
  const redirect = searchParams.get('redirect') || '/products';
  const onboardingMutation = useOnboarding();

  const handleOnboardingSubmit = async (data: { nickname: string; region_id: string; profile_image: string }) => {
     setError('');
     const token = localStorage.getItem('token');
      if (!token) {
          navigate('/auth/login');
          return;
      }

      try {
        await onboardingMutation.mutateAsync(data);
        // Keep URL as the single source of truth for region selection.
        // Append the selected region id as a query param so useRegionSelection
        // on the product page will pick it up and sync the store.
        const separator = redirect.includes('?') ? '&' : '?';
        navigate(`${redirect}${separator}region=${encodeURIComponent(data.region_id)}`);
      } catch (err: unknown) {
        const detail = getErrorMessage(err, t.auth.onboardingFailed);
        throw new Error(detail);
      }
  };

  return (
    <div className="mx-auto mt-10 max-w-105 px-4">
      <h2 className="mb-4 text-2xl font-bold text-text-primary border-b-[3px] border-primary inline-block pb-2">{t.auth.additionalInfo}</h2>
      <p className="mb-5 text-text-secondary">{t.auth.onboardingDesc}</p>

      {error && <div className="text-status-error text-sm mb-3.75 text-center font-medium">{error}</div>}

      <ProfileEditForm
            initialProfileImage=""
            submitButtonText={t.auth.getStarted}
            forceGPS={true}
            onSubmit={async (data) => {
                try {
                    await handleOnboardingSubmit(data);
                } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : t.auth.onboardingFailed);
                }
            }}
        />
    </div>
  );
}
