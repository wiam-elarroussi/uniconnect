import { feedMoodPanel, feedMoodText, feedPageRoot } from '@/Components/Layout/feedPageSurface';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostCard from '@/Components/Dashboard/PostCard';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function ChannelsShow({ channel, posts = [], university }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    const handleDelete = (id) => {
        router.delete(route('posts.destroy', id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout layoutVariant="feed">
            <Head title={t('pages.channels.showHeadTitle', { name: channel?.name ?? '' })} />

            <div className="mx-auto w-full max-w-md space-y-3 px-3 py-3 sm:p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Link href={route('channels.index')} className="font-semibold text-blue-600 hover:text-blue-700 dark:text-sky-400">
                        {t('pages.channels.backToList')}
                    </Link>
                    <span className="text-slate-400">·</span>
                    <Link href={route('dashboard')} className="text-slate-600 hover:text-slate-900 dark:text-slate-300">
                        {t('pages.channels.backToFeed')}
                    </Link>
                </div>

                {posts.length === 0 ? (
                    <p
                        className={`${feedMoodPanel.className} text-center text-sm`}
                        style={feedMoodPanel.style}
                    >
                        <span style={feedMoodText.secondary}>{t('pages.channels.showEmpty')}</span>
                    </p>
                ) : (
                    <div className="space-y-3">
                        {posts.map((p) => (
                            <div key={p.id} className="mx-auto w-full max-w-[30rem]">
                                <PostCard p={p} auth={auth} university={university} onDelete={handleDelete} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
