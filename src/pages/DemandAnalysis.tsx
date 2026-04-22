import React, { useEffect, useMemo } from 'react';
import { Row, Col, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useDemandStore } from '../stores/demandStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, COLORS, CHART_LEGEND, gradientArea } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, GLASS_HIGHLIGHT, TEXT } from '../utils/styles';

const DemandAnalysis: React.FC = () => {
  const { downstreamSectors, formula, evSales, energyStorage, forecast, loading, fetchAll } = useDemandStore();

  useEffect(() => { fetchAll(); }, []);

  const sectorPieOption = useMemo(() => ({
    tooltip: { trigger: 'item' as const, backgroundColor: 'rgba(10,14,39,0.92)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, textStyle: { color: '#f0f0f0', fontSize: 13 } },
    legend: { orient: 'vertical' as const, right: 10, top: 'center', textStyle: { fontSize: 12, color: '#8892b0' } },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['35%', '50%'], avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: 'rgba(10,14,39,0.8)', borderWidth: 2 }, label: { show: false },
      data: downstreamSectors.map((d, i) => ({ value: d.share, name: d.sector, itemStyle: { color: COLORS[i % COLORS.length] } })),
    }],
  }), [downstreamSectors]);

  const evSalesOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['全球EV销量', '中国EV销量'] },
    grid: { top: 40, right: 60, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: evSales.map((d) => d.month), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: '万辆', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '同比%', position: 'right' as const, nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '全球EV销量', type: 'bar', data: evSales.map((d) => d.globalSales), itemStyle: { color: '#4f8cff', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { name: '中国EV销量', type: 'bar', data: evSales.map((d) => d.chinaSales), itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { name: '全球同比', type: 'line', yAxisIndex: 1, data: evSales.map((d) => d.globalYoy), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#10b981', width: 2, shadowColor: '#10b981', shadowBlur: 4 }, itemStyle: { color: '#10b981' } },
    ],
  }), [evSales]);

  const storageOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['储能装机量', '同比增速'] },
    grid: { top: 40, right: 60, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: energyStorage.map((d) => d.month), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: 'GWh', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '同比%', position: 'right' as const, nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '储能装机量', type: 'bar', data: energyStorage.map((d) => d.installation), itemStyle: { color: '#a855f7', borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: '同比增速', type: 'line', yAxisIndex: 1, data: energyStorage.map((d) => d.yoyChange), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#f59e0b', width: 2, shadowColor: '#f59e0b', shadowBlur: 4 }, itemStyle: { color: '#f59e0b' } },
    ],
  }), [energyStorage]);

  const forecastOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['乐观预测', '基准预测', '悲观预测'] },
    grid: { top: 40, right: 20, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: forecast.map((d) => d.month), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: { type: 'value', name: 'LCE万吨', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
    series: [
      { name: '乐观预测', type: 'line', data: forecast.map((d) => d.optimistic), smooth: true, symbol: 'none', lineStyle: { color: '#10b981', width: 2, type: 'dashed' }, itemStyle: { color: '#10b981' }, areaStyle: gradientArea('#10b981', 0.06) },
      { name: '基准预测', type: 'line', data: forecast.map((d) => d.baseline), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 }, itemStyle: { color: '#4f8cff' } },
      { name: '悲观预测', type: 'line', data: forecast.map((d) => d.pessimistic), smooth: true, symbol: 'none', lineStyle: { color: '#ef4444', width: 2, type: 'dashed' }, itemStyle: { color: '#ef4444' }, areaStyle: gradientArea('#ef4444', 0.06) },
    ],
  }), [forecast]);

  if (loading || !formula) return <PageLoading />;

  const glassCard: React.CSSProperties = { ...CARD, borderRadius: 14 };

  return (
    <div>
      {/* ═══ 下游结构概览 ═══ */}
      <div style={{ ...glassCard, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>下游需求结构</div>
        <Row gutter={GAP}>
          <Col xs={24} lg={10}>
            <ReactECharts option={sectorPieOption} style={{ height: 280 }} />
          </Col>
          <Col xs={24} lg={14}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              {downstreamSectors.map((s, i) => (
                <div key={s.sector} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: TEXT.primary, fontWeight: 600 }}>{s.sector}</span>
                    <Tag style={{ margin: 0, background: s.growth >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: s.growth >= 0 ? '#10b981' : '#ef4444' }}>
                      {s.growth >= 0 ? '+' : ''}{s.growth}%
                    </Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{s.share}%</span>
                    <span style={{ fontSize: 11, color: TEXT.secondary }}>{s.demand}万吨</span>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>

      {/* ═══ 需求公式面板 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>需求传导公式</div>
        <div style={{ background: 'rgba(79,140,255,0.06)', borderRadius: 10, padding: '16px 20px', marginBottom: 16, border: '1px solid rgba(79,140,255,0.1)' }}>
          <div style={{ fontSize: 14, color: TEXT.primary, fontWeight: 600, marginBottom: 8 }}>
            锂需求 = EV销量 × 单车电池容量 × 单位锂消耗 + 储能装机量 × 单位锂消耗
          </div>
          <div style={{ fontSize: 12, color: TEXT.secondary }}>
            计算结果：约 <span style={{ fontSize: 18, fontWeight: 700, color: '#4f8cff', textShadow: '0 0 10px rgba(79,140,255,0.3)' }}>{formula.result}</span> {formula.resultUnit}/年
          </div>
        </div>
        <Row gutter={GAP}>
          {formula.factors.map((f) => (
            <Col xs={24} md={12} lg={6} key={f.key}>
              <div style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: 12, color: TEXT.secondary, marginBottom: 6 }}>{f.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: TEXT.primary }}>{f.value.toLocaleString()}</span>
                  <span style={{ fontSize: 11, color: TEXT.secondary }}>{f.unit}</span>
                </div>
                <Tag style={{ fontSize: 11, background: f.yoyChange >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: f.yoyChange >= 0 ? '#10b981' : '#ef4444' }}>
                  同比 {f.yoyChange >= 0 ? '+' : ''}{f.yoyChange}%
                </Tag>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* ═══ EV销量追踪 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>全球EV销量追踪</div>
        <ReactECharts option={evSalesOption} style={{ height: 350 }} />
      </div>

      {/* ═══ 储能市场 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>储能市场装机趋势</div>
        <ReactECharts option={storageOption} style={{ height: 320 }} />
      </div>

      {/* ═══ 需求预测 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>锂需求预测（未来12月）</div>
        <ReactECharts option={forecastOption} style={{ height: 350 }} />
      </div>
    </div>
  );
};

export default DemandAnalysis;
