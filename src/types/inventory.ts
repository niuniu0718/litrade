// 库存分析相关类型

/** 库存维度数据（工厂/市场/期货/行业总库存） */
export interface InventoryDimension {
  key: string;               // 维度标识 factory | market | futures | total
  label: string;             // 维度中文名
  currentStock: number;      // 当前库存量 吨
  momChange: number;         // 环比变化%
  wowChange: number;         // 周环比变化%
}

/** 库存趋势数据 */
export interface InventoryTrend {
  month: string;
  factory: number;           // 工厂库存 吨
  market: number;            // 市场库存 吨
  futures: number;           // 期货库存 吨
  total: number;             // 行业总库存 吨
  changeRate: number;        // 库存增减率%
}

/** 库存-价格关系 */
export interface InventoryPriceRelation {
  month: string;
  inventory: number;        // 库存量 吨
  price: number;            // 价格 元/吨
}

/** 库存周期阶段 */
export type InventoryCyclePhase =
  | 'active_destock'        // 主动去库存
  | 'passive_destock'       // 被动去库存
  | 'active_restock'        // 主动补库存
  | 'passive_restock';      // 被动补库存

/** 库存周期判断 */
export interface InventoryCycle {
  phase: InventoryCyclePhase;
  phaseLabel: string;       // 阶段中文名
  description: string;      // 阶段描述
  signal: 'bullish' | 'bearish' | 'neutral'; // 信号方向
  confidence: number;       // 置信度 0-100
}
