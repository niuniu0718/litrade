import { create } from 'zustand';
import type { MarketReport, CapitalFlow, MacroIndicator, MarketSentiment } from '../types/intelligence';
import * as api from '../services/apiIntelligence';

interface IntelligenceState {
  reports: MarketReport[];
  capitalFlows: CapitalFlow[];
  macroIndicators: MacroIndicator[];
  sentiment: MarketSentiment | null;
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useIntelligenceStore = create<IntelligenceState>((set) => ({
  reports: [],
  capitalFlows: [],
  macroIndicators: [],
  sentiment: null,
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [reports, capitalFlows, macroIndicators, sentiment] = await Promise.all([
      api.fetchMarketReports(),
      api.fetchCapitalFlows(),
      api.fetchMacroIndicators(),
      api.fetchMarketSentiment(),
    ]);
    set({ reports, capitalFlows, macroIndicators, sentiment, loading: false });
  },
}));
