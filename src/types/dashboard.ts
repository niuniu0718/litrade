export interface DashboardMetrics {
  heatIndex: number;        // 市场热度指数 0-100
  avgPriceLevel: number;    // 平均价格水平 元/吨
  alertCount: number;       // 预警数量
  monthlyVolume: number;    // 月度交易量 吨
  heatChange: number;       // 热度变化
  priceChange: number;      // 价格变化%
  volumeChange: number;     // 交易量变化%
}

export interface DashboardAlert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  source: string;
}

export interface PriceTrendSummary {
  product: string;
  name: string;
  currentPrice: number;
  unit: string;
  change: number;
  changePercent: number;
  trend7d: number[];       // 7日迷你走势数据
}

export interface KeyStatistics {
  totalMarketCap: number;   // 市场总值 亿元
  globalSupply: number;     // 全球供应 LCE万吨
  globalDemand: number;     // 全球需求 LCE万吨
  inventoryDays: number;    // 库存天数
}
