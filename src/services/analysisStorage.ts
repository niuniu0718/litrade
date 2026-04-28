import dayjs from 'dayjs';
import type { AnalysisHistory } from '../types/analysis';

const STORAGE_KEY = 'litrade_analysis_history';
const MAX_DAYS = 90;

export function getTodayDateStr(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function getYesterdayDateStr(): string {
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
}

export function loadAnalysisHistory(): AnalysisHistory | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnalysisHistory;
  } catch {
    return null;
  }
}

export function saveAnalysisHistory(history: AnalysisHistory): void {
  // 裁剪超过90天的数据
  const cutoff = dayjs().subtract(MAX_DAYS, 'day').format('YYYY-MM-DD');
  history.analyses = history.analyses.filter(a => a.date >= cutoff);
  history.reviews = history.reviews.filter(r => r.date >= cutoff);
  history.scoreTrend = history.scoreTrend.filter(t => t.date >= cutoff);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage 满了，清除旧数据重试
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}
