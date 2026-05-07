import {
  generateProjectCosts,
  generateCostCurve,
  generateCostGradients,
} from '../data/mockCost';
import type { ProjectCost, CostCurvePoint, CostGradient } from '../types/cost';

export async function fetchProjectCosts(): Promise<ProjectCost[]> {
  return generateProjectCosts();
}

export async function fetchCostCurve(): Promise<CostCurvePoint[]> {
  return generateCostCurve();
}

export async function fetchCostGradients(): Promise<CostGradient[]> {
  return generateCostGradients();
}
