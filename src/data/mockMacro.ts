import type {
  MacroRadarData,
  MacroIndicator,
  MacroPriceCorrelation,
  MacroCalendarEvent,
} from '../types/macro';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateMacroRadar(): MacroRadarData[] {
  return [
    { dimension: '利率环境', score: Math.round(randomBetween(30, 70)), label: '中性偏紧' },
    { dimension: '汇率趋势', score: Math.round(randomBetween(35, 65)), label: '美元偏强' },
    { dimension: '流动性', score: Math.round(randomBetween(40, 75)), label: '适度宽松' },
    { dimension: '经济周期', score: Math.round(randomBetween(30, 60)), label: '温和复苏' },
  ];
}

export function generateMacroIndicators(): MacroIndicator[] {
  return [
    {
      key: 'fedRate',
      name: '联邦基金利率',
      value: 5.25,
      unit: '%',
      change: 0,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(4.75, 5.5) * 100) / 100),
      impact: 'negative',
    },
    {
      key: 'dollarIndex',
      name: '美元指数',
      value: Math.round(randomBetween(100, 108) * 10) / 10,
      unit: '',
      change: Math.round(randomBetween(-2, 3) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(98, 110) * 10) / 10),
      impact: 'negative',
    },
    {
      key: 'chinaPMI',
      name: '中国制造业PMI',
      value: Math.round(randomBetween(48.5, 52) * 10) / 10,
      unit: '',
      change: Math.round(randomBetween(-1.5, 1.5) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(48, 52.5) * 10) / 10),
      impact: 'positive',
    },
    {
      key: 'm2Growth',
      name: '中国M2增速',
      value: Math.round(randomBetween(8, 12) * 10) / 10,
      unit: '%',
      change: Math.round(randomBetween(-0.5, 0.8) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(8, 12.5) * 10) / 10),
      impact: 'positive',
    },
    {
      key: 'cpi',
      name: '美国CPI同比',
      value: Math.round(randomBetween(2.8, 4.0) * 10) / 10,
      unit: '%',
      change: Math.round(randomBetween(-0.5, 0.3) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(2.5, 4.5) * 10) / 10),
      impact: 'negative',
    },
    {
      key: 'chinaGDP',
      name: '中国GDP增速',
      value: Math.round(randomBetween(4.5, 5.5) * 10) / 10,
      unit: '%',
      change: Math.round(randomBetween(-0.3, 0.5) * 10) / 10,
      trend: Array.from({ length: 12 }, () => Math.round(randomBetween(4, 6) * 10) / 10),
      impact: 'positive',
    },
  ];
}

export function generateMacroPriceCorrelation(): MacroPriceCorrelation[] {
  const data: MacroPriceCorrelation[] = [];
  let liPrice = 75000;
  let macroBase = 103;

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    liPrice = Math.round(liPrice + randomBetween(-5000, 4000));
    macroBase = Math.round((macroBase + randomBetween(-2, 2)) * 10) / 10;

    data.push({
      month: label,
      liPrice,
      macroValue: macroBase,
    });
  }

  return data;
}

export function generateMacroCalendar(): MacroCalendarEvent[] {
  const events: Omit<MacroCalendarEvent, 'id'>[] = [
    { date: '2025-02-01', event: '美国非农就业数据', importance: 'high', previousValue: '21.6万', forecast: '18万', impact: '就业强则加息预期升，利空金属' },
    { date: '2025-02-05', event: '中国财新制造业PMI', importance: 'high', previousValue: '50.8', forecast: '50.5', impact: 'PMI超预期利多锂价' },
    { date: '2025-02-10', event: '中国CPI/PPI', importance: 'medium', previousValue: '-0.3%', forecast: '-0.2%', impact: '通缩压力缓解利好大宗' },
    { date: '2025-02-14', event: '美国CPI数据', importance: 'high', previousValue: '3.4%', forecast: '3.2%', impact: 'CPI回落利好金属价格' },
    { date: '2025-02-20', event: 'FOMC会议纪要', importance: 'high', previousValue: '-', forecast: '-', impact: '关注降息信号' },
    { date: '2025-02-28', event: '中国官方PMI', importance: 'high', previousValue: '49.0', forecast: '49.5', impact: '制造业景气度直接影响需求预期' },
    { date: '2025-03-05', event: '中国两会/政府工作报告', importance: 'high', previousValue: '-', forecast: '-', impact: 'GDP目标和财政政策影响全局' },
    { date: '2025-03-10', event: '美国非农就业数据', importance: 'high', previousValue: '22.3万', forecast: '20万', impact: '就业数据影响美联储决策' },
  ];

  return events.map((e, i) => ({ ...e, id: `macro-event-${i}` }));
}
