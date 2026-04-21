import { create } from 'zustand';
import type { DashboardMetrics, DashboardAlert, PriceTrendSummary, KeyStatistics } from '../types/dashboard';
import * as api from '../services/apiDashboard';

interface DashboardState {
  metrics: DashboardMetrics | null;
  alerts: DashboardAlert[];
  trends: PriceTrendSummary[];
  keyStats: KeyStatistics | null;
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: null,
  alerts: [],
  trends: [],
  keyStats: null,
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [metrics, alerts, trends, keyStats] = await Promise.all([
      api.fetchDashboardMetrics(),
      api.fetchDashboardAlerts(),
      api.fetchPriceTrendSummaries(),
      api.fetchKeyStatistics(),
    ]);
    set({ metrics, alerts, trends, keyStats, loading: false });
  },
}));
