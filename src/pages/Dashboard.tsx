import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Tag, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useDashboardStore } from '../stores/dashboardStore';
import { useDemandStore } from '../stores/demandStore';
import { useSupplyStore } from '../stores/supplyStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { useMacroStore } from '../stores/macroStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, CHART_LEGEND, COLORS, gradientArea } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP, GLASS_HIGHLIGHT, TEXT } from '../utils/styles';
import type { SignalDirection } from '../types/dashboard';
import AIAnalysisPanel from '../components/AIAnalysisPanel';

const signalConfig: Record<SignalDirection, { label: string; color: string; tagColor: string; bg: string }> = {
  bullish: { label: '偏多', color: '#FF4D4F', tagColor: '#FF4D4F', bg: 'rgba(255,77,79,0.06)' },
  bearish: { label: '偏空', color: '#00C86E', tagColor: '#00C86E', bg: 'rgba(0,200,110,0.06)' },
  neutral: { label: '中性', color: '#FAAD14', tagColor: '#FAAD14', bg: 'rgba(250,173,20,0.06)' },
};

type DimensionKey = 'demand' | 'supply' | 'inventory' | 'macro';

const dimensionConfig: Record<DimensionKey, {
  label: string;
  icon: string;
  color: string;
  bg: string;
  gradientStart: string;
}> = {
  demand: { label: '需求', icon: '⚡', color: '#0064FF', bg: 'rgba(0,100,255,0.06)', gradientStart: '#0064FF' },
  supply: { label: '供给', icon: '⛏', color: '#722ED1', bg: 'rgba(114,46,209,0.06)', gradientStart: '#722ED1' },
  inventory: { label: '库存', icon: '📦', color: '#FAAD14', bg: 'rgba(250,173,20,0.06)', gradientStart: '#FAAD14' },
  macro: { label: '宏观和政策', icon: '📋', color: '#00C86E', bg: 'rgba(0,200,110,0.06)', gradientStart: '#00C86E' },
};

