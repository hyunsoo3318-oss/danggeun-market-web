import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { productFormSchema, type ProductFormData } from '@/features/product/hooks/schemas';
import { useImageUpload, ImageUploadSection } from '@/features/image';
import RegionSelectModal from '@/features/location/components/RegionSelectModal';
import { fetchRegionById } from '@/features/location/api/region';

export type { ProductFormData };

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  showIsSold?: boolean;
  showRegion?: boolean;
  showAuctionOption?: boolean;
  isLoading?: boolean;
}

const ProductForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
  showIsSold = false,
  showRegion = false,
  showAuctionOption = true,
  isLoading = false,
}: ProductFormProps) => {
  const t = useTranslation();
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [regionId, setRegionId] = useState<string | undefined>(initialData?.region_id);
  const [regionName, setRegionName] = useState<string>('');

  useEffect(() => {
    if (initialData?.region_id) {
      fetchRegionById(initialData.region_id)
        .then(region => setRegionName(`${region.sigugun} ${region.dong}`))
        .catch(() => setRegionName(''));
    }
  }, [initialData?.region_id]);

  const handleRegionSelect = (id: string, name: string) => {
    setRegionId(id);
    setRegionName(name);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      price: initialData?.price,
      content: initialData?.content ?? '',
      is_sold: initialData?.is_sold ?? false,
      image_ids: initialData?.image_ids ?? [],
      isAuction: initialData?.isAuction ?? false,
      auctionEndAt: initialData?.auctionEndAt ?? '',
    },
  });

  const isAuction = watch('isAuction');

  const {
    images,
    dragOver,
    inputRef,
    containerRef,
    isAnyUploading,
    imageIds,
    openFilePicker,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeImage,
    handleImageError,
  } = useImageUpload({
    initialImageIds: initialData?.image_ids,
    onUploadFailed: () => alert(t.product.imageUploadFailed),
  });

  const wrappedSubmit = handleSubmit(async (data) => {
    if (isAnyUploading) {
      alert(t.product.imageUploadingWait);
      return;
    }
    await onSubmit({ ...data, image_ids: imageIds, region_id: regionId });
  });

  return (
    <form
      onSubmit={wrappedSubmit}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative"
    >
      <div className="mb-2">
        <input
          type="text"
          {...register('title')}
          placeholder={t.product.enterTitle}
          className="w-full text-2xl font-bold text-text-heading bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1"
        />
        {errors.title && <p className="mt-1 text-sm text-status-error">{errors.title.message}</p>}
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder={isAuction ? t.auction.startingPrice : t.product.price}
            min="0"
            className="text-3xl font-bold text-primary bg-transparent border-b border-dashed border-border-medium focus:border-primary outline-none pb-1 w-40"
          />
          <span className="text-3xl font-bold text-primary">{t.common.won}</span>
        </div>
        {errors.price && <p className="mt-1 text-sm text-status-error">{errors.price.message}</p>}
      </div>

      {showAuctionOption && (
        <>
          <div className="mb-6 flex flex-col gap-3">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={!isAuction ? "primary" : "secondary"}
                onClick={() => setValue('isAuction', false)}
              >
                {t.product.regular}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={isAuction ? "primary" : "secondary"}
                onClick={() => setValue('isAuction', true)}
              >
                {t.auction.auction}
              </Button>
            </div>
            {isAuction && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">{t.auction.endDate}:</span>
                <input
                  type="datetime-local"
                  {...register('auctionEndAt')}
                  className="text-sm bg-transparent border border-border-medium rounded px-2 py-1 focus:border-primary outline-none"
                />
              </div>
            )}
          </div>
          {errors.auctionEndAt && <p className="mb-4 text-sm text-status-error">{errors.auctionEndAt.message}</p>}
        </>
      )}

      {showRegion && (
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">{t.product.region}:</span>
            <button
              type="button"
              onClick={() => setRegionModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-text-primary bg-bg-secondary hover:bg-bg-tertiary rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{regionName || t.location.allRegions}</span>
            </button>
          </div>
          <RegionSelectModal
            isOpen={regionModalOpen}
            onClose={() => setRegionModalOpen(false)}
            onSelect={handleRegionSelect}
            initialRegionId={regionId}
          />
        </div>
      )}

      <div className="mt-6 border-t border-border-base pt-6">
        <textarea
          {...register('content')}
          rows={6}
          className="w-full bg-transparent text-text-body leading-relaxed outline-none border-b border-dashed border-border-medium focus:border-primary resize-none"
          placeholder={t.product.enterDescription}
        />
        {errors.content && <p className="mt-1 text-sm text-status-error">{errors.content.message}</p>}
      </div>

      <ImageUploadSection
        images={images}
        dragOver={dragOver}
        inputRef={inputRef}
        containerRef={containerRef}
        onFileChange={handleFileChange}
        onOpenPicker={openFilePicker}
        onRemove={removeImage}
        onImageError={handleImageError}
        labels={{
          select: t.product.imagesSelect,
          dropzone: t.product.imagesDropzone,
          selected: t.product.imagesSelected,
          none: t.product.imagesNone,
          delete: t.common.delete,
        }}
      />

      <div className="flex items-center justify-end pt-6 mt-6 border-t border-border-base">
        {showIsSold && (
          <label className="flex items-center gap-2 cursor-pointer mr-auto">
            <input type="checkbox" {...register('is_sold')} className="w-4 h-4 accent-primary" />
            <span className="text-sm text-text-secondary">{t.product.soldOut}</span>
          </label>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" type="button" onClick={onCancel}>
            {t.common.cancel}
          </Button>
          <Button size="sm" type="submit" disabled={isLoading}>
            {isLoading ? t.common.processing : (submitLabel || t.common.save)}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
