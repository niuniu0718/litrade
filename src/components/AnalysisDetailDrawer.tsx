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
  bullish: { label: '偏多', color: '#FF4D4F', bg: 'rgba(255,77,79,0.08)' },
  bearish: { label: '偏空', color: '#00C86E', bg: 'rgba(0,200,110,0.08)' },
  neutral: { label: '中性', color: '#FAAD14', bg: 'rgba(250,173,20,0.08)' },
};

const AnalysisDetailDrawer: React.FC<Props> = ({ open, analysis, onClose }) => {
  if (!analysis) return null;

  const dirCfg = directionConfig[analysis.overall];

  return (
    <Drawer
      title="AI 智能研判详情"
      open={open}
      onClose={onClose}
      width={560}
      placement="right"
      styles={{
        body: { padding: '0 24px 24px', background: '#FFFFFF' },
      }}
    >
      {/* Summary */}
      <div style={{
        ...CARD, borderRadius: 12,
        border: `1px solid ${dirCfg.color}20`,
        background: `linear-gradient(135deg, ${dirCfg.color}08, rgba(0,0,0,0.03))`,
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
            const color = s.label === '乐观' ? '#00C86E' : s.label === '悲观' ? '#FF4D4F' : '#0064FF';
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
                <div style={{ height: 3, background: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' }}>
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
            const color = s.type === 'hedge' ? '#722ED1' : s.type === 'procurement' ? '#0064FF' : '#FAAD14';
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
          border: '1px solid rgba(0,0,0,0.06)',
          background: 'rgba(0,0,0,0.02)',
          fontSize: 12, lineHeight: 1.8, color: TEXT.secondary,
          whiteSpace: 'pre-wrap',
        }}>
          {analysis.fullReport}
        </div>
      </div>
    </Drawer>
  );
};

export default AnalysisDetailDrawer;
