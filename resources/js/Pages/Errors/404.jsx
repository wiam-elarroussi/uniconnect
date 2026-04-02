import { Head, Link } from '@inertiajs/react';

export default function Error404() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-slate-950 via-blue-950/40 to-indigo-950 text-slate-100">
            <Head title="Page introuvable" />
            <div className="max-w-md text-center space-y-6">
                <p className="text-7xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    404
                </p>
                <h1 className="text-2xl font-bold text-white">Oups — cette page a pris un autre cours</h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Le lien est peut-être expiré ou la page a été déplacée. Pas de panique : le fil d’actualité vous attend.
                </p>
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                    <Link
                        href={route('dashboard')}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-900/40"
                    >
                        Retour au fil
                    </Link>
                    <Link href="/" className="px-5 py-2.5 rounded-xl border border-white/15 text-slate-200 text-sm font-semibold hover:bg-white/5">
                        Accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
