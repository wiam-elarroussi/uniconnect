import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Dashboard({ auth, university, posts = [], resources = [] }) {
    const currentHour = new Date().getHours();
    const isFocusMode = false;

    const { data, setData, post, processing, reset, errors } = useForm({
        body: '',
    });

    const submitPost = (e) => {
        e.preventDefault();
        post(route('posts.store'), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">UniConnect - {university}</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* COLONNE GAUCHE : FLUX DE DISCUSSION (2/3 de l'écran) */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-gray-800">Discussion</h3>
                                <form onSubmit={submitPost}>
                                    {isFocusMode && (
                                        <div className="mb-4 p-2 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-100">
                                            🌙 Mode Focus actif (22h-07h).
                                        </div>
                                    )}
                                    <textarea
                                        value={data.body}
                                        onChange={e => setData('body', e.target.value)}
                                        disabled={isFocusMode}
                                        placeholder={isFocusMode ? "Repos conseillé..." : "Une question ?"}
                                        className="w-full border-gray-200 rounded-lg focus:ring-blue-500"
                                    ></textarea>
                                    <button 
                                        disabled={processing || isFocusMode}
                                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300"
                                    >
                                        Publier
                                    </button>
                                </form>

                                <div className="mt-8 space-y-4">
                                    {posts.map((p) => (
    <div key={p.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group">
        <div className="flex justify-between items-start mb-1">
            <div>
                <span className="font-bold text-sm text-blue-900">{p.user?.name}</span>
                <span className="ml-2 text-[10px] text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
            </div>

            {/* LE BOUTON SUPPRIMER REVIENT ICI */}
            {p.user_id === auth.user.id && (
                <button
                    onClick={() => confirm('Supprimer ce message ?') && router.delete(route('posts.destroy', p.id))}
                    className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Supprimer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{p.body}</p>

        <div className="mt-2 flex items-center text-[9px] text-gray-400 bg-gray-50 w-fit px-2 py-0.5 rounded-full border border-gray-100">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Affiché car vous appartenez à l'université : <span className="font-bold ml-1">{university}</span>
</div>
    </div>
))}
                                </div>
                            </div>
                        </div>

                        {/* COLONNE DROITE : BIBLIOTHÈQUE (1/3 de l'écran) */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
                                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                                    📚 Bibliothèque
                                </h3>
                                
                                {resources.length > 0 ? (
                                    <div className="space-y-3">
                                        {resources.map((res) => (
                                            <a 
                                                key={res.id} 
                                                href={res.link} 
                                                target="_blank" 
                                                className="block p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100"
                                            >
                                                <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">{res.category}</span>
                                                <h4 className="text-sm font-semibold text-gray-800 truncate">{res.title}</h4>
                                                <p className="text-[10px] text-gray-400 mt-1">Partagé par {res.user?.name}</p>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 italic text-center py-4">Aucune ressource partagée.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}