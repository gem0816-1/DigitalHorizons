import type { SocSpec } from '@/types/soc';

interface SocSelectorProps {
  value: string;
  options: SocSpec[];
  disabledIds: string[];
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SocSelector({ value, options, disabledIds, onChange, onClear }: SocSelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-[1.3rem] border border-black/6 bg-[var(--surface-card-subtle)] p-2">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-shell rounded-[1rem] border-none px-3 py-2 text-sm shadow-none"
      >
        <option value="">选择 SoC</option>
        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
            disabled={disabledIds.includes(option.id) && option.id !== value}
          >
            {option.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-label="Clear selected SoC"
        onClick={onClear}
        className="h-9 w-9 cursor-pointer rounded-full border border-black/10 text-black/42 transition hover:border-black/20 hover:text-black/70"
      >
        ×
      </button>
    </div>
  );
}
