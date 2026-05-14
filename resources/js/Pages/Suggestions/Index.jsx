import Avatar from '@/Components/Dashboard/Avatar';
import { feedMoodPanel, feedMoodText, feedPageRoot } from '@/Components/Layout/feedPageSurface';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function SuggestionsIndex({ suggestions = [] }) {
  const { t } = useTranslation();

  const follow = (id) => {
    router.post(route('users.follow.toggle', id), {}, { preserveScroll: true });
  };

  return (
    <AuthenticatedLayout layoutVariant="feed">
      <Head title={t('pages.suggestions.headTitle')} />
      <div className={`${feedPageRoot} mx-auto min-h-0 max-w-2xl px-3 pb-24 pt-3 sm:px-4`}>
        <div className={`mb-4 ${feedMoodPanel.className} border`} style={feedMoodPanel.style}>
          <h1 className="mb-1 text-lg font-black tracking-tight" style={feedMoodText.primary}>
            {t('pages.suggestions.title')}
          </h1>
          <p className="text-sm" style={feedMoodText.secondary}>
            {t('pages.suggestions.intro')}
          </p>
        </div>

        {suggestions.length === 0 ? (
          <p
            className={`${feedMoodPanel.className} border px-4 py-10 text-center text-sm`}
            style={feedMoodPanel.style}
          >
            <span style={feedMoodText.secondary}>{t('pages.suggestions.empty')}</span>
          </p>
        ) : (
          <ul className="space-y-2">
            {suggestions.map((u) => (
              <li
                key={u.id}
                className="flex items-center gap-3 rounded-2xl border p-2.5 shadow-sm backdrop-blur-md sm:p-3 [border-color:var(--border)]"
                style={feedMoodPanel.style}
              >
                <Link href={route('users.show', u.id)} className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar name={u.name} size="lg" src={u.avatar_url} builder={u.avatar_builder} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold" style={feedMoodText.primary}>
                      {u.name}
                    </p>
                    <p className="truncate text-xs" style={feedMoodText.secondary}>
                      {u.role === 'super_admin'
                        ? t('pages.publicProfile.superAdmin', { defaultValue: 'Super Admin' })
                        : u.role === 'admin'
                          ? t('pages.publicProfile.moderator', { defaultValue: 'Modérateur' })
                          : u.campus_role === 'teacher'
                            ? t('pages.suggestions.roleTeacher')
                            : u.campus_role === 'staff'
                              ? t('pages.suggestions.roleStaff')
                              : t('pages.suggestions.roleStudent')}{' '}
                      · {u.posts_count ?? 0} posts
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => follow(u.id)}
                  className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500"
                >
                  {t('pages.suggestions.follow')}
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-center">
          <Link href={route('dashboard')} className="text-sm font-semibold text-blue-600 dark:text-sky-400">
            {t('pages.suggestions.backFeed')}
          </Link>
        </p>
      </div>
    </AuthenticatedLayout>
  );
}
