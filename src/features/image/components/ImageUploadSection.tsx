import { RefObject } from 'react';
import { Button, CardImage } from '@/shared/ui';
import type { UploadEntry } from '../hooks';

type ImageUploadSectionProps = {
  images: UploadEntry[];
  dragOver: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenPicker: () => void;
  onRemove: (id?: string, previewUrl?: string) => void;
  onImageError: (clientId: string) => void;
  labels: {
    select: string;
    dropzone: string;
    selected: string;
    none: string;
    delete: string;
  };
};

export function ImageUploadSection({
  images,
  dragOver,
  inputRef,
  containerRef,
  onFileChange,
  onOpenPicker,
  onRemove,
  onImageError,
  labels,
}: ImageUploadSectionProps) {
  return (
    <div className="mt-4">
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFileChange} className="hidden" />
      <div className="mb-2">
        <div className={`flex flex-col items-center justify-center gap-2 py-4 ${dragOver ? 'text-primary' : 'text-text-secondary'}`}>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onOpenPicker}
            className={`px-3 ${dragOver ? 'text-primary border-primary' : ''}`}
          >
            {labels.select}
          </Button>
          <div className="text-sm mt-2">{labels.dropzone}</div>
        </div>
        <div className="flex justify-end mt-2">
          <div className="text-sm text-text-secondary">{labels.selected.replace('{count}', String(images.length))}</div>
        </div>
      </div>

      <div ref={containerRef} className="flex gap-3 mt-3 flex-wrap items-start">
        {images.length === 0 && (
          <div className="text-sm text-text-secondary ml-1">{labels.none}</div>
        )}
        {images.map((img, idx) => (
          <div key={img.clientId} className="relative" data-clientid={img.clientId}>
            <CardImage
              src={img.previewUrl ?? img.image_url ?? undefined}
              alt={`preview-${idx}`}
              className="w-28 h-28"
              onError={() => onImageError(img.clientId)}
            />

            {img.uploading && (
              <div className="absolute top-0 left-0 w-28 h-28 bg-black bg-opacity-40 flex items-center justify-center rounded-xl">
                <div className="text-white text-sm">{img.progress}%</div>
              </div>
            )}

            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={(e) => { e.stopPropagation(); onRemove(img.id, img.previewUrl); }}
              className="absolute -top-2 -right-2"
              aria-label="remove image"
            >
              {labels.delete}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
