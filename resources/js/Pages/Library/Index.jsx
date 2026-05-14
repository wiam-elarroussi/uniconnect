import { feedPageRoot } from '@/Components/Layout/feedPageSurface';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Avatar from '@/Components/Dashboard/Avatar';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CATEGORY_COLORS = {
    'Cours':      { bg: 'rgba(56,189,248,0.12)', text: '#0284c7', dot: '#38bdf8' },
    'Exercices':  { bg: 'rgba(167,139,250,0.12)', text: '#7c3aed', dot: '#a78bfa' },
    'TD':         { bg: 'rgba(52,211,153,0.12)', text: '#059669', dot: '#34d399' },
    'TP':         { bg: 'rgba(251,191,36,0.12)', text: '#d97706', dot: '#fbbf24' },
    'Exam':       { bg: 'rgba(239,68,68,0.12)', text: '#dc2626', dot: '#ef4444' },
};
function catStyle(cat) {
    const k = Object.keys(CATEGORY_COLORS).find((k) => (cat || '').toLowerCase().includes(k.toLowerCase()));
    return CATEGORY_COLORS[k] || { bg: 'rgba(99,102,241,0.12)', text: '#4f46e5', dot: '#818cf8' };
}

const EXT_ICONS = {
    pdf: '📄', doc: '📝', docx: '📝', ppt: '📊', pptx: '📊',
    xls: '📈', xlsx: '📈', zip: '🗜', mp4: '🎬', txt: '📃',
};
function linkIcon(url, fileName) {
    if (!url) return '🔗';
    if (url.includes('youtube') || url.includes('youtu.be')) return '▶️';
    const src = fileName || url;
    const ext = src.split('.').pop()?.toLowerCase();
    return EXT_ICONS[ext] || '🔗';
}

function ResourceCard({ r }) {
    const style = catStyle(r.category);
    const isFile = Boolean(r.file_path);
    return (
        <a
            href={r.link}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-2xl border p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 [border-color:var(--border)] [background:var(--bg-card)]"
        >
            <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-110"
                style={{ background: style.bg }}
            >
                {linkIcon(r.link, r.file_name)}
            </div>

            <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ background: style.bg, color: style.text }}
                    >
                        {r.category}
                    </span>
                    {r.filiere && (
                        <span className="text-[10px] font-medium [color:var(--text-3)]">{r.filiere}</span>
                    )}
                    {isFile && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                            📎 Fichier
                        </span>
                    )}
                </div>

                <p className="line-clamp-2 text-sm font-bold leading-snug [color:var(--text-1)]">{r.title}</p>
                {isFile && r.file_name && (
                    <p className="mt-0.5 truncate text-[11px] [color:var(--text-3)]">{r.file_name}</p>
                )}

                <div className="mt-2 flex items-center gap-2">
                    <Avatar name={r.user?.name} size="xs" src={r.user?.avatar_url} builder={r.user?.avatar_builder} />
                    <span className="truncate text-[11px] [color:var(--text-3)]">{r.user?.name}</span>
                    <span className="ml-auto text-base [color:var(--text-3)] opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
                </div>
            </div>
        </a>
    );
}

