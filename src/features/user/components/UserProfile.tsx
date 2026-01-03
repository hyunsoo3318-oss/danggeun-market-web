import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProducts, useCreateProduct } from "@/features/product/hooks/useProducts";
import { EmptyState, Button, DetailSection, Pagination } from '@/shared/ui';
import ProductCard from "@/features/product/components/list/ProductCard";
import ProductForm from "@/features/product/components/form/ProductForm";
import { useTranslation } from '@/shared/i18n';

import { useUser } from '@/features/user/hooks/useUser';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { OnboardingRequired } from '@/shared/ui';

const ITEMS_PER_PAGE = 8;

const UserProfile = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const createProduct = useCreateProduct();

  const [showForm, setShowForm] = useState(false);
  const [showAuction, setShowAuction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { products: regularProducts } = useUserProducts('me', undefined, undefined, false);
  const { products: auctionProducts } = useUserProducts('me', undefined, undefined, true);

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

  const handleSubmit = async (data: { title: string; price: number; content: string; image_ids?: string[]; isAuction?: boolean; auctionEndAt?: string }) => {
    const { isAuction, auctionEndAt, ...productData } = data;
    const newProduct = await createProduct.mutateAsync({
      ...productData,
      image_ids: productData.image_ids ?? [],
      category_id: '1',
      ...(isAuction && auctionEndAt ? { auction: { end_at: new Date(auctionEndAt).toISOString() } } : {}),
    });
    alert(isAuction ? t.auction.registered : t.product.productRegistered);
    setShowForm(false);
    navigate(`/products/${newProduct.id}`);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const { needsOnboarding } = useUser();

  if (needsOnboarding) {
      return (
        <PageContainer title="채팅">
          <OnboardingRequired />
        </PageContainer>
      );
    }

  return (
    <div className="flex flex-col gap-6">
      {!showForm ? (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setShowForm(true)}>
            {t.product.registerProduct}
          </Button>
        </div>
      ) : (
        <DetailSection>
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createProduct.isPending}
          />
        </DetailSection>
      )}

      <div>
        <h3 className="text-lg font-bold mb-4">{t.product.mySalesItems}</h3>
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
        {currentProducts.length === 0 ? (
          <EmptyState message={showAuction ? t.auction.noAuctions : t.product.noSalesItems} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
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
    </div>
  );
};

export default UserProfile;
