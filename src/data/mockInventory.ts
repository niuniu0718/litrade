import type {
  InventoryOverview,
  InventoryTrend,
  InventoryPriceRelation,
  InventoryCycle,
} from '../types/inventory';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateInventoryOverview(): InventoryOverview {
  return {
    li2co3: {
      product: '电池级碳酸锂',
      currentStock: Math.round(randomBetween(25000, 45000)),
      momChange: Math.round(randomBetween(-8, 5) * 10) / 10,
      stockConsumptionRatio: Math.round(randomBetween(15, 35) * 10) / 10,
    },
    lioh: {
      product: '氢氧化锂',
      currentStock: Math.round(randomBetween(8000, 18000)),
      momChange: Math.round(randomBetween(-6, 8) * 10) / 10,
      stockConsumptionRatio: Math.round(randomBetween(12, 28) * 10) / 10,
    },
  };
}

export function generateInventoryTrend(): InventoryTrend[] {
  const data: InventoryTrend[] = [];
  let li2co3Base = 38000;
  let liohBase = 12000;

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    li2co3Base = Math.round((li2co3Base + randomBetween(-3000, 2500)) * 10) / 10;
    liohBase = Math.round((liohBase + randomBetween(-1000, 1200)) * 10) / 10;

    const changeRate = i < 11
      ? Math.round(randomBetween(-12, 10) * 10) / 10
      : 0;

    data.push({
      month: label,
      li2co3Stock: Math.round(li2co3Base),
      liohStock: Math.round(liohBase),
      changeRate,
    });
  }

  return data;
}

export function generateInventoryPriceRelation(): InventoryPriceRelation[] {
  const data: InventoryPriceRelation[] = [];
  let inventoryBase = 40000;
  let priceBase = 75000;

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    inventoryBase = Math.round(inventoryBase + randomBetween(-3000, 2500));
    priceBase = Math.round(priceBase + randomBetween(-4000, 3000));

    data.push({
      month: label,
      inventory: inventoryBase,
      price: priceBase,
    });
  }

  return data;
}

export function generateInventoryCycle(): InventoryCycle {
  const phases = [
    {
      phase: 'active_destock' as const,
      phaseLabel: '主动去库存',
      description: '下游需求走弱，企业主动降低库存水平，价格承压下行',
      signal: 'bearish' as const,
    },
    {
      phase: 'passive_destock' as const,
      phaseLabel: '被动去库存',
      description: '需求超预期回升，库存被动下降，价格开始企稳反弹',
      signal: 'bullish' as const,
    },
    {
      phase: 'active_restock' as const,
      phaseLabel: '主动补库存',
      description: '需求持续旺盛，企业主动增加库存储备，价格加速上涨',
      signal: 'bullish' as const,
    },
    {
      phase: 'passive_restock' as const,
      phaseLabel: '被动补库存',
      description: '需求开始走弱，库存被动累积，价格面临下行压力',
      signal: 'bearish' as const,
    },
  ];

  const current = phases[Math.floor(Math.random() * phases.length)];
  return {
    ...current,
    confidence: Math.round(randomBetween(55, 85)),
  };
}
