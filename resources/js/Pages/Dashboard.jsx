// resources/js/Pages/Dashboard.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { DASH_CSS } from '@/Components/Dashboard/dashStyles';
import { Ic } from '@/Components/Dashboard/Icons';
import Avatar from '@/Components/Dashboard/Avatar';
import StoriesBar from '@/Components/Dashboard/StoriesBar';
import StoryViewerModal from '@/Components/Dashboard/StoryViewerModal';
import PostCard from '@/Components/Dashboard/PostCard';
import Composer from '@/Components/Dashboard/Composer';
import DashboardChatbotModal from '@/Components/Dashboard/DashboardChatbotModal';
import DashboardFloatHelp from '@/Components/Dashboard/DashboardFloatHelp';
import {
  ProfileCard, LibraryCard, CharteCard,
  TrendingCard, ActiveMembersCard, FollowSuggestionsCard,
} from '@/Components/Dashboard/Sidebar';
import DashboardPanelDock, {
  DASHBOARD_PANELS_STORAGE_KEY,
  mergeDashboardPanels,
} from '@/Components/Dashboard/DashboardPanelDock';

const BG_STORAGE_KEY = 'uniconnect.dashboard.bg';
const MOOD_STORAGE_KEY = 'uniconnect.dashboard.mood';

const BG_PRESETS_DARK = {
  nebula: {
    label: 'Nebula',
    bgDeep: '#0b1433',
    bgAmbient:
      'radial-gradient(circle at 12% 20%, rgba(99,179,237,0.20), transparent 45%),' +
      'radial-gradient(circle at 85% 10%, rgba(183,148,244,0.14), transparent 40%),' +
      'radial-gradient(circle at 50% 95%, rgba(118,228,176,0.10), transparent 40%),' +
      'linear-gradient(180deg, #0b1433 0%, #060818 100%)',
  },
  aurora: {
    label: 'Aurora',
    bgDeep: '#071a16',
    bgAmbient:
      'radial-gradient(circle at 18% 18%, rgba(118,228,176,0.18), transparent 45%),' +
      'radial-gradient(circle at 82% 25%, rgba(99,179,237,0.14), transparent 42%),' +
      'radial-gradient(circle at 55% 90%, rgba(183,148,244,0.10), transparent 38%),' +
      'linear-gradient(180deg, #071a16 0%, #041016 100%)',
  },
  midnight: {
    label: 'Midnight',
    bgDeep: '#03040a',
    bgAmbient:
      'radial-gradient(circle at 15% 22%, rgba(99,179,237,0.14), transparent 45%),' +
      'radial-gradient(circle at 80% 10%, rgba(183,148,244,0.10), transparent 38%),' +
      'radial-gradient(circle at 55% 90%, rgba(118,228,176,0.08), transparent 38%),' +
      'linear-gradient(180deg, #03040a 0%, #050816 100%)',
  },
  sunrise: {
    label: 'Sunrise',
    bgDeep: '#1a0f08',
    bgAmbient:
      'radial-gradient(circle at 18% 18%, rgba(246,173,85,0.16), transparent 45%),' +
      'radial-gradient(circle at 85% 15%, rgba(99,179,237,0.12), transparent 42%),' +
      'radial-gradient(circle at 50% 92%, rgba(183,148,244,0.10), transparent 38%),' +
      'linear-gradient(180deg, #1a0f08 0%, #090611 100%)',
  },
};

