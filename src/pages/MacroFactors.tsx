import React, { useEffect, useMemo } from 'react';
import { Row, Col, Tag, Table, Tabs, Progress, Timeline } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useMacroStore } from '../stores/macroStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, CHART_LEGEND, COLORS } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, GLASS_HIGHLIGHT, TEXT } from '../utils/styles';

const impactMap: Record<string, { label: string; color: string; bg: string }> = {
  positive: { label: '利多', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  negative: { label: '利空', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  neutral: { label: '中性', color: '#4f8cff', bg: 'rgba(79,140,255,0.12)' },
};

const importanceMap: Record<string, { label: string; color: string }> = {
  high: { label: '高', color: '#ef4444' },
  medium: { label: '中', color: '#f59e0b' },
  low: { label: '低', color: '#4f8cff' },
};

const glassCard: React.CSSProperties = { ...CARD, borderRadius: 14 };

// ═══════════════════════════════════════════
// Tab 1: 市场情绪
// ═══════════════════════════════════════════
const SentimentTab: React.FC = () => {
  const { capitalFlows, qualitativeIndicators, sentiment } = useMacroStore();

  const flowOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    grid: { top: 20, right: 20, bottom: 30, left: 80 },
    xAxis: { type: 'value', name: '亿元', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE },
    yAxis: { type: 'category', data: capitalFlows.map((f) => f.sector), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { fontSize: 12, color: '#8892b0' } },
    series: [{ type: 'bar', data: capitalFlows.map((f, i) => ({ value: f.netInflow, itemStyle: { color: f.netInflow >= 0 ? COLORS[i % COLORS.length] : '#ef4444' } })), barWidth: '50%' }],
  }), [capitalFlows]);

  const macroColumns = [
    {
      title: '类别', dataIndex: 'category', key: 'category', width: 80,
      render: (v: string) => {
        const map: Record<string, { label: string; color: string }> = { politics: { label: '政治', color: 'purple' }, geopolitics: { label: '地缘', color: 'red' }, currency: { label: '货币', color: 'blue' }, trade: { label: '贸易', color: 'orange' } };
        const c = map[v] || { label: v, color: 'default' };
        return <Tag color={c.color}>{c.label}</Tag>;
      },
    },
    { title: '指标', dataIndex: 'name', key: 'name', width: 140, render: (v: string) => <span style={{ fontWeight: 600, color: TEXT.primary }}>{v}</span> },
    { title: '现状', dataIndex: 'value', key: 'value', width: 100 },
    {
      title: '趋势', dataIndex: 'trend', key: 'trend', width: 80,
      render: (v: string) => {
        const map: Record<string, { color: string; label: string }> = { positive: { color: 'green', label: '利好' }, negative: { color: 'red', label: '利空' }, neutral: { color: 'default', label: '中性' } };
        const t = map[v] || { color: 'default', label: v };
        return <Tag color={t.color}>{t.label}</Tag>;
      },
    },
    {
      title: '影响', dataIndex: 'impact', key: 'impact', width: 80,
      render: (v: string) => {
        const map: Record<string, { color: string; label: string }> = { high: { color: 'red', label: '高' }, medium: { color: 'orange', label: '中' }, low: { color: 'blue', label: '低' } };
        const t = map[v] || { color: 'default', label: v };
        return <Tag color={t.color}>{t.label}</Tag>;
      },
    },
    { title: '说明', dataIndex: 'description', key: 'description' },
  ];

  if (!sentiment) return null;

  return (
    <div>
      {/* 情绪仪表盘 + 资金流向 */}
      <Row gutter={GAP}>
        <Col xs={24} lg={8}>
          <div style={{ ...glassCard, ...CARD_BODY, height: '100%' }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={SECTION}>市场情绪</div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Progress
                type="dashboard"
                percent={sentiment.heatIndex}
                size={140}
                strokeColor={sentiment.heatIndex > 60 ? '#f5222d' : sentiment.heatIndex > 40 ? '#f59e0b' : '#52c41a'}
                format={(p) => <div><div style={{ fontSize: 24, fontWeight: 700, color: TEXT.primary }}>{p}</div><div style={{ fontSize: 11, color: '#8892b0' }}>热度指数</div></div>}
              />
            </div>
            <Row gutter={16}>
              <Col span={8}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700, color: TEXT.primary }}>{sentiment.bullBearRatio}</div><div style={{ fontSize: 11, color: '#8892b0' }}>多空比</div></div></Col>
              <Col span={8}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700, color: sentiment.sentimentScore >= 0 ? '#ef4444' : '#10b981' }}>{sentiment.sentimentScore}</div><div style={{ fontSize: 11, color: '#8892b0' }}>情绪分</div></div></Col>
              <Col span={8}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700, color: TEXT.primary }}>{sentiment.newsCount24h}</div><div style={{ fontSize: 11, color: '#8892b0' }}>24h新闻</div></div></Col>
            </Row>
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sentiment.hotWords.map((w) => <Tag key={w} style={{ margin: 0, borderRadius: 4 }}>{w}</Tag>)}
            </div>
          </div>
        </Col>
        <Col xs={24} lg={16}>
          <div style={{ ...glassCard, ...CARD_BODY, height: '100%' }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={SECTION}>板块资金流向</div>
            <ReactECharts option={flowOption} style={{ height: 340 }} />
          </div>
        </Col>
      </Row>

      {/* 定性宏观指标 */}
      <div style={{ ...glassCard, marginTop: GAP }}>
        <div style={{ ...CARD_BODY, paddingBottom: 0 }}>
          <div style={SECTION}>定性宏观指标</div>
        </div>
        <Table
          columns={macroColumns}
          dataSource={qualitativeIndicators.map((m, i) => ({ ...m, key: `qual-${i}` }))}
          size="small"
          pagination={false}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// Tab 2: 宏观因子
// ═══════════════════════════════════════════
const MacroFactorsTab: React.FC = () => {
  const { radar, indicators, priceCorrelation } = useMacroStore();

  const radarChartOption = useMemo(() => ({
    tooltip: {},
    radar: {
      indicator: radar.map((d) => ({ name: d.dimension, max: 100 })),
      shape: 'circle' as const,
      splitNumber: 4,
      axisName: { color: '#8892b0', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
      splitArea: { areaStyle: { color: ['rgba(79,140,255,0.02)', 'rgba(79,140,255,0.04)', 'rgba(79,140,255,0.02)', 'rgba(79,140,255,0.04)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: radar.map((d) => d.score),
        name: '当前状态',
        areaStyle: { color: 'rgba(79,140,255,0.15)' },
        lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 },
        itemStyle: { color: '#4f8cff' },
      }],
    }],
  }), [radar]);

  const correlationOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['碳酸锂价格', '美元指数'] },
    grid: { top: 40, right: 60, bottom: 30, left: 70 },
    xAxis: { type: 'category', data: priceCorrelation.map((d) => d.month), axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: '价格(元/吨)', nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '美元指数', position: 'right' as const, nameTextStyle: { color: '#8892b0', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '碳酸锂价格', type: 'line', data: priceCorrelation.map((d) => d.liPrice), smooth: true, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 }, itemStyle: { color: '#4f8cff' } },
      { name: '美元指数', type: 'line', yAxisIndex: 1, data: priceCorrelation.map((d) => d.macroValue), smooth: true, symbol: 'diamond', symbolSize: 5, lineStyle: { color: '#ef4444', width: 2, shadowColor: '#ef4444', shadowBlur: 4 }, itemStyle: { color: '#ef4444' } },
    ],
  }), [priceCorrelation]);

  return (
    <div>
      <Row gutter={GAP}>
        {/* 雷达图 */}
        <Col xs={24} lg={10}>
          <div style={{ ...glassCard, ...CARD_BODY }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={SECTION}>宏观因子雷达</div>
            <ReactECharts option={radarChartOption} style={{ height: 300 }} />
          </div>
        </Col>

        {/* 关键指标卡片 */}
        <Col xs={24} lg={14}>
          <div style={{ ...glassCard, ...CARD_BODY }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={SECTION}>关键宏观指标</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {indicators.map((ind) => {
                const imp = impactMap[ind.impact] || impactMap.neutral;
                return (
                  <div key={ind.key} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: TEXT.secondary }}>{ind.name}</span>
                      <Tag style={{ fontSize: 10, margin: 0, lineHeight: '16px', padding: '0 4px', background: imp.bg, color: imp.color }}>{imp.label}</Tag>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: TEXT.primary }}>{ind.value}</span>
                      <span style={{ fontSize: 11, color: TEXT.secondary }}>{ind.unit}</span>
                      {ind.change !== 0 && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: ind.change >= 0 ? '#ef4444' : '#10b981', marginLeft: 4 }}>
                          {ind.change >= 0 ? '+' : ''}{ind.change}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>

      {/* 宏观-价格相关性 */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>碳酸锂价格 vs 美元指数</div>
        <ReactECharts option={correlationOption} style={{ height: 350 }} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// Tab 3: 研究与日历
// ═══════════════════════════════════════════
const ResearchCalendarTab: React.FC = () => {
  const { reports, calendar } = useMacroStore();

  return (
    <div>
      {/* 研究报告 */}
      <div style={{ ...glassCard, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>研究报告</div>
        <Row gutter={[20, 16]}>
          {reports.map((r) => (
            <Col xs={24} lg={12} key={r.id}>
              <div style={{
                padding: '16px 20px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                height: '100%',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEXT.primary, flex: 1, lineHeight: 1.4 }}>{r.title}</span>
                  <Tag color={r.importance === 'high' ? 'red' : r.importance === 'medium' ? 'orange' : 'blue'} style={{ marginLeft: 8, flexShrink: 0, borderRadius: 4 }}>
                    {r.importance === 'high' ? '重要' : r.importance === 'medium' ? '中等' : '一般'}
                  </Tag>
                </div>
                <div style={{ fontSize: 12, color: TEXT.secondary, lineHeight: 1.6, marginBottom: 10 }}>{r.summary}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: TEXT.secondary }}>
                  <span>{r.source}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 宏观日历 */}
      <div style={{ ...glassCard, marginTop: GAP, ...CARD_BODY }}>
        <div style={GLASS_HIGHLIGHT} />
        <div style={SECTION}>宏观数据日历</div>
        <Timeline
          items={calendar.map((e) => {
            const imp = importanceMap[e.importance] || importanceMap.medium;
            return {
              color: imp.color,
              content: (
                <div style={{ paddingBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: TEXT.primary }}>{e.event}</span>
                      <Tag style={{ fontSize: 10, margin: 0, lineHeight: '16px', padding: '0 4px', background: `${imp.color}15`, color: imp.color }}>{imp.label}</Tag>
                    </div>
                    <span style={{ fontSize: 12, color: TEXT.secondary }}>{e.date}</span>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT.secondary, lineHeight: 1.5 }}>
                    前值: {e.previousValue} | 预期: {e.forecast}
                  </div>
                  <div style={{ fontSize: 11, color: TEXT.secondary, marginTop: 2 }}>{e.impact}</div>
                </div>
              ),
            };
          })}
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// 主页面
// ═══════════════════════════════════════════
const MacroFactors: React.FC = () => {
  const { loading, fetchAll } = useMacroStore();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return <PageLoading />;

  return (
    <Tabs
      defaultActiveKey="sentiment"
      items={[
        { key: 'sentiment', label: '市场情绪', children: <SentimentTab /> },
        { key: 'macro', label: '宏观因子', children: <MacroFactorsTab /> },
        { key: 'research', label: '研究与日历', children: <ResearchCalendarTab /> },
      ]}
    />
  );
};

export default MacroFactors;
