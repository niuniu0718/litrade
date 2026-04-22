import { create } from 'zustand';
import type { PriceOverview, PriceTrendSummary, FrameworkIndicators, PriceJudgment, DashboardAlert, KeyStatistics } from '../types/dashboard';
import * as api from '../services/apiDashboard';

interface DashboardState {
  priceOverview: PriceOverview | null;
  trends: PriceTrendSummary[];
  indicators: FrameworkIndicators | null;
  judgment: PriceJudgment | null;
  alerts: DashboardAlert[];
  keyStats: KeyStatistics | null;
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  priceOverview: null,
  trends: [],
  indicators: null,
  judgment: null,
  alerts: [],
  keyStats: null,
  loading: false,

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
}));
