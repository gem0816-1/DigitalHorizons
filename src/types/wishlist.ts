import type { HardwareCategory } from '@/types/hardware';

export interface WishlistItem {
  hardwareId: string;
  category: HardwareCategory;
  name: string;
  price: number;
  jdUrl: string;
}

export interface SavedBuild {
  id: string;
  userId: string;
  name: string;
  items: WishlistItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
