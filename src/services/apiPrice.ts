import {
  generateDomesticSpotPrices,
  generateInternationalSpotPrices,
  generateFuturesPrices,
  generateIndustryChainPrices,
} from '../data/mockPrice';
import type { DomesticSpotPrice, InternationalSpotPrice, FuturesPrice, IndustryChainPrice } from '../types/price';

export async function fetchDomesticSpotPrices(): Promise<DomesticSpotPrice[]> {
  return generateDomesticSpotPrices();
}

export async function fetchInternationalSpotPrices(): Promise<InternationalSpotPrice[]> {
  return generateInternationalSpotPrices();
}

export async function fetchFuturesPrices(): Promise<FuturesPrice[]> {
  return generateFuturesPrices();
}

export async function fetchIndustryChainPrices(): Promise<IndustryChainPrice[]> {
  return generateIndustryChainPrices();
}
