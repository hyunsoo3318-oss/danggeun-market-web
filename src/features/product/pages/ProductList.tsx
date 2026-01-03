import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/features/product/components/list/ProductCard";
import SearchBar from "@/features/product/components/list/SearchBar";
import { useProducts } from "@/features/product/hooks/useProducts";
import { PageContainer } from "@/shared/layouts/PageContainer";
import { DataListLayout } from "@/shared/layouts/DataListLayout";
import { useRegionSelection } from "@/features/location/hooks/useRegionSelection";
import RegionSelector from "@/features/location/components/RegionSelector";
import RegionSelectModal from "@/features/location/components/RegionSelectModal";
import { useTranslation } from "@/shared/i18n";
import { Button } from "@/shared/ui";
import { useProductFilters } from "@/features/product/store/productFiltersStore";

export default function ProductList() {
  const t = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    currentRegionId,
    currentRegionName,
    currentSido,
    currentSigugun,
    isModalOpen,
    openModal,
    closeModal,
    handleRegionSelect,
    handleSidoSelect,
    handleSigugunSelect,
  } = useRegionSelection();

  const [searchQuery, setSearchQuery] = useState("");

  // URL 쿼리 파라미터에서 auction 값 읽기 (기본값: false)
  const auctionParam = searchParams.get("auction");
  const showAuction = auctionParam === "true";

  // Sync current filters to store for navigation persistence
  const { setFilters } = useProductFilters();
  useEffect(() => {
    setFilters({
      region: currentRegionId,
      sido: currentSido,
      sigugun: currentSigugun,
      auction: showAuction,
    });
  }, [currentRegionId, currentSido, currentSigugun, showAuction, setFilters]);

  const handleAuctionChange = (value: boolean) => {
    setSearchParams((prev) => {
      prev.set("auction", String(value));
      return prev;
    });
  };

  // 지역 필터: 동 단위, 시/구/군 단위, 시/도 단위 모두 지원
  const { products, loading, error } = useProducts({
    search: searchQuery,
    regionId: currentRegionId,
    sido: currentSido,
    sigugun: currentSigugun,
    auction: showAuction,
  });

  const filterOptions = [
    { value: false, label: t.product.regular },
    { value: true, label: t.auction.auction },
  ] as const;

  return (
    <PageContainer title={t.product.usedGoods}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <RegionSelector regionName={currentRegionName} onClick={openModal} />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <div className="mb-4 flex gap-2">
        {filterOptions.map((opt) => (
          <Button
            key={String(opt.value)}
            variant={showAuction === opt.value ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleAuctionChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <DataListLayout
        isLoading={loading}
        error={error}
        isEmpty={products.length === 0}
        emptyMessage={searchQuery ? t.product.noSearchResults : t.product.noProducts}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </DataListLayout>
      <RegionSelectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelect={handleRegionSelect}
        onSelectSido={handleSidoSelect}
        onSelectSigugun={handleSigugunSelect}
        initialRegionId={currentRegionId}
      />
    </PageContainer>
  );
}
