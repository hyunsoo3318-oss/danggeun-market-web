import { Button } from '../display/Button';
import { useTranslation } from '@/shared/i18n';
import { useHierarchicalBack } from '@/shared/hooks/useHierarchicalBack';

export function DetailHeader() {
  const t = useTranslation();
  const goBack = useHierarchicalBack();

  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        onClick={goBack}
        className="pl-0 hover:bg-transparent hover:text-primary"
      >
        {t.layout.goBack}
      </Button>
    </div>
  );
}
