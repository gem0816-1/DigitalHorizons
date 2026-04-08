import { Link, useParams } from 'react-router-dom';

import { GlowCard } from '@/components/GlowCard';
import { getSocById, getSocList } from '@/lib/data-loader';

export function SocDetailPage() {
  const { id } = useParams();
  const soc = id ? getSocById(id) : undefined;

  if (!soc) {
    return (
      <GlowCard>
        <h1 className="text-xl font-semibold text-[#1d1d1f]">未找到 SoC</h1>
        <p className="mt-2 text-black/58">请求的 SoC 标识不存在。</p>
        <Link to="/soc" className="mt-4 inline-block text-[#0071e3]">
          返回 SoC 图谱
        </Link>
      </GlowCard>
    );
  }

  const maxAntutu = Math.max(...getSocList().map((item) => item.antutuScore));
  const metricCards = [
    { label: 'CPU', value: soc.cpuConfig, percent: 85 },
    { label: 'GPU', value: soc.gpuName, percent: (soc.gpuScore / 1000) * 100 },
    { label: 'NPU', value: soc.npuName, percent: 80 },
    { label: 'AnTuTu', value: soc.antutuScore.toLocaleString(), percent: (soc.antutuScore / maxAntutu) * 100 },
    { label: 'Efficiency', value: String(soc.powerEfficiency), percent: soc.powerEfficiency * 10 },
    { label: 'Thermals', value: String(soc.thermalRating), percent: soc.thermalRating * 10 },
  ];

  return (
    <div className="space-y-6">
      <section className="hero-frame">
        <div className="max-w-3xl">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-black/38">{soc.manufacturer}</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">{soc.name}</h1>
          <p className="mt-4 text-sm leading-6 text-black/60 sm:text-base">
            {soc.manufacturer} · {soc.processNode} · {soc.category}
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric) => (
          <GlowCard key={metric.label}>
            <div className="text-[0.72rem] uppercase tracking-[0.18em] text-black/35">{metric.label}</div>
            <div className="mt-3 text-lg font-semibold text-[#1d1d1f]">{metric.value}</div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/6">
              <div className="h-full rounded-full bg-[#0071e3]" style={{ width: `${Math.max(6, Math.min(100, metric.percent))}%` }} />
            </div>
          </GlowCard>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <GlowCard>
          <h2 className="text-xl font-semibold text-[#1d1d1f]">亮点</h2>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-[#1f8f55]">
            {soc.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-[#1d1d1f]">注意事项</h2>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-red-600">
            {soc.warnings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </GlowCard>

        <GlowCard>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#1d1d1f]">搭载设备</h2>
              <p className="mt-2 text-sm text-black/55">列出使用这颗 SoC 的代表设备。</p>
            </div>
            <Link to="/soc/compare" className="soft-button">
              去做芯片对比
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {soc.devices.map((device) => (
              <div key={device.name} className="rounded-[1.4rem] border border-black/5 bg-[var(--surface-card-subtle)] p-4">
                <div className="font-medium text-[#1d1d1f]">{device.name}</div>
                <div className="mt-1 text-sm text-black/58">{device.brand}</div>
                <div className="mt-3 text-xs uppercase tracking-[0.18em] text-black/35">{device.releaseDate}</div>
              </div>
            ))}
          </div>
        </GlowCard>
      </section>
    </div>
  );
}
