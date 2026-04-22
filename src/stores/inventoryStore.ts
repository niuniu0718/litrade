import { create } from 'zustand';
import type { InventoryOverview, InventoryTrend, InventoryPriceRelation, InventoryCycle } from '../types/inventory';
import * as api from '../services/inventoryService';

interface InventoryState {
  overview: InventoryOverview | null;
  trend: InventoryTrend[];
  priceRelation: InventoryPriceRelation[];
  cycle: InventoryCycle | null;
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  overview: null,
  trend: [],
  priceRelation: [],
  cycle: null,
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [overview, trend, priceRelation, cycle] = await Promise.all([
      api.fetchInventoryOverview(),
      api.fetchInventoryTrend(),
      api.fetchInventoryPriceRelation(),
      api.fetchInventoryCycle(),
    ]);
    set({ overview, trend, priceRelation, cycle, loading: false });
  },
}));
