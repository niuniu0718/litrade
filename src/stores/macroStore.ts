import { create } from 'zustand';
import type { MacroRadarData, MacroIndicator, MacroPriceCorrelation, MacroCalendarEvent, MarketReport, CapitalFlow, QualitativeIndicator, MarketSentiment } from '../types/macro';
import * as api from '../services/macroService';

interface MacroState {
  // 原 macro
  radar: MacroRadarData[];
  indicators: MacroIndicator[];
  priceCorrelation: MacroPriceCorrelation[];
  calendar: MacroCalendarEvent[];
  // 原 intelligence
  reports: MarketReport[];
  capitalFlows: CapitalFlow[];
  qualitativeIndicators: QualitativeIndicator[];
  sentiment: MarketSentiment | null;
  // 共享
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useMacroStore = create<MacroState>((set) => ({
  radar: [],
  indicators: [],
  priceCorrelation: [],
  calendar: [],
  reports: [],
  capitalFlows: [],
  qualitativeIndicators: [],
  sentiment: null,
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [radar, indicators, priceCorrelation, calendar, reports, capitalFlows, qualitativeIndicators, sentiment] = await Promise.all([
      api.fetchMacroRadar(),
      api.fetchMacroIndicators(),
      api.fetchMacroPriceCorrelation(),
      api.fetchMacroCalendar(),
      api.fetchMarketReports(),
      api.fetchCapitalFlows(),
      api.fetchQualitativeIndicators(),
      api.fetchMarketSentiment(),
    ]);
    set({ radar, indicators, priceCorrelation, calendar, reports, capitalFlows, qualitativeIndicators, sentiment, loading: false });
  },
}));
