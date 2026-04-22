import { create } from 'zustand';
import type { ScenarioParams, ScenarioResult, SupplyDemandSheet, HistoricalScenario } from '../types/scenario';
import * as api from '../services/scenarioService';

interface ScenarioState {
  params: ScenarioParams;
  results: ScenarioResult[];
  sheet: SupplyDemandSheet[];
  historical: HistoricalScenario[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  updateParams: (params: Partial<ScenarioParams>) => Promise<void>;
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  params: {
    evGrowthRate: 20,
    storageGrowthRate: 30,
    supplyChange: 5,
    macroEnvironment: 40,
  },
  results: [],
  sheet: [],
  historical: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const { params } = get();
    const [defaultParams, results, sheet, historical] = await Promise.all([
      api.fetchDefaultParams(),
      api.fetchScenarioResults(params),
      api.fetchSupplyDemandSheet(params),
      api.fetchHistoricalScenarios(),
    ]);
    set({ params: defaultParams, results, sheet, historical, loading: false });
  },

  updateParams: async (partial) => {
    const { params } = get();
    const newParams = { ...params, ...partial };
    set({ loading: true });
    const [results, sheet] = await Promise.all([
      api.fetchScenarioResults(newParams),
      api.fetchSupplyDemandSheet(newParams),
    ]);
    set({ params: newParams, results, sheet, loading: false });
  },
}));
