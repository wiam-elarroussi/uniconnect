import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PostCard from '@/Components/Dashboard/PostCard';

export default function SavedPostsIndex({ auth, posts = [], university }) {
  const { t } = useTranslation();

  const handleDelete = (id) => {
    if (confirm(t('dashboard.confirmDeletePost'))) {
      router.delete(route('posts.destroy', id));
    }
  };

  return (
    <AuthenticatedLayout header={<span className="font-semibold">{t('pages.savedPosts.header')}</span>}>
      <Head title={t('pages.savedPosts.headTitle')} />
      <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 pb-[max(1rem,env(safe-area-inset-bottom))] min-w-0">
        {posts.length === 0 && (
          <div className="bg-white border rounded-2xl p-4 sm:p-6 text-slate-500 text-sm">
            {t('pages.savedPosts.empty')}
          </div>
        )}

        {posts.map((p) => (
          <PostCard key={p.id} p={p} auth={auth} university={university} onDelete={handleDelete} />
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
