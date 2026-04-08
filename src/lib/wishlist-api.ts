import { supabase, supabaseConfigError } from '@/lib/supabase';
import type { Database, WishlistItemSnapshot } from '@/types/supabase';
import type { SavedBuild, WishlistItem } from '@/types/wishlist';

type SavedBuildRow = Database['public']['Tables']['saved_builds']['Row'];

const missingSavedBuildsTablePattern = /could not find the table ['"`]?public\.saved_builds['"`]? in the schema cache/i;
const localSavedBuildsStorageKey = 'saved_builds_local_cache_v1';

let inMemoryLocalRows: SavedBuildRow[] = [];

function ensureSupabase() {
  if (!supabase) {
    throw new Error(supabaseConfigError);
  }

  return supabase;
}

function isMissingSavedBuildsTableError(message: string): boolean {
  return missingSavedBuildsTablePattern.test(message);
}

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readLocalRows(): SavedBuildRow[] {
  const storage = getLocalStorage();
  if (!storage) {
    return [...inMemoryLocalRows];
  }

  try {
    const raw = storage.getItem(localSavedBuildsStorageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as SavedBuildRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalRows(rows: SavedBuildRow[]) {
  inMemoryLocalRows = [...rows];
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(localSavedBuildsStorageKey, JSON.stringify(rows));
  } catch {
    // Ignore local storage quota/security errors.
  }
}

function makeLocalBuildId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `local-${crypto.randomUUID()}`;
  }

  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function toWishlistItem(snapshot: WishlistItemSnapshot): WishlistItem {
  return {
    hardwareId: snapshot.hardware_id,
    category: snapshot.category as WishlistItem['category'],
    name: snapshot.name,
    price: snapshot.price,
    jdUrl: snapshot.jd_url,
  };
}

function toSnapshot(item: WishlistItem): WishlistItemSnapshot {
  return {
    hardware_id: item.hardwareId,
    category: item.category,
    name: item.name,
    price: item.price,
    jd_url: item.jdUrl,
  };
}

function toSavedBuild(row: SavedBuildRow): SavedBuild {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    items: row.items.map(toWishlistItem),
    totalPrice: Number(row.total_price),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getLocalBuildsByUser(userId: string): SavedBuildRow[] {
  return readLocalRows()
    .filter((row) => row.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

function createLocalBuild(userId: string, name: string, items: WishlistItem[]): SavedBuildRow {
  const now = new Date().toISOString();
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const nextRow: SavedBuildRow = {
    id: makeLocalBuildId(),
    user_id: userId,
    name: name.trim(),
    items: items.map(toSnapshot),
    total_price: totalPrice,
    created_at: now,
    updated_at: now,
  };

  const rows = readLocalRows();
  rows.push(nextRow);
  writeLocalRows(rows);
  return nextRow;
}

function updateLocalBuild(buildId: string, updates: Partial<Pick<SavedBuild, 'name' | 'items' | 'totalPrice'>>): SavedBuildRow {
  const rows = readLocalRows();
  const index = rows.findIndex((row) => row.id === buildId);

  if (index === -1) {
    throw new Error('未找到要更新的装机方案。');
  }

  const current = rows[index];
  const next: SavedBuildRow = {
    ...current,
    name: updates.name !== undefined ? updates.name.trim() : current.name,
    items: updates.items !== undefined ? updates.items.map(toSnapshot) : current.items,
    total_price: updates.totalPrice !== undefined ? updates.totalPrice : current.total_price,
    updated_at: new Date().toISOString(),
  };

  rows[index] = next;
  writeLocalRows(rows);
  return next;
}

function deleteLocalBuild(buildId: string): void {
  const rows = readLocalRows();
  const nextRows = rows.filter((row) => row.id !== buildId);
  if (nextRows.length !== rows.length) {
    writeLocalRows(nextRows);
  }
}

export async function getSavedBuilds(userId: string): Promise<SavedBuild[]> {
  if (!supabase) {
    return getLocalBuildsByUser(userId).map(toSavedBuild);
  }

  const { data, error } = await ensureSupabase()
    .from('saved_builds')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    if (isMissingSavedBuildsTableError(error.message)) {
      return getLocalBuildsByUser(userId).map(toSavedBuild);
    }
    throw new Error(error.message);
  }

  const rows = (data ?? []) as SavedBuildRow[];
  return rows.map(toSavedBuild);
}

export async function createBuild(userId: string, name: string, items: WishlistItem[]): Promise<SavedBuild> {
  if (!supabase) {
    return toSavedBuild(createLocalBuild(userId, name, items));
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const { data, error } = await ensureSupabase()
    .from('saved_builds')
    .insert({
      user_id: userId,
      name: name.trim(),
      items: items.map(toSnapshot),
      total_price: totalPrice,
    })
    .select('*')
    .single();

  if (error) {
    if (isMissingSavedBuildsTableError(error.message)) {
      return toSavedBuild(createLocalBuild(userId, name, items));
    }
    throw new Error(error.message);
  }

  return toSavedBuild(data as SavedBuildRow);
}

export async function updateBuild(
  buildId: string,
  updates: Partial<Pick<SavedBuild, 'name' | 'items' | 'totalPrice'>>
): Promise<SavedBuild> {
  if (!supabase) {
    return toSavedBuild(updateLocalBuild(buildId, updates));
  }

  const payload: Database['public']['Tables']['saved_builds']['Update'] = {};

  if (updates.name !== undefined) {
    payload.name = updates.name.trim();
  }

  if (updates.items !== undefined) {
    payload.items = updates.items.map(toSnapshot);
  }

  if (updates.totalPrice !== undefined) {
    payload.total_price = updates.totalPrice;
  }

  const { data, error } = await ensureSupabase()
    .from('saved_builds')
    .update(payload)
    .eq('id', buildId)
    .select('*')
    .single();

  if (error) {
    if (isMissingSavedBuildsTableError(error.message)) {
      return toSavedBuild(updateLocalBuild(buildId, updates));
    }
    throw new Error(error.message);
  }

  return toSavedBuild(data as SavedBuildRow);
}

export async function deleteBuild(buildId: string): Promise<void> {
  if (!supabase) {
    deleteLocalBuild(buildId);
    return;
  }

  const { error } = await ensureSupabase().from('saved_builds').delete().eq('id', buildId);

  if (error) {
    if (isMissingSavedBuildsTableError(error.message)) {
      deleteLocalBuild(buildId);
      return;
    }
    throw new Error(error.message);
  }
}
