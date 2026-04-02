import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const IconMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconLock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconEye    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconSpin   = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
const IconArrow  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

function Field({ id, label, type = 'text', value, onChange, error, icon, placeholder, autoComplete, autoFocus, right }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label htmlFor={id} className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                {right}
            </div>
            <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                error
                    ? 'border-red-300 bg-red-50 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                    : focused
                        ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                        : 'border-gray-200 bg-slate-50 hover:border-gray-300'
            }`}>
                <span className={`pl-3.5 transition-colors flex-shrink-0 ${focused ? 'text-blue-500' : 'text-slate-400'}`}>{icon}</span>
                <input
                    id={id} type={type} value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm text-slate-800 placeholder-slate-300"
                />
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1"><span>⚠</span>{error}</p>}
        </div>
    );
}

function PasswordField({ id, label, value, onChange, error, autoComplete, right }) {
    const [show, setShow] = useState(false);
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label htmlFor={id} className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                {right}
            </div>
            <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                error
                    ? 'border-red-300 bg-red-50 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                    : focused
                        ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                        : 'border-gray-200 bg-slate-50 hover:border-gray-300'
            }`}>
                <span className={`pl-3.5 transition-colors flex-shrink-0 ${focused ? 'text-blue-500' : 'text-slate-400'}`}><IconLock /></span>
                <input
                    id={id} type={show ? 'text' : 'password'} value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete={autoComplete}
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

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Connexion · UniConnect" />

            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-lg font-black text-slate-900">Bon retour ! 👋</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Connectez-vous à votre espace UniConnect
                </p>
            </div>

            {/* Status message */}
            {status && (
                <div className="mb-5 flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-2.5 rounded-xl">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">

                {/* Email */}
                <Field
                    id="email" label="Email institutionnel" type="email"
                    value={data.email} onChange={e => setData('email', e.target.value)}
                    error={errors.email} icon={<IconMail />}
                    placeholder="prenom.nom@supmti.ma"
                    autoComplete="username" autoFocus
                />

                {/* Mot de passe */}
                <PasswordField
                    id="password" label="Mot de passe"
                    value={data.password} onChange={e => setData('password', e.target.value)}
                    error={errors.password} autoComplete="current-password"
                    right={
                        canResetPassword && (
                            <Link href={route('password.request')}
                                className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-wider transition-colors">
                                Mot de passe oublié ?
                            </Link>
                        )
                    }
                />

                {/* Remember me */}
                <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
                    <div className="relative">
                        <input
                            type="checkbox" name="remember"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors select-none">
                        Se souvenir de moi
                    </span>
                </label>

                {/* Badge éthique */}
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <span className="text-blue-500 flex-shrink-0"><IconShield /></span>
                    <p className="text-[10px] text-blue-700 font-semibold">
                        Accès exclusif @supmti.ma · Session chiffrée HTTPS · Zéro tracking
                    </p>
                </div>

                {/* Bouton connexion */}
                <button
                    type="submit"
                    disabled={processing || !data.email.trim() || !data.password.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                    {processing ? <IconSpin /> : <IconArrow />}
                    {processing ? 'Connexion…' : 'Se connecter'}
                </button>
            </form>

            {/* Lien inscription */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-xs text-slate-400">
                    Pas encore de compte ?{' '}
                    <Link href={route('register')}
                        className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Rejoindre UniConnect →
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}