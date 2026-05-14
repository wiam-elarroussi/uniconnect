import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const IconMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconLock   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconEye    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconSpin   = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;

function Field({ id, label, type = 'text', value, onChange, error, icon, placeholder, autoComplete, autoFocus, rightSlot }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-xs font-semibold text-slate-500">{label}</label>
                {rightSlot}
            </div>
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
                    placeholder={placeholder}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none py-2.5 text-sm text-slate-800 placeholder-slate-400"
                />
            </div>
            {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
        </div>
    );
}

function PasswordField({ id, label, value, onChange, error, autoComplete, rightSlot }) {
    const [show, setShow]       = useState(false);
    const [focused, setFocused] = useState(false);
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-xs font-semibold text-slate-500">{label}</label>
                {rightSlot}
            </div>
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
                    placeholder="••••••••"
                    className="flex-1 min-w-0 bg-transparent border-none outline-none py-2.5 text-sm text-slate-800 placeholder-slate-400"
                />
                <button type="button" tabIndex={-1} onClick={() => setShow(v => !v)}
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-0.5">
                    {show ? <IconEyeOff /> : <IconEye />}
                </button>
            </div>
            {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
        </div>
    );
}

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation();
    const isDark = typeof window !== 'undefined' &&
        window.localStorage.getItem('uniconnect.dashboard.mood') === 'dark';
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.headTitle')} />

            <div className="mb-6">
                <h1 className="text-xl font-black" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>{t('auth.loginTitle')}</h1>
                <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>{t('auth.loginSubtitle')}</p>
            </div>

            {status && (
                <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-2.5 rounded-xl">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Field
                    id="email" label={t('auth.institutionalEmail')} type="email"
                    value={data.email} onChange={e => setData('email', e.target.value)}
                    error={errors.email} icon={<IconMail />}
                    placeholder="prenom.nom@campus.ma"
                    autoComplete="username" autoFocus
                />

                <PasswordField
                    id="password" label={t('auth.password')}
                    value={data.password} onChange={e => setData('password', e.target.value)}
                    error={errors.password} autoComplete="current-password"
                    rightSlot={
                        canResetPassword && (
                            <Link href={route('password.request')}
                                  className="text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors">
                                {t('auth.forgotPassword')}
                            </Link>
                        )
                    }
                />

                <label className="flex items-center gap-2.5 cursor-pointer w-fit select-none">
                    <div className="relative">
                        <input type="checkbox" name="remember" checked={data.remember}
                               onChange={e => setData('remember', e.target.checked)}
                               className="sr-only peer" />
                        <div className="w-9 h-5 rounded-full bg-slate-200 peer-checked:bg-blue-600 transition-colors duration-200" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
                    </div>
                    <span className="text-xs text-slate-500">{t('auth.rememberMe')}</span>
                </label>

                <button
                    type="submit"
                    disabled={processing || !data.email.trim() || !data.password.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}
                >
                    {processing ? <IconSpin /> : null}
                    {processing ? t('auth.signingIn') : t('auth.signIn')}
                </button>
            </form>

            <div className={`mt-5 pt-5 border-t text-center ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                <p className="text-xs text-slate-400">
                    {t('auth.noAccount')}{' '}
                    <Link href={route('register')}
                          className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        {t('auth.joinLink')}
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
