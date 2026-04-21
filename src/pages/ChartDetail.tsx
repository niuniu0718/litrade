import React, { useEffect, useMemo, useState } from 'react';
import { Card, Select, Row, Col, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useMarketStore } from '../stores/marketStore';
import { PRODUCT_MAP } from '../data/products';

// 只有碳酸锂有期货数据，固定品种
const FIXED_PRODUCT = 'li2co3_battery' as const;

const ChartDetail: React.FC = () => {
  const [range, setRange] = useState(180);
  const [maLines, setMaLines] = useState<number[]>([5, 10, 20]);
  const [showBoll, setShowBoll] = useState(true);

  const { priceHistories, fetchPriceHistory } = useMarketStore();
  const product = FIXED_PRODUCT;
  const history = priceHistories[product];
  const sliced = useMemo(() => history?.slice(-range) ?? [], [history, range]);
  const productInfo = PRODUCT_MAP[product];

  useEffect(() => {
    fetchPriceHistory(product);
  }, []);

  // 计算 MA
  const calcMA = (data: { close: number }[], dayCount: number) => {
    return data.map((_, i) => {
      if (i < dayCount - 1) return null;
      const sum = data.slice(i - dayCount + 1, i + 1).reduce((a, b) => a + b.close, 0);
      return Math.round((sum / dayCount) * 100) / 100;
    });
  };

  // 计算布林带
  const calcBoll = (data: { close: number }[], n = 20) => {
    const mid = calcMA(data, n);
    const upper = data.map((_, i) => {
      if (i < n - 1) return null;
      const slice = data.slice(i - n + 1, i + 1);
      const avg = mid[i]!;
      const std = Math.sqrt(slice.reduce((s, d) => s + (d.close - avg) ** 2, 0) / n);
      return Math.round((avg + 2 * std) * 100) / 100;
    });
    const lower = data.map((_, i) => {
      if (i < n - 1) return null;
      const avg = mid[i]!;
      const slice = data.slice(i - n + 1, i + 1);
      const std = Math.sqrt(slice.reduce((s, d) => s + (d.close - avg) ** 2, 0) / n);
      return Math.round((avg - 2 * std) * 100) / 100;
    });
    return { mid, upper, lower };
  };

  const boll = useMemo(() => calcBoll(sliced), [sliced]);

  const klineOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: { color: '#1a1a2e', fontSize: 13 },
    },
    legend: {
      data: [
        'K线',
        ...maLines.map((n) => `MA${n}`),
        ...(showBoll ? ['BOLL上', 'BOLL中', 'BOLL下'] : []),
      ],
      top: 0,
      itemWidth: 16,
      itemHeight: 2,
      textStyle: { fontSize: 12, color: '#6b7280' },
    },
    grid: [
      { top: 40, left: 65, right: 20, height: '55%' },
      { top: '72%', left: 65, right: 20, height: '15%' },
    ],
    xAxis: [
      {
        type: 'category',
        data: sliced.map((p) => p.date),
        gridIndex: 0,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#9ca3af', fontSize: 11 },
      },
      {
        type: 'category',
        data: sliced.map((p) => p.date),
        gridIndex: 1,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#9ca3af', fontSize: 11 },
      },
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        gridIndex: 0,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
        axisLabel: { color: '#9ca3af', fontSize: 11 },
      },
      {
        type: 'value',
        scale: true,
        gridIndex: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
        axisLabel: { color: '#9ca3af', fontSize: 11 },
      },
    ],
    series: [
      {
        name: 'K线',
        type: 'candlestick',
        data: sliced.map((p) => [p.open, p.close, p.low, p.high]),
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          color: '#f5222d',
          color0: '#52c41a',
          borderColor: '#f5222d',
          borderColor0: '#52c41a',
        },
      },
      ...maLines.map((n) => ({
        name: `MA${n}`,
        type: 'line',
        data: calcMA(sliced, n),
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1 },
        xAxisIndex: 0,
        yAxisIndex: 0,
      })),
      ...(showBoll
        ? [
            { name: 'BOLL上', type: 'line', data: boll.upper, symbol: 'none', lineStyle: { width: 1, type: 'dashed', color: '#999' }, xAxisIndex: 0, yAxisIndex: 0 },
            { name: 'BOLL中', type: 'line', data: boll.mid, symbol: 'none', lineStyle: { width: 1, color: '#0064ff' }, xAxisIndex: 0, yAxisIndex: 0 },
            { name: 'BOLL下', type: 'line', data: boll.lower, symbol: 'none', lineStyle: { width: 1, type: 'dashed', color: '#999' }, xAxisIndex: 0, yAxisIndex: 0 },
          ]
        : []),
      {
        name: '成交量',
        type: 'bar',
        data: sliced.map((p) => p.volume),
        xAxisIndex: 1,
        yAxisIndex: 1,
        itemStyle: { color: '#0064ff', opacity: 0.5 },
      },
    ],
  };

  // 价格区间统计
  const last = sliced[sliced.length - 1];
  const periodHigh = Math.max(...sliced.map((p) => p.high));
  const periodLow = Math.min(...sliced.map((p) => p.low));
  const avgPrice = Math.round(sliced.reduce((s, p) => s + p.close, 0) / sliced.length);
  const volatility = (() => {
    if (sliced.length < 2) return 0;
    const returns = sliced.slice(1).map((p, i) => (p.close - sliced[i].close) / sliced[i].close);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const std = Math.sqrt(returns.reduce((s, r) => s + (r - mean) ** 2, 0) / returns.length);
    return Math.round(std * 100 * 100) / 100;
  })();

  return (
    <div>
      {/* 品种名称 + 控制面板 */}
      <Card
        style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        styles={{ body: { padding: '14px 20px' } }}
      >
        <Row gutter={16} align="middle">
          <Col>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>
              电池级碳酸锂
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>
              K线详情
            </span>
          </Col>
          <Col>
            <Select
              value={range}
              onChange={setRange}
              options={[
                { label: '1月', value: 22 },
                { label: '3月', value: 66 },
                { label: '6月', value: 132 },
                { label: '1年', value: 252 },
              ]}
              style={{ width: 100 }}
            />
          </Col>
          <Col>
            <Select
              mode="multiple"
              value={maLines}
              onChange={setMaLines}
              options={[5, 10, 20, 60].map((n) => ({ label: `MA${n}`, value: n }))}
              style={{ minWidth: 180 }}
              placeholder="均线"
            />
          </Col>
          <Col>
            <Select
              value={showBoll ? 'on' : 'off'}
              onChange={(v) => setShowBoll(v === 'on')}
              options={[
                { label: '布林带 开', value: 'on' },
                { label: '布林带 关', value: 'off' },
              ]}
              style={{ width: 120 }}
            />
          </Col>
        </Row>
      </Card>

      {/* K线图 */}
      <Card
        style={{ marginTop: 16, borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        styles={{ body: { padding: '12px 16px' } }}
      >
        <ReactECharts option={klineOption} style={{ height: 500 }} />
      </Card>

      {/* 价格区间统计 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Statistic title="最新价" value={last?.close ?? 0} suffix={productInfo?.unit} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Statistic title="区间最高" value={periodHigh} suffix={productInfo?.unit} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Statistic title="区间最低" value={periodLow} suffix={productInfo?.unit} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={3}>
          <Card style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Statistic title="均价" value={avgPrice} />
          </Card>
        </Col>
        <Col span={3}>
          <Card style={{ borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Statistic title="波动率" value={volatility} suffix="%" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChartDetail;
