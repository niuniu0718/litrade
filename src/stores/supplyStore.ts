import { create } from 'zustand';
import type { MiningProject, SupplySummary, DemandSector, InternalDemand, SupplyDemandBalance } from '../types/supply';
import * as api from '../services/apiSupply';

interface SupplyState {
  projects: MiningProject[];
  summary: SupplySummary | null;
  demandSectors: DemandSector[];
  internalDemand: InternalDemand[];
  balance: SupplyDemandBalance[];
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useSupplyStore = create<SupplyState>((set) => ({
  projects: [],
  summary: null,
  demandSectors: [],
  internalDemand: [],
  balance: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [projects, summary, demandSectors, internalDemand, balance] = await Promise.all([
      api.fetchMiningProjects(),
      api.fetchSupplySummary(),
      api.fetchDemandSectors(),
      api.fetchInternalDemand(),
      api.fetchSupplyDemandBalance(),
    ]);
    set({ projects, summary, demandSectors, internalDemand, balance, loading: false });
  },
}));
