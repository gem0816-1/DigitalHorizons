import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { WishlistItem } from '@/types/wishlist';

const {
  deleteEqMock,
  deleteMock,
  fromMock,
  insertMock,
  insertSelectMock,
  insertSingleMock,
  orderMock,
  rootSelectMock,
  selectEqMock,
  singleAfterUpdateMock,
  supabaseMock,
  updateEqMock,
  updateMock,
  updateSelectMock,
} = vi.hoisted(() => ({
  deleteEqMock: vi.fn(),
  deleteMock: vi.fn(),
  fromMock: vi.fn(),
  insertMock: vi.fn(),
  insertSelectMock: vi.fn(),
  insertSingleMock: vi.fn(),
  orderMock: vi.fn(),
  rootSelectMock: vi.fn(),
  selectEqMock: vi.fn(),
  singleAfterUpdateMock: vi.fn(),
  supabaseMock: {
    from: vi.fn(),
  },
  updateEqMock: vi.fn(),
  updateMock: vi.fn(),
  updateSelectMock: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: supabaseMock,
  supabaseConfigError: 'Missing Supabase environment variables.',
}));

import { createBuild, deleteBuild, getSavedBuilds, updateBuild } from '@/lib/wishlist-api';

describe('wishlist-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();

    rootSelectMock.mockReturnValue({ eq: selectEqMock });
    selectEqMock.mockReturnValue({ order: orderMock });

    insertMock.mockReturnValue({ select: insertSelectMock });
    insertSelectMock.mockReturnValue({ single: insertSingleMock });

    updateMock.mockReturnValue({ eq: updateEqMock });
    updateEqMock.mockReturnValue({ select: updateSelectMock });
    updateSelectMock.mockReturnValue({ single: singleAfterUpdateMock });

    deleteMock.mockReturnValue({ eq: deleteEqMock });

    fromMock.mockReturnValue({
      delete: deleteMock,
      insert: insertMock,
      select: rootSelectMock,
      update: updateMock,
    });
    supabaseMock.from.mockImplementation(fromMock);
  });

  it('loads builds', async () => {
    orderMock.mockResolvedValueOnce({
      data: [
        {
          id: 'b1',
          user_id: 'u1',
          name: 'Gaming Build',
          items: [],
          total_price: 9999,
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
        },
      ],
      error: null,
    });

    const result = await getSavedBuilds('u1');

    expect(fromMock).toHaveBeenCalledWith('saved_builds');
    expect(selectEqMock).toHaveBeenCalledWith('user_id', 'u1');
    expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result[0]?.id).toBe('b1');
  });

  it('creates a build', async () => {
    const items: WishlistItem[] = [
      {
        hardwareId: 'rtx-4070-super',
        category: 'gpu',
        name: 'GeForce RTX 4070 SUPER',
        price: 4599,
        jdUrl: 'https://item.jd.com/100095431305.html',
      },
    ];

    insertSingleMock.mockResolvedValueOnce({
      data: {
        id: 'b2',
        user_id: 'u2',
        name: 'Creator Build',
        items: [
          {
            hardware_id: 'rtx-4070-super',
            category: 'gpu',
            name: 'GeForce RTX 4070 SUPER',
            price: 4599,
            jd_url: 'https://item.jd.com/100095431305.html',
          },
        ],
        total_price: 4599,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
      error: null,
    });

    const result = await createBuild('u2', 'Creator Build', items);

    expect(insertMock).toHaveBeenCalledWith({
      items: [
        {
          hardware_id: 'rtx-4070-super',
          category: 'gpu',
          name: 'GeForce RTX 4070 SUPER',
          price: 4599,
          jd_url: 'https://item.jd.com/100095431305.html',
        },
      ],
      name: 'Creator Build',
      total_price: 4599,
      user_id: 'u2',
    });
    expect(result.name).toBe('Creator Build');
    expect(result.items[0]?.hardwareId).toBe('rtx-4070-super');
  });

  it('falls back to local storage when saved_builds table is missing', async () => {
    const missingTableError = {
      message: "Could not find the table 'public.saved_builds' in the schema cache",
    };

    const items: WishlistItem[] = [
      {
        hardwareId: 'i5-14600k',
        category: 'cpu',
        name: 'Intel Core i5-14600K',
        price: 1999,
        jdUrl: 'https://item.jd.com/100061229919.html',
      },
    ];

    insertSingleMock.mockResolvedValueOnce({ data: null, error: missingTableError });

    const created = await createBuild('fallback-user', 'Fallback Build', items);

    expect(created.id.startsWith('local-')).toBe(true);
    expect(created.userId).toBe('fallback-user');

    orderMock.mockResolvedValueOnce({ data: null, error: missingTableError });
    const saved = await getSavedBuilds('fallback-user');

    expect(saved).toHaveLength(1);
    expect(saved[0]?.name).toBe('Fallback Build');
  });

  it('updates build by id', async () => {
    singleAfterUpdateMock.mockResolvedValueOnce({
      data: {
        id: 'b3',
        user_id: 'u3',
        name: 'Updated Name',
        items: [],
        total_price: 1,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
      error: null,
    });

    const result = await updateBuild('b3', { name: 'Updated Name' });

    expect(updateMock).toHaveBeenCalledWith({ name: 'Updated Name' });
    expect(updateEqMock).toHaveBeenCalledWith('id', 'b3');
    expect(result.name).toBe('Updated Name');
  });

  it('deletes build by id', async () => {
    deleteEqMock.mockResolvedValueOnce({ error: null });

    await deleteBuild('b4');

    expect(deleteMock).toHaveBeenCalled();
    expect(deleteEqMock).toHaveBeenCalledWith('id', 'b4');
  });
});
