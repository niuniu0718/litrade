import React, { useEffect, useMemo } from 'react';
import { Row, Col, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useCostStore } from '../stores/costStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP } from '../utils/styles';

const COUNTRY_COLORS: Record<string, string> = {
  '澳大利亚': '#0064ff', '智利': '#f5222d', '阿根廷': '#f59e0b',
  '中国': '#ef4444', '美国': '#7c3aed', '刚果(金)': '#10b981',
};

const CostAnalysis: React.FC = () => {
  const { projectCosts, costCurve, loading, fetchAll } = useCostStore();

  useEffect(() => { fetchAll(); }, []);

  const curveOption = useMemo(() => {
    if (costCurve.length === 0) return {};
    return {
      tooltip: CHART_TOOLTIP,
      grid: { top: 30, right: 20, bottom: 40, left: 65 },
      xAxis: { type: 'value', name: '累计产量(LCE万吨)', nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { lineStyle: { color: '#f3f4f6' } } },
      yAxis: { type: 'value', name: '成本($/吨)', nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { lineStyle: { color: '#f3f4f6' } } },
      series: [{
        type: 'line', step: 'start', data: costCurve.map((c) => [c.cumulativeOutput, c.cost]),
        lineStyle: { width: 2, color: '#0064ff' }, symbol: 'circle', symbolSize: 8,
        itemStyle: { color: (params: { dataIndex: number }) => COUNTRY_COLORS[costCurve[params.dataIndex]?.country ?? ''] || '#0064ff' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,100,255,0.15)' }, { offset: 1, color: 'rgba(0,100,255,0)' }] } },
        markPoint: { data: costCurve.map((c) => ({ coord: [c.cumulativeOutput, c.cost], value: c.project, symbolSize: 0, label: { show: true, formatter: c.project, fontSize: 9, color: '#8c8c8c', position: 'top' as const } })) },
      }],
    };
  }, [costCurve]);

  const stackOption = useMemo(() => {
    if (projectCosts.length === 0) return {};
    const sorted = [...projectCosts].sort((a, b) => a.total - b.total);
    return {
      tooltip: CHART_TOOLTIP,
      legend: { data: ['采矿成本', '加工成本', '物流成本'], top: 0, itemWidth: 16, itemHeight: 2, textStyle: { fontSize: 12, color: '#8c8c8c' } },
      grid: { top: 40, right: 20, bottom: 30, left: 110 },
      xAxis: { type: 'value', name: '$/吨', nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL },
      yAxis: { type: 'category', data: sorted.map((p) => p.project), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: '#8c8c8c' } },
      series: [
        { name: '采矿成本', type: 'bar', stack: 'cost', data: sorted.map((p) => p.mining), itemStyle: { color: '#0064ff' }, barWidth: '50%' },
        { name: '加工成本', type: 'bar', stack: 'cost', data: sorted.map((p) => p.processing), itemStyle: { color: '#f59e0b' } },
        { name: '物流成本', type: 'bar', stack: 'cost', data: sorted.map((p) => p.logistics), itemStyle: { color: '#10b981' } },
      ],
    };
  }, [projectCosts]);

  const columns = [
    { title: '项目', dataIndex: 'project', key: 'project', width: 130, render: (v: string) => <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{v}</span> },
    { title: '国家', dataIndex: 'country', key: 'country', width: 90 },
    { title: '矿种', dataIndex: 'mineralType', key: 'mineralType', width: 90 },
    { title: '采矿($/t)', dataIndex: 'mining', key: 'mining', width: 100, render: (v: number) => `$${v.toLocaleString()}` },
    { title: '加工($/t)', dataIndex: 'processing', key: 'processing', width: 100, render: (v: number) => `$${v.toLocaleString()}` },
    { title: '物流($/t)', dataIndex: 'logistics', key: 'logistics', width: 100, render: (v: number) => `$${v.toLocaleString()}` },
    { title: '总成本', dataIndex: 'total', key: 'total', width: 110, render: (v: number) => <span style={{ fontWeight: 700, color: '#1a1a2e' }}>${v.toLocaleString()}</span> },
  ];

  if (loading) return <PageLoading />;

  return (
    <div>
      {/* 项目成本表 */}
      <div style={{ ...CARD, background: '#fff' }}>
        <div style={{ ...CARD_BODY, paddingBottom: 0 }}>
          <div style={SECTION}>项目成本明细</div>
        </div>
        <Table columns={columns} dataSource={projectCosts.map((p) => ({ ...p, key: p.id }))} size="small" pagination={false} />
      </div>

      <Row gutter={GAP} style={{ marginTop: GAP }}>
        <Col xs={24} lg={14}>
          <div style={{ ...CARD, background: '#fff', ...CARD_BODY, height: '100%' }}>
            <div style={SECTION}>全球成本曲线</div>
            <ReactECharts option={curveOption} style={{ height: 400 }} />
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div style={{ ...CARD, background: '#fff', ...CARD_BODY, height: '100%' }}>
            <div style={SECTION}>成本构成</div>
            <ReactECharts option={stackOption} style={{ height: 400 }} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CostAnalysis;
