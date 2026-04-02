import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function ChannelsIndex({ channels = [], followedChannelIds = [] }) {
    const followed = new Set(followedChannelIds);

    const toggle = (id) => {
        router.post(route('channels.follow.toggle', id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header={<span className="font-semibold">Canaux du campus</span>}>
            <Head title="Canaux" />

            <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
                <p className="text-sm text-slate-600">
                    Abonne-toi aux canaux pour filtrer le fil sur ceux que tu suis, et choisis un canal lorsque tu publies.
                </p>
                <Link
                    href={route('dashboard')}
                    className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    ← Retour au fil
                </Link>

                <ul className="space-y-3">
                    {channels.length === 0 ? (
                        <li className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 text-sm">
                            Aucun canal pour ton université pour l’instant. Demande à un administrateur d’en créer.
                        </li>
                    ) : (
                        channels.map((c) => (
                            <li
                                key={c.id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div>
                                    <p className="font-bold text-slate-900">{c.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {c.followers_count ?? 0} abonné{(c.followers_count ?? 0) !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggle(c.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                        followed.has(c.id)
                                            ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                                            : 'bg-blue-600 text-white hover:bg-blue-500'
                                    }`}
                                >
                                    {followed.has(c.id) ? 'Ne plus suivre' : 'Suivre'}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}
