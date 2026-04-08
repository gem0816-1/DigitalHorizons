import { describe, expect, it } from 'vitest';

import {
  getCategoryMeta,
  getHardwareByCategory,
  getSocById,
  getSocList,
  getTopHardwareByCategory,
} from '@/lib/data-loader';

describe('data-loader', () => {
  it('loads SoC list with at least eight entries', () => {
    const list = getSocList();
    expect(list.length).toBeGreaterThanOrEqual(8);
  });

  it('returns SoC by id', () => {
    const soc = getSocById('snapdragon-8-elite-gen-5');
    expect(soc).toBeDefined();
    expect(soc?.manufacturer).toBe('Qualcomm');
  });

  it('keeps hardware sorted by value score descending', () => {
    const items = getHardwareByCategory('gpu');
    const scores = items.map((item) => item.valueScore);
    const sorted = [...scores].sort((a, b) => b - a);
    expect(scores).toEqual(sorted);
  });

  it('returns category metadata for all seven categories', () => {
    const meta = getCategoryMeta();
    expect(meta).toHaveLength(7);
  });

  it('returns top hardware item for category', () => {
    const topGpu = getTopHardwareByCategory('gpu');
    expect(topGpu).toBeDefined();
    expect(topGpu?.category).toBe('gpu');
  });
});

