export interface DomesticSpotPrice {
  id: string;
  product: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  updatedAt: string;
  trend7d: number[];
  category: SpotCategory;
}

export interface InternationalSpotPrice {
  id: string;
  product: string;
  name: string;
  source: string;        // 数据源，如 FastMarkets
  price: number;
  change: number;
  changePercent: number;
  unit: string;          // 通常为 美元/吨
  updatedAt: string;
  trend7d: number[];
  category: SpotCategory;
}

export interface FuturesPrice {
  id: string;
  contract: string;
  exchange: string;
  product: string;
  latestPrice: number;
  change: number;
  changePercent: number;
  openInterest: number;
  volume: number;
  unit: string;
  updatedAt: string;
}

export interface IndustryChainPrice {
  stage: string;
  name: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
}

/** 现货价格品类 */
export type SpotCategory = 'lithium_carbonate' | 'lithium_hydroxide' | 'spodumene';

export const SPOT_CATEGORY_CONFIG: Record<SpotCategory, { label: string; labelEn: string }> = {
  lithium_carbonate: { label: '碳酸锂', labelEn: 'Lithium Carbonate' },
  lithium_hydroxide: { label: '氢氧化锂', labelEn: 'Lithium Hydroxide' },
  spodumene: { label: '锂辉石', labelEn: 'Spodumene' },
};
