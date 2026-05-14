import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

// ── DiceBear options ────────────────────────────────────────────────────────
const TOPS = {
  femme:   ['bob','bun','curly','curvy','dreads','frida','fro','froBand','longButNotTooLong','miaWallace','shavedSides','straight01','straight02','straightAndStrand','bigHair'],
  homme:   ['dreads01','dreads02','frizzle','shaggy','shaggyMullet','shortCurly','shortFlat','shortRound','shortWaved','sides','theCaesar','theCaesarAndSidePart'],
  voile:   ['hijab'],
  chapeau: ['hat','winterHat1','winterHat02','winterHat03','winterHat04','turban'],
};
const COVER_CATS = ['voile', 'chapeau'];
const EYES       = ['close','cry','default','dizzy','eyeRoll','happy','hearts','side','squint','surprised','wink','winkWacky'];
const EYEBROWS   = ['angry','angryNatural','default','defaultNatural','flatNatural','frownNatural','raisedExcited','raisedExcitedNatural','sadConcerned','sadConcernedNatural','unibrowNatural','upDown','upDownNatural'];
const MOUTHS     = ['concerned','default','disbelief','eating','grimace','sad','screamOpen','serious','smile','tongue','twinkle','vomit'];
const CLOTHING   = ['blazerAndShirt','blazerAndSweater','collarAndSweater','graphicShirt','hoodie','overall','shirtCrewNeck','shirtScoopNeck','shirtVNeck'];
const ACCESSORIES  = [null,'kurt','prescription01','prescription02','round','sunglasses','wayfarers'];
const FACIAL_HAIRS = [null,'beardLight','beardMajestic','beardMedium','moustacheFancy','moustacheMagnum'];

const SKIN_COLORS = [
  '#fce4c3','#ffdbb4','#edb98a','#d08b5b','#ae5d29','#614335','#f8d25c','#fd9841',
].map((c,i) => ({ v: c.replace('#',''), c }));

const HAIR_COLORS = [
  '#2c1b18','#4a312c','#724133','#a55728','#b58143','#d6b370',
  '#c93305','#f59797','#ecdcbf','#e8e1e1','#3eadcf','#9b59b6',
].map((c,i) => ({ v: c.replace('#',''), c }));

const CLOTH_COLORS = [
  '#3c4f5c','#65c9ff','#929598','#a7ffc4','#cabeff','#ff488e',
  '#ff5c5c','#ffafb9','#ffef8d','#1a1a2e','#ffffff','#ffa500',
].map((c,i) => ({ v: c.replace('#',''), c }));

const BEARD_COLORS = [
  '#2c1b18','#724133','#b58143','#c93305','#e8e1e1',
].map((c,i) => ({ v: c.replace('#',''), c }));

const HAT_COLORS = [
  '#ff5c5c','#ff488e','#ffafb9','#65c9ff','#3c4f5c','#a7ffc4',
  '#cabeff','#9b59b6','#ffa500','#ffef8d','#929598','#1a1a2e',
  '#ffffff','#000000','#e8d5b7','#c8a87a',
].map((c,i) => ({ v: c.replace('#',''), c }));

// DiceBear BG palette
const BG = ['b6e3f4','c0aede','d1d4f9','ffdfbf','ffd5dc','e8d5f5','c8f7e4'];

// ── State converters ────────────────────────────────────────────────────────
const DEFAULTS = {
  skinColor: 'edb98a', top: 'shortFlat', hairColor: '2c1b18',
  hatColor: 'ff5c5c',
  eyes: 'default', eyebrows: 'defaultNatural', mouth: 'smile',
  facialHair: null, facialHairColor: '2c1b18',
  accessories: null, clothing: 'hoodie', clothesColor: '65c9ff',
};

