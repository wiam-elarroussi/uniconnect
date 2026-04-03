import LanguageSwitcher from '@/Components/LanguageSwitcher';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const NAV_COMPACT_STORAGE = 'uniconnect.nav.compact';

function NavGlyph({ name, className = 'w-5 h-5' }) {
    const c = className;
    switch (name) {
        case 'home':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={c}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            );
        case 'channels':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={c}>
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            );
        case 'posts':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={c}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
            );
        case 'shield':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={c}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            );
        case 'chat':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={c}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            );
        case 'stories':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={c}>
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="12" r="8" strokeDasharray="3 2" />
                </svg>
            );
        case 'bookmark':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={c}>
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
            );
        case 'super':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={c}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={c}>
                    <circle cx="12" cy="12" r="10" />
                </svg>
            );
    }
}

export default function AuthenticatedLayout({ header, children }) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const MOOD_STORAGE_KEY = 'uniconnect.dashboard.mood';

    const [moodId, setMoodId] = useState(() => {
        if (typeof window === 'undefined') return 'dark';
        return window.localStorage.getItem(MOOD_STORAGE_KEY) || 'dark';
    });

    const [navCompact, setNavCompact] = useState(() => {
        if (typeof window === 'undefined') return true;
        const v = window.localStorage.getItem(NAV_COMPACT_STORAGE);
        if (v === null) return true;
        return v === '1' || v === 'true';
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(NAV_COMPACT_STORAGE, navCompact ? '1' : '0');
    }, [navCompact]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onMoodChange = (e) => {
            const next = e?.detail?.moodId;
            if (next === 'dark' || next === 'light') setMoodId(next);
        };
        window.addEventListener('uniconnect:mood-change', onMoodChange);
        return () => window.removeEventListener('uniconnect:mood-change', onMoodChange);
    }, []);

    const currentHour = new Date().getHours();
    const isFocusMode = currentHour >= 22 || currentHour < 7;
    const firstName = String(user?.name ?? '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)[0] ?? '';
    const initial = (user?.name || '?').charAt(0).toUpperCase();

    const campus = useMemo(() => {
        const r = user?.campus_role || 'student';
        if (r === 'teacher') return t('nav.campus.teacher');
        if (r === 'staff') return t('nav.campus.staff');
        return t('nav.campus.student');
    }, [user?.campus_role, t]);

    const roleLabel = useMemo(() => {
        if (user.role === 'super_admin') return t('nav.role.super_admin');
        if (user.role === 'admin') return `${t('nav.role.admin')} · ${campus}`;
        return campus;
    }, [user.role, campus, t]);

    const isSuperAdmin = user?.role === 'super_admin';
    const isUniAdmin = user?.role === 'admin';

    const mainNavItems = useMemo(
        () =>
            isSuperAdmin
                ? [
                      { label: t('nav.superAdmin'), route: 'superadmin.dashboard', icon: 'super' },
                      { label: t('nav.myPosts'), route: 'my-posts.index', icon: 'posts' },
                  ]
                : [
                      { label: t('nav.feed'), route: 'dashboard', icon: 'home' },
                      ...(user?.university_id ? [{ label: t('nav.channels'), route: 'channels.index', icon: 'channels' }] : []),
                      { label: t('nav.myPosts'), route: 'my-posts.index', icon: 'posts' },
                      ...(isUniAdmin ? [{ label: t('nav.moderation'), route: 'admin.dashboard', icon: 'shield' }] : []),
                      { label: t('nav.messages'), route: 'messages.index', icon: 'chat' },
                      { label: t('nav.stories'), route: 'stories.index', icon: 'stories' },
                      { label: t('nav.saved'), route: 'saved-posts.index', icon: 'bookmark' },
                  ],
        [t, isSuperAdmin, user?.university_id, isUniAdmin],
    );

    const layoutVars =
        moodId === 'light'
            ? {
                '--text-1': '#0f172a',
                '--text-2': '#334155',
                '--text-3': '#64748b',
                '--border': 'rgba(2,6,23,0.10)',
                '--border-glow': 'rgba(37,99,235,0.18)',
                '--nav-blur-bg': 'rgba(248,250,252,0.88)',
              }
            : {
                '--text-1': '#f0f4ff',
                '--text-2': '#8b9cc8',
                '--text-3': '#4a5578',
                '--border': 'rgba(255,255,255,0.07)',
                '--border-glow': 'rgba(99,179,237,0.30)',
                '--nav-blur-bg': 'rgba(11,20,51,0.70)',
              };

    const isLight = moodId === 'light';
    const navActive = isLight ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-blue-900/30';
    const navInactive = isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800';

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                ...layoutVars,
                background: moodId === 'light' ? 'rgb(248,250,252)' : 'rgb(3,4,10)',
            }}
        >

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { font-family: 'Inter', sans-serif; }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                .nav-blur {
                    background: var(--nav-blur-bg);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .nav-scrolled {
                    box-shadow: 0 1px 0 0 rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.06);
                }
                .mobile-menu-enter {
                    animation: slideDown 0.25s cubic-bezier(0.16,1,0.3,1) both;
                }
                .dropdown-enter {
                    animation: slideDown 0.2s cubic-bezier(0.16,1,0.3,1) both;
                }

                /* Surcharge NavLink actif */
                .nav-active {
                    color: #2563EB !important;
                    position: relative;
                }
                .nav-active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0; right: 0;
                    height: 2px;
                    border-radius: 99px;
                    background: linear-gradient(90deg, #2563EB, #4F46E5);
                }
            `}</style>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* NAVBAR                                                          */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <nav className={`sticky top-0 z-50 nav-blur transition-all duration-300 ${scrolled ? 'nav-scrolled' : 'border-b border-slate-200/60'}`}>
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">

                        {/* ── Gauche : Logo + Nav links ── */}
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex-shrink-0">
                                <ApplicationLogo size="md" showText={true} />
                            </Link>

                            {/* Links desktop : compact (icônes) ou étendu */}
                            <div className="hidden sm:flex items-center gap-1">
                                {mainNavItems.map(({ label, route: r, icon }) =>
                                    navCompact ? (
                                        <Link
                                            key={r}
                                            href={route(r)}
                                            title={label}
                                            aria-label={label}
                                            className={`relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
                                                route().current(r) ? navActive : navInactive
                                            }`}
                                        >
                                            <NavGlyph name={icon} />
                                            {route().current(r) && (
                                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" />
                                            )}
                                        </Link>
                                    ) : (
                                        <Link
                                            key={r}
                                            href={route(r)}
                                            className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                                route().current(r) ? navActive : navInactive
                                            }`}
                                        >
                                            {label}
                                            {route().current(r) && (
                                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" />
                                            )}
                                        </Link>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* ── Droite : Focus badge + User menu ── */}
                        <div className="hidden sm:flex items-center gap-3">
                            <LanguageSwitcher variant="compact" />

                            {/* Badge Mode Focus */}
                            {isFocusMode && (
                                <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-amber-400' : 'bg-amber-300'}`} />
                                    {t('nav.focusMode')}
                                </span>
                            )}

                            {/* Dropdown user */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className={`group flex items-center gap-2.5 rounded-2xl pl-1.5 pr-3 py-1.5 hover:shadow-md transition-all duration-200 focus:outline-none ${
                                            isLight
                                                ? 'bg-white border border-gray-200 hover:border-blue-200'
                                                : 'bg-slate-900/40 border border-white/10 hover:border-blue-400/40'
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                                            {initial}
                                        </div>

                                        {/* Infos */}
                                        <div className="text-left leading-tight">
                                            <p
                                                className={`text-xs font-bold transition-colors ${
                                                    isLight ? 'text-slate-800 group-hover:text-blue-700' : 'text-slate-200 group-hover:text-blue-300'
                                                }`}
                                            >
                                                {firstName}
                                            </p>
                                            <p
                                                className={`text-[9px] font-medium uppercase tracking-wider ${
                                                    isLight ? 'text-slate-400' : 'text-slate-400/90'
                                                }`}
                                            >
                                                {roleLabel}
                                            </p>
                                        </div>

                                        {/* Chevron */}
                                        <svg
                                            className={`w-3.5 h-3.5 transition-all duration-200 group-hover:translate-y-0.5 ${
                                                isLight ? 'text-slate-400 group-hover:text-blue-500' : 'text-slate-400/80 group-hover:text-blue-300'
                                            }`}
                                            viewBox="0 0 20 20" fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content
                                    align="right"
                                    width="52"
                                    contentClasses={`dropdown-enter py-1.5 rounded-2xl shadow-xl border overflow-hidden ${
                                        isLight
                                            ? 'bg-white border-gray-100'
                                            : 'bg-slate-900/95 border-white/10'
                                    }`}
                                >
                                    {/* Header dropdown */}
                                    <div
                                        className={`px-4 py-3 border-b ${
                                            isLight ? 'border-gray-50' : 'border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black">
                                                {initial}
                                            </div>
                                            <div className="min-w-0">
                                                <p
                                                    className="text-sm font-bold truncate"
                                                    style={{ color: isLight ? 'rgb(15,23,42)' : 'var(--text-1)' }}
                                                >
                                                    {user.name}
                                                </p>
                                                <p className="text-[10px] truncate" style={{ color: 'var(--text-3)' }}>
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="py-1.5 px-1.5">
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                                                isLight ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-200 hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <span
                                                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800/60 text-slate-300'
                                                }`}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                                </svg>
                                            </span>
                                            {t('nav.profile')}
                                        </Dropdown.Link>

                                        <label
                                            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl cursor-pointer ${
                                                isLight ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-200 hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                checked={!navCompact}
                                                onChange={() => setNavCompact((v) => !v)}
                                            />
                                            <span>{t('nav.menuLabelsVisible')}</span>
                                        </label>

                                        {isSuperAdmin && (
                                            <Dropdown.Link
                                                href={route('dashboard')}
                                                className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                                                    isLight ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-200 hover:bg-slate-800/60'
                                                }`}
                                            >
                                                {t('nav.studentFeedOptional')}
                                            </Dropdown.Link>
                                        )}

                                        <div className="h-px bg-gray-100 my-1.5 mx-1" />

                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium text-red-400 rounded-xl transition-colors ${
                                                isLight ? 'hover:bg-red-50' : 'hover:bg-red-900/30'
                                            }`}
                                        >
                                            <span
                                                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    isLight ? 'bg-red-50 text-red-400' : 'bg-red-900/20 text-red-300'
                                                }`}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                                </svg>
                                            </span>
                                            {t('nav.logout')}
                                        </Dropdown.Link>
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* ── Burger mobile ── */}
                        <button
                            onClick={() => setShowingNavigationDropdown(v => !v)}
                            className={`sm:hidden w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                                isLight
                                    ? 'border-gray-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600'
                                    : 'border-white/10 bg-slate-900/40 text-slate-300 hover:border-blue-400/40 hover:text-blue-300'
                            }`}
                            aria-label={t('nav.menu')}
                        >
                            <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path
                                    className={!showingNavigationDropdown ? 'block' : 'hidden'}
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={showingNavigationDropdown ? 'block' : 'hidden'}
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Menu mobile ── */}
                {showingNavigationDropdown && (
                    <div
                        className={`sm:hidden mx-4 mb-3 rounded-2xl shadow-xl overflow-hidden mobile-menu-enter ${
                            isLight ? 'bg-white border border-gray-100' : 'bg-slate-900/60 border border-white/10'
                        }`}
                    >
                        <div className={`p-3 flex justify-end border-b ${isLight ? 'border-gray-100' : 'border-white/10'}`}>
                            <LanguageSwitcher variant="compact" />
                        </div>

                        {/* Nav links */}
                        <div className="p-2 border-b border-gray-50 space-y-1">
                            {mainNavItems.map(({ label, route: r }) => (
                                <ResponsiveNavLink
                                    key={r}
                                    href={route(r)}
                                    active={route().current(r)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold"
                                >
                                    {label}
                                </ResponsiveNavLink>
                            ))}
                            {isSuperAdmin && (
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium opacity-90"
                                >
                                    + {t('nav.studentFeedOptional')}
                                </ResponsiveNavLink>
                            )}
                        </div>

                        {/* User info mobile */}
                        <div className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-md">
                                    {initial}
                                </div>
                                <div>
                                    <p className="font-bold text-sm" style={{ color: isLight ? 'rgb(15,23,42)' : 'var(--text-1)' }}>
                                        {user.name}
                                    </p>
                                    <p
                                        className="text-[11px] truncate max-w-[200px]"
                                        style={{ color: isLight ? 'rgba(100,116,139,1)' : 'var(--text-3)' }}
                                    >
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <ResponsiveNavLink
                                    href={route('profile.edit')}
                                    className={`flex items-center gap-2 text-sm font-medium ${
                                        isLight ? 'text-slate-600' : 'text-slate-300'
                                    }`}
                                >
                                    {t('nav.profile')} ({roleLabel})
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    className={`flex items-center gap-2 text-sm font-medium ${
                                        isLight ? 'text-red-500' : 'text-red-300'
                                    } w-full`}
                                >
                                    {t('nav.logout')}
                                </ResponsiveNavLink>
                            </div>
                        </div>

                        {/* Badge focus mode mobile */}
                        {isFocusMode && (
                            <div
                                className={`mx-4 mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl ${
                                    isLight
                                        ? 'bg-amber-50 border border-amber-100'
                                        : 'bg-amber-500/15 border border-amber-400/20'
                                }`}
                            >
                                <span className="text-base">🌙</span>
                                <div>
                                    <p
                                        className="text-xs font-bold"
                                        style={{ color: isLight ? 'rgb(120,53,15)' : '#f6ad55' }}
                                    >
                                        {t('nav.focusModeActive')}
                                    </p>
                                    <p
                                        className="text-[10px]"
                                        style={{ color: isLight ? 'rgb(217,119,6)' : 'rgba(246,173,85,0.75)' }}
                                    >
                                        {t('nav.focusModeHint')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* PAGE HEADER                                                     */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {header && (
                <div
                    className="border-b shadow-sm"
                    style={{
                        background: moodId === 'light' ? 'white' : 'rgba(11,20,51,0.95)',
                        borderColor: moodId === 'light' ? 'rgba(229,231,235,1)' : 'rgba(255,255,255,0.10)',
                    }}
                >
                    <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                            {/* Accent pill */}
                            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-600 to-indigo-500 flex-shrink-0" />
                            <div
                                className="text-sm font-medium"
                                style={{ color: moodId === 'light' ? 'rgb(71,85,105)' : 'var(--text-1)' }}
                            >
                                {header}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* MAIN                                                            */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* FOOTER minimaliste                                              */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <footer
                className="border-t py-6 px-6"
                style={{
                    background: moodId === 'light' ? 'rgba(255,255,255,0.75)' : 'rgba(3,4,10,0.55)',
                    borderColor: moodId === 'light' ? 'rgba(229,231,235,1)' : 'rgba(255,255,255,0.16)',
                }}
            >
                <div
                    className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
                    style={{ color: 'var(--text-1)' }}
                >
                    <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--text-2)' }}>
                        <ApplicationLogo size="sm" showText={true} />
                    </div>
                    <p>
                        {t('nav.footerProject')}{' '}
                        <span className="font-medium" style={{ color: 'var(--text-2)' }}>
                            {t('nav.footerCredits')}
                        </span>
                    </p>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500/90 rounded-full" />
                        <span>{t('nav.footerEthics')}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}