import { useQuery, useQueries } from '@tanstack/react-query';
import { imageApi, ImageUploadResponse } from '@/features/product/api/imageApi';
import { fetchRegionById } from '@/features/location/api/region';
import { DetailImage, Thumbnail, Button, Badge, Input, DetailSection } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';
import { useImageCarousel, useContentTranslation } from '@/features/product/hooks/shared';
import { useDetail } from '@/features/product/hooks/DetailContext';
import { useProductDetail } from '@/features/product/hooks/ProductDetailContext';

const NAV_BTN = "absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity";

function formatDateTime(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ProductDetailView() {
  const t = useTranslation();
  const { language } = useLanguage();
  const { product, isOwner, isDeleting, startEditing, handleDelete } = useDetail();
  const { auction, isAuction, isEnded, remainingTime, bidPrice, setBidPrice, minBidPrice, handleBid, isBidding } = useProductDetail();

  const imageQueries = useQueries({
    queries: (product.image_ids ?? []).map(id => ({
      queryKey: ['image', id],
      queryFn: () => imageApi.getById(id),
      staleTime: 1000 * 60 * 5, // 5분 캐시 - useFirstImage와 공유
    })),
  });
  const images = imageQueries.map(q => q.data).filter((img): img is ImageUploadResponse => !!img);

  const { data: region } = useQuery({
    queryKey: ['region', product.region_id],
    queryFn: () => fetchRegionById(product.region_id),
    enabled: !!product.region_id,
    staleTime: 1000 * 60 * 30, // 지역 정보는 30분 캐시 (거의 변하지 않음)
  });

  const { index, hasPrev, hasNext, goPrev, goNext, goTo } = useImageCarousel(images.length);
  const { displayTitle, displayContent, needsTranslation, isTranslated, isTranslating, handleTranslate } = useContentTranslation(product.title, product.content ?? '');

  const onTranslate = async () => { if (!await handleTranslate()) alert(t.product.translateFailed); };

  return (
    <>
      {/* Box 1: Product Information */}
      <DetailSection className="mb-4">
        {images.length > 0 && (
          <div className="mb-6">
            <div className="relative group">
              <DetailImage src={images[index].image_url} alt={product.title} />
              {images.length > 1 && (
                <>
                  {hasPrev && (
                    <button onClick={goPrev} className={`${NAV_BTN} left-3`} aria-label="previous image">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                  )}
                  {hasNext && (
                    <button onClick={goNext} className={`${NAV_BTN} right-3`} aria-label="next image">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  )}
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-3">
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => goTo(i)} className={`rounded-lg overflow-hidden transition-all ${i === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-base' : 'opacity-60 hover:opacity-100'}`} aria-label={i === index ? `image ${i + 1} selected` : `select image ${i + 1}`}>
                    <Thumbnail src={img.image_url} alt={product.title} size={48} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant={product.is_sold ? 'secondary' : 'primary'} className="text-xs">
              {product.is_sold ? t.product.soldOut : t.product.onSale}
            </Badge>
            {region && (
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {region.sigugun} {region.dong}
              </span>
            )}
          </div>
          {needsTranslation && (
            <Button variant="ghost" size="sm" onClick={onTranslate} disabled={isTranslating}>
              {isTranslating ? t.product.translating : isTranslated ? t.product.showOriginal : t.product.translate}
            </Button>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2 text-text-heading">{displayTitle}</h2>

        {!isAuction && (
          <h3 className="text-3xl font-bold mb-6 text-primary">{product.price.toLocaleString()}{t.common.won}</h3>
        )}

        <div className="mt-6 border-t border-border-base pt-6">
          <div className="whitespace-pre-wrap leading-relaxed text-text-body">{displayContent}</div>
        </div>

        {isOwner && (
          <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base gap-2">
            <Button size="sm" onClick={startEditing}>{t.common.edit}</Button>
            <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isDeleting}>{t.common.delete}</Button>
          </div>
        )}
      </DetailSection>

      {/* Box 2: Auction Information */}
      {isAuction && auction && (
        <DetailSection>
          <h3 className="text-xl font-bold mb-4 text-text-heading">{t.auction.auction}</h3>

          <div className="flex items-center justify-between mb-4">
            <Badge variant={isEnded ? 'secondary' : 'primary'}>
              {isEnded ? t.auction.auctionEnded : t.auction.active}
            </Badge>
            {!isEnded && (
              <span className="text-status-error font-bold">
                {remainingTime === t.auction.timeEnded ? remainingTime : `${remainingTime} ${t.auction.remaining}`}
              </span>
            )}
          </div>

          <p className="text-sm text-text-muted mb-4">
            {t.auction.endTime}: {formatDateTime(auction.end_at, language)}
          </p>

          <div className="bg-bg-base rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-muted">{t.auction.startingPrice}</span>
              <span className="text-text-body">{product.price.toLocaleString()}{t.common.won}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-muted">{t.auction.currentPrice}</span>
              <span className="text-2xl font-bold text-primary">{auction.current_price.toLocaleString()}{t.common.won}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">{t.auction.bidCount}</span>
              <span className="text-text-body">{t.auction.bidsCount.replace('{count}', String(auction.bid_count))}</span>
            </div>
          </div>

          {!isEnded && (
            <div className="pt-4 border-t border-border-base">
              <h4 className="font-semibold mb-3">{t.auction.placeBid}</h4>
              <p className="text-sm text-text-muted mb-3">
                {t.auction.minimumBid}: {minBidPrice.toLocaleString()}{t.common.won} {t.auction.orMore}
              </p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  placeholder={t.auction.enterBidAmount.replace('{price}', minBidPrice.toLocaleString())}
                  min={minBidPrice}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  onClick={handleBid}
                  disabled={isBidding}
                  className="whitespace-nowrap min-w-17.5"
                >
                  {isBidding ? t.auction.bidding : t.auction.bid}
                </Button>
              </div>
            </div>
          )}
        </DetailSection>
      )}
    </>
  );
}
