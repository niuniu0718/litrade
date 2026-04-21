import React, { useEffect, useMemo } from 'react';
import { Table, Row, Col, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { usePriceStore } from '../stores/priceStore';
import PriceChangeTag from '../components/PriceChangeTag';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, COLORS } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP } from '../utils/styles';

const STAGE_COLORS: Record<string, string> = {
  '矿石': '#0064ff',
  '锂盐': '#7c3aed',
  '正极': '#f59e0b',
  '电池': '#10b981',
};

const PriceManagement: React.FC = () => {
  const { spotPrices, futuresPrices, chainPrices, loading, fetchAll } = usePriceStore();

  useEffect(() => { fetchAll(); }, []);

  const spotColumns = [
    {
      title: '品种', dataIndex: 'name', key: 'name', width: 140,
      render: (v: string) => <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{v}</span>,
    },
    { title: '地区', dataIndex: 'region', key: 'region', width: 80 },
    {
      title: '价格', dataIndex: 'price', key: 'price', width: 120,
      render: (v: number, r: { unit: string }) => (
        <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{v.toLocaleString()} <span style={{ color: '#bfbfbf', fontSize: 12, fontWeight: 400 }}>{r.unit}</span></span>
      ),
    },
    { title: '涨跌', dataIndex: 'change', key: 'change', width: 100, render: (v: number) => <PriceChangeTag value={v} /> },
    { title: '涨跌幅', dataIndex: 'changePercent', key: 'changePercent', width: 100, render: (v: number) => <PriceChangeTag value={v} percent /> },
    {
      title: '7日走势', key: 'trend', width: 120,
      render: (_: unknown, row: { trend7d: number[]; change: number }) => {
        if (row.trend7d.length < 2) return '-';
        const isUp = row.change >= 0;
        return (
          <ReactECharts
            option={{
              grid: { top: 2, bottom: 2, left: 0, right: 0 },
              xAxis: { show: false, type: 'category', data: row.trend7d.map((_, i) => i) },
              yAxis: { show: false, type: 'value', min: 'dataMin' },
              series: [{
                type: 'line', data: row.trend7d, smooth: true, symbol: 'none',
                lineStyle: { width: 1.5, color: isUp ? '#f5222d' : '#52c41a' },
                areaStyle: {
                  color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
                    { offset: 0, color: isUp ? 'rgba(245,34,45,0.12)' : 'rgba(82,196,26,0.12)' },
                    { offset: 1, color: 'rgba(255,255,255,0)' },
                  ] },
                },
              }],
            }}
            style={{ height: 30 }}
          />
        );
      },
    },
  ];

  const futuresColumns = [
    { title: '合约', dataIndex: 'contract', key: 'contract', width: 100, render: (v: string) => <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{v}</span> },
    { title: '交易所', dataIndex: 'exchange', key: 'exchange', width: 80 },
    { title: '品种', dataIndex: 'product', key: 'product', width: 80 },
    {
      title: '最新价', dataIndex: 'latestPrice', key: 'latestPrice', width: 110,
      render: (v: number, r: { unit: string }) => (
        <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{v.toLocaleString()} <span style={{ color: '#bfbfbf', fontSize: 12, fontWeight: 400 }}>{r.unit}</span></span>
      ),
    },
    { title: '涨跌', dataIndex: 'change', key: 'change', width: 100, render: (v: number) => <PriceChangeTag value={v} /> },
    { title: '涨跌幅', dataIndex: 'changePercent', key: 'changePercent', width: 100, render: (v: number) => <PriceChangeTag value={v} percent /> },
    { title: '持仓量', dataIndex: 'openInterest', key: 'openInterest', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '成交量', dataIndex: 'volume', key: 'volume', width: 100, render: (v: number) => v.toLocaleString() },
  ];

  if (loading) return <PageLoading />;

  const stages = [...new Set(chainPrices.map((p) => p.stage))];

  return (
    <div>
      {/* 国内现货价格 */}
      <div style={{ ...CARD, background: '#fff' }}>
        <div style={{ ...CARD_BODY, paddingBottom: 0 }}>
          <div style={SECTION}>国内现货价格</div>
        </div>
        <Table
          columns={spotColumns}
          dataSource={spotPrices.map((p) => ({ ...p, key: p.id }))}
          size="small"
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* 期货价格 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP }}>
        <div style={{ ...CARD_BODY, paddingBottom: 0 }}>
          <div style={SECTION}>期货价格</div>
        </div>
        <Table
          columns={futuresColumns}
          dataSource={futuresPrices.map((p) => ({ ...p, key: p.id }))}
          size="small"
          pagination={false}
        />
      </div>

      {/* 产业链价格传导 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP }}>
        <div style={CARD_BODY}>
          <div style={SECTION}>产业链价格传导</div>
          <Row gutter={20}>
            {stages.map((stage) => (
              <Col key={stage} flex={1}>
                <Tag color={STAGE_COLORS[stage] || 'blue'} style={{ fontSize: 12, marginBottom: 12, borderRadius: 4 }}>{stage}</Tag>
                {chainPrices
                  .filter((p) => p.stage === stage)
                  .map((p) => (
                    <div key={p.name} style={{
                      marginBottom: 10,
                      padding: '12px 14px',
                      background: '#fafafa',
                      borderRadius: 8,
                      border: '1px solid #f0f0f0',
                    }}>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>{p.name}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>{p.price.toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: '#bfbfbf' }}>{p.unit}</span>
                      </div>
                      <PriceChangeTag value={p.changePercent} percent />
                    </div>
                  ))}
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PriceManagement;
