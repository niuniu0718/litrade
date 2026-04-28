import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { Timeline, Tag, Collapse } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useScenarioStore } from '../stores/scenarioStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, gradientArea } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, TEXT, BRAND } from '../utils/styles';
import type { HistoricalCategory, CyclePhase } from '../types/scenario';
import type { SignalDirection } from '../types/dashboard';

const CATEGORY_CONFIG: Record<HistoricalCategory, { label: string; color: string }> = {
  policy: { label: '政策', color: '#0064FF' },
  supply: { label: '供给', color: '#722ED1' },
  demand: { label: '需求', color: '#FAAD14' },
  macro: { label: '宏观', color: '#8C8C8C' },
  milestone: { label: '里程碑', color: '#FF4D4F' },
};

const DIRECTION_CONFIG: Record<SignalDirection, { label: string; color: string }> = {
  bullish: { label: '偏多', color: BRAND.red },
  bearish: { label: '偏空', color: BRAND.green },
  neutral: { label: '中性', color: '#FAAD14' },
};

const PHASE_COLORS: Record<CyclePhase, string> = {
  '顶部过热': '#FF4D4F',
  '上行加速': '#00C86E',
  '上行启动': '#13C2C2',
  '下行启动': '#FAAD14',
  '下行加速': '#FF7A45',
  '底部筑底': '#0064FF',
};

const DIMENSION_COLORS: Record<string, string> = {
  '需求': '#FAAD14',
  '供给': '#722ED1',
  '库存': '#0064FF',
  '宏观': '#8C8C8C',
};