function restoreCustom(b) {
  if (!b || b.type !== 'dicebear') return { ...DEFAULTS };
  return {
    skinColor:       b.skinColor?.[0]       ?? DEFAULTS.skinColor,
    top:             b.top?.[0]             ?? DEFAULTS.top,
    hairColor:       b.hairColor?.[0]       ?? DEFAULTS.hairColor,
    hatColor:        b.hatColor?.[0]        ?? DEFAULTS.hatColor,
    eyes:            b.eyes?.[0]            ?? DEFAULTS.eyes,
    eyebrows:        b.eyebrows?.[0]        ?? DEFAULTS.eyebrows,
    mouth:           b.mouth?.[0]           ?? DEFAULTS.mouth,
    facialHair:      b.facialHairProbability > 0 ? (b.facialHair?.[0] ?? null) : null,
    facialHairColor: b.facialHairColor?.[0] ?? DEFAULTS.facialHairColor,
    accessories:     b.accessoriesProbability > 0 ? (b.accessories?.[0] ?? null) : null,
    clothing:        b.clothing?.[0]        ?? DEFAULTS.clothing,
    clothesColor:    b.clothesColor?.[0]    ?? DEFAULTS.clothesColor,
  };
}

function customToOpts(c, hairCat) {
  const isCovered = COVER_CATS.includes(hairCat);
  return {
    skinColor:    [c.skinColor],
    top:          [c.top],
    hairColor:    isCovered ? undefined : [c.hairColor],
    hatColor:     isCovered ? [c.hatColor] : undefined,
    eyes:         [c.eyes],
    eyebrows:     [c.eyebrows],
    mouth:        [c.mouth],
    facialHair:   c.facialHair ? [c.facialHair] : undefined,
    facialHairProbability: c.facialHair ? 100 : 0,
    facialHairColor: c.facialHair ? [c.facialHairColor] : undefined,
    accessories:  c.accessories ? [c.accessories] : undefined,
    accessoriesProbability: c.accessories ? 100 : 0,
    clothing:     [c.clothing],
    clothesColor: [c.clothesColor],
  };
}

function topCategory(top) {
  for (const [cat, list] of Object.entries(TOPS)) if (list.includes(top)) return cat;
  return 'homme';
}

