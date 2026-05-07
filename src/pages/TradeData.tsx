import React, { useEffect, useMemo } from 'react';
import { Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useTradeStore } from '../stores/tradeStore';
import PageLoading from '../components/PageLoading';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, COLORS } from '../utils/chartThemes';
import { CARD, CARD_BODY, SECTION, GAP } from '../utils/styles';

const TradeData: React.FC = () => {
  const { records, partners, loading, fetchAll } = useTradeStore();

  useEffect(() => { fetchAll(); }, []);

  const latest = records[records.length - 1];

  const timeSeriesOption = useMemo(() => {
    if (records.length === 0) return {};
    return {
      tooltip: CHART_TOOLTIP,
      legend: { data: ['进口量', '出口量', '进口均价', '出口均价'], top: 0, itemWidth: 16, itemHeight: 2, textStyle: { fontSize: 12, color: '#8C8C8C' } },
      grid: { top: 40, right: 60, bottom: 30, left: 60 },
      xAxis: { type: 'category', data: records.map((r) => r.month), axisLine: { lineStyle: { color: '#E8E8E8' } }, axisTick: { show: false }, axisLabel: { ...CHART_AXIS_LABEL, rotate: 30 } },
      yAxis: [
        { type: 'value', name: '吨', nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: CHART_SPLIT_LINE, axisLine: { show: false }, axisTick: { show: false } },
        { type: 'value', name: '美元/吨', position: 'right' as const, nameTextStyle: { color: '#8C8C8C', fontSize: 11 }, axisLabel: CHART_AXIS_LABEL, splitLine: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
      ],
      series: [
        { name: '进口量', type: 'bar', data: records.map((r) => r.importVolume), itemStyle: { color: '#0064FF' }, barWidth: '18%' },
        { name: '出口量', type: 'bar', data: records.map((r) => r.exportVolume), itemStyle: { color: '#FAAD14' }, barWidth: '18%' },
        { name: '进口均价', type: 'line', yAxisIndex: 1, data: records.map((r) => r.avgImportPrice), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#FF4D4F', width: 2 }, itemStyle: { color: '#FF4D4F' } },
        { name: '出口均价', type: 'line', yAxisIndex: 1, data: records.map((r) => r.avgExportPrice), smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#00C86E', width: 2 }, itemStyle: { color: '#00C86E' } },
      ],
    };
  }, [records]);

  const partnerPieOption = useMemo(() => ({
    tooltip: { trigger: 'item' as const, backgroundColor: 'rgba(255,255,255,0.96)', borderColor: '#E8E8E8', borderWidth: 1, textStyle: { color: '#1F1F1F', fontSize: 13 } },
    legend: { orient: 'vertical' as const, right: 10, top: 'center', textStyle: { fontSize: 11, color: '#8c8c8c' } },
    series: [{
      type: 'pie', radius: ['35%', '65%'], center: ['35%', '50%'], avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 }, label: { show: false },
      data: partners.map((p, i) => ({ value: p.importShare, name: p.country, itemStyle: { color: COLORS[i % COLORS.length] } })),
    }],
  }), [partners]);

  const partnerColumns = [
    { title: '国家', dataIndex: 'country', key: 'country', width: 100, render: (v: string) => <span style={{ fontWeight: 600, color: '#1F1F1F' }}>{v}</span> },
    { title: '进口份额', dataIndex: 'importShare', key: 'importShare', width: 90, render: (v: number) => `${v}%` },
    { title: '进口量(吨)', dataIndex: 'importVolume', key: 'importVolume', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '进口额(万$)', dataIndex: 'importValue', key: 'importValue', width: 110, render: (v: number) => v.toLocaleString() },
    { title: '出口份额', dataIndex: 'exportShare', key: 'exportShare', width: 90, render: (v: number) => `${v}%` },
    { title: '出口量(吨)', dataIndex: 'exportVolume', key: 'exportVolume', width: 100, render: (v: number) => v.toLocaleString() },
  ];

  if (loading) return <PageLoading />;

  return (
    <div>
      {/* 顶部统计横条 */}
      <div style={{ ...CARD, background: '#fff', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>本月进口量</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1F1F1F' }}>{latest?.importVolume?.toLocaleString() ?? '-'} <span style={{ fontSize: 12, fontWeight: 400, color: '#BFBFBF' }}>吨</span></div>
        </div>
        <div style={{ width: 1, height: 40, background: '#F0F0F0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#8C8C8C', marginBottom: 6 }}>本月进口额</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0064FF' }}>{latest?.importValue?.toLocaleString() ?? '-'} <span style={{ fontSize: 12, fontWeight: 400, color: '#BFBFBF' }}>万美元</span></div>
        </div>
        <div style={{ width: 1, height: 40, background: '#F0F0F0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#8C8C8C', marginBottom: 6 }}>本月出口量</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1F1F1F' }}>{latest?.exportVolume?.toLocaleString() ?? '-'} <span style={{ fontSize: 12, fontWeight: 400, color: '#BFBFBF' }}>吨</span></div>
        </div>
        <div style={{ width: 1, height: 40, background: '#F0F0F0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>本月出口额</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#00C86E' }}>{latest?.exportValue?.toLocaleString() ?? '-'} <span style={{ fontSize: 12, fontWeight: 400, color: '#bfbfbf' }}>万美元</span></div>
        </div>
      </div>

      {/* 进出口趋势 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP, ...CARD_BODY }}>
        <div style={SECTION}>进出口趋势</div>
        <ReactECharts option={timeSeriesOption} style={{ height: 350 }} />
      </div>

      {/* 贸易伙伴 */}
      <div style={{ ...CARD, background: '#fff', marginTop: GAP, ...CARD_BODY }}>
        <div style={SECTION}>进口贸易伙伴</div>
        <ReactECharts option={partnerPieOption} style={{ height: 260 }} />
        <Table
          columns={partnerColumns}
          dataSource={partners.map((p, i) => ({ ...p, key: `partner-${i}` }))}
          size="small"
          pagination={false}
          scroll={{ y: 250 }}
        />
      </div>
    </div>
  );
};

export default TradeData;
