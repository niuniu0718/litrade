import dayjs from 'dayjs';
import type { DomesticSpotPrice, FuturesPrice, IndustryChainPrice } from '../types/price';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateDomesticSpotPrices(): DomesticSpotPrice[] {
  const products = [
    { product: 'li2co3_battery', name: '电池级碳酸锂', base: 75000, unit: '元/吨' },
    { product: 'li2co3_industrial', name: '工业级碳酸锂', base: 72000, unit: '元/吨' },
    { product: 'lioh', name: '氢氧化锂', base: 68000, unit: '元/吨' },
    { product: 'spodumene', name: '锂精矿 SC6', base: 850, unit: '美元/吨' },
    { product: 'lithium_metal', name: '金属锂', base: 420000, unit: '元/吨' },
    { product: 'lfp', name: '磷酸铁锂', base: 42000, unit: '元/吨' },
    { product: 'ncm', name: '三元材料', base: 125000, unit: '元/吨' },
  ];

  const regions = ['江西', '四川', '青海', '江苏', '山东'];

  return products.flatMap((p) =>
    regions.slice(0, p.product === 'spodumene' ? 1 : 3).map((region, i) => {
      const price = Math.round(p.base + randomBetween(-2000, 2000));
      const change = randomBetween(-800, 800);
      return {
        id: `${p.product}-${region}`,
        product: p.product,
        name: p.name,
        region,
        price,
        change: Math.round(change),
        changePercent: Math.round((change / p.base) * 10000) / 100,
        unit: p.unit,
        updatedAt: dayjs().subtract(i, 'hour').toISOString(),
        trend7d: Array.from({ length: 7 }, () => Math.round(p.base + randomBetween(-2000, 2000))),
      };
    })
  );
}

export function generateFuturesPrices(): FuturesPrice[] {
  const contracts = [
    { contract: 'LC2507', exchange: '广期所', product: '碳酸锂', base: 74500 },
    { contract: 'LC2508', exchange: '广期所', product: '碳酸锂', base: 75200 },
    { contract: 'LC2509', exchange: '广期所', product: '碳酸锂', base: 76000 },
    { contract: 'LC2510', exchange: '广期所', product: '碳酸锂', base: 76800 },
    { contract: 'LC2511', exchange: '广期所', product: '碳酸锂', base: 77500 },
    { contract: 'LC2512', exchange: '广期所', product: '碳酸锂', base: 78200 },
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
    { stage: '矿石', name: '锂辉石 SC6', price: 850, unit: '美元/吨', change: -12, changePercent: -1.39 },
    { stage: '矿石', name: '锂云母', price: 3200, unit: '元/吨', change: -80, changePercent: -2.44 },
    { stage: '锂盐', name: '电池级碳酸锂', price: 75000, unit: '元/吨', change: -500, changePercent: -0.66 },
    { stage: '锂盐', name: '氢氧化锂', price: 68000, unit: '元/吨', change: -300, changePercent: -0.44 },
    { stage: '正极', name: '磷酸铁锂', price: 42000, unit: '元/吨', change: -200, changePercent: -0.47 },
    { stage: '正极', name: '三元材料', price: 125000, unit: '元/吨', change: -800, changePercent: -0.64 },
    { stage: '电池', name: '磷酸铁锂电芯', price: 0.38, unit: '元/Wh', change: -0.01, changePercent: -2.56 },
    { stage: '电池', name: '三元电芯', price: 0.45, unit: '元/Wh', change: -0.01, changePercent: -2.17 },
  ];
}
