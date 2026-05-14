import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic = {
  Globe:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Shield:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Mail:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Users:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Plus:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  Check:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Zap:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  ChevD:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="6 9 12 15 18 9"/></svg>,
  Edit:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  X:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const SA_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

  .sa-root { font-family: 'DM Sans', system-ui, sans-serif; }
  .sa-root .font-display { font-family: 'Syne', sans-serif; }

  :root {
    --sa-bg: #07060f;
    --sa-glass: rgba(255,255,255,0.035);
    --sa-border: rgba(255,255,255,0.08);
    --t1: rgba(255,255,255,0.92);
    --t2: rgba(255,255,255,0.55);
    --t3: rgba(255,255,255,0.28);
    --violet: #a78bfa;
    --indigo: #818cf8;
    --green: #68d391;
    --amber: #f6ad55;
    --red: #fc8181;
    --cyan: #76e4f7;
  }

  @keyframes sa-up { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
  @keyframes sa-in { from { opacity:0; transform:scale(0.97) } to { opacity:1; transform:scale(1) } }
  @keyframes sa-glow { 0%,100% { box-shadow:0 0 8px 2px rgba(167,139,250,0.4) } 50% { box-shadow:0 0 18px 4px rgba(167,139,250,0.7) } }
  @keyframes sa-toast-out { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-8px)} }

  .sa-up  { animation: sa-up  0.24s cubic-bezier(0.16,1,0.3,1) both; }
  .sa-in  { animation: sa-in  0.20s cubic-bezier(0.16,1,0.3,1) both; }
  .sa-glow{ animation: sa-glow 2.5s ease-in-out infinite; }

  .sa-glass {
    background: var(--sa-glass);
    border: 1px solid var(--sa-border);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .sa-noise::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0.025;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .sa-tab-btn {
    transition: all 0.18s;
    white-space: nowrap;
  }

  .sa-field {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid var(--sa-border);
    padding: 0.6rem 0.875rem;
    font-size: 0.875rem;
    background: rgba(255,255,255,0.04);
    color: var(--t1);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .sa-field::placeholder { color: var(--t3); }
  .sa-field:focus { border-color: rgba(167,139,250,0.5); box-shadow: 0 0 0 3px rgba(167,139,250,0.12); }
  .sa-field option { background: #1a1625; color: #fff; }

  .sa-btn-violet {
    background: linear-gradient(135deg,#7c3aed,#6d28d9);
    box-shadow: 0 0 20px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    transition: all 0.2s;
    color: #fff;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    border-radius: 0.75rem;
    padding: 0.6rem 1.25rem;
  }
  .sa-btn-violet:hover { box-shadow: 0 0 30px rgba(124,58,237,0.5); transform: translateY(-1px); }
  .sa-btn-violet:disabled { opacity: 0.5; transform: none; }

  .sa-btn-danger {
    background: rgba(252,129,129,0.08);
    border: 1px solid rgba(252,129,129,0.2);
    color: var(--red);
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 0.5rem;
    padding: 0.35rem 0.7rem;
    transition: all 0.2s;
  }
  .sa-btn-danger:hover { background: rgba(252,129,129,0.16); border-color: rgba(252,129,129,0.4); }

  .sa-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 999px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; white-space: nowrap;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--sa-border); border-radius: 2px; }
`;

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, delay = '0s' }) {
  const c = {
    violet: { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', text: '#a78bfa', glow: 'rgba(167,139,250,0.25)' },
    indigo: { bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)', text: '#818cf8', glow: 'rgba(129,140,248,0.25)' },
    green:  { bg: 'rgba(104,211,145,0.08)', border: 'rgba(104,211,145,0.2)', text: '#68d391', glow: 'rgba(104,211,145,0.25)' },
    amber:  { bg: 'rgba(246,173,85,0.08)',  border: 'rgba(246,173,85,0.2)',  text: '#f6ad55', glow: 'rgba(246,173,85,0.25)'  },
  }[color] || {};

  return (
    <div className="sa-glass sa-noise relative rounded-2xl p-5 sa-up overflow-hidden" style={{ animationDelay: delay }}>
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle,${c.glow} 0%,transparent 70%)`, transform: 'translate(35%,-35%)' }} />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
          {icon}
        </div>
        <p className="text-3xl font-display font-bold mb-1" style={{ color: c.text }}>{value}</p>
        <p className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color: 'var(--t2)' }}>{label}</p>
      </div>
    </div>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
      <div className="sa-glass sa-noise sa-in rounded-2xl p-7 max-w-sm w-full relative"
        style={{ border: '1px solid rgba(252,129,129,0.25)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(252,129,129,0.12)', color: '#fc8181' }}>
            <Ic.Alert />
          </div>
          <h3 className="font-display font-bold" style={{ color: 'var(--t1)' }}>{title}</h3>
        </div>
        <p className="text-sm mb-6" style={{ color: 'var(--t2)' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-white/5"
            style={{ color: 'var(--t2)', border: '1px solid var(--sa-border)' }}>
            Annuler
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold sa-btn-danger"
            style={{ borderRadius: '0.75rem', padding: '0.625rem' }}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Initials avatar ───────────────────────────────────────────────────────────
function Av({ name, size = 32 }) {
  const h = name ? (name.charCodeAt(0) * 47 + (name.charCodeAt(1) || 0) * 19) % 360 : 260;
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38,
               background: `linear-gradient(135deg,hsl(${h},60%,42%),hsl(${(h+55)%360},55%,35%))`,
               fontFamily: 'Syne,sans-serif', border: '1px solid rgba(255,255,255,0.12)' }}>
      {name?.charAt(0).toUpperCase() || '?'}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [msg]);

  if (!msg) return null;
  const isErr = type === 'err';
  return (
    <div className="fixed top-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl sa-up max-w-xs cursor-pointer"
      onClick={onClose}
      style={isErr
        ? { background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.35)', color: '#fc8181' }
        : { background: 'rgba(104,211,145,0.1)', border: '1px solid rgba(104,211,145,0.3)', color: '#68d391' }}>
      {isErr ? <Ic.Alert /> : <Ic.Check />}
      <span className="text-sm font-medium flex-1">{msg}</span>
      <span style={{ opacity: 0.5 }}><Ic.X /></span>
    </div>
  );
}

