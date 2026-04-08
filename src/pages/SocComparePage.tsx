import { useMemo, useState } from 'react';

import { ComparisonTable } from '@/components/ComparisonTable';
import { GlowCard } from '@/components/GlowCard';
import { SocSelector } from '@/components/SocSelector';
import { SocRadarChart } from '@/components/charts/SocRadarChart';
import { getSocList } from '@/lib/data-loader';

export function SocComparePage() {
  const socList = getSocList();
  const [selectedSlots, setSelectedSlots] = useState<Array<{ slotId: string; value: string }>>([
    { slotId: 'slot-1', value: '' },
    { slotId: 'slot-2', value: '' },
  ]);

  const selectedSocs = useMemo(() => {
    return selectedSlots
      .map((slot) => socList.find((soc) => soc.id === slot.value))
      .filter((soc): soc is (typeof socList)[number] => Boolean(soc));
  }, [selectedSlots, socList]);

  const updateSelector = (slotId: string, value: string) => {
    setSelectedSlots((prev) => {
      const next = [...prev];
      const targetIndex = next.findIndex((slot) => slot.slotId === slotId);
      if (targetIndex < 0) {
        return prev;
      }
      next[targetIndex] = { ...next[targetIndex], value };
      return next;
    });
  };

  const removeSelector = (slotId: string) => {
    setSelectedSlots((prev) => {
      const next = [...prev];
      const targetIndex = next.findIndex((slot) => slot.slotId === slotId);
      if (targetIndex < 0) {
        return prev;
      }
      if (next.length > 2 && !next[targetIndex]?.value) {
        next.splice(targetIndex, 1);
        return next;
      }
      next[targetIndex] = { ...next[targetIndex], value: '' };
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <section className="hero-frame">
        <div className="max-w-3xl">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-black/38">对比分析</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">芯片对比</h1>
        </div>
      </section>

      <section className="surface-panel space-y-4">
        <div className="section-kicker">选择器</div>
        <div className="grid gap-2">
          {selectedSlots.map((slot) => (
            <SocSelector
              key={slot.slotId}
              value={slot.value}
              options={socList}
              disabledIds={selectedSlots.map((item) => item.value).filter(Boolean)}
              onChange={(nextValue) => updateSelector(slot.slotId, nextValue)}
              onClear={() => removeSelector(slot.slotId)}
            />
          ))}
        </div>
        <button
          type="button"
          disabled={selectedSlots.length >= 4}
          onClick={() => setSelectedSlots((prev) => [...prev, { slotId: `slot-${Date.now()}`, value: '' }])}
          className="soft-button disabled:cursor-not-allowed disabled:opacity-40"
        >
          新增对比栏
        </button>
      </section>

      {selectedSocs.length >= 2 ? (
        <>
          <section className="surface-panel">
            <ComparisonTable socs={selectedSocs} />
          </section>
          <GlowCard className="min-h-[360px]">
            <SocRadarChart socs={selectedSocs} />
          </GlowCard>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {selectedSocs.map((soc) => (
              <GlowCard key={soc.id}>
                <h3 className="text-lg font-semibold text-[#1d1d1f]">{soc.name}</h3>
                <div className="mt-4 text-[0.72rem] uppercase tracking-[0.18em] text-[#1f8f55]">亮点</div>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-black/66">
                  {soc.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-5 text-[0.72rem] uppercase tracking-[0.18em] text-red-600">注意事项</div>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-black/66">
                  {soc.warnings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </GlowCard>
            ))}
          </section>
        </>
      ) : null}

      <GlowCard>
        <p className="text-black/58">至少选择两颗 SoC 后才会显示完整对比矩阵。</p>
      </GlowCard>
    </div>
  );
}
