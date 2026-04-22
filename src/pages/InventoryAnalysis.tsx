import React, { useEffect, useMemo } from 'react';
import { Row, Col, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useInventoryStore } from '../stores/inventoryStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, CHART_LEGEND, gradientArea } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, GLASS_HIGHLIGHT, TEXT } from '../utils/styles';

const phaseConfig: Record<string, { color: string; bg: string; icon: string }> = {
  active_destock: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: '↓' },
  passive_destock: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: '↑' },
  active_restock: { color: '#4f8cff', bg: 'rgba(79,140,255,0.08)', icon: '↑' },
  passive_restock: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '↓' },
};

const signalMap: Record<string, { label: string; color: string; bg: string }> = {
  bullish: { label: '利多', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  bearish: { label: '利空', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  neutral: { label: '中性', color: '#4f8cff', bg: 'rgba(79,140,255,0.12)' },
};

const InventoryAnalysis: React.FC = () => {
  const { overview, trend, priceRelation, cycle, loading, fetchAll } = useInventoryStore();

  useEffect(() => { fetchAll(); }, []);

  const trendOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['碳酸锂库存', '氢氧化锂库存', '库存增减率'] },
    grid: { top: 40, right: 60, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: trend.map((d) => d.month), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: '库存(吨)', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '增减率%', position: 'right' as const, nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '碳酸锂库存', type: 'line', data: trend.map((d) => d.li2co3Stock), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 }, itemStyle: { color: '#4f8cff' }, areaStyle: gradientArea('#4f8cff', 0.12) },
      { name: '氢氧化锂库存', type: 'line', data: trend.map((d) => d.liohStock), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#f59e0b', width: 2, shadowColor: '#f59e0b', shadowBlur: 4 }, itemStyle: { color: '#f59e0b' } },
      { name: '库存增减率', type: 'bar', yAxisIndex: 1, data: trend.map((d) => ({ value: d.changeRate, itemStyle: { color: d.changeRate >= 0 ? 'rgba(239,68,68,0.6)' : 'rgba(16,185,129,0.6)', borderRadius: [3, 3, 0, 0] } })), barWidth: '30%' },
    ],
  }), [trend]);

  const priceRelationOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['碳酸锂价格', '库存量'] },
    grid: { top: 40, right: 60, bottom: 30, left: 70 },
    xAxis: { type: 'category', data: priceRelation.map((d) => d.month), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: '价格(元/吨)', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '库存(吨)', position: 'right' as const, nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '碳酸锂价格', type: 'line', data: priceRelation.map((d) => d.price), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 }, itemStyle: { color: '#4f8cff' } },
      { name: '库存量', type: 'line', yAxisIndex: 1, data: priceRelation.map((d) => d.inventory), smooth: true, symbol: 'diamond', symbolSize: 5, lineStyle: { color: '#ef4444', width: 2, shadowColor: '#ef4444', shadowBlur: 4 }, itemStyle: { color: '#ef4444' } },
    ],
  }), [priceRelation]);

  if (loading || !overview || !cycle) return <PageLoading />;

  const pc = phaseConfig[cycle.phase] || phaseConfig.active_destock;
  const sm = signalMap[cycle.signal] || signalMap.neutral;

  const glassCard: React.CSSProperties = { ...CARD, borderRadius: 14 };

  return (
    <div>
      {/* ═══ 库存概览 ═══ */}
      <Row gutter={GAP}>
        {[overview.li2co3, overview.lioh].map((item) => (
          <Col xs={24} md={12} key={item.product}>
            <div style={{ ...glassCard, ...CARD_BODY }}>
              <div style={GLASS_HIGHLIGHT} />
              <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}>{item.product}库存</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: TEXT.primary }}>{item.currentStock.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: TEXT.secondary }}>吨</span>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <span style={{ fontSize: 10, color: TEXT.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>环比变化</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: item.momChange >= 0 ? '#ef4444' : '#10b981', marginTop: 2 }}>
                    {item.momChange >= 0 ? '+' : ''}{item.momChange}%
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: TEXT.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>库存消费比</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT.primary, marginTop: 2 }}>
                    {item.stockConsumptionRatio}%
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ═══ 库存周期判断 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, border: `1px solid ${pc.color}22`, background: pc.bg, borderRadius: 14 }}>
        <div style={{ ...CARD_BODY }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: pc.color, textShadow: `0 0 10px ${pc.color}44` }}>{pc.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: TEXT.primary }}>当前阶段：{cycle.phaseLabel}</span>
                <Tag style={{ background: sm.bg, color: sm.color, margin: 0 }}>{sm.label}</Tag>
              </div>
              <div style={{ fontSize: 13, color: TEXT.secondary, lineHeight: 1.6 }}>{cycle.description}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>置信度</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: pc.color, textShadow: `0 0 10px ${pc.color}44` }}>{cycle.confidence}%</div>
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
