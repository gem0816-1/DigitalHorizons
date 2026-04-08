import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BuildSummary } from '@/components/BuildSummary';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { HardwareItemCard } from '@/components/HardwareItemCard';
import { NameDialog } from '@/components/NameDialog';
import { Toast } from '@/components/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useBuildState } from '@/hooks/useBuildState';
import { getCategoryMeta, getHardwareByCategory } from '@/lib/data-loader';
import { createBuild, getSavedBuilds } from '@/lib/wishlist-api';
import type { HardwareCategory } from '@/types/hardware';

export function BuilderPage() {
  const categories = getCategoryMeta();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<HardwareCategory>('cpu');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, totalPrice, clearAll, removeItem, selectItem, loadState } = useBuildState();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.some((item) => item.category === category)) {
      setActiveCategory(category as HardwareCategory);
    }
  }, [categories, searchParams]);

  useEffect(() => {
    const loadBuildId = searchParams.get('loadBuild');
    if (!loadBuildId || !user) {
      return;
    }
    void (async () => {
      const saved = await getSavedBuilds(user.id);
      const target = saved.find((build) => build.id === loadBuildId);
      if (!target) {
        return;
      }
      const nextState = target.items.reduce((acc, item) => {
        const candidates = getHardwareByCategory(item.category);
        const matched = candidates.find((candidate) => candidate.id === item.hardwareId);
        if (matched) {
          acc[item.category] = matched;
        }
        return acc;
      }, {} as ReturnType<typeof useBuildState>['state']);
      loadState(nextState);
      searchParams.delete('loadBuild');
      setSearchParams(searchParams);
    })();
  }, [loadState, searchParams, setSearchParams, user]);

  useEffect(() => {
    if (!toast.open) {
      return;
    }
    const timeout = window.setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast.open]);

  const hardwareItems = useMemo(() => getHardwareByCategory(activeCategory), [activeCategory]);
  const selectedNames = useMemo(() => {
    const next: Partial<Record<HardwareCategory, string>> = {};
    for (const [category, item] of Object.entries(state)) {
      next[category as HardwareCategory] = item?.name;
    }
    return next;
  }, [state]);

  const canSave = Boolean(user) && Object.keys(state).length > 0;

  return (
    <div className="space-y-6" data-testid="builder-page">
      <section className="hero-frame">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-black/38">装机规划</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">PC 装机助手</h1>
          </div>
          <div className="rounded-[1.6rem] border border-black/6 bg-[var(--surface-card-subtle)] p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.18em] text-black/35">当前分类</div>
            <div className="mt-2 text-2xl font-semibold text-[#1d1d1f]">{activeCategory.toUpperCase()}</div>
            <div className="mt-3 text-sm text-black/58">当前分类下共有 {hardwareItems.length} 个候选组件。</div>
          </div>
        </div>
      </section>

      <section className="surface-panel space-y-4">
        <CategoryTabs
          categories={categories}
          active={activeCategory}
          selectedNames={selectedNames}
          onChange={(category) => {
            setActiveCategory(category);
            setSearchParams({ category });
          }}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4">
          {hardwareItems.map((item) => (
            <HardwareItemCard
              key={item.id}
              item={item}
              selected={state[activeCategory]?.id === item.id}
              onToggle={(targetItem) => {
                if (state[targetItem.category]?.id === targetItem.id) {
                  removeItem(targetItem.category);
                  return;
                }
                selectItem(targetItem.category, targetItem);
              }}
            />
          ))}
        </div>

        <BuildSummary
          selections={state}
          totalPrice={totalPrice}
          onRemove={removeItem}
          onClear={() => setOpenConfirm(true)}
          onSave={() => {
            if (!user) {
              navigate('/login');
              return;
            }
            if (!canSave) {
              setToast({ open: true, message: '请至少先选择一件硬件。', type: 'error' });
              return;
            }
            setOpenNameDialog(true);
          }}
          onGoSaved={() => navigate('/my-builds')}
          canSave={canSave}
        />
      </section>

      <ConfirmDialog
        open={openConfirm}
        title="清空当前已选组件？"
        message="此操作会移除当前配置中的所有已选硬件。"
        confirmText="确认清空"
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          clearAll();
          setOpenConfirm(false);
        }}
      />

      <NameDialog
        open={openNameDialog}
        onCancel={() => setOpenNameDialog(false)}
        onConfirm={async (name) => {
          try {
            if (!user) {
              navigate('/login');
              return;
            }
            const items = Object.values(state)
              .filter(Boolean)
              .map((item) => ({
                hardwareId: item.id,
                category: item.category,
                name: item.name,
                price: item.price,
                jdUrl: item.jdUrl,
              }));
            await createBuild(user.id, name, items);
            setToast({ open: true, message: '装机方案已保存。', type: 'success' });
          } catch (error) {
            setToast({
              open: true,
              message: error instanceof Error ? error.message : '保存装机方案失败。',
              type: 'error',
            });
          } finally {
            setOpenNameDialog(false);
          }
        }}
      />
      <Toast open={toast.open} message={toast.message} type={toast.type} />
    </div>
  );
}
