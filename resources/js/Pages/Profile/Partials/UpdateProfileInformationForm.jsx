import CharacterAvatar, { CHARACTER_AVATAR_DEFAULTS } from '@/Components/Dashboard/CharacterAvatar';
import Avatar from '@/Components/Dashboard/Avatar';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function defaultAvatarBuilder() {
    return { ...CHARACTER_AVATAR_DEFAULTS };
}

// ── Options ────────────────────────────────────────────────────────────────
const PRESET_OPTIONS = [
    { value: 'neutral',   label: '⚪ Neutre' },
    { value: 'feminine',  label: '🌸 Traits féminins' },
    { value: 'masculine', label: '⬛ Traits masculins' },
];

const EXPRESSION_OPTIONS = [
    { value: 'neutral',   label: '😐 Neutre' },
    { value: 'smile',     label: '😊 Sourire' },
    { value: 'laugh',     label: '😄 Grande joie' },
    { value: 'wink',      label: '😉 Clin d\'œil' },
    { value: 'smirk',     label: '😏 Sourire en coin' },
    { value: 'curious',   label: '😮 Bouche ronde' },
    { value: 'sad',       label: '😢 Triste' },
    { value: 'surprised', label: '😲 Surpris·e' },
    { value: 'cool',      label: '😎 Cool' },
];

const EYE_SHAPE_OPTIONS = [
    { value: 'round',  label: '⚫ Ronds' },
    { value: 'almond', label: '🍒 Amande' },
    { value: 'hooded', label: '🌙 Paupières tombantes' },
    { value: 'narrow', label: '➖ Étirés' },
];

const NOSE_OPTIONS = [
    { value: 'button',   label: '🔘 Bouton' },
    { value: 'small',    label: '▪️ Petit (discret)' },
    { value: 'wide',     label: '⬛ Large (avec narines)' },
    { value: 'pointy',   label: '▲ Pointu' },
    { value: 'upturned', label: '🌙 Retroussé' },
    { value: 'none',     label: '❌ Aucun' },
];

const HAIR_GROUPS = [
    {
        label: '✂️ Courts / structurés',
        options: [
            { value: 'short',     label: 'Courts' },
            { value: 'crew',      label: 'Coupe très courte' },
            { value: 'spiky',     label: 'Ébouriffé / spiky' },
            { value: 'fade',      label: 'Dégradé' },
            { value: 'undercut',  label: 'Undercut' },
            { value: 'slick',     label: 'Plaqué arrière' },
        ],
    },
    {
        label: '🌊 Moyens / ondulés',
        options: [
            { value: 'waves',     label: 'Ondulés' },
            { value: 'curly',     label: 'Bouclés / volume' },
            { value: 'bob',       label: 'Carré (bob)' },
            { value: 'ponytail',  label: 'Queue de cheval' },
        ],
    },
    {
        label: '💃 Longs',
        options: [
            { value: 'long',      label: 'Longs' },
            { value: 'bun',       label: 'Chignon' },
            { value: 'pigtails',  label: 'Couettes' },
            { value: 'braids',    label: 'Tresses' },
        ],
    },
    {
        label: '🌍 Textures',
        options: [
            { value: 'afro',      label: 'Afro' },
            { value: 'dreadlocks',label: 'Dreadlocks' },
        ],
    },
];

const TOP_OPTIONS = [
    { value: 'tee',      label: '👕 T-shirt' },
    { value: 'hoodie',   label: '🧥 Sweat à capuche' },
    { value: 'sweater',  label: '🧶 Pull' },
    { value: 'shirt',    label: '👔 Chemise' },
    { value: 'jacket',   label: '🧣 Veste' },
    { value: 'suit',     label: '🤵 Costume' },
    { value: 'crop_top', label: '✂️ Crop top' },
    { value: 'dress',    label: '👗 Robe' },
];

const BOTTOM_OPTIONS = [
    { value: 'pants',     label: '👖 Pantalon' },
    { value: 'shorts',    label: '🩳 Short' },
    { value: 'leggings',  label: '🩱 Legging' },
    { value: 'skirt',     label: '👗 Jupe courte' },
    { value: 'skirt_long',label: '👗 Jupe longue' },
];

