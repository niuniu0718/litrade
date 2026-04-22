// 宏观因子相关类型

/** 宏观因子雷达数据 */
export interface MacroRadarData {
  dimension: string;        // 维度名称
  score: number;            // 当前评分 0-100
  label: string;            // 状态描述
}

/** 宏观关键指标 */
export interface MacroIndicator {
  key: string;
  name: string;             // 指标名称
  value: number;            // 当前值
  unit: string;             // 单位
  change: number;           // 变化
  trend: number[];          // 近12月趋势
  impact: 'positive' | 'negative' | 'neutral'; // 对锂价影响
}

/** 宏观-价格相关性数据 */
export interface MacroPriceCorrelation {
  month: string;
  liPrice: number;          // 碳酸锂价格 元/吨
  macroValue: number;       // 宏观指标值
}

/** 宏观日历事件 */
export interface MacroCalendarEvent {
  id: string;
  date: string;             // 发布日期
  event: string;            // 事件名称
  importance: 'high' | 'medium' | 'low'; // 重要性
  previousValue: string;    // 前值
  forecast: string;         // 预期
  impact: string;           // 影响说明
}
