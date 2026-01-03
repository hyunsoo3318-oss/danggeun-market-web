import { Button } from './Button';

export interface SelectOption {
  value: string;
  label: string;
}

interface CategorySelectorProps {
  options: SelectOption[];
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
  title?: string;
}

export default function CategorySelector({
  options,
  selected,
  onSelect,
  className = '',
  title
}: CategorySelectorProps) {
  return (
    <div className={className}>
      {title && (
        <h3 className="text-base font-bold mb-3 text-text-primary">
          {title}
        </h3>
      )}
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => {
          const isActive = selected === option.value;
          return (
            <Button
              key={option.value}
              onClick={() => onSelect(option.value)}
              variant={isActive ? 'primary' : 'secondary'}
              size="sm"
              className="rounded-full"
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
