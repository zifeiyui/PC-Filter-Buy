'use client';

import type { Computer } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Monitor, Cpu, HardDrive, MemoryStick, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  computer: Computer;
}

export function ProductCard({ computer }: ProductCardProps) {
  const discount = computer.originalPrice
    ? Math.round(((computer.originalPrice - computer.price) / computer.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden border border-gray-200 bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col">
      {/* Image - links to detail page */}
      <Link href={`/computer/${computer.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            src={computer.image}
            alt={`${computer.brand} ${computer.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs">
                -{discount}%
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <Badge
              variant="outline"
              className={cn(
                'bg-white/90 backdrop-blur-sm text-xs',
                computer.type === '游戏本' && 'border-purple-200 text-purple-700',
                computer.type === '轻薄本' && 'border-sky-200 text-sky-700',
                computer.type === '台式机' && 'border-emerald-200 text-emerald-700',
                computer.type === '全能本' && 'border-amber-200 text-amber-700',
                computer.type === '工作站' && 'border-rose-200 text-rose-700'
              )}
            >
              {computer.type}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'bg-white/90 backdrop-blur-sm text-xs',
                computer.platform === '京东自营' && 'border-red-200 text-red-600',
                computer.platform === '天猫旗舰店' && 'border-orange-200 text-orange-600',
                computer.platform === '拼多多百亿补贴' && 'border-rose-200 text-rose-600',
                computer.platform === '抖音商城' && 'border-gray-200 text-gray-700',
                computer.platform === '苏宁易购' && 'border-yellow-200 text-yellow-700'
              )}
            >
              {computer.platform}
            </Badge>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3 flex flex-col flex-1">
        {/* Brand & Model - links to detail page */}
        <Link href={`/computer/${computer.id}`}>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {computer.brand}
            </p>
            <h3 className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2 leading-snug hover:text-blue-600 transition-colors">
              {computer.model}
            </h3>
          </div>
        </Link>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-1.5">
          <SpecTag icon={<Cpu className="h-3 w-3" />} text={computer.specs.cpu.split('(')[0].trim()} />
          <SpecTag icon={<Monitor className="h-3 w-3" />} text={computer.specs.ram} />
          <SpecTag icon={<HardDrive className="h-3 w-3" />} text={computer.specs.storage} />
          <SpecTag icon={<MemoryStick className="h-3 w-3" />} text={computer.specs.gpu.split(' ').slice(0, 3).join(' ')} />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-3.5 w-3.5',
                  star <= Math.round(computer.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-gray-200 text-gray-200'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {computer.rating} ({computer.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-red-600">
            ¥{computer.price.toLocaleString()}
          </span>
          {computer.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ¥{computer.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* JD Purchase Link */}
        <a
          href="https://www.jd.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto"
        >
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2 text-sm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            去京东购买
          </Button>
        </a>
      </div>
    </Card>
  );
}

function SpecTag({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-md px-2 py-1.5">
      {icon}
      <span className="truncate">{text}</span>
    </div>
  );
}
