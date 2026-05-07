import {
  generatePriceOverview,
  generatePriceTrendSummaries,
  generateFrameworkIndicators,
  generatePriceJudgment,
  generateDashboardAlerts,
  generateKeyStatistics,
} from '../data/mockDashboard';
import type { PriceOverview, PriceTrendSummary, FrameworkIndicators, PriceJudgment, DashboardAlert, KeyStatistics } from '../types/dashboard';

export async function fetchPriceOverview(): Promise<PriceOverview> {
  return generatePriceOverview();
}

export async function fetchPriceTrendSummaries(): Promise<PriceTrendSummary[]> {
  return generatePriceTrendSummaries();
}

export async function fetchFrameworkIndicators(): Promise<FrameworkIndicators> {
  return generateFrameworkIndicators();
}

export async function fetchPriceJudgment(indicators: FrameworkIndicators): Promise<PriceJudgment> {
  return generatePriceJudgment(indicators);
}

export async function fetchDashboardAlerts(): Promise<DashboardAlert[]> {
  return generateDashboardAlerts();
}

export async function fetchKeyStatistics(): Promise<KeyStatistics> {
  return generateKeyStatistics();
}
