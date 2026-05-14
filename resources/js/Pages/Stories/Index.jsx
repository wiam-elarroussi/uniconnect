import { DASH_CSS } from '@/Components/Dashboard/dashStyles';
import FeedOverlays from '@/Components/Layout/FeedOverlays';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useFeedUI } from '@/contexts/FeedUIContext';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MOOD_STORAGE_KEY = 'uniconnect.dashboard.mood';

const THEME_VARS = {
  dark: {
    '--bg-card': 'rgba(10,12,28,0.85)',
    '--bg-glass': 'rgba(255,255,255,0.04)',
    '--bg-glass2': 'rgba(255,255,255,0.07)',
    '--border': 'rgba(255,255,255,0.07)',
    '--border-glow': 'rgba(99,179,237,0.30)',
    '--panel-bg': 'rgb(12, 14, 26)',
    '--comments-bg': 'rgba(0,0,0,0.20)',
    '--shadow-strong': 'rgba(0,0,0,0.40)',
    '--input-bg': 'rgba(255,255,255,0.03)',
    '--input-border': 'rgba(255,255,255,0.07)',
    '--input-placeholder': '#4a5578',
    '--text-1': '#f0f4ff',
    '--text-2': '#8b9cc8',
    '--text-3': '#4a5578',
  },
  light: {
    '--bg-card': 'rgba(255,255,255,0.80)',
    '--bg-glass': 'rgba(2,6,23,0.03)',
    '--bg-glass2': 'rgba(2,6,23,0.05)',
    '--border': 'rgba(2,6,23,0.10)',
    '--border-glow': 'rgba(37,99,235,0.18)',
    '--panel-bg': 'rgb(255, 255, 255)',
    '--comments-bg': 'rgba(2,6,23,0.035)',
    '--shadow-strong': 'rgba(2,6,23,0.14)',
    '--input-bg': 'rgba(2,6,23,0.02)',
    '--input-border': 'rgba(2,6,23,0.08)',
    '--input-placeholder': '#64748b',
    '--text-1': '#0f172a',
    '--text-2': '#334155',
    '--text-3': '#64748b',
  },
};

function viewsLabel(t, n) {
  const v = n || 0;
  return v === 1 ? t('pages.stories.viewsOne', { n: v }) : t('pages.stories.viewsMany', { n: v });
}

function storyTimerDurationMs(story) {
  if (!story) return 8000;
  if (!story.media_url) return 22000;
  return 8000;
}

function isVideoStory(story) {
  return Boolean(story?.media_url?.match(/\.(mp4|webm|mov)$/i));
}

/**
 * @param {{ stories: object[] }} props
 */
