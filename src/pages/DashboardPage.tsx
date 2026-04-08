import { GlowCard } from '@/components/GlowCard';
import { HardwareCategoryCard } from '@/components/HardwareCategoryCard';
import { StatCard } from '@/components/StatCard';
import { CategoryPriceChart } from '@/components/charts/CategoryPriceChart';
import { HardwareBubbleChart } from '@/components/charts/HardwareBubbleChart';
import { SocBarChart } from '@/components/charts/SocBarChart';
import { SocRadarChart } from '@/components/charts/SocRadarChart';
import { SocScatterChart } from '@/components/charts/SocScatterChart';
import {
  getCategoryMeta,
  getHardwareByCategory,
  getSocList,
  getTopHardwareByCategory,
} from '@/lib/data-loader';

const gpuBrandColors: Record<string, string> = {
  NVIDIA: '#3B82F6',
  AMD: '#EF4444',
};

const cpuBrandColors: Record<string, string> = {
  Intel: '#3B82F6',
  AMD: '#EF4444',
};

export function DashboardPage() {
  const socList = getSocList();
  const flagshipSoc = socList.filter((soc) => soc.category === 'flagship').slice(0, 4);

  const strongestSoc = [...socList].sort((a, b) => b.antutuScore - a.antutuScore)[0];
  const mostEfficientSoc = [...socList].sort((a, b) => b.powerEfficiency - a.powerEfficiency)[0];
  const newestSoc = [...socList].sort((a, b) => b.releaseYear - a.releaseYear)[0];

  const categories = getCategoryMeta();
  const gpuItems = getHardwareByCategory('gpu');
  const cpuItems = getHardwareByCategory('cpu');
  const categoryLabels = categories.map((meta) => meta.displayName);
  const averageByCategory = categories.map((meta) => {
    const items = getHardwareByCategory(meta.category);
    if (items.length === 0) {
      return 0;
    }
    return Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length);
  });
  const lowestByCategory = categories.map((meta) => {
    const items = getHardwareByCategory(meta.category);
    return items.length > 0 ? Math.min(...items.map((item) => item.price)) : 0;
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="editorial-grid">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="section-kicker">01 / 移动芯片</div>
            <h2 className="section-heading mt-2">移动 SoC 性能梯队</h2>
          </div>
        </div>

        <div className="metric-strip">
          <StatCard label="收录SOC数量" value={`${socList.length}`} />
          <StatCard label="最强CPU" value={strongestSoc?.name ?? '-'} />
          <StatCard label="最佳能效" value={mostEfficientSoc?.name ?? '-'} />
          <StatCard label="最新发布" value={newestSoc?.name ?? '-'} note={`${newestSoc?.releaseYear ?? ''}`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-[1.1fr_0.9fr]">
          <GlowCard className="min-h-[320px] sm:min-h-[360px]">
            <SocRadarChart socs={flagshipSoc} height={300} radius="56%" />
          </GlowCard>
          <GlowCard className="min-h-[320px] sm:min-h-[360px]">
            <SocBarChart socs={socList} />
          </GlowCard>
        </div>

        <GlowCard className="min-h-[400px] sm:min-h-[420px]">
          <div className="flex h-full flex-col">
            <h3 className="text-sm font-semibold tracking-[0.02em] text-black/62">性能与能效关系图</h3>
            <div className="mt-2 flex-1 sm:mt-3">
              <SocScatterChart socs={socList} />
            </div>
          </div>
        </GlowCard>
      </section>

      <section className="surface-panel-dark">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-black/38">02 / 桌面硬件</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">PC 硬件价值总览</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <GlowCard className="min-h-[360px]">
            <HardwareBubbleChart title="GPU 价值浮点图" items={gpuItems} colorByBrand={gpuBrandColors} />
          </GlowCard>
          <GlowCard className="min-h-[360px]">
            <HardwareBubbleChart title="CPU 价值浮点图" items={cpuItems} colorByBrand={cpuBrandColors} />
          </GlowCard>
        </div>

        <div className="mt-4">
          <GlowCard className="min-h-[360px]">
            <CategoryPriceChart labels={categoryLabels} average={averageByCategory} lowest={lowestByCategory} />
          </GlowCard>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <HardwareCategoryCard
              key={category.category}
              category={category.category}
              displayName={category.displayName}
              count={getHardwareByCategory(category.category).length}
              topItemName={getTopHardwareByCategory(category.category)?.name ?? 'N/A'}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
