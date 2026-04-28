import {
  generateInventoryDimensions,
  generateInventoryTrend,
  generateInventoryPriceRelation,
  generateInventoryCycle,
} from '../data/mockInventory';
import type { InventoryDimension, InventoryTrend, InventoryPriceRelation, InventoryCycle } from '../types/inventory';

export async function fetchInventoryDimensions(): Promise<InventoryDimension[]> {
  return generateInventoryDimensions();
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
