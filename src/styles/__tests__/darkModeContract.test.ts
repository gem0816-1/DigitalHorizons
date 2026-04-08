import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const cardFiles = [
  'src/pages/BuilderPage.tsx',
  'src/components/BuildSummary.tsx',
  'src/components/CategoryTabs.tsx',
  'src/components/ComparisonTable.tsx',
  'src/components/SocSelector.tsx',
  'src/pages/MyBuildsPage.tsx',
  'src/pages/SocDetailPage.tsx',
];

describe('dark mode card surface contract', () => {
  const cssPath = path.resolve(process.cwd(), 'src/index.css');

  it('avoids hardcoded light card backgrounds in card-like containers', () => {
    const offenders: string[] = [];

    for (const relativePath of cardFiles) {
      const absolutePath = path.resolve(process.cwd(), relativePath);
      const source = fs.readFileSync(absolutePath, 'utf-8');

      if (/bg-white(?:\/\d+)?/.test(source)) {
        offenders.push(relativePath);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('uses slate dark surfaces for cards in dark mode', () => {
    const source = fs.readFileSync(cssPath, 'utf-8');

    expect(source).toContain("--surface-card: #1e293b;");
    expect(source).toContain("--surface-card-subtle: #1f2937;");
  });

  it('keeps muted text in dark mode on a dedicated softer token', () => {
    const source = fs.readFileSync(cssPath, 'utf-8');

    expect(source).toContain(":root[data-theme='dark'] .text-black\\/35");
    expect(source).toContain(":root[data-theme='dark'] .text-slate-500");
    expect(source).toContain('color: var(--page-soft);');
  });
});
