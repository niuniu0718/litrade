import dayjs from 'dayjs';
import type {
  DashboardMetrics,
  DashboardAlert,
  PriceTrendSummary,
  KeyStatistics,
} from '../types/dashboard';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateDashboardMetrics(): DashboardMetrics {
  const heatIndex = Math.round(randomBetween(35, 85));
  const avgPriceLevel = Math.round(randomBetween(65000, 80000));
  const alertCount = Math.round(randomBetween(2, 12));
  const monthlyVolume = Math.round(randomBetween(15000, 35000));
  return {
    heatIndex,
    avgPriceLevel,
    alertCount,
    monthlyVolume,
    heatChange: randomBetween(-5, 8),
    priceChange: randomBetween(-3, 3),
    volumeChange: randomBetween(-10, 15),
  };
}

export function generateDashboardAlerts(count = 8): DashboardAlert[] {
  const templates: Omit<DashboardAlert, 'id' | 'timestamp'>[] = [
    { level: 'critical', title: '碳酸锂价格跌破关键支撑位', description: '电池级碳酸锂价格跌破70000元/吨，市场情绪转向悲观', source: '价格监控' },
    { level: 'warning', title: '澳洲锂矿减产消息', description: 'Pilbara宣布调整生产计划，预计影响Q3产量约15%', source: '产业动态' },
    { level: 'info', title: '智利出口数据更新', description: '本月智利碳酸锂出口量环比增长12%，对中国出口占比提升', source: '进出口' },
    { level: 'warning', title: '库存持续上升', description: '社会库存连续3周增加，下游采购意愿偏弱', source: '库存监控' },
    { level: 'critical', title: '期货大幅贴水', description: '碳酸锂期货主力合约较现货贴水扩大至2000元/吨', source: '期货市场' },
    { level: 'info', title: '新能源汽车销量超预期', description: '6月新能源汽车销量同比增长35%，超市场预期', source: '终端市场' },
    { level: 'warning', title: '环保政策趋严', description: '江西地区环保督查力度加大，部分锂盐厂限产', source: '政策监管' },
    { level: 'info', title: '新项目投产进度', description: '非洲Manono项目一期预计Q4投产，年产能50万吨', source: '项目跟踪' },
  ];

  return templates.slice(0, count).map((t, i) => ({
    ...t,
    id: `alert-${i}`,
    timestamp: dayjs().subtract(i * randomBetween(2, 8), 'hour').toISOString(),
  }));
}

export function generatePriceTrendSummaries(): PriceTrendSummary[] {
  const products = [
    { product: 'li2co3_battery', name: '电池级碳酸锂', base: 75000, unit: '元/吨', volatility: 0.02 },
    { product: 'lioh', name: '氢氧化锂', base: 68000, unit: '元/吨', volatility: 0.022 },
    { product: 'spodumene', name: '锂精矿 SC6', base: 850, unit: '美元/吨', volatility: 0.018 },
  ];

  return products.map((p) => {
    // 生成30日连续走势，取最后7天作为迷你图
    const trend30d: number[] = [];
    let price = p.base;
    for (let i = 0; i < 30; i++) {
      const change = price * p.volatility * (Math.random() - 0.48);
      price = Math.round((price + change) * 100) / 100;
      trend30d.push(price);
    }

    const currentPrice = trend30d[trend30d.length - 1];
    const prevPrice = trend30d[trend30d.length - 2];
    const change = Math.round((currentPrice - prevPrice) * 100) / 100;
    const changePercent = Math.round((change / prevPrice) * 10000) / 100;

    return {
      product: p.product,
      name: p.name,
      currentPrice,
      unit: p.unit,
      change,
      changePercent,
      trend7d: trend30d.slice(-7),
    };
  });
}

export function generateKeyStatistics(): KeyStatistics {
  return {
    totalMarketCap: Math.round(randomBetween(8000, 15000)),
    globalSupply: Math.round(randomBetween(80, 120) * 10) / 10,
    globalDemand: Math.round(randomBetween(85, 130) * 10) / 10,
    inventoryDays: Math.round(randomBetween(15, 45)),
  };
}
