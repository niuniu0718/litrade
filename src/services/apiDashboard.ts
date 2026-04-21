import {
  generateDashboardMetrics,
  generateDashboardAlerts,
  generatePriceTrendSummaries,
  generateKeyStatistics,
} from '../data/mockDashboard';
import type { DashboardMetrics, DashboardAlert, PriceTrendSummary, KeyStatistics } from '../types/dashboard';

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  return generateDashboardMetrics();
}

export async function fetchDashboardAlerts(): Promise<DashboardAlert[]> {
  return generateDashboardAlerts();
}

export async function fetchPriceTrendSummaries(): Promise<PriceTrendSummary[]> {
  return generatePriceTrendSummaries();
}

export async function fetchKeyStatistics(): Promise<KeyStatistics> {
  return generateKeyStatistics();
}
