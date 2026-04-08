import type { CategoryMeta, HardwareCategory } from '@/types/hardware';

interface CategoryTabsProps {
  categories: CategoryMeta[];
  active: HardwareCategory;
  selectedNames: Partial<Record<HardwareCategory, string>>;
  onChange: (category: HardwareCategory) => void;
}

export function CategoryTabs({ categories, active, selectedNames, onChange }: CategoryTabsProps) {
  return (
    <div className="category-tabs-scroll flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => {
        const isActive = category.category === active;
        return (
          <button
            key={category.category}
            type="button"
            onClick={() => onChange(category.category)}
            aria-label={`切换到${category.displayName}`}
            className={`min-w-[180px] cursor-pointer rounded-[1.4rem] border px-4 py-3 text-left transition ${
              isActive
                ? 'border-[#0071e3]/20 bg-[#0071e3]/8 text-[#1d1d1f] shadow-[0_16px_38px_rgba(0,113,227,0.08)]'
                : 'border-black/6 bg-[var(--surface-card-subtle)] text-[#1d1d1f] hover:border-black/14 hover:bg-[var(--surface-card-subtle-hover)]'
            }`}
          >
            <div className="text-[0.68rem] uppercase tracking-[0.18em] text-black/35">{category.displayName}</div>
            <div className="mt-2 truncate text-sm">{selectedNames[category.category] ?? '未选择'}</div>
          </button>
        );
      })}
    </div>
  );
}
