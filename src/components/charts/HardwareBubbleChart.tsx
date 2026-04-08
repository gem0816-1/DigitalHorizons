import ReactECharts from 'echarts-for-react';

import { getChartTheme } from '@/lib/echarts-theme';
import type { HardwareItem } from '@/types/hardware';

interface HardwareBubbleChartProps {
  title: string;
  items: HardwareItem[];
  colorByBrand: Record<string, string>;
}

export function HardwareBubbleChart({ title, items, colorByBrand }: HardwareBubbleChartProps) {
  const chartTheme = getChartTheme();

  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: { color: chartTheme.tokens.hardwareTitleColor, fontSize: 14 },
    },
    tooltip: {
      ...chartTheme.commonTooltip,
      formatter: (params: { data: [number, number, number, string, string] }) => {
        const data = params.data;
        return `${data[3]}<br/>价格：CNY ${data[0]}<br/>性能：${data[1]}<br/>价值系数：${Number(data[2]).toFixed(2)}`;
      },
    },
    xAxis: {
      type: 'value',
      name: '价格 (CNY)',
      nameTextStyle: chartTheme.commonAxisName,
      axisLabel: chartTheme.commonAxisLabel,
      splitLine: { lineStyle: { color: chartTheme.tokens.splitLineStrongColor } },
    },
    yAxis: {
      type: 'value',
      name: '性能分数',
      nameTextStyle: chartTheme.commonAxisName,
      axisLabel: chartTheme.commonAxisLabel,
      splitLine: { lineStyle: { color: chartTheme.tokens.splitLineStrongColor } },
    },
    series: [
      {
        type: 'scatter',
        data: items.map((item) => [item.price, item.performanceScore, item.valueScore, item.name, item.brand]),
        symbolSize: 11,
        itemStyle: {
          color: (params: { data: [number, number, number, string, string] }) =>
            colorByBrand[params.data[4]] ?? '#64748B',
          opacity: 0.9,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 320 }} notMerge />;
}