const ACCESSORY_OPTIONS = [
    { value: 'none',           label: '❌ Aucun' },
    { value: 'glasses',        label: '🤓 Lunettes' },
    { value: 'round_glasses',  label: '🔵 Lunettes rondes' },
    { value: 'sunnies',        label: '😎 Lunettes de soleil' },
    { value: 'cap',            label: '🧢 Casquette' },
    { value: 'beanie',         label: '🎩 Bonnet' },
    { value: 'headphones',     label: '🎧 Casque audio' },
    { value: 'scarf',          label: '🧣 Écharpe' },
    { value: 'earrings',       label: '💎 Boucles d\'oreilles' },
    { value: 'hoop_earrings',  label: '⭕ Créoles' },
    { value: 'necklace',       label: '📿 Collier' },
    { value: 'chain_necklace', label: '⛓️ Chaîne' },
    { value: 'nose_piercing',  label: '💠 Piercing nez' },
    { value: 'brow_piercing',  label: '➰ Piercing sourcil' },
    { value: 'crown',          label: '👑 Couronne' },
    { value: 'mask',           label: '😷 Masque' },
    { value: 'bandana',        label: '🎀 Bandana' },
];

const FACIAL_HAIR_OPTIONS = [
    { value: 'none',         label: '❌ Aucune' },
    { value: 'stubble',      label: '🟤 Barbe de 3 jours' },
    { value: 'thin_mustache',label: '〰️ Fine moustache' },
    { value: 'mustache',     label: '🧔 Moustache' },
    { value: 'goatee',       label: '🐐 Bouc' },
    { value: 'beard_short',  label: '🧔 Barbe courte' },
    { value: 'beard_full',   label: '🧔 Barbe pleine' },
    { value: 'viking',       label: '⚡ Viking' },
];

const SKIN_DETAILS_OPTIONS = [
    { value: 'none',          label: '❌ Aucun' },
    { value: 'freckles',      label: '🔴 Taches de rousseur' },
    { value: 'mole_left',     label: '⚫ Grain de beauté (gauche)' },
    { value: 'mole_right',    label: '⚫ Grain de beauté (droite)' },
    { value: 'freckles_mole', label: '🔴⚫ Rousseur + grain de beauté' },
    { value: 'dimples',       label: '✨ Fossettes' },
];

// ── Icônes ────────────────────────────────────────────────────────────────
const IconUser   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMail   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconCheck  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>;
const IconSpin   = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
const IconSave   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconAlert  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconSend   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconPalette= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M8 12s0-4 4-4 4 4 4 4"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/></svg>;

