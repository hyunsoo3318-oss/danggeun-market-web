import { Link } from 'react-router-dom';
import { Button } from '../display/Button';

export interface Tab<T extends string = string> {
  id: T;
  label: string;
  to?: string;
}

interface TabBarProps<T extends string = string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange?: (tabId: T) => void;
}

export function TabBar<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
}: TabBarProps<T>) {
  const getClassName = (isActive: boolean) => `
    px-4 py-2 border-b-2 rounded-none bg-transparent
    ${isActive
      ? 'border-primary text-text-heading font-bold'
      : 'border-transparent text-text-secondary font-normal hover:text-text-heading'
    }
  `;

  return (
    <div className="flex gap-2 mb-[30px] border-b border-border-base pb-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        if (tab.to) {
          return (
            <Link key={tab.id} to={tab.to} className={getClassName(isActive)}>
              {tab.label}
            </Link>
          );
        }

        return (
          <Button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            variant="ghost"
            className={getClassName(isActive)}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
