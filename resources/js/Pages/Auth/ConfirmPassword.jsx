import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const IconLock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconEye    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconSpin   = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
const IconArrow  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>;

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Confirmer le mot de passe · UniConnect" />

            {/* Icône zone sécurisée */}
            <div className="flex flex-col items-center mb-6 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-3">
                    <IconShield />
                </div>
                <h1 className="text-lg font-black text-slate-900">Zone sécurisée</h1>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-xs">
                    Cette section est protégée. Confirmez votre mot de passe pour continuer.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">

                {/* Champ mot de passe */}
                <div>
                    <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Mot de passe
                    </label>
                    <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                        errors.password
                            ? 'border-red-300 bg-red-50 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                            : focused
                                ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                                : 'border-gray-200 bg-slate-50'
                    }`}>
                        <span className={`pl-3.5 transition-colors ${focused ? 'text-blue-500' : 'text-slate-400'}`}>
                            <IconLock />
                        </span>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            autoFocus
                            placeholder="••••••••"
                            className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm text-slate-800 placeholder-slate-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            tabIndex={-1}
                            className="pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <IconEyeOff /> : <IconEye />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                            <span>⚠</span> {errors.password}
                        </p>
                    )}
                </div>

                {/* Badge sécurité */}
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <span className="text-blue-500 flex-shrink-0"><IconLock /></span>
                    <p className="text-[10px] text-blue-700 font-semibold">
                        Session chiffrée HTTPS · Votre mot de passe n'est jamais stocké en clair
                    </p>
                </div>

                {/* Bouton */}
                <button
                    type="submit"
                    disabled={processing || !data.password.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                    {processing ? <IconSpin /> : <IconArrow />}
                    {processing ? 'Vérification…' : 'Confirmer et continuer'}
                </button>
            </form>
        </GuestLayout>
    );
}