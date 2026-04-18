// resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx
import CharacterAvatar, { CHARACTER_AVATAR_DEFAULTS, mergeCharacterBuilder } from '@/Components/Dashboard/CharacterAvatar';
import Avatar from '@/Components/Dashboard/Avatar';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function defaultAvatarBuilder() {
  return { ...CHARACTER_AVATAR_DEFAULTS };
}

// ── Icônes ─────────────────────────────────────────────────────────────────
const Ic = {
  User:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Check:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Spin:    () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>,
  Save:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Alert:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Send:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Shield:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Reset:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  Camera:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Dice:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><rect x="2" y="2" width="20" height="20" rx="4"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="16" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="16" r="1.2" fill="currentColor"/><circle cx="16" cy="16" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>,
};

// ── CSS du builder ─────────────────────────────────────────────────────────
const BUILDER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .ab-root { font-family: 'DM Sans', sans-serif; }
  .ab-root .f-display { font-family: 'Syne', sans-serif; }

  :root {
    --ab-bg:     #0a0f1e;
    --ab-card:   rgba(14,22,44,0.92);
    --ab-border: rgba(255,255,255,0.07);
    --ab-blue:   #60a5fa;
    --ab-text1:  #e2eaff;
    --ab-text2:  #7a90c4;
    --ab-text3:  #3a4a6a;
  }

  .ab-glass {
    background: var(--ab-card);
    border: 1px solid var(--ab-border);
    backdrop-filter: blur(20px);
  }

  .ab-select {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--ab-border);
    color: var(--ab-text1);
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 12px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
    cursor: pointer;
  }
  .ab-select:focus {
    border-color: var(--ab-blue);
    box-shadow: 0 0 0 2px rgba(96,165,250,0.15);
  }
  .ab-select option { background: #0d1526; }

  .ab-color-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 1px solid var(--ab-border);
    border-radius: 10px;
    background: rgba(255,255,255,0.03);
    transition: border-color 0.2s;
    cursor: pointer;
  }
  .ab-color-wrap:hover { border-color: var(--ab-blue); }
  .ab-color-wrap input[type=color] {
    width: 28px; height: 28px;
    border: none; background: none;
    border-radius: 6px; cursor: pointer; padding: 0;
  }

  .ab-tab-btn {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    transition: all 0.2s;
    color: var(--ab-text2);
    border: 1px solid transparent;
    white-space: nowrap;
  }
  .ab-tab-btn.active {
    background: rgba(96,165,250,0.12);
    color: var(--ab-blue);
    border-color: rgba(96,165,250,0.2);
  }
  .ab-tab-btn:not(.active):hover { background: rgba(255,255,255,0.04); }

  .ab-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 10px; border-radius: 8px; font-size: 11px;
    border: 1px solid var(--ab-border);
    color: var(--ab-text2); cursor: pointer;
    transition: all 0.2s; background: rgba(255,255,255,0.03);
  }
  .ab-chip.selected {
    background: rgba(96,165,250,0.12);
    border-color: rgba(96,165,250,0.3);
    color: var(--ab-blue);
  }
  .ab-chip:not(.selected):hover { background: rgba(255,255,255,0.06); }

  .ab-field {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--ab-border);
    color: var(--ab-text1);
    border-radius: 12px;
    padding: 10px 14px 10px 2.75rem;
    font-size: 13px;
    width: 100%;
    outline: none;
    transition: all 0.2s;
  }
  .ab-field:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96,165,250,0.12);
    background: rgba(96,165,250,0.04);
  }

  .ab-label {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--ab-text3); margin-bottom: 6px; display: block;
  }

  .ab-btn-primary {
    background: linear-gradient(135deg,#2563eb,#4f46e5);
    color: white; font-weight: 700; font-family: 'Syne',sans-serif;
    border-radius: 12px; padding: 10px 24px; font-size: 13px;
    transition: all 0.3s; box-shadow: 0 4px 14px rgba(37,99,235,0.3);
  }
  .ab-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.45); }
  .ab-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .skin-swatch {
    width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
    border: 2px solid transparent; transition: all 0.2s;
  }
  .skin-swatch.selected { border-color: white; box-shadow: 0 0 0 2px #60a5fa; transform: scale(1.15); }
  .skin-swatch:not(.selected):hover { transform: scale(1.1); }

  .expr-btn {
    padding: 8px 4px; border-radius: 10px; font-size: 18px;
    border: 1px solid var(--ab-border); cursor: pointer;
    transition: all 0.2s; background: rgba(255,255,255,0.03);
    text-align: center;
  }
  .expr-btn.selected { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.35); transform: scale(1.08); }
  .expr-btn:not(.selected):hover { background: rgba(255,255,255,0.07); }

  .preview-3d {
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .preview-3d:hover { transform: scale(1.04) rotateY(5deg); }

  @keyframes shine { 0%{left:-100%} 100%{left:200%} }
  .shimmer { position: relative; overflow: hidden; }
  .shimmer::after {
    content:''; position:absolute; top:0; left:-100%;
    width:60%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);
    animation: shine 2.5s ease-in-out infinite;
  }
