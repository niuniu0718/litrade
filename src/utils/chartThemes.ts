// 共享 ECharts 配置常量 — CATL 设计规范

export const CHART_TOOLTIP = {
  trigger: 'axis' as const,
  backgroundColor: 'rgba(255,255,255,0.96)',
  borderColor: '#E8E8E8',
  borderWidth: 1,
  textStyle: { color: '#1F1F1F', fontSize: 13 },
  axisPointer: { lineStyle: { color: 'rgba(0,100,255,0.2)' } },
};

export const CHART_AXIS_LABEL = {
  color: '#8C8C8C',
  fontSize: 11,
};

export const CHART_SPLIT_LINE = {
  lineStyle: { color: '#F0F0F0' },
};

export const CHART_LEGEND = {
  top: 0,
  itemWidth: 16,
  itemHeight: 2,
  textStyle: { fontSize: 12, color: '#8C8C8C' },
};

export const COLORS = [
  '#0064FF',
  '#722ED1',
  '#FAAD14',
  '#00C86E',
  '#FF4D4F',
  '#13C2C2',
  '#EB2F96',
  '#2F54EB',
  '#FA8C16',
  '#52C41A',
];

export const PRODUCT_COLORS: Record<string, string> = {
  li2co3_battery: '#0064FF',
  li2co3_industrial: '#722ED1',
  lioh: '#FAAD14',
  spodumene: '#00C86E',
};

export const CHART_BG = 'transparent';

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
