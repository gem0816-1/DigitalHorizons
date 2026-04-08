import { useState } from 'react';

import { GlowCard } from '@/components/GlowCard';
import { localizeHardwareDescription, localizeHardwareHighlight, localizeHardwareWarning } from '@/lib/hardware-copy';
import type { HardwareItem } from '@/types/hardware';

interface HardwareItemCardProps {
  item: HardwareItem;
  selected: boolean;
  onToggle: (item: HardwareItem) => void;
}

export function HardwareItemCard({ item, selected, onToggle }: HardwareItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlowCard className={`space-y-4 ${item.isWarning ? 'border-red-300 bg-red-50/40' : ''}`} key={item.id}>
      {item.isWarning ? (
        <div className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs text-red-600">风险商品</div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">{item.name}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/35">{item.brand}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tracking-[-0.03em] text-[#0071e3]">CNY {item.price}</div>
          {item.originalPrice ? <div className="text-xs text-black/35 line-through">CNY {item.originalPrice}</div> : null}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-black/58">
        <div>性价比：{item.valueScore}</div>
        <div>性能分：{item.performanceScore}</div>
      </div>
      <div className="space-y-1 text-xs text-black/58">
        {Object.entries(item.specs)
          .slice(0, 3)
          .map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {item.highlights.map((highlight) => (
          <span key={`${item.id}-${highlight}`} className="hardware-highlight-chip">
            {localizeHardwareHighlight(highlight)}
          </span>
        ))}
      </div>
      {item.warnings.length > 0 ? (
        <ul className="list-disc pl-4 text-xs text-red-600">
          {item.warnings.map((warning) => (
            <li key={warning}>{localizeHardwareWarning(warning)}</li>
          ))}
        </ul>
      ) : null}
      <button type="button" onClick={() => setExpanded((prev) => !prev)} className="cursor-pointer text-xs text-[#0071e3] hover:text-[#0066cc]">
        {expanded ? '收起详情' : '展开详情'}
      </button>
      {expanded ? <p className="text-sm text-black/62">{localizeHardwareDescription(item.description)}</p> : null}
      <div className="flex">
        <button
          type="button"
          onClick={() => onToggle(item)}
          className={`cursor-pointer rounded-full px-4 py-2.5 text-sm transition ${
            selected ? 'bg-[#eef7f1] text-[#1f8f55]' : 'bg-[#0071e3] text-white hover:bg-[#0066cc]'
          }`}
        >
          {selected ? '已选择' : '选择'}
        </button>
      </div>
    </GlowCard>
  );
}

