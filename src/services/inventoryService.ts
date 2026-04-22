import {
  generateInventoryOverview,
  generateInventoryTrend,
  generateInventoryPriceRelation,
  generateInventoryCycle,
} from '../data/mockInventory';
import type { InventoryOverview, InventoryTrend, InventoryPriceRelation, InventoryCycle } from '../types/inventory';

export async function fetchInventoryOverview(): Promise<InventoryOverview> {
  return generateInventoryOverview();
}

export async function fetchInventoryTrend(): Promise<InventoryTrend[]> {
  return generateInventoryTrend();
}

export async function fetchInventoryPriceRelation(): Promise<InventoryPriceRelation[]> {
  return generateInventoryPriceRelation();
}

export async function fetchInventoryCycle(): Promise<InventoryCycle> {
  return generateInventoryCycle();
}
