import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Table, Row, Col, Tag, Select } from 'antd';
import ReactECharts from 'echarts-for-react';
import { usePriceStore } from '../stores/priceStore';
import { useMarketStore } from '../stores/marketStore';
import PriceChangeTag from '../components/PriceChangeTag';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, TEXT } from '../utils/styles';
import type { SpotCategory } from '../types/price';
import { SPOT_CATEGORY_CONFIG } from '../types/price';
import { PRODUCT_MAP } from '../data/products';

const STAGE_COLORS: Record<string, string> = {
  '矿石': '#0064FF',
  '锂盐': '#722ED1',
  '正极': '#FAAD14',
  '电池': '#00C86E',
};

const CATEGORY_KEYS: SpotCategory[] = ['lithium_carbonate', 'lithium_hydroxide', 'spodumene'];

const PriceManagement: React.FC = () => {
  const { spotPrices, intlSpotPrices, futuresPrices, chainPrices, loading, fetchAll } = usePriceStore();
  const { priceHistories, fetchPriceHistory } = useMarketStore();
  const [category, setCategory] = useState<SpotCategory>('lithium_carbonate');

  useEffect(() => { fetchAll(); }, []);

  // K线数据（只有碳酸锂有K线，固定品种）
  const klineProduct = 'li2co3_battery';
  const klineHistory = priceHistories[klineProduct];

  useEffect(() => {
    if (!klineHistory) {
      fetchPriceHistory(klineProduct);
    }
  }, [klineHistory, fetchPriceHistory]);

  const [klineRange, setKlineRange] = useState(180);
  const sliced = useMemo(() => klineHistory?.slice(-klineRange) ?? [], [klineHistory, klineRange]);

  const calcMA = (data: { close: number }[], dayCount: number) =>
    data.map((_, i) => {
      if (i < dayCount - 1) return null;
      const sum = data.slice(i - dayCount + 1, i + 1).reduce((a, b) => a + b.close, 0);
      return Math.round((sum / dayCount) * 100) / 100;
    });

  const klineOption = useMemo(() => {
    if (!sliced.length) return {};
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' as const }, backgroundColor: 'rgba(255,255,255,0.96)', borderColor: '#E8E8E8', borderWidth: 1, textStyle: { color: '#1F1F1F', fontSize: 13 } },
      legend: { data: ['K线', 'MA5', 'MA10', 'MA20'], top: 0, itemWidth: 16, itemHeight: 2, textStyle: { fontSize: 12, color: '#8C8C8C' } },
      grid: [
        { top: 40, left: 65, right: 20, height: '55%' },
        { top: '72%', left: 65, right: 20, height: '15%' },
      ],
      xAxis: [
        { type: 'category', data: sliced.map((p) => p.date), gridIndex: 0, axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { color: '#8C8C8C', fontSize: 11 } },
        { type: 'category', data: sliced.map((p) => p.date), gridIndex: 1, axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { color: '#8C8C8C', fontSize: 11 } },
      ],
      yAxis: [
        { type: 'value', scale: true, gridIndex: 0, axisLine: { show: false }, axisTick: { show: false }, splitLine: CHART_SPLIT_LINE, axisLabel: { color: '#8C8C8C', fontSize: 11 } },
        { type: 'value', scale: true, gridIndex: 1, axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#F0F0F0' } }, axisLabel: { color: '#8C8C8C', fontSize: 11 } },
      ],
      series: [
        { name: 'K线', type: 'candlestick', data: sliced.map((p) => [p.open, p.close, p.low, p.high]), xAxisIndex: 0, yAxisIndex: 0, itemStyle: { color: '#FF4D4F', color0: '#00C86E', borderColor: '#FF4D4F', borderColor0: '#00C86E' } },
        { name: 'MA5', type: 'line', data: calcMA(sliced, 5), smooth: true, symbol: 'none', lineStyle: { width: 1, color: '#FAAD14' }, xAxisIndex: 0, yAxisIndex: 0 },
        { name: 'MA10', type: 'line', data: calcMA(sliced, 10), smooth: true, symbol: 'none', lineStyle: { width: 1, color: '#0064FF' }, xAxisIndex: 0, yAxisIndex: 0 },
        { name: 'MA20', type: 'line', data: calcMA(sliced, 20), smooth: true, symbol: 'none', lineStyle: { width: 1, color: '#722ED1' }, xAxisIndex: 0, yAxisIndex: 0 },
        { name: '成交量', type: 'bar', data: sliced.map((p) => p.volume), xAxisIndex: 1, yAxisIndex: 1, itemStyle: { color: '#0064FF', opacity: 0.5 } },
      ],
    };
  }, [sliced]);

  // ─── 品类 tab 切换 ───
  const categoryTabs = (
    <Tabs
      activeKey={category}
      onChange={(key) => setCategory(key as SpotCategory)}
      size="small"
      items={CATEGORY_KEYS.map((key) => ({
        key,
        label: SPOT_CATEGORY_CONFIG[key].label,
      }))}
      style={{ marginBottom: 12 }}
    />
  );

  // ─── 迷你走势 ───
  const sparkLine = (row: { trend7d: number[]; change: number }) => {
    if (row.trend7d.length < 2) return '-';
    const isUp = row.change >= 0;
    return (
      <ReactECharts
        option={{
          grid: { top: 2, bottom: 2, left: 0, right: 0 },
          xAxis: { show: false, type: 'category', data: row.trend7d.map((_: number, i: number) => i) },
          yAxis: { show: false, type: 'value', min: 'dataMin' },
          series: [{
            type: 'line', data: row.trend7d, smooth: true, symbol: 'none',
            lineStyle: { width: 1.5, color: isUp ? '#FF4D4F' : '#00C86E' },
            areaStyle: {
              color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
                { offset: 0, color: isUp ? 'rgba(255,77,79,0.12)' : 'rgba(0,200,110,0.12)' },
                { offset: 1, color: 'rgba(255,255,255,0)' },
              ] },
            },
          }],
        }}
        style={{ height: 30 }}
      />
    );
  };

  // ─── 国内现货列 ───
  const domesticColumns = [
    { title: '品种', dataIndex: 'name', key: 'name', width: 140, render: (v: string) => <span style={{ fontWeight: 600, color: TEXT.primary }}>{v}</span> },
    { title: '价格', dataIndex: 'price', key: 'price', width: 120, render: (v: number, r: { unit: string }) => <span style={{ fontWeight: 700, color: TEXT.primary }}>{v.toLocaleString()} <span style={{ color: TEXT.secondary, fontSize: 12 }}>{r.unit}</span></span> },
    { title: '涨跌', dataIndex: 'change', key: 'change', width: 80, render: (v: number) => <PriceChangeTag value={v} /> },
    { title: '涨跌幅', dataIndex: 'changePercent', key: 'changePercent', width: 80, render: (v: number) => <PriceChangeTag value={v} percent /> },
    { title: '7日走势', key: 'trend', width: 100, render: (_: unknown, row: { trend7d: number[]; change: number }) => sparkLine(row) },
  ];

  // ─── 国际现货列 ───
  const intlColumns = [
    { title: '品种', dataIndex: 'name', key: 'name', width: 140, render: (v: string) => <span style={{ fontWeight: 600, color: TEXT.primary }}>{v}</span> },
    { title: '价格', dataIndex: 'price', key: 'price', width: 110, render: (v: number, r: { unit: string }) => <span style={{ fontWeight: 700, color: TEXT.primary }}>{v.toLocaleString()} <span style={{ color: TEXT.secondary, fontSize: 12 }}>{r.unit}</span></span> },
    { title: '涨跌', dataIndex: 'change', key: 'change', width: 80, render: (v: number) => <PriceChangeTag value={v} /> },
    { title: '涨跌幅', dataIndex: 'changePercent', key: 'changePercent', width: 80, render: (v: number) => <PriceChangeTag value={v} percent /> },
    { title: '7日走势', key: 'trend', width: 100, render: (_: unknown, row: { trend7d: number[]; change: number }) => sparkLine(row) },
  ];

  // ─── 期货列 ───
  const futuresColumns = [
    { title: '合约', dataIndex: 'contract', key: 'contract', width: 100, render: (v: string) => <span style={{ fontWeight: 600, color: TEXT.primary }}>{v}</span> },
    { title: '交易所', dataIndex: 'exchange', key: 'exchange', width: 80 },
    { title: '品种', dataIndex: 'product', key: 'product', width: 80 },
    { title: '最新价', dataIndex: 'latestPrice', key: 'latestPrice', width: 110, render: (v: number, r: { unit: string }) => <span style={{ fontWeight: 700, color: TEXT.primary }}>{v.toLocaleString()} <span style={{ color: TEXT.secondary, fontSize: 12 }}>{r.unit}</span></span> },
    { title: '涨跌', dataIndex: 'change', key: 'change', width: 80, render: (v: number) => <PriceChangeTag value={v} /> },
    { title: '涨跌幅', dataIndex: 'changePercent', key: 'changePercent', width: 80, render: (v: number) => <PriceChangeTag value={v} percent /> },
    { title: '持仓量', dataIndex: 'openInterest', key: 'openInterest', width: 90, render: (v: number) => v.toLocaleString() },
    { title: '成交量', dataIndex: 'volume', key: 'volume', width: 90, render: (v: number) => v.toLocaleString() },
  ];

  if (loading) return <PageLoading />;

  const filteredDomestic = spotPrices.filter((p) => p.category === category);
  const filteredIntl = intlSpotPrices.filter((p) => p.category === category);
  const stages = [...new Set(chainPrices.map((p) => p.stage))];

  const last = sliced[sliced.length - 1];
  const periodHigh = sliced.length ? Math.max(...sliced.map((p) => p.high)) : 0;
  const periodLow = sliced.length ? Math.min(...sliced.map((p) => p.low)) : 0;
  const avgPrice = sliced.length ? Math.round(sliced.reduce((s, p) => s + p.close, 0) / sliced.length) : 0;
  const productInfo = PRODUCT_MAP[klineProduct];

  return (
    <div>
      {/* ═══ 现货价格：品类 tab + 左右分栏 ═══ */}
      <div style={{ ...CARD, ...CARD_BODY }}>
        {categoryTabs}
        <Row gutter={GAP}>
          {/* 左：国内现货 */}
          <Col xs={24} lg={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: TEXT.primary }}>国内现货</span>
              <Tag style={{ margin: 0, background: 'rgba(0,100,255,0.08)', color: '#0064FF', borderRadius: 4, fontSize: 10 }}>SMM</Tag>
            </div>
            <Table
              columns={domesticColumns}
              dataSource={filteredDomestic.map((p) => ({ ...p, key: p.id }))}
              size="small"
              pagination={false}
              scroll={{ y: 260 }}
            />
          </Col>
          {/* 右：国际现货 */}
          <Col xs={24} lg={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: TEXT.primary }}>国际现货</span>
              <Tag style={{ margin: 0, background: 'rgba(250,173,20,0.1)', color: '#FAAD14', borderRadius: 4, fontSize: 10 }}>FastMarkets</Tag>
            </div>
            <Table
              columns={intlColumns}
              dataSource={filteredIntl.map((p) => ({ ...p, key: p.id }))}
              size="small"
              pagination={false}
              scroll={{ y: 260 }}
            />
          </Col>
        </Row>
      </div>

      {/* ═══ 期货价格（碳酸锂） ═══ */}
      <div style={{ ...CARD, marginTop: GAP }}>
        <div style={{ ...CARD_BODY, paddingBottom: 0 }}>
          <div style={SECTION}>碳酸锂期货（广期所）</div>
        </div>
        <Table
          columns={futuresColumns}
          dataSource={futuresPrices.map((p) => ({ ...p, key: p.id }))}
          size="small"
          pagination={false}
        />
      </div>

      {/* ═══ K线图 ═══ */}
      <div style={{ ...CARD, marginTop: GAP, ...CARD_BODY }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={SECTION}>
            碳酸锂 K线
          </div>
          <Select
            value={klineRange}
            onChange={setKlineRange}
            options={[
              { label: '1月', value: 22 },
              { label: '3月', value: 66 },
              { label: '6月', value: 132 },
              { label: '1年', value: 252 },
            ]}
            style={{ width: 100 }}
          />
        </div>
        {sliced.length > 0 ? (
          <ReactECharts option={klineOption} style={{ height: 420 }} />
        ) : (
          <div style={{ textAlign: 'center', padding: 60, color: TEXT.secondary }}>加载K线数据中...</div>
        )}
      </div>
      {sliced.length > 0 && (
        <Row gutter={GAP} style={{ marginTop: GAP }}>
          <Col span={6}>
            <div style={{ ...CARD, ...CARD_BODY }}>
              <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 4 }}>最新价</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: TEXT.primary }}>{last?.close?.toLocaleString() ?? 0} <span style={{ fontSize: 11, color: TEXT.secondary }}>{productInfo?.unit}</span></div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ ...CARD, ...CARD_BODY }}>
              <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 4 }}>区间最高</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#FF4D4F' }}>{periodHigh.toLocaleString()}</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ ...CARD, ...CARD_BODY }}>
              <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 4 }}>区间最低</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#00C86E' }}>{periodLow.toLocaleString()}</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ ...CARD, ...CARD_BODY }}>
              <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 4 }}>区间均价</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: TEXT.primary }}>{avgPrice.toLocaleString()}</div>
            </div>
          </Col>
        </Row>
      )}

      {/* ═══ 产业链价格传导 ═══ */}
      <div style={{ ...CARD, marginTop: GAP, ...CARD_BODY }}>
        <div style={SECTION}>产业链价格传导</div>
        <Row gutter={GAP}>
          {stages.map((stage) => (
            <Col key={stage} flex={1}>
              <Tag style={{ background: `${STAGE_COLORS[stage] || '#0064FF'}14`, color: STAGE_COLORS[stage] || '#0064FF', fontSize: 12, marginBottom: 12, borderRadius: 4, border: 'none' }}>{stage}</Tag>
              {chainPrices
                .filter((p) => p.stage === stage)
                .map((p) => (
                  <div key={p.name} style={{ marginBottom: 10, padding: '12px 14px', background: '#FAFAFA', borderRadius: 8, border: '1px solid #F0F0F0' }}>
                    <div style={{ fontSize: 12, color: TEXT.secondary, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: TEXT.primary }}>{p.price.toLocaleString()}</span>
                      <span style={{ fontSize: 11, color: TEXT.secondary }}>{p.unit}</span>
                    </div>
                    <PriceChangeTag value={p.changePercent} percent />
                  </div>
                ))}
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default PriceManagement;
