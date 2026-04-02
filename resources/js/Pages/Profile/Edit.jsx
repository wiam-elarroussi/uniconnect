import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

// ── Icônes ────────────────────────────────────────────────────────────────
const IconUser     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconLock     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconTrash    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconShield   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconChevron  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>;

// ── Tab config ─────────────────────────────────────────────────────────────
const TABS = [
    {
        id: 'info',
        label: 'Informations',
        icon: <IconUser />,
        color: 'blue',
        desc: 'Nom, email et vérification',
    },
    {
        id: 'password',
        label: 'Mot de passe',
        icon: <IconLock />,
        color: 'indigo',
        desc: 'Sécurité du compte',
    },
    {
        id: 'danger',
        label: 'Zone de danger',
        icon: <IconTrash />,
        color: 'red',
        desc: 'Suppression du compte',
    },
];

const colorMap = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',  activeBg: 'bg-blue-600',   ring: 'rgba(37,99,235,0.15)'  },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200',activeBg: 'bg-indigo-600', ring: 'rgba(79,70,229,0.15)'  },
    red:    { bg: 'bg-red-50',    text: 'text-red-500',    border: 'border-red-200',   activeBg: 'bg-red-500',    ring: 'rgba(239,68,68,0.15)'  },
};

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('info');
    const user = auth.user;
    const initial = user.name.charAt(0).toUpperCase();
    const roleLabel = user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Étudiant·e';

    const active = TABS.find(t => t.id === activeTab);
    const c = colorMap[active.color];

    return (
        <AuthenticatedLayout
            header={
                <span className="text-slate-500 font-medium">
                    Mon compte <span className="text-slate-900 font-bold">· Profil</span>
                </span>
            }
        >
            <Head title="Mon Profil · UniConnect" />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .tab-panel { animation: fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both; }
            `}</style>

            <div className="min-h-screen bg-slate-50/80 py-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl space-y-6">

                    {/* ── Hero profil ─────────────────────────────────────── */}
                    <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl overflow-hidden p-7 shadow-xl">
                        {/* Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                             style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)' }} />

                        <div className="relative flex items-center gap-5">
                            {/* Avatar grand */}
                            <div className="relative flex-shrink-0">
                                <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl"
                                     style={{ width: 72, height: 72 }}>
                                    {initial}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                                    <span className="w-2 h-2 bg-white rounded-full" />
                                </div>
                            </div>

                            {/* Infos */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-black text-white leading-tight truncate">{user.name}</h1>
                                <p className="text-slate-400 text-sm truncate">{user.email}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white/80 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                        {roleLabel}
                                    </span>
                                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                        <IconShield /> RGPD
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Layout tabs + contenu ────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                        {/* ── Sidebar tabs ── */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-1">
                                {TABS.map((tab) => {
                                    const tc = colorMap[tab.color];
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                                                isActive
                                                    ? `${tc.bg} ${tc.border} border`
                                                    : 'hover:bg-slate-50 border border-transparent'
                                            }`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                                isActive ? `${tc.activeBg} text-white shadow-sm` : `bg-slate-100 text-slate-400`
                                            }`}>
                                                {tab.icon}
                                            </span>
                                            <div className="min-w-0">
                                                <p className={`text-xs font-bold leading-tight ${isActive ? tc.text : 'text-slate-700'}`}>
                                                    {tab.label}
                                                </p>
                                                <p className="text-[10px] text-slate-400 leading-tight mt-0.5 hidden md:block truncate">
                                                    {tab.desc}
                                                </p>
                                            </div>
                                            {isActive && (
                                                <span className={`ml-auto ${tc.text} flex-shrink-0`}><IconChevron /></span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Charte mini */}
                            <div className="mt-4 bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <IconShield /> Vos droits
                                </p>
                                <ul className="space-y-1.5">
                                    {['Droit à l\'oubli', 'Données minimisées', 'Chiffrement HTTPS', 'Zéro revente'].map(item => (
                                        <li key={item} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                            <span className="text-emerald-400">✦</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* ── Panneau actif ── */}
                        <div className="md:col-span-3">
                            {/* Header panneau */}
                            <div className={`tab-panel mb-4 flex items-center gap-3 bg-white rounded-2xl border ${c.border} shadow-sm px-5 py-4`}
                                 style={{ boxShadow: `0 0 0 3px ${c.ring}` }}>
                                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.activeBg} text-white shadow-sm`}>
                                    {active.icon}
                                </span>
                                <div>
                                    <h2 className="font-bold text-slate-900 text-sm leading-tight">{active.label}</h2>
                                    <p className="text-slate-400 text-xs">{active.desc}</p>
                                </div>
                            </div>

                            {/* Contenu */}
                            <div key={activeTab} className="tab-panel bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Barre top colorée */}
                                <div className={`h-0.5 w-full ${c.activeBg}`} />

                                <div className="p-6 sm:p-8">
                                    {activeTab === 'info' && (
                                        <UpdateProfileInformationForm
                                            mustVerifyEmail={mustVerifyEmail}
                                            status={status}
                                            className="max-w-xl"
                                        />
                                    )}
                                    {activeTab === 'password' && (
                                        <UpdatePasswordForm className="max-w-xl" />
                                    )}
                                    {activeTab === 'danger' && (
                                        <>
                                            {/* Avertissement zone rouge */}
                                            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                                                <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 flex-shrink-0 mt-0.5">
                                                    <IconTrash />
                                                </span>
                                                <div>
                                                    <p className="text-sm font-bold text-red-700">Zone de danger irréversible</p>
                                                    <p className="text-xs text-red-500 mt-0.5 leading-relaxed">
                                                        La suppression de votre compte est définitive. Conformément au RGPD, toutes vos données seront effacées (Droit à l'oubli).
                                                    </p>
                                                </div>
                                            </div>
                                            <DeleteUserForm className="max-w-xl" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}