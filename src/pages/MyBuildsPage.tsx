import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { GlowCard } from '@/components/GlowCard';
import { useAuth } from '@/hooks/useAuth';
import { deleteBuild, getSavedBuilds } from '@/lib/wishlist-api';
import type { SavedBuild } from '@/types/wishlist';

export function MyBuildsPage() {
  const { user, loading } = useAuth();
  const [builds, setBuilds] = useState<SavedBuild[]>([]);
  const [expandedId, setExpandedId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }
    void getSavedBuilds(user.id).then(setBuilds);
  }, [user]);

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (builds.length === 0) {
    return (
      <div className="space-y-6">
        <section className="hero-frame">
          <div className="max-w-3xl">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-black/38">已保存方案</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">我的装机方案</h1>
            <p className="mt-4 text-sm leading-6 text-black/60 sm:text-base">
              你还没有保存任何装机方案。先去装机页创建一套配置，这里就会显示出来。
            </p>
          </div>
        </section>
        <GlowCard>
          <button type="button" onClick={() => navigate('/builder')} className="pill-button">
            打开装机助手
          </button>
        </GlowCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="hero-frame">
        <div className="max-w-3xl">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-black/38">已保存方案</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">我的装机方案</h1>
          <p className="mt-4 text-sm leading-6 text-black/60 sm:text-base">
            在这里回看之前保存的硬件组合，重新载入到装机页，或者删除过时方案。
          </p>
        </div>
      </section>

      <section className="grid gap-4">
        {builds.map((build) => {
          const open = expandedId === build.id;
          return (
            <GlowCard key={build.id}>
              <button
                type="button"
                onClick={() => setExpandedId((prev) => (prev === build.id ? '' : build.id))}
                className="w-full cursor-pointer text-left"
              >
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">{build.name}</div>
                    <div className="mt-2 text-sm text-black/52">{new Date(build.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-lg font-semibold text-[#0071e3]">总价：CNY {build.totalPrice}</div>
                </div>
              </button>

              {open ? (
                <div className="mt-5 space-y-3 border-t border-black/5 pt-5">
                  {build.items.map((item) => (
                    <div
                      key={`${build.id}-${item.hardwareId}`}
                      className="rounded-[1.35rem] border border-black/5 bg-[var(--surface-card-subtle)] px-4 py-3 text-sm"
                    >
                      <div className="text-[#1d1d1f]">
                        {item.category}: {item.name}
                      </div>
                      <a href={item.jdUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-[#0071e3]">
                        京东链接
                      </a>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => navigate(`/builder?loadBuild=${build.id}`)} className="pill-button">
                      载入装机页
                    </button>
                    <button type="button" onClick={() => setDeletingId(build.id)} className="soft-button text-red-600">
                      删除
                    </button>
                  </div>
                </div>
              ) : null}
            </GlowCard>
          );
        })}
      </section>

      <ConfirmDialog
        open={Boolean(deletingId)}
        title="Delete saved build?"
        message="This action cannot be undone."
        confirmText="Delete"
        onCancel={() => setDeletingId('')}
        onConfirm={async () => {
          const targetId = deletingId;
          setDeletingId('');
          await deleteBuild(targetId);
          setBuilds((prev) => prev.filter((build) => build.id !== targetId));
        }}
      />
    </div>
  );
}
