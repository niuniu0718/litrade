import React from 'react';
import ReactECharts from 'echarts-for-react';

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  trend?: number[];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, change, trend, prefix, suffix }) => {
  const isUp = change !== undefined && change >= 0;
  const trendColor = change !== undefined ? (isUp ? '#f5222d' : '#52c41a') : '#0064ff';

  const sparkOption = trend && trend.length > 1 ? {
    grid: { top: 2, bottom: 2, left: 0, right: 0 },
    xAxis: { show: false, type: 'category' as const, data: trend.map((_, i) => i) },
    yAxis: { show: false, type: 'value' as const, min: 'dataMin' as const },
    series: [{
      type: 'line' as const,
      data: trend,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 1.5, color: trendColor },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: isUp ? 'rgba(245,34,45,0.12)' : 'rgba(82,196,26,0.12)' },
            { offset: 1, color: 'rgba(255,255,255,0)' },
          ],
        },
      },
    }],
  } : null;

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 10,
        padding: '18px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{title}</span>
        {change !== undefined && (
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: isUp ? '#f5222d' : '#52c41a',
            background: isUp ? 'rgba(245,34,45,0.06)' : 'rgba(82,196,26,0.06)',
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            {isUp ? '+' : ''}{change.toFixed(1)}%
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {prefix}
        <span style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', letterSpacing: -0.5 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span style={{ fontSize: 12, color: '#9ca3af' }}>{unit}</span>}
        {suffix}
      </div>
      {sparkOption && (
        <div style={{ marginTop: 8 }}>
          <ReactECharts option={sparkOption} style={{ height: 36 }} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
