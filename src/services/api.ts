/**
 * 数据服务抽象层
 *
 * 当前使用本地模拟数据，后续对接后端时只需替换此文件中的实现即可。
 * 页面组件只通过此层获取数据，不直接依赖 mock 函数。
 */

import type {
  ProductCode,
  PricePoint,
  PriceSnapshot,
} from '../types';
import {
  generatePriceHistory,
  generatePriceSnapshot,
} from '../data/mock';

// ============ 行情服务 ============

export async function fetchPriceHistory(code: ProductCode, days = 365): Promise<PricePoint[]> {
  // TODO: 替换为 GET /api/prices/:product?days=365
  return generatePriceHistory(code, days);
}

export async function fetchPriceSnapshots(): Promise<PriceSnapshot[]> {
  // TODO: 替换为 GET /api/prices/snapshots
  const codes: ProductCode[] = ['li2co3_battery', 'li2co3_industrial', 'lioh', 'spodumene'];
  return codes.map(generatePriceSnapshot);
}
