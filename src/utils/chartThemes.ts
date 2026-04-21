// 共享 ECharts 配置常量

export const CHART_TOOLTIP = {
  trigger: 'axis' as const,
  backgroundColor: 'rgba(255,255,255,0.96)',
  borderColor: '#e5e7eb',
  borderWidth: 1,
  textStyle: { color: '#1a1a2e', fontSize: 13 },
  axisPointer: { lineStyle: { color: '#d1d5db' } },
};

export const CHART_AXIS_LABEL = {
  color: '#9ca3af',
  fontSize: 11,
};

export const CHART_SPLIT_LINE = {
  lineStyle: { color: '#f3f4f6' },
};

export const CHART_LEGEND = {
  top: 0,
  itemWidth: 16,
  itemHeight: 2,
  textStyle: { fontSize: 12, color: '#6b7280' },
};

export const COLORS = [
  '#0064ff',
  '#7c3aed',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#06b6d4',
  '#ec4899',
  '#8b5cf6',
  '#f97316',
  '#14b8a6',
];

export const PRODUCT_COLORS: Record<string, string> = {
  li2co3_battery: '#0064ff',
  li2co3_industrial: '#7c3aed',
  lioh: '#f59e0b',
  spodumene: '#10b981',
};
