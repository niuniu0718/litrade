import dayjs from 'dayjs';
import type {
  ProductCode,
  PricePoint,
  PriceSnapshot,
} from '../types';

// ============ 工具函数 ============

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateCandleSeries(
  basePrice: number,
  days: number,
  volatility: number
): PricePoint[] {
  const points: PricePoint[] = [];
  let price = basePrice;

  for (let i = days; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    // 跳过周末
    const dow = dayjs().subtract(i, 'day').day();
    if (dow === 0 || dow === 6) continue;

    const change = price * volatility * (Math.random() - 0.48); // 轻微下行偏移模拟近期行情
    const open = price;
    const close = Math.round((price + change) * 100) / 100;
    const high = Math.round((Math.max(open, close) * (1 + Math.random() * volatility * 0.5)) * 100) / 100;
    const low = Math.round((Math.min(open, close) * (1 - Math.random() * volatility * 0.5)) * 100) / 100;

    points.push({
      date,
      open,
      close,
      high,
      low,
      volume: Math.round(randomBetween(500, 5000)),
    });

    price = close;
  }
  return points;
}

// ============ 品种基准参数 ============

interface ProductProfile {
  basePrice: number;
  volatility: number;
}

const PROFILES: Record<ProductCode, ProductProfile> = {
  li2co3_battery: { basePrice: 174000, volatility: 0.02 },
  li2co3_industrial: { basePrice: 168000, volatility: 0.02 },
  lioh: { basePrice: 156000, volatility: 0.022 },
  spodumene: { basePrice: 1950, volatility: 0.018 }, // 美元/吨
};

// ============ 生成行情数据 ============

export function generatePriceHistory(code: ProductCode, days = 365): PricePoint[] {
  const profile = PROFILES[code];
  return generateCandleSeries(profile.basePrice, days, profile.volatility);
}

export function generatePriceSnapshot(code: ProductCode): PriceSnapshot {
  const profile = PROFILES[code];
  const history = generateCandleSeries(profile.basePrice, 365, profile.volatility);
  const current = history[history.length - 1];
  const prev = history[history.length - 2] ?? current;

  const prices = history.map((p) => p.close);
  const high52w = Math.max(...prices);
  const low52w = Math.min(...prices);

  return {
    product: code,
    price: current.close,
    change: Math.round((current.close - prev.close) * 100) / 100,
    changePercent: Math.round(((current.close - prev.close) / prev.close) * 10000) / 100,
    high52w,
    low52w,
    updatedAt: new Date().toISOString(),
  };
}
