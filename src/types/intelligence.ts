export interface MarketReport {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
}

export interface CapitalFlow {
  sector: string;
  netInflow: number;        // 亿元
  change: number;           // 变化%
  topStocks: { name: string; code: string; change: number }[];
}

export interface MacroIndicator {
  name: string;
  category: 'politics' | 'geopolitics' | 'currency' | 'trade';
  value: string;
  trend: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export interface MarketSentiment {
  heatIndex: number;        // 0-100
  bullBearRatio: number;    // 多空比
  hotWords: string[];
  newsCount24h: number;
  sentimentScore: number;   // -100 to 100
}
