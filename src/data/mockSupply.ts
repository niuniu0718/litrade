import type {
  MiningProject,
  ProjectProduction,
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
    { name: 'Greenbushes', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 890, capacity: 16, capacityYear: 2024, operator: 'Talison' },
    { name: 'Mt Cattlin', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 120, capacity: 2.3, capacityYear: 2024, operator: 'Allkem' },
    { name: 'Mt Marion', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 210, capacity: 4.5, capacityYear: 2024, operator: 'Mineral Resources' },
    { name: 'Pilgangoora', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 520, capacity: 6.5, capacityYear: 2024, operator: 'Pilbara Minerals' },
    { name: 'Wodgina', country: '澳大利亚', status: 'producing', mineralType: '锂辉石', reserve: 310, capacity: 7.5, capacityYear: 2024, operator: 'Mineral Resources' },
    { name: 'Salar de Atacama', country: '智利', status: 'producing', mineralType: '盐湖卤水', reserve: 1200, capacity: 22, capacityYear: 2024, operator: 'SQM' },
    { name: 'Salar de Atacama (Albemarle)', country: '智利', status: 'producing', mineralType: '盐湖卤水', reserve: 900, capacity: 18, capacityYear: 2024, operator: 'Albemarle' },
    { name: 'Salar de Olaroz', country: '阿根廷', status: 'producing', mineralType: '盐湖卤水', reserve: 420, capacity: 2.5, capacityYear: 2024, operator: 'Allkem' },
    { name: 'Cauchari-Olaroz', country: '阿根廷', status: 'producing', mineralType: '盐湖卤水', reserve: 680, capacity: 4, capacityYear: 2024, operator: 'Lithium Americas' },
    { name: 'Manono', country: '刚果(金)', status: 'exploration', mineralType: '锂辉石', reserve: 750, capacity: 5, capacityYear: 2026, operator: 'AVZ Minerals' },
    { name: '宜春云母提锂', country: '中国', status: 'producing', mineralType: '锂云母', reserve: 580, capacity: 8, capacityYear: 2024, operator: '多家企业' },
    { name: '察尔汗盐湖', country: '中国', status: 'producing', mineralType: '盐湖卤水', reserve: 450, capacity: 4, capacityYear: 2024, operator: '盐湖股份' },
    { name: 'Thacker Pass', country: '美国', status: 'construction', mineralType: '锂黏土', reserve: 960, capacity: 6, capacityYear: 2026, operator: 'Lithium Americas' },
    { name: 'Kathu Valley', country: '南非', status: 'exploration', mineralType: '锂辉石', reserve: 180, capacity: 2, capacityYear: 2027, operator: 'Marula Mining' },
  ];

  return projects.map((p, i) => ({ ...p, id: `project-${i}` }));
}

export function generateProjectProduction(): ProjectProduction[] {
  const projects = generateMiningProjects();
  const histSources = ['USGS', 'BNEF', '公司年报', 'SQM季报', 'Albemarle年报', 'Fastmarkets', 'SMM', 'CRU', '行业协会'];
  const foreSources = ['BNEF预测', 'CRU预测', 'Fastmarkets预测', '公司指引'];
  const result: ProjectProduction[] = [];

  for (const project of projects) {
    if (project.status === 'producing') {
      // Historical: 2022-2024
      const baseOutput = project.capacity * 0.85;
      for (const year of [2022, 2023, 2024]) {
        const noise = randomBetween(-0.5, 0.5);
        const growth = (year - 2022) * randomBetween(0.3, 0.8);
        result.push({
          projectId: project.id,
          projectName: project.name,
          year,
          output: Math.round((baseOutput * (0.8 + growth * 0.1) + noise) * 10) / 10,
          source: year === 2024 ? '公司年报/SMM' : histSources[Math.floor(Math.random() * histSources.length)],
          isForecast: false,
        });
      }
      // Fix 2024 to capacity-based
      const entry2024 = result.find((r) => r.projectId === project.id && r.year === 2024);
      if (entry2024) {
        entry2024.output = Math.round(project.capacity * randomBetween(0.75, 0.95) * 10) / 10;
      }
      // Forecast: 2025-2030
      let prevOutput = entry2024!.output;
      for (const year of [2025, 2026, 2027, 2028, 2029, 2030]) {
        const rampFactor = year <= project.capacityYear + 2
          ? randomBetween(1.02, 1.10)
          : randomBetween(0.98, 1.05);
        const output = Math.round(Math.min(prevOutput * rampFactor, project.capacity * 1.05) * 10) / 10;
        result.push({
          projectId: project.id,
          projectName: project.name,
          year,
          output,
          source: foreSources[Math.floor(Math.random() * foreSources.length)],
          isForecast: true,
        });
        prevOutput = output;
      }
    } else {
      // Non-producing: forecast from capacityYear onward
      const startYear = Math.max(project.capacityYear, 2025);
      let prevOutput = project.capacity * 0.3;
      for (const year of [2025, 2026, 2027, 2028, 2029, 2030]) {
        if (year < startYear) continue;
        const ramp = year === startYear ? 0.4 : randomBetween(0.9, 1.1);
        const output = Math.round(Math.min(prevOutput * ramp, project.capacity * 0.95) * 10) / 10;
        result.push({
          projectId: project.id,
          projectName: project.name,
          year,
          output,
          source: foreSources[Math.floor(Math.random() * foreSources.length)],
          isForecast: true,
        });
        prevOutput = output;
      }
    }
  }

  return result;
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
  const years = [
    { year: '2019', supply: 38.5, demand: 36.0, isForecast: false },
    { year: '2020', supply: 42.0, demand: 40.5, isForecast: false },
    { year: '2021', supply: 54.0, demand: 52.0, isForecast: false },
    { year: '2022', supply: 78.5, demand: 72.0, isForecast: false },
    { year: '2023', supply: 96.0, demand: 88.5, isForecast: false },
    { year: '2024', supply: 105.8, demand: 105.2, isForecast: false },
    { year: '2025E', supply: 118.0, demand: 120.0, isForecast: true },
    { year: '2026E', supply: 132.0, demand: 138.0, isForecast: true },
    { year: '2027E', supply: 148.0, demand: 155.0, isForecast: true },
    { year: '2028E', supply: 162.0, demand: 172.0, isForecast: true },
    { year: '2029E', supply: 175.0, demand: 190.0, isForecast: true },
    { year: '2030E', supply: 190.0, demand: 210.0, isForecast: true },
  ];
  return years.map((y) => ({
    year: y.year,
    supply: y.supply,
    demand: y.demand,
    surplus: Math.round((y.supply - y.demand) * 10) / 10,
    isForecast: y.isForecast,
  }));
}
