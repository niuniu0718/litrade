import { create } from 'zustand';
import type { DownstreamSector, DemandFormula, EVSalesData, EnergyStorageData, DemandForecast } from '../types/demand';
import * as api from '../services/demandService';

interface DemandState {
  downstreamSectors: DownstreamSector[];
  formula: DemandFormula | null;
  evSales: EVSalesData[];
  energyStorage: EnergyStorageData[];
  forecast: DemandForecast[];
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useDemandStore = create<DemandState>((set) => ({
  downstreamSectors: [],
  formula: null,
  evSales: [],
  energyStorage: [],
  forecast: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [downstreamSectors, formula, evSales, energyStorage, forecast] = await Promise.all([
      api.fetchDownstreamSectors(),
      api.fetchDemandFormula(),
      api.fetchEVSales(),
      api.fetchEnergyStorage(),
      api.fetchDemandForecast(),
    ]);
    set({ downstreamSectors, formula, evSales, energyStorage, forecast, loading: false });
  },
}));