export default function LibraryIndex({
    resources = [],
    filters = { q: '', category: 'all', filiere: 'all' },
    categoryOptions = [],
    filiereOptions = [],
}) {
    const { t } = useTranslation();
    const searchTimer = useRef(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [uploadMode, setUploadMode] = useState('url');
    const fileInputRef = useRef(null);
    const form = useForm({ title: '', link: '', file: null, category: 'Cours', filiere: '' });

    const applyFilters = useCallback((patch) => {
        const next = { ...filters, ...patch };
        router.get(
            route('library.index'),
            { q: next.q || undefined, category: next.category === 'all' ? undefined : next.category, filiere: next.filiere === 'all' ? undefined : next.filiere },
            { preserveState: true, replace: true },
        );
    }, [filters]);

    const submitResource = (e) => {
        e.preventDefault();
        form.post(route('resources.store'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setUploadMode('url');
                if (fileInputRef.current) fileInputRef.current.value = '';
                setCreateOpen(false);
            },
        });
    };

    const closeModal = () => {
        form.reset();
        setUploadMode('url');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setCreateOpen(false);
    };

    const allCategories = ['all', ...categoryOptions];

    return (
        <AuthenticatedLayout layoutVariant="feed">
            <Head title={t('pages.library.headTitle')} />

            <div className={`${feedPageRoot} pb-24`}>
                {/* Sticky header */}
                <div
                    className="sticky top-0 z-20 border-b px-4 pt-4 pb-3 sm:px-6 [border-color:var(--border)]"
                    style={{ background: 'var(--nav-blur-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                >
                    <div className="mx-auto max-w-3xl">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h1 className="text-xl font-black [color:var(--text-1)]">
                                    Bibliotheque
                                </h1>
                                <p className="text-[11px] [color:var(--text-3)]">{resources.length} ressource{resources.length > 1 ? 's' : ''} partagee{resources.length > 1 ? 's' : ''}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCreateOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-light text-white shadow-lg transition-transform active:scale-95"
                                style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}
                                aria-label={t('pages.library.add')}
                            >
                                +
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-3">
                            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 [color:var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
                            </svg>
                            <input
                                type="search"
                                defaultValue={filters.q}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    clearTimeout(searchTimer.current);
                                    searchTimer.current = setTimeout(() => applyFilters({ q: v }), 320);
                                }}
                                placeholder={t('pages.library.searchPlaceholder', { defaultValue: 'Rechercher une ressource...' })}
                                className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm [background:var(--bg-card)] [color:var(--text-1)] border [border-color:var(--border)] outline-none focus:border-indigo-400 transition-colors"
                            />
                        </div>

                        {/* Category pills */}
                        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {allCategories.map((cat) => {
                                const active = (filters.category || 'all') === cat;
                                const style = cat === 'all' ? null : catStyle(cat);
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => applyFilters({ category: cat })}
                                        className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
                                        style={active
                                            ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff' }
                                            : style
                                            ? { background: style.bg, color: style.text }
                                            : { background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border)' }
                                        }
                                    >
                                        {cat === 'all' ? 'Tout' : cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-3xl space-y-3 px-4 pt-4 sm:px-6">
                    {/* Filière filter */}
                    {filiereOptions.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {['all', ...filiereOptions].map((f) => {
                                const active = (filters.filiere || 'all') === f;
                                return (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => applyFilters({ filiere: f })}
                                        className="shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all [border-color:var(--border)]"
                                        style={active
                                            ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff' }
                                            : { background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border)' }
                                        }
                                    >
                                        {f === 'all' ? 'Toutes filieres' : f}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {resources.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="text-5xl mb-3">📚</div>
                            <p className="text-sm font-semibold [color:var(--text-2)]">{t('pages.library.empty', { defaultValue: 'Aucune ressource pour le moment.' })}</p>
                            <button
                                type="button"
                                onClick={() => setCreateOpen(true)}
                                className="mt-4 rounded-full px-5 py-2 text-sm font-bold text-white"
                                style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
                            >
                                Partager la premiere ressource
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {resources.map((r) => <ResourceCard key={r.id} r={r} />)}
                        </div>
                    )}
                </div>
            </div>

            {/* Create modal */}
            {createOpen && (
                <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={closeModal}>
                    <div
                        className="relative z-10 w-full max-w-md rounded-t-3xl border p-5 shadow-2xl sm:rounded-3xl [border-color:var(--border)] [background:var(--panel-bg)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-base font-black [color:var(--text-1)]">{t('pages.library.createTitle', { defaultValue: 'Partager une ressource' })}</p>
                            <button type="button" onClick={closeModal} className="text-lg [color:var(--text-2)] hover:opacity-70">✕</button>
                        </div>
                        <form className="space-y-3" onSubmit={submitResource}>
                            {/* Title */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wide [color:var(--text-3)] mb-1">{t('pages.library.fieldTitle', { defaultValue: 'Titre' })}</label>
                                <input
                                    type="text"
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    required
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 [border-color:var(--border)] [background:var(--bg-card)] [color:var(--text-1)]"
                                />
                                {form.errors.title && <p className="mt-1 text-xs text-rose-400">{form.errors.title}</p>}
                            </div>

                            {/* Mode toggle */}
                            <div className="flex rounded-xl overflow-hidden border [border-color:var(--border)]">
                                <button
                                    type="button"
                                    onClick={() => { setUploadMode('url'); form.setData('file', null); }}
                                    className="flex-1 py-2 text-xs font-bold transition-colors"
                                    style={uploadMode === 'url'
                                        ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff' }
                                        : { background: 'var(--bg-card)', color: 'var(--text-2)' }}
                                >
                                    🔗 Lien URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setUploadMode('file'); form.setData('link', ''); }}
                                    className="flex-1 py-2 text-xs font-bold transition-colors"
                                    style={uploadMode === 'file'
                                        ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff' }
                                        : { background: 'var(--bg-card)', color: 'var(--text-2)' }}
                                >
                                    📎 Fichier local
                                </button>
                            </div>

                            {/* URL or File input */}
                            {uploadMode === 'url' ? (
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wide [color:var(--text-3)] mb-1">{t('pages.library.fieldLink', { defaultValue: 'Lien URL' })}</label>
                                    <input
                                        type="url"
                                        value={form.data.link}
                                        onChange={(e) => form.setData('link', e.target.value)}
                                        required
                                        placeholder="https://..."
                                        className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 [border-color:var(--border)] [background:var(--bg-card)] [color:var(--text-1)]"
                                    />
                                    {form.errors.link && <p className="mt-1 text-xs text-rose-400">{form.errors.link}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wide [color:var(--text-3)] mb-1">Fichier (PDF, Word, PPT…)</label>
                                    <label className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed py-5 cursor-pointer transition-colors hover:border-indigo-400 [border-color:var(--border)]">
                                        <span className="text-2xl mb-1">{form.data.file ? '✅' : '📂'}</span>
                                        <span className="text-xs font-semibold [color:var(--text-2)]">
                                            {form.data.file ? form.data.file.name : 'Cliquer pour choisir un fichier'}
                                        </span>
                                        <span className="text-[10px] [color:var(--text-3)] mt-0.5">PDF, Word, PPT, Excel, ZIP — max 20 Mo</span>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip"
                                            className="hidden"
                                            onChange={(e) => form.setData('file', e.target.files[0] ?? null)}
                                        />
                                    </label>
                                    {form.errors.file && <p className="mt-1 text-xs text-rose-400">{form.errors.file}</p>}
                                </div>
                            )}

                            {/* Filière */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wide [color:var(--text-3)] mb-1">{t('pages.library.fieldFiliere', { defaultValue: 'Filiere (optionnel)' })}</label>
                                <input
                                    type="text"
                                    value={form.data.filiere}
                                    onChange={(e) => form.setData('filiere', e.target.value)}
                                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 [border-color:var(--border)] [background:var(--bg-card)] [color:var(--text-1)]"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wide [color:var(--text-3)] mb-1">{t('pages.library.fieldCategory', { defaultValue: 'Categorie' })}</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Cours','TD','TP','Exercices','Exam','Autre'].map((cat) => {
                                        const s = catStyle(cat);
                                        const active = form.data.category === cat;
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => form.setData('category', cat)}
                                                className="rounded-full px-3 py-1 text-xs font-bold transition-all"
                                                style={active
                                                    ? { background: s.dot, color: '#fff' }
                                                    : { background: s.bg, color: s.text }
                                                }
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing || (uploadMode === 'url' ? !form.data.link : !form.data.file)}
                                className="w-full rounded-2xl py-3 text-sm font-bold text-white disabled:opacity-50 transition-opacity"
                                style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
                            >
                                {form.processing ? '...' : t('pages.library.submit', { defaultValue: 'Partager' })}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
