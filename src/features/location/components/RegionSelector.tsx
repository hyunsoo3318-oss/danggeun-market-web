interface RegionSelectorProps {
  regionName: string;
  onClick: () => void;
}

export default function RegionSelector({ regionName, onClick }: RegionSelectorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-primary"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
      <span>{regionName}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-text-secondary"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
