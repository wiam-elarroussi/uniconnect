import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const IconMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconSend   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IconSpin   = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
const IconCheck  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg>;
const IconArrow  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const [focused, setFocused] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const sent = !!status;

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié · UniConnect" />

            {/* En-tête */}
            <div className="flex flex-col items-center mb-6 text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-3 transition-all duration-500 ${
                    sent
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-200'
                }`}>
                    {sent ? (
                        <span className="text-white"><IconCheck /></span>
                    ) : (
                        <span className="text-white"><IconMail /></span>
                    )}
                </div>
                <h1 className="text-lg font-black text-slate-900">
                    {sent ? 'Email envoyé !' : 'Mot de passe oublié ?'}
                </h1>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-xs">
                    {sent
                        ? 'Vérifiez votre boîte de réception et suivez le lien pour réinitialiser votre mot de passe.'
                        : 'Pas de panique. Entrez votre email institutionnel et nous vous enverrons un lien de réinitialisation.'}
                </p>
            </div>

            {/* Toast succès */}
            {sent && (
                <div className="mb-5 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                        <IconCheck />
                    </span>
                    <div>
                        <p className="text-sm font-bold text-emerald-800 mb-0.5">Lien envoyé</p>
                        <p className="text-xs text-emerald-700 leading-relaxed">{status}</p>
                    </div>
                </div>
            )}

            {!sent && (
                <form onSubmit={submit} className="space-y-5">

                    {/* Champ email */}
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Email institutionnel
                        </label>
                        <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                            errors.email
                                ? 'border-red-300 bg-red-50 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                                : focused
                                    ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                                    : 'border-gray-200 bg-slate-50'
                        }`}>
                            <span className={`pl-3.5 transition-colors ${focused ? 'text-blue-500' : 'text-slate-400'}`}>
                                <IconMail />
                            </span>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                autoFocus
                                placeholder="prenom.nom@supmti.ma"
                                className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm text-slate-800 placeholder-slate-300"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                                <span>⚠</span> {errors.email}
                            </p>
                        )}
                        <p className="mt-1.5 text-[10px] text-slate-400">
                            Utilisez votre adresse @supmti.ma associée à votre compte.
                        </p>
                    </div>

                    {/* Badge sécurité */}
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                        <span className="text-blue-500 flex-shrink-0"><IconShield /></span>
                        <p className="text-[10px] text-blue-700 font-semibold">
                            Lien à usage unique · Expire dans 60 minutes · Session sécurisée HTTPS
                        </p>
                    </div>

                    {/* Bouton */}
                    <button
                        type="submit"
                        disabled={processing || !data.email.trim()}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {processing ? <IconSpin /> : <IconSend />}
                        {processing ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
                    </button>
                </form>
            )}

            {/* Retour connexion */}
            <div className="mt-6 text-center">
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
                >
                    <IconArrow /> Retour à la connexion
                </Link>
            </div>
        </GuestLayout>
    );
}