import React, { useEffect, useMemo } from 'react';
import { Row, Col, Tag, Timeline } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useMacroStore } from '../stores/macroStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, CHART_LEGEND } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, GLASS_HIGHLIGHT, TEXT } from '../utils/styles';

const impactMap: Record<string, { label: string; color: string; bg: string }> = {
  positive: { label: '利多', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  negative: { label: '利空', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  neutral: { label: '中性', color: '#4f8cff', bg: 'rgba(79,140,255,0.12)' },
};

const importanceMap: Record<string, { label: string; color: string }> = {
  high: { label: '高', color: '#ef4444' },
  medium: { label: '中', color: '#f59e0b' },
  low: { label: '低', color: '#4f8cff' },
};

const MacroFactors: React.FC = () => {
  const { radar, indicators, priceCorrelation, calendar, loading, fetchAll } = useMacroStore();

  useEffect(() => { fetchAll(); }, []);

  const radarChartOption = useMemo(() => ({
    tooltip: {},
    radar: {
      indicator: radar.map((d) => ({ name: d.dimension, max: 100 })),
      shape: 'circle' as const,
      splitNumber: 4,
      axisName: { color: '#8892b0', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
      splitArea: { areaStyle: { color: ['rgba(79,140,255,0.02)', 'rgba(79,140,255,0.04)', 'rgba(79,140,255,0.02)', 'rgba(79,140,255,0.04)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: radar.map((d) => d.score),
        name: '当前状态',
        areaStyle: { color: 'rgba(79,140,255,0.15)' },
        lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 },
        itemStyle: { color: '#4f8cff' },
      }],
    }],
  }), [radar]);

  const correlationOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['碳酸锂价格', '美元指数'] },
    grid: { top: 40, right: 60, bottom: 30, left: 70 },
    xAxis: { type: 'category', data: priceCorrelation.map((d) => d.month), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: '价格(元/吨)', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '美元指数', position: 'right' as const, nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '碳酸锂价格', type: 'line', data: priceCorrelation.map((d) => d.liPrice), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 }, itemStyle: { color: '#4f8cff' } },
      { name: '美元指数', type: 'line', yAxisIndex: 1, data: priceCorrelation.map((d) => d.macroValue), smooth: true, symbol: 'diamond', symbolSize: 5, lineStyle: { color: '#ef4444', width: 2, shadowColor: '#ef4444', shadowBlur: 4 }, itemStyle: { color: '#ef4444' } },
    ],
  }), [priceCorrelation]);

  if (loading) return <PageLoading />;

  const glassCard: React.CSSProperties = { ...CARD, borderRadius: 14 };

  return (
    <div>
      <Row gutter={GAP}>
        {/* ═══ 雷达图 ═══ */}
        <Col xs={24} lg={10}>
          <div style={{ ...glassCard, ...CARD_BODY }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={SECTION}>宏观因子雷达</div>
            <ReactECharts option={radarChartOption} style={{ height: 300 }} />
          </div>
        </Col>

        {/* ═══ 关键指标卡片 ═══ */}
        <Col xs={24} lg={14}>
          <div style={{ ...glassCard, ...CARD_BODY }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={SECTION}>关键宏观指标</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {indicators.map((ind) => {
                const imp = impactMap[ind.impact] || impactMap.neutral;
                return (
                  <div key={ind.key} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: TEXT.secondary }}>{ind.name}</span>
                      <Tag style={{ fontSize: 10, margin: 0, lineHeight: '16px', padding: '0 4px', background: imp.bg, color: imp.color }}>{imp.label}</Tag>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: TEXT.primary }}>{ind.value}</span>
                      <span style={{ fontSize: 11, color: TEXT.secondary }}>{ind.unit}</span>
                      {ind.change !== 0 && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: ind.change >= 0 ? '#ef4444' : '#10b981', marginLeft: 4 }}>
                          {ind.change >= 0 ? '+' : ''}{ind.change}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>

      {/* ═══ 宏观-价格相关性 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>碳酸锂价格 vs 美元指数</div>
        <ReactECharts option={correlationOption} style={{ height: 350 }} />
      </div>

      {/* ═══ 宏观日历 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>宏观数据日历</div>
        <Timeline
          items={calendar.map((e) => {
            const imp = importanceMap[e.importance] || importanceMap.medium;
            return {
              color: imp.color,
              children: (
                <div style={{ paddingBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: TEXT.primary }}>{e.event}</span>
                      <Tag style={{ fontSize: 10, margin: 0, lineHeight: '16px', padding: '0 4px', background: `${imp.color}15`, color: imp.color }}>{imp.label}</Tag>
                    </div>
                    <span style={{ fontSize: 12, color: TEXT.secondary }}>{e.date}</span>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT.secondary, lineHeight: 1.5 }}>
                    前值: {e.previousValue} | 预期: {e.forecast}
                  </div>
                  <div style={{ fontSize: 11, color: TEXT.secondary, marginTop: 2 }}>{e.impact}</div>
                </div>
              ),
            };
          })}
        />
      </div>
    </div>
  );
};

export default MacroFactors;
