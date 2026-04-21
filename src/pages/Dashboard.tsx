import React, { useEffect } from 'react';
import { Row, Col, Tag, Timeline } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useDashboardStore } from '../stores/dashboardStore';
import PageLoading from '../components/PageLoading';

const PRODUCT_COLORS: Record<string, string> = {
  li2co3_battery: '#0064ff',
  lioh: '#f59e0b',
  spodumene: '#10b981',
};

const levelColor = (level: string) => {
  if (level === 'critical') return 'red';
  if (level === 'warning') return 'orange';
  return 'blue';
};

/** 顶部指标小卡片 */
const MetricBlock: React.FC<{
  label: string;
  value: number;
  unit: string;
  change?: number;
}> = ({ label, value, unit, change }) => {
  const isUp = change !== undefined && change >= 0;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.2 }}>
        {value.toLocaleString()}
        <span style={{ fontSize: 12, fontWeight: 400, color: '#bfbfbf', marginLeft: 2 }}>{unit}</span>
      </div>
      {change !== undefined && (
        <div style={{
          display: 'inline-block',
          marginTop: 6,
          fontSize: 12,
          fontWeight: 600,
          color: isUp ? '#f5222d' : '#52c41a',
          background: isUp ? 'rgba(245,34,45,0.06)' : 'rgba(82,196,26,0.06)',
          padding: '1px 8px',
          borderRadius: 10,
        }}>
          {isUp ? '+' : ''}{change.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

/** 品种价格卡片 */
const ProductCard: React.FC<{
  name: string;
  product: string;
  currentPrice: number;
  unit: string;
  change: number;
  changePercent: number;
  trend7d: number[];
}> = ({ name, product, currentPrice, unit, change, changePercent, trend7d }) => {
  const isUp = change >= 0;
  const color = PRODUCT_COLORS[product] || '#0064ff';

  const sparkOption = trend7d.length > 1 ? {
    grid: { top: 4, bottom: 4, left: 0, right: 0 },
    xAxis: { show: false, type: 'category' as const, data: trend7d.map((_: number, i: number) => i) },
    yAxis: { show: false, type: 'value' as const, min: 'dataMin' as const },
    series: [{
      type: 'line' as const,
      data: trend7d,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: isUp ? '#f5222d' : '#52c41a' },
      areaStyle: {
        color: {
          type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: isUp ? 'rgba(245,34,45,0.18)' : 'rgba(82,196,26,0.18)' },
            { offset: 1, color: 'rgba(255,255,255,0)' },
          ],
        },
      },
    }],
  } : null;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.25s, transform 0.25s',
      cursor: 'default',
      height: '100%',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ height: 4, background: color }} />
      <div style={{ padding: '20px 24px 18px' }}>
        {/* 标题行 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 500, letterSpacing: 0.5 }}>{name}</span>
          <Tag color={isUp ? 'red' : 'green'} style={{ margin: 0, fontSize: 11, lineHeight: '18px', padding: '0 6px', borderRadius: 4 }}>
            {isUp ? '涨' : '跌'}
          </Tag>
        </div>

        {/* 价格 */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: '#1a1a2e', letterSpacing: -0.5 }}>
            {currentPrice.toLocaleString()}
          </span>
          <span style={{ fontSize: 12, color: '#bfbfbf' }}>{unit}</span>
        </div>

        {/* 涨跌 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: isUp ? '#f5222d' : '#52c41a' }}>
            {isUp ? '↑' : '↓'} {isUp ? '+' : ''}{change.toLocaleString()}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: isUp ? '#f5222d' : '#52c41a' }}>
            {isUp ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>

        {/* 走势图 */}
        {sparkOption && <ReactECharts option={sparkOption} style={{ height: 60 }} />}
      </div>
    </div>
  );
};

