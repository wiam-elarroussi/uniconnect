import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PostCard from '@/Components/Dashboard/PostCard';
import Avatar from '@/Components/Dashboard/Avatar';

export default function PublicProfile({
  auth,
  profileUser,
  university = '',
  posts = [],
  isFollowing = false,
  isSelf = false,
}) {
  const toggleFollow = () => {
    router.post(route('users.follow.toggle', profileUser.id), {}, { preserveScroll: true });
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer ce message définitivement ?')) {
      router.delete(route('posts.destroy', id));
    }
  };

  const campusBadge = (() => {
    const cr = profileUser.campus_role || 'student';
    if (profileUser.role === 'super_admin') return { text: 'Super admin', className: 'bg-violet-100 text-violet-800 border-violet-200' };
    if (profileUser.role === 'admin') return { text: 'Modérateur', className: 'bg-amber-100 text-amber-900 border-amber-200' };
    if (cr === 'teacher') return { text: 'Enseignant·e', className: 'bg-sky-100 text-sky-900 border-sky-200' };
    if (cr === 'staff') return { text: 'Personnel', className: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
    return { text: 'Étudiant·e', className: 'bg-slate-100 text-slate-700 border-slate-200' };
  })();

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center gap-2">
          <Link href={route('dashboard')} className="text-sm font-medium text-slate-500 hover:text-slate-800">
            ← Fil
          </Link>
          <span className="text-slate-300">·</span>
          <span className="font-semibold text-sm text-slate-900">{profileUser.name}</span>
        </div>
      }
    >
      <Head title={`${profileUser.name} · Profil`} />

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar
              name={profileUser.name}
              size="xl"
              src={profileUser.avatar_url}
              builder={profileUser.avatar_builder}
              previewOnHover
              previewLabel={profileUser.name}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 truncate">{profileUser.name}</h1>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${campusBadge.className}`}
                >
                  {campusBadge.text}
                </span>
              </div>
              <p className="text-sm text-slate-500 truncate">{profileUser.email}</p>
              <p className="text-xs text-slate-400 mt-1">{posts.length} publication{posts.length !== 1 ? 's' : ''}</p>
            </div>
            {!isSelf && (
              <button
                type="button"
                onClick={toggleFollow}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isFollowing
                    ? 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? 'Ne plus suivre' : 'Suivre'}
              </button>
            )}
            {isSelf && (
              <Link
                href={route('profile.edit')}
                className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200"
              >
                Modifier le profil
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-12">Aucune publication pour le moment.</p>
          ) : (
            posts.map((p) => (
              <PostCard
                key={p.id}
                p={p}
                auth={auth}
                university={university}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
