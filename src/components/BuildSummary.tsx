import type { HardwareCategory, HardwareItem } from '@/types/hardware';

interface BuildSummaryProps {
  selections: Partial<Record<HardwareCategory, HardwareItem>>;
  totalPrice: number;
  onRemove: (category: HardwareCategory) => void;
  onClear: () => void;
  onSave: () => void;
  onGoSaved: () => void;
  canSave: boolean;
}

const order: HardwareCategory[] = ['cpu', 'gpu', 'motherboard', 'ram', 'ssd', 'psu', 'case'];

export function BuildSummary({
  selections,
  totalPrice,
  onRemove,
  onClear,
  onSave,
  onGoSaved,
  canSave,
}: BuildSummaryProps) {
  return (
    <aside className="surface-panel sticky top-24">
      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-black/35">当前配置</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">配置摘要</h2>

      <div className="mt-4 space-y-2">
        {order.map((category) => {
          const item = selections[category];
          return (
            <div
              key={category}
              className="flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-[var(--surface-card-subtle)] px-3 py-3"
            >
              <div>
                <div className="text-[0.68rem] uppercase tracking-[0.18em] text-black/35">{category}</div>
                <div className="text-sm text-[#1d1d1f]">{item?.name ?? '未选择'}</div>
              </div>
              {item ? (
                <button
                  type="button"
                  onClick={() => onRemove(category)}
                  className="h-8 w-8 cursor-pointer rounded-full border border-black/10 text-black/45 transition hover:border-red-300 hover:text-red-500"
                >
                  ×
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-black/45">当前总价</div>
      <div className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">CNY {totalPrice}</div>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={onSave}
          className={`cursor-pointer rounded-full px-4 py-3 text-sm transition ${
            canSave ? 'bg-[#0071e3] text-white hover:bg-[#0066cc]' : 'bg-black/8 text-black/35'
          }`}
        >
          {canSave ? '保存方案' : '登录后可保存'}
        </button>
        <button
          type="button"
          onClick={onGoSaved}
          className="cursor-pointer rounded-full border border-black/10 px-4 py-3 text-sm text-[#1d1d1f] transition hover:border-[#0071e3]/25 hover:text-[#0071e3]"
        >
          查看已保存方案
        </button>
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer rounded-full border border-red-200 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
        >
          清空当前配置
        </button>
      </div>
    </aside>
  );
}
