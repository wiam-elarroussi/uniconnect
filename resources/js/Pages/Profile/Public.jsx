import { feedMoodStickyHeader, feedMoodText, feedPageRoot } from '@/Components/Layout/feedPageSurface';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Avatar from '@/Components/Dashboard/Avatar';
import PostCard from '@/Components/Dashboard/PostCard';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

function firstPostThumb(p) {
  const slides = p.content_slides;
  if (Array.isArray(slides)) { const m = slides.find(s => s.type === 'media'); if (m?.url) return m.url; }
  if (p.media_url) return p.media_url;
  if (Array.isArray(p.media) && p.media[0]?.url) return p.media[0].url;
  return null;
}

function nameHue(name = '') {
  return ((name.charCodeAt(0) * 47 + (name.charCodeAt(1) || 0) * 19) % 360);
}

function StatCol({ n, label, active, hue, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="flex flex-col items-center gap-0.5 py-2 flex-1 transition-all active:scale-95"
      style={{ background: active ? `hsla(${hue},65%,55%,0.07)` : 'transparent' }}>
      <span className="text-[17px] leading-tight font-black"
        style={{ color: active ? `hsl(${hue},60%,55%)` : 'var(--text-1)' }}>
        {n}
      </span>
      <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
        {label}
      </span>
    </button>
  );
}

