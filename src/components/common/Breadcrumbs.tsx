import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  page?: string;
  params?: Record<string, string>;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigateTo, t } = useApp();

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500 font-medium">
        <li>
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1 hover:text-emerald-700 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('navHome')}</span>
          </button>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            {item.active || !item.page ? (
              <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => navigateTo(item.page!, item.params)}
                className="hover:text-emerald-700 transition truncate max-w-[150px]"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
