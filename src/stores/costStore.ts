import { create } from 'zustand';
import type { ProjectCost, CostCurvePoint, CostGradient } from '../types/cost';
import * as api from '../services/apiCost';

interface CostState {
  projectCosts: ProjectCost[];
  costCurve: CostCurvePoint[];
  costGradients: CostGradient[];
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useCostStore = create<CostState>((set) => ({
  projectCosts: [],
  costCurve: [],
  costGradients: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [projectCosts, costCurve, costGradients] = await Promise.all([
      api.fetchProjectCosts(),
      api.fetchCostCurve(),
      api.fetchCostGradients(),
    ]);
    set({ projectCosts, costCurve, costGradients, loading: false });
  },
}));
