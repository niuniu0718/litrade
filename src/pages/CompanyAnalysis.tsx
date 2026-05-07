import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Select, Tag, Tabs, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useCompanyStore } from '../stores/companyStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, TEXT } from '../utils/styles';

const chainLabels: Record<string, { label: string; color: string }> = {
  upstream: { label: '上游', color: '#0064ff' },
  midstream: { label: '中游', color: '#FAAD14' },
  downstream: { label: '下游', color: '#00C86E' },
};

const CompanyAnalysis: React.FC = () => {
  const { companies, financialReports, selectedCompany, loading, fetchAll, selectCompany } = useCompanyStore();
  const [compareChain, setCompareChain] = useState<string>('upstream');

  useEffect(() => { fetchAll(); }, []);

  const financialOption = useMemo(() => {
    if (financialReports.length === 0) return {};
    return {
      tooltip: CHART_TOOLTIP,
      legend: { data: ['营收', '净利润', '毛利率'], top: 0, itemWidth: 16, itemHeight: 2, textStyle: { fontSize: 12, color: '#8C8C8C' } },
      grid: { top: 40, right: 60, bottom: 30, left: 60 },
      xAxis: { type: 'category', data: financialReports.map((r) => r.quarter), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: CHART_AXIS_LABEL },
      yAxis: [
        { type: 'value', name: '亿元', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
        { type: 'value', name: '%', position: 'right' as const, nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
      ],
      series: [
        { name: '营收', type: 'bar', data: financialReports.map((r) => r.revenue), itemStyle: { color: '#0064FF' }, barWidth: '20%' },
        { name: '净利润', type: 'bar', data: financialReports.map((r) => r.netProfit), itemStyle: { color: '#00C86E' }, barWidth: '20%' },
        { name: '毛利率', type: 'line', yAxisIndex: 1, data: financialReports.map((r) => r.grossMargin), smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { color: '#FAAD14', width: 2 }, itemStyle: { color: '#FAAD14' } },
      ],
    };
  }, [financialReports]);

  const companyOptions = companies.map((c) => ({ label: c.name, value: c.id }));

  const grouped = useMemo(() => {
    const groups: Record<string, typeof companies> = { upstream: [], midstream: [], downstream: [] };
    companies.forEach((c) => { if (groups[c.chain]) groups[c.chain].push(c); });
    return groups;
  }, [companies]);

  // Generate comparison financial data for all companies in the same chain
  const compareTables = useMemo(() => {
    const chainCompanies = grouped[compareChain] || [];
    if (!chainCompanies.length) return { income: [], balance: [], cashflow: [] };

    const quarters = ['2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1'];
    const companyColors = ['#0064FF', '#722ED1', '#FAAD14', '#00C86E', '#FF4D4F', '#8C8C8C'];

    // Income statement comparison
    const income = chainCompanies.map((c, ci) => {
      const color = companyColors[ci % companyColors.length];
      const revBase = c.revenue / 4;
      const profitBase = c.netProfit / 4;
      return {
        company: c.name,
        color,
        data: quarters.map((q) => ({
          quarter: q,
          revenue: Math.round(revBase * (0.9 + Math.random() * 0.4)),
          cost: Math.round(revBase * (0.6 + Math.random() * 0.15)),
          grossProfit: 0,
          grossMargin: 0,
          netProfit: Math.round(profitBase * (0.7 + Math.random() * 0.6)),
          netMargin: 0,
          revenueGrowth: Math.round((-10 + Math.random() * 40) * 10) / 10,
          profitGrowth: Math.round((-30 + Math.random() * 60) * 10) / 10,
        })).map((d) => ({
          ...d,
          grossProfit: d.revenue - d.cost,
          grossMargin: Math.round((d.revenue - d.cost) / d.revenue * 1000) / 10,
          netMargin: d.revenue > 0 ? Math.round(d.netProfit / d.revenue * 1000) / 10 : 0,
        })),
      };
    });

    // Balance sheet comparison
    const balance = chainCompanies.map((c, ci) => {
      const color = companyColors[ci % companyColors.length];
      const assetBase = c.marketCap * 0.6;
      return {
        company: c.name,
        color,
        data: quarters.map((q) => ({
          quarter: q,
          totalAssets: Math.round(assetBase * (0.9 + Math.random() * 0.2)),
          totalLiabilities: Math.round(assetBase * (0.3 + Math.random() * 0.15)),
          netAssets: 0,
          assetLiabilityRatio: 0,
          monetaryFunds: Math.round(assetBase * (0.1 + Math.random() * 0.1)),
          accountsReceivable: Math.round(c.revenue / 4 * (0.2 + Math.random() * 0.2)),
          inventory: Math.round(c.revenue / 4 * (0.15 + Math.random() * 0.15)),
        })).map((d) => ({
          ...d,
          netAssets: d.totalAssets - d.totalLiabilities,
          assetLiabilityRatio: Math.round(d.totalLiabilities / d.totalAssets * 1000) / 10,
        })),
      };
    });

    // Cash flow comparison
    const cashflow = chainCompanies.map((c, ci) => {
      const color = companyColors[ci % companyColors.length];
      const revBase = c.revenue / 4;
      return {
        company: c.name,
        color,
        data: quarters.map((q) => ({
          quarter: q,
          operatingCashflow: Math.round(revBase * (0.05 + Math.random() * 0.15)),
          investingCashflow: -Math.round(revBase * (0.08 + Math.random() * 0.12)),
          financingCashflow: Math.round(revBase * (-0.05 + Math.random() * 0.1)),
          freeCashflow: 0,
        })).map((d) => ({
          ...d,
          freeCashflow: d.operatingCashflow + d.investingCashflow,
        })),
      };
    });

    return { income, balance, cashflow };
  }, [grouped, compareChain]);

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
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#1F1F1F' }}>{c.name}</span>
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
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1F1F1F' }}>财务数据</span>
          <Select value={selectedCompany} onChange={selectCompany} options={companyOptions} style={{ width: 160 }} />
        </div>
        <ReactECharts option={financialOption} style={{ height: 350 }} />
      </div>

      {/* 同行业财务对比 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP, ...CARD_BODY }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: TEXT.primary }}>同行业财务对比</span>
          <Select
            value={compareChain}
            onChange={setCompareChain}
            options={[
              { label: '上游企业', value: 'upstream' },
              { label: '中游企业', value: 'midstream' },
              { label: '下游企业', value: 'downstream' },
            ]}
            style={{ width: 140 }}
          />
        </div>
        <Tabs
          items={[
            {
              key: 'income',
              label: '利润表',
              children: (
                <Table
                  size="small"
                  pagination={false}
                  scroll={{ x: 800 }}
                  dataSource={compareTables.income.flatMap((c) =>
                    c.data.map((d, i) => ({
                      key: `${c.company}-${d.quarter}`,
                      company: i === 0 ? c.company : '',
                      color: c.color,
                      ...d,
                    }))
                  )}
                  columns={[
                    { title: '公司', dataIndex: 'company', key: 'company', width: 120, fixed: 'left' as const, render: (v: string, r: { color: string }) => <span style={{ fontWeight: 600, color: r.color }}>{v}</span> },
                    { title: '季度', dataIndex: 'quarter', key: 'quarter', width: 80, render: (v: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span> },
                    { title: '营收(亿)', dataIndex: 'revenue', key: 'revenue', width: 90, render: (v: number) => v.toLocaleString() },
                    { title: '成本(亿)', dataIndex: 'cost', key: 'cost', width: 90, render: (v: number) => v.toLocaleString() },
                    { title: '毛利润(亿)', dataIndex: 'grossProfit', key: 'grossProfit', width: 100, render: (v: number) => <span style={{ fontWeight: 600 }}>{v.toLocaleString()}</span> },
                    { title: '毛利率%', dataIndex: 'grossMargin', key: 'grossMargin', width: 80, render: (v: number) => <span style={{ color: v >= 20 ? '#00C86E' : v >= 10 ? '#FAAD14' : '#FF4D4F', fontWeight: 600 }}>{v}%</span> },
                    { title: '净利润(亿)', dataIndex: 'netProfit', key: 'netProfit', width: 100, render: (v: number) => <span style={{ fontWeight: 600, color: v >= 0 ? TEXT.primary : '#FF4D4F' }}>{v.toLocaleString()}</span> },
                    { title: '净利率%', dataIndex: 'netMargin', key: 'netMargin', width: 80, render: (v: number) => `${v}%` },
                    { title: '营收增速%', dataIndex: 'revenueGrowth', key: 'revenueGrowth', width: 90, render: (v: number) => <span style={{ color: v >= 0 ? '#FF4D4F' : '#00C86E' }}>{v >= 0 ? '+' : ''}{v}%</span> },
                    { title: '利润增速%', dataIndex: 'profitGrowth', key: 'profitGrowth', width: 90, render: (v: number) => <span style={{ color: v >= 0 ? '#FF4D4F' : '#00C86E' }}>{v >= 0 ? '+' : ''}{v}%</span> },
                  ]}
                />
              ),
            },
            {
              key: 'balance',
              label: '资产负债表',
              children: (
                <Table
                  size="small"
                  pagination={false}
                  scroll={{ x: 800 }}
                  dataSource={compareTables.balance.flatMap((c) =>
                    c.data.map((d, i) => ({
                      key: `${c.company}-${d.quarter}`,
                      company: i === 0 ? c.company : '',
                      color: c.color,
                      ...d,
                    }))
                  )}
                  columns={[
                    { title: '公司', dataIndex: 'company', key: 'company', width: 120, fixed: 'left' as const, render: (v: string, r: { color: string }) => <span style={{ fontWeight: 600, color: r.color }}>{v}</span> },
                    { title: '季度', dataIndex: 'quarter', key: 'quarter', width: 80, render: (v: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span> },
                    { title: '总资产(亿)', dataIndex: 'totalAssets', key: 'totalAssets', width: 100, render: (v: number) => v.toLocaleString() },
                    { title: '总负债(亿)', dataIndex: 'totalLiabilities', key: 'totalLiabilities', width: 100, render: (v: number) => v.toLocaleString() },
                    { title: '净资产(亿)', dataIndex: 'netAssets', key: 'netAssets', width: 100, render: (v: number) => <span style={{ fontWeight: 600 }}>{v.toLocaleString()}</span> },
                    { title: '资产负债率%', dataIndex: 'assetLiabilityRatio', key: 'assetLiabilityRatio', width: 100, render: (v: number) => <span style={{ color: v >= 60 ? '#FF4D4F' : v >= 40 ? '#FAAD14' : '#00C86E', fontWeight: 600 }}>{v}%</span> },
                    { title: '货币资金(亿)', dataIndex: 'monetaryFunds', key: 'monetaryFunds', width: 110, render: (v: number) => v.toLocaleString() },
                    { title: '应收账款(亿)', dataIndex: 'accountsReceivable', key: 'accountsReceivable', width: 110, render: (v: number) => v.toLocaleString() },
                    { title: '存货(亿)', dataIndex: 'inventory', key: 'inventory', width: 90, render: (v: number) => v.toLocaleString() },
                  ]}
                />
              ),
            },
            {
              key: 'cashflow',
              label: '现金流量表',
              children: (
                <Table
                  size="small"
                  pagination={false}
                  scroll={{ x: 700 }}
                  dataSource={compareTables.cashflow.flatMap((c) =>
                    c.data.map((d, i) => ({
                      key: `${c.company}-${d.quarter}`,
                      company: i === 0 ? c.company : '',
                      color: c.color,
                      ...d,
                    }))
                  )}
                  columns={[
                    { title: '公司', dataIndex: 'company', key: 'company', width: 120, fixed: 'left' as const, render: (v: string, r: { color: string }) => <span style={{ fontWeight: 600, color: r.color }}>{v}</span> },
                    { title: '季度', dataIndex: 'quarter', key: 'quarter', width: 80, render: (v: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span> },
                    { title: '经营现金流(亿)', dataIndex: 'operatingCashflow', key: 'operatingCashflow', width: 120, render: (v: number) => <span style={{ color: v >= 0 ? '#00C86E' : '#FF4D4F', fontWeight: 600 }}>{v >= 0 ? '+' : ''}{v.toLocaleString()}</span> },
                    { title: '投资现金流(亿)', dataIndex: 'investingCashflow', key: 'investingCashflow', width: 120, render: (v: number) => <span style={{ color: v >= 0 ? '#00C86E' : '#FF4D4F' }}>{v >= 0 ? '+' : ''}{v.toLocaleString()}</span> },
                    { title: '筹资现金流(亿)', dataIndex: 'financingCashflow', key: 'financingCashflow', width: 120, render: (v: number) => <span style={{ color: v >= 0 ? '#00C86E' : '#FF4D4F' }}>{v >= 0 ? '+' : ''}{v.toLocaleString()}</span> },
                    { title: '自由现金流(亿)', dataIndex: 'freeCashflow', key: 'freeCashflow', width: 120, render: (v: number) => <span style={{ fontWeight: 700, color: v >= 0 ? '#00C86E' : '#FF4D4F' }}>{v >= 0 ? '+' : ''}{v.toLocaleString()}</span> },
                  ]}
                />
              ),
            },
          ]}
        />
      </div>

    </div>
  );
};

export default CompanyAnalysis;
