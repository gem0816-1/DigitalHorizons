import ReactECharts from 'echarts-for-react';

import { getChartTheme } from '@/lib/echarts-theme';

interface CategoryPriceChartProps {
  labels: string[];
  average: number[];
  lowest: number[];
}

export function CategoryPriceChart({ labels, average, lowest }: CategoryPriceChartProps) {
  const chartTheme = getChartTheme();

  const option = {
    tooltip: chartTheme.commonTooltip,
    legend: {
      data: ['平均价格', '最低价格'],
      bottom: 0,
      textStyle: chartTheme.commonAxisLabel,
    },
    grid: {
      left: 48,
      right: 24,
      top: 24,
      bottom: 56,
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: chartTheme.commonAxisLabel,
      axisLine: { lineStyle: { color: chartTheme.tokens.splitLineStrongColor } },
    },
    yAxis: {
      type: 'value',
      name: '价格',
      nameTextStyle: chartTheme.commonAxisName,
      axisLabel: chartTheme.commonAxisLabel,
      splitLine: { lineStyle: { color: chartTheme.tokens.splitLineColor } },
    },
    series: [
      {
        name: '平均价格',
        type: 'bar',
        barMaxWidth: 24,
        data: average,
        itemStyle: {
          color: '#0f62fe',
          borderRadius: [8, 8, 0, 0],
        },
      },
      {
        name: '最低价格',
        type: 'line',
        smooth: true,
        data: lowest,
        symbolSize: 8,
        lineStyle: { width: 3, color: '#22c55e' },
        itemStyle: { color: '#22c55e' },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 360 }} notMerge />;
}
