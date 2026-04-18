// resources/js/Pages/Admin/Dashboard.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

// ── Icônes ──────────────────────────────────────────────────────────────────
const Ic = {
  Users:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Post:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Zap:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Shield:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Trash:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  Ban:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  Unban:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Clock:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Crown:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Alert:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Eye:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Check:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Grid:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Book:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Bell:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Logout:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

// ── CSS ──────────────────────────────────────────────────────────────────────
const ADMIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  :root {
    --bg:       #020408;
    --bg2:      #070c16;
    --card:     rgba(8,14,30,0.9);
    --border:   rgba(255,255,255,0.06);
    --b-glow:   rgba(99,179,237,0.25);
    --t1:       #e8efff;
    --t2:       #7a8db8;
    --t3:       #3a4a6a;
    --blue:     #63b3ed;
    --green:    #68d391;
    --purple:   #b794f4;
    --red:      #fc8181;
    --amber:    #f6ad55;
    --cyan:     #76e4f7;
  }
  .admin-root * { font-family:'DM Sans',sans-serif; }
  .admin-root .f-display { font-family:'Syne',sans-serif; }

  @keyframes a-up   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes a-in   { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes a-glow { 0%,100%{opacity:.35} 50%{opacity:.85} }
  @keyframes a-rot  { to{transform:rotate(360deg)} }
  @keyframes bar-grow { from{width:0} to{width:var(--w)} }
  @keyframes a-scan { 0%{top:-20%} 100%{top:120%} }
  @keyframes a-count { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }

  .a-up   { animation:a-up   0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .a-in   { animation:a-in   0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .a-glow { animation:a-glow 3s ease-in-out infinite; }
  .a-count{ animation:a-count 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }

  .glass {
    background:var(--card);
    border:1px solid var(--border);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    transition:border-color 0.3s,box-shadow 0.3s;
  }
  .glass:hover { border-color:var(--b-glow); }

  .scan { position:relative; overflow:hidden; }
  .scan::after { content:''; position:absolute; left:0; right:0; height:50px;
    background:linear-gradient(transparent,rgba(99,179,237,0.04),transparent);
    animation:a-scan 4s linear infinite; pointer-events:none; }

  .noise::before { content:''; position:absolute; inset:0; border-radius:inherit;
    background:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    pointer-events:none; z-index:1; }

  .neon-btn {
    background:linear-gradient(135deg,#1a4a8a,#2d1a8c);
    box-shadow:0 0 20px rgba(99,179,237,0.2),inset 0 1px 0 rgba(255,255,255,0.08);
    transition:all 0.3s; font-family:'Syne',sans-serif;
  }
  .neon-btn:hover { box-shadow:0 0 30px rgba(99,179,237,0.4),inset 0 1px 0 rgba(255,255,255,0.12); transform:translateY(-1px); }

  .danger-btn {
    background:linear-gradient(135deg,rgba(252,129,129,0.1),rgba(252,129,129,0.05));
    border:1px solid rgba(252,129,129,0.2); color:var(--red); transition:all 0.25s;
  }
  .danger-btn:hover { background:rgba(252,129,129,0.15); border-color:rgba(252,129,129,0.4); }

  .warn-btn {
    background:linear-gradient(135deg,rgba(246,173,85,0.1),rgba(246,173,85,0.05));
    border:1px solid rgba(246,173,85,0.2); color:var(--amber); transition:all 0.25s;
  }
  .warn-btn:hover { background:rgba(246,173,85,0.15); border-color:rgba(246,173,85,0.4); }

  .ok-btn {
    background:linear-gradient(135deg,rgba(104,211,145,0.1),rgba(104,211,145,0.05));
    border:1px solid rgba(104,211,145,0.2); color:var(--green); transition:all 0.25s;
  }
  .ok-btn:hover { background:rgba(104,211,145,0.15); }

  .bar-fill { animation:bar-grow 1s cubic-bezier(0.16,1,0.3,1) both; }

  .stat-ring { animation:a-rot 8s linear infinite; }

  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }
`;

// ── Mini bar chart (SVG) ─────────────────────────────────────────────────────
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => {
        const pct = (d.count / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full rounded-sm overflow-hidden" style={{ height: '48px' }}>
              <div className="absolute bottom-0 w-full rounded-sm transition-all"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  background: `linear-gradient(to top, #63b3ed, #76e4f7)`,
                  boxShadow: '0 0 8px rgba(99,179,237,0.4)',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            </div>
            <span className="text-[8px] font-mono" style={{ color: 'var(--t3)' }}>{d.date}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, delay = '0s', trend }) {
  const colorMap = {
    blue:   { bg: 'rgba(99,179,237,0.08)',   border: 'rgba(99,179,237,0.2)',   glow: 'rgba(99,179,237,0.3)',   text: '#63b3ed'  },
    green:  { bg: 'rgba(104,211,145,0.08)',  border: 'rgba(104,211,145,0.2)',  glow: 'rgba(104,211,145,0.3)',  text: '#68d391'  },
    purple: { bg: 'rgba(183,148,244,0.08)',  border: 'rgba(183,148,244,0.2)',  glow: 'rgba(183,148,244,0.3)',  text: '#b794f4'  },
    amber:  { bg: 'rgba(246,173,85,0.08)',   border: 'rgba(246,173,85,0.2)',   glow: 'rgba(246,173,85,0.3)',   text: '#f6ad55'  },
    cyan:   { bg: 'rgba(118,228,247,0.08)',  border: 'rgba(118,228,247,0.2)',  glow: 'rgba(118,228,247,0.3)',  text: '#76e4f7'  },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="glass rounded-2xl p-5 noise a-up relative overflow-hidden" style={{ animationDelay: delay }}>
      {/* Corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
           style={{ background: `radial-gradient(circle,${c.glow} 0%,transparent 70%)`, transform: 'translate(40%,-40%)' }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                 style={{ background: trend >= 0 ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.1)',
                          color: trend >= 0 ? '#68d391' : '#fc8181' }}>
              <Ic.TrendUp />
              {trend >= 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>

        <p className="text-3xl font-display font-bold mb-1 a-count" style={{ color: c.text, animationDelay: delay }}>
          {value}
        </p>
        <p className="text-xs font-display font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--t2)' }}>{label}</p>
        {sub && <p className="text-[10px]" style={{ color: 'var(--t3)' }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Avatar initiales ─────────────────────────────────────────────────────────
function Av({ name, size = 32 }) {
  const h = name ? (name.charCodeAt(0) * 47 + (name.charCodeAt(1) || 0) * 19) % 360 : 220;
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
         style={{ width: size, height: size, fontSize: size * 0.36,
                  background: `linear-gradient(135deg,hsl(${h},65%,45%),hsl(${(h+60)%360},60%,40%))`,
                  fontFamily: 'Syne,sans-serif', border: '1px solid rgba(255,255,255,0.1)' }}>
      {name?.charAt(0).toUpperCase() || '?'}
    </div>
  );
}

// ── ConfirmModal ─────────────────────────────────────────────────────────────
function ConfirmModal({ show, title, message, onConfirm, onCancel, danger = true }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
         style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass rounded-2xl p-7 max-w-sm w-full noise a-up" style={{ border: danger ? '1px solid rgba(252,129,129,0.2)' : '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: danger ? 'rgba(252,129,129,0.1)' : 'rgba(246,173,85,0.1)',
                        color: danger ? '#fc8181' : '#f6ad55' }}>
            <Ic.Alert />
          </div>
          <h3 className="font-display font-bold" style={{ color: 'var(--t1)' }}>{title}</h3>
        </div>
        <p className="text-sm mb-6" style={{ color: 'var(--t2)' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
            style={{ color: 'var(--t2)', border: '1px solid var(--border)' }}>
            Annuler
          </button>
          <button onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${danger ? 'danger-btn' : 'warn-btn'}`}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function AdminDashboard({
  university,
  stats,
  postsChart,
  topContributors,
  recentPosts,
  recentUsers,
  campusMembers = [],
  channels = [],
  libraryResources = [],
}) {
  const { auth } = usePage().props;
  const [tab, setTab] = useState('overview');
  const [confirm, setConfirm] = useState(null); // { type, id, label }
  const [flash, setFlash] = useState(null);

  const channelForm = useForm({ name: '' });
  const submitChannel = (e) => {
    e.preventDefault();
    channelForm.post(route('admin.channels.store'), {
      preserveScroll: true,
      onSuccess: () => channelForm.reset('name'),
    });
  };

  const showConfirm = (type, id, label) => setConfirm({ type, id, label });

  const executeAction = () => {
    if (!confirm) return;
    const { type, id } = confirm;
    if (type === 'deleteChannel') {
      router.delete(route('admin.channels.destroy', id), {
        preserveScroll: true,
        onSuccess: () => { setFlash('Canal supprimé.'); setConfirm(null); setTimeout(() => setFlash(null), 3000); },
      });
      return;
    }
    if (type === 'deleteResource') {
      router.delete(route('admin.resources.destroy', id), {
        preserveScroll: true,
        onSuccess: () => { setFlash('Ressource supprimée.'); setConfirm(null); setTimeout(() => setFlash(null), 3000); },
      });
      return;
    }
    const routes = {
      deletePost: route('admin.posts.delete', id),
      deleteUser: route('admin.users.delete', id),
      banUser:    route('admin.users.ban', id),
    };
    const methods = { deletePost: 'delete', deleteUser: 'delete', banUser: 'patch' };
    const visitOpts = {
      preserveScroll: true,
      onSuccess: () => { setFlash('Action effectuée avec succès.'); setConfirm(null); setTimeout(() => setFlash(null), 3000); },
    };
    if (type === 'banUser') {
      visitOpts.only = ['campusMembers', 'recentUsers'];
    }
    router[methods[type]](routes[type], visitOpts);
  };

  const TABS = [
    { id: 'overview',  label: 'Vue d\'ensemble', icon: <Ic.Grid />   },
    { id: 'posts',     label: 'Publications',    icon: <Ic.Post />   },
    { id: 'users',     label: 'Utilisateurs',    icon: <Ic.Users />  },
    { id: 'library',   label: 'Bibliothèque',    icon: <Ic.Book />   },
  ];

  return (
    <AuthenticatedLayout user={auth.user}
      header={
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(99,179,237,0.1)', color: '#63b3ed', border: '1px solid rgba(99,179,237,0.2)' }}>
            <Ic.Shield />
          </div>
          <span className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>
            Panneau Admin <span style={{ color: 'var(--blue)' }}>· {university}</span>
          </span>
        </div>
      }
    >
      <Head title={`Admin · ${university}`} />
      <style>{ADMIN_CSS}</style>

      {/* Flash */}
      {flash && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl a-up"
             style={{ background: 'rgba(104,211,145,0.1)', border: '1px solid rgba(104,211,145,0.3)', color: '#68d391' }}>
          <Ic.Check /> <span className="text-sm font-medium">{flash}</span>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        show={!!confirm}
        title={
          confirm?.type === 'banUser'
            ? 'Suspendre l\'utilisateur'
            : confirm?.type === 'deleteChannel'
              ? 'Supprimer ce canal'
              : confirm?.type === 'deleteResource'
                ? 'Supprimer cette ressource'
                : 'Suppression définitive'
        }
        message={`Cette action affectera : ${confirm?.label}`}
        danger={confirm?.type !== 'banUser'}
        onConfirm={executeAction}
        onCancel={() => setConfirm(null)}
      />

      <div className="admin-root min-h-screen py-6 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
        {/* Ambient orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div style={{ position:'absolute',top:'5%',left:'0',width:'35vw',height:'35vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,179,237,0.04),transparent 70%)' }}/>
          <div style={{ position:'absolute',bottom:'10%',right:'0',width:'30vw',height:'30vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(183,148,244,0.04),transparent 70%)' }}/>
        </div>

        <div className="relative max-w-6xl mx-auto" style={{ zIndex: 1 }}>

          {/* ── Header admin ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 a-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full a-glow" style={{ background: '#68d391' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--t3)' }}>
                  Accès Administrateur · {auth.user.email}
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--t1)' }}>
                Centre de Contrôle{' '}
                <span style={{ background: 'linear-gradient(135deg,#63b3ed,#76e4f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {university}
                </span>
              </h1>
            </div>

            {/* Tab switcher */}
            <div className="flex items-center gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
              {TABS.map(({ id, label, icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-bold transition-all"
                  style={tab === id
                    ? { background: 'rgba(99,179,237,0.12)', color: '#63b3ed', border: '1px solid rgba(99,179,237,0.2)' }
                    : { color: 'var(--t3)', border: '1px solid transparent' }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* ══════════════════════ TAB: OVERVIEW ══════════════════════════ */}
          {tab === 'overview' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <StatCard icon={<Ic.Users />}   label="Étudiants"       value={stats.totalUsers}   color="blue"   delay="0.05s" trend={12} />
                <StatCard icon={<Ic.Post />}     label="Publications"    value={stats.totalPosts}   color="purple" delay="0.1s"  trend={8}  />
                <StatCard icon={<Ic.Zap />}      label="Posts Today"     value={stats.postsToday}   color="cyan"   delay="0.15s" />
                <StatCard icon={<Ic.TrendUp />}  label="Nouveaux / 7j"   value={stats.newUsersWeek} color="green"  delay="0.2s"  trend={5}  />
                <StatCard icon={<Ic.Clock />}    label="Actifs / 15min"  value={stats.activeUsers}  color="amber"  delay="0.25s" />
              </div>

              <div className="glass rounded-2xl p-6 noise a-up mb-6" style={{ animationDelay: '0.22s' }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Canaux campus</h3>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--t3)' }}>
                      Les étudiants peuvent publier au nom d’un canal (ex. club, asso) depuis le fil principal.
                    </p>
                  </div>
                  <form onSubmit={submitChannel} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <input
                      value={channelForm.data.name}
                      onChange={(e) => channelForm.setData('name', e.target.value)}
                      placeholder="Nom du canal"
                      className="px-4 py-2 rounded-xl text-sm min-w-[200px]"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--t1)' }}
                    />
                    <button
                      type="submit"
                      disabled={channelForm.processing || !channelForm.data.name?.trim()}
                      className="neon-btn px-4 py-2 rounded-xl text-xs font-bold text-white"
                    >
                      {channelForm.processing ? '…' : 'Créer'}
                    </button>
                  </form>
                </div>
                {channelForm.errors.name && (
                  <p className="text-xs font-medium mb-2" style={{ color: '#fc8181' }}>{channelForm.errors.name}</p>
                )}
                {channels.length === 0 ? (
                  <p className="text-xs" style={{ color: 'var(--t3)' }}>Aucun canal pour l’instant.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {channels.map((c) => (
                      <li
                        key={c.id}
                        className="flex items-center justify-between gap-2 text-[10px] font-bold px-3 py-2 rounded-xl"
                        style={{ background: 'rgba(99,179,237,0.08)', color: '#63b3ed', border: '1px solid rgba(99,179,237,0.2)' }}
                      >
                        <span>{c.name}</span>
                        <button
                          type="button"
                          onClick={() => showConfirm('deleteChannel', c.id, `Canal « ${c.name} »`)}
                          className="px-2 py-1 rounded-lg danger-btn text-[10px]"
                        >
                          <Ic.Trash />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-5 mb-5">
                {/* Graphique posts 7j */}
                <div className="glass rounded-2xl p-6 noise scan a-up" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Publications — 7 derniers jours</h3>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--t3)' }}>Activité du réseau {university}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(99,179,237,0.1)', color: '#63b3ed', border: '1px solid rgba(99,179,237,0.2)' }}>
                      {postsChart.reduce((a, d) => a + d.count, 0)} total
                    </span>
                  </div>
                  <MiniBarChart data={postsChart} />
                </div>

                {/* Top contributeurs */}
                <div className="glass rounded-2xl p-6 noise a-in" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(246,173,85,0.1)', color: '#f6ad55' }}>
                      <Ic.Crown />
                    </div>
                    <h3 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Top Contributeurs</h3>
                  </div>
                  <div className="space-y-3">
                    {topContributors.map((u, i) => {
                      const maxPosts = topContributors[0]?.posts_count || 1;
                      const pct = (u.posts_count / maxPosts) * 100;
                      const colors = ['#f6ad55','#63b3ed','#76e4f7','#b794f4','#68d391'];
                      return (
                        <div key={u.id} className="flex items-center gap-3">
                          <span className="text-[10px] font-bold w-4 text-center" style={{ color: colors[i] }}>#{i+1}</span>
                          <Av name={u.name} size={28} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium truncate" style={{ color: 'var(--t1)' }}>{u.name}</span>
                              <span className="text-[10px] font-bold" style={{ color: colors[i] }}>{u.posts_count}</span>
                            </div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <div className="h-full rounded-full bar-fill"
                                   style={{ '--w': `${pct}%`, width: `${pct}%`, background: `linear-gradient(90deg,${colors[i]},${colors[i]}88)`, animationDelay: `${i*0.1}s` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Derniers inscrits */}
              <div className="glass rounded-2xl p-6 noise a-up" style={{ animationDelay: '0.45s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(104,211,145,0.1)', color: '#68d391' }}>
                    <Ic.Users />
                  </div>
                  <h3 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Derniers inscrits</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recentUsers.map(u => (
                    <div key={u.id} className="flex items-center gap-2.5 p-3 rounded-xl transition-all hover:bg-white/5"
                         style={{ border: '1px solid var(--border)' }}>
                      <Av name={u.name} size={32} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--t1)' }}>{u.name.split(' ')[0]}</p>
                        <p className="text-[9px] truncate" style={{ color: 'var(--t3)' }}>
                          {new Date(u.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════ TAB: POSTS ════════════════════════════ */}
          {tab === 'posts' && (
            <div className="glass rounded-2xl overflow-hidden noise a-up">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 scan" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(183,148,244,0.1)', color: '#b794f4' }}>
                    <Ic.Post />
                  </div>
                  <h2 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>
                    Publications récentes
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(183,148,244,0.1)', color: '#b794f4', border: '1px solid rgba(183,148,244,0.2)' }}>
                    {recentPosts.length}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Auteur','Contenu','Date','Actions'].map(h => (
                        <th key={h} className="px-3 sm:px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                            style={{ color: 'var(--t3)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentPosts.map((p, i) => (
                      <tr key={p.id} className="transition-colors hover:bg-white/[0.02]"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', animationDelay: `${i*0.04}s` }}>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Av name={p.user?.name} size={28} />
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate" style={{ color: 'var(--t1)' }}>{p.user?.name}</p>
                              <p className="text-[9px] truncate max-w-[10rem] sm:max-w-[140px]" style={{ color: 'var(--t3)' }}>{p.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 max-w-xs">
                          <p className="text-xs line-clamp-2 break-words" style={{ color: 'var(--t2)' }}>{p.body}</p>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--t3)' }}>
                            {new Date(p.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <button
                            onClick={() => showConfirm('deletePost', p.id, `"${p.body.substring(0,40)}…"`)}
                            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium danger-btn whitespace-nowrap">
                            <Ic.Trash /> Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════ TAB: USERS ════════════════════════════ */}
          {tab === 'users' && (
            <div className="glass rounded-2xl overflow-hidden noise a-up">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 scan" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,179,237,0.1)', color: '#63b3ed' }}>
                    <Ic.Users />
                  </div>
                  <h2 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Gestion Utilisateurs</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(99,179,237,0.1)', color: '#63b3ed', border: '1px solid rgba(99,179,237,0.2)' }}>
                    {campusMembers.length}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--t3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full a-glow" style={{ background: '#68d391' }} />
                  RGPD — Suppression définitive des données
                </div>
              </div>

              <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[880px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Membre','Email','Inscription','Posts','Rôle campus','Statut','Actions'].map(h => (
                        <th key={h} className="px-3 sm:px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                            style={{ color: 'var(--t3)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campusMembers.map((u) => {
                      const postCount = recentPosts.filter(p => p.user_id === u.id).length;
                      const isBanned = u.is_banned || false;
                      return (
                        <tr key={u.id} className="transition-colors hover:bg-white/[0.02]"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Av name={u.name} size={30} />
                              <span className="text-xs font-medium truncate" style={{ color: 'var(--t1)' }}>{u.name}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 max-w-[12rem]">
                            <span className="text-[10px] break-all" style={{ color: 'var(--t2)' }}>{u.email}</span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--t3)' }}>
                              {new Date(u.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short', year:'numeric' })}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span className="text-xs font-bold" style={{ color: 'var(--blue)' }}>{postCount}</span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <select
                              value={u.campus_role || 'student'}
                              disabled={u.role === 'super_admin'}
                              onChange={(e) => {
                                router.patch(route('admin.users.campus-role', u.id), { campus_role: e.target.value }, { preserveScroll: true });
                              }}
                              className="text-[10px] font-bold rounded-lg px-2 py-1.5 max-w-[9rem] sm:max-w-[140px]"
                              style={{ background: 'rgba(99,179,237,0.08)', color: 'var(--t1)', border: '1px solid rgba(99,179,237,0.2)' }}
                            >
                              <option value="student">Étudiant·e</option>
                              <option value="teacher">Enseignant·e</option>
                              <option value="staff">Personnel</option>
                            </select>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wide whitespace-nowrap`}
                                  style={isBanned
                                    ? { background: 'rgba(252,129,129,0.1)', color: '#fc8181', border: '1px solid rgba(252,129,129,0.2)' }
                                    : { background: 'rgba(104,211,145,0.1)', color: '#68d391', border: '1px solid rgba(104,211,145,0.2)' }}>
                              {isBanned ? '🚫 Suspendu' : '✓ Actif'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => showConfirm('banUser', u.id, u.name)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${isBanned ? 'ok-btn' : 'warn-btn'}`}>
                                {isBanned ? <><Ic.Unban /> Réactiver</> : <><Ic.Ban /> Suspendre</>}
                              </button>
                              <button
                                onClick={() => showConfirm('deleteUser', u.id, `${u.name} + toutes ses données`)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold danger-btn">
                                <Ic.Trash /> RGPD
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════ TAB: LIBRARY ═══════════════════════════ */}
          {tab === 'library' && (
            <div className="glass rounded-2xl overflow-hidden noise a-up">
              <div className="flex items-center justify-between px-6 py-4 scan" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(118,228,247,0.1)', color: '#76e4f7' }}>
                    <Ic.Book />
                  </div>
                  <h2 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Ressources bibliothèque</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(118,228,247,0.1)', color: '#76e4f7', border: '1px solid rgba(118,228,247,0.2)' }}>
                    {libraryResources.length}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto overscroll-x-contain touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Titre', 'Catégorie', 'Filière', 'Auteur', 'Lien', 'Actions'].map((h) => (
                        <th key={h} className="px-3 sm:px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--t3)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {libraryResources.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 sm:px-6 py-8 text-center text-xs" style={{ color: 'var(--t3)' }}>
                          Aucune ressource enregistrée.
                        </td>
                      </tr>
                    ) : (
                      libraryResources.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="px-3 sm:px-6 py-3 text-xs font-medium max-w-[10rem] sm:max-w-none break-words" style={{ color: 'var(--t1)' }}>{r.title}</td>
                          <td className="px-3 sm:px-6 py-3 text-[10px]" style={{ color: 'var(--t2)' }}>{r.category}</td>
                          <td className="px-3 sm:px-6 py-3 text-[10px]" style={{ color: 'var(--t3)' }}>{r.filiere || '—'}</td>
                          <td className="px-3 sm:px-6 py-3 text-[10px] truncate max-w-[8rem]" style={{ color: 'var(--t2)' }}>{r.user?.name}</td>
                          <td className="px-3 sm:px-6 py-3 max-w-[140px] truncate">
                            <a href={r.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">
                              Ouvrir
                            </a>
                          </td>
                          <td className="px-3 sm:px-6 py-3">
                            <button
                              type="button"
                              onClick={() => showConfirm('deleteResource', r.id, r.title)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold danger-btn whitespace-nowrap"
                            >
                              <Ic.Trash /> Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </AuthenticatedLayout>
  );
}