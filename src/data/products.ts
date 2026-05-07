import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    code: 'li2co3_battery',
    name: '电池级碳酸锂',
    unit: '元/吨',
    category: 'salt',
  },
  {
    code: 'li2co3_industrial',
    name: '工业级碳酸锂',
    unit: '元/吨',
    category: 'salt',
  },
  {
    code: 'lioh',
    name: '氢氧化锂',
    unit: '元/吨',
    category: 'salt',
  },
  {
    code: 'spodumene',
    name: '锂精矿 SC6',
    unit: '美元/吨',
    category: 'mineral',
  },
];

export const PRODUCT_MAP = Object.fromEntries(
  PRODUCTS.map((p) => [p.code, p])
) as Record<string, Product>;

export const getProduct = (code: string): Product | undefined => PRODUCT_MAP[code];
export const getProductName = (code: string): string => PRODUCT_MAP[code]?.name ?? code;
