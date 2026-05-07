import type {
  InventoryDimension,
  InventoryTrend,
  InventoryPriceRelation,
  InventoryCycle,
} from '../types/inventory';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateInventoryDimensions(): InventoryDimension[] {
  return [
    {
      key: 'factory',
      label: '工厂库存',
      currentStock: Math.round(randomBetween(18000, 32000)),
      momChange: Math.round(randomBetween(-8, 5) * 10) / 10,
      wowChange: Math.round(randomBetween(-4, 3) * 10) / 10,
    },
    {
      key: 'market',
      label: '市场库存',
      currentStock: Math.round(randomBetween(8000, 20000)),
      momChange: Math.round(randomBetween(-6, 8) * 10) / 10,
      wowChange: Math.round(randomBetween(-3, 4) * 10) / 10,
    },
    {
      key: 'futures',
      label: '期货库存',
      currentStock: Math.round(randomBetween(3000, 10000)),
      momChange: Math.round(randomBetween(-10, 10) * 10) / 10,
      wowChange: Math.round(randomBetween(-5, 5) * 10) / 10,
    },
    {
      key: 'total',
      label: '行业总库存',
      currentStock: Math.round(randomBetween(35000, 58000)),
      momChange: Math.round(randomBetween(-7, 6) * 10) / 10,
      wowChange: Math.round(randomBetween(-3, 3) * 10) / 10,
    },
  ];
}

export function generateInventoryTrend(): InventoryTrend[] {
  const data: InventoryTrend[] = [];
  let factoryBase = 25000;
  let marketBase = 14000;
  let futuresBase = 6000;

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    factoryBase = Math.round(factoryBase + randomBetween(-2000, 1800));
    marketBase = Math.round(marketBase + randomBetween(-1200, 1000));
    futuresBase = Math.round(futuresBase + randomBetween(-800, 700));

    const total = factoryBase + marketBase + futuresBase;

    const changeRate = i < 11
      ? Math.round(randomBetween(-12, 10) * 10) / 10
      : 0;

    data.push({
      month: label,
      factory: factoryBase,
      market: marketBase,
      futures: futuresBase,
      total,
      changeRate,
    });
  }

  return data;
}

export function generateInventoryPriceRelation(): InventoryPriceRelation[] {
  const data: InventoryPriceRelation[] = [];
  let inventoryBase = 40000;
  let priceBase = 174000;

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
