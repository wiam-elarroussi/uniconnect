import { Head, Link } from '@inertiajs/react';

export default function Error500() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-900 text-slate-100">
            <Head title="Erreur serveur" />
            <div className="max-w-md text-center space-y-6">
                <p className="text-7xl font-black text-indigo-400/90">500</p>
                <h1 className="text-2xl font-bold text-white">UniConnect fait une petite pause technique</h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Nos serveurs ont rencontré un souci momentané. Réessayez dans quelques instants — merci de votre patience.
                </p>
                <Link
                    href={route('dashboard')}
                    className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold"
                >
                    Réessayer plus tard
                </Link>
            </div>
        </div>
    );
}
