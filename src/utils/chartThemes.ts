// 共享 ECharts 配置常量 — 暗色玻璃拟态主题

export const CHART_TOOLTIP = {
  trigger: 'axis' as const,
  backgroundColor: 'rgba(10,14,39,0.92)',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  textStyle: { color: '#f0f0f0', fontSize: 13 },
  axisPointer: { lineStyle: { color: 'rgba(79,140,255,0.3)' } },
};

export const CHART_AXIS_LABEL = {
  color: '#8892b0',
  fontSize: 11,
};

export const CHART_SPLIT_LINE = {
  lineStyle: { color: 'rgba(255,255,255,0.04)' },
};

export const CHART_LEGEND = {
  top: 0,
  itemWidth: 16,
  itemHeight: 2,
  textStyle: { fontSize: 12, color: '#8892b0' },
};

export const COLORS = [
  '#4f8cff',
  '#a855f7',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#00d4ff',
  '#ec4899',
  '#8b5cf6',
  '#f97316',
  '#14b8a6',
];

export const PRODUCT_COLORS: Record<string, string> = {
  li2co3_battery: '#4f8cff',
  li2co3_industrial: '#a855f7',
  lioh: '#f59e0b',
  spodumene: '#10b981',
};

// 暗色背景图表通用背景色
export const CHART_BG = 'transparent';

// 发光线效果
export function glowLine(color: string, width = 2) {
  return {
    lineStyle: { color, width, shadowColor: color, shadowBlur: 6 },
  };
}

// 渐变面积填充
export function gradientArea(color: string, opacity = 0.15) {
  return {
    color: {
      type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: color + Math.round(opacity * 255).toString(16).padStart(2, '0') },
        { offset: 1, color: 'rgba(0,0,0,0)' },
      ],
    },
  };
}
