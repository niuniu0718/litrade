import type {
  ScenarioParams,
  ScenarioResult,
  SupplyDemandSheet,
  HistoricalScenario,
} from '../types/scenario';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateDefaultParams(): ScenarioParams {
  return {
    evGrowthRate: 20,
    storageGrowthRate: 30,
    supplyChange: 5,
    macroEnvironment: 40,
  };
}

export function generateScenarioResults(params: ScenarioParams): ScenarioResult[] {
  const data: ScenarioResult[] = [];
  let demandBase = 9.5;
  let supplyBase = 8.8;
  let priceBase = 75000;

  const evMultiplier = 1 + params.evGrowthRate / 100;
  const storageMultiplier = 1 + params.storageGrowthRate / 100;
  const supplyMultiplier = 1 + params.supplyChange / 100;
  const macroFactor = 1 - (params.macroEnvironment - 50) / 200;

  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    demandBase = Math.round((demandBase + randomBetween(0.1, 0.5) * evMultiplier) * 10) / 10;
    supplyBase = Math.round((supplyBase + randomBetween(0.05, 0.4) * supplyMultiplier) * 10) / 10;

    const demandDelta = randomBetween(0.1, 0.3);
    const supplyDelta = randomBetween(0.05, 0.2);

    priceBase = Math.round(priceBase * macroFactor + randomBetween(-2000, 2000));
    if (priceBase < 30000) priceBase = 30000;
    if (priceBase > 150000) priceBase = 150000;

    data.push({
      month: label,
      optimisticDemand: Math.round((demandBase + demandDelta) * 10) / 10,
      baselineDemand: demandBase,
      pessimisticDemand: Math.round((demandBase - demandDelta) * 10) / 10,
      optimisticSupply: Math.round((supplyBase - supplyDelta) * 10) / 10,
      baselineSupply: supplyBase,
      pessimisticSupply: Math.round((supplyBase + supplyDelta) * 10) / 10,
      optimisticPrice: Math.round(priceBase * 1.12),
      baselinePrice: priceBase,
      pessimisticPrice: Math.round(priceBase * 0.85),
    });
  }

  return data;
}

export function generateSupplyDemandSheet(params: ScenarioParams): SupplyDemandSheet[] {
  const baseDemand = 105;
  const baseSupply = 106;
  const basePrice = 75000;

  const evMult = 1 + params.evGrowthRate / 100;
  const storageMult = 1 + params.storageGrowthRate / 100;
  const supplyMult = 1 + params.supplyChange / 100;

  const scenarios = [
    { name: '乐观', demandMod: 1.1 * evMult * storageMult, supplyMod: 0.95 * supplyMult },
    { name: '基准', demandMod: 1.0 * evMult * storageMult, supplyMod: 1.0 * supplyMult },
    { name: '悲观', demandMod: 0.9 * evMult * storageMult, supplyMod: 1.08 * supplyMult },
  ];

  return scenarios.map((s) => {
    const demand = Math.round(baseDemand * s.demandMod * 10) / 10;
    const supply = Math.round(baseSupply * s.supplyMod * 10) / 10;
    const gap = Math.round((supply - demand) * 10) / 10;
    const priceMod = gap > 0 ? 1 - gap / 100 : 1 + Math.abs(gap) / 80;
    const estimatedPrice = Math.round(basePrice * priceMod);

    return {
      scenario: s.name,
      demand,
      supply,
      gap,
      estimatedPrice,
    };
  });
}

export function generateHistoricalScenarios(): HistoricalScenario[] {
  return [
    {
      id: 'hist-1',
      period: '2021-2022',
      description: '新能源爆发期',
      conditions: 'EV渗透率从8%飙升至15%，储能市场启动，供给严重不足',
      actualPriceChange: 420,
      duration: '约18个月',
    },
    {
      id: 'hist-2',
      period: '2022H2-2023',
      description: '供给释放+需求放缓',
      conditions: '新增产能集中投产，下游去库存，欧洲补贴退坡',
      actualPriceChange: -75,
      duration: '约12个月',
    },
    {
      id: 'hist-3',
      period: '2024H1',
      description: '磨底筑基期',
      conditions: '供给端收缩（澳矿减产），需求温和复苏，库存缓慢去化',
      actualPriceChange: 15,
      duration: '约6个月',
    },
    {
      id: 'hist-4',
      period: '2018-2020',
      description: '供需双弱期',
      conditions: 'EV补贴退坡，贸易摩擦，全球需求疲弱',
      actualPriceChange: -55,
      duration: '约24个月',
    },
  ];
}
