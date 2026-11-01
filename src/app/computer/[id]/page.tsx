'use client';

import { use } from 'react';
import { computers } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Star,
  Cpu,
  Monitor,
  HardDrive,
  MemoryStick,
  Battery,
  Weight,
  Laptop,
  Check,
  Share2,
  ShoppingCart,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ComputerDetailPage({ params }: DetailPageProps) {
  const { id } = use(params);
  const computer = computers.find((c) => c.id === id);

  if (!computer) {
    notFound();
  }

  const discount = computer.originalPrice
    ? Math.round(((computer.originalPrice - computer.price) / computer.originalPrice) * 100)
    : 0;

  const specItems = [
    { icon: <Cpu className="h-5 w-5" />, label: '处理器', value: computer.specs.cpu },
    { icon: <MemoryStick className="h-5 w-5" />, label: '显卡', value: computer.specs.gpu },
    { icon: <Monitor className="h-5 w-5" />, label: '内存', value: computer.specs.ram },
    { icon: <HardDrive className="h-5 w-5" />, label: '存储', value: computer.specs.storage },
    { icon: <Monitor className="h-5 w-5" />, label: '屏幕', value: computer.specs.screen },
    ...(computer.specs.battery
      ? [{ icon: <Battery className="h-5 w-5" />, label: '电池', value: computer.specs.battery }]
      : []),
    ...(computer.specs.weight
      ? [{ icon: <Weight className="h-5 w-5" />, label: '重量', value: computer.specs.weight }]
      : []),
    ...(computer.specs.os
      ? [{ icon: <Laptop className="h-5 w-5" />, label: '操作系统', value: computer.specs.os }]
      : []),
  ];

  // Find similar products
  const similar = computers
    .filter((c) => c.id !== computer.id && (c.brand === computer.brand || c.type === computer.type))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600">
              <ArrowLeft className="h-4 w-4" />
              返回列表
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="h-4 w-4" />
            分享
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Image */}
          <div className="relative rounded-xl overflow-hidden bg-white border border-gray-200">
            <img
              src={computer.image}
              alt={`${computer.brand} ${computer.model}`}
              className="w-full aspect-[4/3] object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 hover:bg-red-500 text-white">
                  限时优惠 -{discount}%
                </Badge>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  computer.type === '游戏本' && 'border-purple-200 text-purple-700 bg-purple-50',
                  computer.type === '轻薄本' && 'border-sky-200 text-sky-700 bg-sky-50',
                  computer.type === '台式机' && 'border-emerald-200 text-emerald-700 bg-emerald-50',
                  computer.type === '全能本' && 'border-amber-200 text-amber-700 bg-amber-50',
                  computer.type === '工作站' && 'border-rose-200 text-rose-700 bg-rose-50'
                )}
              >
                {computer.type}
              </Badge>
            </div>

            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              {computer.brand}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
              {computer.model}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-4 w-4',
                      star <= Math.round(computer.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">{computer.rating}</span>
              <span className="text-sm text-gray-500">
                ({computer.reviewCount.toLocaleString()} 条评价)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-red-600">
                ¥{computer.price.toLocaleString()}
              </span>
              {computer.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ¥{computer.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              {computer.description}
            </p>

            {/* Highlights */}
            <div className="mt-4 space-y-2">
              {computer.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="text-sm text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2 flex-1">
                <ShoppingCart className="h-4 w-4" />
                立即购买
              </Button>
              <Button variant="outline" className="gap-2">
                加入购物车
              </Button>
            </div>

            {/* Stock Status */}
            <div className="mt-3 flex items-center gap-2">
              <div className={cn('h-2 w-2 rounded-full', computer.inStock ? 'bg-green-500' : 'bg-red-500')} />
              <span className="text-xs text-gray-500">
                {computer.inStock ? '有货 - 预计3天内发货' : '暂时缺货'}
              </span>
            </div>
          </div>
        </div>

        {/* Specs Section */}
        <Separator className="my-8" />

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">详细配置</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specItems.map((item) => (
              <Card
                key={item.label}
                className="flex items-center gap-4 p-4 border border-gray-200 bg-white"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50 text-blue-500 shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.value}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Similar Products */}
        {similar.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">相似推荐</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similar.map((item) => (
                  <Link key={item.id} href={`/computer/${item.id}`}>
                    <Card className="overflow-hidden border border-gray-200 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={item.image}
                          alt={`${item.brand} ${item.model}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500">{item.brand}</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.model}
                        </p>
                        <p className="text-sm font-bold text-red-600 mt-1">
                          ¥{item.price.toLocaleString()}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
