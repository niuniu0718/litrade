import React, { useState, useCallback } from 'react';
import { Tag } from 'antd';
import { TEXT, CARD } from '../utils/styles';
import type { DailyAnalysis, ReviewRecord, AnalysisHistory } from '../types/analysis';
import type { SignalDirection } from '../types/dashboard';
import YesterdayReview from './YesterdayReview';
import ScoreTrendChart from './ScoreTrendChart';
import AnalysisDetailDrawer from './AnalysisDetailDrawer';

interface Props {
  analysis: DailyAnalysis;
  review: ReviewRecord | null;
  history: AnalysisHistory;
  currentPrice: number;
}

const directionConfig: Record<SignalDirection, { label: string; color: string; tagColor: string; bg: string }> = {
  bullish: { label: '偏多', color: '#FF4D4F', tagColor: '#FF4D4F', bg: 'rgba(255,77,79,0.06)' },
  bearish: { label: '偏空', color: '#00C86E', tagColor: '#00C86E', bg: 'rgba(0,200,110,0.06)' },
  neutral: { label: '中性', color: '#FAAD14', tagColor: '#FAAD14', bg: 'rgba(250,173,20,0.06)' },
};

const AIAnalysisPanel: React.FC<Props> = ({ analysis, review, history, currentPrice }) => {
  const dirCfg = directionConfig[analysis.overall];

  const [expanded, setExpanded] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
    if (!expanded) {
      setShowFullReport(false);
    }
  }, [expanded]);

  const toggleFullReport = useCallback(() => {
    setShowFullReport(prev => !prev);
  }, []);

  return (
    <div style={{
      ...CARD,
      borderRadius: 16,
      background: `linear-gradient(135deg, ${dirCfg.color}08 0%, rgba(0,0,0,0.04) 50%, ${dirCfg.color}05 100%)`,
      border: `1px solid ${dirCfg.color}20`,
    }}>

      {/* Header — always visible */}
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, ${dirCfg.color}20, ${dirCfg.color}08)`,
            border: `1px solid ${dirCfg.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, cursor: 'pointer',
          }} onClick={toggleExpanded}>
            🤖
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span
                style={{ fontSize: 14, fontWeight: 700, color: TEXT.primary, cursor: 'pointer' }}
                onClick={toggleExpanded}
              >
                AI 智能研判
              </span>
              <span style={{ fontSize: 11, color: TEXT.muted }}>{analysis.date}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: dirCfg.color }}>
                {analysis.score}
              </span>
              <span style={{ fontSize: 11, color: TEXT.secondary }}>/100</span>
              <Tag style={{
                margin: 0, fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 6,
                background: dirCfg.bg, color: dirCfg.tagColor,
              }}>
                {dirCfg.label}
              </Tag>
              <span
                onClick={toggleExpanded}
                style={{ fontSize: 11, color: '#0064FF', cursor: 'pointer', fontWeight: 600, marginLeft: 4 }}
              >
                {expanded ? '收起 ▲' : '展开 ▼'}
              </span>
            </div>
            <div style={{ fontSize: 13, color: TEXT.primary, lineHeight: 1.5, fontWeight: 500 }}>
              {analysis.summarySentence}
            </div>
          </div>
          {/* Price display */}
          <div style={{
            flexShrink: 0, textAlign: 'right',
            padding: '8px 14px', borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.06)',
            background: 'rgba(0,0,0,0.03)',
          }}>
            <div style={{ fontSize: 10, color: TEXT.muted, marginBottom: 2 }}>碳酸锂现价</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: TEXT.primary, lineHeight: 1 }}>
              {currentPrice.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <>
          {/* Prediction Range */}
          <div style={{ padding: '14px 24px 0' }}>
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              border: `1px solid ${dirCfg.color}18`,
              background: `linear-gradient(135deg, ${dirCfg.color}06, rgba(0,0,0,0.02))`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: 11, color: TEXT.muted }}>明日预测：</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: dirCfg.color, marginLeft: 6 }}>
                  {analysis.predictedRange[0].toLocaleString()} - {analysis.predictedRange[1].toLocaleString()}
                </span>
                <span style={{ fontSize: 11, color: TEXT.muted, marginLeft: 6 }}>元/吨</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: TEXT.muted }}>置信度</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: TEXT.primary, marginLeft: 4 }}>{analysis.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ padding: '14px 24px 0', display: 'flex', gap: 10 }}>
            <span
              onClick={toggleFullReport}
              style={{ fontSize: 11, color: '#0064FF', cursor: 'pointer', fontWeight: 600 }}
            >
              {showFullReport ? '收起报告 ▲' : '展开完整报告 ▼'}
            </span>
            <span
              onClick={() => setDrawerOpen(true)}
              style={{ fontSize: 11, color: '#722ED1', cursor: 'pointer', fontWeight: 600 }}
            >
              查看历史详情
            </span>
          </div>

          {/* Full Report */}
          {showFullReport && (
            <div style={{ padding: '10px 24px 0' }}>
              <div style={{
                padding: '14px 18px', borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(0,0,0,0.02)',
                maxHeight: 360,
                overflow: 'auto',
              }}>
                <div style={{
                  fontSize: 12, lineHeight: 1.8, color: TEXT.secondary,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                }}>
                  {analysis.fullReport}
                </div>
              </div>
            </div>
          )}

          {/* Yesterday Review */}
          {review && (
            <div style={{ padding: '14px 24px 0' }}>
              <YesterdayReview review={review} />
            </div>
          )}

          {/* Score Trend */}
          <div style={{ padding: '14px 24px 20px' }}>
            <div style={{ fontSize: 11, color: TEXT.muted, marginBottom: 8, letterSpacing: 0.8 }}>
              30日评分趋势
            </div>
            <ScoreTrendChart data={history.scoreTrend.slice(-30)} />
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <AnalysisDetailDrawer
        open={drawerOpen}
        analysis={analysis}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default AIAnalysisPanel;
