import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Tag } from 'antd';
import { TEXT, CARD, GLASS_HIGHLIGHT } from '../utils/styles';
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
  bullish: { label: '偏多', color: '#10b981', tagColor: '#10b981', bg: 'rgba(16,185,129,0.06)' },
  bearish: { label: '偏空', color: '#ef4444', tagColor: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
  neutral: { label: '中性', color: '#f59e0b', tagColor: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
};

const AIAnalysisPanel: React.FC<Props> = ({ analysis, review, history, currentPrice }) => {
  const dirCfg = directionConfig[analysis.overall];

  // Animation states
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showFullReport, setShowFullReport] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const animationStartedRef = useRef(false);

  // Step reveal animation
  useEffect(() => {
    if (animationStartedRef.current) return;
    animationStartedRef.current = true;

    // Reveal steps one by one
    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= analysis.reasoningSteps.length; i++) {
      stepTimers.push(setTimeout(() => setVisibleSteps(i), i * 500));
    }

    // Start typewriter after steps
    const reportText = analysis.fullReport;
    const startDelay = analysis.reasoningSteps.length * 500 + 300;
    let charIdx = 0;
    const typeTimer = setInterval(() => {
      charIdx++;
      setTypedText(reportText.slice(0, charIdx));
      if (charIdx >= reportText.length) {
        clearInterval(typeTimer);
      }
    }, 8);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearInterval(typeTimer);
    };
  }, [analysis]);

  const toggleFullReport = useCallback(() => {
    setShowFullReport(prev => !prev);
  }, []);

  return (
    <div style={{
      ...CARD,
      borderRadius: 16,
      background: `linear-gradient(135deg, ${dirCfg.color}08 0%, rgba(255,255,255,0.04) 50%, ${dirCfg.color}05 100%)`,
      border: `1px solid ${dirCfg.color}20`,
    }}>
      <div style={GLASS_HIGHLIGHT} />

      {/* Header */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, ${dirCfg.color}20, ${dirCfg.color}08)`,
            border: `1px solid ${dirCfg.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            🤖
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: TEXT.primary }}>AI 智能研判</span>
              <span style={{ fontSize: 11, color: TEXT.muted }}>{analysis.date}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: dirCfg.color, textShadow: `0 0 12px ${dirCfg.color}30` }}>
                {analysis.score}
              </span>
              <span style={{ fontSize: 11, color: TEXT.secondary }}>/100</span>
              <Tag style={{
                margin: 0, fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 6,
                background: dirCfg.bg, color: dirCfg.tagColor,
              }}>
                {dirCfg.label}
              </Tag>
            </div>
            <div style={{ fontSize: 13, color: TEXT.primary, lineHeight: 1.5, fontWeight: 500 }}>
              {analysis.summarySentence}
            </div>
          </div>
          {/* Price display */}
          <div style={{
            flexShrink: 0, textAlign: 'right',
            padding: '8px 14px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{ fontSize: 10, color: TEXT.muted, marginBottom: 2 }}>碳酸锂现价</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: TEXT.primary, lineHeight: 1 }}>
              {currentPrice.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning Steps */}
      <div style={{ padding: '16px 24px 0' }}>
        <div style={{ fontSize: 11, color: TEXT.muted, marginBottom: 8, letterSpacing: 0.8 }}>四步推理链</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {analysis.reasoningSteps.map((step, idx) => {
            const isVisible = idx < visibleSteps;
            const stepDir = directionConfig[step.direction];
            return (
              <div
                key={step.stepNumber}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 8,
                  border: `1px solid ${stepDir.color}12`,
                  background: `${stepDir.color}04`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'all 0.4s ease',
                }}
              >
                <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{step.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT.primary, width: 64 }}>{step.title}</span>
                <span style={{ fontSize: 11, color: TEXT.secondary, flex: 1 }}>{step.conclusion}</span>
                <Tag style={{
                  margin: 0, fontSize: 10, background: `${stepDir.color}12`,
                  color: stepDir.color, borderRadius: 4, fontWeight: 600,
                }}>
                  {stepDir.label}
                </Tag>
                <span style={{ fontSize: 11, color: stepDir.color, fontWeight: 600, width: 36, textAlign: 'right' }}>
                  {Math.round(step.confidence)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prediction Range */}
      <div style={{ padding: '14px 24px 0' }}>
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          border: `1px solid ${dirCfg.color}18`,
          background: `linear-gradient(135deg, ${dirCfg.color}06, rgba(255,255,255,0.02))`,
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
          style={{ fontSize: 11, color: '#4f8cff', cursor: 'pointer', fontWeight: 600 }}
        >
          {showFullReport ? '收起报告 ▲' : '展开完整报告 ▼'}
        </span>
        <span
          onClick={() => setDrawerOpen(true)}
          style={{ fontSize: 11, color: '#a855f7', cursor: 'pointer', fontWeight: 600 }}
        >
          查看历史详情
        </span>
      </div>

      {/* Typewriter Report - collapsible, default collapsed */}
      {showFullReport && (
        <div style={{ padding: '10px 24px 0' }}>
          <div style={{
            padding: '14px 18px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.02)',
            maxHeight: 360,
            overflow: 'auto',
          }}>
            <div style={{
              fontSize: 12, lineHeight: 1.8, color: TEXT.secondary,
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
            }}>
              {typedText}
              <span style={{
                display: 'inline-block', width: 2, height: 14,
                background: dirCfg.color, marginLeft: 1,
                animation: 'blink 0.8s step-end infinite',
                verticalAlign: 'middle',
              }} />
            </div>
          </div>
          <style>{`
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          `}</style>
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
