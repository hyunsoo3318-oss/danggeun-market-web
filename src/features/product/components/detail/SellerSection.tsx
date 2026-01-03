import { Button, Avatar } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useDetail } from '@/features/product/hooks/DetailContext';

export function SellerSection() {
  const t = useTranslation();
  const { sellerProfile, handleNavigateToSeller, handleChat, isChatLoading, isOwner } = useDetail();

  return (
    <div className="flex items-center justify-between">
      <div
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleNavigateToSeller}
      >
        <Avatar src={sellerProfile?.profile_image ?? undefined} alt={sellerProfile?.nickname ?? undefined} size="sm" />
        <div>
          <div className="font-semibold text-text-heading">
            {sellerProfile?.nickname || t.common.unknown}
          </div>
          <div className="text-sm text-text-secondary">{t.product.seller}</div>
        </div>
      </div>

      {!isOwner && (
        <Button size="sm" onClick={handleChat} disabled={isChatLoading}>
          {isChatLoading ? t.product.connecting : t.product.startChat}
        </Button>
      )}
    </div>
  );
}
