import {
  generateDownstreamSectors,
  generateDemandFormula,
  generateEVSales,
  generateEnergyStorage,
  generateDemandForecast,
} from '../data/mockDemand';
import type { DownstreamSector, DemandFormula, EVSalesData, EnergyStorageData, DemandForecast } from '../types/demand';

export async function fetchDownstreamSectors(): Promise<DownstreamSector[]> {
  return generateDownstreamSectors();
}

export async function fetchDemandFormula(): Promise<DemandFormula> {
  return generateDemandFormula();
}

export async function fetchEVSales(): Promise<EVSalesData[]> {
  return generateEVSales();
}

export async function fetchEnergyStorage(): Promise<EnergyStorageData[]> {
  return generateEnergyStorage();
}

export async function fetchDemandForecast(): Promise<DemandForecast[]> {
  return generateDemandForecast();
}
