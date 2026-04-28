import { generateDailyAnalysis, generateReviewRecord, generateInitialHistory } from '../data/mockAnalysis';
import { loadAnalysisHistory, saveAnalysisHistory, getTodayDateStr, getYesterdayDateStr } from './analysisStorage';
import type { DailyAnalysis, ReviewRecord, AnalysisHistory } from '../types/analysis';

export interface AnalysisResult {
  todayAnalysis: DailyAnalysis;
  yesterdayReview: ReviewRecord | null;
  history: AnalysisHistory;
}

/**
 * 编排层：加载历史 → 判断是否需生成新分析 → 返回
 */
export function fetchOrGenerateAnalysis(
  currentPrice: number,
): AnalysisResult {
  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();
  let history = loadAnalysisHistory();

  // 首次访问：回填30天历史
  if (!history) {
    history = generateInitialHistory(currentPrice);
    saveAnalysisHistory(history);
  }

  // 检查今天是否已生成
  const existing = history.analyses.find(a => a.id === today);
  let todayAnalysis: DailyAnalysis;

  if (existing) {
    todayAnalysis = existing;
  } else {
    // 获取前一天评分用于随机游走
    const yesterdayAnalysis = history.analyses.find(a => a.id === yesterday);
    const prevScore = yesterdayAnalysis?.score;

    todayAnalysis = generateDailyAnalysis(today, currentPrice, prevScore);

    // 更新历史
    history.analyses.push(todayAnalysis);
    history.scoreTrend.push({
      date: today,
      score: todayAnalysis.score,
      actualPrice: currentPrice,
      direction: todayAnalysis.overall,
    });
    history.lastGeneratedDate = today;
  }

  // 生成昨日复盘（如果还没生成且昨天有分析）
  let yesterdayReview: ReviewRecord | null = null;
  const yesterdayAnalysis = history.analyses.find(a => a.id === yesterday);
  const existingReview = history.reviews.find(r => r.date === yesterday);

  if (yesterdayAnalysis && !existingReview) {
    yesterdayReview = generateReviewRecord(yesterdayAnalysis, currentPrice);
    history.reviews.push(yesterdayReview);
  } else if (existingReview) {
    yesterdayReview = existingReview;
  }

  saveAnalysisHistory(history);

  return { todayAnalysis, yesterdayReview, history };
}
