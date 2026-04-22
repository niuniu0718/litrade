import dayjs from 'dayjs';
import type {
  PriceOverview,
  PriceTrendSummary,
  FrameworkIndicators,
  PriceJudgment,
  PriceSignal,
  DashboardMetrics,
  DashboardAlert,
  KeyStatistics,
} from '../types/dashboard';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/** 碳酸锂价格30日走势概览 */
export function generatePriceOverview(): PriceOverview {
  const trend30d: number[] = [];
  let price = 75000;
  for (let i = 0; i < 30; i++) {
    const change = price * 0.02 * (Math.random() - 0.48);
    price = Math.round((price + change) * 100) / 100;
    trend30d.push(price);
  }

  const currentPrice = trend30d[trend30d.length - 1];
  const prevPrice = trend30d[trend30d.length - 2];
  const change = Math.round((currentPrice - prevPrice) * 100) / 100;
  const changePercent = Math.round((change / prevPrice) * 10000) / 100;

  return { currentPrice, change, changePercent, trend30d };
}

/** 三品种价格摘要 */
export function generatePriceTrendSummaries(): PriceTrendSummary[] {
  const products = [
    { product: 'li2co3_battery', name: '电池级碳酸锂', base: 75000, unit: '元/吨', volatility: 0.02 },
    { product: 'lioh', name: '氢氧化锂', base: 68000, unit: '元/吨', volatility: 0.022 },
    { product: 'spodumene', name: '锂精矿 SC6', base: 850, unit: '美元/吨', volatility: 0.018 },
  ];

  return products.map((p) => {
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

/** 五步框架核心指标 */
export function generateFrameworkIndicators(): FrameworkIndicators {
  const demandGrowth = Math.round(randomBetween(12, 32));
  const supplyDemandGap = Math.round(randomBetween(-8, 12) * 10) / 10;
  const inventoryDays = Math.round(randomBetween(18, 42));
  const inventoryMomChange = Math.round(randomBetween(-8, 6) * 10) / 10;
  const macroScore = Math.round(randomBetween(35, 70));

  return {
    // Step1: 拆下游
    demandGrowth,
    evSalesGrowth: Math.round(randomBetween(20, 38)),
    storageGrowth: Math.round(randomBetween(30, 55)),

    // Step2: 建需求公式
    demandForecast: Math.round(randomBetween(100, 120) * 10) / 10,
    demandActual: Math.round(randomBetween(100, 120) * 10) / 10,
    demandGap: Math.round(randomBetween(-3, 5) * 10) / 10,

    // Step3: 看供给
    capacityUtilization: Math.round(randomBetween(72, 92)),
    supplyDemandGap,
    costCurvePosition: Math.round(randomBetween(55, 85)),

    // Step4: 看库存
    inventoryDays,
    inventoryMomChange,
    inventoryCyclePhase: inventoryMomChange < -2 ? '被动去库存'
      : inventoryMomChange < 0 ? '主动去库存'
      : inventoryMomChange < 3 ? '被动补库存'
      : '主动补库存',

    // Step5: 加宏观
    macroScore,
    dollarIndex: Math.round(randomBetween(100, 108) * 10) / 10,
    chinaPMI: Math.round(randomBetween(48.5, 52) * 10) / 10,
  };
}

/** 基于框架指标自动生成价格判断信号 */
export function generatePriceJudgment(indicators: FrameworkIndicators): PriceJudgment {
  const signals: PriceSignal[] = [];

  // Step1: 需求增速判断
  const demandDir: 'bullish' | 'bearish' | 'neutral' = indicators.demandGrowth > 20 ? 'bullish' : indicators.demandGrowth < 10 ? 'bearish' : 'neutral';
  signals.push({
    step: 1,
    source: `需求增速${indicators.demandGrowth}%`,
    direction: demandDir,
    strength: Math.min(Math.abs(indicators.demandGrowth - 15) * 5, 90),
    description: `锂需求同比增速${indicators.demandGrowth}%，EV增速${indicators.evSalesGrowth}%，储能增速${indicators.storageGrowth}%`,
  });

  // Step2: 需求预测偏差
  const gapDir: 'bullish' | 'bearish' | 'neutral' = indicators.demandGap < -1 ? 'bullish' : indicators.demandGap > 2 ? 'bearish' : 'neutral';
  signals.push({
    step: 2,
    source: `预测偏差${indicators.demandGap}%`,
    direction: gapDir,
    strength: Math.min(Math.abs(indicators.demandGap) * 15, 85),
    description: `需求预测${indicators.demandForecast}万吨，实际${indicators.demandActual}万吨，偏差${indicators.demandGap}%`,
  });

  // Step3: 供给弹性
  const supplyDir: 'bullish' | 'bearish' | 'neutral' = indicators.supplyDemandGap < -3 ? 'bullish' : indicators.supplyDemandGap > 5 ? 'bearish' : 'neutral';
  signals.push({
    step: 3,
    source: `供需缺口${indicators.supplyDemandGap > 0 ? '+' : ''}${indicators.supplyDemandGap}万吨`,
    direction: supplyDir,
    strength: Math.min(Math.abs(indicators.supplyDemandGap) * 8, 90),
    description: `产能利用率${indicators.capacityUtilization}%，供需缺口${indicators.supplyDemandGap}万吨，成本分位${indicators.costCurvePosition}%`,
  });

  // Step4: 库存方向
  const invDir: 'bullish' | 'bearish' | 'neutral' = indicators.inventoryMomChange < -3 ? 'bullish' : indicators.inventoryMomChange > 3 ? 'bearish' : 'neutral';
  signals.push({
    step: 4,
    source: `库存环比${indicators.inventoryMomChange > 0 ? '+' : ''}${indicators.inventoryMomChange}%`,
    direction: invDir,
    strength: Math.min(Math.abs(indicators.inventoryMomChange) * 10, 85),
    description: `库存${indicators.inventoryDays}天，环比${indicators.inventoryMomChange > 0 ? '+' : ''}${indicators.inventoryMomChange}%，处于${indicators.inventoryCyclePhase}阶段`,
  });

  // Step5: 宏观环境
  const macroDir: 'bullish' | 'bearish' | 'neutral' = indicators.macroScore > 55 ? 'bullish' : indicators.macroScore < 45 ? 'bearish' : 'neutral';
  signals.push({
    step: 5,
    source: `宏观评分${indicators.macroScore}`,
    direction: macroDir,
    strength: Math.min(Math.abs(indicators.macroScore - 50) * 2, 80),
    description: `宏观综合评分${indicators.macroScore}，美元指数${indicators.dollarIndex}，中国PMI ${indicators.chinaPMI}`,
  });

  // 综合评分：加权计算
  const weights = [0.25, 0.15, 0.25, 0.2, 0.15];
  let score = 50;
  signals.forEach((s, i) => {
    const delta = s.direction === 'bullish' ? s.strength * 0.3 : s.direction === 'bearish' ? -s.strength * 0.3 : 0;
    score += delta * weights[i];
  });
  score = Math.round(Math.max(10, Math.min(90, score)));

  const overall: 'bullish' | 'bearish' | 'neutral' = score > 58 ? 'bullish' : score < 42 ? 'bearish' : 'neutral';

  const summaryMap = {
    bullish: '五维信号偏多，需求端支撑较强，建议关注价格上行风险',
    bearish: '五维信号偏空，供给端压力较大，建议警惕价格下行风险',
    neutral: '多空信号交织，供需基本平衡，建议观望等待方向明朗',
  };

  return { overall, score, signals, summary: summaryMap[overall] };
}

/** 兼容旧的 DashboardMetrics */
export function generateDashboardMetrics(): DashboardMetrics {
  return {
    heatIndex: Math.round(randomBetween(35, 85)),
    avgPriceLevel: Math.round(randomBetween(65000, 80000)),
    alertCount: Math.round(randomBetween(2, 12)),
    monthlyVolume: Math.round(randomBetween(15000, 35000)),
    heatChange: randomBetween(-5, 8),
    priceChange: randomBetween(-3, 3),
    volumeChange: randomBetween(-10, 15),
  };
}

/** 预警 */
export function generateDashboardAlerts(count = 6): DashboardAlert[] {
  const templates: Omit<DashboardAlert, 'id' | 'timestamp'>[] = [
    { level: 'critical', title: '碳酸锂价格跌破关键支撑位', description: '电池级碳酸锂价格跌破70000元/吨，市场情绪转向悲观', source: '价格监控' },
    { level: 'warning', title: '澳洲锂矿减产消息', description: 'Pilbara宣布调整生产计划，预计影响Q3产量约15%', source: '产业动态' },
    { level: 'info', title: '智利出口数据更新', description: '本月智利碳酸锂出口量环比增长12%，对中国出口占比提升', source: '进出口' },
    { level: 'warning', title: '库存持续上升', description: '社会库存连续3周增加，下游采购意愿偏弱', source: '库存监控' },
    { level: 'info', title: '新能源汽车销量超预期', description: '6月新能源汽车销量同比增长35%，超市场预期', source: '终端市场' },
    { level: 'warning', title: '环保政策趋严', description: '江西地区环保督查力度加大，部分锂盐厂限产', source: '政策监管' },
  ];
  return templates.slice(0, count).map((t, i) => ({
    ...t,
    id: `alert-${i}`,
    timestamp: dayjs().subtract(i * randomBetween(2, 8), 'hour').toISOString(),
  }));
}

/** 关键统计 */
export function generateKeyStatistics(): KeyStatistics {
  return {
    totalMarketCap: Math.round(randomBetween(8000, 15000)),
    globalSupply: Math.round(randomBetween(80, 120) * 10) / 10,
    globalDemand: Math.round(randomBetween(85, 130) * 10) / 10,
    inventoryDays: Math.round(randomBetween(15, 45)),
  };
}
