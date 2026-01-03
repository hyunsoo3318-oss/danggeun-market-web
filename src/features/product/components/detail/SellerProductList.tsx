import { useState, useMemo } from 'react';
import { useTranslation } from '@/shared/i18n';
import { useDetail } from '@/features/product/hooks/DetailContext';
import ProductCard from '@/features/product/components/list/ProductCard';
import { Button, Pagination } from '@/shared/ui';

const ITEMS_PER_PAGE = 4;

export function SellerProductList() {
  const t = useTranslation();
  const { product, sellerProducts, sellerAuctions, sellerProfile } = useDetail();

  const [showAuction, setShowAuction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return (sellerProducts || []).filter(p => p.owner_id === product.owner_id && p.id !== product.id);
  }, [sellerProducts, product.owner_id, product.id]);

  const filteredAuctions = useMemo(() => {
    return (sellerAuctions || []).filter(p => p.owner_id === product.owner_id && p.id !== product.id);
  }, [sellerAuctions, product.owner_id, product.id]);

  const currentItems = showAuction ? filteredAuctions : filteredProducts;

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return currentItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentItems, currentPage]);

  const totalPages = Math.ceil(currentItems.length / ITEMS_PER_PAGE);

  const handleTabChange = (isAuction: boolean) => {
    setShowAuction(isAuction);
    setCurrentPage(1);
  };

  if (filteredProducts.length === 0 && filteredAuctions.length === 0) return null;

  const nickname = sellerProfile?.nickname || t.product.seller;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">
        {nickname}{t.product.salesItems}
      </h3>
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
      {currentItems.length === 0 ? (
        <p className="text-text-muted text-sm">
          {showAuction ? t.auction.noAuctions : t.product.noProducts}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedItems.map(p => (
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
  );
}
