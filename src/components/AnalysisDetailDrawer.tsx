import React from 'react';
import { Drawer, Tag } from 'antd';
import { TEXT, CARD } from '../utils/styles';
import type { DailyAnalysis } from '../types/analysis';

interface Props {
  open: boolean;
  analysis: DailyAnalysis | null;
  onClose: () => void;
}

const directionConfig: Record<string, { label: string; color: string; bg: string }> = {
  bullish: { label: '偏多', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  bearish: { label: '偏空', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  neutral: { label: '中性', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
};

const AnalysisDetailDrawer: React.FC<Props> = ({ open, analysis, onClose }) => {
  if (!analysis) return null;

  const dirCfg = directionConfig[analysis.overall];

  return (
    <Drawer
      title={null}
      open={open}
      onClose={onClose}
      width={560}
      styles={{
        header: { display: 'none' },
        body: { padding: 0, background: '#0a0e27' },
        wrapper: {},
      }}
    >
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT.primary }}>
            AI 智能研判详情
          </div>
          <span onClick={onClose} style={{ fontSize: 12, color: TEXT.secondary, cursor: 'pointer' }}>
            关闭
          </span>
        </div>

        {/* Summary */}
        <div style={{
          ...CARD, borderRadius: 12,
          border: `1px solid ${dirCfg.color}20`,
          background: `linear-gradient(135deg, ${dirCfg.color}08, rgba(255,255,255,0.03))`,
        }}>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: TEXT.secondary }}>{analysis.date}</span>
              <Tag style={{ margin: 0, background: dirCfg.bg, color: dirCfg.color, fontWeight: 700, borderRadius: 6 }}>
                {dirCfg.label}
              </Tag>
              <span style={{ fontSize: 22, fontWeight: 700, color: dirCfg.color }}>{analysis.score}</span>
              <span style={{ fontSize: 11, color: TEXT.muted }}>/100</span>
            </div>
            <div style={{ fontSize: 13, color: TEXT.primary, lineHeight: 1.6 }}>{analysis.summarySentence}</div>
          </div>
        </div>

        {/* Price Scenarios */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEXT.secondary, marginBottom: 10, letterSpacing: 0.8 }}>
            价格情景分析
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {analysis.priceScenarios.map((s) => {
              const color = s.label === '乐观' ? '#10b981' : s.label === '悲观' ? '#ef4444' : '#4f8cff';
              return (
                <div key={s.label} style={{
                  padding: '12px 14px', borderRadius: 10,
                  border: `1px solid ${color}20`, background: `${color}06`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color }}>{s.label}</span>
                    <span style={{ fontSize: 11, color: TEXT.secondary }}>{s.probability}%</span>
                  </div>
                  <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 4 }}>
                    {s.priceRange[0].toLocaleString()} - {s.priceRange[1].toLocaleString()}
                  </div>
                  {/* probability bar */}
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${s.probability}%`, height: '100%', borderRadius: 2, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strategies */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEXT.secondary, marginBottom: 10, letterSpacing: 0.8 }}>
            策略建议
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {analysis.strategies.map((s) => {
              const color = s.type === 'hedge' ? '#a855f7' : s.type === 'procurement' ? '#4f8cff' : '#f59e0b';
              const label = s.type === 'hedge' ? '套保' : s.type === 'procurement' ? '采购' : '投机';
              return (
                <div key={s.type} style={{
                  padding: '10px 14px', borderRadius: 8,
                  border: `1px solid ${color}15`, background: `${color}05`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Tag style={{ margin: 0, fontSize: 10, background: `${color}15`, color, borderRadius: 4 }}>{label}</Tag>
                    <span style={{ fontSize: 12, fontWeight: 600, color: TEXT.primary }}>{s.action}</span>
                  </div>
                  <div style={{ fontSize: 11, color: TEXT.secondary, lineHeight: 1.5 }}>{s.detail}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Report */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEXT.secondary, marginBottom: 10, letterSpacing: 0.8 }}>
            完整报告
          </div>
          <div style={{
            padding: '16px 20px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
            fontSize: 12, lineHeight: 1.8, color: TEXT.secondary,
            whiteSpace: 'pre-wrap',
          }}>
            {analysis.fullReport}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AnalysisDetailDrawer;