const BG_PRESETS_LIGHT = {
  nebula: {
    label: 'Nebula',
    bgDeep: '#eef2ff',
    bgAmbient:
      'radial-gradient(circle at 12% 20%, rgba(99,179,237,0.22), transparent 45%),' +
      'radial-gradient(circle at 85% 10%, rgba(183,148,244,0.16), transparent 40%),' +
      'radial-gradient(circle at 50% 95%, rgba(118,228,176,0.14), transparent 40%),' +
      'linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)',
  },
  aurora: {
    label: 'Aurora',
    bgDeep: '#effdf6',
    bgAmbient:
      'radial-gradient(circle at 18% 18%, rgba(118,228,176,0.24), transparent 45%),' +
      'radial-gradient(circle at 82% 25%, rgba(99,179,237,0.18), transparent 42%),' +
      'radial-gradient(circle at 55% 90%, rgba(183,148,244,0.14), transparent 38%),' +
      'linear-gradient(180deg, #effdf6 0%, #f8fafc 100%)',
  },
  midnight: {
    label: 'Midnight',
    bgDeep: '#f1f5ff',
    bgAmbient:
      'radial-gradient(circle at 15% 22%, rgba(99,179,237,0.18), transparent 45%),' +
      'radial-gradient(circle at 80% 10%, rgba(183,148,244,0.14), transparent 38%),' +
      'radial-gradient(circle at 55% 90%, rgba(118,228,176,0.10), transparent 38%),' +
      'linear-gradient(180deg, #f1f5ff 0%, #ffffff 100%)',
  },
  sunrise: {
    label: 'Sunrise',
    bgDeep: '#fff4e6',
    bgAmbient:
      'radial-gradient(circle at 18% 18%, rgba(246,173,85,0.22), transparent 45%),' +
      'radial-gradient(circle at 85% 15%, rgba(99,179,237,0.16), transparent 42%),' +
      'radial-gradient(circle at 50% 92%, rgba(183,148,244,0.12), transparent 38%),' +
      'linear-gradient(180deg, #fff4e6 0%, #ffffff 100%)',
  },
};

