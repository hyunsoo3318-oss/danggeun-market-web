import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct, useUserProducts, usePlaceBid } from "@/features/product/hooks/useProducts";
import { useUser, useUserProfile } from "@/features/user/hooks/useUser";
import { useTranslation } from "@/shared/i18n";
import { useDetailHandlers } from "./shared";
import { getErrorMessage } from "@/shared/api/types";
import { formatRemainingTime } from "@/shared/lib/formatting";

export function useProductDetailLogic(productId: string) {
  const navigate = useNavigate();
  const t = useTranslation();
  const { isLoggedIn } = useUser();

  const { product, loading: productLoading, error: productError, refetch } = useProduct(productId);
  const auctionInfo = product?.auction;
  const { profile: sellerProfile } = useUserProfile(product?.owner_id);
  const { products: sellerProducts } = useUserProducts(product?.owner_id!, undefined, undefined, false);
  const { products: sellerAuctions } = useUserProducts(product?.owner_id!, undefined, undefined, true);

  const placeBidMutation = usePlaceBid();
  const [bidPrice, setBidPrice] = useState('');
  const [remainingTime, setRemainingTime] = useState('');

  const handlers = useDetailHandlers({ product, redirectPath: '/products', onEditSuccess: refetch });

  // Auction-specific logic (ended = status not active OR end_at has passed)
  const isAuction = !!auctionInfo;
  const isEnded = Boolean(
    auctionInfo && (
      auctionInfo.status !== 'active' ||
      (auctionInfo.end_at ? new Date(auctionInfo.end_at).getTime() <= Date.now() : false)
    )
  );
  const minBidPrice = auctionInfo ? auctionInfo.current_price + 1 : 0;

  const timeLabels = useMemo(() => ({
    timeEnded: t.auction.timeEnded,
    days: t.auction.days,
    hours: t.auction.hours,
    minutes: t.auction.minutes,
    seconds: t.auction.seconds,
  }), [t]);

  useEffect(() => {
    if (!auctionInfo) return;
    const update = () => setRemainingTime(formatRemainingTime(auctionInfo.end_at, timeLabels));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [auctionInfo, timeLabels]);

  const handleBid = useCallback(async () => {
    if (!isLoggedIn) { navigate('/auth/login'); return; }

    const price = parseInt(bidPrice, 10);
    if (isNaN(price) || price <= 0) { alert(t.auction.invalidAmount); return; }
    if (auctionInfo && price <= auctionInfo.current_price) {
      alert(t.auction.bidHigherThanCurrent.replace('{price}', auctionInfo.current_price.toLocaleString()));
      return;
    }

    if (!auctionInfo || !product) return;

    try {
      await placeBidMutation.mutateAsync({ auctionId: auctionInfo.id, productId: product.id, data: { bid_price: price } });
      setBidPrice('');
      refetch();
      alert(t.auction.bidPlaced);
    } catch (err) {
      alert(getErrorMessage(err, t.auction.bidFailed));
    }
  }, [isLoggedIn, bidPrice, auctionInfo, product, placeBidMutation, refetch, navigate, t]);

  // Combine product and auction info into shape expected by AuctionInfoSection
  const auction = auctionInfo ? { ...auctionInfo, product } : undefined;

  return {
    product,
    auction,
    sellerProfile,
    sellerProducts,
    sellerAuctions,
    productLoading,
    productError,
    // Auction-specific
    isAuction,
    isEnded,
    remainingTime,
    bidPrice,
    minBidPrice,
    isBidding: placeBidMutation.isPending,
    handleBid,
    setBidPrice,
    refetch,
    ...handlers,
  };
}