function StoriesContent({ stories = [] }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const { openCreateMenu, openStoryCreate, openComposer } = useFeedUI();
  const [activeIndex, setActiveIndex] = useState(null);
  const [viewerStories, setViewerStories] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const storyVideoRef = useRef(/** @type {HTMLVideoElement | null} */ (null));
  const storiesRef = useRef(stories);
  storiesRef.current = stories;

  const setPaused = useCallback((v) => {
    isPausedRef.current = v;
    setIsPaused(v);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const n = p.get('new');
    const c = p.get('create');
    if (n === '1' || c === 'menu') {
      openCreateMenu();
      window.history.replaceState({}, '', window.location.pathname);
    } else if (c === 'story') {
      openStoryCreate();
      window.history.replaceState({}, '', window.location.pathname);
    } else if (c === 'post') {
      openComposer();
      window.history.replaceState({}, '', window.location.pathname);
    }
    // one-shot: query params to open the right overlay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeStory = useMemo(() => {
    if (activeIndex === null) return null;
    const list = viewerStories ?? storiesRef.current;
    return list[activeIndex] ?? null;
  }, [activeIndex, viewerStories, stories]);

  const isOwnStory = activeStory && activeStory.user_id === auth.user.id;

  const closeViewer = () => {
    setActiveIndex(null);
    setViewerStories(null);
    setProgress(0);
    setShowViewers(false);
    setPaused(false);
  };

  const openViewerAt = useCallback((idx) => {
    const list = storiesRef.current;
    const clicked = list[idx];
    if (!clicked) return;
    const sameUser = list
      .filter((s) => s.user_id === clicked.user_id)
      .slice()
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    const localIdx = sameUser.findIndex((s) => s.id === clicked.id);
    setViewerStories(sameUser);
    setActiveIndex(localIdx >= 0 ? localIdx : 0);
    setProgress(0);
    setShowViewers(false);
    setPaused(false);
  }, []);

  const nextStory = useCallback(() => {
    setPaused(false);
    setProgress(0);
    setActiveIndex((idx) => {
      if (idx === null) return null;
      const len = viewerStories?.length ?? storiesRef.current.length;
      if (idx >= len - 1) return null;
      return idx + 1;
    });
  }, [viewerStories?.length]);

  const prevStory = useCallback(() => {
    setPaused(false);
    setProgress(0);
    setActiveIndex((idx) => {
      if (idx === null) return null;
      return Math.max(0, idx - 1);
    });
  }, []);

  const togglePause = useCallback(
    (e) => {
      e?.stopPropagation?.();
      setPaused(!isPausedRef.current);
    },
    [setPaused]
  );

  useEffect(() => {
    if (!activeStory) return;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    fetch(route('stories.view', activeStory.id), {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': csrfToken, Accept: 'application/json' },
    }).catch(() => {});
    setProgress(0);
    setPaused(false);

    if (isVideoStory(activeStory)) {
      return undefined;
    }

    const duration = storyTimerDurationMs(activeStory);
    const step = 100;
    const increment = (step / duration) * 100;
    const timer = setInterval(() => {
      if (isPausedRef.current) return;
      setProgress((p) => {
        const next = p + increment;
        if (next >= 100) {
          clearInterval(timer);
          setProgress(0);
          setActiveIndex((idx) => {
            if (idx === null) return null;
            const len = viewerStories?.length ?? storiesRef.current.length;
            if (idx >= len - 1) {
              setPaused(true);
              setProgress(100);
              return idx;
            }
            return idx + 1;
          });
          return 100;
        }
        return next;
      });
    }, step);

    return () => clearInterval(timer);
  }, [activeStory?.id, viewerStories?.length]);

  const onVideoTimeUpdate = useCallback(() => {
    const v = storyVideoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    if (isPausedRef.current) return;
    setProgress((v.currentTime / v.duration) * 100);
  }, []);

  const onVideoEnded = useCallback(() => {
    setProgress(0);
    setActiveIndex((idx) => {
      if (idx === null) return null;
      const len = viewerStories?.length ?? storiesRef.current.length;
      if (idx >= len - 1) {
        setPaused(true);
        setProgress(100);
        return idx;
      }
      return idx + 1;
    });
  }, [viewerStories?.length]);

  useEffect(() => {
    const v = storyVideoRef.current;
    if (!v) return;
    if (isPaused) v.pause();
    else v.play().catch(() => {});
  }, [isPaused, activeStory?.id, activeStory?.media_url]);

  const react = (emoji) => {
    if (!activeStory) return;
    router.post(route('stories.react', activeStory.id), { reaction: emoji }, { preserveScroll: true, preserveState: true, only: [] });
  };

  const deleteStory = (storyId, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!confirm(t('pages.stories.confirmDelete'))) return;
    router.delete(route('stories.destroy', storyId), {
      preserveScroll: true,
      onSuccess: () => {
        setActiveIndex(null);
        setViewerStories(null);
        setProgress(0);
      },
    });
  };

  const reactionEntries = Object.entries(activeStory?.reaction_counts || {});

  return (
    <>
      <div
        className="mx-auto min-w-0 max-w-5xl space-y-4 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:space-y-5 sm:p-4 md:p-6"
        style={{ color: 'var(--text-1)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <h1 className="font-display text-lg font-bold sm:text-xl" style={{ color: 'var(--text-1)' }}>
            {t('pages.stories.header')}
          </h1>
          <Link
            href={route('dashboard')}
            className="shrink-0 text-xs font-semibold hover:underline"
            style={{ color: 'var(--accent-1, #63b3ed)' }}
          >
            {t('pages.stories.backFeed', { defaultValue: '← Fil' })}
          </Link>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
          {t('pages.stories.browseOnlyHint', { defaultValue: 'Crée une story via le + dans le menu ou sous ton avatar sur le fil.' })}
        </p>

        {stories.length === 0 ? (
          <div
            className="rounded-3xl border p-8 text-center"
            style={{ background: 'var(--panel-bg)', borderColor: 'var(--border)', color: 'var(--text-2)' }}
          >
            {t('pages.stories.emptyGrid', { defaultValue: 'Aucune story pour l’instant.' })}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {stories.map((s, idx) => (
              <article
                key={s.id}
                className="group relative min-w-0 cursor-pointer overflow-hidden rounded-3xl border transition hover:ring-2 hover:ring-blue-500/30"
                style={{ background: 'var(--panel-bg)', borderColor: 'var(--border)' }}
                onClick={() => openViewerAt(idx)}
              >
                {s.user_id === auth.user.id && (
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => deleteStory(s.id, e)}
                    className="absolute right-2 top-2 z-10 rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white"
                  >
                    {t('pages.stories.delete')}
                  </button>
                )}
                <div className="truncate p-3 text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                  {s.user?.name}
                </div>
                {!s.media_url && s.body ? (
                  <div
                    className="flex min-h-[min(360px,50vh)] max-h-[min(360px,50vh)] w-full items-center justify-center overflow-y-auto p-4 text-center text-sm leading-relaxed"
                    style={{ color: 'var(--text-1)' }}
                  >
                    {s.body}
                  </div>
                ) : s.media_url?.match(/\.(mp4|webm|mov)$/i) ? (
                  <video className="max-h-[min(360px,50vh)] w-full object-cover">
                    <source src={s.media_url} />
                  </video>
                ) : s.media_url ? (
                  <img
                    src={s.media_url}
                    alt={t('pages.stories.altStory')}
                    className="max-h-[min(360px,50vh)] w-full object-cover"
                  />
                ) : null}
                {s.media_url && s.body && (
                  <p
                    className="line-clamp-3 border-t px-3 py-2 text-xs"
                    style={{ color: 'var(--text-2)', borderColor: 'var(--border)' }}
                  >
                    {s.body}
                  </p>
                )}
                <div
                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs"
                  style={{ color: 'var(--text-2)' }}
                >
                  <span>{viewsLabel(t, s.views_count || 0)}</span>
                  <span>{s.viewed_by_me ? t('pages.stories.seen') : t('pages.stories.new')}</span>
                </div>
                {Object.keys(s.reaction_counts || {}).length > 0 && (
                  <div className="flex flex-wrap gap-1 px-3 pb-2 text-[10px]" style={{ color: 'var(--text-3)' }}>
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
        )}
      </div>

      {activeStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full min-w-0 max-w-md">
            <div className="mb-2 flex gap-1 px-0.5 sm:mb-3">
              {(viewerStories ?? stories).map((_, i) => (
                <div key={i} className="min-w-[4px] flex-1 overflow-hidden rounded-full bg-white/25">
                  <div
                    className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
                    style={{
                      width: `${i < activeIndex ? 100 : i === activeIndex ? progress : 0}%`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black">
              <button
                type="button"
                onClick={prevStory}
                className="absolute left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white sm:hidden"
                aria-label={t('pages.stories.prev')}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextStory}
                className="absolute right-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white sm:hidden"
                aria-label={t('pages.stories.next')}
              >
                ›
              </button>

              <div className="flex flex-wrap items-center justify-between gap-2 p-2 text-sm font-semibold text-white sm:p-3">
                <span className="min-w-0 flex-1 truncate pr-2">{activeStory.user?.name}</span>
                <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={togglePause}
                    className="rounded-lg bg-white/15 px-2 py-1 text-xs font-bold text-white hover:bg-white/25"
                    aria-pressed={isPaused}
                    title={isPaused ? t('pages.stories.resumeStory') : t('pages.stories.pauseStory')}
                  >
                    {isPaused ? '▶' : '⏸'}
                  </button>
                  {isOwnStory && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowViewers((v) => !v)}
                        className="whitespace-nowrap rounded-lg bg-white/10 px-2 py-1 text-xs"
                      >
                        {t('pages.stories.viewsModal', {
                          n: activeStory.viewers?.length ?? activeStory.views_count ?? 0,
                        })}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => deleteStory(activeStory.id, e)}
                        className="rounded-lg bg-red-600/90 px-2 py-1 text-xs"
                      >
                        {t('pages.stories.delete')}
                      </button>
                    </>
                  )}
                  <button type="button" onClick={closeViewer} className="px-2 text-xs text-white/80">
                    {t('pages.stories.close')}
                  </button>
                </div>
              </div>

              {showViewers && isOwnStory && Array.isArray(activeStory.viewers) && activeStory.viewers.length > 0 && (
                <div className="max-h-32 overflow-y-auto border-b border-white/10 px-3 pb-2">
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-white/50">{t('pages.stories.whoSaw')}</p>
                  <ul className="space-y-1">
                    {activeStory.viewers.map((v) => (
                      <li key={`${v.id}-${v.seen_at}`} className="flex justify-between gap-2 text-xs text-white/90">
                        <span className="truncate">{v.name}</span>
                        <span className="shrink-0">{v.reaction || '—'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="relative" onClick={togglePause} role="presentation" style={{ WebkitTapHighlightColor: 'transparent' }}>
                {!activeStory.media_url && activeStory.body ? (
                  <div className="flex min-h-[min(70vh,320px)] max-h-[min(70vh,520px)] w-full items-center justify-center overflow-y-auto bg-black/80 p-5 text-center text-base leading-relaxed text-white/95 sm:text-lg">
                    {activeStory.body}
                  </div>
                ) : isVideoStory(activeStory) ? (
                  <video
                    key={activeStory.id}
                    ref={storyVideoRef}
                    autoPlay
                    muted
                    loop={false}
                    playsInline
                    className="max-h-[min(70vh,520px)] w-full bg-black object-contain sm:object-cover"
                    onClick={(e) => e.stopPropagation()}
                    onTimeUpdate={onVideoTimeUpdate}
                    onLoadedMetadata={() => setProgress(0)}
                    onEnded={onVideoEnded}
                  >
                    <source src={activeStory.media_url} />
                  </video>
                ) : activeStory.media_url ? (
                  <img
                    src={activeStory.media_url}
                    alt={t('pages.stories.altActive')}
                    className="max-h-[min(70vh,520px)] w-full bg-black object-contain sm:object-cover"
                  />
                ) : null}
                {isPaused && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="rounded-full border border-white/30 bg-black/50 px-4 py-2 text-sm font-bold text-white">
                      {t('pages.stories.pauseStory')}
                    </span>
                  </div>
                )}
              </div>
              {activeStory.media_url && activeStory.body && (
                <p
                  className="border-t border-white/10 px-3 py-2 text-sm text-white/90"
                  onClick={(e) => e.stopPropagation()}
                >
                  {activeStory.body}
                </p>
              )}

              <div className="flex flex-col gap-2 p-3 text-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {['❤️', '🔥', '👏', '😍', '😂'].map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => react(e)}
                        className={`text-lg ${activeStory.my_reaction === e ? 'rounded ring-2 ring-white' : ''}`}
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
              className="absolute left-0 top-1/2 hidden -translate-x-10 -translate-y-1/2 text-3xl font-light text-white sm:block"
              aria-label={t('pages.stories.prev')}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextStory}
              className="absolute right-0 top-1/2 hidden translate-x-10 -translate-y-1/2 text-3xl font-light text-white sm:block"
              aria-label={t('pages.stories.next')}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * @param {{ stories: object[] }} props
 */
function StoriesFeed({ stories = [] }) {
  const { t } = useTranslation();
  const { props } = usePage();
  const pageUnread = props.unreadNotificationsCount ?? 0;
  const auth = props.auth;
  const channels = props.channels ?? [];
  const notifications = props.notifications ?? [];

  const [moodId, setMoodId] = useState(() =>
    typeof window === 'undefined' ? 'dark' : window.localStorage.getItem(MOOD_STORAGE_KEY) || 'dark',
  );

  const syncMood = useCallback((next) => {
    if (next === 'dark' || next === 'light') setMoodId(next);
  }, []);

  useEffect(() => {
    const onMood = (e) => syncMood(e?.detail?.moodId);
    window.addEventListener('uniconnect:mood-change', onMood);
    return () => window.removeEventListener('uniconnect:mood-change', onMood);
  }, [syncMood]);

  const { processing, reset, errors } = useForm({ body: '' });
  const { closeComposer } = useFeedUI();
  const hour = new Date().getHours();
  const isFocus = hour >= 23 || hour < 7;
  const theme = THEME_VARS[moodId] || THEME_VARS.dark;

  const handleSubmit = (formData, onSuccess) => {
    router.post(route('posts.store'), formData, {
      forceFormData: true,
      onSuccess: () => {
        reset();
        onSuccess();
        closeComposer();
      },
    });
  };

  return (
    <>
      <Head title={t('pages.stories.headTitle')} />
      <style>{DASH_CSS}</style>

      <FeedOverlays
        theme={theme}
        isFocus={isFocus}
        auth={auth}
        channels={channels}
        processing={processing}
        errors={errors}
        onComposerSubmit={handleSubmit}
        notifications={notifications}
        unreadNotificationsCount={pageUnread}
      />

      <div
        className="dash-root mx-auto w-full min-h-full max-w-[min(100%,min(100vw,96rem))] px-1 pb-4 sm:px-3 md:px-5 lg:px-6"
        style={{
          ...theme,
          background: 'transparent',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        <StoriesContent stories={stories} />
      </div>
    </>
  );
}

/**
 * @param {{ stories: object[] }} props
 */
export default function StoriesIndex({ stories = [] }) {
  return (
    <AuthenticatedLayout layoutVariant="feed">
      <StoriesFeed stories={stories} />
    </AuthenticatedLayout>
  );
}