// ── Avatar generation ───────────────────────────────────────────────────────
function makeUri(seed, opts = {}) {
  try {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      createAvatar(avataaars, { seed, backgroundColor: BG, backgroundType: ['gradientLinear','solid'], radius: 50, ...opts }).toString()
    )}`;
  } catch { return null; }
}

// ── Mini-thumbnail component ────────────────────────────────────────────────
function Thumb({ uri, selected, onClick, size = 58 }) {
  return (
    <button type="button" onClick={onClick}
      className="relative flex-shrink-0 rounded-xl transition-all duration-150"
      style={{
        padding: 3,
        background: selected ? 'rgba(96,165,250,0.14)' : 'var(--bg-card)',
        border: selected ? '2px solid #60a5fa' : '2px solid var(--border)',
        boxShadow: selected ? '0 0 0 2px rgba(96,165,250,0.22)' : 'none',
        transform: selected ? 'scale(1.07)' : 'scale(1)',
      }}>
      {uri
        ? <img src={uri} alt="" style={{ width: size, height: size, borderRadius: '50%', display: 'block' }} />
        : <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--bg-deep,#e2e8f0)' }} />}
      {selected && (
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1"
              style={{ background: '#60a5fa', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-2.5 h-2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  );
}

function Swatch({ color, selected, onClick, size = 28 }) {
  return (
    <button type="button" onClick={onClick}
      className="rounded-full transition-all duration-150 flex-shrink-0"
      style={{
        width: size, height: size, background: color,
        border: selected ? '2.5px solid var(--panel-bg,white)' : '2px solid transparent',
        outline: selected ? '2px solid #60a5fa' : '2px solid transparent',
        outlineOffset: 1,
        transform: selected ? 'scale(1.2)' : 'scale(1)',
        boxShadow: selected ? '0 2px 8px rgba(96,165,250,0.3)' : '0 1px 3px rgba(0,0,0,0.15)',
      }} />
  );
}

// ── CSS — compatible light/dark mode ────────────────────────────────────────
const CSS = `
  .pf-in{background:var(--bg-card);border:1px solid var(--border);color:var(--text-1);border-radius:12px;padding:10px 14px 10px 2.6rem;font-size:13px;width:100%;outline:none;transition:all .2s}
  .pf-in:focus{border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,0.12)}
  .pf-ta{background:var(--bg-card);border:1px solid var(--border);color:var(--text-1);border-radius:12px;padding:10px 14px;font-size:13px;width:100%;outline:none;resize:none;transition:all .2s}
  .pf-ta:focus{border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,0.12)}
  .pf-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:6px;display:block}
  .av-thumbs{display:flex;flex-wrap:wrap;gap:10px}
  .av-tab-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 8px;border-radius:14px;cursor:pointer;transition:all .2s;border:1.5px solid transparent;font-size:11px;font-weight:700;color:var(--text-3);flex:1;min-width:60px}
  .av-tab-btn.on{background:rgba(96,165,250,0.1);border-color:rgba(96,165,250,0.25);color:#60a5fa}
  .av-tab-btn:not(.on):hover{background:var(--bg-card)}
  .av-section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);margin-bottom:8px;display:block}
  .av-cat-pill{padding:5px 14px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid var(--border);color:var(--text-2);background:var(--bg-card);transition:all .15s}
  .av-cat-pill.on{background:rgba(96,165,250,0.1);border-color:rgba(96,165,250,0.35);color:#60a5fa}
  @keyframes tabIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .av-tab-in{animation:tabIn .2s cubic-bezier(.16,1,.3,1) both}
  @keyframes previewPop{from{opacity:.6;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
  .av-preview-pop{animation:previewPop .28s cubic-bezier(.34,1.56,.64,1) both}
`;

const IC = {
  User:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Camera: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Save:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Check:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Spin:   () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>,
  Send:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Undo:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>,
};

// ── MAIN FORM ───────────────────────────────────────────────────────────────
export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
  const { t } = useTranslation();
  const user = usePage().props.auth.user;
  const savedBuilder = user.avatar_builder?.type === 'dicebear' ? user.avatar_builder : null;

  const [custom, setCustom]   = useState(() => restoreCustom(savedBuilder));
  const [activeTab, setActiveTab] = useState('hair');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const prevUri = useRef(null);

  const { data, setData, post, transform, errors, processing, recentlySuccessful } = useForm({
    name: user.name, bio: user.bio || '', email: user.email, avatar: null,
  });

  useEffect(() => {
    if (!data.avatar) { setPhotoPreview(null); return; }
    const url = URL.createObjectURL(data.avatar);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [data.avatar]);

  // Per-tab thumbnail generation (only active tab computed)
  const hairCat = useMemo(() => topCategory(custom.top), [custom.top]);

  // Live preview URI — updates whenever custom changes
  const baseOpts = useMemo(() => customToOpts(custom, hairCat), [
    custom.skinColor, custom.top, custom.hairColor, custom.hatColor, custom.eyes, custom.eyebrows,
    custom.mouth, custom.facialHair, custom.facialHairColor,
    custom.accessories, custom.clothing, custom.clothesColor, hairCat,
  ]);

  const previewUri = useMemo(() => makeUri(data.name || 'uniconnect', baseOpts), [baseOpts, data.name]);

  // Animate preview on change
  const [previewKey, setPreviewKey] = useState(0);
  const prevCustomRef = useRef(custom);
  useEffect(() => {
    if (prevCustomRef.current !== custom) {
      setPreviewKey(k => k + 1);
      prevCustomRef.current = custom;
    }
  }, [custom]);

  const tabUris = useMemo(() => {
    if (activeTab === 'hair') {
      return {
        tops: (TOPS[hairCat] || []).map(t => ({
          v: t, uri: makeUri('t', { ...baseOpts, top: [t] }),
        })),
      };
    }
    if (activeTab === 'face') {
      return {
        eyes:     EYES.map(e     => ({ v: e, uri: makeUri('t', { ...baseOpts, eyes: [e] }) })),
        eyebrows: EYEBROWS.map(e => ({ v: e, uri: makeUri('t', { ...baseOpts, eyebrows: [e] }) })),
        mouths:   MOUTHS.map(m   => ({ v: m, uri: makeUri('t', { ...baseOpts, mouth: [m] }) })),
      };
    }
    if (activeTab === 'outfit') {
      return {
        clothing: CLOTHING.map(c => ({ v: c, uri: makeUri('t', { ...baseOpts, clothing: [c] }) })),
      };
    }
    if (activeTab === 'extras') {
      return {
        accessories: ACCESSORIES.map(a => ({
          v: a,
          uri: a === null
            ? makeUri('t', { ...baseOpts, accessoriesProbability: 0 })
            : makeUri('t', { ...baseOpts, accessories: [a], accessoriesProbability: 100 }),
        })),
        facialHairs: FACIAL_HAIRS.map(f => ({
          v: f,
          uri: f === null
            ? makeUri('t', { ...baseOpts, facialHairProbability: 0 })
            : makeUri('t', { ...baseOpts, facialHair: [f], facialHairProbability: 100 }),
        })),
      };
    }
    return {};
  }, [activeTab, hairCat, baseOpts]);

  const sc = c => setCustom(prev => ({ ...prev, ...c }));

  // hasChanges: compare normalized builder
  const hasChanges = useMemo(() => {
    if (data.name !== user.name || data.bio !== (user.bio||'') || data.email !== user.email || data.avatar !== null || removingPhoto) return true;
    const saved = restoreCustom(savedBuilder);
    return JSON.stringify(custom) !== JSON.stringify(saved);
  }, [data.name, data.bio, data.email, data.avatar, removingPhoto, custom]);

  const hasPhoto = !removingPhoto && !!(photoPreview || user.avatar_url);
  const photoSrc = photoPreview || user.avatar_url;

  const submit = (e) => {
    e.preventDefault();
    const builderVal = {
      type: 'dicebear',
      seed: data.name || 'uniconnect',
      ...customToOpts(custom, hairCat),
    };
    const hasFile = !!(data.avatar);
    transform(d => ({
      ...d,
      avatar_builder: hasFile ? JSON.stringify(builderVal) : builderVal,
      remove_avatar: removingPhoto,
    }));
    post(route('profile.update'), { forceFormData: hasFile });
  };

  const AV_TABS = [
    { id: 'hair',   emoji: '💇', label: 'Coiffure' },
    { id: 'face',   emoji: '👁️',  label: 'Visage'   },
    { id: 'outfit', emoji: '👕', label: 'Tenue'    },
    { id: 'extras', emoji: '✨', label: 'Extras'   },
  ];

  return (
    <section className={className}>
      <style>{CSS}</style>
      <form onSubmit={submit} className="space-y-4">

        {/* ── IDENTITÉ ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: 'var(--text-3)' }}><IC.User /></span>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Identité</p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="pf-label">Nom affiché</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }}><IC.User /></span>
                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="pf-in" placeholder="Votre nom" />
              </div>
              {errors.name && <p className="text-xs mt-1.5 text-red-400">⚠ {errors.name}</p>}
            </div>
            <div>
              <label className="pf-label">Adresse email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }}><IC.Mail /></span>
                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} autoComplete="username" className="pf-in" />
              </div>
              {errors.email && <p className="text-xs mt-1.5 text-red-400">⚠ {errors.email}</p>}
            </div>
            <div>
              <label className="pf-label">Bio <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— parle de toi en quelques mots</span></label>
              <textarea value={data.bio} rows={3} maxLength={280} onChange={e => setData('bio', e.target.value)}
                placeholder="Ex: Étudiant en informatique, passionné de musique et de voyages 🎵" className="pf-ta" />
              <div className="flex justify-end mt-1">
                <span className="text-[11px]" style={{ color: (data.bio||'').length > 240 ? '#f87171' : 'var(--text-3)' }}>
                  {(data.bio||'').length}/280
                </span>
              </div>
            </div>
            {mustVerifyEmail && !user.email_verified_at && (
              <div className="rounded-xl p-3.5" style={{ background: 'rgba(246,173,85,0.07)', border: '1px solid rgba(246,173,85,0.2)' }}>
                <p className="text-xs font-bold mb-2" style={{ color: '#f6ad55' }}>⚠ Email non vérifié</p>
                <Link href={route('verification.send')} method="post" as="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(246,173,85,0.1)', color: '#f6ad55', border: '1px solid rgba(246,173,85,0.2)' }}>
                  <IC.Send /> Renvoyer le lien de vérification
                </Link>
                {status === 'verification-link-sent' && <p className="text-xs mt-2" style={{ color: '#34d399' }}>✓ Lien envoyé !</p>}
              </div>
            )}
          </div>
        </div>

        {/* ── PHOTO DE PROFIL ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: 'var(--text-3)' }}><IC.Camera /></span>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Photo de profil</p>
          </div>
          <div className="p-5 flex items-center gap-4">
            {/* Preview */}
            <div className="flex-shrink-0">
              {hasPhoto
                ? <img src={photoSrc} alt="" className="w-16 h-16 rounded-2xl object-cover"
                    style={{ border: '2px solid var(--border)' }} />
                : <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'var(--bg-deep,#f1f5f9)', border: '2px dashed var(--border)' }}>
                    <span style={{ color: 'var(--text-3)' }}><IC.Camera /></span>
                  </div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-2)' }}>
                {hasPhoto ? 'Photo active — prioritaire sur l\'avatar' : 'Aucune photo — avatar affiché'}
              </p>
              <p className="text-[11px] mb-3" style={{ color: 'var(--text-3)' }}>JPG, PNG, HEIC · max 4 Mo</p>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer px-3 py-2 rounded-xl relative"
                  style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)', background: 'rgba(96,165,250,0.07)' }}>
                  <input type="file" accept="image/*,.heic,.heif" className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => { setData('avatar', e.target.files?.[0] ?? null); setRemovingPhoto(false); }} />
                  <IC.Camera /> {hasPhoto ? 'Changer la photo' : 'Ajouter une photo'}
                </label>
                {data.avatar && (
                  <button type="button" onClick={() => setData('avatar', null)}
                    className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-xl"
                    style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}>
                    <IC.Undo /> Annuler
                  </button>
                )}
                {user.avatar_url && !removingPhoto && !data.avatar && (
                  <button type="button" onClick={() => { setRemovingPhoto(true); setData('avatar', null); }}
                    className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-xl"
                    style={{ color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.04)' }}>
                    Supprimer
                  </button>
                )}
                {removingPhoto && (
                  <button type="button" onClick={() => setRemovingPhoto(false)}
                    className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-xl"
                    style={{ color: '#f6ad55', border: '1px solid rgba(246,173,85,0.25)' }}>
                    <IC.Undo /> Rétablir
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── AVATAR BUILDER ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

          {/* Header */}
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-base">🎨</span>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Avatar personnalisé</p>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>
              Live preview
            </span>
          </div>

          {/* Preview + Teint — side by side on larger screens */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
            {/* Avatar preview */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              {previewUri && (
                <img key={previewKey} src={previewUri} alt="Aperçu"
                  className="av-preview-pop rounded-full"
                  style={{ width: 110, height: 110, boxShadow: '0 4px 24px rgba(0,0,0,0.15), 0 0 0 3px rgba(96,165,250,0.18)' }} />
              )}
              <p className="text-[10px] font-medium text-center" style={{ color: 'var(--text-3)' }}>Aperçu en direct</p>
            </div>
            {/* Teint */}
            <div className="flex-1">
              <span className="av-section-label">Couleur de peau</span>
              <div className="flex gap-2 flex-wrap">
                {SKIN_COLORS.map(s => (
                  <Swatch key={s.v} color={s.c} selected={custom.skinColor === s.v} onClick={() => sc({ skinColor: s.v })} />
                ))}
              </div>
            </div>
          </div>

          {/* Feature tabs */}
          <div className="flex p-3 gap-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
            {AV_TABS.map(tab => (
              <button key={tab.id} type="button"
                className={`av-tab-btn${activeTab === tab.id ? ' on' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                <span className="text-xl leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5 av-tab-in" key={activeTab}>

            {activeTab === 'hair' && (
              <div className="space-y-5">
                <div>
                  <span className="av-section-label">Catégorie</span>
                  <div className="flex flex-wrap gap-2">
                    {[{ id: 'femme', l: '♀ Féminin' },{ id: 'homme', l: '♂ Masculin' },{ id: 'voile', l: '🧕 Voile' },{ id: 'chapeau', l: '🎩 Chapeau' }]
                      .map(cat => (
                        <button key={cat.id} type="button"
                          className={`av-cat-pill${hairCat === cat.id ? ' on' : ''}`}
                          onClick={() => { const list = TOPS[cat.id]; if (list?.length) sc({ top: list[0] }); }}>
                          {cat.l}
                        </button>
                      ))}
                  </div>
                </div>
                <div>
                  <span className="av-section-label">{hairCat === 'voile' ? 'Voile' : hairCat === 'chapeau' ? 'Chapeau' : 'Coiffure'}</span>
                  <div className="av-thumbs">
                    {(tabUris.tops || []).map(({ v, uri }) => (
                      <Thumb key={v} uri={uri} selected={custom.top === v} onClick={() => sc({ top: v })} />
                    ))}
                  </div>
                </div>
                {COVER_CATS.includes(hairCat) ? (
                  <div>
                    <span className="av-section-label">Couleur du {hairCat === 'voile' ? 'voile' : 'couvre-chef'}</span>
                    <div className="flex flex-wrap gap-2">
                      {HAT_COLORS.map(h => <Swatch key={h.v} color={h.c} selected={custom.hatColor === h.v} onClick={() => sc({ hatColor: h.v })} />)}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="av-section-label">Couleur des cheveux</span>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_COLORS.map(h => <Swatch key={h.v} color={h.c} selected={custom.hairColor === h.v} onClick={() => sc({ hairColor: h.v })} />)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'face' && (
              <div className="space-y-5">
                <div>
                  <span className="av-section-label">Yeux</span>
                  <div className="av-thumbs">
                    {(tabUris.eyes || []).map(({ v, uri }) => <Thumb key={v} uri={uri} selected={custom.eyes === v} onClick={() => sc({ eyes: v })} />)}
                  </div>
                </div>
                <div>
                  <span className="av-section-label">Sourcils</span>
                  <div className="av-thumbs">
                    {(tabUris.eyebrows || []).map(({ v, uri }) => <Thumb key={v} uri={uri} selected={custom.eyebrows === v} onClick={() => sc({ eyebrows: v })} />)}
                  </div>
                </div>
                <div>
                  <span className="av-section-label">Bouche</span>
                  <div className="av-thumbs">
                    {(tabUris.mouths || []).map(({ v, uri }) => <Thumb key={v} uri={uri} selected={custom.mouth === v} onClick={() => sc({ mouth: v })} />)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'outfit' && (
              <div className="space-y-5">
                <div>
                  <span className="av-section-label">Vêtement</span>
                  <div className="av-thumbs">
                    {(tabUris.clothing || []).map(({ v, uri }) => <Thumb key={v} uri={uri} selected={custom.clothing === v} onClick={() => sc({ clothing: v })} />)}
                  </div>
                </div>
                <div>
                  <span className="av-section-label">Couleur du vêtement</span>
                  <div className="flex flex-wrap gap-2">
                    {CLOTH_COLORS.map(cc => <Swatch key={cc.v} color={cc.c} selected={custom.clothesColor === cc.v} onClick={() => sc({ clothesColor: cc.v })} />)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'extras' && (
              <div className="space-y-5">
                <div>
                  <span className="av-section-label">Lunettes & accessoires</span>
                  <div className="av-thumbs">
                    {(tabUris.accessories || []).map(({ v, uri }) => (
                      <Thumb key={String(v)} uri={uri} selected={custom.accessories === v} onClick={() => sc({ accessories: v })} />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="av-section-label">Barbe & moustache</span>
                  <div className="av-thumbs">
                    {(tabUris.facialHairs || []).map(({ v, uri }) => (
                      <Thumb key={String(v)} uri={uri} selected={custom.facialHair === v} onClick={() => sc({ facialHair: v })} />
                    ))}
                  </div>
                </div>
                {custom.facialHair !== null && (
                  <div>
                    <span className="av-section-label">Couleur de barbe</span>
                    <div className="flex flex-wrap gap-2">
                      {BEARD_COLORS.map(b => <Swatch key={b.v} color={b.c} selected={custom.facialHairColor === b.v} onClick={() => sc({ facialHairColor: b.v })} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── SUBMIT ── */}
        <div className="flex items-center gap-3 py-2">
          <button type="submit" disabled={processing || !hasChanges}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: hasChanges && !processing ? 'linear-gradient(135deg,#2563eb,#4f46e5)' : 'var(--bg-card)',
              color: hasChanges && !processing ? 'white' : 'var(--text-3)',
              border: hasChanges && !processing ? 'none' : '1px solid var(--border)',
              boxShadow: hasChanges && !processing ? '0 4px 14px rgba(37,99,235,0.3)' : 'none',
              cursor: !hasChanges || processing ? 'not-allowed' : 'pointer',
            }}>
            {processing ? <IC.Spin /> : <IC.Save />}
            {processing ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications'}
          </button>

          <Transition show={recentlySuccessful}
            enter="transition ease-out duration-300" enterFrom="opacity-0 translate-x-2" enterTo="opacity-100 translate-x-0"
            leave="transition ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#34d399' }}>
              <IC.Check /> Profil mis à jour !
            </span>
          </Transition>
        </div>

      </form>
    </section>
  );
}
