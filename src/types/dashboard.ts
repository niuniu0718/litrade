// Dashboard 类型定义 — 基于五步分析框架的核心指标体系

/** 顶层价格概览 */
export interface PriceOverview {
  currentPrice: number;       // 碳酸锂当前价格 元/吨
  change: number;             // 涨跌额
  changePercent: number;      // 涨跌幅%
  trend30d: number[];         // 30日走势
}

/** 品种价格摘要 */
export interface PriceTrendSummary {
  product: string;
  name: string;
  currentPrice: number;
  unit: string;
  change: number;
  changePercent: number;
  trend7d: number[];
}

/** 五步框架核心指标 — 每步提取一个核心可量化指标 */
export interface FrameworkIndicators {
  // Step1: 拆下游 — 需求增速
  demandGrowth: number;       // 需求同比增速%
  evSalesGrowth: number;      // EV销量增速%
  storageGrowth: number;      // 储能装机增速%

  // Step2: 建需求公式 — 需求预测偏差
  demandForecast: number;     // 预测需求 LCE万吨
  demandActual: number;       // 实际需求 LCE万吨
  demandGap: number;          // 偏差率%

  // Step3: 看供给 — 产能利用率+供需缺口
  capacityUtilization: number; // 产能利用率%
  supplyDemandGap: number;     // 供需缺口 LCE万吨（正=过剩，负=不足）
  costCurvePosition: number;   // 成本曲线分位（当前价格在成本曲线的位置%）

  // Step4: 看库存 — 库存方向
  inventoryDays: number;        // 库存天数
  inventoryMomChange: number;   // 库存环比变化%
  inventoryCyclePhase: string;  // 库存周期阶段

  // Step5: 加宏观 — 综合宏观评分
  macroScore: number;          // 宏观综合评分 0-100（>50利好，<50利空）
  dollarIndex: number;         // 美元指数
  chinaPMI: number;            // 中国PMI
}

/** 价格判断信号 */
export type SignalDirection = 'bullish' | 'bearish' | 'neutral';

export interface PriceSignal {
  step: number;               // 对应框架步骤 1-5
  source: string;             // 指标来源
  direction: SignalDirection;  // 利多/利空/中性
  strength: number;           // 信号强度 0-100
  description: string;        // 信号描述
}

/** 综合价格判断 */
export interface PriceJudgment {
  overall: SignalDirection;    // 综合方向
  score: number;              // 综合评分 0-100（>60偏多，<40偏空）
  signals: PriceSignal[];     // 各维度信号
  summary: string;            // 一句话判断
}

/** 产业关键统计 */
export interface KeyStatistics {
  totalMarketCap: number;     // 市场总值 亿元
  globalSupply: number;       // 全球供应 LCE万吨
  globalDemand: number;       // 全球需求 LCE万吨
  inventoryDays: number;      // 库存天数
}

/** 预警 */
export interface DashboardAlert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  source: string;
}

/** 市场热度（保留兼容） */
export interface DashboardMetrics {
  heatIndex: number;
  avgPriceLevel: number;
  alertCount: number;
  monthlyVolume: number;
  heatChange: number;
  priceChange: number;
  volumeChange: number;
}