// ── Tab key for localStorage ───────────────────────────────────────────────────
const TAB_KEY = 'uniconnect.superadmin.tab';

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SuperDashboard({
  universities = [],
  rootUniversities = [],
  admins = [],
  contactMessages = [],
  unreadContactCount = 0,
}) {
  const { auth, flash, errors } = usePage().props;

  // Persist active tab in localStorage so Inertia navigations don't reset it
  const [tab, setTabState] = useState(() => {
    try { return localStorage.getItem(TAB_KEY) || 'overview'; } catch { return 'overview'; }
  });
  const setTab = (t) => {
    setTabState(t);
    try { localStorage.setItem(TAB_KEY, t); } catch {}
  };

  const [confirm, setConfirm]           = useState(null);
  const [toast, setToast]               = useState(null);
  const [expandUniForm, setExpandUniForm]     = useState(false);
  const [expandAdminForm, setExpandAdminForm] = useState(false);
  const [editingAdmin, setEditingAdmin]       = useState(null);
  const [editingUni, setEditingUni]           = useState(null);
  const [editAdminLoading, setEditAdminLoading] = useState(false);
  const [editUniLoading, setEditUniLoading]     = useState(false);
  const [localAdmins, setLocalAdmins]             = useState(admins);
  const [localUniversities, setLocalUniversities] = useState(universities);
  const [replyingTo, setReplyingTo]   = useState(null); // contact message id
  const [replyText, setReplyText]     = useState('');
  const [replySending, setReplySending] = useState(false);

  // Sync local state when Inertia props change (e.g. page reload after delete)
  useEffect(() => { setLocalAdmins(admins); }, [admins]);
  useEffect(() => { setLocalUniversities(universities); }, [universities]);

  // Convert server flash (Inertia prop) → local toast once, then forget it
  const seenFlash = useRef(null);
  useEffect(() => {
    if (flash?.success && flash.success !== seenFlash.current) {
      seenFlash.current = flash.success;
      setToast({ msg: flash.success, type: 'ok' });
    }
    if (flash?.error && flash.error !== seenFlash.current) {
      seenFlash.current = flash.error;
      setToast({ msg: flash.error, type: 'err' });
    }
  }, [flash?.success, flash?.error]);

  const showToast = (msg, type = 'ok') => setToast({ msg, type });
  const hideToast = () => setToast(null);

  const uniForm      = useForm({ name: '', domain: '', is_active: true, parent_university_id: '' });
  const adminForm    = useForm({ name: '', email: '', password: '', role: 'admin', university_id: '' });
  const [editAdminData, setEditAdminData] = useState({ name: '', email: '', role: 'admin', university_id: '' });
  const [editUniData, setEditUniData]     = useState({ name: '', domain: '', is_active: true, parent_university_id: '' });

  const addUniversity = (e) => {
    e.preventDefault();
    uniForm.post(route('superadmin.universities.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        uniForm.reset('name', 'domain', 'parent_university_id');
        setExpandUniForm(false);
        showToast('Université ajoutée.');
      },
    });
  };

  const openEditUni = (u) => {
    setEditingUni(u);
    setEditUniData({
      name: u.name,
      domain: u.domain || '',
      is_active: !!u.is_active,
      parent_university_id: u.parent_university_id ? String(u.parent_university_id) : '',
    });
  };

  const submitEditUni = (e) => {
    e.preventDefault();
    setEditUniLoading(true);
    router.patch(route('superadmin.universities.update', editingUni.id), editUniData, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => { setEditingUni(null); showToast('Université mise à jour.'); },
      onError: (errs) => {
        const msg = Object.values(errs)[0] || 'Erreur lors de la mise à jour.';
        showToast(msg, 'err');
      },
      onFinish: () => setEditUniLoading(false),
    });
  };

  const addAdmin = (e) => {
    e.preventDefault();
    adminForm.post(route('superadmin.admins.store'), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        adminForm.reset('name', 'email', 'password');
        setExpandAdminForm(false);
        showToast('Administrateur créé.');
      },
    });
  };

  const openEditAdmin = (a) => {
    setEditingAdmin(a);
    setEditAdminData({ name: a.name, email: a.email, role: a.role, university_id: a.university_id ? String(a.university_id) : '' });
  };

  const submitEditAdmin = (e) => {
    e.preventDefault();
    setEditAdminLoading(true);
    router.patch(route('superadmin.admins.update', editingAdmin.id), editAdminData, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => { setEditingAdmin(null); showToast('Administrateur mis à jour.'); },
      onError: (errs) => {
        const msg = Object.values(errs)[0] || 'Erreur lors de la mise à jour.';
        showToast(msg, 'err');
      },
      onFinish: () => setEditAdminLoading(false),
    });
  };

  const sendReply = async (message) => {
    if (!replyText.trim()) return;
    setReplySending(true);
    try {
      await axios.post(route('superadmin.contact.reply', message.id), { reply: replyText });
      setReplyingTo(null);
      setReplyText('');
      showToast('Réponse envoyée par email.');
    } catch (err) {
      const errData = err.response?.data;
      showToast(errData?.error || 'Erreur lors de l\'envoi.', 'err');
    } finally {
      setReplySending(false);
    }
  };

  const markContactRead = () => {
    router.post(route('superadmin.contact.read-all'), {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => showToast('Messages marqués comme lus.'),
    });
  };

  const executeConfirm = () => {
    if (!confirm) return;
    if (confirm.type === 'deleteUni') {
      router.delete(route('superadmin.universities.destroy', confirm.id), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => { showToast('Université supprimée.'); setConfirm(null); },
        onError: () => { showToast('Suppression impossible (comptes liés).', 'err'); setConfirm(null); },
      });
    } else if (confirm.type === 'deleteAdmin') {
      router.delete(route('superadmin.admins.destroy', confirm.id), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => { showToast('Administrateur supprimé.'); setConfirm(null); },
        onError: () => { showToast('Erreur lors de la suppression.', 'err'); setConfirm(null); },
      });
    }
  };

  const TABS = [
    { id: 'overview',     label: 'Vue d\'ensemble', icon: <Ic.Zap /> },
    { id: 'universities', label: 'Universités',     icon: <Ic.Globe /> },
    { id: 'admins',       label: 'Admins',          icon: <Ic.Shield /> },
    { id: 'messages',     label: `Messages${unreadContactCount > 0 ? ` (${unreadContactCount})` : ''}`, icon: <Ic.Mail /> },
  ];

  const activeUnis   = localUniversities.filter(u => u.is_active).length;
  const rootUniCount = localUniversities.filter(u => !u.parent_university_id).length;

  return (
    <AuthenticatedLayout layoutVariant="feed">
      <Head title="Super Admin · UniConnect" />
      <style>{SA_CSS}</style>

      <ConfirmModal
        show={!!confirm}
        title="Suppression définitive"
        message={`Cette action est irréversible : ${confirm?.label}`}
        onConfirm={executeConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={hideToast} />}

      {/* ── Error banner (server-side validation) ── */}
      {(errors?.university || errors?.domain) && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl sa-up max-w-xs"
          style={{ background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.35)', color: '#fc8181' }}>
          <Ic.Alert />
          <span className="text-sm font-medium">{errors.university || errors.domain}</span>
        </div>
      )}

      {/* ── Edit university modal ── */}
      {editingUni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
          <div className="sa-glass sa-noise sa-in rounded-2xl p-6 max-w-sm w-full relative"
            style={{ border: '1px solid rgba(167,139,250,0.2)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>
                <Ic.Globe />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm truncate" style={{ color: 'var(--t1)' }}>{editingUni.name}</p>
                <p className="text-xs" style={{ color: 'var(--t3)' }}>Modifier l'université</p>
              </div>
            </div>
            <form onSubmit={submitEditUni} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Nom</label>
                <input className="sa-field" placeholder="Nom de l'université"
                  value={editUniData.name}
                  onChange={e => setEditUniData(d => ({ ...d, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Domaine e-mail</label>
                <input className="sa-field" placeholder="supmti.ma (sans @ ni https)"
                  value={editUniData.domain}
                  onChange={e => setEditUniData(d => ({ ...d, domain: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Domaine parent (optionnel)</label>
                <select className="sa-field"
                  value={editUniData.parent_university_id}
                  onChange={e => setEditUniData(d => ({ ...d, parent_university_id: e.target.value }))}>
                  <option value="">— Campus principal —</option>
                  {rootUniversities.filter(u => u.id !== editingUni.id).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.domain})</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--t1)' }}>
                <input type="checkbox" style={{ accentColor: '#a78bfa' }}
                  checked={!!editUniData.is_active}
                  onChange={e => setEditUniData(d => ({ ...d, is_active: e.target.checked }))} />
                Université active
              </label>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditingUni(null)} disabled={editUniLoading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-white/5"
                  style={{ color: 'var(--t2)', border: '1px solid var(--sa-border)' }}>
                  Annuler
                </button>
                <button type="submit" disabled={editUniLoading}
                  className="flex-1 sa-btn-violet text-center">
                  {editUniLoading ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit admin modal ── */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
          <div className="sa-glass sa-noise sa-in rounded-2xl p-6 max-w-sm w-full relative"
            style={{ border: '1px solid rgba(167,139,250,0.2)' }}>
            <div className="flex items-center gap-3 mb-5">
              <Av name={editingAdmin.name} size={36} />
              <div>
                <p className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>{editingAdmin.name}</p>
                <p className="text-xs" style={{ color: 'var(--t3)' }}>Modifier l'administrateur</p>
              </div>
            </div>
            <form onSubmit={submitEditAdmin} className="space-y-3">
              <input className="sa-field" placeholder="Nom" value={editAdminData.name}
                onChange={e => setEditAdminData(d => ({ ...d, name: e.target.value }))} required />
              <input className="sa-field" placeholder="Email" value={editAdminData.email}
                onChange={e => setEditAdminData(d => ({ ...d, email: e.target.value }))} required />
              <select className="sa-field" value={editAdminData.role}
                onChange={e => setEditAdminData(d => ({ ...d, role: e.target.value }))}>
                <option value="admin">Admin université</option>
                <option value="super_admin">Super admin</option>
              </select>
              {editAdminData.role === 'admin' && (
                <select className="sa-field" value={editAdminData.university_id}
                  onChange={e => setEditAdminData(d => ({ ...d, university_id: e.target.value }))}>
                  <option value="">— Université —</option>
                  {rootUniversities.map(u => <option key={u.id} value={u.id}>{u.name} ({u.domain})</option>)}
                </select>
              )}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditingAdmin(null)} disabled={editAdminLoading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-white/5"
                  style={{ color: 'var(--t2)', border: '1px solid var(--sa-border)' }}>
                  Annuler
                </button>
                <button type="submit" disabled={editAdminLoading}
                  className="flex-1 sa-btn-violet text-center">
                  {editAdminLoading ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="sa-root min-h-screen py-6 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--sa-bg)' }}>
        {/* Ambient orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div style={{ position:'absolute',top:'-5%',left:'-5%',width:'40vw',height:'40vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%)' }}/>
          <div style={{ position:'absolute',bottom:'5%',right:'-5%',width:'35vw',height:'35vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.05),transparent 70%)' }}/>
        </div>

        <div className="relative max-w-5xl mx-auto" style={{ zIndex: 1 }}>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sa-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full sa-glow" style={{ background: '#a78bfa' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--t3)' }}>
                  Accès Super Administrateur · {auth.user.email}
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--t1)' }}>
                Centre de Contrôle{' '}
                <span style={{ background: 'linear-gradient(135deg,#a78bfa,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Global
                </span>
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sa-border)' }}>
              {TABS.map(({ id, label, icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className="sa-tab-btn shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-bold whitespace-nowrap"
                  style={tab === id
                    ? { background: 'rgba(167,139,250,0.14)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.22)' }
                    : { color: 'var(--t3)', border: '1px solid transparent' }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* ══════════════════ TAB: OVERVIEW ══════════════════ */}
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Ic.Globe />}  label="Campus principaux" value={rootUniCount}       color="violet" delay="0.05s" />
                <StatCard icon={<Ic.Zap />}    label="Domaines actifs"   value={activeUnis}         color="indigo" delay="0.1s"  />
                <StatCard icon={<Ic.Shield />} label="Administrateurs"   value={admins.length}      color="green"  delay="0.15s" />
                <StatCard icon={<Ic.Mail />}   label="Messages non lus"  value={unreadContactCount} color="amber"  delay="0.2s"  />
              </div>

              {/* Info rule box */}
              <div className="sa-glass sa-noise relative rounded-2xl p-5 mb-5 sa-up" style={{ animationDelay: '0.22s' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>
                    <Ic.Alert />
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-1 font-display" style={{ color: 'var(--t1)' }}>Règle domaine e-mail</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--t2)' }}>
                      <strong style={{ color: 'var(--t1)' }}>1 ligne = 1 domaine e-mail unique</strong> (ex.{' '}
                      <code className="px-1 py-0.5 rounded text-[11px]" style={{ background: 'rgba(255,255,255,0.06)', color: '#a78bfa' }}>supmti.ma</code>).
                      Pour un <strong style={{ color: 'var(--t1)' }}>deuxième domaine</strong> du même établissement, utilisez « Domaine supplémentaire de… » —
                      les inscriptions et la modération admin seront sur le <strong style={{ color: 'var(--t1)' }}>même campus</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent universities + admins */}
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="sa-glass sa-noise relative rounded-2xl overflow-hidden sa-up" style={{ animationDelay: '0.28s' }}>
                  <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--sa-border)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>
                        <Ic.Globe />
                      </div>
                      <h3 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Universités</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
                        {localUniversities.length}
                      </span>
                    </div>
                    <button onClick={() => setTab('universities')} className="text-[11px] font-bold transition hover:opacity-70" style={{ color: '#a78bfa' }}>
                      Voir tout →
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {localUniversities.slice(0, 5).map(u => (
                      <div key={u.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--sa-border)' }}>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: 'var(--t1)' }}>{u.name}</p>
                          <p className="text-[10px] truncate" style={{ color: 'var(--t3)' }}>{u.domain}</p>
                        </div>
                        <span className="sa-badge flex-shrink-0"
                          style={u.is_active
                            ? { background: 'rgba(104,211,145,0.1)', color: '#68d391', border: '1px solid rgba(104,211,145,0.2)' }
                            : { background: 'rgba(252,129,129,0.1)', color: '#fc8181', border: '1px solid rgba(252,129,129,0.2)' }}>
                          {u.is_active ? '● Actif' : '○ Inactif'}
                        </span>
                      </div>
                    ))}
                    {localUniversities.length === 0 && <p className="text-xs text-center py-4" style={{ color: 'var(--t3)' }}>Aucune université.</p>}
                  </div>
                </div>

                <div className="sa-glass sa-noise relative rounded-2xl overflow-hidden sa-up" style={{ animationDelay: '0.32s' }}>
                  <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--sa-border)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
                        <Ic.Shield />
                      </div>
                      <h3 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Admins récents</h3>
                    </div>
                    <button onClick={() => setTab('admins')} className="text-[11px] font-bold transition hover:opacity-70" style={{ color: '#818cf8' }}>
                      Voir tout →
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {localAdmins.slice(0, 5).map(a => (
                      <div key={a.id} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--sa-border)' }}>
                        <Av name={a.name} size={28} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold truncate" style={{ color: 'var(--t1)' }}>{a.name}</p>
                          <p className="text-[10px] truncate" style={{ color: 'var(--t3)' }}>{a.email}</p>
                        </div>
                        <span className="sa-badge flex-shrink-0"
                          style={a.role === 'super_admin'
                            ? { background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }
                            : { background: 'rgba(129,140,248,0.1)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.2)' }}>
                          {a.role === 'super_admin' ? '★ Super' : 'Admin'}
                        </span>
                      </div>
                    ))}
                    {localAdmins.length === 0 && <p className="text-xs text-center py-4" style={{ color: 'var(--t3)' }}>Aucun admin.</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════ TAB: UNIVERSITIES ══════════════════ */}
          {tab === 'universities' && (
            <div className="space-y-5">
              {/* Add form */}
              <div className="sa-glass sa-noise relative rounded-2xl overflow-hidden sa-up">
                <button type="button" onClick={() => setExpandUniForm(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 transition hover:bg-white/[0.02]"
                  style={{ borderBottom: expandUniForm ? '1px solid var(--sa-border)' : 'none' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>
                      <Ic.Plus />
                    </div>
                    <span className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Ajouter une université</span>
                  </div>
                  <span style={{ color: 'var(--t3)', transform: expandUniForm ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <Ic.ChevD />
                  </span>
                </button>
                {expandUniForm && (
                  <form onSubmit={addUniversity} className="p-5 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Nom</label>
                        <input className="sa-field" placeholder="Ex. SupMTI" value={uniForm.data.name}
                          onChange={e => uniForm.setData('name', e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Domaine e-mail</label>
                        <input className="sa-field" placeholder="supmti.ma (sans @ ni https)" value={uniForm.data.domain}
                          onChange={e => uniForm.setData('domain', e.target.value)} required />
                        {uniForm.errors.domain && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{uniForm.errors.domain}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 items-end">
                      <div>
                        <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Domaine supplémentaire de (optionnel)</label>
                        <select className="sa-field" value={uniForm.data.parent_university_id}
                          onChange={e => uniForm.setData('parent_university_id', e.target.value)}>
                          <option value="">— Nouveau campus principal —</option>
                          {rootUniversities.map(u => <option key={u.id} value={u.id}>{u.name} ({u.domain})</option>)}
                        </select>
                      </div>
                      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--t1)' }}>
                        <input type="checkbox" style={{ accentColor: '#a78bfa' }}
                          checked={!!uniForm.data.is_active}
                          onChange={e => uniForm.setData('is_active', e.target.checked)} />
                        Université active
                      </label>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button type="submit" disabled={uniForm.processing} className="sa-btn-violet">
                        {uniForm.processing ? 'Création…' : 'Créer l\'université'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* List */}
              <div className="sa-glass sa-noise relative rounded-2xl overflow-hidden sa-up" style={{ animationDelay: '0.08s' }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid var(--sa-border)' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>
                    <Ic.Globe />
                  </div>
                  <h2 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Toutes les universités</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
                    {localUniversities.length}
                  </span>
                </div>
                {localUniversities.length === 0 ? (
                  <p className="px-5 py-10 text-center text-sm" style={{ color: 'var(--t3)' }}>Aucune université enregistrée.</p>
                ) : (
                  <div className="overflow-x-auto overscroll-x-contain">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--sa-border)' }}>
                          {['Nom', 'Domaine', 'Statut', 'Campus parent', 'Actions'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                              style={{ color: 'var(--t3)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {localUniversities.map(u => (
                          <tr key={u.id} className="transition-colors hover:bg-white/[0.015]"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td className="px-5 py-3.5">
                              <p className="text-sm font-semibold" style={{ color: 'var(--t1)' }}>{u.name}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <code className="text-xs px-2 py-0.5 rounded-lg"
                                style={{ background: 'rgba(167,139,250,0.08)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.15)' }}>
                                @{u.domain}
                              </code>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="sa-badge"
                                style={u.is_active
                                  ? { background: 'rgba(104,211,145,0.1)', color: '#68d391', border: '1px solid rgba(104,211,145,0.2)' }
                                  : { background: 'rgba(252,129,129,0.1)', color: '#fc8181', border: '1px solid rgba(252,129,129,0.2)' }}>
                                {u.is_active ? '● Actif' : '○ Inactif'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              {u.parent
                                ? <span className="text-xs" style={{ color: 'var(--t2)' }}>{u.parent.name}</span>
                                : <span className="sa-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--t3)', border: '1px solid var(--sa-border)' }}>Principal</span>
                              }
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <button type="button" onClick={() => openEditUni(u)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition"
                                  style={{ background: 'rgba(167,139,250,0.08)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
                                  <Ic.Edit /> Modifier
                                </button>
                                <button type="button"
                                  onClick={() => setConfirm({ type: 'deleteUni', id: u.id, label: `université "${u.name}"` })}
                                  className="sa-btn-danger flex items-center gap-1">
                                  <Ic.Trash /> Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════ TAB: ADMINS ══════════════════ */}
          {tab === 'admins' && (
            <div className="space-y-5">
              {/* Add form */}
              <div className="sa-glass sa-noise relative rounded-2xl overflow-hidden sa-up">
                <button type="button" onClick={() => setExpandAdminForm(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 transition hover:bg-white/[0.02]"
                  style={{ borderBottom: expandAdminForm ? '1px solid var(--sa-border)' : 'none' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
                      <Ic.Plus />
                    </div>
                    <span className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Créer un compte administrateur</span>
                  </div>
                  <span style={{ color: 'var(--t3)', transform: expandAdminForm ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <Ic.ChevD />
                  </span>
                </button>
                {expandAdminForm && (
                  <form onSubmit={addAdmin} className="p-5 space-y-3">
                    <p className="text-xs" style={{ color: 'var(--t3)' }}>
                      L'admin se connectera sur <code className="px-1 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>/login</code> et sera redirigé vers la modération.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Nom</label>
                        <input className="sa-field" placeholder="Nom complet" value={adminForm.data.name}
                          onChange={e => adminForm.setData('name', e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Email</label>
                        <input className="sa-field" placeholder="admin@universite.ma" value={adminForm.data.email}
                          onChange={e => adminForm.setData('email', e.target.value)} required />
                        {adminForm.errors.email && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{adminForm.errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Mot de passe</label>
                        <input type="password" className="sa-field" placeholder="Min. 8 caractères" value={adminForm.data.password}
                          onChange={e => adminForm.setData('password', e.target.value)} required />
                        {adminForm.errors.password && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{adminForm.errors.password}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Rôle</label>
                        <select className="sa-field" value={adminForm.data.role}
                          onChange={e => adminForm.setData('role', e.target.value)}>
                          <option value="admin">Admin université</option>
                          <option value="super_admin">Super admin</option>
                        </select>
                      </div>
                    </div>
                    {adminForm.data.role === 'admin' && (
                      <div>
                        <label className="block text-[11px] font-bold mb-1.5" style={{ color: 'var(--t3)' }}>Université</label>
                        <select className="sa-field" value={adminForm.data.university_id}
                          onChange={e => adminForm.setData('university_id', e.target.value)} required>
                          <option value="">— Choisir une université (obligatoire) —</option>
                          {rootUniversities.map(u => <option key={u.id} value={u.id}>{u.name} ({u.domain})</option>)}
                        </select>
                        {adminForm.errors.university_id && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{adminForm.errors.university_id}</p>}
                      </div>
                    )}
                    <div className="flex justify-end pt-1">
                      <button type="submit" disabled={adminForm.processing} className="sa-btn-violet">
                        {adminForm.processing ? 'Création…' : 'Créer l\'administrateur'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* List */}
              <div className="sa-glass sa-noise relative rounded-2xl overflow-hidden sa-up" style={{ animationDelay: '0.08s' }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid var(--sa-border)' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
                    <Ic.Shield />
                  </div>
                  <h2 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Administrateurs</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.2)' }}>
                    {localAdmins.length}
                  </span>
                </div>
                {localAdmins.length === 0 ? (
                  <p className="px-5 py-10 text-center text-sm" style={{ color: 'var(--t3)' }}>Aucun administrateur.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[580px]">
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--sa-border)' }}>
                          {['Administrateur', 'Email', 'Rôle', 'Université', 'Actions'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                              style={{ color: 'var(--t3)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {localAdmins.map(a => (
                          <tr key={a.id} className="transition-colors hover:bg-white/[0.015]"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <Av name={a.name} size={30} />
                                <p className="text-sm font-semibold" style={{ color: 'var(--t1)' }}>{a.name}</p>
                                {a.id === auth.user.id && (
                                  <span className="sa-badge text-[9px]"
                                    style={{ background: 'rgba(104,211,145,0.08)', color: '#68d391', border: '1px solid rgba(104,211,145,0.2)' }}>
                                    Vous
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="text-xs" style={{ color: 'var(--t2)' }}>{a.email}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="sa-badge"
                                style={a.role === 'super_admin'
                                  ? { background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }
                                  : { background: 'rgba(129,140,248,0.1)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.2)' }}>
                                {a.role === 'super_admin' ? '★ Super Admin' : 'Admin'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="text-xs" style={{ color: 'var(--t2)' }}>
                                {a.university ? a.university.name : '—'}
                              </p>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <button type="button" onClick={() => openEditAdmin(a)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition"
                                  style={{ background: 'rgba(129,140,248,0.08)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.2)' }}>
                                  <Ic.Edit /> Modifier
                                </button>
                                {a.id !== auth.user.id && (
                                  <button type="button"
                                    onClick={() => setConfirm({ type: 'deleteAdmin', id: a.id, label: `admin "${a.name}"` })}
                                    className="sa-btn-danger flex items-center gap-1">
                                    <Ic.Trash />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════ TAB: MESSAGES ══════════════════ */}
          {tab === 'messages' && (
            <div className="sa-glass sa-noise relative rounded-2xl overflow-hidden sa-up">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                style={{ borderBottom: '1px solid var(--sa-border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(246,173,85,0.1)', color: '#f6ad55' }}>
                    <Ic.Mail />
                  </div>
                  <h2 className="font-display font-bold text-sm" style={{ color: 'var(--t1)' }}>Messages de contact</h2>
                  {unreadContactCount > 0 && (
                    <span className="sa-badge"
                      style={{ background: 'rgba(246,173,85,0.12)', color: '#f6ad55', border: '1px solid rgba(246,173,85,0.25)' }}>
                      {unreadContactCount} non lu{unreadContactCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {unreadContactCount > 0 && (
                  <button type="button" onClick={markContactRead}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                    style={{ background: 'rgba(104,211,145,0.08)', color: '#68d391', border: '1px solid rgba(104,211,145,0.2)' }}>
                    <Ic.Check /> Tout marquer comme lu
                  </button>
                )}
              </div>

              {contactMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--t3)' }}>
                    <Ic.Mail />
                  </div>
                  <p className="text-sm" style={{ color: 'var(--t3)' }}>Aucun message pour l'instant.</p>
                </div>
              ) : (
                <div className="divide-y" style={{ '--tw-divide-opacity': 1, borderColor: 'rgba(255,255,255,0.04)' }}>
                  {contactMessages.map(m => {
                    const read = Boolean(m.read_at);
                    const recipientEmail = m.is_anonymous ? m.user?.email : m.email;
                    const isReplying = replyingTo === m.id;
                    return (
                      <div key={m.id} className="px-5 py-4 transition hover:bg-white/[0.015]"
                        style={!read ? { borderLeft: '3px solid #a78bfa' } : {}}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Av name={m.is_anonymous ? '?' : (m.name || '?')} size={28} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: 'var(--t1)' }}>
                                {m.is_anonymous ? 'Anonyme' : m.name}
                                {m.is_anonymous && m.user_id && (
                                  <span className="ml-1.5 text-[10px] font-normal" style={{ color: 'var(--t3)' }}>(compte #{m.user_id})</span>
                                )}
                              </p>
                              {!m.is_anonymous && m.email && (
                                <p className="text-[11px] truncate" style={{ color: 'var(--t3)' }}>{m.email}</p>
                              )}
                              {m.is_anonymous && m.user && (
                                <p className="text-[11px] truncate" style={{ color: 'var(--t3)' }}>
                                  Modération : {m.user.name} · {m.user.email}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!read && (
                              <span className="sa-badge"
                                style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
                                Nouveau
                              </span>
                            )}
                            <span className="text-[10px]" style={{ color: 'var(--t3)' }}>
                              {m.created_at ? new Date(m.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed pl-[2.375rem] mb-3" style={{ color: 'var(--t2)' }}>
                          {m.body}
                        </p>

                        {/* Reply button / inline reply form */}
                        {recipientEmail ? (
                          <div className="pl-[2.375rem]">
                            {!isReplying ? (
                              <button
                                type="button"
                                onClick={() => { setReplyingTo(m.id); setReplyText(''); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                                style={{ background: 'rgba(246,173,85,0.08)', color: '#f6ad55', border: '1px solid rgba(246,173,85,0.2)' }}
                              >
                                <Ic.Mail /> Répondre par email
                              </button>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-[11px]" style={{ color: 'var(--t3)' }}>
                                  Réponse envoyée à <span style={{ color: '#f6ad55' }}>{recipientEmail}</span>
                                </p>
                                <textarea
                                  className="sa-field resize-none"
                                  rows={4}
                                  placeholder="Écrivez votre réponse..."
                                  value={replyText}
                                  onChange={e => setReplyText(e.target.value)}
                                  style={{ fontFamily: 'inherit' }}
                                />
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                    disabled={replySending}
                                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition hover:bg-white/5"
                                    style={{ color: 'var(--t3)', border: '1px solid var(--sa-border)' }}
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => sendReply(m)}
                                    disabled={replySending || !replyText.trim()}
                                    className="px-4 py-1.5 rounded-xl text-xs font-bold transition"
                                    style={{ background: 'rgba(246,173,85,0.1)', color: '#f6ad55', border: '1px solid rgba(246,173,85,0.25)', opacity: (!replyText.trim() || replySending) ? 0.5 : 1 }}
                                  >
                                    {replySending ? 'Envoi…' : 'Envoyer'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="pl-[2.375rem] text-[11px]" style={{ color: 'var(--t3)' }}>
                            Aucune adresse email disponible pour répondre.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </AuthenticatedLayout>
  );
}
