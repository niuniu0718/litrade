export interface Company {
  id: string;
  name: string;
  chain: 'upstream' | 'midstream' | 'downstream';
  marketCap: number;        // 市值 亿元
  revenue: number;          // 营收 亿元
  netProfit: number;        // 净利润 亿元
  grossMargin: number;      // 毛利率%
  description: string;
}

export interface FinancialReport {
  quarter: string;
  revenue: number;          // 亿元
  netProfit: number;        // 亿元
  grossMargin: number;      // %
  netMargin: number;        // 净利率%
  revenueGrowth: number;    // 营收增长%
  profitGrowth: number;     // 利润增长%
}

export interface IndustryCycle {
  currentStage: string;
  confidence: number;       // 0-100
  indicators: {
    name: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    status: 'positive' | 'negative' | 'neutral';
  }[];
}
