import ReactECharts from 'echarts-for-react';

import { getChartTheme } from '@/lib/echarts-theme';
import type { SocSpec } from '@/types/soc';

interface SocScatterChartProps {
  socs: SocSpec[];
  height?: number;
}

const brandColorMap: Record<string, string> = {
  Qualcomm: '#0f62fe',
  MediaTek: '#2563eb',
  Apple: '#f59e0b',
  Samsung: '#10b981',
};

export function SocScatterChart({ socs, height = 340 }: SocScatterChartProps) {
  const chartTheme = getChartTheme();

  const option = {
    tooltip: {
      ...chartTheme.commonTooltip,
      formatter: (params: { data: [number, number, number, string, string] }) => {
        const data = params.data;
        return `${data[3]}<br/>性能：${Math.round(data[0])}<br/>能效：${data[1]}<br/>GPU：${data[2]}<br/>品牌：${data[4]}`;
      },
    },
    xAxis: {
      type: 'value',
      name: '性能分数',
      nameTextStyle: chartTheme.commonAxisName,
      axisLabel: chartTheme.commonAxisLabel,
      splitLine: { lineStyle: { color: chartTheme.tokens.splitLineColor } },
    },
    yAxis: {
      type: 'value',
      name: '能效',
      nameTextStyle: chartTheme.commonAxisName,
      axisLabel: chartTheme.commonAxisLabel,
      splitLine: { lineStyle: { color: chartTheme.tokens.splitLineColor } },
    },
    series: [
      {
        type: 'scatter',
        data: socs.map((soc) => {
          const perf = soc.antutuScore / 1000;
          return [perf, soc.powerEfficiency, soc.gpuScore, soc.name, soc.manufacturer];
        }),
        symbolSize: (value: number[]) => Math.max(12, Math.round(value[2] / 34)),
        itemStyle: {
          color: (params: { data: [number, number, number, string, string] }) =>
            brandColorMap[params.data[4]] ?? '#64748B',
          opacity: 0.9,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
}
