// 情境模拟相关类型

/** 情境参数 */
export interface ScenarioParams {
  evGrowthRate: number;     // EV销量增速 -20~+30
  storageGrowthRate: number; // 储能装机增速 -10~+40
  supplyChange: number;     // 供给变化 -15~+20
  macroEnvironment: number; // 宏观环境 0(宽松)~100(紧缩)
}

/** 情境预测结果 */
export interface ScenarioResult {
  month: string;
  optimisticDemand: number;
  baselineDemand: number;
  pessimisticDemand: number;
  optimisticSupply: number;
  baselineSupply: number;
  pessimisticSupply: number;
  optimisticPrice: number;
  baselinePrice: number;
  pessimisticPrice: number;
}

/** 供需平衡表 */
export interface SupplyDemandSheet {
  scenario: string;         // 情境名称
  demand: number;           // 需求 LCE万吨
  supply: number;           // 供给 LCE万吨
  gap: number;              // 供需缺口
  estimatedPrice: number;   // 预估价格 元/吨
}

/** 历史情境 */
export interface HistoricalScenario {
  id: string;
  period: string;           // 历史时间段
  description: string;      // 情境描述
  conditions: string;       // 当时条件
  actualPriceChange: number; // 实际价格变化%
  duration: string;         // 持续时间
}