/** 底部统计格 */
const StatCell: React.FC<{
  label: string;
  value: number | string;
  unit: string;
  color: string;
  sub?: string;
}> = ({ label, value, unit, color, sub }) => (
  <div style={{
    padding: '16px 20px',
    borderRadius: 8,
    border: '1px solid #f0f0f0',
    background: '#fff',
  }}>
    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 22, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 11, color: '#bfbfbf' }}>{unit}</span>
    </div>
    {sub && <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>{sub}</div>}
  </div>
);

// ────────────── 主页面 ──────────────

const Dashboard: React.FC = () => {
  const { metrics, alerts, trends, keyStats, loading, fetchAll } = useDashboardStore();

  useEffect(() => { fetchAll(); }, []);

  if (loading || !metrics) return <PageLoading />;

  const gap = keyStats ? Math.round((keyStats.globalSupply - keyStats.globalDemand) * 10) / 10 : 0;

  return (
    <div>
      {/* ═══ 顶部指标条 ═══ */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <MetricBlock label="市场热度指数" value={metrics.heatIndex} unit="/ 100" change={metrics.heatChange} />
        <div style={{ width: 1, height: 40, background: '#f0f0f0' }} />
        <MetricBlock label="平均价格水平" value={metrics.avgPriceLevel} unit="元/吨" change={metrics.priceChange} />
        <div style={{ width: 1, height: 40, background: '#f0f0f0' }} />
        <MetricBlock label="预警数量" value={metrics.alertCount} unit="条" />
        <div style={{ width: 1, height: 40, background: '#f0f0f0' }} />
        <MetricBlock label="月度交易量" value={metrics.monthlyVolume} unit="吨" change={metrics.volumeChange} />
      </div>

      {/* ═══ 三品种价格卡片 ═══ */}
      <Row gutter={20} style={{ marginTop: 20 }}>
        {trends.map((t) => (
          <Col xs={24} md={8} key={t.product}>
            <ProductCard {...t} />
          </Col>
        ))}
      </Row>

      {/* ═══ 产业关键数据 ═══ */}
      <div style={{ marginTop: 20 }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          padding: '20px 24px',
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
            产业关键数据
          </div>
          <Row gutter={16}>
            <Col span={6}>
              <StatCell
                label="全球供应量"
                value={keyStats?.globalSupply ?? '-'}
                unit="LCE万吨"
                color="#0064ff"
              />
            </Col>
            <Col span={6}>
              <StatCell
                label="全球需求量"
                value={keyStats?.globalDemand ?? '-'}
                unit="LCE万吨"
                color="#f59e0b"
              />
            </Col>
            <Col span={6}>
              <StatCell
                label="供需缺口"
                value={`${gap > 0 ? '+' : ''}${gap}`}
                unit="LCE万吨"
                color={gap >= 0 ? '#10b981' : '#ef4444'}
                sub={gap >= 0 ? '供给过剩' : '供给不足'}
              />
            </Col>
            <Col span={6}>
              <StatCell
                label="库存天数"
                value={keyStats?.inventoryDays ?? '-'}
                unit="天"
                color="#7c3aed"
                sub={
                  (keyStats?.inventoryDays ?? 0) > 30 ? '库存偏高'
                  : (keyStats?.inventoryDays ?? 0) > 20 ? '库存适中'
                  : '库存偏低'
                }
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* ═══ 最近预警 ═══ */}
      <div style={{
        marginTop: 20,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        padding: '20px 24px',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
          最近预警
        </div>
        <Timeline
          items={alerts.map((a) => ({
            color: a.level === 'critical' ? 'red' : a.level === 'warning' ? 'orange' : 'blue',
            children: (
              <div style={{ paddingBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{a.title}</span>
                  <Tag color={levelColor(a.level)} style={{ fontSize: 11, margin: 0 }}>
                    {a.level === 'critical' ? '严重' : a.level === 'warning' ? '警告' : '信息'}
                  </Tag>
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: 1.6 }}>{a.description}</div>
                <div style={{ fontSize: 11, color: '#bfbfbf', marginTop: 2 }}>{a.source}</div>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );
};

export default Dashboard;
