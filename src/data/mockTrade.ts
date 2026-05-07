import dayjs from 'dayjs';
import type { TradeRecord, PortArrival, TradePartner } from '../types/trade';

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateTradeRecords(): TradeRecord[] {
  const records: TradeRecord[] = [];
  let importVol = 15000;
  let exportVol = 3500;
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    importVol = Math.round(importVol * (1 + randomBetween(-0.1, 0.15)));
    exportVol = Math.round(exportVol * (1 + randomBetween(-0.05, 0.1)));
    const importVal = Math.round(importVol * randomBetween(70, 85));
    const exportVal = Math.round(exportVol * randomBetween(90, 110));
    records.push({
      month,
      importVolume: importVol,
      importValue: importVal,
      exportVolume: exportVol,
      exportValue: exportVal,
      avgImportPrice: Math.round(importVal / importVol),
      avgExportPrice: Math.round(exportVal / exportVol),
    });
  }
  return records;
}

export function generatePortArrivals(): PortArrival[] {
  const arrivals: Omit<PortArrival, 'id'>[] = [
    { port: '上海港', origin: '智利', quantity: 5200, product: '碳酸锂', expectedArrival: dayjs().add(2, 'day').format('YYYY-MM-DD'), status: 'arriving' },
    { port: '宁波港', origin: '澳大利亚', quantity: 8000, product: '锂精矿', expectedArrival: dayjs().add(5, 'day').format('YYYY-MM-DD'), status: 'arriving' },
    { port: '上海港', origin: '阿根廷', quantity: 3500, product: '碳酸锂', expectedArrival: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), status: 'discharging' },
    { port: '广州港', origin: '智利', quantity: 4200, product: '碳酸锂', expectedArrival: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), status: 'completed' },
    { port: '青岛港', origin: '澳大利亚', quantity: 6500, product: '锂精矿', expectedArrival: dayjs().add(8, 'day').format('YYYY-MM-DD'), status: 'arriving' },
    { port: '天津港', origin: '津巴布韦', quantity: 2800, product: '锂精矿', expectedArrival: dayjs().add(12, 'day').format('YYYY-MM-DD'), status: 'arriving' },
    { port: '宁波港', origin: '智利', quantity: 3800, product: '碳酸锂', expectedArrival: dayjs().add(1, 'day').format('YYYY-MM-DD'), status: 'delayed' },
    { port: '厦门港', origin: '澳大利亚', quantity: 5500, product: '锂精矿', expectedArrival: dayjs().subtract(5, 'day').format('YYYY-MM-DD'), status: 'completed' },
  ];

  return arrivals.map((a, i) => ({ ...a, id: `arrival-${i}` }));
}

export function generateTradePartners(): TradePartner[] {
  return [
    { country: '智利', importShare: 38, importVolume: 58000, importValue: 4500000, exportShare: 5, exportVolume: 1800 },
    { country: '澳大利亚', importShare: 28, importVolume: 42000, importValue: 3800000, exportShare: 3, exportVolume: 1100 },
    { country: '阿根廷', importShare: 15, importVolume: 23000, importValue: 1800000, exportShare: 2, exportVolume: 700 },
    { country: '津巴布韦', importShare: 8, importVolume: 12000, importValue: 900000, exportShare: 0, exportVolume: 0 },
    { country: '韩国', importShare: 2, importVolume: 3000, importValue: 250000, exportShare: 25, exportVolume: 8500 },
    { country: '日本', importShare: 1, importVolume: 1500, importValue: 130000, exportShare: 22, exportVolume: 7500 },
    { country: '美国', importShare: 0.5, importVolume: 800, importValue: 65000, exportShare: 12, exportVolume: 4200 },
    { country: '德国', importShare: 0.3, importVolume: 500, importValue: 40000, exportShare: 8, exportVolume: 2800 },
    { country: '其他', importShare: 7.2, importVolume: 11000, importValue: 850000, exportShare: 23, exportVolume: 7900 },
  ];
}
