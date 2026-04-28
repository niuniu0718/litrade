import { create } from 'zustand';
import type { HistoricalEvent, CycleAnalysis } from '../types/scenario';
import * as api from '../services/scenarioService';

interface ScenarioState {
  events: HistoricalEvent[];
  priceTimeline: { date: string; price: number }[];
  cycleAnalysis: CycleAnalysis | null;
  selectedEventId: string | null;
  loading: boolean;
  fetchAll: () => Promise<void>;
  selectEvent: (id: string | null) => void;
}

export const useScenarioStore = create<ScenarioState>((set) => ({
  events: [],
  priceTimeline: [],
  cycleAnalysis: null,
  selectedEventId: null,
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const [events, priceTimeline] = await Promise.all([
        api.fetchHistoricalEvents(),
        api.fetchPriceTimeline(),
      ]);
      const cycleAnalysis = await api.fetchCycleAnalysis(events);
      set({ events, priceTimeline, cycleAnalysis, loading: false });
    } catch (e) {
      console.error('scenarioStore.fetchAll failed:', e);
      set({ loading: false });
    }
  },

  selectEvent: (id) => {
    set({ selectedEventId: id });
  },
}));
