export const chartPalette = ['#0f62fe', '#3b82f6', '#06b6d4', '#22c55e', '#f59e0b'];

const chartFontFamily = '"SF Pro Text", "PingFang SC", "Microsoft YaHei", sans-serif';

type ChartThemeMode = 'light' | 'dark';

interface ChartThemeTokens {
  chartTextColor: string;
  axisLabelColor: string;
  axisNameColor: string;
  tooltipBackground: string;
  tooltipBorder: string;
  tooltipTextColor: string;
  tooltipShadow: string;
  splitLineColor: string;
  splitLineStrongColor: string;
  radarSplitAreaColors: string[];
  barLabelColor: string;
  hardwareTitleColor: string;
}

const lightChartTheme: ChartThemeTokens = {
  chartTextColor: '#7c8798',
  axisLabelColor: '#5f6b7a',
  axisNameColor: '#8b97a8',
  tooltipBackground: 'rgba(255,255,255,0.96)',
  tooltipBorder: 'rgba(15, 98, 254, 0.14)',
  tooltipTextColor: '#1d1d1f',
  tooltipShadow: '0 18px 48px rgba(15,23,42,0.12)',
  splitLineColor: 'rgba(148, 163, 184, 0.12)',
  splitLineStrongColor: 'rgba(148, 163, 184, 0.2)',
  radarSplitAreaColors: ['rgba(15,23,42,0.02)', 'rgba(15,23,42,0.04)'],
  barLabelColor: '#4a5565',
  hardwareTitleColor: '#344152',
};

const darkChartTheme: ChartThemeTokens = {
  chartTextColor: 'rgba(248, 250, 252, 0.9)',
  axisLabelColor: 'rgba(248, 250, 252, 0.86)',
  axisNameColor: 'rgba(248, 250, 252, 0.74)',
  tooltipBackground: 'rgba(18, 20, 24, 0.96)',
  tooltipBorder: 'rgba(120, 176, 255, 0.34)',
  tooltipTextColor: '#f8fafc',
  tooltipShadow: '0 18px 48px rgba(0,0,0,0.48)',
  splitLineColor: 'rgba(248, 250, 252, 0.14)',
  splitLineStrongColor: 'rgba(248, 250, 252, 0.22)',
  radarSplitAreaColors: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'],
  barLabelColor: 'rgba(248, 250, 252, 0.86)',
  hardwareTitleColor: 'rgba(248, 250, 252, 0.86)',
};

function resolveThemeMode(): ChartThemeMode {
  if (typeof document === 'undefined') {
    return 'light';
  }

  const root = document.documentElement;
  return root.dataset.theme === 'dark' || root.classList.contains('dark') ? 'dark' : 'light';
}

export function getChartThemeTokens(): ChartThemeTokens {
  return resolveThemeMode() === 'dark' ? darkChartTheme : lightChartTheme;
}

export function getChartTheme() {
  const tokens = getChartThemeTokens();

  return {
    tokens,
    commonChartTextStyle: {
      color: tokens.chartTextColor,
      fontFamily: chartFontFamily,
      fontSize: 12,
      fontWeight: 500,
    },
    commonAxisLabel: {
      color: tokens.axisLabelColor,
      fontFamily: chartFontFamily,
      fontSize: 12,
      fontWeight: 500,
    },
    commonAxisName: {
      color: tokens.axisNameColor,
      fontFamily: chartFontFamily,
      fontSize: 12,
      fontWeight: 600,
    },
    commonTooltip: {
      backgroundColor: tokens.tooltipBackground,
      borderColor: tokens.tooltipBorder,
      borderWidth: 1,
      textStyle: {
        color: tokens.tooltipTextColor,
        fontFamily: chartFontFamily,
        fontSize: 12,
        fontWeight: 500,
      },
      extraCssText: `border-radius:16px; box-shadow:${tokens.tooltipShadow};`,
    },
  };
}
