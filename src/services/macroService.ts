import {
  generateMacroRadar,
  generateMacroIndicators,
  generateMacroPriceCorrelation,
  generateMacroCalendar,
  generateMarketReports,
  generateCapitalFlows,
  generateQualitativeIndicators,
  generateMarketSentiment,
  generateBreakingNews,
} from '../data/mockMacro';
import type { MacroRadarData, MacroIndicator, MacroPriceCorrelation, MacroCalendarEvent, MarketReport, CapitalFlow, QualitativeIndicator, MarketSentiment, BreakingNews } from '../types/macro';

export async function fetchMacroRadar(): Promise<MacroRadarData[]> {
  return generateMacroRadar();
}

export async function fetchMacroIndicators(): Promise<MacroIndicator[]> {
  return generateMacroIndicators();
}

export async function fetchMacroPriceCorrelation(): Promise<MacroPriceCorrelation[]> {
  return generateMacroPriceCorrelation();
}

export async function fetchMacroCalendar(): Promise<MacroCalendarEvent[]> {
  return generateMacroCalendar();
}

// ─── 以下函数原属 apiIntelligence.ts ───

export async function fetchMarketReports(): Promise<MarketReport[]> {
  return generateMarketReports();
}

export async function fetchCapitalFlows(): Promise<CapitalFlow[]> {
  return generateCapitalFlows();
}

export async function fetchQualitativeIndicators(): Promise<QualitativeIndicator[]> {
  return generateQualitativeIndicators();
}

export async function fetchMarketSentiment(): Promise<MarketSentiment> {
  return generateMarketSentiment();
}

export async function fetchBreakingNews(): Promise<BreakingNews[]> {
  return generateBreakingNews();
}
