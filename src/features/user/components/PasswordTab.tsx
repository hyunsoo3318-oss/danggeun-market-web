import { PasswordInput, Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';

const PasswordTab = () => {
  const t = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.user.passwordChanged);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
      <PasswordInput label={t.user.currentPassword} />
      <PasswordInput label={t.user.newPassword} />
      <PasswordInput label={t.user.confirmNewPassword} />
      <Button type="submit" size="lg" fullWidth className="mt-4">
        {t.user.changePassword}
      </Button>
    </form>
  );
};
export default PasswordTab;