// ============ 品种定义 ============

export type ProductCode = 'li2co3_battery' | 'li2co3_industrial' | 'lioh' | 'spodumene';

export interface Product {
  code: ProductCode;
  name: string;
  unit: string;       // 计价单位，如 元/吨
  exchange?: string;  // 交易所（期货品种）
  category: 'salt' | 'mineral'; // 锂盐 / 矿石
}

// ============ 行情数据 ============

export interface PricePoint {
  date: string;        // YYYY-MM-DD
  open: number;
  close: number;
  high: number;
  low: number;
  volume?: number;
}

export interface PriceSnapshot {
  product: ProductCode;
  price: number;
  change: number;      // 涨跌额
  changePercent: number; // 涨跌幅 %
  high52w: number;     // 52周最高
  low52w: number;      // 52周最低
  updatedAt: string;   // ISO datetime
}

// ============ 系统配置 ============

export interface AppSettings {
  products: Product[];
  dataRetentionDays: number;
  refreshInterval: number; // 秒
}
