export interface ProjectCost {
  id: string;
  project: string;
  country: string;
  mineralType: string;
  mining: number;           // 采矿成本 美元/吨
  processing: number;       // 加工成本
  logistics: number;        // 物流成本
  total: number;            // 总成本
  currency: string;
}

export interface CostCurvePoint {
  project: string;
  country: string;
  cumulativeOutput: number; // 累计产量 LCE万吨
  cost: number;             // 边际成本 美元/吨
}

export interface CostGradient {
  range: string;
  count: number;            // 项目数
  avgCost: number;
  totalOutput: number;
}
