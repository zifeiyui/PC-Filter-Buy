'use client';

import type { SortOption } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';

interface SortBarProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onFilterToggle: () => void;
  resultCount: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: '综合推荐' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'rating', label: '评分最高' },
  { value: 'reviews', label: '评论最多' },
];

export function SortBar({
  currentSort,
  onSortChange,
  onFilterToggle,
  resultCount,
}: SortBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 lg:px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden gap-1.5"
          onClick={onFilterToggle}
        >
          <SlidersHorizontal className="h-4 w-4" />
          筛选
        </Button>
        <span className="text-sm text-gray-500 hidden sm:inline">
          共 <span className="font-medium text-gray-900">{resultCount}</span> 款
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <ArrowUpDown className="h-4 w-4 text-gray-400 mr-1 hidden sm:block" />
        <div className="flex items-center gap-1 overflow-x-auto">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              className={cn(
                'text-xs whitespace-nowrap transition-colors',
                currentSort === option.value
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              )}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
