import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

// ── Icônes ────────────────────────────────────────────────────────────────
const IconLock    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconEye     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconCheck   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>;
const IconSpin    = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
const IconShield  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

// ── Indicateur de force ───────────────────────────────────────────────────
function PasswordStrength({ password }) {
    if (!password) return null;

    const checks = [
        { label: '8+ caractères',         ok: password.length >= 8 },
        { label: 'Majuscule',              ok: /[A-Z]/.test(password) },
        { label: 'Chiffre',                ok: /[0-9]/.test(password) },
        { label: 'Caractère spécial',      ok: /[^A-Za-z0-9]/.test(password) },
    ];
    const score = checks.filter(c => c.ok).length;
    const levels = [
        { label: 'Très faible', color: '#EF4444', barColor: 'bg-red-400' },
        { label: 'Faible',      color: '#F97316', barColor: 'bg-orange-400' },
        { label: 'Correct',     color: '#EAB308', barColor: 'bg-yellow-400' },
        { label: 'Fort',        color: '#10B981', barColor: 'bg-emerald-500' },
        { label: 'Excellent',   color: '#2563EB', barColor: 'bg-blue-600' },
    ];
    const lvl = levels[score] ?? levels[0];

    return (
        <div className="mt-3 space-y-2">
            {/* Barres */}
            <div className="flex gap-1">
                {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? lvl.barColor : 'bg-gray-100'}`} />
                ))}
            </div>
            {/* Checks */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {checks.map(({ label, ok }) => (
                    <div key={label} className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${ok ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                            <IconCheck />
                        </span>
                        {label}
                    </div>
                ))}
            </div>
            <p className="text-[10px] font-bold" style={{ color: lvl.color }}>
                Force : {lvl.label}
            </p>
        </div>
    );
}

// ── Champ mot de passe ────────────────────────────────────────────────────
function PasswordField({ id, label, value, onChange, refProp, autoComplete, error, hint }) {
    const [show, setShow] = useState(false);
    const [focused, setFocused] = useState(false);

    return (
        <div>
            <label htmlFor={id} className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {label}
            </label>
            <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                error
                    ? 'border-red-300 bg-red-50 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                    : focused
                        ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                        : 'border-gray-200 bg-slate-50'
            }`}>
                <span className="pl-3.5 text-slate-400">
                    <IconLock />
                </span>
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    ref={refProp}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete={autoComplete}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm text-slate-800 placeholder-slate-300"
                />
                <button
                    type="button"
                    onClick={() => setShow(v => !v)}
                    className="pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                >
                    {show ? <IconEyeOff /> : <IconEye />}
                </button>
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
            {hint && !error && (
                <p className="mt-1.5 text-[10px] text-slate-400">{hint}</p>
            )}
        </div>
    );
}

// ── Composant principal ───────────────────────────────────────────────────
export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput         = useRef();
    const currentPasswordInput  = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const passwordsMatch = data.password && data.password_confirmation && data.password === data.password_confirmation;
    const canSubmit = data.current_password && data.password && data.password_confirmation && !processing;

    return (
        <section className={className}>

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <IconLock />
                    </span>
                    Changer le mot de passe
                </h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Utilisez un mot de passe long et unique pour protéger votre compte. Il n'est jamais stocké en clair.
                </p>
            </div>

            <form onSubmit={updatePassword} className="space-y-5">

                {/* Mot de passe actuel */}
                <PasswordField
                    id="current_password"
                    label="Mot de passe actuel"
                    value={data.current_password}
                    onChange={e => setData('current_password', e.target.value)}
                    refProp={currentPasswordInput}
                    autoComplete="current-password"
                    error={errors.current_password}
                />

                {/* Séparateur */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Nouveau mot de passe</span>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Nouveau mot de passe + indicateur force */}
                <div>
                    <PasswordField
                        id="password"
                        label="Nouveau mot de passe"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        refProp={passwordInput}
                        autoComplete="new-password"
                        error={errors.password}
                    />
                    <PasswordStrength password={data.password} />
                </div>

                {/* Confirmation */}
                <div>
                    <PasswordField
                        id="password_confirmation"
                        label="Confirmer le mot de passe"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        error={errors.password_confirmation}
                    />
                    {/* Feedback correspondance */}
                    {data.password_confirmation && (
                        <p className={`mt-1.5 text-[10px] font-semibold flex items-center gap-1.5 transition-colors ${
                            passwordsMatch ? 'text-emerald-600' : 'text-orange-500'
                        }`}>
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                                passwordsMatch ? 'bg-emerald-100' : 'bg-orange-100'
                            }`}>
                                {passwordsMatch ? <IconCheck /> : '·'}
                            </span>
                            {passwordsMatch ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas encore'}
                        </p>
                    )}
                </div>

                {/* Badge sécurité */}
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
                    <span className="text-indigo-500"><IconShield /></span>
                    <p className="text-[10px] text-indigo-700 font-semibold">
                        Chiffrement HTTPS · Mot de passe haché (bcrypt) · Jamais stocké en clair
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {processing ? <IconSpin /> : <IconLock />}
                        {processing ? 'Enregistrement…' : 'Mettre à jour'}
                    </button>

                    {/* Toast succès */}
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl">
                            <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                <IconCheck />
                            </span>
                            Mot de passe mis à jour !
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}