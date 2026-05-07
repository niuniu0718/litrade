import type { ProjectCost, CostCurvePoint, CostGradient } from '../types/cost';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateProjectCosts(): ProjectCost[] {
  return [
    { id: 'cost-1', project: 'Greenbushes', country: '澳大利亚', mineralType: '锂辉石', mining: 180, processing: 120, logistics: 50, total: 350, currency: 'USD/t' },
    { id: 'cost-2', project: 'Salar de Atacama', country: '智利', mineralType: '盐湖卤水', mining: 120, processing: 130, logistics: 30, total: 280, currency: 'USD/t' },
    { id: 'cost-3', project: 'Pilgangoora', country: '澳大利亚', mineralType: '锂辉石', mining: 230, processing: 150, logistics: 70, total: 450, currency: 'USD/t' },
    { id: 'cost-4', project: 'Mt Marion', country: '澳大利亚', mineralType: '锂辉石', mining: 250, processing: 140, logistics: 90, total: 480, currency: 'USD/t' },
    { id: 'cost-5', project: 'Wodgina', country: '澳大利亚', mineralType: '锂辉石', mining: 260, processing: 145, logistics: 85, total: 490, currency: 'USD/t' },
    { id: 'cost-6', project: 'Cauchari-Olaroz', country: '阿根廷', mineralType: '盐湖卤水', mining: 150, processing: 145, logistics: 65, total: 360, currency: 'USD/t' },
    { id: 'cost-7', project: '察尔汗盐湖', country: '中国', mineralType: '盐湖卤水', mining: 110, processing: 155, logistics: 55, total: 320, currency: 'USD/t' },
    { id: 'cost-8', project: '宜春云母提锂', country: '中国', mineralType: '锂云母', mining: 280, processing: 200, logistics: 70, total: 550, currency: 'USD/t' },
    { id: 'cost-9', project: 'Mt Cattlin', country: '澳大利亚', mineralType: '锂辉石', mining: 270, processing: 160, logistics: 90, total: 520, currency: 'USD/t' },
    { id: 'cost-10', project: 'Thacker Pass', country: '美国', mineralType: '锂黏土', mining: 200, processing: 180, logistics: 70, total: 450, currency: 'USD/t' },
    { id: 'cost-11', project: 'Salar de Olaroz', country: '阿根廷', mineralType: '盐湖卤水', mining: 160, processing: 150, logistics: 70, total: 380, currency: 'USD/t' },
    { id: 'cost-12', project: 'Manono', country: '刚果(金)', mineralType: '锂辉石', mining: 190, processing: 160, logistics: 70, total: 420, currency: 'USD/t' },
  ];
}

export function generateCostCurve(): CostCurvePoint[] {
  const costs = generateProjectCosts().sort((a, b) => a.total - b.total);
  let cumulative = 0;
  return costs.map((p) => {
    cumulative += Math.round(randomBetween(2, 12) * 10) / 10;
    return {
      project: p.project,
      country: p.country,
      cumulativeOutput: cumulative,
      cost: p.total,
    };
  });
}

export function generateCostGradients(): CostGradient[] {
  return [
    { range: '300以下', count: 2, avgCost: 280, totalOutput: 42 },
    { range: '300-400', count: 3, avgCost: 355, totalOutput: 22 },
    { range: '400-500', count: 5, avgCost: 460, totalOutput: 25 },
    { range: '500以上', count: 2, avgCost: 535, totalOutput: 16.8 },
  ];
}
