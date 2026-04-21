export interface DomesticSpotPrice {
  id: string;
  product: string;
  name: string;
  region: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  updatedAt: string;
  trend7d: number[];
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