const THEME_VARS = {
  dark: {
    '--bg-card': 'rgba(10,12,28,0.85)',
    '--bg-glass': 'rgba(255,255,255,0.04)',
    '--bg-glass2': 'rgba(255,255,255,0.07)',
    '--border': 'rgba(255,255,255,0.07)',
    '--border-glow': 'rgba(99,179,237,0.30)',
    '--panel-bg': 'rgba(10,12,28,0.97)',
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
    '--panel-bg': 'rgba(255,255,255,0.92)',
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

export default function Dashboard({
  auth,
  university,
  role = 'student',
  posts = [],
  resources = [],
  stories = [],
  notifications = [],
  unreadNotificationsCount = 0,
  feedMode = 'all',
  channelFeed = 'all',
  trending = [],
  onlineUsers = [],
  followSuggestions = [],
  channels = [],
  myPostsCount = 0,
}) {
  const [moodId, setMoodId] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem(MOOD_STORAGE_KEY) || 'dark';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(MOOD_STORAGE_KEY, moodId);
    window.dispatchEvent(new CustomEvent('uniconnect:mood-change', { detail: { moodId } }));
  }, [moodId]);

  const [bgId, setBgId] = useState(() => {
    if (typeof window === 'undefined') return 'nebula';
    return window.localStorage.getItem(BG_STORAGE_KEY) || 'nebula';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(BG_STORAGE_KEY, bgId);
  }, [bgId]);

  const bgPresets = moodId === 'light' ? BG_PRESETS_LIGHT : BG_PRESETS_DARK;
  const preset = bgPresets[bgId] || bgPresets.nebula;
  const theme = THEME_VARS[moodId] || THEME_VARS.dark;
  const selectBg = moodId === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(11,20,51,0.85)';
  const optionBg = moodId === 'light' ? 'rgba(255,255,255,1)' : 'rgba(2,6,23,0.95)';
  // Certains navigateurs n'appliquent pas bien les variables CSS sur les <option>.
  // On met donc une couleur explicite pour qu'en Dark les propositions restent lisibles.
  const optionColor = moodId === 'light' ? 'rgb(15,23,42)' : '#f0f4ff';

  const hour        = new Date().getHours();
  const isFocus     = hour >= 22 || hour < 7;
  const firstName   = auth.user.name.split(' ')[0];
  const { processing, reset, errors } = useForm({ body: '' });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [storyViewerIndex, setStoryViewerIndex] = useState(0);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const [panels, setPanels] = useState(() => {
    if (typeof window === 'undefined') {
      return mergeDashboardPanels(null);
    }
    try {
      const raw = window.localStorage.getItem(DASHBOARD_PANELS_STORAGE_KEY);
      return mergeDashboardPanels(raw ? JSON.parse(raw) : null);
    } catch {
      return mergeDashboardPanels(null);
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DASHBOARD_PANELS_STORAGE_KEY, JSON.stringify(panels));
  }, [panels]);

  const togglePanel = (key) => {
    setPanels((p) => ({ ...p, [key]: !p[key] }));
  };

  const showAllPanels = () => {
    setPanels({ chrome: true, stories: true, filters: true, feed: true, sidebar: true });
  };

  const hideAllPanels = () => {
    setPanels({ chrome: false, stories: false, filters: false, feed: false, sidebar: false });
  };

  const openStoryViewer = (index) => {
    setStoryViewerIndex(index);
    setStoryViewerOpen(true);
  };

  const greeting = (() => {
    if (hour < 5)  return { text: 'Bonne nuit',    emoji: '🌙', sub: 'Le réseau dort. Vous devriez aussi.' };
    if (hour < 12) return { text: 'Bonjour',        emoji: '⚡', sub: 'Nouvelle session. Nouveaux apprentissages.' };
    if (hour < 18) return { text: 'Bon après-midi', emoji: '🔮', sub: 'Le flux académique est en direct.' };
    if (hour < 22) return { text: 'Bonsoir',         emoji: '🌆', sub: `${posts.length} publication${posts.length!==1?'s':''} dans la communauté.` };
    return               { text: 'Bonne nuit',    emoji: '🌙', sub: 'Mode Focus activé. Repos cognitif en cours.' };
  })();

  const handleSubmit = (body, media, channelId, onSuccess) => {
    const data = { body, media };
    if (channelId) data.channel_id = channelId;
    router.post(route('posts.store'), data, {
      forceFormData: true,
      onSuccess: () => { reset(); onSuccess(); },
    });
  };

  const setFeed = (mode) => {
    const q = {};
    if (mode === 'following') {
      q.feed = 'following';
    }
    if (channelFeed === 'followed') {
      q.channels = 'followed';
    }
    router.get(route('dashboard'), q, { preserveScroll: true });
  };

  const setChannelFeedMode = (mode) => {
    const q = {};
    if (feedMode === 'following') {
      q.feed = 'following';
    }
    if (mode === 'followed') {
      q.channels = 'followed';
    }
    router.get(route('dashboard'), q, { preserveScroll: true });
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer ce message définitivement ?'))
      router.delete(route('posts.destroy', id));
  };

  const hasFeed = posts.length > 0;

  const markNotificationsRead = () => {
    router.post(route('notifications.read-all'), {}, {
      preserveScroll: true,
      onSuccess: () => router.reload({ preserveScroll: true }),
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{color:'var(--text-3)'}}>Réseau</span>
            <span style={{color:'var(--text-3)'}}>·</span>
            <span className="font-display font-bold text-sm" style={{color:'var(--text-1)'}}>{university}</span>
          </div>
          {isFocus && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{background:'rgba(246,173,85,0.1)',color:'#f6ad55',border:'1px solid rgba(246,173,85,0.2)'}}>
              <Ic.Moon /> Mode Focus Actif
            </span>
          )}
        </div>
      }
    >
      <Head title={`Fil · ${university}`} />
      <style>{DASH_CSS}</style>

      <div
        className="dash-root py-6 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'var(--bg-ambient)',
          '--bg-deep': preset.bgDeep,
          '--bg-ambient': preset.bgAmbient,
          ...theme,
        }}
      >
        {/* Ambient background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
          <div style={{position:'absolute',top:'10%',left:'5%',width:'40vw',height:'40vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,179,237,0.04),transparent 70%)'}}/>
          <div style={{position:'absolute',bottom:'20%',right:'5%',width:'35vw',height:'35vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(183,148,244,0.04),transparent 70%)'}}/>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'60vw',height:'60vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(118,228,176,0.02),transparent 70%)'}}/>
        </div>

        <div className="relative max-w-6xl mx-auto" style={{zIndex:1}}>

          <DashboardPanelDock
            panels={panels}
            onToggle={togglePanel}
            onShowAll={showAllPanels}
            onHideAll={hideAllPanels}
          />

          {!panels.chrome && (
            <div className="flex justify-end mb-3">
              <div className="relative">
                <button
                  type="button"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/5"
                  onClick={() => setNotificationsOpen((v) => !v)}
                  style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}
                  aria-label="Notifications"
                >
                  <Ic.Bell />
                </button>
                {unreadNotificationsCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ background: 'var(--accent-1)', color: 'var(--bg-deep)', border: '1.5px solid var(--bg-deep)' }}
                  >
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Greeting & thème (masquable) ── */}
          {panels.chrome && (
          <div className="flex items-center justify-between mb-7 d-fade-up flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{greeting.emoji}</span>
                <h1 className="font-display font-bold text-xl" style={{color:'var(--text-1)'}}>
                  {greeting.text},{' '}
                  <span className="grad-text">{firstName}</span>
                </h1>
              </div>
              <p className="text-sm" style={{color:'var(--text-3)'}}>{greeting.sub}</p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <button
                    type="button"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/5"
                    onClick={() => setNotificationsOpen((v) => !v)}
                    style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}
                    aria-label="Notifications"
                  >
                    <Ic.Bell />
                  </button>
                  {unreadNotificationsCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                      style={{ background: 'var(--accent-1)', color: 'var(--bg-deep)', border: '1.5px solid var(--bg-deep)' }}
                    >
                      {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider" style={{color:'var(--text-3)'}}>
                  Mood
                </span>
                <select
                  value={moodId}
                  onChange={(e) => setMoodId(e.target.value)}
                  className="input-neo rounded-xl text-xs px-3 py-2"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-1)',
                    backgroundColor: selectBg,
                    colorScheme: moodId === 'light' ? 'light' : 'dark',
                    minWidth: '120px',
                  }}
                  aria-label="Choisir le mood Dark / Light"
                >
                  <option value="dark" style={{ backgroundColor: optionBg, color: optionColor }}>
                    Dark
                  </option>
                  <option value="light" style={{ backgroundColor: optionBg, color: optionColor }}>
                    Light
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider" style={{color:'var(--text-3)'}}>
                  Fond
                </span>
                <select
                  value={bgId}
                  onChange={(e) => setBgId(e.target.value)}
                  className="input-neo rounded-xl text-xs px-3 py-2"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-1)',
                    backgroundColor: selectBg,
                    colorScheme: moodId === 'light' ? 'light' : 'dark',
                    minWidth: '140px',
                  }}
                  aria-label="Choisir le fond du dashboard"
                >
                  {Object.entries(bgPresets).map(([id, p]) => (
                    <option key={id} value={id} style={{ backgroundColor: optionBg, color: optionColor }}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          )}

          {panels.filters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex rounded-xl p-0.5" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setFeed('all')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{
                  background: feedMode === 'all' ? 'rgba(99,179,237,0.15)' : 'transparent',
                  color: feedMode === 'all' ? 'var(--accent-1)' : 'var(--text-3)',
                }}
              >
                Tout le campus
              </button>
              <button
                type="button"
                onClick={() => setFeed('following')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{
                  background: feedMode === 'following' ? 'rgba(99,179,237,0.15)' : 'transparent',
                  color: feedMode === 'following' ? 'var(--accent-1)' : 'var(--text-3)',
                }}
              >
                Abonnements
              </button>
            </div>
            <div className="inline-flex rounded-xl p-0.5" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setChannelFeedMode('all')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{
                  background: channelFeed === 'all' ? 'rgba(118,228,176,0.12)' : 'transparent',
                  color: channelFeed === 'all' ? 'var(--accent-2)' : 'var(--text-3)',
                }}
              >
                Tous les canaux
              </button>
              <button
                type="button"
                onClick={() => setChannelFeedMode('followed')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{
                  background: channelFeed === 'followed' ? 'rgba(118,228,176,0.12)' : 'transparent',
                  color: channelFeed === 'followed' ? 'var(--accent-2)' : 'var(--text-3)',
                }}
              >
                Canaux suivis
              </button>
            </div>
            <a
              href={route('channels.index')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: 'var(--accent-1)', border: '1px solid rgba(99,179,237,0.25)' }}
            >
              Gérer mes canaux →
            </a>
          </div>
          )}

          {notificationsOpen && (
            <div className="glass-card rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-xs font-bold" style={{ color: 'var(--text-2)' }}>
                  Notifications non lues
                </p>
                <div className="flex gap-2">
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={markNotificationsRead}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg"
                      style={{ color: 'var(--accent-1)', border: '1px solid rgba(99,179,237,0.35)' }}
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[10px] text-slate-500"
                  >
                    Fermer
                  </button>
                </div>
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                  Aucune nouvelle notification.
                </p>
              ) : (
                <ul className="space-y-3">
                  {notifications.map((n) => (
                    <li key={n.id} className="text-xs border-b border-white/5 pb-2 last:border-0" style={{ color: 'var(--text-2)' }}>
                      <p className="font-semibold" style={{ color: 'var(--text-1)' }}>{n.title}</p>
                      {n.body && <p className="mt-0.5">{n.body}</p>}
                      <p className="mt-1 text-[10px]" style={{ color: 'var(--text-3)' }}>
                        {n.created_at
                          ? new Date(n.created_at).toLocaleString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className={`grid grid-cols-1 gap-5 ${panels.sidebar ? 'lg:grid-cols-3' : ''}`}>

            {/* ══ FEED ══ */}
            <div className={panels.sidebar ? 'lg:col-span-2' : 'lg:col-span-3'}>

              {panels.stories && (
              <div className="d-fade-up mb-4" style={{animationDelay:'0.05s'}}>
                <StoriesBar auth={auth} stories={stories} onOpenStoryViewer={openStoryViewer} />
              </div>
              )}

              {!panels.stories && !panels.feed && !panels.sidebar && (
                <div className="glass-card rounded-2xl p-8 text-center mb-4" style={{ color: 'var(--text-3)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>Vue épurée</p>
                  <p className="text-xs mt-2 max-w-md mx-auto">
                    Utilisez la barre d’icônes ci-dessus pour afficher les stories, le fil, les filtres ou le panneau latéral.
                  </p>
                </div>
              )}

              {panels.feed && (
              <>
              <div className="d-fade-up mb-4" style={{animationDelay:'0.1s'}}>
                <Composer auth={auth} isFocusMode={isFocus} onSubmit={handleSubmit}
                          processing={processing} errors={errors} channels={channels} />
              </div>

              {!hasFeed ? (
                <div className="glass-card rounded-2xl p-14 text-center noise d-fade-up" style={{animationDelay:'0.15s'}}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 d-float"
                       style={{background:'rgba(99,179,237,0.08)',color:'var(--accent-1)',border:'1px solid rgba(99,179,237,0.15)'}}>
                    <Ic.Spark />
                  </div>
                  <h3 className="font-display font-bold mb-2" style={{color:'var(--text-1)'}}>
                    Réseau silencieux
                  </h3>
                  <p className="text-sm" style={{color:'var(--text-3)'}}>
                    Soyez le premier à publier dans {university}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((p, i) => (
                    <div key={p.id} className="d-fade-up" style={{animationDelay:`${0.15+i*0.07}s`}}>
                      <PostCard p={p} auth={auth} university={university} onDelete={handleDelete} />
                    </div>
                  ))}
                </div>
              )}
              </>
              )}
            </div>

            {/* ══ SIDEBAR ══ */}
            {panels.sidebar && (
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-2)' }}>Navigation</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a href={route('my-posts.index')} className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-glass)', color: 'var(--text-3)' }}>Mes posts</a>
                  <a href={route('dashboard')} className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-glass)', color: 'var(--text-3)' }}>Fil</a>
                  <a href={route('channels.index')} className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-glass)', color: 'var(--text-3)' }}>Canaux</a>
                  <a href={route('messages.index')} className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-glass)', color: 'var(--text-3)' }}>Messages</a>
                  <a href={route('saved-posts.index')} className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-glass)', color: 'var(--text-3)' }}>Posts sauvegardés</a>
                  <a href={route('dashboard')} className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-glass)', color: 'var(--text-3)' }}>Bibliothèque</a>
                  <a href={route('stories.index')} className="px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-glass)', color: 'var(--text-3)' }}>Stories</a>
                </div>
              </div>
              {[
                { delay:'0.08s', el: <ProfileCard auth={auth} posts={posts} resources={resources} myPostsCount={myPostsCount} /> },
                { delay:'0.16s', el: <LibraryCard resources={resources} /> },
                { delay:'0.24s', el: <CharteCard /> },
                { delay:'0.32s', el: <TrendingCard tags={trending} /> },
                { delay:'0.36s', el: <FollowSuggestionsCard suggestions={followSuggestions} /> },
                { delay:'0.40s', el: <ActiveMembersCard members={onlineUsers} /> },
              ].map(({ delay, el }, i) => (
                <div key={i} className="d-slide-in" style={{animationDelay:delay}}>{el}</div>
              ))}
            </div>
            )}

          </div>
        </div>
      </div>

      <DashboardChatbotModal open={chatbotOpen} onClose={() => setChatbotOpen(false)} />
      <DashboardFloatHelp onOpenChatbot={() => setChatbotOpen(true)} />

      <StoryViewerModal
        open={storyViewerOpen}
        stories={stories}
        initialIndex={storyViewerIndex}
        onClose={() => setStoryViewerOpen(false)}
      />
    </AuthenticatedLayout>
  );
}