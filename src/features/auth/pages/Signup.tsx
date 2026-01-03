import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import { useAuth } from '@/features/auth/hooks/store';
import { Input, PasswordInput, Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { signupSchema, type SignupForm } from '../api/schemas';
import { getErrorMessage } from '@/shared/api/types';

interface SignupPageProps {
  onSignup?: () => void;
}

export default function Signup({ onSignup }: SignupPageProps) {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const t = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (form: SignupForm) => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');

    setServerError('');

    try {
      await authApi.signup({ email: form.email, password: form.password });
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = await authApi.login({ email: form.email, password: form.password });

      login(data.access_token, data.refresh_token);

      onSignup?.();
      navigate('/auth/onboarding');
    } catch (err: unknown) {
      console.error(err);
      setServerError(getErrorMessage(err, t.auth.signupError));
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-105 px-4">
      <h2 className="mb-8 text-2xl font-bold text-text-primary">{t.auth.signup}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          type="email"
          placeholder={t.auth.email}
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordInput
          placeholder={t.auth.passwordMin}
          {...register('password')}
          error={errors.password?.message}
        />

        <PasswordInput
          placeholder={t.auth.passwordConfirm}
          {...register('passwordConfirm')}
          error={errors.passwordConfirm?.message}
        />

        {serverError && <div className="text-status-error text-sm mt-3 text-center font-medium">{serverError}</div>}

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          fullWidth
          className="mt-4"
        >
          {isSubmitting ? t.auth.signingUp : t.auth.next}
        </Button>
      </form>

      <div className="mt-6 text-[0.95rem] text-text-secondary">
        {t.auth.hasAccount}
        <Link to="/auth/login" className="text-primary font-semibold no-underline ml-1.5 hover:underline">{t.auth.login}</Link>
      </div>
    </div>
  );
}
