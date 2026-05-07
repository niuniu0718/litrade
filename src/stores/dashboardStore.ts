import { create } from 'zustand';
import type { PriceOverview, PriceTrendSummary, FrameworkIndicators, PriceJudgment, DashboardAlert, KeyStatistics } from '../types/dashboard';
import type { DailyAnalysis, ReviewRecord, AnalysisHistory } from '../types/analysis';
import * as api from '../services/apiDashboard';
import { fetchOrGenerateAnalysis } from '../services/analysisService';

interface DashboardState {
  priceOverview: PriceOverview | null;
  trends: PriceTrendSummary[];
  indicators: FrameworkIndicators | null;
  judgment: PriceJudgment | null;
  alerts: DashboardAlert[];
  keyStats: KeyStatistics | null;
  loading: boolean;
  // AI Analysis
  todayAnalysis: DailyAnalysis | null;
  yesterdayReview: ReviewRecord | null;
  analysisHistory: AnalysisHistory | null;
  analysisLoading: boolean;
  fetchAll: () => Promise<void>;
  fetchAnalysis: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  priceOverview: null,
  trends: [],
  indicators: null,
  judgment: null,
  alerts: [],
  keyStats: null,
  loading: false,
  // AI Analysis
  todayAnalysis: null,
  yesterdayReview: null,
  analysisHistory: null,
  analysisLoading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [priceOverview, trends, indicators, alerts, keyStats] = await Promise.all([
      api.fetchPriceOverview(),
      api.fetchPriceTrendSummaries(),
      api.fetchFrameworkIndicators(),
      api.fetchDashboardAlerts(),
      api.fetchKeyStatistics(),
    ]);
    const judgment = await api.fetchPriceJudgment(indicators);
    set({ priceOverview, trends, indicators, judgment, alerts, keyStats, loading: false });
  },

  fetchAnalysis: () => {
    const { priceOverview } = get();
    if (!priceOverview) return;
    set({ analysisLoading: true });
    const result = fetchOrGenerateAnalysis(priceOverview.currentPrice);
    set({
      todayAnalysis: result.todayAnalysis,
      yesterdayReview: result.yesterdayReview,
      analysisHistory: result.history,
      analysisLoading: false,
    });
  },
}));
