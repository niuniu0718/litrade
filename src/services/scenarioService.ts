import {
  generateHistoricalEvents,
  generatePriceTimeline,
  generateCycleAnalysis,
} from '../data/mockScenario';
import type { HistoricalEvent, CycleAnalysis } from '../types/scenario';

export async function fetchHistoricalEvents(): Promise<HistoricalEvent[]> {
  return generateHistoricalEvents();
}

export async function fetchPriceTimeline(): Promise<{ date: string; price: number }[]> {
  return generatePriceTimeline();
}

export async function fetchCycleAnalysis(events: HistoricalEvent[]): Promise<CycleAnalysis> {
  return generateCycleAnalysis(events);
}
