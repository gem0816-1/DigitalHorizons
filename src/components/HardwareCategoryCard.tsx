import { Link } from 'react-router-dom';

import { GlowCard } from '@/components/GlowCard';

interface HardwareCategoryCardProps {
  category: string;
  displayName: string;
  count: number;
  topItemName: string;
}

export function HardwareCategoryCard({
  category,
  displayName,
  count,
  topItemName,
}: HardwareCategoryCardProps) {
  return (
    <Link to={`/builder?category=${category}`} className="cursor-pointer">
      <GlowCard className="h-full">
        <div className="text-xs uppercase tracking-[0.18em] text-black/35">分类</div>
        <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">{displayName}</div>
        <div className="mt-2 text-sm text-black/58">已收录 {count} 款产品</div>
        <div className="mt-6 border-t border-black/5 pt-4 text-sm text-[#0071e3]">当前高性价比：{topItemName}</div>
      </GlowCard>
    </Link>
  );
}
