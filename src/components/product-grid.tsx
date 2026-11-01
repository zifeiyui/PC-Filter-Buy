'use client';

import type { Computer } from '@/lib/types';
import { ProductCard } from './product-card';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  computers: Computer[];
}

export function ProductGrid({ computers }: ProductGridProps) {
  if (computers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <PackageSearch className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          未找到匹配的电脑
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          尝试调整筛选条件，或清除部分筛选项以查看更多结果
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 p-4 lg:p-6">
      {computers.map((computer) => (
        <ProductCard key={computer.id} computer={computer} />
      ))}
    </div>
  );
}
