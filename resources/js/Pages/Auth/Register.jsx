import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const IconUser   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconLock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconEye    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconSpin   = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;

function StrengthBar({ password }) {
    const { t } = useTranslation();
    if (!password) return null;
    const score = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;
    const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-500'];
    const levelKeys = ['profile.password.strength.weak', 'profile.password.strength.fair', 'profile.password.strength.strong', 'profile.password.strength.excellent'];
    return (
        <div className="mt-2 space-y-1.5">
            <div className="flex gap-1">
                {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-slate-200'}`} />
                ))}
            </div>
            {score > 0 && (
                <p className={`text-[10px] font-semibold ${score <= 1 ? 'text-red-500' : score === 2 ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {t('auth.passwordStrength', { level: t(levelKeys[score - 1] ?? 'profile.password.strength.weak') })}
                </p>
            )}
        </div>
    );
}

function Field({ id, label, type = 'text', value, onChange, error, icon, placeholder, autoComplete, autoFocus }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-xs font-semibold text-slate-500">{label}</label>
            <div
                className="flex items-center gap-2 rounded-xl px-3 transition-colors duration-150"
                style={{
                    background: error ? '#fef2f2' : focused ? '#ffffff' : '#f1f5f9',
                    border: error ? '1.5px solid #fca5a5' : 'none',
                    outline: focused && !error ? '1.5px solid #bfdbfe' : 'none',
                }}
            >
                <span className={`flex-shrink-0 transition-colors ${focused ? 'text-blue-500' : 'text-slate-400'}`}>{icon}</span>
                <input
                    id={id} type={type} value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    required
                    placeholder={placeholder}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none py-2.5 text-sm text-slate-800 placeholder-slate-400"
                />
            </div>
            {error && <p className="text-xs text-red-500">⚠ {error}</p>}
        </div>
    );
}

function PasswordField({ id, label, value, onChange, error, autoComplete, children }) {
    const [show, setShow]       = useState(false);
    const [focused, setFocused] = useState(false);
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-xs font-semibold text-slate-500">{label}</label>
            <div
                className="flex items-center gap-2 rounded-xl px-3 transition-colors duration-150"
                style={{
                    background: error ? '#fef2f2' : focused ? '#ffffff' : '#f1f5f9',
                    border: error ? '1.5px solid #fca5a5' : 'none',
                    outline: focused && !error ? '1.5px solid #bfdbfe' : 'none',
                }}
            >
                <span className={`flex-shrink-0 transition-colors ${focused ? 'text-blue-500' : 'text-slate-400'}`}><IconLock /></span>
                <input
                    id={id} type={show ? 'text' : 'password'} value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete={autoComplete}
                    required placeholder="••••••••"
                    className="flex-1 min-w-0 bg-transparent border-none outline-none py-2.5 text-sm text-slate-800 placeholder-slate-400"
                />
                <button type="button" tabIndex={-1} onClick={() => setShow(v => !v)}
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600 p-0.5 transition-colors">
                    {show ? <IconEyeOff /> : <IconEye />}
                </button>
            </div>
            {error && <p className="text-xs text-red-500">⚠ {error}</p>}
            {children}
        </div>
    );
}

export default function Register() {
    const { t } = useTranslation();
    const isDark = typeof window !== 'undefined' &&
        window.localStorage.getItem('uniconnect.dashboard.mood') === 'dark';
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    const match = data.password && data.password_confirmation && data.password === data.password_confirmation;
    const canSubmit = data.name.trim() && data.email.trim() && data.password && data.password_confirmation && !processing;

    return (
        <GuestLayout>
            <Head title={t('auth.headTitleRegister')} />

            <div className="mb-5">
                <h1 className="text-xl font-black" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>{t('auth.registerTitle')}</h1>
                <p className="text-sm text-slate-400 mt-1">{t('auth.registerSubtitle')}</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <Field
                    id="name" label={t('profile.fullName')}
                    value={data.name} onChange={e => setData('name', e.target.value)}
                    error={errors.name} icon={<IconUser />}
                    placeholder={t('auth.fullNamePlaceholder')}
                    autoComplete="name" autoFocus
                />

                <Field
                    id="email" label={t('auth.institutionalEmail')} type="email"
                    value={data.email} onChange={e => setData('email', e.target.value)}
                    error={errors.email} icon={<IconMail />}
                    placeholder="prenom.nom@campus.ma"
                    autoComplete="username"
                />

                <div className="h-px bg-slate-100" />

                <PasswordField
                    id="password" label={t('auth.registerPassword')}
                    value={data.password} onChange={e => setData('password', e.target.value)}
                    error={errors.password} autoComplete="new-password"
                >
                    <StrengthBar password={data.password} />
                </PasswordField>

                <PasswordField
                    id="password_confirmation" label={t('auth.confirmPassword')}
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation} autoComplete="new-password"
                >
                    {data.password_confirmation && (
                        <p className={`text-[11px] font-semibold flex items-center gap-1.5 ${match ? 'text-emerald-600' : 'text-orange-500'}`}>
                            <span className="text-base leading-none">{match ? '✓' : '✗'}</span>
                            {match ? t('auth.passwordsMatch') : t('auth.passwordsNoMatch')}
                        </p>
                    )}
                </PasswordField>

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}
                >
                    {processing && <IconSpin />}
                    {processing ? t('auth.creating') : t('auth.createAccount')}
                </button>
            </form>

            <div className={`mt-5 pt-5 border-t text-center ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                <p className="text-xs text-slate-400">
                    {t('auth.alreadyMember')}{' '}
                    <Link href={route('login')} className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Se connecter
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
