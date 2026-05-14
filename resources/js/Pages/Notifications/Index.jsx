import { feedMoodPanel, feedMoodStickyHeader, feedMoodText, feedPageRoot } from '@/Components/Layout/feedPageSurface';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function bucketForDate(iso, now = new Date()) {
    if (!iso) return 'older';
    const d = new Date(iso);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayMs = 86400000;
    const diffDays = Math.floor((startOfToday - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / dayMs);

    if (diffDays <= 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return 'week';
    if (diffDays < 30) return 'month';
    return 'older';
}

/** @param {string} iso */
function shortRelative(iso, locale, t) {
    if (!iso) return '';
    const d = new Date(iso);
    const s = Math.round((d.getTime() - Date.now()) / 1000);
    const abs = Math.abs(s);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    if (abs < 60) return t('pages.notifications.timeNow');
    if (abs < 3600) return rtf.format(Math.round(s / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.round(s / 3600), 'hour');
    if (abs < 604800) return rtf.format(Math.round(s / 86400), 'day');
    if (abs < 2592000) return rtf.format(Math.round(s / 604800), 'week');
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

function messageLine(actor, body) {
    if (!body) return null;
    if (actor?.name && body.startsWith(actor.name)) {
        const rest = body.slice(actor.name.length).trim();
        return (
            <>
                <span className="font-semibold" style={feedMoodText.primary}>
                    {actor.name}
                </span>
                {rest ? ` ${rest}` : ''}
            </>
        );
    }
    return body;
}

function rowHref(n) {
    const m = n.meta || {};
    if (m.conversation_id) return route('messages.index', { conversation_id: m.conversation_id });
    if (m.sender_id) return route('messages.index', { user_id: m.sender_id });
    return null;
}

export default function NotificationsIndex({ notifications = [] }) {
    const { t, i18n } = useTranslation();
    const locale =
        i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

    const groups = useMemo(() => {
        const order = ['today', 'yesterday', 'week', 'month', 'older'];
        const map = { today: [], yesterday: [], week: [], month: [], older: [] };
        for (const n of notifications) {
            const b = bucketForDate(n.created_at);
            map[b].push(n);
        }
        return order.filter((k) => map[k].length > 0).map((key) => ({ key, items: map[key] }));
    }, [notifications]);

    const markRead = useCallback((id) => {
        router.post(route('notifications.read', id), {}, { preserveScroll: true });
    }, []);

    const remove = useCallback((id, e) => {
        e.preventDefault();
        e.stopPropagation();
        router.delete(route('notifications.destroy', id), { preserveScroll: true });
    }, []);

    const markAll = useCallback(() => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    }, []);

    const sectionTitle = (key) => {
        if (key === 'today') return t('pages.notifications.sectionToday');
        if (key === 'yesterday') return t('pages.notifications.sectionYesterday');
        if (key === 'week') return t('pages.notifications.sectionWeek');
        if (key === 'month') return t('pages.notifications.sectionMonth');
        return t('pages.notifications.sectionOlder');
    };

    return (
        <AuthenticatedLayout layoutVariant="feed">
            <Head title={t('pages.notifications.headTitle')} />
            <div className={`${feedPageRoot} mx-auto max-w-lg px-2 sm:px-0`}>
                <header
                    className={`${feedMoodStickyHeader.className} flex items-center gap-3 py-3`}
                    style={feedMoodStickyHeader.style}
                >
                    <Link
                        href={route('dashboard')}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base transition hover:opacity-85 [color:var(--text-1)] [background:var(--bg-card)]"
                        aria-label={t('pages.notifications.back')}
                    >
                        ←
                    </Link>
                    <h1 className="flex-1 text-center text-base font-bold" style={feedMoodText.primary}>
                        {t('pages.notifications.title')}
                    </h1>
                    <div className="w-16 shrink-0 flex justify-end">
                        {notifications.some((n) => !n.read_at) && (
                            <button
                                type="button"
                                onClick={markAll}
                                className="text-xs font-semibold text-blue-600 dark:text-sky-400 whitespace-nowrap"
                            >
                                {t('pages.notifications.markAll')}
                            </button>
                        )}
                    </div>
                </header>

                <div className="px-3 pb-24 pt-1">
                    {notifications.length === 0 ? (
                        <p
                            className={`${feedMoodPanel.className} border-dashed py-16 text-center text-sm [border-color:var(--border)]`}
                            style={feedMoodPanel.style}
                        >
                            <span style={feedMoodText.secondary}>{t('pages.notifications.empty')}</span>
                        </p>
                    ) : (
                        groups.map(({ key, items }) => (
                            <section key={key} className="mb-6">
                                <h2
                                    className="mb-2 px-1 pt-2 text-[11px] font-bold uppercase tracking-[0.12em]"
                                    style={feedMoodText.muted}
                                >
                                    {sectionTitle(key)}
                                </h2>
                                <ul className="space-y-2">
                                    {items.map((n) => {
                                        const href = rowHref(n);
                                        const unread = !n.read_at;
                                        const rowBg = unread
                                            ? { background: 'color-mix(in srgb, rgba(59,130,246,0.12) 100%, var(--bg-card))', borderLeft: '3px solid #3b82f6' }
                                            : { background: 'var(--bg-card)' };

                                        const bodyEl = (
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <div className="relative h-12 w-12 shrink-0">
                                                    {n.actor?.avatar_url ? (
                                                        <img
                                                            src={n.actor.avatar_url}
                                                            alt=""
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-base font-bold text-white">
                                                            {(n.actor?.name || n.body || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    {unread && (
                                                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm leading-snug" style={feedMoodText.primary}>
                                                        {messageLine(n.actor, n.body) || n.title}
                                                    </p>
                                                    <p className="mt-0.5 text-xs" style={feedMoodText.muted}>
                                                        {shortRelative(n.created_at, locale, t)}
                                                    </p>
                                                </div>
                                                {n.post_thumb_url && (
                                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                                                        <img src={n.post_thumb_url} alt="" className="h-full w-full object-cover" />
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={(e) => remove(n.id, e)}
                                                    className="ml-2 h-8 w-8 shrink-0 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors [color:var(--text-3)] hover:text-red-500"
                                                    title={t('pages.notifications.delete')}
                                                    aria-label={t('pages.notifications.delete')}
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        );

                                        const rowClass = `flex min-w-0 w-full items-center rounded-2xl border py-3 px-3.5 text-left transition [border-color:var(--border)] hover:opacity-95 ${unread ? 'rounded-l-xl' : ''}`;

                                        return (
                                            <li key={n.id}>
                                                {href ? (
                                                    <Link
                                                        href={href}
                                                        className={rowClass}
                                                        style={rowBg}
                                                        onClick={() => unread && markRead(n.id)}
                                                    >
                                                        {bodyEl}
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className={rowClass}
                                                        style={rowBg}
                                                        onClick={() => unread && markRead(n.id)}
                                                    >
                                                        {bodyEl}
                                                    </button>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
