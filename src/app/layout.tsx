import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '电脑筛选 - 找到最适合你的电脑',
  description: '专业的电脑筛选工具，支持按品牌、价格、配置、类型等多维度筛选，帮助你快速找到最适合自己的电脑产品。',
  keywords: ['电脑筛选', '笔记本推荐', '游戏本', '轻薄本', '台式机', '电脑配置对比'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
