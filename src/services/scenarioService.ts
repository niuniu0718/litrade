import {
  generateDefaultParams,
  generateScenarioResults,
  generateSupplyDemandSheet,
  generateHistoricalScenarios,
} from '../data/mockScenario';
import type { ScenarioParams, ScenarioResult, SupplyDemandSheet, HistoricalScenario } from '../types/scenario';

export async function fetchDefaultParams(): Promise<ScenarioParams> {
  return generateDefaultParams();
}

export async function fetchScenarioResults(params: ScenarioParams): Promise<ScenarioResult[]> {
  return generateScenarioResults(params);
}

export async function fetchSupplyDemandSheet(params: ScenarioParams): Promise<SupplyDemandSheet[]> {
  return generateSupplyDemandSheet(params);
}

export async function fetchHistoricalScenarios(): Promise<HistoricalScenario[]> {
  return generateHistoricalScenarios();
}
