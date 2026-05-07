export interface TradeRecord {
  month: string;
  importVolume: number;     // 吨
  importValue: number;      // 万美元
  exportVolume: number;
  exportValue: number;
  avgImportPrice: number;   // 美元/吨
  avgExportPrice: number;
}

export interface PortArrival {
  id: string;
  port: string;
  origin: string;
  quantity: number;         // 吨
  product: string;
  expectedArrival: string;
  status: 'arriving' | 'discharging' | 'completed' | 'delayed';
}

export interface TradePartner {
  country: string;
  importShare: number;      // 进口份额%
  importVolume: number;     // 吨
  importValue: number;      // 万美元
  exportShare: number;
  exportVolume: number;
}
