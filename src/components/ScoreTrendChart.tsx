import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { CHART_TOOLTIP, CHART_AXIS_LABEL, CHART_SPLIT_LINE, gradientArea } from '../utils/chartThemes';
import type { ScoreTrendPoint } from '../types/analysis';

interface Props {
  data: ScoreTrendPoint[];
}

const ScoreTrendChart: React.FC<Props> = ({ data }) => {
  const option = useMemo(() => {
    const dates = data.map(d => d.date.slice(5)); // MM-DD
    const scores = data.map(d => d.score);

    return {
      tooltip: {
        ...CHART_TOOLTIP,
        formatter: (params: { dataIndex: number }) => {
          const point = data[params.dataIndex];
          if (!point) return '';
          const dirLabel = point.direction === 'bullish' ? '偏多' : point.direction === 'bearish' ? '偏空' : '中性';
          const color = point.direction === 'bullish' ? '#10b981' : point.direction === 'bearish' ? '#ef4444' : '#f59e0b';
          return `<div style="font-size:12px">
            <div style="margin-bottom:4px">${point.date}</div>
            <div>评分：<b>${point.score}</b></div>
            <div>方向：<span style="color:${color};font-weight:600">${dirLabel}</span></div>
            <div>价格：${point.actualPrice.toLocaleString()}</div>
          </div>`;
        },
      },
      grid: { top: 20, right: 16, bottom: 24, left: 40 },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        axisTick: { show: false },
        axisLabel: { ...CHART_AXIS_LABEL, fontSize: 10, interval: Math.max(Math.floor(data.length / 6), 0) },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: { ...CHART_AXIS_LABEL, fontSize: 10 },
        splitLine: CHART_SPLIT_LINE,
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [{
        type: 'line',
        data: scores,
        smooth: true,
        symbol: 'circle',
        symbolSize: 3,
        lineStyle: { color: '#4f8cff', width: 2, shadowColor: '#4f8cff', shadowBlur: 4 },
        itemStyle: {
          color: (params: { value: number }) =>
            params.value > 58 ? '#10b981' : params.value < 42 ? '#ef4444' : '#f59e0b',
        },
        areaStyle: gradientArea('#4f8cff', 0.1),
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: 'rgba(255,255,255,0.1)', type: 'dashed' as const, width: 1 },
          data: [
            { yAxis: 58, label: { formatter: '偏多线', fontSize: 9, color: '#10b981' } },
            { yAxis: 42, label: { formatter: '偏空线', fontSize: 9, color: '#ef4444' } },
          ],
        },
      }],
    };
  }, [data]);

  return <ReactECharts option={option} style={{ height: 160 }} />;
};

export default ScoreTrendChart;
