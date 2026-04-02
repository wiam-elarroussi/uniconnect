import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { DASH_CSS } from '@/Components/Dashboard/dashStyles';
import PostCard from '@/Components/Dashboard/PostCard';
import Composer from '@/Components/Dashboard/Composer';

const MOOD_STORAGE_KEY = 'uniconnect.dashboard.mood';

const THEME_VARS = {
  dark: {
    '--bg-card': 'rgba(10,12,28,0.85)',
    '--bg-glass': 'rgba(255,255,255,0.04)',
    '--bg-glass2': 'rgba(255,255,255,0.07)',
    '--border': 'rgba(255,255,255,0.07)',
    '--border-glow': 'rgba(99,179,237,0.30)',
    '--panel-bg': 'rgba(10,12,28,0.97)',
    '--comments-bg': 'rgba(0,0,0,0.20)',
    '--input-bg': 'rgba(255,255,255,0.03)',
    '--input-border': 'rgba(255,255,255,0.07)',
    '--text-1': '#f0f4ff',
    '--text-2': '#8b9cc8',
    '--text-3': '#4a5578',
    '--accent-1': '#63b3ed',
    '--accent-2': '#76e4b0',
    '--accent-3': '#b794f4',
    '--bg-deep': '#0b1433',
  },
  light: {
    '--bg-card': 'rgba(255,255,255,0.80)',
    '--bg-glass': 'rgba(2,6,23,0.03)',
    '--bg-glass2': 'rgba(2,6,23,0.05)',
    '--border': 'rgba(2,6,23,0.10)',
    '--border-glow': 'rgba(37,99,235,0.18)',
    '--panel-bg': 'rgba(255,255,255,0.92)',
    '--comments-bg': 'rgba(2,6,23,0.035)',
    '--input-bg': 'rgba(2,6,23,0.02)',
    '--input-border': 'rgba(2,6,23,0.08)',
    '--text-1': '#0f172a',
    '--text-2': '#334155',
    '--text-3': '#64748b',
    '--accent-1': '#2563eb',
    '--accent-2': '#059669',
    '--accent-3': '#7c3aed',
    '--bg-deep': '#f8fafc',
  },
};

export default function MyPostsIndex({ auth, university, posts = [], channels = [] }) {
  const [moodId, setMoodId] = useState(() =>
    typeof window === 'undefined' ? 'dark' : window.localStorage.getItem(MOOD_STORAGE_KEY) || 'dark'
  );

  useEffect(() => {
    const onMood = (e) => {
      const next = e?.detail?.moodId;
      if (next === 'dark' || next === 'light') setMoodId(next);
    };
    window.addEventListener('uniconnect:mood-change', onMood);
    return () => window.removeEventListener('uniconnect:mood-change', onMood);
  }, []);

  const theme = THEME_VARS[moodId] || THEME_VARS.dark;
  const hour = new Date().getHours();
  const isFocus = hour >= 22 || hour < 7;
  const { processing, reset, errors } = useForm({ body: '' });

  const handleSubmit = (body, media, channelId, onSuccess) => {
    const data = { body, media };
    if (channelId) data.channel_id = channelId;
    router.post(route('posts.store'), data, {
      forceFormData: true,
      onSuccess: () => {
        reset();
        onSuccess();
      },
    });
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer ce message définitivement ?')) {
      router.delete(route('posts.destroy', id));
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-semibold">Mes publications</span>
          <Link
            href={route('dashboard')}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            ← Fil d&apos;actualité
          </Link>
        </div>
      }
    >
      <Head title={`Mes posts · ${university}`} />
      <style>{DASH_CSS}</style>

      <div
        className="dash-root py-6 px-4 sm:px-6 lg:px-8 min-h-[60vh]"
        style={{
          background: moodId === 'light' ? 'linear-gradient(180deg,#f8fafc,#fff)' : 'var(--bg-ambient, #060818)',
          '--bg-ambient':
            moodId === 'light'
              ? 'linear-gradient(180deg,#f8fafc,#fff)'
              : 'linear-gradient(180deg,#0b1433,#060818)',
          ...theme,
        }}
      >
        <div className="relative max-w-[min(100%,520px)] mx-auto space-y-4" style={{ zIndex: 1 }}>
          <p className="text-sm px-1" style={{ color: 'var(--text-3)' }}>
            Ici uniquement <strong style={{ color: 'var(--text-2)' }}>vos</strong> publications. Le fil général n’affiche plus vos posts.
          </p>

          <Composer
            auth={auth}
            isFocusMode={isFocus}
            onSubmit={handleSubmit}
            processing={processing}
            errors={errors}
            channels={channels}
          />

          {posts.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                Vous n’avez pas encore publié. Utilisez le formulaire ci-dessus.
              </p>
            </div>
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
