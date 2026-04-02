import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

// ── Icônes ────────────────────────────────────────────────────────────────
const IconMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconLock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconKey    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const IconEye    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconCheck  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>;
const IconSpin   = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
const IconArrow  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

// ── Indicateur de force ───────────────────────────────────────────────────
function PasswordStrength({ password }) {
    if (!password) return null;
    const checks = [
        { label: '8+ caractères', ok: password.length >= 8 },
        { label: 'Majuscule',     ok: /[A-Z]/.test(password) },
        { label: 'Chiffre',       ok: /[0-9]/.test(password) },
        { label: 'Spécial',       ok: /[^A-Za-z0-9]/.test(password) },
    ];
    const score = checks.filter(c => c.ok).length;
    const levels = [
        { label: 'Très faible', bar: 'bg-red-400' },
        { label: 'Faible',      bar: 'bg-orange-400' },
        { label: 'Correct',     bar: 'bg-yellow-400' },
        { label: 'Fort',        bar: 'bg-emerald-500' },
        { label: 'Excellent',   bar: 'bg-blue-600' },
    ];
    const lvl = levels[score] ?? levels[0];
    return (
        <div className="mt-2.5 space-y-2">
            <div className="flex gap-1">
                {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? lvl.bar : 'bg-gray-100'}`} />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {checks.map(({ label, ok }) => (
                    <div key={label} className={`flex items-center gap-1.5 text-[10px] font-medium ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                            <IconCheck />
                        </span>
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Champ texte ───────────────────────────────────────────────────────────
function Field({ id, label, type = 'text', value, onChange, error, icon, placeholder, autoComplete, disabled }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
            <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                disabled ? 'border-gray-100 bg-gray-50 opacity-70 cursor-not-allowed'
                : error   ? 'border-red-300 bg-red-50 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                : focused ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                          : 'border-gray-200 bg-slate-50 hover:border-gray-300'
            }`}>
                <span className={`pl-3.5 transition-colors flex-shrink-0 ${disabled ? 'text-slate-300' : focused ? 'text-blue-500' : 'text-slate-400'}`}>{icon}</span>
                <input
                    id={id} type={type} value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm text-slate-800 placeholder-slate-300 disabled:cursor-not-allowed"
                />
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1"><span>⚠</span>{error}</p>}
        </div>
    );
}

// ── Champ mot de passe ────────────────────────────────────────────────────
function PasswordField({ id, label, value, onChange, error, autoComplete, autoFocus }) {
    const [show, setShow] = useState(false);
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
            <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                error   ? 'border-red-300 bg-red-50 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                : focused ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                          : 'border-gray-200 bg-slate-50 hover:border-gray-300'
            }`}>
                <span className={`pl-3.5 transition-colors flex-shrink-0 ${focused ? 'text-blue-500' : 'text-slate-400'}`}><IconLock /></span>
                <input
                    id={id} type={show ? 'text' : 'password'} value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete={autoComplete} autoFocus={autoFocus} required
                    placeholder="••••••••"
                    className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm text-slate-800 placeholder-slate-300"
                />
                <button type="button" onClick={() => setShow(v => !v)} tabIndex={-1}
                    className="pr-3.5 text-slate-400 hover:text-slate-600 transition-colors">
                    {show ? <IconEyeOff /> : <IconEye />}
                </button>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1"><span>⚠</span>{error}</p>}
        </div>
    );
}

// ── Page principale ───────────────────────────────────────────────────────
export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token, email, password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const passwordsMatch = data.password && data.password_confirmation && data.password === data.password_confirmation;
    const canSubmit = data.password && data.password_confirmation && !processing;

    return (
        <GuestLayout>
            <Head title="Réinitialiser le mot de passe · UniConnect" />

            {/* Header */}
            <div className="flex flex-col items-center mb-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-3">
                    <IconKey />
                </div>
                <h1 className="text-lg font-black text-slate-900">Nouveau mot de passe</h1>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-xs">
                    Choisissez un mot de passe fort pour sécuriser votre compte UniConnect.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">

                {/* Email — pré-rempli, lecture seule */}
                <div>
                    <Field
                        id="email" label="Email institutionnel" type="email"
                        value={data.email} onChange={e => setData('email', e.target.value)}
                        error={errors.email} icon={<IconMail />}
                        autoComplete="username" disabled
                    />
                    <p className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Compte identifié · Lien de réinitialisation valide
                    </p>
                </div>

                {/* Séparateur */}
                <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Nouveau mot de passe</span>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Nouveau mot de passe + force */}
                <div>
                    <PasswordField
                        id="password" label="Nouveau mot de passe"
                        value={data.password} onChange={e => setData('password', e.target.value)}
                        error={errors.password} autoComplete="new-password" autoFocus
                    />
                    <PasswordStrength password={data.password} />
                </div>

                {/* Confirmation */}
                <div>
                    <PasswordField
                        id="password_confirmation" label="Confirmer le mot de passe"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation} autoComplete="new-password"
                    />
                    {data.password_confirmation && (
                        <p className={`mt-1.5 text-[10px] font-semibold flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-600' : 'text-orange-500'}`}>
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${passwordsMatch ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                                <IconCheck />
                            </span>
                            {passwordsMatch ? 'Les mots de passe correspondent' : 'Ne correspondent pas encore'}
                        </p>
                    )}
                </div>

                {/* Badge sécurité */}
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <span className="text-blue-500 flex-shrink-0"><IconShield /></span>
                    <p className="text-[10px] text-blue-700 font-semibold">
                        Chiffrement HTTPS · Haché bcrypt · Jamais stocké en clair
                    </p>
                </div>

                {/* Bouton */}
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                    {processing ? <IconSpin /> : <IconArrow />}
                    {processing ? 'Réinitialisation…' : 'Réinitialiser le mot de passe'}
                </button>
            </form>
        </GuestLayout>
    );
}