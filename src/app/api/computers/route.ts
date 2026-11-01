import { NextResponse } from 'next/server';
import { computers as localComputers } from '@/lib/data';
import type { Computer } from '@/lib/types';

/**
 * GET /api/computers
 *
 * 尝试从公开 API 获取电脑配件实时报价。
 * 策略：
 *   1. 调用公开硬件价格 API（如 PCPartPicker / OpenLattice 等）
 *   2. 若外部 API 不可用，则基于本地数据生成带随机波动的模拟报价
 *
 * 注意：真实电商 API（京东/淘宝）需要商家授权，此处演示通用接入模式。
 * 如果你有具体的 API 接口，可以替换下方 EXTERNAL_API_URL 和解析逻辑。
 */

// 可替换为你自己的公开 API 地址
const EXTERNAL_API_URL = process.env.COMPUTER_PRICE_API_URL || '';

interface ExternalPriceItem {
  name: string;
  price: number;
  currency: string;
  source: string;
  lastUpdated: string;
}

/**
 * 尝试从外部 API 获取价格数据
 * 如果配置了 EXTERNAL_API_URL，则尝试请求；否则直接返回 null
 */
async function fetchExternalPrices(): Promise<ExternalPriceItem[] | null> {
  if (!EXTERNAL_API_URL) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(EXTERNAL_API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // 通用解析：假设 API 返回 { items: [{ name, price, currency, source, lastUpdated }] }
    if (Array.isArray(data?.items)) {
      return data.items;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * 基于本地数据生成带价格波动的模拟报价
 * 模拟真实场景中价格会因促销、库存等因素波动
 */
function generateSimulatedPrices(baseComputers: Computer[]): Computer[] {
  return baseComputers.map((computer) => {
    // 模拟价格波动：在原价基础上 ±3% 浮动
    const fluctuation = 1 + (Math.random() * 0.06 - 0.03);
    const newPrice = Math.round(computer.price * fluctuation / 100) * 100;

    return {
      ...computer,
      price: newPrice,
      originalPrice: computer.price,
    };
  });
}

export async function GET() {
  const timestamp = new Date().toISOString();

  // 尝试获取外部数据
  const externalPrices = await fetchExternalPrices();

  if (externalPrices && externalPrices.length > 0) {
    // 如果有外部数据，尝试匹配并更新本地电脑价格
    const updatedComputers = localComputers.map((computer) => {
      const match = externalPrices.find(
        (item) =>
          item.name.toLowerCase().includes(computer.brand.toLowerCase()) &&
          item.name.toLowerCase().includes(computer.model.toLowerCase().split(' ')[0])
      );

      if (match) {
        return {
          ...computer,
          price: match.price,
          originalPrice: computer.price,
        };
      }
      return computer;
    });

    return NextResponse.json({
      computers: updatedComputers,
      source: 'external_api',
      lastUpdated: timestamp,
      message: '已从外部 API 获取实时报价',
    });
  }

  // 外部 API 不可用，使用模拟报价
  const simulatedComputers = generateSimulatedPrices(localComputers);

  return NextResponse.json({
    computers: simulatedComputers,
    source: 'simulated',
    lastUpdated: timestamp,
    message: '外部 API 暂不可用，已生成模拟报价（基于本地数据 ±3% 波动）',
    apiNote: '如需接入真实数据，请设置环境变量 COMPUTER_PRICE_API_URL 指向你的价格 API 接口',
  });
}
