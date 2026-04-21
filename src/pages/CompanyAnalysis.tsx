import React, { useEffect, useMemo } from 'react';
import { Row, Col, Select, Tag, Progress } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useCompanyStore } from '../stores/companyStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP } from '../utils/styles';

const chainLabels: Record<string, { label: string; color: string }> = {
  upstream: { label: '上游', color: '#0064ff' },
  midstream: { label: '中游', color: '#f59e0b' },
  downstream: { label: '下游', color: '#10b981' },
};

const CompanyAnalysis: React.FC = () => {
  const { companies, financialReports, cycle, selectedCompany, loading, fetchAll, selectCompany } = useCompanyStore();

  useEffect(() => { fetchAll(); }, []);

  const financialOption = useMemo(() => {
    if (financialReports.length === 0) return {};
    return {
      tooltip: CHART_TOOLTIP,
      legend: { data: ['营收', '净利润', '毛利率'], top: 0, itemWidth: 16, itemHeight: 2, textStyle: { fontSize: 12, color: '#8c8c8c' } },
      grid: { top: 40, right: 60, bottom: 30, left: 60 },
      xAxis: { type: 'category', data: financialReports.map((r) => r.quarter), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: CHART_AXIS_LABEL },
      yAxis: [
        { type: 'value', name: '亿元', nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
        { type: 'value', name: '%', position: 'right' as const, nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
      ],
      series: [
        { name: '营收', type: 'bar', data: financialReports.map((r) => r.revenue), itemStyle: { color: '#0064ff' }, barWidth: '20%' },
        { name: '净利润', type: 'bar', data: financialReports.map((r) => r.netProfit), itemStyle: { color: '#10b981' }, barWidth: '20%' },
        { name: '毛利率', type: 'line', yAxisIndex: 1, data: financialReports.map((r) => r.grossMargin), smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { color: '#f59e0b', width: 2 }, itemStyle: { color: '#f59e0b' } },
      ],
    };
  }, [financialReports]);

  const companyOptions = companies.map((c) => ({ label: c.name, value: c.id }));

  const grouped = useMemo(() => {
    const groups: Record<string, typeof companies> = { upstream: [], midstream: [], downstream: [] };
    companies.forEach((c) => { if (groups[c.chain]) groups[c.chain].push(c); });
    return groups;
  }, [companies]);

  if (loading) return <PageLoading />;

  return (
    <div>
      {/* 产业链概览 */}
      <Row gutter={GAP}>
        {(['upstream', 'midstream', 'downstream'] as const).map((chain) => (
          <Col xs={24} lg={8} key={chain}>
            <div style={{ ...CARD, background: '#fff', ...CARD_BODY }}>
              <div style={{ ...SECTION, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color={chainLabels[chain].color} style={{ margin: 0 }}>{chainLabels[chain].label}</Tag>
                <span>产业链</span>
              </div>
              {grouped[chain].map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '12px 14px',
                    marginBottom: 8,
                    background: selectedCompany === c.id ? `${chainLabels[chain].color}08` : '#fafafa',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedCompany === c.id ? `2px solid ${chainLabels[chain].color}` : '2px solid transparent',
                  }}
                  onClick={() => selectCompany(c.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: '#bfbfbf' }}>市值 {c.marketCap}亿</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4, lineHeight: 1.5 }}>{c.description}</div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: '#bfbfbf' }}>营收 {c.revenue}亿</span>
                    <span style={{ fontSize: 11, color: '#bfbfbf' }}>净利 {c.netProfit}亿</span>
                    <span style={{ fontSize: 11, color: '#bfbfbf' }}>毛利率 {c.grossMargin}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        ))}
      </Row>

      {/* 财务数据 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP, ...CARD_BODY }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>财务数据</span>
          <Select value={selectedCompany} onChange={selectCompany} options={companyOptions} style={{ width: 160 }} />
        </div>
        <ReactECharts option={financialOption} style={{ height: 350 }} />
      </div>

      {/* 行业周期 */}
      {cycle && (
        <div style={{ ...CARD, background: '#fff', marginTop: GAP, ...CARD_BODY }}>
          <div style={SECTION}>行业周期识别</div>
          <Row gutter={GAP}>
            <Col span={8}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 12 }}>当前阶段</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#0064ff', marginBottom: 20 }}>{cycle.currentStage}</div>
                <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>置信度</div>
                <Progress type="dashboard" percent={cycle.confidence} size={120} strokeColor="#0064ff" format={(p) => `${p}%`} />
              </div>
            </Col>
            <Col span={16}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {cycle.indicators.map((ind) => (
                  <div key={ind.name} style={{
                    padding: '12px 16px',
                    background: ind.status === 'positive' ? 'rgba(16,185,129,0.04)' : ind.status === 'negative' ? 'rgba(239,68,68,0.04)' : '#fafafa',
                    borderRadius: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #f0f0f0',
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{ind.name}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginTop: 2 }}>{ind.value}</div>
                    </div>
                    <Tag color={ind.status === 'positive' ? 'green' : ind.status === 'negative' ? 'red' : 'default'}>
                      {ind.trend === 'up' ? '↑' : ind.trend === 'down' ? '↓' : '→'}
                    </Tag>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default CompanyAnalysis;
