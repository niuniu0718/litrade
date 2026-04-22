// 库存分析相关类型

/** 库存概览 */
export interface InventoryOverview {
  li2co3: InventoryItem;    // 碳酸锂库存
  lioh: InventoryItem;      // 氢氧化锂库存
}

/** 单品种库存数据 */
export interface InventoryItem {
  product: string;          // 品种名称
  currentStock: number;     // 当前库存量 吨
  momChange: number;        // 环比变化%
  stockConsumptionRatio: number; // 库存消费比
}

/** 库存趋势数据 */
export interface InventoryTrend {
  month: string;
  li2co3Stock: number;      // 碳酸锂库存 吨
  liohStock: number;        // 氢氧化锂库存 吨
  changeRate: number;       // 库存增减率%
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
