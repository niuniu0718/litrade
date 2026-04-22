import React, { useEffect, useMemo } from 'react';
import { Row, Col, Tabs, Table, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useSupplyStore } from '../stores/supplyStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, COLORS, CHART_LEGEND } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP } from '../utils/styles';

const SupplyDemand: React.FC = () => {
  const { projects, summary, demandSectors, balance, loading, fetchAll } = useSupplyStore();

  useEffect(() => { fetchAll(); }, []);

  const demandPieOption = useMemo(() => ({
    tooltip: { trigger: 'item' as const, backgroundColor: 'rgba(255,255,255,0.96)', borderColor: '#e5e7eb', borderWidth: 1, textStyle: { color: '#1a1a2e', fontSize: 13 } },
    legend: { orient: 'vertical' as const, right: 10, top: 'center', textStyle: { fontSize: 12, color: '#8c8c8c' } },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['35%', '50%'], avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 }, label: { show: false },
      data: demandSectors.map((d, i) => ({ value: d.share, name: d.sector, itemStyle: { color: COLORS[i % COLORS.length] } })),
    }],
  }), [demandSectors]);

  const demandBarOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    grid: { top: 20, right: 20, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: demandSectors.map((d) => d.sector), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 20 } },
    yAxis: { type: 'value', name: '同比增长%', nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
    series: [{ type: 'bar', data: demandSectors.map((d, i) => ({ value: d.growth, itemStyle: { color: d.growth >= 0 ? COLORS[i % COLORS.length] : '#ef4444' } })), barWidth: '40%' }],
  }), [demandSectors]);

  const balanceOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['供给', '需求', '盈余/缺口'] },
    grid: { top: 40, right: 60, bottom: 30, left: 50 },
    xAxis: { type: 'category', data: balance.map((b) => b.month), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: 'LCE万吨', nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '盈余/缺口', position: 'right' as const, nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '供给', type: 'bar', data: balance.map((b) => b.supply), itemStyle: { color: '#0064ff' }, barWidth: '20%' },
      { name: '需求', type: 'bar', data: balance.map((b) => b.demand), itemStyle: { color: '#f59e0b' }, barWidth: '20%' },
      { name: '盈余/缺口', type: 'line', yAxisIndex: 1, data: balance.map((b) => b.surplus), smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { color: '#10b981', width: 2 }, itemStyle: { color: '#10b981' } },
    ],
  }), [balance]);

  // 产能利用率柱状图
  const utilizationOption = useMemo(() => {
    const producers = [
      { name: '澳大利亚', rate: 85 },
      { name: '智利', rate: 90 },
      { name: '中国', rate: 72 },
      { name: '阿根廷', rate: 78 },
      { name: '全球平均', rate: 82 },
    ];
    return {
      tooltip: CHART_TOOLTIP,
      grid: { top: 20, right: 20, bottom: 30, left: 80 },
      xAxis: { type: 'value', max: 100, name: '%', nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: 'category', data: producers.map((p) => p.name), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: CHART_AXIS_LABEL },
      series: [{
        type: 'bar',
        data: producers.map((p) => ({
          value: p.rate,
          itemStyle: {
            color: p.rate >= 85 ? '#10b981' : p.rate >= 75 ? '#f59e0b' : '#ef4444',
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '50%',
        label: { show: true, position: 'right' as const, formatter: '{c}%', fontSize: 12, color: '#6b7280' },
      }],
    };
  }, []);

  // 扩产管道时间线
  const pipelineOption = useMemo(() => {
    const pipeline = [
      { project: 'Thacker Pass一期', country: '美国', timeline: '2025 Q3', capacity: 3, status: '建设中' },
      { project: 'Manono一期', country: '刚果(金)', timeline: '2025 Q4', capacity: 5, status: '勘探中' },
      { project: 'Greenbushes扩产', country: '澳大利亚', timeline: '2026 Q1', capacity: 4, status: '规划中' },
      { project: 'Salar de Atacama扩产', country: '智利', timeline: '2026 Q2', capacity: 3, status: '规划中' },
      { project: '宜春云母提锂扩产', country: '中国', timeline: '2026 H1', capacity: 2, status: '规划中' },
    ];
    return {
      tooltip: CHART_TOOLTIP,
      grid: { top: 40, right: 30, bottom: 30, left: 140 },
      xAxis: { type: 'value', name: '产能(万吨/年)', nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: 'category', data: pipeline.map((p) => `${p.project}(${p.timeline})`), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, fontSize: 11 } },
      series: [{
        type: 'bar',
        data: pipeline.map((p) => ({
          value: p.capacity,
          itemStyle: {
            color: p.status === '建设中' ? '#0064ff' : p.status === '勘探中' ? '#f59e0b' : '#8c8c8c',
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '50%',
        label: { show: true, position: 'right' as const, formatter: '{c}万吨', fontSize: 12, color: '#6b7280' },
      }],
    };
  }, []);

  // 供给弹性分析
  const elasticityOption = useMemo(() => {
    const pricePoints = [40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000];
    const supplyResponse = [72, 78, 82, 88, 93, 96, 98, 100];
    return {
      tooltip: CHART_TOOLTIP,
      legend: { ...CHART_LEGEND, data: ['产能利用率'] },
      grid: { top: 40, right: 20, bottom: 30, left: 70 },
      xAxis: { type: 'category', data: pricePoints.map((p) => (p / 10000) + '万'), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, color: '#9ca3af' } },
      yAxis: { type: 'value', name: '产能利用率%', min: 60, max: 105, nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      series: [{
        name: '产能利用率',
        type: 'line',
        data: supplyResponse,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#0064ff', width: 2 },
        itemStyle: { color: '#0064ff' },
        areaStyle: {
          color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,100,255,0.15)' }, { offset: 1, color: 'rgba(0,100,255,0)' }] },
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#ef4444', type: 'dashed' },
          data: [{ yAxis: 90, label: { formatter: '高利用率阈值', fontSize: 11, color: '#ef4444' } }],
        },
      }],
    };
  }, []);

  const projectColumns = [
    { title: '项目', dataIndex: 'name', key: 'name', width: 130, render: (v: string) => <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{v}</span> },
    { title: '国家', dataIndex: 'country', key: 'country', width: 90 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (v: string) => {
        const map: Record<string, { color: string; label: string }> = { producing: { color: 'green', label: '生产中' }, construction: { color: 'blue', label: '建设中' }, exploration: { color: 'orange', label: '勘探中' }, suspended: { color: 'red', label: '停产' } };
        const s = map[v] || { color: 'default', label: v };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    { title: '矿种', dataIndex: 'mineralType', key: 'mineralType', width: 90 },
    { title: '储量(万吨LCE)', dataIndex: 'reserve', key: 'reserve', width: 110, render: (v: number) => v.toLocaleString() },
    { title: '产能(万吨/年)', dataIndex: 'capacity', key: 'capacity', width: 110, render: (v: number) => v.toLocaleString() },
    { title: '实际产量', dataIndex: 'actualOutput', key: 'actualOutput', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '成本($/t)', dataIndex: 'cost', key: 'cost', width: 100, render: (v: number) => `$${v.toLocaleString()}` },
    { title: '运营方', dataIndex: 'operator', key: 'operator', width: 130 },
  ];

  if (loading) return <PageLoading />;

  const supplyTab = (
    <div>
      {/* 汇总统计横条 */}
      <div style={{ ...CARD, background: '#fff', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>全球供应量</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0064ff' }}>{summary?.globalSupply ?? '-'} <span style={{ fontSize: 12, fontWeight: 400, color: '#bfbfbf' }}>LCE万吨</span></div>
        </div>
        <div style={{ width: 1, height: 40, background: '#f0f0f0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>同比增长</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{summary?.yoyChange ?? '-'}%</div>
        </div>
        <div style={{ width: 1, height: 40, background: '#f0f0f0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>主要生产国</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>{summary?.topCountries.length ?? '-'} <span style={{ fontSize: 12, fontWeight: 400, color: '#bfbfbf' }}>个</span></div>
        </div>
      </div>

      {/* 产能利用率 + 扩产管道 */}
      <Row gutter={GAP} style={{ marginTop: GAP }}>
        <Col xs={24} lg={12}>
          <div style={{ ...CARD, background: '#fff', ...CARD_BODY }}>
            <div style={SECTION}>产能利用率（主要生产国）</div>
            <ReactECharts option={utilizationOption} style={{ height: 260 }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div style={{ ...CARD, background: '#fff', ...CARD_BODY }}>
            <div style={SECTION}>扩产管道</div>
            <ReactECharts option={pipelineOption} style={{ height: 260 }} />
          </div>
        </Col>
      </Row>

      {/* 供给弹性分析 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP, ...CARD_BODY }}>
        <div style={SECTION}>供给弹性分析</div>
        <ReactECharts option={elasticityOption} style={{ height: 300 }} />
      </div>

      {/* 全球矿山项目表 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP }}>
        <div style={{ ...CARD_BODY, paddingBottom: 0 }}>
          <div style={SECTION}>全球矿山项目</div>
        </div>
        <Table
          columns={projectColumns}
          dataSource={projects.map((p) => ({ ...p, key: p.id }))}
          size="small"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1100 }}
        />
      </div>
    </div>
  );

  const demandTab = (
    <div>
      <Row gutter={GAP}>
        <Col xs={24} lg={12}>
          <div style={{ ...CARD, background: '#fff', ...CARD_BODY }}>
            <div style={SECTION}>需求结构</div>
            <ReactECharts option={demandPieOption} style={{ height: 300 }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div style={{ ...CARD, background: '#fff', ...CARD_BODY }}>
            <div style={SECTION}>需求同比增长</div>
            <ReactECharts option={demandBarOption} style={{ height: 300 }} />
          </div>
        </Col>
      </Row>

      <div style={{ ...CARD, background: '#fff', marginTop: GAP, ...CARD_BODY }}>
        <div style={SECTION}>供需平衡趋势</div>
        <ReactECharts option={balanceOption} style={{ height: 350 }} />
      </div>
    </div>
  );

  return (
    <div style={{ ...CARD, background: '#fff', ...CARD_BODY }}>
      <Tabs
        defaultActiveKey="supply"
        items={[
          { key: 'supply', label: '供应', children: supplyTab },
          { key: 'demand', label: '需求', children: demandTab },
        ]}
      />
    </div>
  );
};

export default SupplyDemand;
