import ReactECharts from 'echarts-for-react';

import { getChartTheme } from '@/lib/echarts-theme';
import type { SocSpec } from '@/types/soc';

interface SocBarChartProps {
  socs: SocSpec[];
}

export function SocBarChart({ socs }: SocBarChartProps) {
  const chartTheme = getChartTheme();
  const sorted = [...socs].sort((a, b) => b.antutuScore - a.antutuScore);

  const option = {
    tooltip: chartTheme.commonTooltip,
    grid: {
      left: 128,
      right: 24,
      top: 24,
      bottom: 24,
    },
    xAxis: {
      type: 'value',
      name: '综合性能',
      nameTextStyle: chartTheme.commonAxisName,
      axisLabel: chartTheme.commonAxisLabel,
      splitLine: { lineStyle: { color: chartTheme.tokens.splitLineColor } },
    },
    yAxis: {
      type: 'category',
      data: sorted.map((item) => item.name),
      axisLabel: chartTheme.commonAxisLabel,
    },
    series: [
      {
        type: 'bar',
        barWidth: 18,
        data: sorted.map((item) => item.antutuScore),
        label: {
          show: true,
          position: 'right',
          color: chartTheme.tokens.barLabelColor,
          fontFamily: chartTheme.commonAxisLabel.fontFamily,
          fontSize: 11,
          fontWeight: 600,
        },
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#0f62fe' },
              { offset: 1, color: '#60a5fa' },
            ],
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 360 }} notMerge />;
}
