import { describe, expect, it } from 'vitest';

import { getChartThemeTokens } from '@/lib/echarts-theme';

function readAlpha(color: string): number {
  const rgbaMatch = color.match(/rgba?\(([^)]+)\)/i);
  if (!rgbaMatch) {
    return 1;
  }

  const channels = rgbaMatch[1].split(',').map((part) => Number.parseFloat(part.trim()));
  if (channels.length < 4 || Number.isNaN(channels[3])) {
    return 1;
  }
  return channels[3];
}

describe('chart theme tokens', () => {
  it('keeps dark mode chart text highly readable', () => {
    document.documentElement.dataset.theme = 'dark';
    const tokens = getChartThemeTokens();

    expect(readAlpha(tokens.chartTextColor)).toBeGreaterThanOrEqual(0.86);
    expect(readAlpha(tokens.axisLabelColor)).toBeGreaterThanOrEqual(0.82);
    expect(readAlpha(tokens.axisNameColor)).toBeGreaterThanOrEqual(0.72);
  });
});
