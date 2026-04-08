import ReactECharts from 'echarts-for-react';

import { chartPalette, getChartTheme } from '@/lib/echarts-theme';
import type { SocSpec } from '@/types/soc';

interface SocRadarChartProps {
  socs: SocSpec[];
  height?: number;
  radius?: string;
}

export function SocRadarChart({ socs, height = 340, radius = '62%' }: SocRadarChartProps) {
  const chartTheme = getChartTheme();

  const option = {
    color: chartPalette,
    tooltip: chartTheme.commonTooltip,
    legend: {
      textStyle: chartTheme.commonChartTextStyle,
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
    },
    radar: {
      radius,
      indicator: [
        { name: 'AnTuTu', max: 2300000 },
        { name: 'GB 单核', max: 3200 },
        { name: 'GB 多核', max: 8000 },
        { name: 'GPU', max: 1000 },
        { name: '能效', max: 10 },
        { name: '温控', max: 10 },
      ],
      axisName: chartTheme.commonAxisName,
      splitLine: {
        lineStyle: {
          color: chartTheme.tokens.splitLineColor,
        },
      },
      splitArea: {
        areaStyle: {
          color: chartTheme.tokens.radarSplitAreaColors,
        },
      },
    },
    series: [
      {
        type: 'radar',
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.12 },
        symbolSize: 6,
        data: socs.map((soc) => ({
          name: soc.name,
          value: [
            soc.antutuScore,
            soc.geekbenchSingle,
            soc.geekbenchMulti,
            soc.gpuScore,
            soc.powerEfficiency,
            soc.thermalRating,
          ],
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
}
