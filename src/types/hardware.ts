export type HardwareCategory = 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'ssd' | 'psu' | 'case';

export interface HardwareItem {
  id: string;
  category: HardwareCategory;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  valueScore: number;
  performanceScore: number;
  specs: Record<string, string>;
  jdUrl: string;
  description: string;
  highlights: string[];
  warnings: string[];
  isWarning: boolean;
  imageUrl?: string;
}

export interface CategoryMeta {
  category: HardwareCategory;
  displayName: string;
  icon: string;
  description: string;
}
