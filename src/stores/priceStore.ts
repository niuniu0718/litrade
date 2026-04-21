import { create } from 'zustand';
import type { DomesticSpotPrice, FuturesPrice, IndustryChainPrice } from '../types/price';
import * as api from '../services/apiPrice';

interface PriceState {
  spotPrices: DomesticSpotPrice[];
  futuresPrices: FuturesPrice[];
  chainPrices: IndustryChainPrice[];
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const usePriceStore = create<PriceState>((set) => ({
  spotPrices: [],
  futuresPrices: [],
  chainPrices: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [spotPrices, futuresPrices, chainPrices] = await Promise.all([
      api.fetchDomesticSpotPrices(),
      api.fetchFuturesPrices(),
      api.fetchIndustryChainPrices(),
    ]);
    set({ spotPrices, futuresPrices, chainPrices, loading: false });
  },
}));
