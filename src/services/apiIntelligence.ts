import {
  generateMarketReports,
  generateCapitalFlows,
  generateMacroIndicators,
  generateMarketSentiment,
} from '../data/mockIntelligence';
import type { MarketReport, CapitalFlow, MacroIndicator, MarketSentiment } from '../types/intelligence';

export async function fetchMarketReports(): Promise<MarketReport[]> {
  return generateMarketReports();
}

export async function fetchCapitalFlows(): Promise<CapitalFlow[]> {
  return generateCapitalFlows();
}

export async function fetchMacroIndicators(): Promise<MacroIndicator[]> {
  return generateMacroIndicators();
}

export async function fetchMarketSentiment(): Promise<MarketSentiment> {
  return generateMarketSentiment();
}
