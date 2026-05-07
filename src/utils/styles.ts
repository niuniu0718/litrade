// 全局共享样式常量 — CATL 设计规范

export const CARD = {
  borderRadius: 8,
  background: '#FFFFFF',
  border: '1px solid #E8E8E8',
  position: 'relative' as const,
  overflow: 'hidden' as const,
} as const;

export const CARD_BODY = { padding: '20px 24px' } as const;

export const SECTION = {
  fontSize: 11,
  fontWeight: 600 as const,
  color: '#8C8C8C',
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: '1px solid #F0F0F0',
  textTransform: 'uppercase' as const,
  letterSpacing: 1.2,
};

export const GAP = 16;

export const GLASS_HIGHLIGHT = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  height: 2,
  background: 'linear-gradient(90deg, #0064FF, transparent)',
};

// CATL 品牌色系
export const BRAND = {
  blue: '#0064FF',
  cyan: '#13C2C2',
  purple: '#722ED1',
  green: '#00C86E',
  red: '#FF4D4F',
  yellow: '#FAAD14',
  pink: '#EB2F96',
};

// 文字色
export const TEXT = {
  primary: '#1F1F1F',
  secondary: '#8C8C8C',
  muted: '#BFBFBF',
  value: '#1F1F1F',
  bullish: '#FF4D4F',
  bearish: '#00C86E',
  neutral: '#FAAD14',
};