// ── Champ générique ───────────────────────────────────────────────────────
function Field({ id, label, type = 'text', value, onChange, error, icon, hint, autoComplete, autoFocus, badge }) {
    const [focused, setFocused] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label htmlFor={id} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {label}
                </label>
                {badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">
                        {badge}
                    </span>
                )}
            </div>

            <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                error
                    ? 'border-red-300 bg-red-50 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                    : focused
                        ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                        : 'border-gray-200 bg-slate-50 hover:border-gray-300'
            }`}>
                <span className={`pl-3.5 transition-colors ${focused ? 'text-blue-500' : 'text-slate-400'}`}>
                    {icon}
                </span>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    required
                    className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm text-slate-800 placeholder-slate-300"
                />
            </div>

            {error && (
                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
            {hint && !error && (
                <p className="mt-1.5 text-[10px] text-slate-400">{hint}</p>
            )}
        </div>
    );
}

// ── Select stylisé ────────────────────────────────────────────────────────
function BuilderSelect({ label, value, onChange, options, groups, colSpan }) {
    return (
        <label className={`block ${colSpan || ''}`}>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white hover:border-gray-300 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            >
                {groups
                    ? groups.map(g => (
                        <optgroup key={g.label} label={g.label}>
                            {g.options.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </optgroup>
                    ))
                    : options.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))
                }
            </select>
        </label>
    );
}

// ── Color picker stylisé ──────────────────────────────────────────────────
function BuilderColor({ label, value, onChange }) {
    return (
        <label className="block">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            <div className="mt-1 flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="w-10 h-9 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                />
                <span className="text-xs text-slate-500 font-mono">{value}</span>
            </div>
        </label>
    );
}

// ── Séparateur de section avatar ──────────────────────────────────────────
function AvatarSection({ title, icon, children }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white/60 p-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span>{icon}</span>{title}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {children}
            </div>
        </div>
    );
}

// ── Composant principal ───────────────────────────────────────────────────
export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const initialBuilderRef = useRef(
        user.avatar_builder && typeof user.avatar_builder === 'object' && Object.keys(user.avatar_builder).length > 0
            ? { ...defaultAvatarBuilder(), ...user.avatar_builder }
            : defaultAvatarBuilder(),
    );

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        avatar: null,
        avatar_builder: initialBuilderRef.current,
    });

    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);

    useEffect(() => {
        if (!data.avatar) { setAvatarPreviewUrl(null); return; }
        const url = URL.createObjectURL(data.avatar);
        setAvatarPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [data.avatar]);

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: !!data.avatar,
            transform: (d) =>
                d.avatar
                    ? { ...d, avatar_builder: JSON.stringify(d.avatar_builder ?? defaultAvatarBuilder()) }
                    : d,
        });
    };

    const patchBuilder = (partial) => {
        setData('avatar_builder', { ...data.avatar_builder, ...partial });
    };
    const ab = data.avatar_builder;

    const isVerified = user.email_verified_at !== null;
    const linkSent   = status === 'verification-link-sent';
    const hasChanges =
        data.name  !== user.name  ||
        data.email !== user.email ||
        data.avatar !== null ||
        JSON.stringify(data.avatar_builder) !== JSON.stringify(initialBuilderRef.current);

    return (
        <section className={className}>

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <IconUser />
                    </span>
                    Informations du profil
                </h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    La <strong>photo</strong> reste seule dans le rond. L'<strong>avatar campus</strong> s'affiche au survol ou au tap. Sans photo, le rond affiche ton avatar.
                </p>
            </div>

            {/* Carte identité */}
            <div className="flex items-center gap-4 bg-slate-50 border border-gray-100 rounded-2xl p-4 mb-6">
                <div className="relative flex-shrink-0 rounded-2xl ring-2 ring-white shadow-md overflow-hidden bg-slate-800">
                    <Avatar
                        name={user.name}
                        size="xl"
                        src={avatarPreviewUrl || user.avatar_url || null}
                        builder={data.avatar_builder}
                        previewOnHover
                        previewLabel="Avatar campus"
                    />
                    {isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-white" style={{ fontSize: 9 }}><IconCheck /></span>
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <label className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 cursor-pointer hover:text-blue-700">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                        />
                        {user.avatar_url || data.avatar ? 'Remplacer la photo' : 'Ajouter une photo de profil'}
                    </label>
                    {data.avatar && (
                        <button type="button"
                            className="mt-1 block text-[10px] text-slate-500 hover:text-red-600"
                            onClick={() => setData('avatar', null)}>
                            Annuler le nouveau fichier
                        </button>
                    )}
                    {errors.avatar && <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>}
                    <div className="flex items-center gap-1.5 mt-1.5">
                        {isVerified ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                <IconCheck /> Email vérifié
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                <IconAlert /> Non vérifié
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Étudiant·e SupMTI
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Avatar Builder ──────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-gray-200 rounded-2xl p-4 mb-6 space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    <div>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avatar personnalisé</p>
                        <p className="text-[11px] text-slate-500">Personnalise chaque détail de ton avatar campus.</p>
                    </div>
                </div>

                {/* Aperçu + reset */}
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                        <CharacterAvatar builder={ab} sizePx={110} animated />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-xs text-slate-600 font-semibold">Aperçu en direct</p>
                        <p className="text-[10px] text-slate-400">Chaque modification se reflète immédiatement.</p>
                        <button
                            type="button"
                            onClick={() => setData('avatar_builder', defaultAvatarBuilder())}
                            className="mt-2 text-[10px] text-slate-500 border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                        >
                            ↺ Réinitialiser l'avatar
                        </button>
                    </div>
                </div>

                {/* Section : Visage */}
                <AvatarSection title="Visage & silhouette" icon="👤">
                    <BuilderSelect label="Silhouette du visage" value={ab?.preset || 'neutral'} onChange={v => patchBuilder({ preset: v })} options={PRESET_OPTIONS} colSpan="col-span-2 sm:col-span-3" />
                    <BuilderSelect label="Forme des yeux" value={ab?.eyeShape || 'round'} onChange={v => patchBuilder({ eyeShape: v })} options={EYE_SHAPE_OPTIONS} />
                    <BuilderSelect label="Forme du nez" value={ab?.nose || 'button'} onChange={v => patchBuilder({ nose: v })} options={NOSE_OPTIONS} />
                    <BuilderSelect label="Expression" value={ab?.expression || 'neutral'} onChange={v => patchBuilder({ expression: v })} options={EXPRESSION_OPTIONS} />
                </AvatarSection>

                {/* Section : Couleurs peau / yeux / lèvres */}
                <AvatarSection title="Couleurs du visage" icon="🎨">
                    <BuilderColor label="Peau" value={ab?.skin || '#e8b896'} onChange={v => patchBuilder({ skin: v })} />
                    <BuilderColor label="Couleur des yeux" value={ab?.eyeColor || '#1a1a2e'} onChange={v => patchBuilder({ eyeColor: v })} />
                    <BuilderColor label="Couleur des lèvres" value={ab?.lipColor || '#b45309'} onChange={v => patchBuilder({ lipColor: v })} />
                    <BuilderSelect label="Détails de la peau" value={ab?.skinDetails || 'none'} onChange={v => patchBuilder({ skinDetails: v })} options={SKIN_DETAILS_OPTIONS} colSpan="col-span-2 sm:col-span-3" />
                </AvatarSection>

                {/* Section : Cheveux */}
                <AvatarSection title="Coiffure" icon="💇">
                    <BuilderSelect label="Style" value={ab?.hairStyle || 'short'} onChange={v => patchBuilder({ hairStyle: v })} groups={HAIR_GROUPS} colSpan="col-span-2 sm:col-span-3" />
                    <BuilderColor label="Couleur" value={ab?.hair || '#2d1a0e'} onChange={v => patchBuilder({ hair: v })} />
                </AvatarSection>

                {/* Section : Pilosité faciale */}
                <AvatarSection title="Pilosité faciale" icon="🧔">
                    <BuilderSelect label="Style" value={ab?.facialHair || 'none'} onChange={v => patchBuilder({ facialHair: v })} options={FACIAL_HAIR_OPTIONS} colSpan="col-span-2 sm:col-span-3" />
                    <BuilderColor label="Couleur" value={ab?.facialHairColor || '#2d1a0e'} onChange={v => patchBuilder({ facialHairColor: v })} />
                </AvatarSection>

                {/* Section : Vêtements */}
                <AvatarSection title="Vêtements" icon="👔">
                    <BuilderSelect label="Haut (style)" value={ab?.topStyle || 'tee'} onChange={v => patchBuilder({ topStyle: v })} options={TOP_OPTIONS} />
                    <BuilderColor  label="Couleur du haut" value={ab?.top || '#2563eb'} onChange={v => patchBuilder({ top: v })} />
                    <div /> {/* spacer */}
                    <BuilderSelect label="Bas (style)" value={ab?.bottomStyle || 'pants'} onChange={v => patchBuilder({ bottomStyle: v })} options={BOTTOM_OPTIONS} />
                    <BuilderColor  label="Couleur du bas" value={ab?.bottom || '#1e293b'} onChange={v => patchBuilder({ bottom: v })} />
                </AvatarSection>

                {/* Section : Accessoires */}
                <AvatarSection title="Accessoires" icon="💎">
                    <BuilderSelect label="Accessoire" value={ab?.accessory || 'none'} onChange={v => patchBuilder({ accessory: v })} options={ACCESSORY_OPTIONS} colSpan="col-span-2 sm:col-span-3" />
                    <BuilderColor label="Couleur accessoire" value={ab?.accent || '#374151'} onChange={v => patchBuilder({ accent: v })} />
                </AvatarSection>

                {errors.avatar_builder && (
                    <p className="text-xs text-red-500 mt-2">{errors.avatar_builder}</p>
                )}
            </div>

            {/* ── Formulaire identité ──────────────────────────────────────── */}
            <form onSubmit={submit} className="space-y-5">
                <Field
                    id="name"
                    label="Nom complet"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    error={errors.name}
                    icon={<IconUser />}
                    autoComplete="name"
                    autoFocus
                    hint="Votre nom tel qu'il apparaît à la communauté."
                />

                <Field
                    id="email"
                    label="Email institutionnel"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    error={errors.email}
                    icon={<IconMail />}
                    autoComplete="username"
                    badge={isVerified ? 'Vérifié ✓' : null}
                    hint="Utilisez votre adresse @supmti.ma pour garder l'accès."
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                            <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                                <IconAlert />
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-amber-800 mb-1">Email non vérifié</p>
                                <p className="text-xs text-amber-700 leading-relaxed mb-3">
                                    Votre adresse email n'est pas encore vérifiée. Vérifiez votre boîte de réception ou renvoyez le lien.
                                </p>
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-200 px-3 py-1.5 rounded-lg transition-all"
                                >
                                    <IconSend /> Renvoyer le lien de vérification
                                </Link>

                                {linkSent && (
                                    <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-lg">
                                        <span className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"><IconCheck /></span>
                                        Lien de vérification envoyé à votre adresse email.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <span className="text-blue-500 flex-shrink-0"><IconShield /></span>
                    <p className="text-[10px] text-blue-700 font-semibold">
                        Données minimisées · Seuls le nom et l'email sont collectés · Principe RGPD
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing || !hasChanges}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {processing ? <IconSpin /> : <IconSave />}
                        {processing ? 'Enregistrement…' : 'Sauvegarder'}
                    </button>

                    {!hasChanges && !recentlySuccessful && (
                        <p className="text-[10px] text-slate-400 font-medium italic">Aucune modification</p>
                    )}

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl">
                            <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                <IconCheck />
                            </span>
                            Profil mis à jour !
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}