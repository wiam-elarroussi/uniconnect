// resources/js/Components/Dashboard/CharacterAvatar.jsx
/**
 * CharacterAvatar v2 — Rendu SVG ultra-réaliste
 * Système de couches avancé avec ombres, reflets, profondeur, dégradés réalistes
 */
import { useId } from 'react';

export const CHARACTER_AVATAR_DEFAULTS = {
  // Silhouette
  bodyType: 'medium',       // slim | medium | broad

  // Visage (style “friendly” proche d’un avatar type Duolingo : visage rond, gros yeux, sourire)
  faceShape: 'round',       // oval | round | square | heart | diamond
  skin: '#f5cba7',
  skinShade: 'light',       // light | medium | dark | deep

  // Yeux
  eyeShape: 'round',        // round | almond | hooded | narrow | upturned | downturned
  eyeColor: '#3d2b1f',
  eyeSize: 'large',         // small | medium | large
  lashStyle: 'natural',     // none | natural | full | dramatic
  browShape: 'arched',      // straight | arched | thick | thin | curved

  // Nez
  noseShape: 'button',      // button | wide | pointy | upturned | broad | narrow | none

  // Bouche
  lipShape: 'medium',       // thin | medium | full | pouty | wide
  expression: 'smile',      // neutral | smile | laugh | wink | smirk | sad | surprised | cool | curious

  // Cheveux
  hairStyle: 'medium',      // voir HAIR_GROUPS
  hairColor: '#2c1810',
  hairHighlight: null,      // null | couleur hex

  // Pilosité faciale
  facialHair: 'none',
  facialHairColor: '#2c1810',

  // Couleurs
  lipColor: null,
  blushColor: null,
  blushIntensity: 0.1,      // 0-1

  // Détails peau
  skinDetails: 'none',      // none | freckles | mole_left | mole_right | dimples | vitiligo

  // Vêtements
  topStyle: 'tee',
  topColor: '#2563eb',
  topPattern: 'solid',      // solid | stripes | logo
  bottomStyle: 'pants',
  bottomColor: '#1e293b',
  shoesColor: '#1a1a1a',
  shoesStyle: 'sneakers',   // sneakers | boots | heels | loafers

  // Accessoires
  accessory: 'none',
  accessoryColor: '#374151',
  accessory2: 'none',       // second accessory slot

  // Background
  bgStyle: 'gradient',      // gradient | solid | bokeh
  bgColor: '#dbeafe',
};

export function mergeCharacterBuilder(b) {
  return { ...CHARACTER_AVATAR_DEFAULTS, ...(b && typeof b === 'object' ? b : {}) };
}

