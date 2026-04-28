import { create } from 'zustand';
import type { DomesticSpotPrice, InternationalSpotPrice, FuturesPrice, IndustryChainPrice } from '../types/price';
import * as api from '../services/apiPrice';

interface PriceState {
  spotPrices: DomesticSpotPrice[];
  intlSpotPrices: InternationalSpotPrice[];
  futuresPrices: FuturesPrice[];
  chainPrices: IndustryChainPrice[];
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const usePriceStore = create<PriceState>((set) => ({
  spotPrices: [],
  intlSpotPrices: [],
  futuresPrices: [],
  chainPrices: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [spotPrices, intlSpotPrices, futuresPrices, chainPrices] = await Promise.all([
      api.fetchDomesticSpotPrices(),
      api.fetchInternationalSpotPrices(),
      api.fetchFuturesPrices(),
      api.fetchIndustryChainPrices(),
    ]);
    set({ spotPrices, intlSpotPrices, futuresPrices, chainPrices, loading: false });
  },
}));