// ────────────── 需求详情面板 ──────────────
const DemandDetail: React.FC = () => {
  const { downstreamSectors, formula, evSales, energyStorage, loading, fetchAll } = useDemandStore();

  useEffect(() => { if (!downstreamSectors.length) fetchAll(); }, []);

  const sectorPieOption = useMemo(() => ({
    tooltip: { trigger: 'item' as const, backgroundColor: 'rgba(255,255,255,0.96)', borderColor: '#E8E8E8', borderWidth: 1, textStyle: { color: '#1F1F1F', fontSize: 13 } },
    legend: { orient: 'vertical' as const, right: 10, top: 'center', textStyle: { fontSize: 12, color: '#8C8C8C' } },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['35%', '50%'], avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#FFFFFF', borderWidth: 2 }, label: { show: false },
      data: downstreamSectors.map((d, i) => ({ value: d.share, name: d.sector, itemStyle: { color: COLORS[i % COLORS.length] } })),
    }],
  }), [downstreamSectors]);

  const evSalesOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['全球EV销量', '中国EV销量'] },
    grid: { top: 40, right: 60, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: evSales.map((d) => d.month), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: '万辆', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '同比%', position: 'right' as const, nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '全球EV销量', type: 'bar', data: evSales.map((d) => d.globalSales), itemStyle: { color: '#0064FF', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { name: '中国EV销量', type: 'bar', data: evSales.map((d) => d.chinaSales), itemStyle: { color: '#FAAD14', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { name: '全球同比', type: 'line', yAxisIndex: 1, data: evSales.map((d) => d.globalYoy), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#00C86E', width: 2 }, itemStyle: { color: '#00C86E' } },
    ],
  }), [evSales]);

  const storageOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['全球装机量', 'CATL装机量', '同比增速'] },
    grid: { top: 40, right: 60, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: energyStorage.map((d) => d.month), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: 'GWh', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '同比%', position: 'right' as const, nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '全球装机量', type: 'bar', data: energyStorage.map((d) => d.installation), itemStyle: { color: '#722ED1', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { name: 'CATL装机量', type: 'bar', data: energyStorage.map((d) => d.catlInstallation), itemStyle: { color: '#0064FF', borderRadius: [4, 4, 0, 0] }, barWidth: '25%' },
      { name: '同比增速', type: 'line', yAxisIndex: 1, data: energyStorage.map((d) => d.yoyChange), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#FAAD14', width: 2 }, itemStyle: { color: '#FAAD14' } },
    ],
  }), [energyStorage]);

  if (loading || !formula) return <PageLoading />;

  return (
    <div>
      <Row gutter={GAP}>
        <Col xs={24} lg={10}>
          <ReactECharts option={sectorPieOption} style={{ height: 260 }} />
        </Col>
        <Col xs={24} lg={14}>
          <div style={{ background: 'rgba(0,100,255,0.06)', borderRadius: 10, padding: '14px 18px', marginBottom: 12, border: '1px solid rgba(0,100,255,0.1)' }}>
            <div style={{ fontSize: 13, color: TEXT.primary, fontWeight: 600, marginBottom: 6 }}>
              需求传导公式
            </div>
            <div style={{ fontSize: 12, color: TEXT.secondary }}>
              计算结果：<span style={{ fontSize: 18, fontWeight: 700, color: '#0064FF' }}>{formula.result}</span> {formula.resultUnit}/年
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
            {downstreamSectors.map((s, i) => (
              <div key={s.sector} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #F0F0F0', background: '#FAFAFA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: TEXT.primary, fontWeight: 600 }}>{s.sector}</span>
                  <Tag style={{ margin: 0, fontSize: 10, background: s.growth >= 0 ? 'rgba(0,200,110,0.12)' : 'rgba(255,77,79,0.12)', color: s.growth >= 0 ? '#00C86E' : '#FF4D4F' }}>
                    {s.growth >= 0 ? '+' : ''}{s.growth}%
                  </Tag>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{s.share}%</span>
                  <span style={{ fontSize: 10, color: TEXT.secondary }}>{s.demand}万吨</span>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <div style={{ marginTop: GAP }}>
        <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>全球EV销量追踪</div>
        <ReactECharts option={evSalesOption} style={{ height: 300 }} />
      </div>
      <div style={{ marginTop: GAP }}>
        <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>储能装机趋势</div>
        <ReactECharts option={storageOption} style={{ height: 300 }} />
      </div>
    </div>
  );
};

// ────────────── 供给详情面板 ──────────────
const SupplyDetail: React.FC = () => {
  const { projects, projectProduction, summary, balance, loading, fetchAll } = useSupplyStore();

  useEffect(() => { if (!projects.length) fetchAll(); }, []);

  const balanceOption = useMemo(() => {
    const forecastStart = balance.findIndex((b) => b.isForecast);
    const forecastX = forecastStart >= 0 ? forecastStart - 0.5 : undefined;
    return {
      tooltip: CHART_TOOLTIP,
      legend: { ...CHART_LEGEND, data: ['供给', '需求', '盈余/缺口'] },
      grid: { top: 40, right: 60, bottom: 30, left: 50 },
      xAxis: { type: 'category', data: balance.map((b) => b.year), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
      yAxis: [
        { type: 'value', name: 'LCE万吨', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
        { type: 'value', name: '盈余/缺口', position: 'right' as const, nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
      ],
      series: [
        {
          name: '供给', type: 'bar',
          data: balance.map((b) => ({
            value: b.supply,
            itemStyle: b.isForecast
              ? { color: 'rgba(114,46,209,0.3)', borderColor: '#722ED1', borderWidth: 1, borderType: 'dashed' as const, borderRadius: [4, 4, 0, 0] }
              : { color: '#722ED1', borderRadius: [4, 4, 0, 0] },
          })),
          barWidth: '20%',
        },
        {
          name: '需求', type: 'bar',
          data: balance.map((b) => ({
            value: b.demand,
            itemStyle: b.isForecast
              ? { color: 'rgba(0,100,255,0.3)', borderColor: '#0064FF', borderWidth: 1, borderType: 'dashed' as const, borderRadius: [4, 4, 0, 0] }
              : { color: '#0064FF', borderRadius: [4, 4, 0, 0] },
          })),
          barWidth: '20%',
        },
        {
          name: '盈余/缺口', type: 'line', yAxisIndex: 1,
          data: balance.map((b) => b.surplus),
          smooth: true, symbol: 'circle', symbolSize: 6,
          lineStyle: { color: '#00C86E', width: 2 },
          itemStyle: { color: '#00C86E' },
          markLine: forecastX != null ? {
            silent: true, symbol: 'none',
            lineStyle: { color: 'rgba(0,0,0,0.15)', type: 'dashed' as const },
            data: [{ xAxis: forecastX }],
            label: { formatter: '预测', fontSize: 10, color: '#8C8C8C' },
          } : undefined,
        },
      ],
    };
  }, [balance]);

  const utilizationOption = useMemo(() => {
    const producers = [
      { name: '澳大利亚', rate: 85 },
      { name: '智利', rate: 90 },
      { name: '中国', rate: 72 },
      { name: '阿根廷', rate: 78 },
      { name: '全球平均', rate: 82 },
    ];
    return {
      tooltip: CHART_TOOLTIP,
      grid: { top: 20, right: 20, bottom: 30, left: 80 },
      xAxis: { type: 'value', max: 100, name: '%', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: 'category', data: producers.map((p) => p.name), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: CHART_AXIS_LABEL },
      series: [{
        type: 'bar',
        data: producers.map((p) => ({
          value: p.rate,
          itemStyle: { color: p.rate >= 85 ? '#00C86E' : p.rate >= 75 ? '#FAAD14' : '#FF4D4F', borderRadius: [0, 4, 4, 0] },
        })),
        barWidth: '50%',
        label: { show: true, position: 'right' as const, formatter: '{c}%', fontSize: 12, color: '#8C8C8C' },
      }],
    };
  }, []);

  const pipelineOption = useMemo(() => {
    const pipeline = [
      { project: 'Thacker Pass一期', country: '美国', timeline: '2025 Q3', capacity: 3, status: '建设中' },
      { project: 'Manono一期', country: '刚果(金)', timeline: '2025 Q4', capacity: 5, status: '勘探中' },
      { project: 'Greenbushes扩产', country: '澳大利亚', timeline: '2026 Q1', capacity: 4, status: '规划中' },
      { project: 'Salar de Atacama扩产', country: '智利', timeline: '2026 Q2', capacity: 3, status: '规划中' },
      { project: '宜春云母提锂扩产', country: '中国', timeline: '2026 H1', capacity: 2, status: '规划中' },
    ];
    return {
      tooltip: CHART_TOOLTIP,
      grid: { top: 20, right: 30, bottom: 30, left: 160 },
      xAxis: { type: 'value', name: '产能(万吨/年)', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: 'category', data: pipeline.map((p) => `${p.project}(${p.timeline})`), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, fontSize: 11 } },
      series: [{
        type: 'bar',
        data: pipeline.map((p) => ({
          value: p.capacity,
          itemStyle: {
            color: p.status === '建设中' ? '#0064FF' : p.status === '勘探中' ? '#FAAD14' : '#8C8C8C',
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '50%',
        label: { show: true, position: 'right' as const, formatter: '{c}万吨', fontSize: 12, color: '#8C8C8C' },
      }],
    };
  }, []);

  const projectColumns = [
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 160, render: (v: string, record: typeof projects[0]) => (
        <span
          onClick={() => setActiveProjectId(record.id)}
          style={{ fontWeight: 600, color: '#722ED1', cursor: 'pointer' }}
        >
          {v}
        </span>
      ),
    },
    { title: '国家', dataIndex: 'country', key: 'country', width: 90 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (v: string) => {
        const statusMap: Record<string, { bg: string; color: string; label: string }> = {
          producing: { bg: 'rgba(0,200,110,0.12)', color: '#00C86E', label: '生产中' },
          construction: { bg: 'rgba(0,100,255,0.12)', color: '#0064FF', label: '建设中' },
          exploration: { bg: 'rgba(250,173,20,0.12)', color: '#FAAD14', label: '勘探中' },
          suspended: { bg: 'rgba(140,140,140,0.12)', color: '#8C8C8C', label: '停产' },
        };
        const s = statusMap[v] || { bg: 'rgba(0,0,0,0.04)', color: '#8C8C8C', label: v };
        return <Tag style={{ margin: 0, background: s.bg, color: s.color, borderRadius: 4, fontSize: 11 }}>{s.label}</Tag>;
      },
    },
    { title: '矿种', dataIndex: 'mineralType', key: 'mineralType', width: 90 },
    { title: '储量(万吨LCE)', dataIndex: 'reserve', key: 'reserve', width: 110, render: (v: number) => v.toLocaleString() },
    {
      title: '产能(万吨/年)', dataIndex: 'capacity', key: 'capacity', width: 130,
      render: (_: number, record: typeof projects[0]) => `${record.capacity} (${record.capacityYear})`,
    },
  ];

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // default to first producing project
  useEffect(() => {
    if (!activeProjectId && projects.length) {
      const first = projects.find((p) => p.status === 'producing');
      if (first) setActiveProjectId(first.id);
    }
  }, [projects, activeProjectId]);
  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;
  const activeProduction = activeProjectId
    ? projectProduction.filter((r) => r.projectId === activeProjectId).sort((a, b) => a.year - b.year)
    : [];

  const productionTrendOption = useMemo(() => {
    if (!activeProduction.length) return {};
    const growthRates = activeProduction.map((r, i) => {
      if (i === 0) return null;
      const prev = activeProduction[i - 1].output;
      return prev === 0 ? null : Math.round(((r.output - prev) / prev) * 1000) / 10;
    });
    const forecastStart = activeProduction.findIndex((r) => r.isForecast);
    const forecastX = forecastStart >= 0 ? forecastStart - 0.5 : undefined;
    return {
      tooltip: CHART_TOOLTIP,
      legend: { ...CHART_LEGEND, data: ['产量', '同比增长率'] },
      grid: { top: 40, right: 60, bottom: 30, left: 50 },
      xAxis: { type: 'category', data: activeProduction.map((r) => String(r.year)), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: CHART_AXIS_LABEL },
      yAxis: [
        { type: 'value', name: '万吨', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
        { type: 'value', name: '增长率%', position: 'right' as const, nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
      ],
      series: [
        {
          name: '产量', type: 'bar',
          data: activeProduction.map((r) => ({
            value: r.output,
            itemStyle: r.isForecast
              ? { color: 'rgba(114,46,209,0.3)', borderColor: '#722ED1', borderWidth: 1, borderType: 'dashed' as const, borderRadius: [4, 4, 0, 0] }
              : { color: '#722ED1', borderRadius: [4, 4, 0, 0] },
          })),
          barWidth: '35%',
          label: { show: true, position: 'top' as const, formatter: '{c}', fontSize: 12, color: '#8C8C8C' },
        },
        {
          name: '同比增长率', type: 'line', yAxisIndex: 1,
          data: growthRates,
          smooth: true, symbol: 'circle', symbolSize: 6,
          lineStyle: { color: '#00C86E', width: 2 },
          itemStyle: { color: '#00C86E' },
          label: { show: true, formatter: (p: { value: number | null }) => p.value != null ? `${p.value}%` : '', fontSize: 11, color: '#00C86E' },
          markLine: forecastX != null ? {
            silent: true, symbol: 'none',
            lineStyle: { color: 'rgba(0,0,0,0.15)', type: 'dashed' as const },
            data: [{ xAxis: forecastX }],
            label: { formatter: '预测', fontSize: 10, color: '#8C8C8C' },
          } : undefined,
        },
      ],
    };
  }, [activeProduction]);

  if (loading) return <PageLoading />;

  return (
    <div>
      <Row gutter={GAP}>
        <Col xs={24} lg={12}>
          <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>产能利用率（主要生产国）</div>
          <ReactECharts option={utilizationOption} style={{ height: 240 }} />
        </Col>
        <Col xs={24} lg={12}>
          <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>全球供应概览</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(114,46,209,0.15)', background: 'rgba(114,46,209,0.04)' }}>
              <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 4 }}>全球供应量</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#722ED1' }}>{summary?.globalSupply ?? '-'}</div>
              <div style={{ fontSize: 10, color: TEXT.secondary }}>LCE万吨</div>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(114,46,209,0.15)', background: 'rgba(114,46,209,0.04)' }}>
              <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 4 }}>同比增长</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#00C86E' }}>{summary?.yoyChange ?? '-'}%</div>
              <div style={{ fontSize: 10, color: TEXT.secondary }}>YoY</div>
            </div>
            <div style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(114,46,209,0.15)', background: 'rgba(114,46,209,0.04)', gridColumn: 'span 2' }}>
              <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 4 }}>主要生产国</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {summary?.topCountries.map((c) => (
                  <Tag key={c.country} style={{ margin: 0, background: 'rgba(114,46,209,0.1)', color: '#722ED1', borderRadius: 4, fontSize: 11 }}>{c.country} {c.share}%</Tag>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div style={{ marginTop: GAP }}>
        <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>供需平衡趋势</div>
        <ReactECharts option={balanceOption} style={{ height: 300 }} />
      </div>
      <div style={{ marginTop: GAP }}>
        <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>扩产管道</div>
        <ReactECharts option={pipelineOption} style={{ height: 260 }} />
      </div>
      <div style={{ marginTop: GAP }}>
        <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>全球矿山项目</div>
        <Table
          columns={projectColumns}
          dataSource={projects.map((p) => ({ ...p, key: p.id }))}
          size="small"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 900 }}
          onRow={(record) => ({
            onClick: () => setActiveProjectId(record.id),
            style: {
              cursor: 'pointer',
              background: record.id === activeProjectId ? 'rgba(114,46,209,0.08)' : undefined,
            },
          })}
        />
      </div>
      {activeProject && (
        <div style={{
          marginTop: GAP,
          padding: '16px 20px',
          borderRadius: 10,
          border: '1px solid rgba(114,46,209,0.15)',
          background: 'rgba(114,46,209,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT.primary }}>
              {activeProject.name}
              <span style={{ fontSize: 11, fontWeight: 400, color: TEXT.secondary, marginLeft: 8 }}>
                {activeProject.country} · {activeProject.mineralType}
              </span>
            </div>
            <span
              onClick={() => setActiveProjectId(null)}
              style={{ fontSize: 12, color: TEXT.secondary, cursor: 'pointer' }}
            >
              关闭
            </span>
          </div>
          {activeProduction.length > 0 ? (
            <ReactECharts option={productionTrendOption} style={{ height: 260 }} />
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: TEXT.secondary }}>
              该项目暂无历史产量数据
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ────────────── 库存详情面板 ──────────────
const dimensionColors: Record<string, string> = {
  factory: '#0064FF',
  market: '#00C86E',
  futures: '#FAAD14',
  total: '#722ED1',
};

const InventoryDetail: React.FC = () => {
  const { dimensions, trend, cycle, loading, fetchAll } = useInventoryStore();

  useEffect(() => { if (!dimensions.length) fetchAll(); }, []);

  const trendOption = useMemo(() => ({
    tooltip: CHART_TOOLTIP,
    legend: { ...CHART_LEGEND, data: ['工厂库存', '市场库存', '期货库存', '行业总库存', '库存增减率'] },
    grid: { top: 40, right: 60, bottom: 30, left: 60 },
    xAxis: { type: 'category', data: trend.map((d) => d.month), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
    yAxis: [
      { type: 'value', name: '库存(吨)', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
      { type: 'value', name: '增减率%', position: 'right' as const, nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    ],
    series: [
      { name: '工厂库存', type: 'line', data: trend.map((d) => d.factory), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#0064FF', width: 2 }, itemStyle: { color: '#0064FF' }, areaStyle: gradientArea('#0064FF', 0.08) },
      { name: '市场库存', type: 'line', data: trend.map((d) => d.market), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#00C86E', width: 2 }, itemStyle: { color: '#00C86E' } },
      { name: '期货库存', type: 'line', data: trend.map((d) => d.futures), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#FAAD14', width: 2 }, itemStyle: { color: '#FAAD14' } },
      { name: '行业总库存', type: 'line', data: trend.map((d) => d.total), smooth: true, symbol: 'diamond', symbolSize: 5, lineStyle: { color: '#722ED1', width: 2.5 }, itemStyle: { color: '#722ED1' } },
      { name: '库存增减率', type: 'bar', yAxisIndex: 1, data: trend.map((d) => ({ value: d.changeRate, itemStyle: { color: d.changeRate >= 0 ? 'rgba(255,77,79,0.6)' : 'rgba(0,200,110,0.6)', borderRadius: [3, 3, 0, 0] } })), barWidth: '30%' },
    ],
  }), [trend]);

  if (loading || !dimensions.length || !cycle) return <PageLoading />;

  const phaseConfig: Record<string, { color: string; icon: string }> = {
    active_destock: { color: '#FF4D4F', icon: '↓' },
    passive_destock: { color: '#00C86E', icon: '↑' },
    active_restock: { color: '#0064FF', icon: '↑' },
    passive_restock: { color: '#FAAD14', icon: '↓' },
  };
  const pc = phaseConfig[cycle.phase] || phaseConfig.active_destock;

  return (
    <div>
      <Row gutter={GAP}>
        {dimensions.map((dim) => {
          const color = dimensionColors[dim.key] || '#FAAD14';
          return (
            <Col xs={12} md={6} key={dim.key}>
              <div style={{ padding: '16px 18px', borderRadius: 10, border: `1px solid ${color}20`, background: `${color}06` }}>
                <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>{dim.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: TEXT.primary }}>{dim.currentStock.toLocaleString()}</span>
                  <span style={{ fontSize: 11, color: TEXT.secondary }}>吨</span>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div>
                    <span style={{ fontSize: 10, color: TEXT.secondary }}>环比</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: dim.momChange >= 0 ? '#FF4D4F' : '#00C86E', marginTop: 2 }}>
                      {dim.momChange >= 0 ? '+' : ''}{dim.momChange}%
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: TEXT.secondary }}>周环比</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: dim.wowChange >= 0 ? '#FF4D4F' : '#00C86E', marginTop: 2 }}>
                      {dim.wowChange >= 0 ? '+' : ''}{dim.wowChange}%
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
      <div style={{ marginTop: GAP, padding: '16px 20px', borderRadius: 10, border: `1px solid ${pc.color}22`, background: 'rgba(250,173,20,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: pc.color }}>{pc.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: TEXT.primary }}>库存周期：{cycle.phaseLabel}</span>
              <Tag style={{ background: cycle.signal === 'bullish' ? 'rgba(255,77,79,0.12)' : cycle.signal === 'bearish' ? 'rgba(0,200,110,0.12)' : 'rgba(0,100,255,0.12)', color: cycle.signal === 'bullish' ? '#FF4D4F' : cycle.signal === 'bearish' ? '#00C86E' : '#0064FF', margin: 0 }}>
                {cycle.signal === 'bullish' ? '利多' : cycle.signal === 'bearish' ? '利空' : '中性'}
              </Tag>
            </div>
            <div style={{ fontSize: 12, color: TEXT.secondary, lineHeight: 1.5 }}>{cycle.description}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 4 }}>置信度</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: pc.color }}>{cycle.confidence}%</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: GAP }}>
        <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>库存趋势</div>
        <ReactECharts option={trendOption} style={{ height: 300 }} />
      </div>

      {/* 库存数据明细 */}
      <div style={{ marginTop: GAP }}>
        <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>数据明细</div>
        <Table
          size="small"
          pagination={false}
          dataSource={trend.slice().reverse().map((row, i) => ({ ...row, key: row.month }))}
          columns={[
            { title: '日期', dataIndex: 'month', key: 'month', width: 100, render: (v: string) => <span style={{ fontWeight: 600, color: TEXT.primary, fontFamily: 'monospace' }}>{v}</span> },
            {
              title: '工厂库存', dataIndex: 'factory', key: 'factory', width: 120,
              render: (v: number, _: typeof trend[0], idx: number) => {
                const next = trend.slice().reverse()[idx + 1];
                const diff = next ? v - next.factory : 0;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600 }}>{v.toLocaleString()}</span>
                    {next && <span style={{ fontSize: 11, color: diff >= 0 ? '#FF4D4F' : '#00C86E', fontWeight: 600 }}>{diff >= 0 ? '+' : ''}{diff.toLocaleString()}</span>}
                  </div>
                );
              },
            },
            {
              title: '市场库存', dataIndex: 'market', key: 'market', width: 120,
              render: (v: number, _: typeof trend[0], idx: number) => {
                const next = trend.slice().reverse()[idx + 1];
                const diff = next ? v - next.market : 0;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600 }}>{v.toLocaleString()}</span>
                    {next && <span style={{ fontSize: 11, color: diff >= 0 ? '#FF4D4F' : '#00C86E', fontWeight: 600 }}>{diff >= 0 ? '+' : ''}{diff.toLocaleString()}</span>}
                  </div>
                );
              },
            },
            {
              title: '期货库存', dataIndex: 'futures', key: 'futures', width: 120,
              render: (v: number, _: typeof trend[0], idx: number) => {
                const next = trend.slice().reverse()[idx + 1];
                const diff = next ? v - next.futures : 0;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 600 }}>{v.toLocaleString()}</span>
                    {next && <span style={{ fontSize: 11, color: diff >= 0 ? '#FF4D4F' : '#00C86E', fontWeight: 600 }}>{diff >= 0 ? '+' : ''}{diff.toLocaleString()}</span>}
                  </div>
                );
              },
            },
            {
              title: '行业总库存', dataIndex: 'total', key: 'total', width: 130,
              render: (v: number, _: typeof trend[0], idx: number) => {
                const next = trend.slice().reverse()[idx + 1];
                const diff = next ? v - next.total : 0;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, color: TEXT.primary }}>{v.toLocaleString()}</span>
                    {next && <span style={{ fontSize: 11, color: diff >= 0 ? '#FF4D4F' : '#00C86E', fontWeight: 600 }}>{diff >= 0 ? '+' : ''}{diff.toLocaleString()}</span>}
                  </div>
                );
              },
            },
            {
              title: '环比', dataIndex: 'changeRate', key: 'changeRate', width: 80,
              render: (v: number) => <span style={{ fontWeight: 600, color: v >= 0 ? '#FF4D4F' : '#00C86E' }}>{v >= 0 ? '+' : ''}{v}%</span>,
            },
          ]}
        />
      </div>
    </div>
  );
};

