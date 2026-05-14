// resources/js/Pages/Dashboard.jsx
// Note: `useFeedUI` doit être utilisé dans un composant rendu *en dessous* de `FeedUIProvider`
// (dans le main du layout), pas dans le page component racine, sinon le contexte est null.
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardChatbotModal from '@/Components/Dashboard/DashboardChatbotModal';
import DashboardFloatHelp from '@/Components/Dashboard/DashboardFloatHelp';
import { DASH_CSS } from '@/Components/Dashboard/dashStyles';
import PostCard from '@/Components/Dashboard/PostCard';
import StoriesBar from '@/Components/Dashboard/StoriesBar';
import StoryViewerModal from '@/Components/Dashboard/StoryViewerModal';
import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

function DashboardFeed({
  auth,
  university,
  posts = [],
  stories = [],
  notifications = [],
  channels = [],
}) {
  const { t } = useTranslation();

  const [moodId, setMoodId] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem(MOOD_STORAGE_KEY) || 'dark';
  });

  const syncMood = useCallback((next) => {
    if (next === 'dark' || next === 'light') setMoodId(next);
  }, []);

  useEffect(() => {
    const h = (e) => syncMood(e?.detail?.moodId);
    window.addEventListener('uniconnect:mood-change', h);
    return () => window.removeEventListener('uniconnect:mood-change', h);
  }, [syncMood]);

  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [storyViewerUserId, setStoryViewerUserId] = useState(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const theme = THEME_VARS[moodId] || THEME_VARS.dark;
  const isLight = moodId === 'light';

  const storyViewerQueue = useMemo(() => {
    if (storyViewerUserId == null) return [];
    return stories
      .filter((s) => s.user_id === storyViewerUserId)
      .slice()
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [stories, storyViewerUserId]);

  const openStoryViewer = (userId) => {
    setStoryViewerUserId(userId);
    setStoryViewerOpen(true);
  };

  const handleDelete = (id) => setDeletePostId(id);

  const confirmDelete = () => {
    if (!deletePostId) return;
    router.delete(route('posts.destroy', deletePostId), { preserveScroll: true });
    setDeletePostId(null);
  };

  const hasFeed = posts.length > 0;

  return (
    <>
      <Head title={t('dashboard.pageTitle', { university })} />
      <style>{DASH_CSS}</style>

      {/* Delete post confirm modal */}
      {deletePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl p-6 max-w-xs w-full shadow-2xl"
            style={{ background: isLight ? '#fff' : 'rgba(15,18,40,0.97)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(252,129,129,0.2)'}` }}>
            <p className="font-bold mb-1 text-base" style={{ color: isLight ? '#0f172a' : '#f0f4ff' }}>
              {t('dashboard.confirmDeletePost')}
            </p>
            <p className="text-sm mb-5" style={{ color: isLight ? '#64748b' : '#8b9cc8' }}>
              {t('dashboard.confirmDeletePostBody', { defaultValue: 'Cette action est irréversible.' })}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeletePostId(null)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition"
                style={{ background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)', color: isLight ? '#334155' : '#8b9cc8' }}>
                Annuler
              </button>
              <button onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl text-sm font-bold transition"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="dash-root mx-auto w-full min-h-full max-w-[min(100%,min(100vw,96rem))]"
        style={{
          ...theme,
          background: 'transparent',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        <StoriesBar
          auth={auth}
          stories={stories}
          onOpenStoryViewer={(userId) => openStoryViewer(userId)}
        />

        {!hasFeed ? (
          <div
            className="mx-2 mt-4 glass-card rounded-2xl p-10 text-center"
            style={{ color: 'var(--text-3)' }}
          >
            <h3 className="font-display font-bold mb-2" style={{ color: 'var(--text-1)' }}>
              {t('dashboard.emptyFeedTitle')}
            </h3>
            <p className="text-sm">{t('dashboard.emptyFeedBody', { university })}</p>
          </div>
        ) : (
          <div className="mx-auto mt-2 w-full max-w-[540px]">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                p={p}
                auth={auth}
                university={university}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <StoryViewerModal
        open={storyViewerOpen}
        stories={storyViewerQueue}
        initialIndex={0}
        onClose={() => {
          setStoryViewerOpen(false);
          setStoryViewerUserId(null);
        }}
      />

      <DashboardFloatHelp onOpenChatbot={() => setChatbotOpen(true)} />
      <DashboardChatbotModal open={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </>
  );
}

export default function Dashboard({
  auth,
  university,
  posts = [],
  resources: _r,
  stories = [],
  notifications = [],
  unreadNotificationsCount: _u,
  channelFeed: _cf,
  feedMode: _fm,
  channels = [],
}) {
  return (
    <AuthenticatedLayout layoutVariant="feed">
      <DashboardFeed
        auth={auth}
        university={university}
        posts={posts}
        stories={stories}
        notifications={notifications}
        channels={channels}
      />
    </AuthenticatedLayout>
  );
}
