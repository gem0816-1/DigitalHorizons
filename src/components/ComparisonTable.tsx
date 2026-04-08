import type { SocSpec } from '@/types/soc';

interface ComparisonTableProps {
  socs: SocSpec[];
}

const metricRows: Array<{
  label: string;
  getValue: (soc: SocSpec) => string | number;
  numeric?: boolean;
}> = [
  { label: '厂商', getValue: (soc) => soc.manufacturer },
  { label: '制程', getValue: (soc) => soc.processNode },
  { label: 'CPU', getValue: (soc) => soc.cpuConfig },
  { label: 'GPU', getValue: (soc) => soc.gpuName },
  { label: 'NPU', getValue: (soc) => soc.npuName },
  { label: 'AnTuTu', getValue: (soc) => soc.antutuScore, numeric: true },
  { label: 'GB 单核', getValue: (soc) => soc.geekbenchSingle, numeric: true },
  { label: 'GB 多核', getValue: (soc) => soc.geekbenchMulti, numeric: true },
  { label: 'GPU 分数', getValue: (soc) => soc.gpuScore, numeric: true },
  { label: '能效', getValue: (soc) => soc.powerEfficiency, numeric: true },
  { label: '温控', getValue: (soc) => soc.thermalRating, numeric: true },
  { label: '定位', getValue: (soc) => soc.category },
];

export function ComparisonTable({ socs }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-[1.5rem] border border-black/6 bg-[var(--surface-card-subtle)]">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-black/6 px-4 py-3 text-left text-black/45">指标</th>
            {socs.map((soc) => (
              <th key={soc.id} className="border-b border-black/6 px-4 py-3 text-left text-[#1d1d1f]">
                {soc.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metricRows.map((row) => {
            const values = socs.map((soc) => row.getValue(soc));
            const bestNumericValue = row.numeric
              ? Math.max(...(values as number[]))
              : Number.NEGATIVE_INFINITY;

            return (
              <tr key={row.label}>
                <td className="border-b border-black/5 px-4 py-3 text-black/54">{row.label}</td>
                {values.map((value, index) => {
                  const isBest = row.numeric && value === bestNumericValue;
                  return (
                    <td
                      key={`${row.label}-${socs[index]?.id}`}
                      className={`border-b border-black/5 px-4 py-3 ${isBest ? 'font-semibold text-[#0071e3]' : 'text-[#1d1d1f]'}`}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
