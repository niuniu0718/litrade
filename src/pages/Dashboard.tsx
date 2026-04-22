import React, { useEffect, useMemo } from 'react';
import { Row, Col, Tag, Timeline } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useDashboardStore } from '../stores/dashboardStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, CHART_LEGEND, gradientArea } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, GLASS_HIGHLIGHT, TEXT } from '../utils/styles';
import type { SignalDirection } from '../types/dashboard';

const PRODUCT_COLORS: Record<string, string> = {
  li2co3_battery: '#4f8cff',
  lioh: '#f59e0b',
  spodumene: '#10b981',
};

const signalConfig: Record<SignalDirection, { label: string; color: string; tagColor: string; bg: string }> = {
  bullish: { label: '偏多', color: '#10b981', tagColor: '#10b981', bg: 'rgba(16,185,129,0.06)' },
  bearish: { label: '偏空', color: '#ef4444', tagColor: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
  neutral: { label: '中性', color: '#f59e0b', tagColor: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
};

const levelColor = (level: string) => {
  if (level === 'critical') return '#ef4444';
  if (level === 'warning') return '#f59e0b';
  return '#4f8cff';
};

// ────────────── 子组件 ──────────────

/** 价格走势迷你图 */
const SparkLine: React.FC<{ data: number[]; color: string; height?: number }> = ({ data, color, height = 50 }) => {
  const option = useMemo(() => ({
    grid: { top: 2, bottom: 2, left: 0, right: 0 },
    xAxis: { show: false, type: 'category' as const, data: data.map((_: number, i: number) => i) },
    yAxis: { show: false, type: 'value' as const, min: 'dataMin' as const },
    series: [{
      type: 'line' as const,
      data,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 1.5, color, shadowColor: color, shadowBlur: 4 },
      areaStyle: gradientArea(color, 0.15),
    }],
  }), [data, color]);

  return <ReactECharts option={option} style={{ height }} />;
};

/** 五维信号条 */
const SignalBar: React.FC<{
  step: number;
  title: string;
  direction: SignalDirection;
  strength: number;
  source: string;
  description: string;
}> = ({ step, title, direction, strength, source, description }) => {
  const cfg = signalConfig[direction];
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%', background: cfg.color,
          boxShadow: `0 0 10px ${cfg.color}44`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>
          {step}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT.primary, flex: 1 }}>{title}</span>
        <span style={{ fontSize: 12, color: TEXT.secondary }}>{source}</span>
        <Tag style={{
          margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 6px',
          background: cfg.bg, color: cfg.tagColor, borderRadius: 4,
        }}>
          {cfg.label}
        </Tag>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 30 }}>
        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${strength}%`, height: '100%', borderRadius: 2, transition: 'width 0.5s',
            background: `linear-gradient(90deg, ${cfg.color}, ${direction === 'bullish' ? '#00d4ff' : direction === 'bearish' ? '#f97316' : '#a855f7'})`,
            boxShadow: `0 0 8px ${cfg.color}44`,
          }} />
        </div>
        <span style={{ fontSize: 11, color: TEXT.secondary, width: 28, textAlign: 'right' }}>{Math.round(strength)}%</span>
      </div>
      <div style={{ fontSize: 12, color: TEXT.secondary, lineHeight: 1.5, marginLeft: 30, marginTop: 4 }}>{description}</div>
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
  const color = PRODUCT_COLORS[product] || '#4f8cff';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.25s',
      cursor: 'default',
      height: '100%',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.boxShadow = `0 0 20px ${color}11`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
      <div style={{ padding: '14px 18px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: TEXT.secondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{name}</span>
          <Tag style={{
            margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 5px', borderRadius: 4,
            background: isUp ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
            color: isUp ? '#ef4444' : '#10b981',
          }}>
            {isUp ? '涨' : '跌'}
          </Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 2 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: TEXT.primary }}>
            {currentPrice.toLocaleString()}
          </span>
          <span style={{ fontSize: 10, color: TEXT.secondary }}>{unit}</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: isUp ? '#ef4444' : '#10b981' }}>
            {isUp ? '+' : ''}{change.toLocaleString()}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: isUp ? '#ef4444' : '#10b981' }}>
            {isUp ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
        <SparkLine data={trend7d} color={isUp ? '#ef4444' : '#10b981'} height={36} />
      </div>
    </div>
  );
};

/** 统计格 */
const StatCell: React.FC<{
  label: string;
  value: number | string;
  unit: string;
  color: string;
  sub?: string;
}> = ({ label, value, unit, color, sub }) => (
  <div style={{
    padding: '12px 14px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(255,255,255,0.02)',
  }}>
    <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: 20, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 10, color: TEXT.secondary }}>{unit}</span>
    </div>
    {sub && <div style={{ fontSize: 10, color: TEXT.secondary, marginTop: 3 }}>{sub}</div>}
  </div>
);

// ────────────── 主页面 ──────────────

const Dashboard: React.FC = () => {
  const { priceOverview, trends, indicators, judgment, alerts, keyStats, loading, fetchAll } = useDashboardStore();

  useEffect(() => { fetchAll(); }, []);

  // 30日价格走势图
  const priceTrendOption = useMemo(() => {
    if (!priceOverview) return {};
    const dates = priceOverview.trend30d.map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    return {
      tooltip: CHART_TOOLTIP,
      grid: { top: 16, right: 12, bottom: 24, left: 60 },
      xAxis: { type: 'category', data: dates, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      series: [{
        type: 'line',
        data: priceOverview.trend30d,
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 6 },
        areaStyle: gradientArea('#4f8cff', 0.15),
      }],
    };
  }, [priceOverview]);

  // 五维雷达图
  const radarOption = useMemo(() => {
    if (!judgment) return {};
    return {
      tooltip: {},
      radar: {
        indicator: judgment.signals.map((s) => ({ name: `Step${s.step}`, max: 100 })),
        shape: 'circle' as const,
        splitNumber: 4,
        radius: '65%',
        axisName: { color: '#8892b0', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
        splitArea: { areaStyle: { color: ['rgba(79,140,255,0.02)', 'rgba(79,140,255,0.04)', 'rgba(79,140,255,0.02)', 'rgba(79,140,255,0.04)'] } },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      series: [{
        type: 'radar',
        data: [{
          value: judgment.signals.map((s) => s.direction === 'bullish' ? 40 + s.strength * 0.6 : s.direction === 'bearish' ? 40 - s.strength * 0.4 : 40),
          name: '信号强度',
          areaStyle: { color: 'rgba(79,140,255,0.15)' },
          lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 },
          itemStyle: { color: '#4f8cff' },
        }],
      }],
    };
  }, [judgment]);

  // 仪表盘 gauge 选项
  const gaugeOption = useMemo(() => {
    if (!judgment) return {};
    const cfg = signalConfig[judgment.overall];
    return {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        radius: '90%',
        center: ['50%', '65%'],
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[0.4, '#ef4444'], [0.6, '#f59e0b'], [1, '#10b981']],
          },
        },
        pointer: { width: 4, length: '60%', itemStyle: { color: '#f0f0f0' } },
        axisTick: { distance: -14, length: 4, lineStyle: { color: 'rgba(255,255,255,0.2)', width: 1 } },
        splitLine: { distance: -14, length: 10, lineStyle: { color: 'rgba(255,255,255,0.3)', width: 2 } },
        axisLabel: { distance: 16, color: '#8892b0', fontSize: 10 },
        detail: {
          valueAnimation: true,
          formatter: `{value}`,
          fontSize: 28,
          fontWeight: 700,
          color: cfg.color,
          offsetCenter: [0, '10%'],
          textShadowColor: cfg.color,
          textShadowBlur: 10,
        },
        title: { show: false },
        data: [{ value: judgment.score, name: '' }],
      }],
    };
  }, [judgment]);

  if (loading || !priceOverview || !indicators || !judgment) return <PageLoading />;

  const gap = keyStats ? Math.round((keyStats.globalSupply - keyStats.globalDemand) * 10) / 10 : 0;
  const overallCfg = signalConfig[judgment.overall];
  const stepNames = ['拆下游', '建公式', '看供给', '看库存', '加宏观'];

  // 玻璃卡片容器
  const glassCard: React.CSSProperties = {
    ...CARD,
    borderRadius: 14,
  };

  return (
    <div>
      {/* ═══ 第一行：价格判断仪表盘 + 价格走势 + 三品种卡片 ═══ */}
      <Row gutter={GAP}>
        {/* 左：综合价格判断 */}
        <Col xs={24} lg={8}>
          <div style={glassCard}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={{ ...CARD_BODY, paddingBottom: 0 }}>
              <div style={SECTION}>综合价格判断</div>
            </div>
            <ReactECharts option={gaugeOption} style={{ height: 180 }} />
            <div style={{ textAlign: 'center', padding: '0 20px 16px' }}>
              <Tag style={{
                fontSize: 14, fontWeight: 700, padding: '3px 14px', borderRadius: 6, margin: 0,
                background: overallCfg.bg, color: overallCfg.tagColor,
                textShadow: `0 0 8px ${overallCfg.color}44`,
              }}>
                {judgment.overall === 'bullish' ? '偏多' : judgment.overall === 'bearish' ? '偏空' : '中性'}
              </Tag>
              <div style={{ fontSize: 12, color: TEXT.secondary, marginTop: 8, lineHeight: 1.6 }}>{judgment.summary}</div>
            </div>
          </div>
        </Col>

        {/* 中：碳酸锂30日走势 */}
        <Col xs={24} lg={8}>
          <div style={{ ...glassCard, ...CARD_BODY }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={{ ...SECTION, marginBottom: 8 }}>碳酸锂价格走势（30日）</div>
            <ReactECharts option={priceTrendOption} style={{ height: 200 }} />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: TEXT.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>现价</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: TEXT.primary }}>{priceOverview.currentPrice.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: TEXT.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>涨跌</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: priceOverview.change >= 0 ? '#ef4444' : '#10b981' }}>
                  {priceOverview.change >= 0 ? '+' : ''}{priceOverview.change.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: TEXT.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>涨跌幅</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: priceOverview.changePercent >= 0 ? '#ef4444' : '#10b981' }}>
                  {priceOverview.changePercent >= 0 ? '+' : ''}{priceOverview.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* 右：三品种价格卡片 */}
        <Col xs={24} lg={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
            {trends.map((t) => (
              <div key={t.product} style={{ flex: 1 }}>
                <ProductCard {...t} />
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* ═══ 第二行：五步信号 + 雷达图 + 产业数据 ═══ */}
      <Row gutter={GAP} style={{ marginTop: GAP }}>
        {/* 左：五维信号详情 */}
        <Col xs={24} lg={12}>
          <div style={{ ...glassCard, ...CARD_BODY }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={SECTION}>五步分析信号</div>
            {judgment.signals.map((s) => (
              <SignalBar
                key={s.step}
                step={s.step}
                title={stepNames[s.step - 1]}
                direction={s.direction}
                strength={s.strength}
                source={s.source}
                description={s.description}
              />
            ))}
          </div>
        </Col>

        {/* 右上：雷达图 + 产业关键数据 */}
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
            {/* 雷达图 */}
            <div style={{ ...glassCard, ...CARD_BODY }}>
              <div style={GLASS_HIGHLIGHT} />
              <div style={SECTION}>五维信号雷达</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <ReactECharts option={radarOption} style={{ height: 220 }} />
                </div>
                <div style={{ width: 140, flexShrink: 0 }}>
                  {judgment.signals.map((s) => {
                    const cfg = signalConfig[s.direction];
                    return (
                      <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}44`, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: TEXT.secondary, flex: 1 }}>{stepNames[s.step - 1]}</span>
                        <Tag style={{
                          fontSize: 9, margin: 0, lineHeight: '14px', padding: '0 3px',
                          background: cfg.bg, color: cfg.tagColor,
                        }}>{cfg.label}</Tag>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 产业关键数据 */}
            <div style={{ ...glassCard, ...CARD_BODY }}>
              <div style={GLASS_HIGHLIGHT} />
              <div style={SECTION}>产业关键数据</div>
              <Row gutter={10}>
                <Col span={6}>
                  <StatCell label="全球供应" value={keyStats?.globalSupply ?? '-'} unit="LCE万吨" color="#4f8cff" />
                </Col>
                <Col span={6}>
                  <StatCell label="全球需求" value={keyStats?.globalDemand ?? '-'} unit="LCE万吨" color="#f59e0b" />
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
                    color="#a855f7"
                    sub={
                      (keyStats?.inventoryDays ?? 0) > 30 ? '偏高'
                      : (keyStats?.inventoryDays ?? 0) > 20 ? '适中'
                      : '偏低'
                    }
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* ═══ 第三行：框架核心指标卡片 + 预警 ═══ */}
      <Row gutter={GAP} style={{ marginTop: GAP }}>
        {/* 框架核心指标速览 */}
        <Col xs={24} lg={16}>
          <div style={{ ...glassCard, ...CARD_BODY }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={SECTION}>核心指标速览</div>
            <Row gutter={[10, 10]}>
              {[
                { label: 'Step1 · 需求增速', value: `${indicators.demandGrowth}%`, color: indicators.demandGrowth > 20 ? '#10b981' : '#f59e0b', sub: `EV ${indicators.evSalesGrowth}% / 储能 ${indicators.storageGrowth}%` },
                { label: 'Step2 · 需求偏差', value: `${indicators.demandGap > 0 ? '+' : ''}${indicators.demandGap}%`, color: Math.abs(indicators.demandGap) > 2 ? '#ef4444' : '#10b981', sub: `预测${indicators.demandForecast} / 实际${indicators.demandActual}万吨` },
                { label: 'Step3 · 供需缺口', value: `${indicators.supplyDemandGap > 0 ? '+' : ''}${indicators.supplyDemandGap}`, color: indicators.supplyDemandGap < 0 ? '#ef4444' : '#10b981', sub: `产能利用率${indicators.capacityUtilization}%`, unit: 'LCE万吨' },
                { label: 'Step4 · 库存方向', value: `${indicators.inventoryMomChange > 0 ? '+' : ''}${indicators.inventoryMomChange}%`, color: indicators.inventoryMomChange < 0 ? '#10b981' : '#ef4444', sub: `${indicators.inventoryDays}天 · ${indicators.inventoryCyclePhase}` },
                { label: 'Step5 · 宏观评分', value: `${indicators.macroScore}`, color: indicators.macroScore > 55 ? '#10b981' : indicators.macroScore < 45 ? '#ef4444' : '#f59e0b', sub: `DXY ${indicators.dollarIndex} · PMI ${indicators.chinaPMI}`, unit: '/ 100' },
                { label: '综合判断', value: `${judgment.score}`, color: overallCfg.color, sub: judgment.summary.substring(0, 20) + '...', isOverall: true },
              ].map((item, idx) => (
                <Col xs={12} md={8} key={idx}>
                  <div style={{
                    padding: '12px 14px', borderRadius: 10,
                    border: `1px solid ${item.isOverall ? `${item.color}33` : 'rgba(255,255,255,0.04)'}`,
                    background: item.isOverall ? item.color + '0a' : 'rgba(255,255,255,0.02)',
                  }}>
                    <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</span>
                      {item.unit && <span style={{ fontSize: 10, color: TEXT.secondary }}>{item.unit}</span>}
                      {item.isOverall && (
                        <Tag style={{
                          margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 4px',
                          background: overallCfg.bg, color: overallCfg.tagColor,
                        }}>{overallCfg.label}</Tag>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: TEXT.secondary, marginTop: 3 }}>{item.sub}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>

        {/* 预警 */}
        <Col xs={24} lg={8}>
          <div style={{ ...glassCard, ...CARD_BODY }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={SECTION}>最近预警</div>
            <Timeline
              items={alerts.slice(0, 5).map((a) => ({
                color: levelColor(a.level),
                children: (
                  <div style={{ paddingBottom: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: 12, color: TEXT.primary }}>{a.title}</span>
                      <Tag style={{
                        fontSize: 10, margin: 0, lineHeight: '14px', padding: '0 3px',
                        background: `${levelColor(a.level)}15`, color: levelColor(a.level),
                      }}>
                        {a.level === 'critical' ? '严重' : a.level === 'warning' ? '警告' : '信息'}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 11, color: TEXT.secondary, lineHeight: 1.5 }}>{a.description}</div>
                  </div>
                ),
              }))}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
