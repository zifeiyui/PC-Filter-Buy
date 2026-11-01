'use client';

import { brands, cpuBrands, gpuBrands, ramSizes, computerTypes, priceRanges, platforms } from '@/lib/data';
import type { FilterState, ComputerType, Platform } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const defaultFilters: FilterState = {
  brands: [],
  types: [],
  priceRange: [0, Infinity],
  cpuBrands: [],
  gpuBrands: [],
  ramSizes: [],
  platforms: [],
};

export function FilterSidebar({
  filters,
  onFilterChange,
  resultCount,
  isMobileOpen = false,
  onMobileClose,
}: FilterSidebarProps) {
  const toggleArrayFilter = <T extends string>(
    key: keyof FilterState,
    value: T
  ) => {
    const current = filters[key] as T[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const setPriceRange = (min: number, max: number) => {
    if (filters.priceRange[0] === min && filters.priceRange[1] === max) {
      onFilterChange({ ...filters, priceRange: [0, Infinity] });
    } else {
      onFilterChange({ ...filters, priceRange: [min, max] });
    }
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.types.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== Infinity ||
    filters.cpuBrands.length > 0 ||
    filters.gpuBrands.length > 0 ||
    filters.ramSizes.length > 0 ||
    filters.platforms.length > 0;

  const clearAll = () => {
    onFilterChange(defaultFilters);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 pb-2">
        <h2 className="text-lg font-semibold text-gray-900">筛选条件</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              清除全部
            </Button>
          )}
          {isMobileOpen && onMobileClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 pb-2">
        <p className="text-sm text-gray-500">
          共找到 <span className="font-medium text-gray-900">{resultCount}</span> 款电脑
        </p>
      </div>

      <Separator />

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 品牌 */}
        <FilterSection title="品牌">
          <div className="space-y-2">
            {brands.map((brand) => (
              <FilterCheckbox
                key={brand}
                label={brand}
                checked={filters.brands.includes(brand)}
                onChange={() => toggleArrayFilter('brands', brand)}
              />
            ))}
          </div>
        </FilterSection>

        {/* 卖方平台 */}
        <FilterSection title="卖方平台">
          <div className="space-y-2">
            {platforms.map((platform) => (
              <FilterCheckbox
                key={platform}
                label={platform}
                checked={filters.platforms.includes(platform as Platform)}
                onChange={() => toggleArrayFilter('platforms', platform as Platform)}
              />
            ))}
          </div>
        </FilterSection>

        {/* 类型 */}
        <FilterSection title="类型">
          <div className="space-y-2">
            {computerTypes.map((type) => (
              <FilterCheckbox
                key={type}
                label={type}
                checked={filters.types.includes(type as ComputerType)}
                onChange={() => toggleArrayFilter('types', type as ComputerType)}
              />
            ))}
          </div>
        </FilterSection>

        {/* 价格区间 */}
        <FilterSection title="价格区间">
          <div className="space-y-2">
            {priceRanges.map((range) => {
              const isActive =
                filters.priceRange[0] === range.min &&
                filters.priceRange[1] === range.max;
              return (
                <Button
                  key={range.label}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'w-full justify-start text-sm',
                    isActive
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  )}
                  onClick={() => setPriceRange(range.min, range.max)}
                >
                  {range.label}
                </Button>
              );
            })}
          </div>
        </FilterSection>

        {/* 处理器 */}
        <FilterSection title="处理器品牌">
          <div className="space-y-2">
            {cpuBrands.map((cpu) => (
              <FilterCheckbox
                key={cpu}
                label={cpu}
                checked={filters.cpuBrands.includes(cpu)}
                onChange={() => toggleArrayFilter('cpuBrands', cpu)}
              />
            ))}
          </div>
        </FilterSection>

        {/* 显卡 */}
        <FilterSection title="显卡品牌">
          <div className="space-y-2">
            {gpuBrands.map((gpu) => (
              <FilterCheckbox
                key={gpu}
                label={gpu}
                checked={filters.gpuBrands.includes(gpu)}
                onChange={() => toggleArrayFilter('gpuBrands', gpu)}
              />
            ))}
          </div>
        </FilterSection>

        {/* 内存 */}
        <FilterSection title="内存容量">
          <div className="space-y-2">
            {ramSizes.map((ram) => (
              <FilterCheckbox
                key={ram}
                label={ram}
                checked={filters.ramSizes.includes(ram)}
                onChange={() => toggleArrayFilter('ramSizes', ram)}
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] shrink-0 border-r border-gray-200 bg-white">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
      />
      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
}
