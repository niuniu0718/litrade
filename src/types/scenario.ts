// 情景分析相关类型

import type { SignalDirection } from './dashboard';

/** 历史事件类别 */
export type HistoricalCategory = 'policy' | 'supply' | 'demand' | 'macro' | 'milestone';

/** 历史事件 */
export interface HistoricalEvent {
  id: string;
  date: string;           // "2020-01" 格式
  price: number;          // 元/吨
  title: string;          // 简短标题
  description: string;    // 详细背景描述
  category: HistoricalCategory;
}

/** 周期阶段 */
export type CyclePhase = '上行启动' | '上行加速' | '顶部过热' | '下行启动' | '下行加速' | '底部筑底';

/** 维度评分 */
export interface DimensionScore {
  label: string;          // '需求' | '供给' | '库存' | '宏观'
  score: number;          // 0-100
  direction: SignalDirection;
  detail: string;         // 一句话解读
}

/** 历史相似事件 */
export interface SimilarEvent {
  eventId: string;        // 对应 HistoricalEvent.id
  similarity: number;     // 0-100 相似度
  reason: string;         // 相似原因
}

/** AI 周期研判结果 */
export interface CycleAnalysis {
  // 四维评分
  dimensions: DimensionScore[];
  overallScore: number;
  overallDirection: SignalDirection;
  // 周期定位
  currentPhase: CyclePhase;
  phaseDescription: string;
  // 历史相似
  similarEvents: SimilarEvent[];
  // AI 研判摘要
  summary: string;
  reasoning: string;      // 详细推理过程
}
