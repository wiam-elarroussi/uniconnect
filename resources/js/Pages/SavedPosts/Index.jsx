import DashboardChatbotModal from '@/Components/Dashboard/DashboardChatbotModal';
import DashboardFloatHelp from '@/Components/Dashboard/DashboardFloatHelp';
import { DASH_CSS } from '@/Components/Dashboard/dashStyles';
import FeedOverlays from '@/Components/Layout/FeedOverlays';
import PostCard from '@/Components/Dashboard/PostCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useFeedUI } from '@/contexts/FeedUIContext';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MOOD_STORAGE_KEY = 'uniconnect.dashboard.mood';

function firstPostThumb(p) {
  const slides = p.content_slides;
  if (Array.isArray(slides)) {
    const m = slides.find((s) => s.type === 'media');
    if (m?.url) return m.url;
  }
  if (p.media_url) return p.media_url;
  const media = p.media;
  if (Array.isArray(media) && media[0]?.url) return media[0].url;
  return null;
}

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

function SavedPostsFeed({ auth, university, posts = [], channels = [], notifications = [] }) {
  const { t } = useTranslation();
  const { props } = usePage();
  const pageUnread = props.unreadNotificationsCount ?? 0;

  const [moodId, setMoodId] = useState(() =>
    typeof window === 'undefined' ? 'dark' : window.localStorage.getItem(MOOD_STORAGE_KEY) || 'dark'
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
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [focusPostId, setFocusPostId] = useState(null);

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

  const handleDelete = (id) => {
    if (confirm(t('dashboard.confirmDeletePost'))) {
      router.delete(route('posts.destroy', id));
    }
  };

  return (
    <>
      <Head title={t('pages.savedPosts.headTitle', { university })} />
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
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            {focusPostId !== null && (
              <button
                type="button"
                onClick={() => setFocusPostId(null)}
                className="rounded-full px-2 py-1 text-sm font-bold hover:bg-white/10"
                style={{ color: 'var(--text-2)' }}
              >
                ← {t('pages.savedPosts.backGrid')}
              </button>
            )}
            <h1 className="font-display text-lg font-bold sm:text-xl" style={{ color: 'var(--text-1)' }}>
              {t('pages.savedPosts.header')}
            </h1>
          </div>
          <Link
            href={route('dashboard')}
            className="shrink-0 text-xs font-semibold hover:underline"
            style={{ color: 'var(--accent-1)' }}
          >
            {t('pages.savedPosts.backFeed')}
          </Link>
        </div>

        <div className="mt-4">
          {posts.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center" style={{ color: 'var(--text-3)' }}>
              <p className="text-sm">{t('pages.savedPosts.empty')}</p>
            </div>
          ) : focusPostId !== null ? (
            <div className="mx-auto w-full max-w-[540px]">
              {posts
                .filter((p) => p.id === focusPostId)
                .map((p) => (
                  <PostCard key={p.id} p={p} auth={auth} university={university} onDelete={handleDelete} />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5 md:grid-cols-3 lg:grid-cols-4">
              {posts.map((p) => {
                const thumb = firstPostThumb(p);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFocusPostId(p.id)}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-black/20 ring-1 ring-white/10"
                  >
                    {thumb ? (
                      <img src={thumb} alt="" className="h-full w-full object-cover transition group-hover:opacity-90" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-2 text-center text-[11px] font-medium leading-snug text-white/80">
                        {(p.body || '').slice(0, 120)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DashboardFloatHelp onOpenChatbot={() => setChatbotOpen(true)} />
      <DashboardChatbotModal open={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </>
  );
}

export default function SavedPostsIndex({
  auth,
  university,
  posts = [],
  channels = [],
  notifications = [],
}) {
  return (
    <AuthenticatedLayout layoutVariant="feed">
      <SavedPostsFeed
        auth={auth}
        university={university}
        posts={posts}
        channels={channels}
        notifications={notifications}
      />
    </AuthenticatedLayout>
  );
}
