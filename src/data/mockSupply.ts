import type {
  MiningProject,
  SupplySummary,
  DemandSector,
  InternalDemand,
  SupplyDemandBalance,
} from '../types/supply';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateMiningProjects(): MiningProject[] {
  const projects: Omit<MiningProject, 'id'>[] = [
    { name: 'Greenbushes', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 890, capacity: 16, actualOutput: 14.5, cost: 350, operator: 'Talison' },
    { name: 'Mt Cattlin', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 120, capacity: 2.3, actualOutput: 2.1, cost: 520, operator: 'Allkem' },
    { name: 'Mt Marion', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 210, capacity: 4.5, actualOutput: 4.0, cost: 480, operator: 'Mineral Resources' },
    { name: 'Pilgangoora', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 520, capacity: 6.5, actualOutput: 5.8, cost: 450, operator: 'Pilbara Minerals' },
    { name: 'Wodgina', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 310, capacity: 7.5, actualOutput: 4.5, cost: 490, operator: 'Mineral Resources' },
    { name: 'Salar de Atacama', country: '智利', status: 'producing', mineralType: '盐湖卤水', reserve: 1200, capacity: 22, actualOutput: 20, cost: 280, operator: 'SQM' },
    { name: 'Salar de Atacama (Albemarle)', country: '智利', status: 'producing', mineralType: '盐湖卤水', reserve: 900, capacity: 18, actualOutput: 16, cost: 300, operator: 'Albemarle' },
    { name: 'Salar de Olaroz', country: '阿根廷', status: 'producing', mineralType: '盐湖卤水', reserve: 420, capacity: 2.5, actualOutput: 2.2, cost: 380, operator: 'Allkem' },
    { name: 'Cauchari-Olaroz', country: '阿根廷', status: 'producing', mineralType: '盐湖卤水', reserve: 680, capacity: 4, actualOutput: 3.5, cost: 360, operator: 'Lithium Americas' },
    { name: 'Manono', country: '刚果(金)', status: 'exploration', mineralType: '锂辉石', reserve: 750, capacity: 5, actualOutput: 0, cost: 420, operator: 'AVZ Minerals' },
    { name: '宜春云母提锂', country: '中国', status: 'producing', mineralType: '锂云母', reserve: 580, capacity: 8, actualOutput: 6.5, cost: 550, operator: '多家企业' },
    { name: '察尔汗盐湖', country: '中国', status: 'producing', mineralType: '盐湖卤水', reserve: 450, capacity: 4, actualOutput: 3.8, cost: 320, operator: '盐湖股份' },
    { name: 'Thacker Pass', country: '美国', status: 'construction', mineralType: '锂黏土', reserve: 960, capacity: 6, actualOutput: 0, cost: 450, operator: 'Lithium Americas' },
    { name: 'Kathu Valley', country: '南非', status: 'exploration', mineralType: '锂辉石', reserve: 180, capacity: 2, actualOutput: 0, cost: 500, operator: 'Marula Mining' },
  ];

  return projects.map((p, i) => ({ ...p, id: `project-${i}` }));
}

export function generateSupplySummary(): SupplySummary {
  return {
    globalSupply: 105.8,
    yoyChange: 18.5,
    topCountries: [
      { country: '澳大利亚', share: 38, output: 40.2 },
      { country: '智利', share: 25, output: 26.5 },
      { country: '中国', share: 18, output: 19.0 },
      { country: '阿根廷', share: 8, output: 8.5 },
      { country: '其他', share: 11, output: 11.6 },
    ],
  };
}

export function generateDemandSectors(): DemandSector[] {
  return [
    { sector: '动力电池', share: 65, growth: 28, demand: 68.3 },
    { sector: '储能电池', share: 15, growth: 45, demand: 15.8 },
    { sector: '消费电子', share: 8, growth: 3, demand: 8.4 },
    { sector: '传统工业', share: 7, growth: -2, demand: 7.4 },
    { sector: '其他', share: 5, growth: 5, demand: 5.3 },
  ];
}

export function generateInternalDemand(): InternalDemand[] {
  return [
    { category: '磷酸铁锂正极', demand: 38.5, share: 42, growth: 35 },
    { category: '三元正极', demand: 22.0, share: 24, growth: 12 },
    { category: '电解液', demand: 8.5, share: 9, growth: 18 },
    { category: '储能系统', demand: 12.0, share: 13, growth: 50 },
    { category: '其他应用', demand: 11.0, share: 12, growth: 8 },
  ];
}

export function generateSupplyDemandBalance(): SupplyDemandBalance[] {
  const months = [];
  let supply = 8.2;
  let demand = 8.0;
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    supply = Math.round((supply + randomBetween(-0.3, 0.5)) * 10) / 10;
    demand = Math.round((demand + randomBetween(-0.1, 0.6)) * 10) / 10;
    months.push({
      month: label,
      supply,
      demand,
      surplus: Math.round((supply - demand) * 10) / 10,
    });
  }
  return months;
}
