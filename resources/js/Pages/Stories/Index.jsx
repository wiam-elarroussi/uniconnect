import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

function viewsLabel(t, n) {
  const v = n || 0;
  return v === 1 ? t('pages.stories.viewsOne', { n: v }) : t('pages.stories.viewsMany', { n: v });
}

export default function StoriesIndex({ stories = [] }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const form = useForm({ media: null });
  const [activeIndex, setActiveIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    form.post(route('stories.store'), { forceFormData: true });
  };

  const activeStory = useMemo(
    () => (activeIndex === null ? null : stories[activeIndex] || null),
    [activeIndex, stories],
  );

  const isOwnStory = activeStory && activeStory.user_id === auth.user.id;

  const closeViewer = () => {
    setActiveIndex(null);
    setProgress(0);
    setShowViewers(false);
  };

  const nextStory = useCallback(() => {
    setProgress(0);
    setActiveIndex((idx) => {
      if (idx === null) return null;
      if (idx >= stories.length - 1) return null;
      return idx + 1;
    });
  }, [stories.length]);

  const prevStory = useCallback(() => {
    setProgress(0);
    setActiveIndex((idx) => {
      if (idx === null) return null;
      return Math.max(0, idx - 1);
    });
  }, []);

  useEffect(() => {
    if (!activeStory) return;
    router.post(route('stories.view', activeStory.id), {}, { preserveScroll: true, preserveState: true });
    setProgress(0);

    const duration = activeStory.media_url?.match(/\.(mp4|webm|mov)$/i) ? 12000 : 7000;
    const step = 100;
    const increment = (step / duration) * 100;
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + increment;
        if (next >= 100) {
          clearInterval(timer);
          setProgress(0);
          setActiveIndex((idx) => {
            if (idx === null) return null;
            if (idx >= stories.length - 1) return null;
            return idx + 1;
          });
          return 100;
        }
        return next;
      });
    }, step);

    return () => clearInterval(timer);
  }, [activeStory, stories.length]);

  const react = (emoji) => {
    if (!activeStory) return;
    router.post(route('stories.react', activeStory.id), { reaction: emoji }, { preserveScroll: true, preserveState: true });
  };

  const deleteStory = (storyId, e) => {
    e?.stopPropagation?.();
    if (!confirm(t('pages.stories.confirmDelete'))) return;
    router.delete(route('stories.destroy', storyId), {
      preserveScroll: true,
      onSuccess: () => {
        setActiveIndex(null);
        setProgress(0);
      },
    });
  };

  const reactionEntries = Object.entries(activeStory?.reaction_counts || {});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') !== '1') return;
    const el = document.getElementById('story-publish-form');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const fileInput = el?.querySelector('input[type="file"]');
    fileInput?.focus();
  }, []);

  return (
    <AuthenticatedLayout header={<span className="font-semibold">{t('pages.stories.header')}</span>}>
      <Head title={t('pages.stories.headTitle')} />
      <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 pb-[max(1rem,env(safe-area-inset-bottom))] min-w-0">
        <form
          id="story-publish-form"
          onSubmit={submit}
          className="bg-white border rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3"
        >
          <input
            type="file"
            accept="image/*,video/*"
            className="text-xs sm:text-sm max-w-full"
            onChange={(e) => form.setData('media', e.target.files?.[0] || null)}
          />
          <button
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 w-full sm:w-auto"
            disabled={form.processing}
          >
            {t('pages.stories.publish')}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {stories.map((s, idx) => (
            <article
              key={s.id}
              className="bg-white border rounded-2xl overflow-hidden cursor-pointer relative"
              onClick={() => setActiveIndex(idx)}
            >
              {s.user_id === auth.user.id && (
                <button
                  type="button"
                  onClick={(e) => deleteStory(s.id, e)}
                  className="absolute top-2 right-2 z-10 px-2 py-1 text-xs rounded-lg bg-red-600 text-white font-semibold"
                >
                  {t('pages.stories.delete')}
                </button>
              )}
              <div className="p-3 text-sm font-semibold truncate">{s.user?.name}</div>
              {s.media_url?.match(/\.(mp4|webm|mov)$/i) ? (
                <video className="w-full max-h-[min(360px,50vh)] object-cover">
                  <source src={s.media_url} />
                </video>
              ) : (
                <img src={s.media_url} alt={t('pages.stories.altStory')} className="w-full max-h-[min(360px,50vh)] object-cover" />
              )}
              <div className="px-3 py-2 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
                <span>{viewsLabel(t, s.views_count || 0)}</span>
                <span>{s.viewed_by_me ? t('pages.stories.seen') : t('pages.stories.new')}</span>
              </div>
              {Object.keys(s.reaction_counts || {}).length > 0 && (
                <div className="px-3 pb-2 text-[10px] text-slate-600 flex flex-wrap gap-1">
                  {Object.entries(s.reaction_counts).map(([emoji, n]) => (
                    <span key={emoji}>
                      {emoji} {n}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {activeStory && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 sm:p-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md min-w-0">
            <div className="flex gap-1 mb-2 sm:mb-3 px-0.5">
              {stories.map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden min-w-[4px]">
                  <div
                    className="h-full bg-white rounded-full transition-[width] duration-75 ease-linear"
                    style={{
                      width: `${i < activeIndex ? 100 : i === activeIndex ? progress : 0}%`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="bg-black rounded-2xl overflow-hidden border border-white/20 relative">
              <button
                type="button"
                onClick={prevStory}
                className="sm:hidden absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 text-white text-2xl flex items-center justify-center"
                aria-label={t('pages.stories.prev')}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextStory}
                className="sm:hidden absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 text-white text-2xl flex items-center justify-center"
                aria-label={t('pages.stories.next')}
              >
                ›
              </button>

              <div className="p-2 sm:p-3 text-white text-sm font-semibold flex items-center justify-between gap-2 flex-wrap">
                <span className="truncate min-w-0 pr-2">{activeStory.user?.name}</span>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 flex-wrap justify-end">
                  {isOwnStory && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowViewers((v) => !v)}
                        className="text-xs px-2 py-1 rounded-lg bg-white/10 whitespace-nowrap"
                      >
                        {t('pages.stories.viewsModal', {
                          n: activeStory.viewers?.length ?? activeStory.views_count ?? 0,
                        })}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteStory(activeStory.id)}
                        className="text-xs px-2 py-1 rounded-lg bg-red-600/90"
                      >
                        {t('pages.stories.delete')}
                      </button>
                    </>
                  )}
                  <button type="button" onClick={closeViewer} className="text-white/80 text-xs px-2">
                    {t('pages.stories.close')}
                  </button>
                </div>
              </div>

              {showViewers && isOwnStory && Array.isArray(activeStory.viewers) && activeStory.viewers.length > 0 && (
                <div className="px-3 pb-2 max-h-32 overflow-y-auto border-b border-white/10">
                  <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">{t('pages.stories.whoSaw')}</p>
                  <ul className="space-y-1">
                    {activeStory.viewers.map((v) => (
                      <li key={`${v.id}-${v.seen_at}`} className="text-xs text-white/90 flex justify-between gap-2">
                        <span className="truncate">{v.name}</span>
                        <span className="shrink-0">{v.reaction || '—'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeStory.media_url?.match(/\.(mp4|webm|mov)$/i) ? (
                <video autoPlay muted controls className="w-full max-h-[min(70vh,520px)] object-contain sm:object-cover bg-black">
                  <source src={activeStory.media_url} />
                </video>
              ) : (
                <img
                  src={activeStory.media_url}
                  alt={t('pages.stories.altActive')}
                  className="w-full max-h-[min(70vh,520px)] object-contain sm:object-cover bg-black"
                />
              )}

              <div className="p-3 flex flex-col gap-2 text-white">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {['❤️', '🔥', '👏', '😍', '😂'].map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => react(e)}
                        className={`text-lg ${activeStory.my_reaction === e ? 'ring-2 ring-white rounded' : ''}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-white/70">{viewsLabel(t, activeStory.views_count || 0)}</span>
                </div>
                {reactionEntries.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-[11px] text-white/80">
                    {reactionEntries.map(([emoji, n]) => (
                      <span key={emoji}>
                        {emoji} {n}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={prevStory}
              className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 text-white text-3xl font-light"
              aria-label={t('pages.stories.prev')}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextStory}
              className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 text-white text-3xl font-light"
              aria-label={t('pages.stories.next')}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
