'use client';

import { useState, useMemo, useCallback } from 'react';
import { computers as localComputers } from '@/lib/data';
import type { Computer, FilterState, SortOption } from '@/lib/types';
import { FilterSidebar } from '@/components/filter-sidebar';
import { SortBar } from '@/components/sort-bar';
import { ProductGrid } from '@/components/product-grid';
import { Monitor, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const defaultFilters: FilterState = {
  brands: [],
  types: [],
  priceRange: [0, Infinity],
  cpuBrands: [],
  gpuBrands: [],
  ramSizes: [],
  platforms: [],
};

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [computers, setComputers] = useState<Computer[]>(localComputers);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch real data from API
  const fetchRealData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/computers');
      if (res.ok) {
        const data = await res.json();
        if (data.computers && data.computers.length > 0) {
          setComputers(data.computers);
        }
      }
    } catch {
      // Fallback to local data on error
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = computers.filter((computer) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchModel = computer.model.toLowerCase().includes(query);
        const matchBrand = computer.brand.toLowerCase().includes(query);
        if (!matchModel && !matchBrand) return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(computer.brand)) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(computer.type)) {
        return false;
      }

      // Price range filter
      if (
        computer.price < filters.priceRange[0] ||
        computer.price > filters.priceRange[1]
      ) {
        return false;
      }

      // CPU brand filter
      if (filters.cpuBrands.length > 0) {
        const cpuMatch = filters.cpuBrands.some((cpu) =>
          computer.specs.cpu.toLowerCase().includes(cpu.toLowerCase())
        );
        if (!cpuMatch) return false;
      }

      // GPU brand filter
      if (filters.gpuBrands.length > 0) {
        const gpuMatch = filters.gpuBrands.some((gpu) =>
          computer.specs.gpu.toLowerCase().includes(gpu.toLowerCase())
        );
        if (!gpuMatch) return false;
      }

      // RAM size filter
      if (filters.ramSizes.length > 0) {
        const ramMatch = filters.ramSizes.some((ram) =>
          computer.specs.ram.includes(ram)
        );
        if (!ramMatch) return false;
      }

      // Platform filter
      if (filters.platforms.length > 0 && !filters.platforms.includes(computer.platform)) {
        return false;
      }

      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    return result;
  }, [computers, filters, sortBy, searchQuery]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={filteredAndSorted.length}
        isMobileOpen={mobileFilterOpen}
        onMobileClose={() => setMobileFilterOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header with Search */}
        <header className="flex items-center gap-3 px-4 lg:px-6 py-3 bg-white border-b border-gray-200">
          <Monitor className="h-6 w-6 text-blue-500 shrink-0" />
          <div className="hidden sm:block shrink-0">
            <h1 className="text-lg font-bold text-gray-900">电脑筛选</h1>
          </div>
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索电脑名称或品牌..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-gray-50 border-gray-200 focus:bg-white text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                清除
              </button>
            )}
          </div>
          {/* Fetch Real Data Button */}
          <button
            onClick={fetchRealData}
            disabled={isLoadingData}
            className="shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50"
          >
            {isLoadingData ? '加载中...' : '获取实时报价'}
          </button>
        </header>

        {/* Sort Bar */}
        <SortBar
          currentSort={sortBy}
          onSortChange={handleSortChange}
          onFilterToggle={() => setMobileFilterOpen(true)}
          resultCount={filteredAndSorted.length}
        />

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto">
          <ProductGrid computers={filteredAndSorted} />
        </div>
      </main>
    </div>
  );
}
