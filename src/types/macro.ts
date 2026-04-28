// 宏观因子相关类型

/** 宏观因子雷达数据 */
export interface MacroRadarData {
  dimension: string;        // 维度名称
  score: number;            // 当前评分 0-100
  label: string;            // 状态描述
}

/** 宏观关键指标 */
export interface MacroIndicator {
  key: string;
  name: string;             // 指标名称
  value: number;            // 当前值
  unit: string;             // 单位
  change: number;           // 变化
  trend: number[];          // 近12月趋势
  impact: 'positive' | 'negative' | 'neutral'; // 对锂价影响
}

/** 宏观-价格相关性数据 */
export interface MacroPriceCorrelation {
  month: string;
  liPrice: number;          // 碳酸锂价格 元/吨
  macroValue: number;       // 宏观指标值
}

/** 宏观日历事件 */
export interface MacroCalendarEvent {
  id: string;
  date: string;             // 发布日期
  event: string;            // 事件名称
  importance: 'high' | 'medium' | 'low'; // 重要性
  previousValue: string;    // 前值
  forecast: string;         // 预期
  impact: string;           // 影响说明
}

// ─── 以下类型原属 intelligence.ts ───

/** 研究报告 */
export interface MarketReport {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
}

/** 板块资金流向 */
export interface CapitalFlow {
  sector: string;
  netInflow: number;        // 亿元
  change: number;           // 变化%
  topStocks: { name: string; code: string; change: number }[];
}

/** 定性宏观指标（原 intelligence 的 MacroIndicator） */
export interface QualitativeIndicator {
  name: string;
  category: 'politics' | 'geopolitics' | 'currency' | 'trade';
  value: string;
  trend: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  description: string;
}

/** 市场情绪 */
export interface MarketSentiment {
  heatIndex: number;        // 0-100
  bullBearRatio: number;    // 多空比
  hotWords: string[];
  newsCount24h: number;
  sentimentScore: number;   // -100 to 100
}
