import { useMemo, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/features/product/types';
import type { AuctionInfo } from '@/shared/api/types';
import { Card, CardContent, CardImage, CardTitle, Badge, Button, Avatar } from '@/shared/ui';
import { useUserProfile } from '@/features/user/hooks/useUser';
import { useTranslation } from '@/shared/i18n';
import { formatPrice, formatRemainingTime } from '@/shared/lib/formatting';
import { useFirstImage } from '@/features/image';

interface ProductCardProps {
  product: Product & { auction?: AuctionInfo };
  showActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductCard({ product, showActions, onEdit, onDelete }: ProductCardProps) {
  const { profile } = useUserProfile(product.owner_id);
  const t = useTranslation();
  const firstImageUrl = useFirstImage(product.image_ids);

  const auction = product.auction;
  const isAuction = !!auction;
  const isAuctionEnded = Boolean(
    auction && (
      auction.status !== 'active' ||
      (auction.end_at ? new Date(auction.end_at).getTime() <= Date.now() : false)
    )
  );

  const timeLabels = useMemo(() => ({
    timeEnded: t.auction.timeEnded,
    days: t.auction.days,
    hours: t.auction.hours,
    minutes: t.auction.minutes,
    remaining: t.auction.remaining,
  }), [t]);

  const remainingTime = auction ? formatRemainingTime(auction.end_at, timeLabels) : '';

  const stop = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <Link to={`/products/${product.id}`} className="group text-inherit no-underline">
      <Card className="border border-border-medium rounded-lg p-3">
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <Avatar src={profile?.profile_image ?? undefined} alt={profile?.nickname || t.product.seller} size="sm" />
            <span className="text-sm text-text-secondary truncate">{profile?.nickname || t.common.unknown}</span>
          </div>

          <div className="flex items-center justify-between mb-2 h-5">
            {isAuction ? (
              <>
                <Badge variant={isAuctionEnded ? 'secondary' : 'primary'} className="text-xs">
                  {isAuctionEnded ? t.auction.ended : t.auction.inProgress}
                </Badge>
                {!isAuctionEnded && (
                  <span className="text-xs text-status-error font-medium">{remainingTime}</span>
                )}
              </>
            ) : (
              <Badge variant={product.is_sold ? 'secondary' : 'primary'} className="text-xs">
                {product.is_sold ? t.product.soldOut : t.product.onSale}
              </Badge>
            )}
          </div>

          <div className={`aspect-square rounded-lg overflow-hidden mb-3 ${firstImageUrl ? '' : 'border border-border-medium bg-bg-page'}`}>
            {firstImageUrl ? (
              <CardImage src={firstImageUrl} alt={product.title} aspectRatio="square" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <span className="text-3xl text-text-muted">📦</span>
                <span className="text-xs text-text-secondary">{t.product.noImage}</span>
              </div>
            )}
          </div>

          <CardTitle className="tracking-tighter break-keep text-text-heading line-clamp-1">{product.title}</CardTitle>
          <p className="text-sm text-text-muted line-clamp-2 h-10 mb-2">{product.content}</p>

          <div className="h-16">
            {isAuction ? (
              <div className="space-y-1">
                <div className="text-xs text-text-muted">
                  {t.auction.startingPrice}: {formatPrice(product.price, t.common.won)}
                </div>
                <div className="text-[15px] font-extrabold text-primary">
                  {t.auction.currentPrice}: {formatPrice(auction.current_price, t.common.won)}
                </div>
                <div className="text-xs text-text-secondary">
                  {t.auction.bidsCount.replace('{count}', String(auction.bid_count))}
                </div>
              </div>
            ) : (
              <div className="text-[15px] font-extrabold text-primary">{formatPrice(product.price, t.common.won)}</div>
            )}
          </div>

          {showActions && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-border-medium">
              <Button onClick={(e) => { stop(e); onEdit?.(product); }} variant="secondary" size="sm" className="flex-1">{t.common.edit}</Button>
              <Button onClick={(e) => { stop(e); onDelete?.(product); }} variant="ghost" size="sm" className="flex-1 text-status-error hover:bg-status-error-hover">{t.common.delete}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