const ScenarioAnalysis: React.FC = () => {
  const {
    events, priceTimeline, cycleAnalysis,
    selectedEventId, loading, fetchAll, selectEvent,
  } = useScenarioStore();

  const chartRef = useRef<ReactECharts>(null);
  const [reasoningExpanded, setReasoningExpanded] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  // IDs of similar events for marking on timeline
  const similarEventIds = useMemo(() =>
    new Set(cycleAnalysis?.similarEvents.map((e) => e.eventId) ?? []),
  [cycleAnalysis]);

  // ═══ 历史价格走势面积图 ═══
  const historyChartOption = useMemo(() => {
    const dates = priceTimeline.map((d) => d.date);
    const prices = priceTimeline.map((d) => d.price);

    const markPoints = events.map((ev) => ({
      coord: [ev.date, ev.price],
      name: ev.title,
      symbol: 'pin' as const,
      symbolSize: selectedEventId === ev.id ? 40 : 24,
      itemStyle: {
        color: selectedEventId === ev.id
          ? CATEGORY_CONFIG[ev.category].color
          : CATEGORY_CONFIG[ev.category].color + '99',
      },
      label: { show: false },
    }));

    const selectedEvent = events.find((e) => e.id === selectedEventId);
    const markAreas = selectedEvent
      ? [
          [
            {
              xAxis: selectedEvent.date,
              itemStyle: { color: CATEGORY_CONFIG[selectedEvent.category].color + '15' },
            },
            {
              xAxis: (() => {
                const idx = events.findIndex((e) => e.id === selectedEventId);
                if (idx < events.length - 1) return events[idx + 1].date;
                return '2025-12';
              })(),
            },
          ],
        ]
      : [];

    return {
      tooltip: {
        ...CHART_TOOLTIP,
        formatter: (params: { axisValue: string; value: number } | Array<{ axisValue: string; value: number }>) => {
          const p = Array.isArray(params) ? params[0] : params;
          const ev = events.find((e) => e.date === p.axisValue);
          let html = `<div style="font-weight:600;margin-bottom:4px">${p.axisValue}</div>`;
          html += `<div>价格：<b>${(p.value as number).toLocaleString()}</b> 元/吨</div>`;
          if (ev) {
            const cfg = CATEGORY_CONFIG[ev.category];
            html += `<div style="margin-top:4px;color:${cfg.color}">[${cfg.label}] ${ev.title}</div>`;
          }
          return html;
        },
      },
      grid: { top: 40, right: 30, bottom: 40, left: 70 },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
        axisTick: { show: false },
        axisLabel: {
          ...CHART_AXIS_LABEL,
          rotate: 45,
          formatter: (val: string) => {
            if (val.endsWith('-01') || val.endsWith('-06')) return val;
            return '';
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '元/吨',
        nameTextStyle: { color: '#8C8C8C', fontSize: 11 },
        axisLabel: {
          ...CHART_AXIS_LABEL,
          formatter: (v: number) => `${(v / 10000).toFixed(0)}万`,
        },
        splitLine: CHART_SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      dataZoom: [
        { type: 'inside', start: 75, end: 100 },
        {
          type: 'slider',
          start: 75,
          end: 100,
          height: 20,
          bottom: 8,
          borderColor: '#E8E8E8',
          fillerColor: 'rgba(0,100,255,0.08)',
          handleStyle: { color: '#0064FF' },
          textStyle: { fontSize: 10, color: '#8C8C8C' },
        },
      ],
      series: [
        {
          name: '碳酸锂价格',
          type: 'line',
          data: prices,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#0064FF', width: 2 },
          itemStyle: { color: '#0064FF' },
          areaStyle: gradientArea('#0064FF', 0.12),
          markPoint: { data: markPoints, animation: true },
          markArea: { data: markAreas, silent: true },
        },
      ],
    };
  }, [priceTimeline, events, selectedEventId]);

  // ═══ Click timeline event → highlight on chart ═══
  const handleEventClick = useCallback((id: string) => {
    selectEvent(selectedEventId === id ? null : id);
    const ev = events.find((e) => e.id === id);
    if (ev && chartRef.current) {
      const chart = chartRef.current.getEchartsInstance();
      if (chart) {
        const dates = priceTimeline.map((d) => d.date);
        const idx = dates.indexOf(ev.date);
        if (idx >= 0) {
          const total = dates.length;
          const rangeSize = Math.round(total * 0.2);
          const start = Math.max(0, idx - rangeSize / 2);
          const end = Math.min(100, ((idx + rangeSize / 2) / total) * 100);
          chart.dispatchAction({ type: 'dataZoom', start: (start / total) * 100, end });
        }
      }
    }
  }, [selectedEventId, events, priceTimeline, selectEvent]);

  // ═══ Timeline items ═══
  const timelineItems = useMemo(() =>
    events.map((ev) => {
      const cfg = CATEGORY_CONFIG[ev.category];
      const isSelected = selectedEventId === ev.id;
      const isSimilar = similarEventIds.has(ev.id);
      const idx = events.indexOf(ev);
      const prevPrice = idx > 0 ? events[idx - 1].price : ev.price;
      const priceChange = ev.price - prevPrice;

      return {
        key: ev.id,
        dot: (
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: isSelected ? 14 : 10,
                height: isSelected ? 14 : 10,
                borderRadius: '50%',
                background: cfg.color,
                border: isSelected ? `2px solid ${cfg.color}` : '2px solid #fff',
                boxShadow: isSelected ? `0 0 8px ${cfg.color}66` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            />
            {isSimilar && (
              <div style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 12,
                height: 12,
                background: '#FFD700',
                borderRadius: '50%',
                border: '1.5px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 7,
                color: '#fff',
                fontWeight: 700,
                lineHeight: 1,
                zIndex: 1,
              }}>★</div>
            )}
          </div>
        ),
        children: (
          <div
            style={{
              padding: '10px 14px',
              background: isSelected ? cfg.color + '08' : '#FAFAFA',
              borderRadius: 8,
              border: isSelected ? `1px solid ${cfg.color}33` : '1px solid #F0F0F0',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={() => handleEventClick(ev.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: TEXT.secondary, fontFamily: 'monospace' }}>{ev.date}</span>
              <Tag
                style={{
                  margin: 0,
                  background: cfg.color + '12',
                  color: cfg.color,
                  border: 'none',
                  fontSize: 11,
                  lineHeight: '18px',
                  padding: '0 6px',
                }}
              >
                {cfg.label}
              </Tag>
              {isSimilar && (
                <Tag style={{
                  margin: 0,
                  background: '#FFD70018',
                  color: '#D48806',
                  border: 'none',
                  fontSize: 11,
                  lineHeight: '18px',
                  padding: '0 6px',
                }}>
                  相似事件
                </Tag>
              )}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: priceChange >= 0 ? BRAND.green : BRAND.red,
                  marginLeft: 'auto',
                }}
              >
                {ev.price.toLocaleString()} 元/吨
                {idx > 0 && (
                  <span style={{ fontSize: 11, marginLeft: 4 }}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toLocaleString()}
                  </span>
                )}
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT.primary, marginBottom: 4 }}>
              {ev.title}
            </div>
            <div style={{ fontSize: 13, color: TEXT.secondary, lineHeight: 1.6 }}>
              {ev.description}
            </div>
          </div>
        ),
      };
    }),
  [events, selectedEventId, handleEventClick, similarEventIds]);

  // Find similar event details for the cards
  const similarEventDetails = useMemo(() => {
    if (!cycleAnalysis) return [];
    return cycleAnalysis.similarEvents.map((se) => {
      const ev = events.find((e) => e.id === se.eventId);
      return { ...se, event: ev };
    });
  }, [cycleAnalysis, events]);

  if (loading && events.length === 0) return <PageLoading />;

  const glassCard: React.CSSProperties = { ...CARD, borderRadius: 14 };

  return (
    <div>
      {/* ═══ Section A: 价格走势面积图 ═══ */}
      <div style={{ ...glassCard, ...CARD_BODY }}>
        <div style={SECTION}>碳酸锂历史价格走势（2000–2025）</div>
        <ReactECharts
          ref={chartRef}
          option={historyChartOption}
          style={{ height: 420 }}
        />
        <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Object.entries(CATEGORY_CONFIG).map(([, cfg]) => (
            <span key={cfg.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: TEXT.secondary }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />
              {cfg.label}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ Section B: AI 周期研判 ═══ */}
      {cycleAnalysis && (
        <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
          <div style={SECTION}>AI 周期研判</div>

          {/* 四维评分 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            marginBottom: 24,
          }}>
            {cycleAnalysis.dimensions.map((dim) => {
              const color = DIMENSION_COLORS[dim.label] || BRAND.blue;
              const dirCfg = DIRECTION_CONFIG[dim.direction];
              return (
                <div key={dim.label} style={{
                  display: 'flex',
                  gap: 14,
                  padding: '14px 16px',
                  background: '#FAFAFA',
                  borderRadius: 10,
                  border: '1px solid #F0F0F0',
                  borderLeft: `3px solid ${color}`,
                }}>
                  {/* 左：分数 */}
                  <div style={{ flexShrink: 0, minWidth: 56 }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>
                      {dim.score}
                    </div>
                    <div style={{ fontSize: 10, color: TEXT.muted, marginTop: 2 }}> /100</div>
                    <Tag
                      style={{
                        marginTop: 6,
                        background: dirCfg.color + '12',
                        color: dirCfg.color,
                        border: 'none',
                        fontSize: 10,
                        lineHeight: '16px',
                        padding: '0 5px',
                      }}
                    >
                      {dirCfg.label}
                    </Tag>
                  </div>
                  {/* 右：标签 + 进度条 + 说明 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: TEXT.primary, marginBottom: 8 }}>
                      {dim.label}
                    </div>
                    {/* 进度条 */}
                    <div style={{
                      height: 6,
                      borderRadius: 3,
                      background: '#F0F0F0',
                      overflow: 'hidden',
                      marginBottom: 8,
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${dim.score}%`,
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${color}CC, ${color})`,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: 12, color: TEXT.secondary, lineHeight: 1.5 }}>
                      {dim.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 周期定位 + 综合评分 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #F8FAFF 0%, #F0F5FF 100%)',
            borderRadius: 10,
            border: '1px solid #E6F0FF',
            marginBottom: 24,
          }}>
            <div style={{
              padding: '6px 16px',
              background: PHASE_COLORS[cycleAnalysis.currentPhase] + '15',
              border: `1px solid ${PHASE_COLORS[cycleAnalysis.currentPhase]}40`,
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 700,
              color: PHASE_COLORS[cycleAnalysis.currentPhase],
              whiteSpace: 'nowrap',
            }}>
              {cycleAnalysis.currentPhase}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: TEXT.secondary, marginBottom: 4 }}>
                {cycleAnalysis.phaseDescription}
              </div>
            </div>
            <div style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: DIRECTION_CONFIG[cycleAnalysis.overallDirection].color, lineHeight: 1 }}>
                {cycleAnalysis.overallScore}
              </div>
              <div style={{ fontSize: 11, color: TEXT.secondary }}>/100</div>
              <Tag
                style={{
                  marginTop: 4,
                  background: DIRECTION_CONFIG[cycleAnalysis.overallDirection].color + '15',
                  color: DIRECTION_CONFIG[cycleAnalysis.overallDirection].color,
                  border: 'none',
                  fontSize: 11,
                }}
              >
                {DIRECTION_CONFIG[cycleAnalysis.overallDirection].label}
              </Tag>
            </div>
          </div>

          {/* AI 研判摘要 */}
          <div style={{
            padding: '12px 16px',
            background: '#FFFBF0',
            borderRadius: 8,
            border: '1px solid #FFE7BA',
            marginBottom: 20,
            fontSize: 14,
            color: TEXT.primary,
            lineHeight: 1.6,
          }}>
            {cycleAnalysis.summary}
          </div>

          {/* 历史相似情景 Top 3 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT.primary, marginBottom: 12 }}>
              历史相似情景 Top 3
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {similarEventDetails.map((se, idx) => se.event && (
                <div
                  key={se.eventId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    background: selectedEventId === se.eventId
                      ? CATEGORY_CONFIG[se.event.category].color + '08'
                      : '#FAFAFA',
                    borderRadius: 8,
                    border: selectedEventId === se.eventId
                      ? `1px solid ${CATEGORY_CONFIG[se.event.category].color}33`
                      : '1px solid #F0F0F0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => handleEventClick(se.eventId)}
                >
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: TEXT.secondary, fontFamily: 'monospace' }}>{se.event.date}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: TEXT.primary }}>{se.event.title}</span>
                    </div>
                    <div style={{ fontSize: 12, color: TEXT.secondary, lineHeight: 1.5 }}>
                      {se.reason}
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    flexShrink: 0,
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#0064FF', lineHeight: 1 }}>
                      {se.similarity}%
                    </div>
                    <div style={{ fontSize: 11, color: TEXT.secondary }}>相似度</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI 详细推理（可折叠） */}
          <Collapse
            ghost
            activeKey={reasoningExpanded ? ['reasoning'] : []}
            onChange={(keys) => setReasoningExpanded(keys.includes('reasoning'))}
            items={[{
              key: 'reasoning',
              label: (
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT.secondary }}>
                  {reasoningExpanded ? '收起详细推理' : '展开详细推理'}
                </span>
              ),
              children: (
                <div style={{
                  fontSize: 13,
                  color: TEXT.secondary,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  padding: '12px 16px',
                  background: '#FAFAFA',
                  borderRadius: 8,
                  border: '1px solid #F0F0F0',
                }}>
                  {cycleAnalysis.reasoning}
                </div>
              ),
            }]}
          />
        </div>
      )}

      {/* ═══ Section C: 历史事件时间线 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={SECTION}>历史事件时间线</div>
        <Timeline items={timelineItems} />
      </div>
    </div>
  );
};

export default ScenarioAnalysis;
