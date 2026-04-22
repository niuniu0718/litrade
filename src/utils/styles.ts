// 全局共享样式常量 — 暗色玻璃拟态主题

export const CARD = {
  borderRadius: 14,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
  position: 'relative' as const,
  overflow: 'hidden' as const,
} as const;

export const CARD_BODY = { padding: '20px 24px' } as const;

export const SECTION = {
  fontSize: 11,
  fontWeight: 600 as const,
  color: '#8892b0',
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  textTransform: 'uppercase' as const,
  letterSpacing: 1.2,
};

export const GAP = 16;

// 玻璃卡片内部 top highlight line
export const GLASS_HIGHLIGHT = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  height: 1,
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
};

// 霓虹色系
export const NEON = {
  blue: '#4f8cff',
  cyan: '#00d4ff',
  purple: '#a855f7',
  green: '#10b981',
  red: '#ef4444',
  yellow: '#f59e0b',
  pink: '#ec4899',
};

// 文字色
export const TEXT = {
  primary: '#f0f0f0',
  secondary: '#8892b0',
  muted: '#4a5568',
  value: '#f0f0f0',
  bullish: '#10b981',
  bearish: '#ef4444',
  neutral: '#f59e0b',
};
