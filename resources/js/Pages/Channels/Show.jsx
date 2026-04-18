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
        <AuthenticatedLayout header={<span className="font-semibold truncate">{channel?.name}</span>}>
            <Head title={t('pages.channels.showHeadTitle', { name: channel?.name ?? '' })} />

            <div className="max-w-lg mx-auto w-full p-3 sm:p-4 md:p-6 space-y-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Link href={route('channels.index')} className="font-semibold text-blue-600 hover:text-blue-700">
                        {t('pages.channels.backToList')}
                    </Link>
                    <span className="text-slate-400">·</span>
                    <Link href={route('dashboard')} className="text-slate-600 hover:text-slate-900">
                        {t('pages.channels.backToFeed')}
                    </Link>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{t('pages.channels.showIntro')}</p>

                {posts.length === 0 ? (
                    <p className="text-sm text-slate-500 rounded-2xl border border-slate-200 bg-white p-6 text-center">
                        {t('pages.channels.showEmpty')}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {posts.map((p) => (
                            <PostCard key={p.id} p={p} auth={auth} university={university} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
