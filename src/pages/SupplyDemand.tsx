import React, { useEffect, useMemo } from 'react';
import { Row, Col, Tabs, Table, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useSupplyStore } from '../stores/supplyStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, COLORS } from '../utils/chartThemes';
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
    legend: { data: ['供给', '需求', '盈余/缺口'], top: 0, itemWidth: 16, itemHeight: 2, textStyle: { fontSize: 12, color: '#8c8c8c' } },
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
