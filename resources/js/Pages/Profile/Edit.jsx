import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Avatar from '@/Components/Dashboard/Avatar';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const IC = {
  User:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Lock:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Trash:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>,
};

const TAB_DEFS = [
  { id: 'info',     tKey: 'profile.tabProfile',  icon: <IC.User />,  accent: '#60a5fa' },
  { id: 'password', tKey: 'profile.tabSecurity', icon: <IC.Lock />,  accent: '#a78bfa' },
  { id: 'danger',   tKey: 'profile.tabAccount',  icon: <IC.Trash />, accent: '#f87171' },
];

function nameHue(name = '') {
  return ((name.charCodeAt(0) * 47 + (name.charCodeAt(1) || 0) * 19) % 360);
}

export default function Edit({ mustVerifyEmail, status }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState('info');
  const user = auth.user;

  const hue  = nameHue(user.name);
  const hue2 = (hue + 45) % 360;

  const roleLabel = user.role === 'super_admin' ? t('profile.roleSuperAdmin')
    : user.role === 'admin' ? t('profile.roleModerator')
    : user.campus_role === 'teacher' ? t('profile.roleTeacher')
    : t('profile.roleStudent');

  const TABS = TAB_DEFS.map(td => ({ ...td, label: t(td.tKey) }));
  const tab = TABS.find(tb => tb.id === activeTab);

  return (
    <AuthenticatedLayout layoutVariant="feed">
      <Head title={t('profile.editTitle')} />

      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .edit-panel{animation:slideUp .22s cubic-bezier(.16,1,.3,1) both}
        .edit-tab{transition:all .18s;position:relative;white-space:nowrap}
        .edit-tab::after{content:'';position:absolute;bottom:-1px;left:50%;right:50%;height:2px;border-radius:2px;transition:all .2s}
        .edit-tab.active::after{left:12px;right:12px}
      `}</style>

      <div className="w-full pb-24">

        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 backdrop-blur-md border-b"
          style={{ background: 'var(--panel-bg,rgba(255,255,255,0.9))', borderColor: 'var(--border)' }}>
          <Link href={route('dashboard')}
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shrink-0"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-1)' }}>
            ←
          </Link>
          <span className="flex-1 text-center text-sm font-black" style={{ color: 'var(--text-1)' }}>
            {t('profile.editTitle')}
          </span>
          <span className="w-8 shrink-0" />
        </div>

        <div className="max-w-2xl mx-auto px-4">

          {/* ── Profile hero card ── */}
          <div className="relative mt-5 rounded-2xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, hsl(${hue},62%,16%) 0%, hsl(${hue2},52%,11%) 100%)` }}>
            {/* Grid texture */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: `linear-gradient(hsla(${hue},80%,70%,0.04) 1px,transparent 1px),linear-gradient(90deg,hsla(${hue},80%,70%,0.04) 1px,transparent 1px)`, backgroundSize: '32px 32px' }} />
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle,hsla(${hue},75%,60%,0.2) 0%,transparent 70%)` }} />

            <div className="relative flex items-center gap-4 px-5 py-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="rounded-full p-[2.5px]"
                  style={{ background: `linear-gradient(135deg,hsl(${hue},70%,55%),hsl(${hue2},65%,45%))` }}>
                  <div className="rounded-full p-[2px]" style={{ background: 'rgba(10,15,35,0.9)' }}>
                    <Avatar name={user.name} size="xl" src={user.avatar_url} builder={user.avatar_builder} online />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: `hsla(${hue},80%,75%,0.6)` }}>
                  {t('profile.tagline')}
                </p>
                <h1 className="text-lg font-black text-white leading-tight truncate">{user.name}</h1>
                <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(148,163,184,0.65)' }}>{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {roleLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
                    <IC.Shield /> RGPD
                  </span>
                  {user.avatar_url && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{ background: `hsla(${hue},70%,55%,0.12)`, border: `1px solid hsla(${hue},70%,55%,0.2)`, color: `hsl(${hue},70%,72%)` }}>
                      📷 {t('profile.photoActive')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div className="mt-4 flex border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
            {TABS.map(tb => (
              <button key={tb.id} type="button"
                onClick={() => setActiveTab(tb.id)}
                className={`edit-tab flex items-center gap-2 px-4 py-3 text-sm font-semibold${activeTab === tb.id ? ' active' : ''}`}
                style={{
                  color: activeTab === tb.id ? tb.accent : 'var(--text-3)',
                  borderBottom: activeTab === tb.id ? `2px solid ${tb.accent}` : '2px solid transparent',
                  marginBottom: -1,
                }}>
                <span style={{ color: activeTab === tb.id ? tb.accent : 'var(--text-3)' }}>{tb.icon}</span>
                {tb.label}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          <div key={activeTab} className="edit-panel mt-5">

            {activeTab === 'info' && (
              <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
            )}

            {activeTab === 'password' && (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div style={{ height: 2, background: 'linear-gradient(90deg,#a78bfa,transparent)' }} />
                <div className="p-5 sm:p-6">
                  <UpdatePasswordForm />
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl p-4"
                  style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)' }}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
                    <IC.Trash />
                  </span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#f87171' }}>
                      {t('profile.dangerBannerTitle')}
                    </p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(248,113,113,0.65)' }}>
                      {t('profile.dangerBannerBody')}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: '1px solid rgba(248,113,113,0.15)' }}>
                  <div style={{ height: 2, background: 'linear-gradient(90deg,#f87171,transparent)' }} />
                  <div className="p-5 sm:p-6">
                    <DeleteUserForm />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Droits RGPD footer ── */}
          <div className="mt-8 mb-4 flex flex-wrap gap-3 justify-center">
            {(t('profile.rgpdItems', { returnObjects: true }) || []).map(r => (
              <span key={r} className="inline-flex items-center gap-1 text-[10px] font-medium"
                style={{ color: 'var(--text-3)' }}>
                <IC.Check /> {r}
              </span>
            ))}
          </div>

        </div>
      </div>
    </AuthenticatedLayout>
  );
}
