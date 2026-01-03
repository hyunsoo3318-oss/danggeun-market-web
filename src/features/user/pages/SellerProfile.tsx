import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useUserProfile } from '@/features/user/hooks/useUser';
import { useUserProducts } from '@/features/product/hooks/useProducts';
import { useCreateRoom } from '@/features/chat/hooks/useChat';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Loading, ErrorMessage, EmptyState, Button, DetailHeader, DetailSection, Avatar, Pagination } from '@/shared/ui';
import ProductCard from '@/features/product/components/list/ProductCard';
import { useTranslation } from '@/shared/i18n';

const ITEMS_PER_PAGE = 8;

function SellerProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId);
  const createRoom = useCreateRoom();
  const t = useTranslation();

  const [showAuction, setShowAuction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { products: regularProducts, loading: regularLoading } = useUserProducts(userId || '', undefined, undefined, false);
  const { products: auctionProducts, loading: auctionLoading } = useUserProducts(userId || '', undefined, undefined, true);

  const productsLoading = regularLoading || auctionLoading;
  const currentProducts = showAuction ? auctionProducts : regularProducts;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return currentProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentProducts, currentPage]);

  const totalPages = Math.ceil(currentProducts.length / ITEMS_PER_PAGE);

  const handleTabChange = (isAuction: boolean) => {
    setShowAuction(isAuction);
    setCurrentPage(1);
  };

  const isOwnProfile = String(user?.id) === userId;

  const handleChatClick = () => {
    if (!userId) return;
    if (!isLoggedIn) return navigate('/auth/login');
    if (isOwnProfile) return;

    createRoom.mutate(userId, {
      onSuccess: (roomId) => navigate(`/chat/${roomId}`),
      onError: () => alert(t.chat.cannotOpenRoom),
    });
  };

  if (profileLoading) return <Loading />;
  if (profileError) return <ErrorMessage message={t.user.profileLoadFailed} />;
  if (!profile) return <EmptyState message={t.user.userNotFound} />;

  return (
    <PageContainer>
      <DetailHeader />

      {/* 판매자 프로필 섹션 */}
      <DetailSection className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              src={profile.profile_image || undefined}
              alt={profile.nickname || undefined}
              size="lg"
            />
            <div>
              <h1 className="text-xl font-bold text-text-heading">{profile.nickname}</h1>
            </div>
          </div>
          {!isOwnProfile && (
            <Button onClick={handleChatClick} disabled={createRoom.isPending}>
              {createRoom.isPending ? t.product.connecting : t.product.startChat}
            </Button>
          )}
        </div>
      </DetailSection>

      {/* 판매 상품 목록 */}
      <div>
        <h2 className="text-lg font-bold mb-4">{profile.nickname}{t.user.sellerSalesItems}</h2>
        <div className="mb-4 flex gap-2">
          <Button
            variant={!showAuction ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleTabChange(false)}
          >
            {t.product.regular}
          </Button>
          <Button
            variant={showAuction ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleTabChange(true)}
          >
            {t.auction.auction}
          </Button>
        </div>
        {productsLoading ? (
          <Loading />
        ) : currentProducts.length === 0 ? (
          <EmptyState message={showAuction ? t.auction.noAuctions : t.product.noProducts} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
}

export default SellerProfile;
