import type { Company, FinancialReport, IndustryCycle } from '../types/company';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateCompanies(): Company[] {
  return [
    { id: 'sqm', name: 'SQM', chain: 'upstream', marketCap: 1850, revenue: 680, netProfit: 180, grossMargin: 42, description: '全球最大锂生产商之一，智利盐湖提锂龙头' },
    { id: 'albemarle', name: 'Albemarle', chain: 'upstream', marketCap: 2100, revenue: 720, netProfit: 210, grossMargin: 38, description: '美国锂业巨头，布局全球锂资源' },
    { id: 'pilbara', name: 'Pilbara Minerals', chain: 'upstream', marketCap: 580, revenue: 250, netProfit: 85, grossMargin: 52, description: '澳洲锂矿龙头，Pilgangoora项目运营' },
    { id: 'tianqi', name: '天齐锂业', chain: 'upstream', marketCap: 620, revenue: 320, netProfit: 45, grossMargin: 35, description: '中国锂资源龙头，控股Greenbushes矿' },
    { id: 'ganfeng', name: '赣锋锂业', chain: 'upstream', marketCap: 780, revenue: 410, netProfit: 62, grossMargin: 30, description: '全球锂生态链企业，资源+加工+电池' },
    { id: 'ronghua', name: '融捷股份', chain: 'upstream', marketCap: 180, revenue: 85, netProfit: 12, grossMargin: 28, description: '锂辉石采选，甲基卡锂辉石矿' },
    { id: 'shenghua', name: '盛新锂能', chain: 'midstream', marketCap: 220, revenue: 130, netProfit: 18, grossMargin: 25, description: '锂盐加工企业，碳酸锂/氢氧化锂产能' },
    { id: 'yabao', name: '雅化集团', chain: 'midstream', marketCap: 190, revenue: 150, netProfit: 22, grossMargin: 27, description: '锂盐+民爆双主业，锂盐产能持续扩张' },
    { id: 'ronbay', name: '容百科技', chain: 'midstream', marketCap: 280, revenue: 210, netProfit: 15, grossMargin: 18, description: '三元正极材料龙头，高镍路线领先' },
    { id: 'dangfu', name: '德方纳米', chain: 'midstream', marketCap: 150, revenue: 180, netProfit: -5, grossMargin: 8, description: '磷酸铁锂正极龙头，产能行业领先' },
    { id: 'catl', name: '宁德时代', chain: 'downstream', marketCap: 12000, revenue: 3600, netProfit: 380, grossMargin: 22, description: '全球动力电池龙头，市占率超35%' },
    { id: 'byd', name: '比亚迪', chain: 'downstream', marketCap: 8500, revenue: 5200, netProfit: 280, grossMargin: 18, description: '新能源汽车+电池垂直一体化龙头' },
    { id: 'gotion', name: '国轩高科', chain: 'downstream', marketCap: 520, revenue: 320, netProfit: 12, grossMargin: 16, description: '动力电池企业，磷酸铁锂技术领先' },
    { id: 'eve', name: '亿纬锂能', chain: 'downstream', marketCap: 680, revenue: 280, netProfit: 28, grossMargin: 17, description: '锂原电池+动力电池+储能' },
  ];
}

export function generateFinancialReports(companyId: string): FinancialReport[] {
  const bases: Record<string, { revBase: number; profitBase: number; marginBase: number }> = {
    catl: { revBase: 900, profitBase: 95, marginBase: 22 },
    byd: { revBase: 1300, profitBase: 70, marginBase: 18 },
    ganfeng: { revBase: 100, profitBase: 15, marginBase: 30 },
    tianqi: { revBase: 80, profitBase: 10, marginBase: 35 },
    default: { revBase: 50, profitBase: 5, marginBase: 20 },
  };
  const base = bases[companyId] || bases.default;

  const quarters = ['2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1'];
  return quarters.map((q) => ({
    quarter: q,
    revenue: Math.round(base.revBase * (1 + randomBetween(-0.1, 0.3))),
    netProfit: Math.round(base.profitBase * (1 + randomBetween(-0.2, 0.4))),
    grossMargin: Math.round((base.marginBase + randomBetween(-5, 5)) * 10) / 10,
    netMargin: Math.round(randomBetween(3, 12) * 10) / 10,
    revenueGrowth: Math.round(randomBetween(-10, 30) * 10) / 10,
    profitGrowth: Math.round(randomBetween(-30, 50) * 10) / 10,
  }));
}

export function generateIndustryCycle(): IndustryCycle {
  return {
    currentStage: '底部盘整',
    confidence: 62,
    indicators: [
      { name: '价格水平', value: 35, trend: 'stable', status: 'negative' },
      { name: '库存水平', value: 72, trend: 'up', status: 'negative' },
      { name: '下游需求', value: 58, trend: 'up', status: 'neutral' },
      { name: '产能利用率', value: 55, trend: 'down', status: 'neutral' },
      { name: '资本开支', value: 28, trend: 'down', status: 'negative' },
      { name: '企业盈利', value: 30, trend: 'stable', status: 'negative' },
      { name: '政策支持', value: 75, trend: 'up', status: 'positive' },
      { name: '技术进步', value: 68, trend: 'up', status: 'positive' },
    ],
  };
}
