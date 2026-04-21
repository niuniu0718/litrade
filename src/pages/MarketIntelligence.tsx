import React, { useEffect, useMemo } from 'react';
import { Row, Col, Tag, Table, Progress } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useIntelligenceStore } from '../stores/intelligenceStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, COLORS } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP } from '../utils/styles';

const MarketIntelligence: React.FC = () => {
  const { reports, capitalFlows, macroIndicators, sentiment, loading, fetchAll } = useIntelligenceStore();

  useEffect(() => { fetchAll(); }, []);

  const flowOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    grid: { top: 20, right: 20, bottom: 30, left: 80 },
    xAxis: { type: 'value', name: '亿元', nameTextStyle: { color: '#9ca3af', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE },
    yAxis: { type: 'category', data: capitalFlows.map((f) => f.sector), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: { fontSize: 12, color: '#8c8c8c' } },
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
    { title: '指标', dataIndex: 'name', key: 'name', width: 140, render: (v: string) => <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{v}</span> },
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

  if (loading || !sentiment) return <PageLoading />;

  return (
    <div>
      {/* 市场情绪 + 资金流向 */}
      <Row gutter={GAP}>
        <Col xs={24} lg={8}>
          <div style={{ ...CARD, background: '#fff', ...CARD_BODY, height: '100%' }}>
            <div style={SECTION}>市场情绪</div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Progress
                type="dashboard"
                percent={sentiment.heatIndex}
                size={140}
                strokeColor={sentiment.heatIndex > 60 ? '#f5222d' : sentiment.heatIndex > 40 ? '#f59e0b' : '#52c41a'}
                format={(p) => <div><div style={{ fontSize: 24, fontWeight: 700 }}>{p}</div><div style={{ fontSize: 11, color: '#bfbfbf' }}>热度指数</div></div>}
              />
            </div>
            <Row gutter={16}>
              <Col span={8}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>{sentiment.bullBearRatio}</div><div style={{ fontSize: 11, color: '#bfbfbf' }}>多空比</div></div></Col>
              <Col span={8}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700, color: sentiment.sentimentScore >= 0 ? '#f5222d' : '#52c41a' }}>{sentiment.sentimentScore}</div><div style={{ fontSize: 11, color: '#bfbfbf' }}>情绪分</div></div></Col>
              <Col span={8}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>{sentiment.newsCount24h}</div><div style={{ fontSize: 11, color: '#bfbfbf' }}>24h新闻</div></div></Col>
            </Row>
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sentiment.hotWords.map((w) => <Tag key={w} style={{ margin: 0, borderRadius: 4 }}>{w}</Tag>)}
            </div>
          </div>
        </Col>
        <Col xs={24} lg={16}>
          <div style={{ ...CARD, background: '#fff', ...CARD_BODY, height: '100%' }}>
            <div style={SECTION}>板块资金流向</div>
            <ReactECharts option={flowOption} style={{ height: 340 }} />
          </div>
        </Col>
      </Row>

      {/* 宏观指标 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP }}>
        <div style={{ ...CARD_BODY, paddingBottom: 0 }}>
          <div style={SECTION}>宏观指标</div>
        </div>
        <Table
          columns={macroColumns}
          dataSource={macroIndicators.map((m, i) => ({ ...m, key: `macro-${i}` }))}
          size="small"
          pagination={false}
        />
      </div>

      {/* 研究报告 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP, ...CARD_BODY }}>
        <div style={SECTION}>研究报告</div>
        <Row gutter={[20, 16]}>
          {reports.map((r) => (
            <Col xs={24} lg={12} key={r.id}>
              <div style={{
                padding: '16px 20px',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                height: '100%',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', flex: 1, lineHeight: 1.4 }}>{r.title}</span>
                  <Tag color={r.importance === 'high' ? 'red' : r.importance === 'medium' ? 'orange' : 'blue'} style={{ marginLeft: 8, flexShrink: 0, borderRadius: 4 }}>
                    {r.importance === 'high' ? '重要' : r.importance === 'medium' ? '中等' : '一般'}
                  </Tag>
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: 1.6, marginBottom: 10 }}>{r.summary}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#bfbfbf' }}>
                  <span>{r.source}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default MarketIntelligence;
