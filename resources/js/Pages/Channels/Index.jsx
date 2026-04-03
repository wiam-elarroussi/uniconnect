import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ChannelsIndex({ channels = [], followedChannelIds = [] }) {
    const { t } = useTranslation();
    const followed = new Set(followedChannelIds);

    const toggle = (id) => {
        router.post(route('channels.follow.toggle', id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header={<span className="font-semibold">{t('pages.channels.header')}</span>}>
            <Head title={t('pages.channels.headTitle')} />

            <div className="max-w-3xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <p className="text-sm text-slate-600 leading-relaxed">{t('pages.channels.intro')}</p>
                <Link
                    href={route('dashboard')}
                    className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    {t('pages.channels.backToFeed')}
                </Link>

                <ul className="space-y-3">
                    {channels.length === 0 ? (
                        <li className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 text-slate-500 text-sm">
                            {t('pages.channels.empty')}
                        </li>
                    ) : (
                        channels.map((c) => {
                            const nFollowers = c.followers_count ?? 0;
                            const followersLabel =
                                nFollowers === 1
                                    ? t('pages.channels.followersOne', { n: nFollowers })
                                    : t('pages.channels.followersMany', { n: nFollowers });
                            return (
                                <li
                                    key={c.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-900 break-words">{c.name}</p>
                                        <p className="text-xs text-slate-500">{followersLabel}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toggle(c.id)}
                                        className={`w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                                            followed.has(c.id)
                                                ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                                                : 'bg-blue-600 text-white hover:bg-blue-500'
                                        }`}
                                    >
                                        {followed.has(c.id) ? t('pages.channels.unfollow') : t('pages.channels.follow')}
                                    </button>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}
