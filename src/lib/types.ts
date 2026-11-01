export type ComputerType = '游戏本' | '轻薄本' | '台式机' | '全能本' | '工作站';

export type Platform = '京东自营' | '天猫旗舰店' | '拼多多百亿补贴' | '抖音商城' | '苏宁易购';

export interface ComputerSpecs {
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  screen: string;
  battery?: string;
  weight?: string;
  os?: string;
}

export interface Computer {
  id: string;
  brand: string;
  model: string;
  type: ComputerType;
  price: number;
  originalPrice?: number;
  image: string;
  specs: ComputerSpecs;
  rating: number;
  reviewCount: number;
  popularity: number;
  description: string;
  highlights: string[];
  inStock: boolean;
  platform: Platform;
  shopName: string;
}

export interface FilterState {
  brands: string[];
  types: ComputerType[];
  priceRange: [number, number];
  cpuBrands: string[];
  gpuBrands: string[];
  ramSizes: string[];
  platforms: Platform[];
}

export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'reviews';
