import type {
  DownstreamSector,
  DemandFormula,
  DemandFactor,
  EVSalesData,
  EnergyStorageData,
  DemandForecast,
} from '../types/demand';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateDownstreamSectors(): DownstreamSector[] {
  return [
    { sector: '新能源汽车', share: 62, demand: 65.2, growth: 28, intensity: 0.85 },
    { sector: '储能系统', share: 16, demand: 16.8, growth: 45, intensity: 0.72 },
    { sector: '消费电子', share: 8, demand: 8.4, growth: 3, intensity: 0.02 },
    { sector: '传统工业', share: 9, demand: 9.5, growth: -2, intensity: 0.15 },
    { sector: '其他应用', share: 5, demand: 5.3, growth: 5, intensity: 0.08 },
  ];
}

export function generateDemandFormula(): DemandFormula {
  const evSalesFactor: DemandFactor = {
    key: 'evSales',
    label: '全球EV销量',
    value: 1420,
    unit: '万辆',
    trend: Array.from({ length: 12 }, (_, i) => Math.round(randomBetween(100 + i * 5, 120 + i * 5))),
    yoyChange: 25.6,
  };

  const batteryCapacityFactor: DemandFactor = {
    key: 'batteryCapacity',
    label: '单车电池容量',
    value: 65.2,
    unit: 'kWh',
    trend: Array.from({ length: 12 }, (_, i) => Math.round(randomBetween(58 + i * 0.5, 64 + i * 0.5) * 10) / 10),
    yoyChange: 8.3,
  };

  const lithiumIntensityFactor: DemandFactor = {
    key: 'lithiumIntensity',
    label: '单位锂消耗',
    value: 0.85,
    unit: 'kg/kWh',
    trend: Array.from({ length: 12 }, () => Math.round(randomBetween(0.82, 0.88) * 100) / 100),
    yoyChange: -2.1,
  };

  const storageFactor: DemandFactor = {
    key: 'storageInstall',
    label: '储能装机量',
    value: 120,
    unit: 'GWh',
    trend: Array.from({ length: 12 }, (_, i) => Math.round(randomBetween(60 + i * 5, 80 + i * 6))),
    yoyChange: 42.5,
  };

  const factors = [evSalesFactor, batteryCapacityFactor, lithiumIntensityFactor, storageFactor];
  const result = Math.round((1420 * 65.2 * 0.85 / 1000 + 120 * 0.72 * 0.85) * 10) / 10;

  return {
    factors,
    result,
    resultUnit: 'LCE万吨',
  };
}

export function generateEVSales(): EVSalesData[] {
  const data: EVSalesData[] = [];
  let globalBase = 110;
  let chinaBase = 70;

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const seasonal = Math.sin(((11 - i) / 12) * Math.PI * 2) * 8;
    const globalSales = Math.round((globalBase + seasonal + randomBetween(-5, 5)) * 10) / 10;
    const chinaSales = Math.round((chinaBase + seasonal * 0.6 + randomBetween(-3, 3)) * 10) / 10;

    data.push({
      month: label,
      globalSales,
      chinaSales,
      globalYoy: Math.round(randomBetween(18, 35) * 10) / 10,
      chinaYoy: Math.round(randomBetween(20, 40) * 10) / 10,
    });

    globalBase += randomBetween(1, 3);
    chinaBase += randomBetween(0.5, 2);
  }

  return data;
}

export function generateEnergyStorage(): EnergyStorageData[] {
  const data: EnergyStorageData[] = [];
  let base = 8;

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const installation = Math.round((base + randomBetween(-1, 2)) * 10) / 10;
    data.push({
      month: label,
      installation,
      yoyChange: Math.round(randomBetween(30, 55) * 10) / 10,
    });

    base += randomBetween(0.5, 1.5);
  }

  return data;
}

export function generateDemandForecast(): DemandForecast[] {
  const data: DemandForecast[] = [];
  let base = 9.5;

  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    base += randomBetween(0.1, 0.6);
    const optimistic = Math.round((base * 1.15 + randomBetween(0, 0.3)) * 10) / 10;
    const baseline = Math.round(base * 10) / 10;
    const pessimistic = Math.round((base * 0.85 - randomBetween(0, 0.3)) * 10) / 10;

    data.push({ month: label, optimistic, baseline, pessimistic });
  }

  return data;
}
