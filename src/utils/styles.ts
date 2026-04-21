// 全局共享样式常量 — 所有页面统一使用

export const CARD = {
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
} as const;

export const CARD_BODY = { padding: '20px 24px' } as const;

export const SECTION = {
  fontSize: 15,
  fontWeight: 600 as const,
  color: '#1a1a2e',
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: '1px solid #f5f5f5',
};

export const GAP = 20;
