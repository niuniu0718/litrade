import {
  generateTradeRecords,
  generatePortArrivals,
  generateTradePartners,
} from '../data/mockTrade';
import type { TradeRecord, PortArrival, TradePartner } from '../types/trade';

export async function fetchTradeRecords(): Promise<TradeRecord[]> {
  return generateTradeRecords();
}

export async function fetchPortArrivals(): Promise<PortArrival[]> {
  return generatePortArrivals();
}

export async function fetchTradePartners(): Promise<TradePartner[]> {
  return generateTradePartners();
}