// ────────────── 宏观和政策详情面板 ──────────────
const MacroDetail: React.FC = () => {
  const { radar, indicators, breakingNews, loading, fetchAll } = useMacroStore();

  useEffect(() => { if (!radar.length) fetchAll(); }, []);

  const radarChartOption = useMemo(() => ({
    tooltip: {},
    radar: {
      indicator: radar.map((d) => ({ name: d.dimension, max: 100 })),
      shape: 'circle' as const,
      splitNumber: 4,
      axisName: { color: '#8C8C8C', fontSize: 11 },
      splitLine: { lineStyle: { color: '#F0F0F0' } },
      splitArea: { areaStyle: { color: ['rgba(0,200,110,0.02)', 'rgba(0,200,110,0.04)', 'rgba(0,200,110,0.02)', 'rgba(0,200,110,0.04)'] } },
      axisLine: { lineStyle: { color: '#E8E8E8' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: radar.map((d) => d.score),
        name: '当前状态',
        areaStyle: { color: 'rgba(0,200,110,0.15)' },
        lineStyle: { color: '#00C86E', width: 2 },
        itemStyle: { color: '#00C86E' },
      }],
    }],
  }), [radar]);

  if (loading) return <PageLoading />;

  const impactMapLocal: Record<string, { label: string; color: string; bg: string }> = {
    positive: { label: '利多', color: '#FF4D4F', bg: 'rgba(255,77,79,0.12)' },
    negative: { label: '利空', color: '#00C86E', bg: 'rgba(0,200,110,0.12)' },
    neutral: { label: '中性', color: '#0064FF', bg: 'rgba(0,100,255,0.12)' },
  };

  const directionConfig: Record<string, { label: string; color: string; bg: string }> = {
    bullish: { label: '利多', color: '#FF4D4F', bg: 'rgba(255,77,79,0.10)' },
    bearish: { label: '利空', color: '#00C86E', bg: 'rgba(0,200,110,0.10)' },
    neutral: { label: '中性', color: '#0064FF', bg: 'rgba(0,100,255,0.10)' },
  };

  const importanceConfig: Record<string, { label: string; color: string }> = {
    high: { label: '高影响', color: '#FF4D4F' },
    medium: { label: '中影响', color: '#FAAD14' },
    low: { label: '低影响', color: '#8C8C8C' },
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  return (
    <div>
      {/* ── 宏观因素 ── */}
      <Row gutter={GAP}>
        <Col xs={24} lg={10}>
          <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>宏观因子雷达</div>
          <ReactECharts option={radarChartOption} style={{ height: 280 }} />
        </Col>
        <Col xs={24} lg={14}>
          <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>关键宏观指标</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
            {indicators.map((ind) => {
              const imp = impactMapLocal[ind.impact] || impactMapLocal.neutral;
              return (
                <div key={ind.key} style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #F0F0F0', background: '#FAFAFA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: TEXT.secondary }}>{ind.name}</span>
                    <Tag style={{ fontSize: 9, margin: 0, lineHeight: '14px', padding: '0 4px', background: imp.bg, color: imp.color }}>{imp.label}</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: TEXT.primary }}>{ind.value}</span>
                    <span style={{ fontSize: 10, color: TEXT.secondary }}>{ind.unit}</span>
                    {ind.change !== 0 && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: ind.change >= 0 ? '#FF4D4F' : '#00C86E', marginLeft: 4 }}>
                        {ind.change >= 0 ? '+' : ''}{ind.change}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>

      {/* ── 政策与行业新闻 ── */}
      <div style={{ marginTop: GAP * 2, borderTop: '1px solid #F0F0F0', paddingTop: GAP }}>
        <div style={{ fontSize: 11, color: TEXT.secondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          产业链政策与行业动态
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {breakingNews.map((news) => {
            const dir = directionConfig[news.direction] || directionConfig.neutral;
            const imp = importanceConfig[news.impact] || importanceConfig.low;
            return (
              <div key={news.id} style={{
                padding: '14px 18px',
                borderRadius: 10,
                border: '1px solid #F0F0F0',
                background: '#FAFAFA',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: TEXT.primary, lineHeight: 1.4 }}>{news.title}</span>
                    </div>
                    <div style={{ fontSize: 12, color: TEXT.secondary, lineHeight: 1.6 }}>{news.summary}</div>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <Tag style={{ margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 6px', background: dir.bg, color: dir.color, borderRadius: 4 }}>
                      {dir.label}
                    </Tag>
                    <Tag style={{ margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 6px', background: `${imp.color}12`, color: imp.color, borderRadius: 4 }}>
                      {imp.label}
                    </Tag>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {news.tags.map((tag) => (
                      <Tag key={tag} style={{ margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 5px', background: '#F0F0F0', color: TEXT.secondary, borderRadius: 3, border: 'none' }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: TEXT.muted }}>{news.source}</span>
                    <span style={{ fontSize: 11, color: TEXT.muted }}>{formatTime(news.time)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ────────────── 主页面 ──────────────

const Dashboard: React.FC = () => {
  const { priceOverview, indicators, judgment, loading, fetchAll, todayAnalysis, yesterdayReview, analysisHistory, fetchAnalysis } = useDashboardStore();
  const [activeDimension, setActiveDimension] = useState<DimensionKey>('demand');

  useEffect(() => {
    fetchAll().then(() => { fetchAnalysis(); });
  }, []);

  if (loading || !priceOverview || !indicators || !judgment) return <PageLoading />;

  const overallCfg = signalConfig[judgment.overall];

  // 映射信号到四个维度
  const dimensionSignals: Record<DimensionKey, { direction: SignalDirection; strength: number; description: string }> = {
    demand: {
      direction: judgment.signals[0].direction,
      strength: judgment.signals[0].strength,
      description: judgment.signals[0].description,
    },
    supply: {
      direction: judgment.signals[2].direction,
      strength: judgment.signals[2].strength,
      description: judgment.signals[2].description,
    },
    inventory: {
      direction: judgment.signals[3].direction,
      strength: judgment.signals[3].strength,
      description: judgment.signals[3].description,
    },
    macro: {
      direction: judgment.signals[4].direction,
      strength: judgment.signals[4].strength,
      description: judgment.signals[4].description,
    },
  };

  // 维度关键数值
  const dimensionValues: Record<DimensionKey, { main: string; sub: string }> = {
    demand: {
      main: `${indicators.demandGrowth}%`,
      sub: `EV +${indicators.evSalesGrowth}% / 储能 +${indicators.storageGrowth}%`,
    },
    supply: {
      main: `${indicators.supplyDemandGap > 0 ? '+' : ''}${indicators.supplyDemandGap}`,
      sub: `产能利用率 ${indicators.capacityUtilization}%`,
    },
    inventory: {
      main: `${indicators.inventoryMomChange > 0 ? '+' : ''}${indicators.inventoryMomChange}%`,
      sub: `${indicators.inventoryDays}天 · ${indicators.inventoryCyclePhase}`,
    },
    macro: {
      main: `${indicators.macroScore}`,
      sub: `DXY ${indicators.dollarIndex} · PMI ${indicators.chinaPMI} · 政策 ${judgment.signals.length > 4 ? '活跃' : '平稳'}`,
    },
  };

  return (
    <div>
      {/* ═══ AI 智能研判面板 ═══ */}
      {todayAnalysis && analysisHistory ? (
        <AIAnalysisPanel
          analysis={todayAnalysis}
          review={yesterdayReview}
          history={analysisHistory}
          currentPrice={priceOverview.currentPrice}
        />
      ) : (
        <div style={{
          ...CARD, borderRadius: 16,
          background: `linear-gradient(135deg, ${overallCfg.color}08 0%, #FFFFFF 50%, ${overallCfg.color}05 100%)`,
          border: `1px solid ${overallCfg.color}20`,
        }}>
          <div style={GLASS_HIGHLIGHT} />
          <div style={{ ...CARD_BODY, padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${overallCfg.color}20, ${overallCfg.color}08)`,
                border: `1px solid ${overallCfg.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: overallCfg.color,
                boxShadow: `0 0 20px ${overallCfg.color}15`,
              }}>AI</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: TEXT.secondary, letterSpacing: 0.5 }}>智能研判</span>
                  <Tag style={{
                    margin: 0, fontSize: 12, fontWeight: 700, padding: '2px 12px', borderRadius: 6,
                    background: overallCfg.bg, color: overallCfg.tagColor,
                  }}>
                    {overallCfg.label}
                  </Tag>
                  <span style={{ fontSize: 20, fontWeight: 700, color: overallCfg.color }}>
                    {judgment.score}
                  </span>
                  <span style={{ fontSize: 11, color: TEXT.secondary }}>/ 100</span>
                </div>
                <div style={{ fontSize: 14, color: TEXT.primary, lineHeight: 1.6, fontWeight: 500 }}>
                  {judgment.summary}
                </div>
              </div>
              <div style={{
                flexShrink: 0, textAlign: 'right',
                padding: '10px 18px', borderRadius: 10,
                border: '1px solid #E8E8E8',
                background: '#FAFAFA',
              }}>
                <div style={{ fontSize: 10, color: TEXT.secondary, marginBottom: 4 }}>碳酸锂现价</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: TEXT.primary, lineHeight: 1 }}>
                  {priceOverview.currentPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 四维指标卡片（切换标签） ═══ */}
      <Row gutter={GAP} style={{ marginTop: GAP }}>
        {(Object.keys(dimensionConfig) as DimensionKey[]).map((key) => {
          const cfg = dimensionConfig[key];
          const sig = dimensionSignals[key];
          const val = dimensionValues[key];
          const sigCfg = signalConfig[sig.direction];
          const isActive = activeDimension === key;

          return (
            <Col xs={12} lg={6} key={key}>
              <div
                onClick={() => setActiveDimension(key)}
                style={{
                  ...CARD,
                  borderRadius: 14,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: isActive ? `1px solid ${cfg.color}50` : '1px solid #E8E8E8',
                  background: isActive ? `linear-gradient(180deg, ${cfg.color}12 0%, #FFFFFF 100%)` : '#FFFFFF',
                  boxShadow: isActive ? `0 4px 24px ${cfg.color}15` : 'none',
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}66)`,
                  opacity: isActive ? 1 : 0.6,
                }} />
                <div style={GLASS_HIGHLIGHT} />
                <div style={{ ...CARD_BODY, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT.primary, letterSpacing: 0.5 }}>{cfg.label}</span>
                    </div>
                    <Tag style={{
                      margin: 0, fontSize: 10, fontWeight: 600, lineHeight: '18px', padding: '0 6px',
                      background: sigCfg.bg, color: sigCfg.tagColor, borderRadius: 4,
                    }}>
                      {sigCfg.label}
                    </Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 28, fontWeight: 700,
                      color: sigCfg.color,
                      textShadow: `0 0 12px ${sigCfg.color}15`,
                    }}>
                      {val.main}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: TEXT.secondary, lineHeight: 1.5 }}>{val.sub}</div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: TEXT.secondary }}>信号强度</span>
                      <span style={{ fontSize: 10, color: TEXT.secondary }}>{Math.round(sig.strength)}%</span>
                    </div>
                    <div style={{ height: 3, background: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: `${sig.strength}%`, height: '100%', borderRadius: 2,
                        background: `linear-gradient(90deg, ${sigCfg.color}, ${sigCfg.color}88)`,
                        boxShadow: `0 0 6px ${sigCfg.color}40`,
                        transition: 'width 0.5s',
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* ═══ 详情面板（按选中维度切换） ═══ */}
      {(() => {
        const cfg = dimensionConfig[activeDimension];
        return (
          <div style={{
            marginTop: GAP,
            ...CARD,
            borderRadius: 14,
            border: `1px solid ${cfg.color}25`,
          }}>
            <div style={GLASS_HIGHLIGHT} />
            <div style={{ ...CARD_BODY, padding: '20px 24px' }}>
              <div style={{
                ...SECTION,
                color: cfg.color,
                borderBottomColor: `${cfg.color}15`,
              }}>
                {cfg.icon} {cfg.label}分析详情
              </div>
              {activeDimension === 'demand' && <DemandDetail />}
              {activeDimension === 'supply' && <SupplyDetail />}
              {activeDimension === 'inventory' && <InventoryDetail />}
              {activeDimension === 'macro' && <MacroDetail />}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Dashboard;
