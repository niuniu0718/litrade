// 下游需求分析相关类型

/** 下游产业需求数据 */
export interface DownstreamSector {
  sector: string;           // 产业名称
  share: number;            // 占比%
  demand: number;           // 需求量 LCE万吨
  growth: number;           // 同比增长%
  intensity: number;        // 单位用量系数
}

/** 需求公式因子 */
export interface DemandFactor {
  key: string;              // 因子标识
  label: string;            // 因子名称
  value: number;            // 当前值
  unit: string;             // 单位
  trend: number[];          // 近12月趋势
  yoyChange: number;        // 同比变化%
}

/** 需求公式 */
export interface DemandFormula {
  factors: DemandFactor[];
  result: number;           // 计算得出的锂需求 LCE万吨
  resultUnit: string;
}

/** EV销量数据 */
export interface EVSalesData {
  month: string;
  globalSales: number;      // 全球EV销量 万辆
  chinaSales: number;       // 中国EV销量 万辆
  globalYoy: number;        // 全球同比%
  chinaYoy: number;         // 中国同比%
}

/** 储能市场数据 */
export interface EnergyStorageData {
  month: string;
  installation: number;     // 装机量 GWh
  yoyChange: number;        // 同比%
}

/** 需求预测数据 */
export interface DemandForecast {
  month: string;
  optimistic: number;       // 乐观预测
  baseline: number;         // 基准预测
  pessimistic: number;      // 悲观预测
}