// ── Palettes de peau réalistes ─────────────────────────────────────────────
function skinPalette(base) {
  // Génère ombre, reflet, joues depuis la couleur de base
  const hex2rgb = h => [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const rgb2hex = ([r,g,b]) => '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
  const [r,g,b] = hex2rgb(base);
  return {
    base,
    shadow:    rgb2hex([r*0.82, g*0.78, b*0.72]),
    shadow2:   rgb2hex([r*0.70, g*0.65, b*0.58]),
    highlight: rgb2hex([Math.min(255,r*1.12), Math.min(255,g*1.10), Math.min(255,b*1.08)]),
    blush:     rgb2hex([Math.min(255,r*1.05), g*0.80, b*0.72]),
    lip:       rgb2hex([r*0.75, g*0.50, b*0.45]),
  };
}

// ── Formes de visage ──────────────────────────────────────────────────────
function FaceShape({ shape, sp, fm, uid }) {
  const s = sp; // skin palette
  switch (shape) {
    case 'round':
      return (
        <g>
          <ellipse cx="50" cy="50" rx={21} ry={22} fill={`url(#face-${uid})`} />
          <ellipse cx="50" cy="50" rx={21} ry={22} fill={`url(#face-depth-${uid})`} />
        </g>
      );
    case 'square':
      return (
        <g>
          <path d="M30 34 Q30 28 50 28 Q70 28 70 34 L70 60 Q70 70 60 72 Q50 74 40 72 Q30 70 30 60 Z" fill={`url(#face-${uid})`} />
          <path d="M30 34 Q30 28 50 28 Q70 28 70 34 L70 60 Q70 70 60 72 Q50 74 40 72 Q30 70 30 60 Z" fill={`url(#face-depth-${uid})`} />
        </g>
      );
    case 'heart':
      return (
        <g>
          <path d="M50 70 Q32 62 30 48 Q28 34 38 30 Q44 28 50 34 Q56 28 62 30 Q72 34 70 48 Q68 62 50 70 Z" fill={`url(#face-${uid})`} />
          <path d="M50 70 Q32 62 30 48 Q28 34 38 30 Q44 28 50 34 Q56 28 62 30 Q72 34 70 48 Q68 62 50 70 Z" fill={`url(#face-depth-${uid})`} />
        </g>
      );
    case 'diamond':
      return (
        <g>
          <path d="M50 26 Q62 30 68 42 Q72 52 65 64 Q58 72 50 74 Q42 72 35 64 Q28 52 32 42 Q38 30 50 26 Z" fill={`url(#face-${uid})`} />
          <path d="M50 26 Q62 30 68 42 Q72 52 65 64 Q58 72 50 74 Q42 72 35 64 Q28 52 32 42 Q38 30 50 26 Z" fill={`url(#face-depth-${uid})`} />
        </g>
      );
    default: // oval
      return (
        <g>
          <ellipse cx="50" cy="50" rx={20} ry={23} fill={`url(#face-${uid})`} />
          <ellipse cx="50" cy="50" rx={20} ry={23} fill={`url(#face-depth-${uid})`} />
          {/* Mâchoire légèrement carrée */}
          <path d="M31 54 Q30 62 35 67 Q42 73 50 73 Q58 73 65 67 Q70 62 69 54" fill={`url(#face-${uid})`} opacity={0.5} />
        </g>
      );
  }
}

// ── Yeux ultra-détaillés ───────────────────────────────────────────────────
function Eye({ cx, cy, eyeColor, shape, size, lash, expression, isLeft, uid }) {
  const s = { small: 0.84, medium: 1, large: 1.14 }[size] || 1;
  const isAlmond = shape === 'almond' || shape === 'upturned' || shape === 'downturned';
  const rx = (isAlmond ? 5.1 : 4.9) * s;
  const ry = (isAlmond ? 2.95 : 3.2) * s;
  const isWink = expression === 'wink' && isLeft;
  const isClosed = expression === 'laugh';

  if (isWink || isClosed) {
    return (
      <g>
        <path d={`M${cx-rx*1.1} ${cy} Q${cx} ${cy-ry*0.6} ${cx+rx*1.1} ${cy}`}
          fill="none" stroke="#3d2b1f" strokeWidth="1.5" strokeLinecap="round" opacity={0.85} />
        {/* lash line */}
        <path d={`M${cx-rx*1.1} ${cy} Q${cx} ${cy-ry*0.6} ${cx+rx*1.1} ${cy}`}
          fill="none" stroke="#1a0f08" strokeWidth="0.8" strokeLinecap="round" opacity={0.5} />
      </g>
    );
  }

  // Clippath de l'œil
  const clipId = `eye-clip-${uid}-${isLeft ? 'L' : 'R'}`;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
        </clipPath>
      </defs>

      {/* Eye white */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="white" />
      {/* Iris + pupil (slightly larger to avoid tired look) */}
      <circle cx={cx} cy={cy + 0.12} r={ry * 0.72} fill={eyeColor} clipPath={`url(#${clipId})`} />
      <circle cx={cx} cy={cy + 0.16} r={ry * 0.36} fill="#0f172a" clipPath={`url(#${clipId})`} />
      {/* Soft highlight */}
      <circle cx={cx + 0.95} cy={cy - 0.95} r={ry * 0.16} fill="rgba(255,255,255,0.9)" clipPath={`url(#${clipId})`} />
      {/* Eye outline */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="rgba(15,23,42,0.13)" strokeWidth="0.45" />

      {/* Cils supérieurs */}
      {lash !== 'none' && (
        <path d={`M${cx-rx*1.05} ${cy} Q${cx} ${cy-ry*1.15} ${cx+rx*1.05} ${cy}`}
          fill="none" stroke="#1a0f08"
          strokeWidth={lash === 'dramatic' ? 1.8 : lash === 'full' ? 1.45 : 1.05}
          strokeLinecap="round" />
      )}
      {/* No lower lash line: cleaner and less sleepy */}
    </g>
  );
}

// ── Sourcils ultra-détaillés ───────────────────────────────────────────────
function Brows({ expression, browShape, hairColor, uid }) {
  const col = hairColor || '#2c1810';
  const sad = expression === 'sad';
  const angry = false;
  const raised = expression === 'surprised';

  const browData = {
    arched: {
      L: `M34 ${raised?36:sad?42:39} Q38 ${raised?33:sad?39:36} 44 ${raised?37:sad?41:39.5}`,
      R: `M56 ${raised?37:sad?41:39.5} Q62 ${raised?33:sad?39:36} 66 ${raised?36:sad?42:39}`,
    },
    straight: {
      L: `M34 ${raised?37:sad?43:40} L44 ${raised?37:sad?42:40}`,
      R: `M56 ${raised?37:sad?42:40} L66 ${raised?37:sad?43:40}`,
    },
    thick: {
      L: `M33 ${raised?37:sad?43:40} Q38 ${raised?35:sad?41:38} 44 ${raised?37:sad?42:40}`,
      R: `M56 ${raised?37:sad?42:40} Q62 ${raised?35:sad?41:38} 67 ${raised?37:sad?43:40}`,
    },
    thin: {
      L: `M35 ${raised?38:sad?43:41} Q38 ${raised?36:sad?41:39} 44 ${raised?38:sad?42:41}`,
      R: `M56 ${raised?38:sad?42:41} Q62 ${raised?36:sad?41:39} 65 ${raised?38:sad?43:41}`,
    },
    curved: {
      L: `M33 ${raised?37:sad?44:41} Q37 ${raised?34:sad?40:37} 44 ${raised?37:sad?43:41}`,
      R: `M56 ${raised?37:sad?43:41} Q63 ${raised?34:sad?40:37} 67 ${raised?37:sad?44:41}`,
    },
  };
  const bd = browData[browShape] || browData.arched;
  const thick = ['thick'].includes(browShape) ? 2.2 : 1.35;

  return (
    <g opacity={0.88}>
      {/* Brow shadow for depth */}
      <path d={bd.L} fill="none" stroke={col} strokeWidth={thick + 0.55} strokeLinecap="round" opacity={0.1} />
      <path d={bd.R} fill="none" stroke={col} strokeWidth={thick + 0.55} strokeLinecap="round" opacity={0.1} />
      {/* Main brow */}
      <path d={bd.L} fill="none" stroke={col} strokeWidth={thick} strokeLinecap="round" />
      <path d={bd.R} fill="none" stroke={col} strokeWidth={thick} strokeLinecap="round" />
      {/* Highlight on brow */}
      <path d={bd.L} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} strokeLinecap="round" />
      <path d={bd.R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={0.4} strokeLinecap="round" />
    </g>
  );
}

// ── Nez ultra-détaillé ────────────────────────────────────────────────────
function Nose({ shape, sp }) {
  const s = sp.shadow;
  switch (shape) {
    case 'none': return null;
    default:
      return (
        <g>
          <path d="M50 49.8 Q49.75 52.6 49.95 55.15" fill="none" stroke={s} strokeWidth="0.7" strokeLinecap="round" opacity="0.46" />
          <path d="M48.25 55.85 Q50 56.85 51.75 55.85" fill="none" stroke={s} strokeWidth="0.7" strokeLinecap="round" opacity="0.42" />
          <circle cx="48.45" cy="55.7" r="0.42" fill="rgba(0,0,0,0.16)" />
          <circle cx="51.55" cy="55.7" r="0.42" fill="rgba(0,0,0,0.16)" />
        </g>
      );
  }
}

// ── Bouche ultra-détaillée ────────────────────────────────────────────────
function Mouth({ expression, lipShape, lipColor, sp }) {
  const lc = lipColor || sp.lip;
  const lc2 = lipColor ? `${lipColor}cc` : `${sp.lip}aa`;
  const w = { thin: 0.8, medium: 1, full: 1.2, pouty: 1.1, wide: 1.35 }[lipShape] || 1;

  switch (expression) {
    case 'smile':
      return (
        <g>
          <path d={`M${43.8 - w * 1.5} 61.15 Q50 64.2 ${56.2 + w * 1.5} 61.15`} fill="none" stroke={lc} strokeWidth="1.55" strokeLinecap="round" />
          <path d={`M${45.6 - w * 0.9} 61.95 Q50 63.3 ${54.4 + w * 0.9} 61.95`} fill="none" stroke="rgba(255,255,255,0.27)" strokeWidth="0.62" strokeLinecap="round" />
        </g>
      );
    case 'laugh':
      return (
        <g>
          <path d={`M${40-w*2} 61 Q50 73 ${60+w*2} 61 Q50 68 ${40-w*2} 61 Z`} fill={lc} />
          <path d={`M${40-w*2} 61 Q50 67 ${60+w*2} 61 Q50 64 ${40-w*2} 61 Z`} fill="rgba(255,255,255,0.9)" />
          <path d={`M${40-w*2} 61 Q50 73 ${60+w*2} 61`} fill="none" stroke={lc} strokeWidth="1.2" />
          <path d={`M${42-w} 59.5 Q48 57 50 59 Q52 57 ${58+w} 59.5`} fill={lc} strokeWidth="0.6" />
          {/* Tongue hint */}
          <ellipse cx="50" cy="65.5" rx={3*w} ry="2" fill="#e06060" opacity={0.5} />
          {/* Cheeks */}
          <ellipse cx="35" cy="58" rx="7" ry="4" fill={sp.blush} opacity={0.35} />
          <ellipse cx="65" cy="58" rx="7" ry="4" fill={sp.blush} opacity={0.35} />
        </g>
      );
    case 'wink':
      return (
        <g>
          <path d={`M${43-w} 61 Q${46} 58.5 50 60 Q${54} 58.5 ${57+w} 61 Q${54} 63.5 50 63 Q${46} 63.5 ${43-w} 61 Z`} fill={lc} />
          <path d={`M${42-w} 61.5 Q50 66.5 ${58+w} 61.5 Q50 64 ${42-w} 61.5 Z`} fill={lc2} />
          <ellipse cx="50" cy="63.8" rx={3.5*w} ry="1" fill="rgba(255,255,255,0.18)" />
          <ellipse cx="36" cy="57" rx="6" ry="3.5" fill={sp.blush} opacity={0.3} />
        </g>
      );
    case 'smirk':
      return (
        <g>
          <path d="M45 61.2 Q50 63.5 57 60.8" fill="none" stroke={lc} strokeWidth="1.7" strokeLinecap="round" />
        </g>
      );
    case 'sad':
      return (
        <g>
          <path d={`M${43-w} 64 Q50 59 ${57+w} 64 Q${54} 66 50 65.5 Q${46} 66 ${43-w} 64 Z`} fill={lc} />
          <path d={`M${42-w} 64 Q50 69 ${58+w} 64`} fill="none" stroke={lc} strokeWidth="1" strokeLinecap="round" opacity={0.4} />
        </g>
      );
    case 'surprised':
      return (
        <g>
          <ellipse cx="50" cy="63" rx={4.5*w} ry={5.5} fill={lc} />
          <ellipse cx="50" cy="63" rx={3*w} ry="4" fill={lc2} />
          <ellipse cx="50" cy="60" rx={2.5*w} ry="1.8" fill="rgba(255,255,255,0.88)" />
        </g>
      );
    case 'cool':
      return (
        <g>
          <path d={`M${44-w} 61 Q50 64 ${56+w} 61 Q${53} 63.5 50 63.2 Q${47} 63.5 ${44-w} 61 Z`} fill={lc} />
          <path d={`M${43-w} 61 Q50 63.5 ${57+w} 61`} fill="none" stroke={lc} strokeWidth="1" strokeLinecap="round" />
        </g>
      );
    case 'curious':
      return (
        <g>
          <ellipse cx="50" cy="61.5" rx={2.8*w} ry="3.5" fill={lc} />
          <ellipse cx="50" cy="60" rx={2*w} ry="2.2" fill="rgba(255,255,255,0.85)" />
        </g>
      );
    default: // neutral
      return (
        <g>
          <path d={`M${45 - w} 62 Q50 62.8 ${55 + w} 62`} fill="none" stroke={lc2} strokeWidth="1.05" strokeLinecap="round" />
        </g>
      );
  }
}

// ── Cheveux ultra-détaillés ────────────────────────────────────────────────
function HairBack({ style, color, highlight }) {
  const c = color;
  const hi = highlight || color;
  switch (style) {
    case 'long_straight':
      return (
        <g>
          <path d="M16 40 Q18 28 50 24 Q82 28 84 40 L86 96 H14 Z" fill={c} />
          <path d="M16 40 Q18 28 50 24" fill="none" stroke={hi} strokeWidth="3" opacity={0.3} />
          <path d="M20 40 Q22 32 50 28 Q78 32 80 40 L82 96 H18 Z" fill={c} opacity={0.6} />
        </g>
      );
    case 'long_wavy':
      return (
        <g>
          <path d="M16 38 Q18 24 50 22 Q82 24 84 38 Q88 52 86 68 Q84 84 82 96 H18 Q16 84 14 68 Q12 52 16 38 Z" fill={c} />
          <path d="M16 45 Q22 38 18 54 Q14 68 18 80" fill="none" stroke={hi} strokeWidth="2.5" opacity={0.25} />
          <path d="M84 45 Q78 38 82 54 Q86 68 82 80" fill="none" stroke={hi} strokeWidth="2.5" opacity={0.25} />
        </g>
      );
    case 'long_curly':
      return (
        <g>
          <path d="M18 38 Q22 24 50 22 Q78 24 82 38 Q86 52 84 68 Q82 84 80 96 H20 Q18 84 16 68 Q14 52 18 38 Z" fill={c} />
          {[0,1,2,3].map(i => (
            <path key={i} d={`M${16+i*3} ${50+i*12} Q${12+i*2} ${58+i*12} ${18+i*2} ${66+i*12}`}
              fill="none" stroke={hi} strokeWidth="2" opacity={0.2} />
          ))}
          {[0,1,2,3].map(i => (
            <path key={i} d={`M${84-i*3} ${50+i*12} Q${88-i*2} ${58+i*12} ${82-i*2} ${66+i*12}`}
              fill="none" stroke={hi} strokeWidth="2" opacity={0.2} />
          ))}
        </g>
      );
    case 'afro':
      return (
        <g>
          <circle cx="50" cy="28" r="30" fill={c} />
          {[-20,-10,0,10,20].map((x,i) => (
            <circle key={i} cx={50+x} cy={28+Math.abs(x)*0.3} r={8-Math.abs(i)} fill={c} />
          ))}
          <circle cx="25" cy="36" r="14" fill={c} />
          <circle cx="75" cy="36" r="14" fill={c} />
          <circle cx="50" cy="18" r="12" fill={c} />
        </g>
      );
    case 'bun':
      return (
        <g>
          <path d="M28 36 Q30 26 50 24 Q70 26 72 36 L74 70 H26 Z" fill={c} />
          {/* Bun */}
          <circle cx="50" cy="16" r="13" fill={c} />
          <path d="M38 20 Q50 12 62 20" fill="none" stroke={hi} strokeWidth="2.5" opacity={0.25} />
          {/* Bun detail */}
          <circle cx="50" cy="16" r="13" fill="none" stroke={hi} strokeWidth="1.5" opacity={0.15} />
          <path d="M42 10 Q50 6 58 10 Q58 18 50 22 Q42 18 42 10 Z" fill={c} opacity={0.6} />
        </g>
      );
    case 'ponytail':
      return (
        <g>
          <path d="M28 34 Q30 24 50 22 Q70 24 72 34 L70 60 H30 Z" fill={c} />
          {/* Ponytail */}
          <path d="M42 28 Q36 42 38 60 Q40 74 42 82" fill="none" stroke={c} strokeWidth="10" strokeLinecap="round" />
          <path d="M42 28 Q37 44 39 62 Q41 74 43 82" fill="none" stroke={hi} strokeWidth="4" strokeLinecap="round" opacity={0.3} />
          {/* Elastic */}
          <ellipse cx="40" cy="32" rx="5" ry="2.5" fill="#333" opacity={0.7} />
        </g>
      );
    case 'braids':
      return (
        <g>
          <path d="M26 34 Q28 24 50 22 Q72 24 74 34 L72 52 H28 Z" fill={c} />
          {/* Left braid */}
          {[0,1,2,3,4,5].map(i => (
            <ellipse key={i} cx={22-i*0.5} cy={50+i*9} rx="4" ry="3.5" fill={i%2===0?c:hi} opacity={0.9} />
          ))}
          {/* Right braid */}
          {[0,1,2,3,4,5].map(i => (
            <ellipse key={i} cx={78+i*0.5} cy={50+i*9} rx="4" ry="3.5" fill={i%2===0?c:hi} opacity={0.9} />
          ))}
        </g>
      );
    case 'dreadlocks':
      return (
        <g>
          <path d="M22 34 Q26 22 50 20 Q74 22 78 34 L76 52 H24 Z" fill={c} />
          {[-20,-12,-4,4,12,20].map((x,i) => (
            <g key={i}>
              <rect x={50+x-3} y={48} width={6} height={28+i*3} rx="3" fill={c} opacity={0.88} />
              <rect x={50+x-1.5} y={50} width={3} height={28+i*3} rx="1.5" fill={hi} opacity={0.2} />
            </g>
          ))}
        </g>
      );
    case 'bob':
      return (
        <g>
          <path d="M24 38 Q28 24 50 22 Q72 24 76 38 Q78 51 73 62 Q67 70 50 70 Q33 70 27 62 Q22 51 24 38 Z" fill={c} />
          <path d="M27 41 Q32 33 50 31 Q68 33 73 41" fill="none" stroke={hi} strokeWidth="1.6" opacity={0.2} />
          {/* side locks to avoid helmet look */}
          <path d="M28 46 Q24 54 25 62 Q28 66 32 64 Q31 56 33 48 Z" fill={c} opacity={0.95} />
          <path d="M72 46 Q76 54 75 62 Q72 66 68 64 Q69 56 67 48 Z" fill={c} opacity={0.95} />
        </g>
      );
    case 'pixie':
      return (
        <path d="M28 36 Q30 24 50 22 Q70 24 72 36 Q74 46 72 54 Q66 60 50 60 Q34 60 28 54 Q26 46 28 36 Z" fill={c} />
      );
    case 'spiky':
      return (
        <g>
          <path d="M28 36 Q30 26 50 24 Q70 26 72 36 L70 54 H30 Z" fill={c} />
          {/* Spikes */}
          {[-16,-8,0,8,16].map((x,i) => (
            <path key={i} d={`M${50+x-4} 26 L${50+x} ${14-i*2} L${50+x+4} 26`} fill={c} />
          ))}
        </g>
      );
    case 'slick_back':
      return (
        <g>
          <path d="M24 36 Q26 22 50 20 Q74 22 76 36 Q80 50 76 66 H24 Q20 50 24 36 Z" fill={c} />
          <path d="M26 30 Q50 22 74 30" fill="none" stroke={hi} strokeWidth="2.5" opacity={0.3} />
          <path d="M28 34 Q50 26 72 34" fill="none" stroke={hi} strokeWidth="1.5" opacity={0.2} />
        </g>
      );
    case 'undercut':
      return (
        <g>
          <path d="M14 58 Q16 40 50 38 Q84 40 86 58 V96 H14 Z" fill="#1a1a1a" />
          <path d="M26 34 Q28 22 50 20 Q72 22 74 34 Q76 44 72 50 Q62 54 50 54 Q38 54 28 50 Q24 44 26 34 Z" fill={c} />
        </g>
      );
    case 'fade':
      return (
        <g>
          <path d="M14 56 Q16 40 50 38 Q84 40 86 56 V96 H14 Z" fill="#1a1a1a" />
          <path d="M14 56 Q16 44 50 42 Q84 44 86 56 V70 H14 Z" fill={c} opacity={0.4} />
          <path d="M28 36 Q30 24 50 22 Q70 24 72 36 Q74 46 70 52 Q60 56 50 56 Q40 56 30 52 Q26 46 28 36 Z" fill={c} />
        </g>
      );
    default: // medium / short
      return (
        <g>
          <path d="M26 35 Q30 21 50 19 Q70 21 74 35 Q77 47 73 61 H27 Q23 47 26 35 Z" fill={c} />
          <path d="M30 39 Q36 31 50 29 Q64 31 70 39" fill="none" stroke={hi} strokeWidth="1.4" opacity={0.16} />
        </g>
      );
  }
}

function HairFront({ style, color, highlight }) {
  const c = color;
  const hi = highlight || color;
  // Frange / détails avant selon style
  switch (style) {
    case 'long_straight':
      return (
        <g>
          <path d="M28 38 Q50 30 72 38" fill="none" stroke={hi} strokeWidth="2.5" strokeLinecap="round" opacity={0.25} />
          <path d="M30 36 Q50 28 70 36" fill={c} opacity={0.7} />
        </g>
      );
    case 'bob':
      return (
        // Avoid hard front band on forehead
        <g>
          <path d="M32 41 Q36 38 40 39" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" opacity={0.65} />
          <path d="M68 41 Q64 38 60 39" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" opacity={0.65} />
        </g>
      );
    case 'pixie':
      return (
        <g>
          <path d="M32 34 Q50 26 68 34 Q50 32 32 34 Z" fill={c} />
          <path d="M34 32 Q50 24 66 32" fill="none" stroke={hi} strokeWidth="2" opacity={0.25} />
        </g>
      );
    case 'spiky':
      return null;
    case 'afro': case 'dreadlocks': case 'bun':
      return null;
    default:
      return (
        // No center band on default hairstyle
        <g>
          <path d="M33 40 Q37 37 41 38" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" opacity={0.58} />
          <path d="M67 40 Q63 37 59 38" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" opacity={0.58} />
        </g>
      );
  }
}

// ── Pilosité faciale réaliste ──────────────────────────────────────────────
function FacialHair({ style, color }) {
  const c = color || '#2c1810';
  const lo = 0.82;
  switch (style) {
    case 'none': return null;
    case 'stubble':
      return (
        <g fill={c} opacity={0.22}>
          {Array.from({length:40}, (_,i) => {
            const x = 34 + (i%8)*4 + Math.sin(i*1.7)*1.5;
            const y = 60 + Math.floor(i/8)*3.5 + Math.cos(i*2.3)*1;
            return <circle key={i} cx={x} cy={y} r="0.9" />;
          })}
        </g>
      );
    case 'mustache':
      return (
        <g fill={c} opacity={lo}>
          <path d="M42 59.5 Q46 56.5 50 58.5 Q54 56.5 58 59.5 Q55 63 50 61.5 Q45 63 42 59.5 Z" />
          <path d="M43 58 Q46.5 55.5 50 57.5" fill="none" stroke={c} strokeWidth="1" opacity={0.4} />
          <path d="M57 58 Q53.5 55.5 50 57.5" fill="none" stroke={c} strokeWidth="1" opacity={0.4} />
        </g>
      );
    case 'goatee':
      return (
        <g fill={c} opacity={lo}>
          <path d="M42 59.5 Q46 56.5 50 58.5 Q54 56.5 58 59.5 Q55 63 50 61.5 Q45 63 42 59.5 Z" />
          <path d="M45 64 Q50 62 55 64 Q54 71 50 73 Q46 71 45 64 Z" />
        </g>
      );
    case 'beard_short':
      return (
        <g fill={c} opacity={lo}>
          <path d="M42 59.5 Q46 56.5 50 58.5 Q54 56.5 58 59.5 Q55 63 50 61.5 Q45 63 42 59.5 Z" />
          <path d="M30 54 Q28 62 30 70 Q38 78 50 78 Q62 78 70 70 Q72 62 70 54 Q62 61 50 61 Q38 61 30 54 Z" />
          <path d="M30 54 Q28 60 30 68" fill="none" stroke={c} strokeWidth="1.5" opacity={0.3} />
          <path d="M70 54 Q72 60 70 68" fill="none" stroke={c} strokeWidth="1.5" opacity={0.3} />
        </g>
      );
    case 'beard_full':
      return (
        <g fill={c} opacity={lo}>
          <path d="M40 58 Q44 55 50 57 Q56 55 60 58 Q57 63 50 61.5 Q43 63 40 58 Z" />
          <path d="M26 48 Q22 60 24 74 Q32 82 50 82 Q68 82 76 74 Q78 60 74 48 Q66 58 50 58 Q34 58 26 48 Z" />
          <path d="M26 48 Q22 56 24 66" fill="none" stroke={c} strokeWidth="2" opacity={0.25} />
          <path d="M74 48 Q78 56 76 66" fill="none" stroke={c} strokeWidth="2" opacity={0.25} />
        </g>
      );
    case 'viking':
      return (
        <g fill={c} opacity={lo}>
          <path d="M40 58 Q44 55 50 57 Q56 55 60 58 Q57 62 50 61 Q43 62 40 58 Z" />
          <path d="M24 46 Q20 62 24 80 Q32 86 50 86 Q68 86 76 80 Q80 62 76 46 Q68 56 50 56 Q32 56 24 46 Z" />
          {/* Viking plaits */}
          {[0,1,2,3,4].map(i => (
            <ellipse key={i} cx={26} cy={80+i*8} rx="5" ry="3.5" fill={i%2===0?c:color+'88'} />
          ))}
          {[0,1,2,3,4].map(i => (
            <ellipse key={i} cx={74} cy={80+i*8} rx="5" ry="3.5" fill={i%2===0?c:color+'88'} />
          ))}
        </g>
      );
    default: return null;
  }
}

// ── Détails peau ──────────────────────────────────────────────────────────
function SkinDetails({ style }) {
  switch (style) {
    case 'freckles':
      return (
        <g fill="#c2410c" opacity={0.32}>
          {[[38,49],[40,47],[42,50],[44,48],[46,51],[54,51],[56,48],[58,50],[60,47],[62,49],[48,45],[50,43.5],[52,45],[36,52],[64,52]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="0.9" />
          ))}
        </g>
      );
    case 'mole_left':
      return <circle cx="33" cy="56" r="1.5" fill="#5c3317" opacity={0.75} />;
    case 'mole_right':
      return <circle cx="67" cy="56" r="1.5" fill="#5c3317" opacity={0.75} />;
    case 'dimples':
      return (
        <g>
          <circle cx="34" cy="60" r="3" fill="rgba(0,0,0,0.08)" />
          <circle cx="66" cy="60" r="3" fill="rgba(0,0,0,0.08)" />
        </g>
      );
    case 'vitiligo':
      return (
        <g fill="rgba(255,255,255,0.45)" opacity={0.6}>
          <ellipse cx="38" cy="52" rx="4" ry="3" />
          <ellipse cx="62" cy="56" rx="3" ry="2.5" />
          <ellipse cx="44" cy="60" rx="2" ry="1.5" />
        </g>
      );
    default: return null;
  }
}

// ── Vêtements réalistes ───────────────────────────────────────────────────
function Clothes({ topStyle, topColor, bottomStyle, bottomColor, shoesColor, shoesStyle, pattern }) {
  // Bottom
  const bottom = (() => {
    switch (bottomStyle) {
      case 'shorts': return (
        <g>
          <rect x="24" y="66" width="52" height="14" rx="4" fill={bottomColor} />
          <line x1="50" y1="66" x2="50" y2="80" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
          <path d="M24 68 Q50 72 76 68" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </g>
      );
      case 'skirt': return (
        <path d="M28 66 L20 96 H80 L72 66 Z" fill={bottomColor} />
      );
      case 'leggings': return (
        <g>
          <path d="M26 66 L22 96 H42 L46 66 Z" fill={bottomColor} />
          <path d="M74 66 L78 96 H58 L54 66 Z" fill={bottomColor} />
          <rect x="24" y="62" width="52" height="8" rx="3" fill={bottomColor} />
          {/* Seam */}
          <line x1="36" y1="66" x2="34" y2="96" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
          <line x1="64" y1="66" x2="66" y2="96" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        </g>
      );
      default: // pants
        return (
          <g>
            <path d="M26 66 L22 96 H44 L48 66 Z" fill={bottomColor} />
            <path d="M74 66 L78 96 H56 L52 66 Z" fill={bottomColor} />
            <rect x="24" y="62" width="52" height="8" rx="3" fill={bottomColor} />
            {/* Crease */}
            <line x1="36" y1="68" x2="34" y2="96" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
            <line x1="64" y1="68" x2="66" y2="96" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
            {/* Belt */}
            <rect x="24" y="62" width="52" height="4" rx="2" fill="rgba(0,0,0,0.15)" />
            <rect x="47" y="62" width="6" height="4" rx="1" fill="rgba(200,180,120,0.6)" />
          </g>
        );
    }
  })();

  // Shoes
  const shoes = (() => {
    const sc = shoesColor || '#1a1a1a';
    switch (shoesStyle) {
      case 'heels': return (
        <g fill={sc}>
          <ellipse cx="32" cy="97" rx="10" ry="3" />
          <path d="M26 97 Q22 97 22 100 L24 100 Q24 98 28 98 Z" />
          <ellipse cx="68" cy="97" rx="10" ry="3" />
          <path d="M74 97 Q78 97 78 100 L76 100 Q76 98 72 98 Z" />
        </g>
      );
      case 'boots': return (
        <g fill={sc}>
          <rect x="22" y="88" width="20" height="12" rx="3" />
          <rect x="58" y="88" width="20" height="12" rx="3" />
          <path d="M22 92 Q32 90 42 92" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          <path d="M58 92 Q68 90 78 92" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        </g>
      );
      default: // sneakers
        return (
          <g>
            <ellipse cx="32" cy="97" rx="11" ry="4" fill={sc} />
            <ellipse cx="68" cy="97" rx="11" ry="4" fill={sc} />
            <ellipse cx="30" cy="96" rx="8" ry="2.5" fill="rgba(255,255,255,0.12)" />
            <ellipse cx="66" cy="96" rx="8" ry="2.5" fill="rgba(255,255,255,0.12)" />
            {/* Sole */}
            <path d="M21 98 Q32 101 43 98" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <path d="M57 98 Q68 101 79 98" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
          </g>
        );
    }
  })();

  // Top
  const top = (() => {
    switch (topStyle) {
      case 'hoodie': return (
        <g>
          <path d="M18 68 Q22 58 32 54 L36 48 H64 L68 54 Q78 58 82 68 V96 H18 Z" fill={topColor} />
          {/* Hood */}
          <path d="M36 48 Q38 44 50 42 Q62 44 64 48" fill={topColor} opacity={0.88} />
          {/* Pocket */}
          <path d="M38 76 Q50 78 62 76 Q62 88 50 88 Q38 88 38 76" fill="rgba(0,0,0,0.1)" />
          {/* Drawstrings */}
          <line x1="46" y1="48" x2="44" y2="60" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
          <line x1="54" y1="48" x2="56" y2="60" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
        </g>
      );
      case 'shirt': return (
        <g>
          <path d="M20 66 L28 56 Q34 52 40 56 Q44 58 50 58 Q56 58 60 56 Q66 52 72 56 L80 66 V96 H20 Z" fill={topColor} />
          {/* Collar */}
          <path d="M40 56 Q44 60 50 62 Q56 60 60 56 Q56 54 50 56 Q44 54 40 56 Z" fill="rgba(255,255,255,0.15)" />
          {/* Buttons */}
          {[68,74,80,86].map(y => <circle key={y} cx="50" cy={y} r="1" fill="rgba(255,255,255,0.25)" />)}
          {/* Pocket */}
          <rect x="32" y="68" width="12" height="10" rx="2" fill="rgba(0,0,0,0.08)" />
        </g>
      );
      case 'suit': return (
        <g>
          <path d="M16 68 L26 54 Q32 50 38 54 Q42 56 50 56 Q58 56 62 54 Q68 50 74 54 L84 68 V96 H16 Z" fill={topColor} />
          {/* White shirt */}
          <path d="M44 54 L50 60 L56 54 V96 H44 Z" fill="#f8fafc" />
          {/* Lapels */}
          <path d="M26 54 Q36 66 44 54" fill={topColor} opacity={0.9} />
          <path d="M74 54 Q64 66 56 54" fill={topColor} opacity={0.9} />
          {/* Tie */}
          <path d="M48 58 L46 72 L50 76 L54 72 L52 58 Q50 56 48 58 Z" fill="#dc2626" />
          <path d="M49 60 L47.5 70" fill="none" stroke="#991b1b" strokeWidth="0.5" />
          {/* Pocket square */}
          <path d="M28 60 L34 60 L34 65 Q31 63 28 65 Z" fill="#f8fafc" opacity={0.8} />
        </g>
      );
      case 'sweater': return (
        <g>
          <path d="M18 66 Q22 56 34 54 Q38 52 40 56 Q44 58 50 58 Q56 58 60 56 Q62 52 66 54 Q78 56 82 66 V96 H18 Z" fill={topColor} />
          {/* Knit texture */}
          {[68,74,80,86,92].map(y => (
            <path key={y} d={`M18 ${y} Q50 ${y+2} 82 ${y}`} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          ))}
          {/* Collar */}
          <path d="M38 56 Q50 62 62 56 Q56 52 50 54 Q44 52 38 56 Z" fill={topColor} opacity={0.85} />
        </g>
      );
      case 'crop_top': return (
        <rect x="26" y="66" width="48" height="12" rx="6" fill={topColor} />
      );
      case 'dress': return (
        <path d="M28 64 Q22 70 20 78 L18 96 H82 L80 78 Q78 70 72 64 Q62 62 50 62 Q38 62 28 64 Z" fill={topColor} />
      );
      default: // tee
        return (
          <g>
            <path d="M20 66 Q22 58 30 54 L36 50 H64 L70 54 Q78 58 80 66 V96 H20 Z" fill={topColor} />
            {/* Sleeves */}
            <path d="M20 66 L24 72 Q22 78 24 82 L30 82 L30 66" fill={topColor} opacity={0.85} />
            <path d="M80 66 L76 72 Q78 78 76 82 L70 82 L70 66" fill={topColor} opacity={0.85} />
            {/* Collar */}
            <path d="M36 50 Q40 54 50 56 Q60 54 64 50 Q58 47 50 48 Q42 47 36 50 Z" fill="rgba(0,0,0,0.1)" />
            {/* Seam highlight */}
            <line x1="50" y1="56" x2="50" y2="96" stroke="rgba(0,0,0,0.04)" strokeWidth="0.8" />
          </g>
        );
    }
  })();

  return <g>{bottom}{shoes}{top}</g>;
}

// ── Accessoires ────────────────────────────────────────────────────────────
function Accessory({ type, color, uid = 'a', idSuffix = '' }) {
  const c = color || '#374151';
  switch (type) {
    case 'glasses': return (
      <g stroke={c} strokeWidth="1.8" fill="none">
        <circle cx="40" cy="48" r="8" fill="rgba(200,230,255,0.12)" />
        <circle cx="60" cy="48" r="8" fill="rgba(200,230,255,0.12)" />
        <path d="M48 48 h4" />
        <path d="M32 47 Q28 46 26 48" strokeLinecap="round" />
        <path d="M68 47 Q72 46 74 48" strokeLinecap="round" />
        {/* Lens reflection */}
        <path d="M35 44 Q38 42 40 44" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <path d="M55 44 Q58 42 60 44" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      </g>
    );
    case 'round_glasses': return (
      <g stroke={c} strokeWidth="1.5" fill="none">
        <circle cx="40" cy="48" r="7" fill="rgba(180,230,255,0.1)" />
        <circle cx="60" cy="48" r="7" fill="rgba(180,230,255,0.1)" />
        <path d="M47 48 h6" />
        <path d="M33 47 h-5" strokeLinecap="round" />
        <path d="M67 47 h5" strokeLinecap="round" />
      </g>
    );
    case 'sunnies': return (
      <g>
        <rect x="30" y="43" width="18" height="10" rx="3" fill="#0f172a" opacity={0.92} />
        <rect x="52" y="43" width="18" height="10" rx="3" fill="#0f172a" opacity={0.92} />
        <rect x="48" y="45" width="4" height="6" fill="#0f172a" />
        <path d="M32 45 Q38 43 46 45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <path d="M54 45 Q60 43 68 45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      </g>
    );
    case 'cap': return (
      <g>
        <path d="M22 38 Q50 24 78 38 L74 44 Q50 36 26 44 Z" fill={c} />
        <rect x="22" y="37" width="56" height="9" rx="2" fill={c} />
        <path d="M22 37 Q50 32 78 37" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        {/* Bill */}
        <path d="M24 46 Q14 48 12 52 Q20 52 24 46" fill={c} opacity={0.9} />
      </g>
    );
    case 'beanie': return (
      <g>
        <ellipse cx="50" cy="30" rx="25" ry="15" fill={c} />
        <rect x="25" y="36" width="50" height="8" rx="2" fill={c} />
        <path d="M25 44 Q50 48 75 44" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        {/* Pom-pom */}
        <circle cx="50" cy="18" r="5" fill={c} opacity={0.9} />
        <circle cx="50" cy="17" r="3" fill="rgba(255,255,255,0.15)" />
      </g>
    );
    case 'headphones': return (
      <g>
        <path d="M20 44 Q20 26 50 24 Q80 26 80 44" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" />
        <rect x="12" y="40" width="13" height="20" rx="5" fill={c} />
        <rect x="75" y="40" width="13" height="20" rx="5" fill={c} />
        <rect x="14" y="43" width="9" height="14" rx="3" fill="rgba(0,0,0,0.2)" />
        <rect x="77" y="43" width="9" height="14" rx="3" fill="rgba(0,0,0,0.2)" />
      </g>
    );
    case 'crown': return (
      <g fill={c}>
        <path d="M24 38 L28 26 L38 34 L50 18 L62 34 L72 26 L76 38 Z" />
        <rect x="26" y="38" width="48" height="6" rx="1.5" />
        {/* Gems */}
        <circle cx="50" cy="28" r="2.5" fill="#ef4444" />
        <circle cx="37" cy="34" r="1.8" fill="#3b82f6" />
        <circle cx="63" cy="34" r="1.8" fill="#10b981" />
        {/* Gold highlight */}
        <path d="M28 36 Q50 32 72 36" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </g>
    );
    case 'earrings': return (
      <g fill={c}>
        <circle cx="21" cy="52" r="4" />
        <circle cx="79" cy="52" r="4" />
        <circle cx="21" cy="51" r="2" fill="rgba(255,255,255,0.3)" />
        <circle cx="79" cy="51" r="2" fill="rgba(255,255,255,0.3)" />
      </g>
    );
    case 'hoop_earrings': return (
      <g stroke={c} strokeWidth="2.2" fill="none">
        <circle cx="21" cy="55" r="5" />
        <circle cx="79" cy="55" r="5" />
      </g>
    );
    case 'necklace': return (
      <g>
        <path d="M34 72 Q50 80 66 72" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="50" cy="78" r="3.5" fill={c} />
        <circle cx="50" cy="78" r="2" fill="rgba(255,255,255,0.3)" />
      </g>
    );
    case 'chain_necklace': return (
      <g>
        <path d="M32 72 Q50 81 68 72" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
        <rect x="47" y="76" width="6" height="6" rx="1.5" fill={c} />
        <rect x="48.5" y="77.5" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.3)" />
      </g>
    );
    case 'mask': return (
      <g>
        <rect x="30" y="54" width="40" height="18" rx="6" fill="white" opacity={0.92} stroke={c} strokeWidth="0.8" />
        {[57,61,65].map(y => <line key={y} x1="32" y1={y} x2="68" y2={y} stroke={c} strokeWidth="0.5" opacity={0.3} />)}
        <path d="M32 56 Q50 54 68 56" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      </g>
    );
    case 'bandana': return (
      <g>
        <path d="M20 46 Q50 38 80 46 Q72 56 50 56 Q28 56 20 46 Z" fill={c} opacity={0.9} />
        <path d="M20 46 Q14 52 16 58 Q24 54 26 48 Z" fill={c} opacity={0.8} />
        <path d="M22 48 Q50 42 78 48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      </g>
    );
    case 'hijab': {
      const mid = `hijab-${uid}${idSuffix}`;
      return (
        <g>
          <defs>
            <mask id={`${mid}-mask`}>
              <rect width="100" height="100" fill="white" />
              <ellipse cx="50" cy="47" rx="21" ry="24" fill="black" />
            </mask>
          </defs>
          <path
            d="M18 38 Q26 24 50 22 Q74 24 82 38 Q88 52 84 72 Q78 92 62 100 H38 Q22 92 16 72 Q12 52 18 38 Z"
            fill={c}
            mask={`url(#${mid}-mask)`}
          />
          <path d="M18 38 Q26 24 50 22 Q74 24 82 38" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" />
        </g>
      );
    }
    default: return null;
  }
}

