import React, { useEffect, useMemo } from 'react';
import { Row, Col, Slider, Table, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useScenarioStore } from '../stores/scenarioStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, CHART_LEGEND, gradientArea } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, GLASS_HIGHLIGHT, TEXT } from '../utils/styles';

const ScenarioAnalysis: React.FC = () => {
  const { params, results, sheet, historical, loading, fetchAll, updateParams } = useScenarioStore();

  useEffect(() => { fetchAll(); }, []);

  const demandOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['乐观需求', '基准需求', '悲观需求'] },
    grid: { top: 40, right: 20, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: results.map((d) => d.month), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: { type: 'value', name: 'LCE万吨', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
    series: [
      { name: '乐观需求', type: 'line', data: results.map((d) => d.optimisticDemand), smooth: true, symbol: 'none', lineStyle: { color: '#10b981', width: 2, type: 'dashed' }, itemStyle: { color: '#10b981' } },
      { name: '基准需求', type: 'line', data: results.map((d) => d.baselineDemand), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 }, itemStyle: { color: '#4f8cff' } },
      { name: '悲观需求', type: 'line', data: results.map((d) => d.pessimisticDemand), smooth: true, symbol: 'none', lineStyle: { color: '#ef4444', width: 2, type: 'dashed' }, itemStyle: { color: '#ef4444' } },
    ],
  }), [results]);

  const priceOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['乐观价格', '基准价格', '悲观价格'] },
    grid: { top: 40, right: 20, bottom: 30, left: 70 },
    xAxis: { type: 'category', data: results.map((d) => d.month), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: { type: 'value', name: '元/吨', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
    series: [
      { name: '乐观价格', type: 'line', data: results.map((d) => d.optimisticPrice), smooth: true, symbol: 'none', lineStyle: { color: '#10b981', width: 2, type: 'dashed' }, itemStyle: { color: '#10b981' }, areaStyle: gradientArea('#10b981', 0.06) },
      { name: '基准价格', type: 'line', data: results.map((d) => d.baselinePrice), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 }, itemStyle: { color: '#4f8cff' } },
      { name: '悲观价格', type: 'line', data: results.map((d) => d.pessimisticPrice), smooth: true, symbol: 'none', lineStyle: { color: '#ef4444', width: 2, type: 'dashed' }, itemStyle: { color: '#ef4444' }, areaStyle: gradientArea('#ef4444', 0.06) },
    ],
  }), [results]);

  const sheetColumns = [
    { title: '情境', dataIndex: 'scenario', key: 'scenario', render: (v: string) => <span style={{ fontWeight: 600, color: TEXT.primary }}>{v}</span> },
    { title: '需求(LCE万吨)', dataIndex: 'demand', key: 'demand', render: (v: number) => v.toFixed(1) },
    { title: '供给(LCE万吨)', dataIndex: 'supply', key: 'supply', render: (v: number) => v.toFixed(1) },
    {
      title: '供需缺口', dataIndex: 'gap', key: 'gap',
      render: (v: number) => (
        <span style={{ fontWeight: 600, color: v > 0 ? '#10b981' : '#ef4444' }}>
          {v > 0 ? '+' : ''}{v.toFixed(1)}
        </span>
      ),
    },
    {
      title: '预估价格(元/吨)', dataIndex: 'estimatedPrice', key: 'estimatedPrice',
      render: (v: number) => v.toLocaleString(),
    },
  ];

  const histColumns = [
    { title: '时期', dataIndex: 'period', key: 'period', width: 100, render: (v: string) => <span style={{ fontWeight: 600, color: TEXT.primary }}>{v}</span> },
    { title: '情境描述', dataIndex: 'description', key: 'description', width: 120 },
    { title: '当时条件', dataIndex: 'conditions', key: 'conditions' },
    {
      title: '价格变化', dataIndex: 'actualPriceChange', key: 'actualPriceChange', width: 100,
      render: (v: number) => (
        <Tag style={{ background: v >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: v >= 0 ? '#10b981' : '#ef4444' }}>{v >= 0 ? '+' : ''}{v}%</Tag>
      ),
    },
    { title: '持续时间', dataIndex: 'duration', key: 'duration', width: 100 },
  ];

  if (loading && results.length === 0) return <PageLoading />;

  const glassCard: React.CSSProperties = { ...CARD, borderRadius: 14 };
  const sliderStyle = { marginBottom: 20 };

  return (
    <div>
      {/* ═══ 参数调节面板 ═══ */}
      <div style={{ ...glassCard, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>情境参数调节</div>
        <Row gutter={[40, 8]}>
          <Col xs={24} md={12}>
            <div style={sliderStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: TEXT.primary }}>EV销量增速</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: params.evGrowthRate >= 0 ? '#10b981' : '#ef4444' }}>{params.evGrowthRate > 0 ? '+' : ''}{params.evGrowthRate}%</span>
              </div>
              <Slider min={-20} max={30} value={params.evGrowthRate} onChange={(v) => updateParams({ evGrowthRate: v })} marks={{ '-20': '-20%', 0: '0%', 30: '+30%' }} />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={sliderStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: TEXT.primary }}>储能装机增速</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: params.storageGrowthRate >= 0 ? '#10b981' : '#ef4444' }}>{params.storageGrowthRate > 0 ? '+' : ''}{params.storageGrowthRate}%</span>
              </div>
              <Slider min={-10} max={40} value={params.storageGrowthRate} onChange={(v) => updateParams({ storageGrowthRate: v })} marks={{ '-10': '-10%', 0: '0%', 40: '+40%' }} />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={sliderStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: TEXT.primary }}>供给变化</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: params.supplyChange >= 0 ? '#10b981' : '#ef4444' }}>{params.supplyChange > 0 ? '+' : ''}{params.supplyChange}%</span>
              </div>
              <Slider min={-15} max={20} value={params.supplyChange} onChange={(v) => updateParams({ supplyChange: v })} marks={{ '-15': '-15%', 0: '0%', 20: '+20%' }} />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={sliderStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: TEXT.primary }}>宏观环境</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: params.macroEnvironment > 50 ? '#ef4444' : '#10b981' }}>{params.macroEnvironment <= 33 ? '宽松' : params.macroEnvironment <= 66 ? '中性' : '紧缩'}</span>
              </div>
              <Slider min={0} max={100} value={params.macroEnvironment} onChange={(v) => updateParams({ macroEnvironment: v })} marks={{ 0: '宽松', 50: '中性', 100: '紧缩' }} />
            </div>
          </Col>
        </Row>
      </div>

      {/* ═══ 需求预测曲线 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>需求预测（乐观/基准/悲观）</div>
        <ReactECharts option={demandOption} style={{ height: 350 }} />
      </div>

      {/* ═══ 价格预测曲线 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>价格预测（乐观/基准/悲观）</div>
        <ReactECharts option={priceOption} style={{ height: 350 }} />
      </div>

      {/* ═══ 供需平衡表 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>供需平衡表</div>
        <Table
          columns={sheetColumns}
          dataSource={sheet.map((s, i) => ({ ...s, key: `sheet-${i}` }))}
          size="small"
          pagination={false}
        />
      </div>

      {/* ═══ 历史情境回放 ═══ */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>历史情境回放</div>
        <Table
          columns={histColumns}
          dataSource={historical.map((h) => ({ ...h, key: h.id }))}
          size="small"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default ScenarioAnalysis;
