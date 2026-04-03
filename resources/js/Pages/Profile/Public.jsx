import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const toggleFollow = () => {
    router.post(route('users.follow.toggle', profileUser.id), {}, { preserveScroll: true });
  };

  const handleDelete = (id) => {
    if (confirm(t('dashboard.confirmDeletePost'))) {
      router.delete(route('posts.destroy', id));
    }
  };

  const campusBadge = useMemo(() => {
    const cr = profileUser.campus_role || 'student';
    if (profileUser.role === 'super_admin') {
      return { text: t('pages.publicProfile.superAdmin'), className: 'bg-violet-100 text-violet-800 border-violet-200' };
    }
    if (profileUser.role === 'admin') {
      return { text: t('pages.publicProfile.moderator'), className: 'bg-amber-100 text-amber-900 border-amber-200' };
    }
    if (cr === 'teacher') {
      return { text: t('pages.publicProfile.teacher'), className: 'bg-sky-100 text-sky-900 border-sky-200' };
    }
    if (cr === 'staff') {
      return { text: t('pages.publicProfile.staff'), className: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
    }
    return { text: t('pages.publicProfile.student'), className: 'bg-slate-100 text-slate-700 border-slate-200' };
  }, [profileUser.campus_role, profileUser.role, t]);

  const pubCount = posts.length;
  const pubLabel =
    pubCount === 1 ? t('pages.publicProfile.publicationsOne', { n: pubCount }) : t('pages.publicProfile.publicationsMany', { n: pubCount });

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
          <Link
            href={route('dashboard')}
            className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 shrink-0"
          >
            {t('pages.publicProfile.backFeed')}
          </Link>
          <span className="hidden sm:inline text-slate-300">·</span>
          <span className="font-semibold text-sm text-slate-900 truncate">{profileUser.name}</span>
        </div>
      }
    >
      <Head title={t('pages.publicProfile.headTitle', { name: profileUser.name })} />

      <div className="max-w-2xl mx-auto py-4 sm:py-8 px-3 sm:px-6 lg:px-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] min-w-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
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
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 break-words">{profileUser.name}</h1>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${campusBadge.className}`}
                >
                  {campusBadge.text}
                </span>
              </div>
              <p className="text-sm text-slate-500 truncate">{profileUser.email}</p>
              <p className="text-xs text-slate-400 mt-1">{pubLabel}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
              {!isSelf && (
                <button
                  type="button"
                  onClick={toggleFollow}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isFollowing
                      ? 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? t('pages.publicProfile.unfollow') : t('pages.publicProfile.follow')}
                </button>
              )}
              {isSelf && (
                <Link
                  href={route('profile.edit')}
                  className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200"
                >
                  {t('pages.publicProfile.editProfile')}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-12">{t('pages.publicProfile.emptyPosts')}</p>
          ) : (
            posts.map((p) => (
              <PostCard key={p.id} p={p} auth={auth} university={university} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
