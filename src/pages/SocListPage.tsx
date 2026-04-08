import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { GlowCard } from '@/components/GlowCard';
import { getSocList } from '@/lib/data-loader';

export function SocListPage() {
  const socList = getSocList();
  const [manufacturerFilter, setManufacturerFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  const manufacturers = useMemo(() => ['all', ...new Set(socList.map((soc) => soc.manufacturer))], [socList]);

  const filtered = socList.filter((soc) => {
    const manufacturerMatch = manufacturerFilter === 'all' || soc.manufacturer === manufacturerFilter;
    const tierMatch = tierFilter === 'all' || soc.category === tierFilter;
    return manufacturerMatch && tierMatch;
  });

  return (
    <div className="space-y-6">
      <section className="hero-frame">
        <div className="max-w-3xl">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-black/38">芯片库</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">芯片详细信息</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-black/60 sm:text-base">一站式CPU详细信息</p>
        </div>
      </section>

      <section className="surface-panel space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="section-kicker">筛选</div>
            <h2 className="section-heading mt-2 !text-2xl sm:!text-3xl">快速找到目标芯片区间</h2>
          </div>
          <div className="text-sm text-black/52">共 {filtered.length} 条结果</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={manufacturerFilter}
            onChange={(event) => setManufacturerFilter(event.target.value)}
            className="field-shell"
          >
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer === 'all' ? '全部厂商' : manufacturer}
              </option>
            ))}
          </select>
          <select value={tierFilter} onChange={(event) => setTierFilter(event.target.value)} className="field-shell">
            <option value="all">全部档位</option>
            <option value="flagship">旗舰</option>
            <option value="mid-range">中端</option>
            <option value="entry">入门</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((soc) => (
          <Link key={soc.id} to={`/soc/${soc.id}`} className="block">
            <GlowCard className="flex h-full flex-col justify-between">
              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.18em] text-black/35">{soc.manufacturer}</div>
                <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">{soc.name}</div>
                <div className="mt-3 text-sm text-black/58">定位：{soc.category}</div>
              </div>
              <div className="mt-8 flex items-end justify-between border-t border-black/5 pt-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-black/35">AnTuTu</div>
                  <div className="mt-2 text-xl font-semibold text-[#0071e3]">{soc.antutuScore.toLocaleString()}</div>
                </div>
                <div className="text-sm text-black/45">查看详情</div>
              </div>
            </GlowCard>
          </Link>
        ))}
      </section>
    </div>
  );
}
