import { useTranslation } from '@/shared/i18n';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const t = useTranslation();

  return (
    <div className="flex items-center bg-bg-page border border-border-dark rounded-xl overflow-hidden transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 w-75 sm:w-100">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t.product.enterSearchQuery}
        className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-text-primary placeholder:text-text-placeholder"
      />
    </div>
  );
}
