import { create } from 'zustand';
import type { TradeRecord, PortArrival, TradePartner } from '../types/trade';
import * as api from '../services/apiTrade';

interface TradeState {
  records: TradeRecord[];
  arrivals: PortArrival[];
  partners: TradePartner[];
  loading: boolean;
  fetchAll: () => Promise<void>;
}

export const useTradeStore = create<TradeState>((set) => ({
  records: [],
  arrivals: [],
  partners: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    const [records, arrivals, partners] = await Promise.all([
      api.fetchTradeRecords(),
      api.fetchPortArrivals(),
      api.fetchTradePartners(),
    ]);
    set({ records, arrivals, partners, loading: false });
  },
}));
