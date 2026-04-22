import { create } from 'zustand';
import type { MacroRadarData, MacroIndicator, MacroPriceCorrelation, MacroCalendarEvent } from '../types/macro';
import * as api from '../services/macroService';

interface MacroState {
  radar: MacroRadarData[];
  indicators: MacroIndicator[];
  priceCorrelation: MacroPriceCorrelation[];
  calendar: MacroCalendarEvent[];
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useMacroStore = create<MacroState>((set) => ({
  radar: [],
  indicators: [],
  priceCorrelation: [],
  calendar: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [radar, indicators, priceCorrelation, calendar] = await Promise.all([
      api.fetchMacroRadar(),
      api.fetchMacroIndicators(),
      api.fetchMacroPriceCorrelation(),
      api.fetchMacroCalendar(),
    ]);
    set({ radar, indicators, priceCorrelation, calendar, loading: false });
  },
}));
