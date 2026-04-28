export interface MiningProject {
  id: string;
  name: string;
  country: string;
  status: 'producing' | 'construction' | 'exploration' | 'suspended';
  mineralType: string;
  reserve: number;          // 万吨 LCE
  capacity: number;         // 万吨 LCE/年
  capacityYear: number;     // 产能数据对应年份
  operator: string;
}

export interface ProjectProduction {
  projectId: string;
  projectName: string;
  year: number;
  output: number;           // 产量 万吨
  source: string;           // 数据来源
  isForecast: boolean;
}

export interface SupplySummary {
  globalSupply: number;     // 全球供应 LCE万吨
  yoyChange: number;        // 同比增长%
  topCountries: { country: string; share: number; output: number }[];
}

export interface DemandSector {
  sector: string;
  share: number;            // 占比%
  growth: number;           // 同比增长%
  demand: number;           // 需求量 LCE万吨
}

export interface InternalDemand {
  category: string;
  demand: number;           // LCE万吨
  share: number;            // 占比%
  growth: number;           // 增长%
}

export interface SupplyDemandBalance {
  year: string;
  supply: number;
  demand: number;
  surplus: number;          // 盈余/缺口
  isForecast: boolean;
}
