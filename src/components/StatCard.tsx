import { GlowCard } from '@/components/GlowCard';

interface StatCardProps {
  label: string;
  value: string;
  note?: string;
}

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <GlowCard className="h-full">
      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">{label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">{value}</div>
      {note ? <div className="mt-2 text-xs text-black/50">{note}</div> : null}
    </GlowCard>
  );
}
