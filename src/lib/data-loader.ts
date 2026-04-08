import categoryMetaData from '@/data/category-meta.json';
import caseData from '@/data/hardware-case.json';
import cpuData from '@/data/hardware-cpu.json';
import gpuData from '@/data/hardware-gpu.json';
import motherboardData from '@/data/hardware-motherboard.json';
import psuData from '@/data/hardware-psu.json';
import ramData from '@/data/hardware-ram.json';
import ssdData from '@/data/hardware-ssd.json';
import socData from '@/data/soc-list.json';
import type { CategoryMeta, HardwareCategory, HardwareItem } from '@/types/hardware';
import type { SocSpec } from '@/types/soc';

const hardwareByCategoryMap: Record<HardwareCategory, HardwareItem[]> = {
  cpu: cpuData as unknown as HardwareItem[],
  gpu: gpuData as unknown as HardwareItem[],
  motherboard: motherboardData as unknown as HardwareItem[],
  ram: ramData as unknown as HardwareItem[],
  ssd: ssdData as unknown as HardwareItem[],
  psu: psuData as unknown as HardwareItem[],
  case: caseData as unknown as HardwareItem[],
};

export function getSocList(): SocSpec[] {
  return socData as SocSpec[];
}

export function getSocById(id: string): SocSpec | undefined {
  return getSocList().find((item) => item.id === id);
}

export function getHardwareByCategory(category: HardwareCategory): HardwareItem[] {
  const items = hardwareByCategoryMap[category] ?? [];
  return [...items].sort((a, b) => b.valueScore - a.valueScore);
}

export function getCategoryMeta(): CategoryMeta[] {
  return categoryMetaData as CategoryMeta[];
}

export function getTopHardwareByCategory(category: HardwareCategory): HardwareItem | undefined {
  return getHardwareByCategory(category)[0];
}

export function getAllHardwareItems(): HardwareItem[] {
  return (Object.keys(hardwareByCategoryMap) as HardwareCategory[]).flatMap((category) =>
    getHardwareByCategory(category)
  );
}