`;

// ── Presets de peau ────────────────────────────────────────────────────────
const SKIN_PRESETS = [
  { color: '#FDDBB4', label: 'Très clair' },
  { color: '#F5C48A', label: 'Clair' },
  { color: '#E8A87C', label: 'Beige' },
  { color: '#D4875A', label: 'Doré' },
  { color: '#B5703C', label: 'Ambre' },
  { color: '#8B4513', label: 'Brun' },
  { color: '#6B3020', label: 'Foncé' },
  { color: '#3D1C0E', label: 'Très foncé' },
];

const HAIR_COLORS = [
  '#1a0a00','#2c1810','#5c3317','#8B4513','#A0522D',
  '#C4702A','#D4A017','#F2E2A0','#FAFAFA','#C0C0C0',
  '#808080','#FF6B6B','#FF69B4','#9B59B6','#3498DB',
  '#00CED1','#2ECC71','#F39C12',
];

const EYE_COLORS = [
  '#3d2b1f','#5c3d2e','#8B6914','#4A7C59','#2E86AB',
  '#1B4F72','#7D3C98','#28B463','#E74C3C','#1a1a2e',
];

const BG_COLORS = [
  '#dbeafe','#e0f2fe','#dcfce7','#fef9c3','#fce7f3',
  '#ede9fe','#f1f5f9','#0f172a','#1a2a4a','#0d2a1a',
];

// ── Options ────────────────────────────────────────────────────────────────
const HAIR_STYLES = [
  { v:'medium',       l:'Court (naturel)' },
  { v:'pixie',        l:'Pixie' },
  { v:'spiky',        l:'Hérissé' },
  { v:'fade',         l:'Fondu (fade)' },
  { v:'undercut',     l:'Undercut' },
  { v:'slick_back',   l:'Plaqué arrière' },
  { v:'bob',          l:'Carré (bob)' },
  { v:'ponytail',     l:'Queue de cheval' },
  { v:'long_straight',l:'Long lisse' },
  { v:'long_wavy',    l:'Long ondulé' },
  { v:'long_curly',   l:'Long bouclé' },
  { v:'braids',       l:'Tresses' },
  { v:'bun',          l:'Chignon' },
  { v:'afro',         l:'Afro' },
  { v:'dreadlocks',   l:'Dreadlocks' },
];

const EXPRESSIONS = [
  { v:'neutral',   e:'😐' },
  { v:'smile',     e:'😊' },
  { v:'laugh',     e:'😄' },
  { v:'wink',      e:'😉' },
  { v:'smirk',     e:'😏' },
  { v:'curious',   e:'😮' },
  { v:'sad',       e:'😢' },
  { v:'surprised', e:'😲' },
  { v:'cool',      e:'😎' },
];

const FACE_SHAPES = [
  { v:'oval',    l:'Ovale' },
  { v:'round',   l:'Rond' },
  { v:'square',  l:'Carré' },
  { v:'heart',   l:'Cœur' },
  { v:'diamond', l:'Diamant' },
];

const EYE_SHAPES = [
  { v:'almond',    l:'Amande' },
  { v:'round',     l:'Ronds' },
  { v:'hooded',    l:'Paupières tombantes' },
  { v:'narrow',    l:'Étirés' },
  { v:'upturned',  l:'Relevés' },
  { v:'downturned',l:'Tombants' },
];

const NOSE_SHAPES = [
  { v:'button',  l:'Bouton' },
  { v:'wide',    l:'Large' },
  { v:'pointy',  l:'Pointu' },
  { v:'upturned',l:'Retroussé' },
  { v:'broad',   l:'Épaté' },
  { v:'narrow',  l:'Étroit' },
  { v:'none',    l:'Aucun' },
];

const LIP_SHAPES = [
  { v:'thin',   l:'Fins' },
  { v:'medium', l:'Normaux' },
  { v:'full',   l:'Pulpeux' },
  { v:'pouty',  l:'Boudeuse' },
  { v:'wide',   l:'Larges' },
];

const BROW_SHAPES = [
  { v:'arched',   l:'Arqués' },
  { v:'straight', l:'Droits' },
  { v:'thick',    l:'Épais' },
  { v:'thin',     l:'Fins' },
  { v:'curved',   l:'Courbés' },
];

const LASH_STYLES = [
  { v:'none',     l:'Aucuns' },
  { v:'natural',  l:'Naturels' },
  { v:'full',     l:'Complets' },
  { v:'dramatic', l:'Dramatiques' },
];

const FACIAL_HAIR = [
  { v:'none',         l:'Aucune' },
  { v:'stubble',      l:'3 jours' },
  { v:'mustache',     l:'Moustache' },
  { v:'goatee',       l:'Bouc' },
  { v:'beard_short',  l:'Barbe courte' },
  { v:'beard_full',   l:'Barbe pleine' },
  { v:'viking',       l:'Viking' },
];

const SKIN_DETAILS = [
  { v:'none',       l:'Aucun' },
  { v:'freckles',   l:'Taches de rousseur' },
  { v:'mole_left',  l:'Grain de beauté (gauche)' },
  { v:'mole_right', l:'Grain de beauté (droite)' },
  { v:'dimples',    l:'Fossettes' },
  { v:'vitiligo',   l:'Vitiligo' },
];

const TOP_STYLES = [
  { v:'tee',      l:'T-shirt' },
  { v:'hoodie',   l:'Sweat à capuche' },
  { v:'sweater',  l:'Pull' },
  { v:'shirt',    l:'Chemise' },
  { v:'suit',     l:'Costume' },
  { v:'crop_top', l:'Crop top' },
  { v:'dress',    l:'Robe' },
];

const BOTTOM_STYLES = [
  { v:'pants',      l:'Pantalon' },
  { v:'shorts',     l:'Short' },
  { v:'skirt',      l:'Jupe courte' },
  { v:'leggings',   l:'Legging' },
];

const SHOES_STYLES = [
  { v:'sneakers', l:'Sneakers' },
  { v:'boots',    l:'Bottes' },
  { v:'heels',    l:'Talons' },
  { v:'loafers',  l:'Mocassins' },
];

const ACCESSORIES = [
  { v:'none',           l:'Aucun' },
  { v:'glasses',        l:'🤓 Lunettes' },
  { v:'round_glasses',  l:'🔵 Lunettes rondes' },
  { v:'sunnies',        l:'😎 Lunettes de soleil' },
  { v:'cap',            l:'🧢 Casquette' },
  { v:'beanie',         l:'🎩 Bonnet' },
  { v:'headphones',     l:'🎧 Casque' },
  { v:'crown',          l:'👑 Couronne' },
  { v:'earrings',       l:'💎 Boucles d\'oreilles' },
  { v:'hoop_earrings',  l:'⭕ Créoles' },
  { v:'necklace',       l:'📿 Collier' },
  { v:'chain_necklace', l:'⛓ Chaîne' },
  { v:'mask',           l:'😷 Masque' },
  { v:'bandana',        l:'🎀 Bandana' },
];

const BG_STYLES = [
  { v:'gradient', l:'Dégradé' },
  { v:'solid',    l:'Uni' },
  { v:'bokeh',    l:'Bokeh' },
  { v:'none',     l:'Transparent' },
];

// ── UI primitives ───────────────────────────────────────────────────────────
function Sel({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="ab-label">{label}</span>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className="ab-select pr-7">
          {options.map(o => <option key={o.v||o.value} value={o.v||o.value}>{o.l||o.label}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center" style={{color:'var(--ab-text3)'}}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"/></svg>
        </div>
      </div>
    </label>
  );
}

function Col({ label, value, onChange }) {
  return (
    <label className="block cursor-pointer">
      <span className="ab-label">{label}</span>
      <div className="ab-color-wrap">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} />
        <span style={{fontSize:10,color:'var(--ab-text3)',fontFamily:'monospace'}}>{value}</span>
      </div>
    </label>
  );
}

function Chips({ label, value, onChange, options }) {
  return (
    <div>
      <span className="ab-label">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => (
          <button key={o.v} type="button" onClick={() => onChange(o.v)}
            className={`ab-chip ${value === o.v ? 'selected' : ''}`}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Randomize helper ───────────────────────────────────────────────────────
function randomAvatar() {
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  return {
    faceShape:   pick(FACE_SHAPES).v,
    skin:        pick(SKIN_PRESETS).color,
    eyeShape:    pick(EYE_SHAPES).v,
    eyeColor:    pick(EYE_COLORS),
    browShape:   pick(BROW_SHAPES).v,
    noseShape:   pick(NOSE_SHAPES.filter(n=>n.v!=='none')).v,
    lipShape:    pick(LIP_SHAPES).v,
    expression:  pick(EXPRESSIONS).v,
    lashStyle:   pick(LASH_STYLES).v,
    hairStyle:   pick(HAIR_STYLES).v,
    hairColor:   pick(HAIR_COLORS),
    hairHighlight: Math.random()>0.7 ? pick(HAIR_COLORS) : null,
    facialHair:  Math.random()>0.6 ? pick(FACIAL_HAIR.filter(f=>f.v!=='none')).v : 'none',
    facialHairColor: pick(HAIR_COLORS),
    skinDetails: Math.random()>0.6 ? pick(SKIN_DETAILS.filter(s=>s.v!=='none')).v : 'none',
    topStyle:    pick(TOP_STYLES).v,
    topColor:    `hsl(${Math.floor(Math.random()*360)},60%,40%)`,
    bottomStyle: pick(BOTTOM_STYLES).v,
    bottomColor: `hsl(${Math.floor(Math.random()*360)},40%,25%)`,
    accessory:   Math.random()>0.5 ? pick(ACCESSORIES.filter(a=>a.v!=='none')).v : 'none',
    accessoryColor: `hsl(${Math.floor(Math.random()*360)},50%,35%)`,
    blushIntensity: Math.random()*0.5,
    bgStyle:     pick(BG_STYLES).v,
    bgColor:     pick(BG_COLORS),
  };
}

const BUILDER_TAB_KEYS = ['face', 'eyes', 'hair', 'clothes', 'accessories', 'background'];

// ── Main Form ──────────────────────────────────────────────────────────────
export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
  const { t } = useTranslation();
  const user = usePage().props.auth.user;
  const [tab, setTab] = useState(0);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);

  const initBuilder = useRef(
    user.avatar_builder && typeof user.avatar_builder === 'object' && Object.keys(user.avatar_builder).length > 0
      ? { ...defaultAvatarBuilder(), ...user.avatar_builder }
      : defaultAvatarBuilder()
  );

  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
    avatar: null,
    avatar_builder: initBuilder.current,
  });

  useEffect(() => {
    if (!data.avatar) { setAvatarPreviewUrl(null); return; }
    const url = URL.createObjectURL(data.avatar);
    setAvatarPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [data.avatar]);

  const ab = data.avatar_builder;
  const patch = (partial) => setData('avatar_builder', { ...ab, ...partial });

  const submit = (e) => {
    e.preventDefault();
    post(route('profile.update'), {
      forceFormData: !!data.avatar,
      transform: (d) => d.avatar
        ? { ...d, avatar_builder: JSON.stringify(d.avatar_builder ?? defaultAvatarBuilder()) }
        : d,
    });
  };

  const isVerified = user.email_verified_at !== null;
  const linkSent   = status === 'verification-link-sent';
  const hasChanges =
    data.name !== user.name ||
    data.email !== user.email ||
    data.avatar !== null ||
    JSON.stringify(data.avatar_builder) !== JSON.stringify(initBuilder.current);

  return (
    <section className={className}>
      <style>{BUILDER_CSS}</style>

      <div className="ab-root">

        {/* ── Header ── */}
        <div className="mb-5">
          <h2 className="text-base font-bold flex items-center gap-2" style={{color:'var(--ab-text1)',fontFamily:'Syne,sans-serif'}}>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(96,165,250,0.1)',color:'#60a5fa',border:'1px solid rgba(96,165,250,0.2)'}}>
              <Ic.User />
            </span>
            {t('profile.titleProfileAvatar')}
          </h2>
          <p className="mt-1.5 text-xs" style={{color:'var(--ab-text3)'}}>
            {t('profile.subtitleProfileAvatar')}
          </p>
        </div>

        {/* ── Preview + Identity ── */}
        <div className="ab-glass rounded-2xl p-5 mb-5 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar preview 3D */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="preview-3d" style={{filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.5))'}}>
              <CharacterAvatar builder={ab} sizePx={130} animated />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => patch(randomAvatar())}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-white/5"
                style={{color:'var(--ab-text2)',border:'1px solid var(--ab-border)'}}>
                <Ic.Dice /> {t('profile.random')}
              </button>
              <button type="button" onClick={() => setData('avatar_builder', defaultAvatarBuilder())}
                className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-white/5"
                style={{color:'var(--ab-text2)',border:'1px solid var(--ab-border)'}}>
                <Ic.Reset /> {t('profile.reset')}
              </button>
            </div>
          </div>

          {/* Identity fields */}
          <div className="flex-1 w-full space-y-4">
            {/* Photo upload */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {avatarPreviewUrl
                ? <img src={avatarPreviewUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" style={{border:'2px solid rgba(96,165,250,0.4)'}} />
                : user.avatar_url
                  ? <img src={user.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" style={{border:'2px solid rgba(96,165,250,0.4)'}} />
                  : <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{background:'rgba(96,165,250,0.1)',border:'2px dashed rgba(96,165,250,0.25)'}}>
                      <span style={{color:'rgba(96,165,250,0.6)'}}><Ic.Camera /></span>
                    </div>
              }
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors min-h-[44px] px-3 py-2 rounded-xl touch-manipulation relative" style={{color:'#60a5fa',border:'1px solid rgba(96,165,250,0.35)',background:'rgba(96,165,250,0.06)'}}>
                    <input type="file" accept="image/*,.heic,.heif" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => setData('avatar', e.target.files?.[0] ?? null)} />
                    <Ic.Camera /> {t('profile.chooseFromGallery')}
                  </label>
                  <label className="inline-flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors min-h-[44px] px-3 py-2 rounded-xl touch-manipulation relative sm:hidden" style={{color:'#60a5fa',border:'1px solid rgba(96,165,250,0.35)',background:'rgba(96,165,250,0.06)'}}>
                    <input type="file" accept="image/*" capture="environment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={e => setData('avatar', e.target.files?.[0] ?? null)} />
                    <Ic.Camera /> {t('profile.takePhoto')}
                  </label>
                </div>
                <p className="text-[10px] mt-0.5" style={{color:'var(--ab-text3)'}}>{t('profile.photoHint')}</p>
                {data.avatar && (
                  <button type="button" onClick={() => setData('avatar', null)}
                    className="text-[10px] mt-0.5" style={{color:'rgba(252,129,129,0.8)'}}>
                    {t('profile.cancel')}
                  </button>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="ab-label">{t('profile.fullName')}</label>
              <div className="relative">
                <input id="name" type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                  autoComplete="name" className="ab-field" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" style={{color:'var(--ab-text3)'}}><Ic.User /></span>
              </div>
              {errors.name && <p className="text-xs mt-1" style={{color:'#fc8181'}}>⚠ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label htmlFor="email" className="ab-label mb-0">{t('profile.institutionalEmail')}</label>
                {isVerified && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{background:'rgba(104,211,145,0.1)',color:'#68d391',border:'1px solid rgba(104,211,145,0.2)'}}>
                    ✓ {t('profile.verified')}
                  </span>
                )}
              </div>
              <div className="relative">
                <input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                  autoComplete="username" className="ab-field" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-[1]" style={{color:'var(--ab-text3)'}}><Ic.Mail /></span>
              </div>
              {errors.email && <p className="text-xs mt-1" style={{color:'#fc8181'}}>⚠ {errors.email}</p>}
            </div>

            {/* Email verification banner */}
            {mustVerifyEmail && user.email_verified_at === null && (
              <div className="rounded-xl p-3.5" style={{background:'rgba(246,173,85,0.08)',border:'1px solid rgba(246,173,85,0.2)'}}>
                <p className="text-xs font-bold mb-1.5" style={{color:'#f6ad55'}}>{t('profile.emailUnverified')}</p>
                <Link href={route('verification.send')} method="post" as="button"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{background:'rgba(246,173,85,0.12)',color:'#f6ad55',border:'1px solid rgba(246,173,85,0.2)'}}>
                  <Ic.Send /> {t('profile.resendLink')}
                </Link>
                {linkSent && (
                  <p className="text-xs mt-2" style={{color:'#68d391'}}>{t('profile.linkSent')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Avatar Builder ── */}
        <div className="ab-glass rounded-2xl overflow-hidden shimmer mb-5">
          {/* Gradient top line */}
          <div className="h-px w-full" style={{background:'linear-gradient(90deg,transparent,rgba(96,165,250,0.5),rgba(167,139,250,0.5),transparent)'}} />

          {/* Tabs */}
          <div className="flex gap-1 px-4 py-3 overflow-x-auto" style={{borderBottom:'1px solid var(--ab-border)'}}>
            {BUILDER_TAB_KEYS.map((key, i) => (
              <button key={key} type="button" onClick={() => setTab(i)}
                className={`ab-tab-btn ${tab===i?'active':''}`}>
                {t(`profile.builderTab.${key}`)}
              </button>
            ))}
          </div>

          <div className="p-5">

            {/* ── Tab 0: Visage ── */}
            {tab === 0 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Sel label="Forme du visage" value={ab.faceShape||'oval'} onChange={v=>patch({faceShape:v})} options={FACE_SHAPES} />
                  <Sel label="Expression" value={ab.expression||'smile'} onChange={v=>patch({expression:v})} options={EXPRESSIONS.map(e=>({v:e.v,l:`${e.e} ${e.v}`}))} />
                  <Sel label="Nez" value={ab.noseShape||'button'} onChange={v=>patch({noseShape:v})} options={NOSE_SHAPES} />
                  <Sel label="Lèvres" value={ab.lipShape||'medium'} onChange={v=>patch({lipShape:v})} options={LIP_SHAPES} />
                  <Sel label="Détails peau" value={ab.skinDetails||'none'} onChange={v=>patch({skinDetails:v})} options={SKIN_DETAILS} />
                  <Col label="Couleur des lèvres" value={ab.lipColor||'#c0634a'} onChange={v=>patch({lipColor:v})} />
                </div>

                {/* Expression picker visuel */}
                <div>
                  <span className="ab-label">Expression rapide</span>
                  <div className="grid grid-cols-9 gap-1.5">
                    {EXPRESSIONS.map(e => (
                      <button key={e.v} type="button" onClick={() => patch({expression:e.v})}
                        className={`expr-btn ${ab.expression===e.v?'selected':''}`} title={e.v}>
                        {e.e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin */}
                <div>
                  <span className="ab-label">Teinte de peau</span>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {SKIN_PRESETS.map(s => (
                      <button key={s.color} type="button" onClick={() => patch({skin:s.color})}
                        title={s.label}
                        className={`skin-swatch ${ab.skin===s.color?'selected':''}`}
                        style={{background:s.color}} />
                    ))}
                  </div>
                  <Col label="Couleur personnalisée" value={ab.skin||'#f5cba7'} onChange={v=>patch({skin:v})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="ab-label">Intensité des joues</span>
                    <input type="range" min="0" max="1" step="0.05"
                      value={ab.blushIntensity||0.3}
                      onChange={e => patch({blushIntensity:parseFloat(e.target.value)})}
                      className="w-full mt-1" />
                    <div className="flex justify-between text-[9px] mt-0.5" style={{color:'var(--ab-text3)'}}>
                      <span>Aucune</span><span>Forte</span>
                    </div>
                  </div>
                  <Col label="Couleur des joues" value={ab.blushColor||'#e8936a'} onChange={v=>patch({blushColor:v})} />
                </div>
              </div>
            )}

            {/* ── Tab 1: Yeux ── */}
            {tab === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Sel label="Forme des yeux" value={ab.eyeShape||'almond'} onChange={v=>patch({eyeShape:v})} options={EYE_SHAPES} />
                  <Sel label="Taille des yeux" value={ab.eyeSize||'medium'} onChange={v=>patch({eyeSize:v})} options={[{v:'small',l:'Petits'},{v:'medium',l:'Normaux'},{v:'large',l:'Grands'}]} />
                  <Sel label="Cils" value={ab.lashStyle||'natural'} onChange={v=>patch({lashStyle:v})} options={LASH_STYLES} />
                  <Sel label="Sourcils" value={ab.browShape||'arched'} onChange={v=>patch({browShape:v})} options={BROW_SHAPES} />
                </div>
                <div>
                  <span className="ab-label">Couleur des yeux</span>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {EYE_COLORS.map(c => (
                      <button key={c} type="button" onClick={() => patch({eyeColor:c})}
                        className={`skin-swatch ${ab.eyeColor===c?'selected':''}`}
                        style={{background:c}} />
                    ))}
                  </div>
                  <Col label="Couleur personnalisée" value={ab.eyeColor||'#3d2b1f'} onChange={v=>patch({eyeColor:v})} />
                </div>
              </div>
            )}

            {/* ── Tab 2: Cheveux ── */}
            {tab === 2 && (
              <div className="space-y-5">
                <Sel label="Style de coiffure" value={ab.hairStyle||'medium'} onChange={v=>patch({hairStyle:v})} options={HAIR_STYLES} />
                <div>
                  <span className="ab-label">Couleur des cheveux</span>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {HAIR_COLORS.map(c => (
                      <button key={c} type="button" onClick={() => patch({hairColor:c})}
                        className={`skin-swatch ${ab.hairColor===c?'selected':''}`}
                        style={{background:c,border: ab.hairColor===c?'2px solid white':'2px solid transparent'}} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Col label="Couleur principale" value={ab.hairColor||'#2c1810'} onChange={v=>patch({hairColor:v})} />
                    <Col label="Reflets (optionnel)" value={ab.hairHighlight||ab.hairColor||'#2c1810'} onChange={v=>patch({hairHighlight:v})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Sel label="Pilosité faciale" value={ab.facialHair||'none'} onChange={v=>patch({facialHair:v})} options={FACIAL_HAIR} />
                  <Col label="Couleur de la barbe" value={ab.facialHairColor||'#2c1810'} onChange={v=>patch({facialHairColor:v})} />
                </div>
              </div>
            )}

            {/* ── Tab 3: Vêtements ── */}
            {tab === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Sel label="Haut" value={ab.topStyle||'tee'} onChange={v=>patch({topStyle:v})} options={TOP_STYLES} />
                  <Col label="Couleur du haut" value={ab.topColor||'#2563eb'} onChange={v=>patch({topColor:v})} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Sel label="Bas" value={ab.bottomStyle||'pants'} onChange={v=>patch({bottomStyle:v})} options={BOTTOM_STYLES} />
                  <Col label="Couleur du bas" value={ab.bottomColor||'#1e293b'} onChange={v=>patch({bottomColor:v})} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Sel label="Chaussures" value={ab.shoesStyle||'sneakers'} onChange={v=>patch({shoesStyle:v})} options={SHOES_STYLES} />
                  <Col label="Couleur chaussures" value={ab.shoesColor||'#1a1a1a'} onChange={v=>patch({shoesColor:v})} />
                </div>
              </div>
            )}

            {/* ── Tab 4: Accessoires ── */}
            {tab === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Sel label="Accessoire principal" value={ab.accessory||'none'} onChange={v=>patch({accessory:v})} options={ACCESSORIES} />
                  <Col label="Couleur" value={ab.accessoryColor||'#374151'} onChange={v=>patch({accessoryColor:v})} />
                </div>
                <div>
                  <Sel label="Accessoire secondaire" value={ab.accessory2||'none'} onChange={v=>patch({accessory2:v})} options={ACCESSORIES} />
                </div>
              </div>
            )}

            {/* ── Tab 5: Fond ── */}
            {tab === 5 && (
              <div className="space-y-5">
                <Chips label="Style de fond" value={ab.bgStyle||'gradient'} onChange={v=>patch({bgStyle:v})} options={BG_STYLES.map(s=>({v:s.v,l:s.l}))} />
                <div>
                  <span className="ab-label">Couleur de fond</span>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {BG_COLORS.map(c => (
                      <button key={c} type="button" onClick={() => patch({bgColor:c})}
                        className={`skin-swatch ${ab.bgColor===c?'selected':''}`}
                        style={{background:c}} />
                    ))}
                  </div>
                  <Col label="Couleur personnalisée" value={ab.bgColor||'#dbeafe'} onChange={v=>patch({bgColor:v})} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RGPD badge ── */}
        <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-xl" style={{background:'rgba(96,165,250,0.05)',border:'1px solid rgba(96,165,250,0.1)'}}>
          <span style={{color:'#60a5fa'}}><Ic.Shield /></span>
          <p className="text-[10px] font-medium" style={{color:'var(--ab-text3)'}}>
            {t('profile.rgpdBadge')}
          </p>
        </div>

        {/* ── Submit ── */}
        <form onSubmit={submit}>
          <div className="flex items-center gap-4">
            <button type="submit" disabled={processing || !hasChanges}
              className="ab-btn-primary flex items-center gap-2">
              {processing ? <Ic.Spin /> : <Ic.Save />}
              {processing ? t('profile.saving') : t('profile.save')}
            </button>

            {!hasChanges && !recentlySuccessful && (
              <p className="text-[10px] italic" style={{color:'var(--ab-text3)'}}>{t('profile.noChanges')}</p>
            )}

            <Transition show={recentlySuccessful}
              enter="transition ease-out duration-300" enterFrom="opacity-0 translate-x-2" enterTo="opacity-100 translate-x-0"
              leave="transition ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl"
                   style={{background:'rgba(104,211,145,0.1)',border:'1px solid rgba(104,211,145,0.2)',color:'#68d391'}}>
                <Ic.Check /> {t('profile.profileUpdated')}
              </div>
            </Transition>
          </div>
        </form>

      </div>
    </section>
  );
}
