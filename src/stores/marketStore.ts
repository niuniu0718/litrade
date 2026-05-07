import { create } from 'zustand';
import type { PriceSnapshot, PricePoint, ProductCode } from '../types';
import * as api from '../services/api';

interface MarketState {
  snapshots: PriceSnapshot[];
  priceHistories: Record<ProductCode, PricePoint[]>;
  loading: boolean;
  fetchSnapshots: () => Promise<void>;
  fetchPriceHistory: (code: ProductCode, days?: number) => Promise<void>;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  snapshots: [],
  priceHistories: {} as Record<ProductCode, PricePoint[]>,
  loading: false,

  fetchSnapshots: async () => {
    set({ loading: true });
    const snapshots = await api.fetchPriceSnapshots();
    set({ snapshots, loading: false });
  },

  fetchPriceHistory: async (code, days = 365) => {
    const existing = get().priceHistories[code];
    if (existing) return;
    const history = await api.fetchPriceHistory(code, days);
    set((state) => ({
      priceHistories: { ...state.priceHistories, [code]: history },
    }));
  },
}));
