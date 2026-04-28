import { create } from 'zustand';
import type { MiningProject, ProjectProduction, SupplySummary, DemandSector, InternalDemand, SupplyDemandBalance } from '../types/supply';
import * as api from '../services/apiSupply';

interface SupplyState {
  projects: MiningProject[];
  projectProduction: ProjectProduction[];
  summary: SupplySummary | null;
  demandSectors: DemandSector[];
  internalDemand: InternalDemand[];
  balance: SupplyDemandBalance[];
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useSupplyStore = create<SupplyState>((set) => ({
  projects: [],
  projectProduction: [],
  summary: null,
  demandSectors: [],
  internalDemand: [],
  balance: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [projects, projectProduction, summary, demandSectors, internalDemand, balance] = await Promise.all([
      api.fetchMiningProjects(),
      api.fetchProjectProduction(),
      api.fetchSupplySummary(),
      api.fetchDemandSectors(),
      api.fetchInternalDemand(),
      api.fetchSupplyDemandBalance(),
    ]);
    set({ projects, projectProduction, summary, demandSectors, internalDemand, balance, loading: false });
  },
}));
