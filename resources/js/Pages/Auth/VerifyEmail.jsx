import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const IconMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconSend   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IconSpin   = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
const IconCheck  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>;
const IconLogout = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconClock  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const COOLDOWN = 60;

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const [cooldown, setCooldown]   = useState(0);
    const [sentCount, setSentCount] = useState(0);

    const linkSent = status === 'verification-link-sent';

    // Démarrer le cooldown après chaque envoi
    useEffect(() => {
        if (linkSent && sentCount === 0) setSentCount(1);
    }, [linkSent]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'), {
            onSuccess: () => { setCooldown(COOLDOWN); setSentCount(c => c + 1); }
        });
    };

    // Cercle SVG progress pour le cooldown
    const radius   = 16;
    const circ     = 2 * Math.PI * radius;
    const progress = cooldown > 0 ? (cooldown / COOLDOWN) * circ : 0;

    return (
        <GuestLayout>
            <Head title="Vérification email · UniConnect" />

            {/* Header */}
            <div className="flex flex-col items-center mb-6 text-center">
                {/* Enveloppe animée */}
                <div className="relative mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <IconMail />
                    </div>
                    {/* Pastille verte si envoyé */}
                    {linkSent && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow">
                            <IconCheck />
                        </div>
                    )}
                    {/* Ping animé */}
                    {!linkSent && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500" />
                        </span>
                    )}
                </div>

                <h1 className="text-lg font-black text-slate-900">
                    {linkSent ? 'Email envoyé !' : 'Vérifiez votre email'}
                </h1>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-xs">
                    {linkSent
                        ? 'Un nouveau lien de vérification a été envoyé à votre adresse email. Pensez à vérifier vos spams.'
                        : 'Merci de votre inscription ! Cliquez sur le lien envoyé à votre adresse email institutionnelle pour activer votre compte.'}
                </p>
            </div>

            {/* Étapes visuelles */}
            <div className="flex items-center justify-center gap-0 mb-6">
                {[
                    { label: 'Inscription', done: true },
                    { label: 'Email envoyé', done: true },
                    { label: 'Vérification', done: linkSent },
                    { label: 'Accès', done: false },
                ].map(({ label, done }, i, arr) => (
                    <div key={label} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                                done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {done ? <IconCheck /> : i + 1}
                            </div>
                            <span className={`text-[9px] font-semibold whitespace-nowrap ${done ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {label}
                            </span>
                        </div>
                        {i < arr.length - 1 && (
                            <div className={`w-8 h-px mb-4 mx-1 transition-colors ${done ? 'bg-emerald-300' : 'bg-gray-100'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Toast succès */}
            {linkSent && (
                <div className="mb-5 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                        <IconCheck />
                    </span>
                    <div>
                        <p className="text-sm font-bold text-emerald-800 mb-0.5">Lien envoyé avec succès</p>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                            Consultez votre boîte @supmti.ma. Si vous ne le trouvez pas, vérifiez vos spams ou courriers indésirables.
                        </p>
                    </div>
                </div>
            )}

            {/* Conseils */}
            {!linkSent && (
                <div className="mb-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2.5">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Comment ça marche ?</p>
                    {[
                        { step: '1', text: 'Ouvrez votre boîte mail @supmti.ma' },
                        { step: '2', text: 'Cherchez un email de UniConnect' },
                        { step: '3', text: 'Cliquez sur le lien de vérification' },
                        { step: '4', text: 'Votre compte est activé !' },
                    ].map(({ step, text }) => (
                        <div key={step} className="flex items-center gap-2.5">
                            <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0">
                                {step}
                            </span>
                            <span className="text-xs text-blue-700 font-medium">{text}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="space-y-4">

                {/* Badge RGPD */}
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <span className="text-blue-500 flex-shrink-0"><IconShield /></span>
                    <p className="text-[10px] text-blue-700 font-semibold">
                        Email institutionnel uniquement · Zéro spam · RGPD
                    </p>
                </div>

                {/* Bouton renvoyer avec cooldown */}
                <button
                    type="submit"
                    disabled={processing || cooldown > 0}
                    className="w-full flex items-center justify-center gap-2.5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                    {processing ? (
                        <><IconSpin /> Envoi en cours…</>
                    ) : cooldown > 0 ? (
                        <>
                            {/* Cercle progress */}
                            <svg width="20" height="20" viewBox="0 0 40 40" className="-rotate-90">
                                <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                                <circle cx="20" cy="20" r={radius} fill="none" stroke="white" strokeWidth="3"
                                    strokeDasharray={circ} strokeDashoffset={circ - progress}
                                    strokeLinecap="round" />
                            </svg>
                            <span>Renvoyer dans {cooldown}s</span>
                        </>
                    ) : (
                        <><IconSend /> {sentCount > 0 ? 'Renvoyer le lien' : 'Renvoyer l\'email de vérification'}</>
                    )}
                </button>

                {/* Lien déconnexion */}
                <div className="flex items-center justify-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <IconLogout /> Se déconnecter
                    </Link>
                </div>

                {/* Compteur envois */}
                {sentCount > 1 && (
                    <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <IconClock /> Email renvoyé {sentCount - 1} fois · Pensez à vérifier vos spams
                    </p>
                )}
            </form>
        </GuestLayout>
    );
}