import {
  generateMiningProjects,
  generateSupplySummary,
  generateDemandSectors,
  generateInternalDemand,
  generateSupplyDemandBalance,
} from '../data/mockSupply';
import type { MiningProject, SupplySummary, DemandSector, InternalDemand, SupplyDemandBalance } from '../types/supply';

export async function fetchMiningProjects(): Promise<MiningProject[]> {
  return generateMiningProjects();
}

export async function fetchSupplySummary(): Promise<SupplySummary> {
  return generateSupplySummary();
}

export async function fetchDemandSectors(): Promise<DemandSector[]> {
  return generateDemandSectors();
}

export async function fetchInternalDemand(): Promise<InternalDemand[]> {
  return generateInternalDemand();
}

export async function fetchSupplyDemandBalance(): Promise<SupplyDemandBalance[]> {
  return generateSupplyDemandBalance();
}
