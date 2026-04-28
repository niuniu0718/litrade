import dayjs from 'dayjs';
import type { DomesticSpotPrice, InternationalSpotPrice, FuturesPrice, IndustryChainPrice } from '../types/price';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateDomesticSpotPrices(): DomesticSpotPrice[] {
  const products = [
    { product: 'li2co3_battery', name: '电池级碳酸锂', base: 172000, unit: '元/吨', category: 'lithium_carbonate' as const },
    { product: 'li2co3_industrial', name: '工业级碳酸锂', base: 168000, unit: '元/吨', category: 'lithium_carbonate' as const },
    { product: 'lioh', name: '氢氧化锂', base: 166000, unit: '元/吨', category: 'lithium_hydroxide' as const },
    { product: 'spodumene', name: '锂辉石 SC6', base: 1050, unit: '美元/吨', category: 'spodumene' as const },
    { product: 'spodumene_sc5', name: '锂辉石 SC5', base: 920, unit: '美元/吨', category: 'spodumene' as const },
  ];

  return products.map((p, i) => {
    const price = Math.round(p.base + randomBetween(-3000, 3000));
    const change = randomBetween(-1500, 1500);
    return {
      id: `${p.product}`,
      product: p.product,
      name: p.name,
      price,
      change: Math.round(change),
      changePercent: Math.round((change / p.base) * 10000) / 100,
      unit: p.unit,
      updatedAt: dayjs().subtract(i, 'hour').toISOString(),
      trend7d: Array.from({ length: 7 }, () => Math.round(p.base + randomBetween(-3000, 3000))),
      category: p.category,
    };
  });
}

export function generateInternationalSpotPrices(): InternationalSpotPrice[] {
  const products = [
    { product: 'li2co3_battery', name: 'Battery-grade Li₂CO₃', base: 10200, unit: '美元/吨', category: 'lithium_carbonate' as const },
    { product: 'li2co3_technical', name: 'Technical Li₂CO₃', base: 9600, unit: '美元/吨', category: 'lithium_carbonate' as const },
    { product: 'lioh_battery', name: 'Battery-grade LiOH', base: 10800, unit: '美元/吨', category: 'lithium_hydroxide' as const },
    { product: 'lioh_technical', name: 'Technical LiOH', base: 9900, unit: '美元/吨', category: 'lithium_hydroxide' as const },
    { product: 'spodumene_sc6', name: 'Spodumene SC6', base: 850, unit: '美元/吨', category: 'spodumene' as const },
    { product: 'spodumene_sc5', name: 'Spodumene SC5', base: 720, unit: '美元/吨', category: 'spodumene' as const },
  ];

  return products.map((p, i) => {
    const price = Math.round(p.base + randomBetween(-150, 150));
    const change = randomBetween(-50, 50);
    return {
      id: `intl-${p.product}`,
      product: p.product,
      name: p.name,
      source: 'FastMarkets',
      price,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round((change / p.base) * 10000) / 100,
      unit: p.unit,
      updatedAt: dayjs().subtract(i, 'hour').toISOString(),
      trend7d: Array.from({ length: 7 }, () => Math.round(p.base + randomBetween(-150, 150))),
      category: p.category,
    };
  });
}

export function generateFuturesPrices(): FuturesPrice[] {
  const contracts = [
    { contract: 'LC2507', exchange: '广期所', product: '碳酸锂', base: 173500 },
    { contract: 'LC2508', exchange: '广期所', product: '碳酸锂', base: 174200 },
    { contract: 'LC2509', exchange: '广期所', product: '碳酸锂', base: 175000 },
    { contract: 'LC2510', exchange: '广期所', product: '碳酸锂', base: 175800 },
    { contract: 'LC2511', exchange: '广期所', product: '碳酸锂', base: 176500 },
    { contract: 'LC2512', exchange: '广期所', product: '碳酸锂', base: 177200 },
  ];

  return contracts.map((c) => {
    const latestPrice = Math.round(c.base + randomBetween(-1000, 1000));
    const change = randomBetween(-500, 500);
    return {
      id: c.contract,
      contract: c.contract,
      exchange: c.exchange,
      product: c.product,
      latestPrice,
      change: Math.round(change),
      changePercent: Math.round((change / c.base) * 10000) / 100,
      openInterest: Math.round(randomBetween(5000, 25000)),
      volume: Math.round(randomBetween(10000, 50000)),
      unit: '元/吨',
      updatedAt: dayjs().toISOString(),
    };
  });
}

export function generateIndustryChainPrices(): IndustryChainPrice[] {
  return [
    { stage: '矿石', name: '锂辉石 SC6', price: 1050, unit: '美元/吨', change: -12, changePercent: -1.13 },
    { stage: '矿石', name: '锂云母', price: 6800, unit: '元/吨', change: -80, changePercent: -1.16 },
    { stage: '锂盐', name: '电池级碳酸锂', price: 172000, unit: '元/吨', change: -500, changePercent: -0.29 },
    { stage: '锂盐', name: '氢氧化锂', price: 166000, unit: '元/吨', change: -300, changePercent: -0.18 },
    { stage: '正极', name: '磷酸铁锂', price: 52000, unit: '元/吨', change: -200, changePercent: -0.38 },
    { stage: '正极', name: '三元材料', price: 175000, unit: '元/吨', change: -800, changePercent: -0.46 },
    { stage: '电池', name: '磷酸铁锂电芯', price: 0.42, unit: '元/Wh', change: -0.01, changePercent: -2.33 },
    { stage: '电池', name: '三元电芯', price: 0.50, unit: '元/Wh', change: -0.01, changePercent: -1.96 },
  ];
}
