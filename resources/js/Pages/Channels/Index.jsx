import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { feedMoodText, feedPageRoot } from '@/Components/Layout/feedPageSurface';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ACCENT_GRADIENTS = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-700',
    'from-pink-500 to-rose-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-cyan-500 to-sky-600',
];

function channelGradient(id) {
    return ACCENT_GRADIENTS[(id || 0) % ACCENT_GRADIENTS.length];
}

function ChannelCard({ c, isFollowing, onToggle }) {
    const { t } = useTranslation();
    const nFollowers = c.followers_count ?? 0;
    const grad = channelGradient(c.id);
    const hasThumb = Boolean(c.preview?.thumb_url) && !c.preview?.is_video;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border [border-color:var(--border)] [background:var(--bg-card)] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            {/* Cover */}
            <Link href={route('channels.show', c.id)} className="block">
                <div className="relative h-32 w-full overflow-hidden sm:h-36">
                    {hasThumb ? (
                        <>
                            <img
                                src={c.preview.thumb_url}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </>
                    ) : (
                        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad}`}>
                            <span className="text-4xl font-black text-white/30 select-none">
                                {(c.name || '?').charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Avatar flottant */}
                    <div className="absolute bottom-3 left-3">
                        {c.avatar_url ? (
                            <img
                                src={c.avatar_url}
                                alt=""
                                className="h-10 w-10 rounded-xl object-cover border-2 border-white shadow-md"
                            />
                        ) : (
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${grad} border-2 border-white shadow-md`}>
                                <span className="text-base font-black text-white">
                                    {(c.name || '?').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* Info */}
            <div className="flex flex-1 flex-col gap-2 p-3 pt-2">
                <div className="min-w-0">
                    <Link
                        href={route('channels.show', c.id)}
                        className="block text-sm font-bold leading-tight hover:text-blue-600 [color:var(--text-1)] truncate"
                    >
                        {c.name}
                    </Link>
                    {c.description ? (
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug [color:var(--text-2)]">
                            {c.description}
                        </p>
                    ) : null}
                    <p className="mt-1 flex items-center gap-1 text-[11px] [color:var(--text-3)]">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                        </svg>
                        {nFollowers === 1
                            ? t('pages.channels.followersOne', { n: nFollowers })
                            : t('pages.channels.followersMany', { n: nFollowers })}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onToggle(c.id)}
                    className={`mt-auto w-full rounded-xl py-2 text-xs font-bold transition-all active:scale-[0.97] ${
                        isFollowing
                            ? 'border [border-color:var(--border)] [background:var(--bg-card)] [color:var(--text-1)]'
                            : 'text-white'
                    }`}
                    style={!isFollowing ? {
                        background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                        boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                    } : {}}
                >
                    {isFollowing ? t('pages.channels.unfollow') : t('pages.channels.follow')}
                </button>
            </div>
        </div>
    );
}

export default function ChannelsIndex({
    channels = [],
    followedChannelIds = [],
    showFollowing = false,
}) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const followed = new Set(followedChannelIds);

    const toggle = (id) => {
        router.post(route('channels.follow.toggle', id), {}, { preserveScroll: true });
    };

    const discoverHref = route('channels.index');
    const followingHref = `${route('channels.index')}?following=1`;

    const filtered = search.trim()
        ? channels.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
        : channels;

    return (
        <AuthenticatedLayout layoutVariant="feed">
            <Head title={t('pages.channels.headTitle')} />

            <div className={`${feedPageRoot} pb-24`}>
                {/* Sticky header */}
                <div
                    className="sticky top-0 z-20 border-b px-4 pt-4 pb-3 sm:px-6 [border-color:var(--border)]"
                    style={{ background: 'var(--nav-blur-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                >
                    <div className="mx-auto max-w-5xl">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h1 className="text-xl font-black [color:var(--text-1)]">
                                    {t('pages.channels.headTitle', { defaultValue: 'Canaux' })}
                                </h1>
                                <p className="text-[11px] [color:var(--text-3)]">
                                    {showFollowing
                                        ? `${followedChannelIds.length} abonnements`
                                        : `${channels.length} canaux disponibles`}
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-3">
                            <Link
                                href={discoverHref}
                                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                                    !showFollowing
                                        ? 'text-white'
                                        : '[background:var(--bg-card)] [color:var(--text-2)] border [border-color:var(--border)]'
                                }`}
                                style={!showFollowing ? { background: 'linear-gradient(135deg,#2563eb,#4f46e5)' } : {}}
                            >
                                {t('pages.channels.linkDiscover', { defaultValue: 'Decouvrir' })}
                            </Link>
                            <Link
                                href={followingHref}
                                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                                    showFollowing
                                        ? 'text-white'
                                        : '[background:var(--bg-card)] [color:var(--text-2)] border [border-color:var(--border)]'
                                }`}
                                style={showFollowing ? { background: 'linear-gradient(135deg,#2563eb,#4f46e5)' } : {}}
                            >
                                {t('pages.channels.linkMySubscriptions', { n: followedChannelIds.length, defaultValue: 'Abonnements' })}
                            </Link>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 [color:var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
                            </svg>
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('pages.channels.searchPlaceholder', { defaultValue: 'Rechercher un canal...' })}
                                className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm [background:var(--bg-card)] [color:var(--text-1)] border [border-color:var(--border)] outline-none focus:border-blue-400 transition-colors placeholder-[var(--text-3)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="text-4xl mb-3">📡</div>
                            <p className="text-sm font-semibold [color:var(--text-2)]">
                                {showFollowing
                                    ? t('pages.channels.emptyFollowing', { defaultValue: 'Vous ne suivez aucun canal.' })
                                    : search ? 'Aucun canal trouve.' : t('pages.channels.empty', { defaultValue: 'Aucun canal disponible.' })}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                            {filtered.map((c) => (
                                <ChannelCard
                                    key={c.id}
                                    c={c}
                                    isFollowing={followed.has(c.id)}
                                    onToggle={toggle}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
