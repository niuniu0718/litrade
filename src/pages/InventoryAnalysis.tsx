import React, { useEffect, useMemo } from 'react';
import { Row, Col, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useInventoryStore } from '../stores/inventoryStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, CHART_LEGEND, gradientArea } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, GLASS_HIGHLIGHT, TEXT } from '../utils/styles';

const phaseConfig: Record<string, { color: string; bg: string; icon: string }> = {
  active_destock: { color: '#FF4D4F', bg: 'rgba(255,77,79,0.08)', icon: '↓' },
  passive_destock: { color: '#00C86E', bg: 'rgba(0,200,110,0.08)', icon: '↑' },
  active_restock: { color: '#0064FF', bg: 'rgba(0,100,255,0.08)', icon: '↑' },
  passive_restock: { color: '#FAAD14', bg: 'rgba(250,173,20,0.08)', icon: '↓' },
};

const signalMap: Record<string, { label: string; color: string; bg: string }> = {
  bullish: { label: '利多', color: '#FF4D4F', bg: 'rgba(255,77,79,0.12)' },
  bearish: { label: '利空', color: '#00C86E', bg: 'rgba(0,200,110,0.12)' },
  neutral: { label: '中性', color: '#0064FF', bg: 'rgba(0,100,255,0.12)' },
};

const dimensionColors: Record<string, string> = {
  factory: '#0064FF',
  market: '#00C86E',
  futures: '#FAAD14',
  total: '#722ED1',
};

const InventoryAnalysis: React.FC = () => {
  const { dimensions, trend, priceRelation, cycle, loading, fetchAll } = useInventoryStore();

  useEffect(() => { fetchAll(); }, []);

  const trendOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['工厂库存', '市场库存', '期货库存', '行业总库存', '库存增减率'] },
    grid: { top: 40, right: 60, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: trend.map((d) => d.month), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: '库存(吨)', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '增减率%', position: 'right' as const, nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '工厂库存', type: 'line', data: trend.map((d) => d.factory), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#0064FF', width: 2 }, itemStyle: { color: '#0064FF' }, areaStyle: gradientArea('#0064FF', 0.08) },
      { name: '市场库存', type: 'line', data: trend.map((d) => d.market), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#00C86E', width: 2 }, itemStyle: { color: '#00C86E' } },
      { name: '期货库存', type: 'line', data: trend.map((d) => d.futures), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#FAAD14', width: 2 }, itemStyle: { color: '#FAAD14' } },
      { name: '行业总库存', type: 'line', data: trend.map((d) => d.total), smooth: true, symbol: 'diamond', symbolSize: 5, lineStyle: { color: '#722ED1', width: 2.5 }, itemStyle: { color: '#722ED1' } },
      { name: '库存增减率', type: 'bar', yAxisIndex: 1, data: trend.map((d) => ({ value: d.changeRate, itemStyle: { color: d.changeRate >= 0 ? 'rgba(255,77,79,0.6)' : 'rgba(0,200,110,0.6)', borderRadius: [3, 3, 0, 0] } })), barWidth: '30%' },
    ],
  }), [trend]);

  const priceRelationOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['碳酸锂价格', '库存量'] },
    grid: { top: 40, right: 60, bottom: 30, left: 70 },
    xAxis: { type: 'category', data: priceRelation.map((d) => d.month), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: '价格(元/吨)', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '库存(吨)', position: 'right' as const, nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '碳酸锂价格', type: 'line', data: priceRelation.map((d) => d.price), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#0064FF', width: 2 }, itemStyle: { color: '#0064FF' } },
      { name: '库存量', type: 'line', yAxisIndex: 1, data: priceRelation.map((d) => d.inventory), smooth: true, symbol: 'diamond', symbolSize: 5, lineStyle: { color: '#FF4D4F', width: 2 }, itemStyle: { color: '#FF4D4F' } },
    ],
  }), [priceRelation]);

  if (loading || !dimensions.length || !cycle) return <PageLoading />;

  const pc = phaseConfig[cycle.phase] || phaseConfig.active_destock;
  const sm = signalMap[cycle.signal] || signalMap.neutral;

  const glassCard: React.CSSProperties = { ...CARD, borderRadius: 14 };

  return (
    <div>
      {/* ═══ 库存概览 ═══ */}
      <Row gutter={GAP}>
        {dimensions.map((dim) => {
          const color = dimensionColors[dim.key] || '#FAAD14';
          return (
            <Col xs={12} md={6} key={dim.key}>
              <div style={{ ...glassCard, ...CARD_BODY }}>
                <div style={GLASS_HIGHLIGHT} />
                <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>{dim.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: TEXT.primary }}>{dim.currentStock.toLocaleString()}</span>
                  <span style={{ fontSize: 12, color: TEXT.secondary }}>吨</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div>
                    <span style={{ fontSize: 10, color: TEXT.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>环比</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: dim.momChange >= 0 ? '#FF4D4F' : '#00C86E', marginTop: 2 }}>
                      {dim.momChange >= 0 ? '+' : ''}{dim.momChange}%
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: TEXT.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>周环比</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: dim.wowChange >= 0 ? '#FF4D4F' : '#00C86E', marginTop: 2 }}>
                      {dim.wowChange >= 0 ? '+' : ''}{dim.wowChange}%
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* ═══ 库存周期判断 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, border: `1px solid ${pc.color}22`, background: pc.bg, borderRadius: 14 }}>
        <div style={{ ...CARD_BODY }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: pc.color }}>{pc.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: TEXT.primary }}>当前阶段：{cycle.phaseLabel}</span>
                <Tag style={{ background: sm.bg, color: sm.color, margin: 0 }}>{sm.label}</Tag>
              </div>
              <div style={{ fontSize: 13, color: TEXT.secondary, lineHeight: 1.6 }}>{cycle.description}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>置信度</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: pc.color }}>{cycle.confidence}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 库存趋势图 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>库存趋势</div>
        <ReactECharts option={trendOption} style={{ height: 350 }} />
      </div>

      {/* ═══ 库存-价格关系 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>库存-价格关系（负相关性）</div>
        <ReactECharts option={priceRelationOption} style={{ height: 350 }} />
      </div>
    </div>
  );
};

export default InventoryAnalysis;
