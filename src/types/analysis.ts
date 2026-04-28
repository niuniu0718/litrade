import type { SignalDirection, PriceSignal } from './dashboard';

/** 分析推理步骤 */
export interface AnalysisStep {
  stepNumber: number;
  title: string;            // '拆下游' | '建需求公式' | ...
  icon: string;             // emoji
  conclusion: string;       // 简短结论
  reasoning: string;        // 2-3 句解释
  direction: SignalDirection;
  confidence: number;       // 0-100
}

/** 价格情景 */
export interface AnalysisScenario {
  label: string;            // '乐观' | '基准' | '悲观'
  probability: number;      // 0-100
  priceRange: [number, number];
  description: string;
}

/** 策略建议 */
export interface StrategyRecommendation {
  type: 'hedge' | 'procurement' | 'speculation';
  action: string;
  detail: string;
}

/** 每日分析报告 */
export interface DailyAnalysis {
  id: string;               // '2026-04-28'
  date: string;
  generatedAt: string;

  // 核心判断
  overall: SignalDirection;
  score: number;            // 0-100
  confidence: number;
  summarySentence: string;

  // 价格预测
  predictedPrice: number;
  predictedRange: [number, number];
  priceChangePrediction: number;
  priceScenarios: AnalysisScenario[];

  // 推理链
  reasoningSteps: AnalysisStep[];
  signals: PriceSignal[];

  // 供需逻辑
  supplyDemandLogic: string;
  keyDriver: string;
  keyRisk: string;

  // 策略
  strategies: StrategyRecommendation[];

  // 完整报告文本
  fullReport: string;
}

/** 复盘记录 */
export interface ReviewRecord {
  analysisId: string;
  date: string;
  predictedPrice: number;
  predictedDirection: SignalDirection;
  predictedRange: [number, number];
  actualPrice: number;
  actualChange: number;
  priceHit: boolean;
  directionHit: boolean;
  deviation: number;
  deviationPercent: number;
  deviationLevel: 'normal' | 'medium' | 'heavy';
  deviationReason: string;
  correctedFactors: string[];
}

/** 趋势数据点 */
export interface ScoreTrendPoint {
  date: string;
  score: number;
  actualPrice: number;
  direction: SignalDirection;
}

/** localStorage 存储结构 */
export interface AnalysisHistory {
  analyses: DailyAnalysis[];
  reviews: ReviewRecord[];
  scoreTrend: ScoreTrendPoint[];
  lastGeneratedDate: string;
}
