import { create } from 'zustand';
import type { InventoryDimension, InventoryTrend, InventoryPriceRelation, InventoryCycle } from '../types/inventory';
import * as api from '../services/inventoryService';

interface InventoryState {
  dimensions: InventoryDimension[];
  trend: InventoryTrend[];
  priceRelation: InventoryPriceRelation[];
  cycle: InventoryCycle | null;
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  dimensions: [],
  trend: [],
  priceRelation: [],
  cycle: null,
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [dimensions, trend, priceRelation, cycle] = await Promise.all([
      api.fetchInventoryDimensions(),
      api.fetchInventoryTrend(),
      api.fetchInventoryPriceRelation(),
      api.fetchInventoryCycle(),
    ]);
    set({ dimensions, trend, priceRelation, cycle, loading: false });
  },
}));