// ── Cou + épaules réalistes ───────────────────────────────────────────────
function Neck({ sp }) {
  return (
    <g>
      {/* Shadow under chin */}
      <ellipse cx="50" cy="69.4" rx="8.8" ry="2.3" fill={sp.shadow2} opacity={0.2} />
      {/* Neck */}
      <rect x="46.1" y="70.2" width="7.8" height="7.1" rx="2.8" fill={sp.base} />
      <rect x="47.1" y="70.2" width="1.1" height="7.1" fill="rgba(0,0,0,0.03)" />
      <rect x="50.3" y="70.2" width="0.7" height="7.1" fill="rgba(0,0,0,0.02)" />
      {/* Clavicle hint */}
      <path d="M42 78.7 Q50 80.1 58 78.7" fill="none" stroke={sp.shadow} strokeWidth="0.7" opacity={0.16} />
    </g>
  );
}

// ── Composant principal ────────────────────────────────────────────────────
export default function CharacterAvatar({ builder = {}, sizePx = 42, animated = false }) {
  const b = mergeCharacterBuilder(builder);
  const uid = useId().replace(/:/g, '');
  const sp = skinPalette(b.skin);

  const isHat = ['cap','beanie','headphones','crown'].includes(b.accessory);
  const hasHijab = b.accessory === 'hijab' || b.accessory2 === 'hijab';
  const hasBg = b.bgStyle !== 'none';

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 100 100"
      className="flex-shrink-0 rounded-full select-none"
      style={{ border: '1.5px solid rgba(255,255,255,0.12)' }}
      aria-hidden
    >
      <defs>
        {/* Background gradients */}
        <radialGradient id={`bg-${uid}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={b.bgColor || '#dbeafe'} stopOpacity="1" />
          <stop offset="100%" stopColor={b.bgColor ? b.bgColor+'88' : '#93c5fd'} stopOpacity="1" />
        </radialGradient>

        {/* Skin gradient */}
        <linearGradient id={`face-${uid}`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={sp.highlight} />
          <stop offset="45%" stopColor={sp.base} />
          <stop offset="100%" stopColor={sp.shadow} />
        </linearGradient>

        {/* Face depth */}
        <radialGradient id={`face-depth-${uid}`} cx="50%" cy="55%" r="52%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
        </radialGradient>

        {/* Drop shadow */}
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.35)" />
        </filter>

        {/* Bokeh blur for background */}
        <filter id={`bokeh-${uid}`}>
          <feGaussianBlur stdDeviation="2" />
        </filter>

        {/* Skin ambient occlusion */}
        <radialGradient id={`ao-${uid}`} cx="50%" cy="100%" r="55%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {animated && (
          <style>{`
            @keyframes av-bob-${uid} {
              0%,100% { transform: translateY(0) rotate(-0.5deg); }
              40%      { transform: translateY(-2px) rotate(0.4deg); }
              70%      { transform: translateY(0.8px) rotate(-0.2deg); }
            }
            .av-rig-${uid} {
              animation: av-bob-${uid} 2.4s ease-in-out infinite;
              transform-origin: 50px 55px;
            }
          `}</style>
        )}
      </defs>

      {/* ── Background ── */}
      {hasBg && (
        <g>
          <rect x="0" y="0" width="100" height="100" fill={`url(#bg-${uid})`} />
          {/* Bokeh circles */}
          {b.bgStyle === 'bokeh' && (
            <g opacity={0.4} filter={`url(#bokeh-${uid})`}>
              <circle cx="15" cy="20" r="8" fill={b.bgColor || '#93c5fd'} />
              <circle cx="80" cy="15" r="6" fill={b.bgColor || '#bfdbfe'} />
              <circle cx="85" cy="75" r="10" fill={b.bgColor || '#93c5fd'} />
              <circle cx="10" cy="80" r="7" fill={b.bgColor || '#bfdbfe'} />
            </g>
          )}
          {/* Ground shadow */}
          <ellipse cx="50" cy="98" rx="28" ry="4" fill="rgba(0,0,0,0.18)" />
        </g>
      )}

      <g className={animated ? `av-rig-${uid}` : undefined}>
        {/* ── Clothes ── */}
        <Clothes
          topStyle={b.topStyle} topColor={b.topColor}
          bottomStyle={b.bottomStyle} bottomColor={b.bottomColor}
          shoesColor={b.shoesColor} shoesStyle={b.shoesStyle}
          pattern={b.topPattern}
        />

        {/* ── Neck ── */}
        <Neck sp={sp} />

        {/* ── Hair (back layer) ── */}
        {!hasHijab && <HairBack style={b.hairStyle} color={b.hairColor} highlight={b.hairHighlight} />}

        {/* ── Face ── */}
        <FaceShape shape={b.faceShape} sp={sp} uid={uid} />
        {/* Ambient occlusion on face (very subtle for cleaner look) */}
        <ellipse cx="50" cy="50" rx="20" ry="23" fill={`url(#ao-${uid})`} opacity={0.3} />

        {/* ── Ears ── */}
        <ellipse cx="29.5" cy="50" rx="4" ry="5.5" fill={sp.base} />
        <ellipse cx="29.5" cy="50" rx="2.5" ry="3.8" fill={sp.shadow} opacity={0.35} />
        <ellipse cx="70.5" cy="50" rx="4" ry="5.5" fill={sp.base} />
        <ellipse cx="70.5" cy="50" rx="2.5" ry="3.8" fill={sp.shadow} opacity={0.35} />

        {/* ── Nose ── */}
        <Nose shape={b.noseShape} sp={sp} />

        {/* ── Brows ── */}
        <Brows expression={b.expression} browShape={b.browShape} hairColor={b.hairColor} uid={uid} />

        {/* ── Eyes ── */}
        <Eye cx={39} cy={46.2} eyeColor={b.eyeColor} shape={b.eyeShape} size={b.eyeSize}
             lash={b.lashStyle} expression={b.expression} isLeft={true} uid={uid} />
        <Eye cx={61} cy={46.2} eyeColor={b.eyeColor} shape={b.eyeShape} size={b.eyeSize}
             lash={b.lashStyle} expression={b.expression} isLeft={false} uid={uid} />

        {/* ── Cheeks ── */}
        {(b.blushIntensity || 0) > 0 && (
          <g>
            <ellipse cx="34" cy="55.5" rx="5.2" ry="3.1" fill={b.blushColor || sp.blush} opacity={(b.blushIntensity || 0.2) * 0.28} />
            <ellipse cx="66" cy="55.5" rx="5.2" ry="3.1" fill={b.blushColor || sp.blush} opacity={(b.blushIntensity || 0.2) * 0.28} />
          </g>
        )}

        {/* ── Mouth ── */}
        <Mouth expression={b.expression} lipShape={b.lipShape} lipColor={b.lipColor} sp={sp} />

        {/* ── Facial hair ── */}
        <FacialHair style={b.facialHair} color={b.facialHairColor} />

        {/* ── Skin details ── */}
        <SkinDetails style={b.skinDetails} />

        {/* ── Hair (front layer) ── */}
        {!hasHijab && <HairFront style={b.hairStyle} color={b.hairColor} highlight={b.hairHighlight} />}

        {/* ── Accessory (non-hat first) ── */}
        {!isHat && b.accessory !== 'none' && (
          <Accessory type={b.accessory} color={b.accessoryColor} uid={uid} idSuffix="" />
        )}
        {b.accessory2 && b.accessory2 !== 'none' && (
          <Accessory type={b.accessory2} color={b.accessoryColor} uid={uid} idSuffix="2" />
        )}

        {/* ── Hat accessories (on top) ── */}
        {isHat && <Accessory type={b.accessory} color={b.accessoryColor} uid={uid} idSuffix="" />}
      </g>
    </svg>
  );
}
