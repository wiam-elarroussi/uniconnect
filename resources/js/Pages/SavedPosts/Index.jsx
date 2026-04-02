import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PostCard from '@/Components/Dashboard/PostCard';

export default function SavedPostsIndex({ auth, posts = [], university }) {
  const handleDelete = (id) => {
    if (confirm('Supprimer ce message définitivement ?')) {
      router.delete(route('posts.destroy', id));
    }
  };

  return (
    <AuthenticatedLayout header={<span className="font-semibold">Posts sauvegardés</span>}>
      <Head title="Posts sauvegardés" />
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {posts.length === 0 && (
          <div className="bg-white border rounded-2xl p-6 text-slate-500 text-sm">
            Aucun post sauvegardé pour le moment.
          </div>
        )}

        {posts.map((p) => (
          <PostCard key={p.id} p={p} auth={auth} university={university} onDelete={handleDelete} />
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