export default function PublicProfile({
  auth, profileUser, university = '', posts = [],
  isFollowing = false, isSelf = false,
  followersList = [], followingList = [],
}) {
  const { t } = useTranslation();
  const [focusPostId, setFocusPostId] = useState(null);
  const [networkTab, setNetworkTab]   = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);

  const hue  = nameHue(profileUser.name);
  const hue2 = (hue + 40) % 360;

  const toggleFollow = () => router.post(route('users.follow.toggle', profileUser.id), {}, { preserveScroll: true });
  const handleDelete = (id) => setDeletePostId(id);
  const confirmDelete = () => {
    if (!deletePostId) return;
    router.delete(route('posts.destroy', deletePostId), { preserveScroll: true });
    setDeletePostId(null);
  };

  const campusBadge = useMemo(() => {
    const cr = profileUser.campus_role || 'student';
    if (profileUser.role === 'super_admin') return { text: t('pages.publicProfile.superAdmin'), color: '#a78bfa', border: 'rgba(167,139,250,0.4)', bg: 'rgba(167,139,250,0.1)' };
    if (profileUser.role === 'admin')       return { text: t('pages.publicProfile.moderator'),  color: '#fbbf24', border: 'rgba(251,191,36,0.35)',   bg: 'rgba(251,191,36,0.09)'  };
    if (cr === 'teacher') return { text: t('pages.publicProfile.teacher'), color: '#38bdf8', border: 'rgba(56,189,248,0.35)',  bg: 'rgba(56,189,248,0.09)'  };
    if (cr === 'staff')   return { text: t('pages.publicProfile.staff'),   color: '#34d399', border: 'rgba(52,211,153,0.35)',  bg: 'rgba(52,211,153,0.09)'  };
    return { text: t('pages.publicProfile.student'), color: 'var(--text-3)', border: 'var(--border)', bg: 'transparent' };
  }, [profileUser.campus_role, profileUser.role, t]);

  const pubCount  = posts.length;
  const followers = profileUser.followers_count ?? 0;
  const following = profileUser.following_count ?? 0;

  return (
    <AuthenticatedLayout layoutVariant="feed">
      <Head title={t('pages.publicProfile.headTitle', { name: profileUser.name })} />

      {/* Delete post confirm modal */}
      {deletePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl p-6 max-w-xs w-full shadow-2xl"
            style={{ background: 'var(--bg-card,#fff)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="font-bold mb-1 text-base" style={{ color: 'var(--text-1)' }}>
              {t('dashboard.confirmDeletePost')}
            </p>
            <p className="text-sm mb-5" style={{ color: 'var(--text-2)' }}>
              {t('dashboard.confirmDeletePostBody', { defaultValue: 'Cette action est irréversible.' })}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeletePostId(null)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition"
                style={{ background: 'var(--bg-glass)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
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

      <div className={`${feedPageRoot} mx-auto max-w-xl pb-28`}>

        {/* ── Sticky header ── */}
        <header
          className={`${feedMoodStickyHeader.className} flex items-center gap-3 px-4 py-2.5`}
          style={feedMoodStickyHeader.style}
        >
          <Link
            href={route('dashboard')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-bold"
            style={{ color: 'var(--text-1)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            ←
          </Link>
          <span className="flex-1 text-center text-sm font-black truncate" style={feedMoodText.primary}>
            {profileUser.name}
          </span>
          <span className="w-8 shrink-0" />
        </header>

        {/* ── Cover + Avatar hero block ── */}
        <div className="relative">
          {/* Cover */}
          <div className="w-full overflow-hidden" style={{ height: 110 }}>
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, hsl(${hue},62%,16%) 0%, hsl(${hue2},52%,11%) 55%, hsl(${(hue+90)%360},48%,9%) 100%)` }} />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
              <defs>
                <pattern id="pg" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pg)" />
            </svg>
            <div className="absolute right-6 top-2 w-36 h-36 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, hsla(${hue},75%,62%,0.22) 0%, transparent 70%)` }} />
            <div className="absolute left-1/3 bottom-0 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, hsla(${hue2},70%,58%,0.16) 0%, transparent 70%)` }} />
          </div>

          {/* Avatar — centré, chevauchant le cover */}
          <div className="absolute left-4 flex items-center justify-center"
            style={{ bottom: -42 }}>
            <div className="rounded-full flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${hue2},65%,45%))`,
                padding: 3,
                width: 90,
                height: 90,
              }}>
              <div style={{ width: 84, height: 84, borderRadius: '50%', overflow: 'hidden' }}>
                {profileUser.avatar_url ? (
                  <img
                    src={profileUser.avatar_url}
                    alt={profileUser.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <Avatar
                    name={profileUser.name}
                    size="xl"
                    builder={profileUser.avatar_builder}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile zone ── */}
        <div className="px-4" style={{ paddingTop: 54 }}>

          {/* Buttons row — right-aligned */}
          <div className="flex justify-end gap-2 mb-3">
            {!isSelf && (
              <>
                <button type="button" onClick={toggleFollow}
                  className="h-8 px-4 rounded-full text-[12px] font-bold transition-all active:scale-95"
                  style={isFollowing
                    ? { background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border)' }
                    : {
                        background: `linear-gradient(135deg, hsl(${hue},70%,50%), hsl(${hue2},64%,42%))`,
                        color: 'white', border: 'none',
                        boxShadow: `0 2px 10px hsla(${hue},68%,45%,0.32)`,
                      }
                  }>
                  {isFollowing ? t('pages.publicProfile.unfollow') : t('pages.publicProfile.follow')}
                </button>
                <Link href={route('messages.index', { user_id: profileUser.id })}
                  className="h-8 w-8 rounded-full text-[14px] flex items-center justify-center transition-all active:scale-95"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                  ✉
                </Link>
              </>
            )}
            {isSelf && (
              <Link href={route('profile.edit')}
                className="h-8 px-4 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition-all active:scale-95"
                style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 13, height: 13 }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                {t('pages.publicProfile.editProfile')}
              </Link>
            )}
          </div>

          {/* Name + badge */}
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[18px] font-black leading-tight" style={feedMoodText.primary}>
                {profileUser.name}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: campusBadge.bg, color: campusBadge.color, border: `1px solid ${campusBadge.border}` }}>
                {campusBadge.text}
              </span>
            </div>
            <p className="text-[12px]" style={feedMoodText.secondary}>{profileUser.email}</p>
            {profileUser.bio && (
              <p className="text-[13px] leading-relaxed pt-1.5" style={feedMoodText.primary}>{profileUser.bio}</p>
            )}
          </div>

          {/* ── Stats — flat, Instagram-style ── */}
          <div className="flex items-center mt-4">
            <StatCol n={pubCount} label={t('pages.publicProfile.statPosts')} active={false} hue={hue} onClick={() => {}} />
            <div style={{ width: 1, height: 24, background: 'var(--border)', flexShrink: 0 }} />
            <StatCol n={followers} label={t('pages.publicProfile.statFollowers')} active={networkTab === 'followers'} hue={hue}
              onClick={() => setNetworkTab(networkTab === 'followers' ? null : 'followers')} />
            <div style={{ width: 1, height: 24, background: 'var(--border)', flexShrink: 0 }} />
            <StatCol n={following} label={t('pages.publicProfile.statFollowing')} active={networkTab === 'following'} hue={hue}
              onClick={() => setNetworkTab(networkTab === 'following' ? null : 'following')} />
          </div>
        </div>

        {/* ── Network panel ── */}
        {networkTab && (
          <div className="mx-4 mt-3 rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-sm font-bold" style={feedMoodText.primary}>
                {networkTab === 'followers' ? t('pages.publicProfile.statFollowers') : t('pages.publicProfile.statFollowing')}
              </p>
              <button type="button" onClick={() => setNetworkTab(null)}
                className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{ color: 'var(--text-2)', background: 'var(--panel-bg)', border: '1px solid var(--border)' }}>
                ✕
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto divide-y" style={{ '--tw-divide-opacity': 1, borderColor: 'var(--border)' }}>
              {(networkTab === 'followers' ? followersList : followingList).map(u => (
                <Link key={u.id} href={route('users.show', u.id)}
                  className="flex items-center gap-3 px-4 py-2.5 transition hover:opacity-80"
                  style={{ color: 'var(--text-1)' }}>
                  <Avatar name={u.name} size="sm" src={u.avatar_url} builder={u.avatar_builder} />
                  <span className="truncate text-sm font-semibold">{u.name}</span>
                </Link>
              ))}
              {(networkTab === 'followers' ? followersList : followingList).length === 0 && (
                <p className="py-8 text-center text-xs" style={feedMoodText.secondary}>
                  {t('pages.publicProfile.emptyNetwork', { defaultValue: 'Aucun compte pour le moment.' })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Posts section ── */}
        <div className="mt-5">

          {/* Tab bar */}
          <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex-1 flex items-center justify-center gap-1.5 pb-2.5 text-[11px] font-bold uppercase tracking-wider"
              style={{
                color: `hsl(${hue},65%,55%)`,
                borderBottom: `2px solid hsl(${hue},65%,55%)`,
                marginBottom: -1,
              }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              {t('pages.publicProfile.tabPosts')}
            </div>
          </div>

          {/* Expanded single post */}
          {focusPostId !== null ? (
            <div className="px-4 pt-4">
              <button type="button" onClick={() => setFocusPostId(null)}
                className="mb-3 text-sm font-semibold flex items-center gap-1"
                style={{ color: `hsl(${hue},65%,58%)` }}>
                ← {t('pages.savedPosts.backGrid')}
              </button>
              {posts.filter(p => p.id === focusPostId).map(p => (
                <PostCard key={p.id} p={p} auth={auth} university={university} onDelete={handleDelete} />
              ))}
            </div>

          ) : posts.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: `hsla(${hue},65%,55%,0.1)`, border: `1.5px solid hsla(${hue},65%,55%,0.2)` }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"
                  style={{ color: `hsl(${hue},60%,62%)` }}>
                  <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                </svg>
              </div>
              <p className="text-sm font-semibold" style={feedMoodText.secondary}>{t('pages.publicProfile.emptyPosts')}</p>
              {isSelf && <p className="text-xs" style={feedMoodText.muted}>Commence à publier pour remplir ton profil !</p>}
            </div>

          ) : (
            /* 3-col grid — edge-to-edge */
            <div className="grid grid-cols-3 gap-[1.5px]" style={{ background: 'var(--border)' }}>
              {posts.map(p => {
                const thumb = firstPostThumb(p);
                return (
                  <button key={p.id} type="button" onClick={() => setFocusPostId(p.id)}
                    className="relative aspect-square group overflow-hidden"
                    style={{ background: 'var(--bg-card)' }}>
                    {thumb ? (
                      <>
                        <img src={thumb} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          style={{ background: 'rgba(0,0,0,0.28)' }}>
                          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" opacity=".9"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-2 text-center text-[10px] leading-snug"
                        style={feedMoodText.secondary}>
                        {(p.body || '').slice(0, 60)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </AuthenticatedLayout>
  );
}
