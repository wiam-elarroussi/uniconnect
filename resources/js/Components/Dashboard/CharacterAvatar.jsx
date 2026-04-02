/**
 * CharacterAvatar — Avatar vectoriel ultra-détaillé
 * Ordre des couches : vêtements → cou/ombre → cheveux (fond) → visage → nez → yeux/sourcils/bouche → pilosité → détails peau → frange → accessoires
 */
import { useId } from 'react';

const DEFAULTS = {
    preset: 'neutral',
    skin: '#e8b896',
    hair: '#2d1a0e',
    top: '#2563eb',
    bottom: '#1e293b',
    hairStyle: 'short',
    topStyle: 'tee',
    bottomStyle: 'pants',
    eyeColor: '#1a1a2e',
    eyeShape: 'round',
    accessory: 'none',
    accent: '#374151',
    expression: 'neutral',
    nose: 'button',
    facialHair: 'none',
    facialHairColor: '#2d1a0e',
    lipColor: '#b45309',
    skinDetails: 'none',
};

function mergeBuilder(builder) {
    return { ...DEFAULTS, ...(builder && typeof builder === 'object' ? builder : {}) };
}

/** Métriques du visage selon preset */
function faceMetrics(preset) {
    switch (preset) {
        case 'feminine':  return { rx: 20.5, ry: 21.5, eyeRx: 3.1, eyeRy: 3.6, browDy: -2 };
        case 'masculine': return { rx: 18.5, ry: 19.5, eyeRx: 2.7, eyeRy: 3.1, browDy: -1 };
        default:          return { rx: 19.5, ry: 20.5, eyeRx: 2.9, eyeRy: 3.4, browDy: -1.5 };
    }
}

// ── Cou + ombre ───────────────────────────────────────────────────────────
function NeckLayer({ skin }) {
    return (
        <g>
            <rect x="43" y="66" width="14" height="13" rx="3" fill={skin} />
            <ellipse cx="50" cy="69" rx="11" ry="3.5" fill="rgba(0,0,0,0.10)" />
        </g>
    );
}

// ── Cheveux (fond) ─────────────────────────────────────────────────────────
function HairBackLayer({ hair, style }) {
    const c = { fill: hair };
    switch (style) {
        case 'long':
            return (
                <g>
                    <path d="M18 38c2-14 12-22 32-22s30 8 32 22v52H18V38z" {...c} opacity={0.95} />
                    <path d="M20 52c6 28 14 40 30 44 16-4 24-16 30-44" {...c} />
                </g>
            );
        case 'curly':
            return (
                <g>
                    <path d="M24 30c-4 18 6 34 26 38 20-4 30-20 26-38-8-14-44-14-52 0z" {...c} />
                    <circle cx="32" cy="28" r="6" {...c} />
                    <circle cx="50" cy="22" r="7" {...c} />
                    <circle cx="68" cy="28" r="6" {...c} />
                    <circle cx="40" cy="20" r="5" {...c} />
                    <circle cx="60" cy="19" r="5" {...c} />
                </g>
            );
        case 'afro':
            return (
                <g>
                    <circle cx="50" cy="29" r="27" {...c} />
                    <circle cx="29" cy="37" r="16" {...c} />
                    <circle cx="71" cy="37" r="16" {...c} />
                    <circle cx="38" cy="21" r="14" {...c} />
                    <circle cx="62" cy="21" r="14" {...c} />
                    <circle cx="50" cy="18" r="13" {...c} />
                </g>
            );
        case 'bun':
            return (
                <g>
                    <path d="M26 34c4-14 12-20 24-20s20 6 24 20c12 2 18 12 18 26v8H8v-8c0-14 6-24 18-26z" {...c} />
                    <circle cx="50" cy="14" r="11" {...c} />
                </g>
            );
        case 'pigtails':
            return (
                <g>
                    <path d="M28 36c2-12 10-18 22-18s20 6 22 18v46H28V36z" {...c} />
                    <path d="M8 34c-4 16 2 32 14 42l8-6c-6-10-8-22-6-34" {...c} />
                    <path d="M92 34c4 16-2 32-14 42l-8-6c6-10 8-22 6-34" {...c} />
                </g>
            );
        case 'braids':
            return (
                <g>
                    <path d="M26 34c4-12 10-18 24-18s20 6 24 18v14H26V34z" {...c} />
                    <path d="M18 44c-2 8 0 18 3 28 1 4 3 8 4 12" fill="none" stroke={hair} strokeWidth="6" strokeLinecap="round"/>
                    <path d="M22 46c-1 8 0 16 2 24 1 4 3 8 4 12" fill="none" stroke={hair} strokeWidth="3.5" strokeLinecap="round" opacity={0.55}/>
                    <path d="M82 44c2 8 0 18-3 28-1 4-3 8-4 12" fill="none" stroke={hair} strokeWidth="6" strokeLinecap="round"/>
                    <path d="M78 46c1 8 0 16-2 24-1 4-3 8-4 12" fill="none" stroke={hair} strokeWidth="3.5" strokeLinecap="round" opacity={0.55}/>
                </g>
            );
        case 'dreadlocks':
            return (
                <g>
                    <path d="M22 34c4-12 10-18 28-18s24 6 28 18v14H22V34z" {...c} />
                    {[22, 31, 40, 49, 58, 67, 76].map((x, i) => (
                        <path key={i}
                            d={`M${x} 48 Q${x + (i % 2 === 0 ? -4 : 4)} ${64} ${x + (i % 2 === 0 ? -2 : 2)} ${76}`}
                            fill="none" stroke={hair} strokeWidth="5" strokeLinecap="round" />
                    ))}
                    {[26, 35, 44, 53, 62, 71].map((x, i) => (
                        <path key={`t${i}`}
                            d={`M${x} 49 Q${x + (i % 2 === 0 ? -2 : 2)} ${62} ${x} ${72}`}
                            fill="none" stroke={hair} strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
                    ))}
                </g>
            );
        case 'bob':
            return (
                <path d="M20 36c4-14 12-20 30-20s26 6 30 20v22c0 8-4 13-30 13s-30-5-30-13V36z" {...c} />
            );
        case 'spiky':
            return (
                <g>
                    <path d="M26 36 Q30 18 38 14 Q42 28 46 22 Q50 10 54 22 Q58 14 62 18 Q68 26 72 34 Q66 38 50 40 Q34 38 26 36z" {...c} />
                </g>
            );
        case 'ponytail':
            return (
                <g>
                    <path d="M28 34c4-12 10-18 22-18s18 6 22 18v12H28V34z" {...c} />
                    <path d="M44 30 Q36 42 38 58 Q40 70 42 78" fill="none" stroke={hair} strokeWidth="8" strokeLinecap="round"/>
                    <path d="M44 30 Q42 46 44 60 Q45 70 46 78" fill="none" stroke={hair} strokeWidth="5" strokeLinecap="round" opacity={0.65}/>
                </g>
            );
        case 'undercut':
        case 'fade':
            return (
                <g>
                    <path d="M14 58V40c0-16 12-28 36-28s36 12 36 28v18H14z" fill="#1a1a1a" opacity={0.92} />
                    <path d="M26 32c8-12 16-16 24-16s16 4 24 16c8 2 12 10 12 20v4H14v-4c0-10 4-18 12-20z" {...c} />
                </g>
            );
        case 'slick':
            return (
                <g>
                    <path d="M22 34c4-10 12-16 28-16s24 6 28 16c10 0 16 8 16 18v2H10v-2c0-10 6-18 16-18z" {...c} />
                    <path d="M30 32 Q50 22 70 32" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" opacity={0.85} />
                </g>
            );
        case 'waves':
            return (
                <g>
                    <path d="M22 34c8-10 18-14 28-14s20 4 28 14c6 12 6 24 0 36-8 10-18 14-28 14s-20-4-28-14c-6-12-6-24 0-36z" {...c} />
                    <path d="M26 42 Q36 36 46 42 T66 42 T86 42" fill="none" stroke={hair} strokeWidth="2.2" strokeLinecap="round" />
                </g>
            );
        case 'crew':
            return (
                <path d="M30 36c4-10 10-14 20-14s16 4 20 14c8 2 12 8 12 16v2H18v-2c0-8 4-14 12-16z" {...c} />
            );
        case 'short':
        default:
            return (
                <path d="M26 34c4-12 10-18 24-18s20 6 24 18c10 2 14 10 14 20v4H12v-4c0-10 4-18 14-20z" {...c} />
            );
    }
}

// ── Frange ────────────────────────────────────────────────────────────────
function HairBangLayer({ hair, style }) {
    const f = { fill: hair, opacity: 0.93 };
    switch (style) {
        case 'short':
        case 'crew':
            return <path d="M34 38 Q42 32 50 33 T66 38 Q58 36 50 35 Q42 36 34 38z" {...f} />;
        case 'curly':
            return <path d="M36 36 Q50 30 64 36 Q58 34 50 33 Q42 34 36 36z" {...f} />;
        case 'waves':
            return <path d="M32 37 Q50 28 68 37 Q50 33 32 37z" {...f} />;
        case 'bob':
            return <path d="M28 38 Q50 30 72 38 Q58 35 50 34 Q42 35 28 38z" {...f} />;
        case 'ponytail':
            return <path d="M32 36 Q50 30 68 36 Q58 33 50 32 Q42 33 32 36z" {...f} />;
        case 'long':
            return <path d="M30 36 Q50 28 70 36 Q60 33 50 32 Q40 33 30 36z" {...f} />;
        default:
            return null;
    }
}

// ── Vêtements bas ─────────────────────────────────────────────────────────
function BottomLayer({ bottom, style }) {
    switch (style) {
        case 'skirt':
            return <path d="M26 68 L36 96h28l10-28z" fill={bottom} />;
        case 'skirt_long':
            return (
                <g fill={bottom}>
                    <path d="M24 68 L20 100h60l-4-32z" />
                    <rect x="24" y="63" width="52" height="8" rx="2" opacity={0.8} />
                </g>
            );
        case 'shorts':
            return (
                <g fill={bottom}>
                    <path d="M24 68h22v22H24z" />
                    <path d="M54 68h22v22H54z" />
                    <rect x="24" y="64" width="52" height="8" rx="2" />
                </g>
            );
        case 'leggings':
            return (
                <g fill={bottom}>
                    <path d="M26 68v28h14V68z" />
                    <path d="M60 68v28h14V68z" />
                    <rect x="24" y="63" width="52" height="8" rx="3" />
                </g>
            );
        case 'pants':
        default:
            return (
                <g fill={bottom}>
                    <path d="M26 68v28h16V68z" />
                    <path d="M58 68v28h16V68z" />
                    <rect x="24" y="64" width="52" height="10" rx="3" />
                </g>
            );
    }
}

// ── Vêtements haut ────────────────────────────────────────────────────────
function TopLayer({ top, style }) {
    switch (style) {
        case 'hoodie':
            return (
                <g>
                    <path d="M20 66c0-4 4-8 10-10l6-8h28l6 8c6 2 10 6 10 10v28H20V66z" fill={top} />
                    <ellipse cx="50" cy="58" rx="16" ry="7" fill={top} opacity={0.88} />
                    <path d="M40 58 Q50 64 60 58" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                </g>
            );
        case 'shirt':
            return (
                <g>
                    <path d="M22 64 L30 56h40l8 8v32H22V64z" fill={top} />
                    <path d="M42 56 L50 66 L58 56" fill="none" stroke="#fff" strokeWidth="1.2" opacity={0.45} />
                    <line x1="50" y1="66" x2="50" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </g>
            );
        case 'jacket':
            return (
                <g>
                    <path d="M18 62 L26 54h48l8 8v36H18V62z" fill={top} />
                    <path d="M34 54 L50 68 L66 54" fill="none" stroke="#000" strokeWidth="0.8" opacity={0.18} />
                    <rect x="48" y="64" width="4" height="16" rx="1" fill="#000" opacity={0.12} />
                </g>
            );
        case 'suit':
            return (
                <g>
                    <path d="M16 62 L26 52h48l10 10v38H16V62z" fill={top} />
                    <path d="M44 52 L50 62 L56 52 L54 100h-8z" fill="#f8fafc" opacity={0.92} />
                    <path d="M49 60 L47 72 L50 76 L53 72 L51 60Z" fill="#dc2626" />
                    <path d="M26 52 L38 70 L50 63z" fill={top} opacity={0.82} />
                    <path d="M74 52 L62 70 L50 63z" fill={top} opacity={0.82} />
                </g>
            );
        case 'sweater':
            return (
                <g>
                    <path d="M20 64 L28 56 Q34 53 40 56 Q44 58 50 58 Q56 58 60 56 Q66 53 72 56 L80 64v32H20z" fill={top} />
                    <path d="M38 56 Q50 63 62 56" fill="none" stroke={top} strokeWidth="5" strokeLinecap="round" />
                    <path d="M20 72 h60 M20 78 h60 M20 84 h60" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1.2" />
                </g>
            );
        case 'crop_top':
            return <rect x="24" y="64" width="52" height="14" rx="8" fill={top} />;
        case 'dress':
            return <path d="M30 62 L24 96h52l-6-34 Q50 58 30 62z" fill={top} />;
        case 'tee':
        default:
            return <rect x="22" y="64" width="56" height="26" rx="9" fill={top} />;
    }
}

// ── Nez ──────────────────────────────────────────────────────────────────
function NoseLayer({ style }) {
    const s = 'rgba(0,0,0,0.14)';
    switch (style) {
        case 'none':
            return null;
        case 'small':
            return (
                <path d="M48.5 53.5 Q50 56 51.5 53.5" fill="none" stroke={s} strokeWidth="1.1" strokeLinecap="round" />
            );
        case 'wide':
            return (
                <g opacity={0.85}>
                    <path d="M45 54.5 Q50 58 55 54.5" fill="none" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
                    <ellipse cx="45.5" cy="55.8" rx="2.4" ry="1.4" fill={s} />
                    <ellipse cx="54.5" cy="55.8" rx="2.4" ry="1.4" fill={s} />
                </g>
            );
        case 'pointy':
            return (
                <g opacity={0.7}>
                    <path d="M50 50 L47.5 56 Q50 58 52.5 56 Z" fill={s} />
                    <path d="M49.5 51 Q50 54.5 50.5 51" fill="none" stroke={s} strokeWidth="0.7" />
                </g>
            );
        case 'upturned':
            return (
                <g opacity={0.75}>
                    <path d="M47 56 Q50 53 53 56" fill="none" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
                    <ellipse cx="47.8" cy="55.5" rx="1.5" ry="1" fill={s} />
                    <ellipse cx="52.2" cy="55.5" rx="1.5" ry="1" fill={s} />
                </g>
            );
        case 'button':
        default:
            return (
                <g opacity={0.75}>
                    <ellipse cx="47.5" cy="55.5" rx="1.8" ry="1.1" fill={s} />
                    <ellipse cx="52.5" cy="55.5" rx="1.8" ry="1.1" fill={s} />
                    <path d="M47.5 54.5 Q50 57 52.5 54.5" fill="none" stroke={s} strokeWidth="0.9" strokeLinecap="round" />
                </g>
            );
    }
}

// ── Pilosité faciale ──────────────────────────────────────────────────────
function FacialHairLayer({ style, color }) {
    const c = color || '#2d1a0e';
    switch (style) {
        case 'stubble':
            return (
                <g fill={c} opacity={0.3}>
                    {[
                        [38,62],[40,60],[42,61],[44,62],[46,61],[48,63],[50,62],[52,63],[54,62],[56,61],[58,62],[60,60],[62,62],
                        [39,64],[41,63],[43,64],[45,63],[47,65],[49,65],[51,65],[53,65],[55,63],[57,64],[59,63],[61,64],
                        [36,60],[37,58],[63,60],[64,58],[35,62],[65,62],
                    ].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="0.85" />)}
                </g>
            );
        case 'mustache':
            return (
                <path d="M43 59 Q47 57 50 59 Q53 57 57 59 Q54 63 50 61 Q46 63 43 59Z"
                    fill={c} opacity={0.92} />
            );
        case 'thin_mustache':
            return (
                <path d="M44 59.5 Q47 57.5 50 59 Q53 57.5 56 59.5 Q53 62 50 60.5 Q47 62 44 59.5Z"
                    fill={c} opacity={0.85} />
            );
        case 'goatee':
            return (
                <g fill={c} opacity={0.9}>
                    <path d="M44 59 Q47 57.5 50 59 Q53 57.5 56 59 Q54 62 50 60.5 Q46 62 44 59Z" />
                    <path d="M45 63 Q50 61.5 55 63 Q54 69.5 50 71 Q46 69.5 45 63Z" />
                </g>
            );
        case 'beard_short':
            return (
                <g fill={c} opacity={0.82}>
                    <path d="M43 59 Q47 57 50 59 Q53 57 57 59 Q54 63 50 61 Q46 63 43 59Z" />
                    <path d="M30 56 Q26 63 28 72 Q38 77 50 77 Q62 77 72 72 Q74 63 70 56 Q62 62 50 62 Q38 62 30 56Z" />
                </g>
            );
        case 'beard_full':
            return (
                <g fill={c} opacity={0.88}>
                    <path d="M42 58 Q46 55 50 58 Q54 55 58 58 Q55 63 50 61 Q45 63 42 58Z" />
                    <path d="M28 50 Q22 60 24 72 Q34 80 50 80 Q66 80 76 72 Q78 60 72 50 Q64 57 50 57 Q36 57 28 50Z" />
                    <path d="M28 44 Q24 52 28 58 Q32 53 34 48Z" />
                    <path d="M72 44 Q76 52 72 58 Q68 53 66 48Z" />
                </g>
            );
        case 'viking':
            return (
                <g fill={c} opacity={0.88}>
                    <path d="M42 58 Q46 55 50 58 Q54 55 58 58 Q55 63 50 61 Q45 63 42 58Z" />
                    <path d="M26 48 Q22 62 26 78 Q36 84 50 84 Q64 84 74 78 Q78 62 74 48 Q66 56 50 56 Q34 56 26 48Z" />
                    {/* Viking braids */}
                    <path d="M28 72 Q22 82 24 96" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" opacity={0.9}/>
                    <path d="M72 72 Q78 82 76 96" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" opacity={0.9}/>
                </g>
            );
        case 'none':
        default:
            return null;
    }
}

// ── Détails de la peau ───────────────────────────────────────────────────
function SkinDetailsLayer({ style }) {
    switch (style) {
        case 'freckles':
            return (
                <g fill="#c2410c" opacity={0.3}>
                    {[
                        [38,50],[40,48],[42,51],[44,49],[46,52],
                        [54,52],[56,49],[58,51],[60,48],[62,50],
                        [48,46],[50,44.5],[52,46],
                    ].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="0.95" />)}
                </g>
            );
        case 'mole_left':
            return <circle cx="34" cy="55" r="1.4" fill="#6b3a1f" opacity={0.72} />;
        case 'mole_right':
            return <circle cx="66" cy="55" r="1.4" fill="#6b3a1f" opacity={0.72} />;
        case 'freckles_mole':
            return (
                <g>
                    <g fill="#c2410c" opacity={0.3}>
                        {[
                            [38,50],[40,48],[42,51],[44,49],[46,52],
                            [54,52],[56,49],[58,51],[60,48],[62,50],
                        ].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="0.95" />)}
                    </g>
                    <circle cx="34" cy="55" r="1.4" fill="#6b3a1f" opacity={0.72} />
                </g>
            );
        case 'dimples':
            return (
                <g opacity={0.2} fill="rgba(0,0,0,0.2)">
                    <circle cx="35" cy="58" r="2.5" />
                    <circle cx="65" cy="58" r="2.5" />
                </g>
            );
        case 'none':
        default:
            return null;
    }
}

// ── Accessoires ───────────────────────────────────────────────────────────
function AccessoryLayer({ accessory, accent }) {
    switch (accessory) {
        case 'glasses':
            return (
                <g stroke={accent} strokeWidth="1.8" fill="none">
                    <circle cx="40" cy="48" r="7.5" fill="rgba(255,255,255,0.22)" />
                    <circle cx="60" cy="48" r="7.5" fill="rgba(255,255,255,0.22)" />
                    <path d="M47.5 48h5" />
                    <path d="M33 48h-4" strokeLinecap="round" />
                    <path d="M67 48h4" strokeLinecap="round" />
                </g>
            );
        case 'round_glasses':
            return (
                <g stroke={accent} strokeWidth="1.5" fill="none">
                    <circle cx="40" cy="48" r="6.5" fill="rgba(180,230,255,0.18)" />
                    <circle cx="60" cy="48" r="6.5" fill="rgba(180,230,255,0.18)" />
                    <path d="M46.5 48h7" />
                    <path d="M33.5 48h-3" strokeLinecap="round" />
                    <path d="M66.5 48h3" strokeLinecap="round" />
                </g>
            );
        case 'sunnies':
            return (
                <g>
                    <rect x="30" y="44" width="18" height="9" rx="2" fill="#0f172a" opacity={0.88} />
                    <rect x="52" y="44" width="18" height="9" rx="2" fill="#0f172a" opacity={0.88} />
                    <rect x="48" y="46" width="4" height="5" fill="#0f172a" />
                </g>
            );
        case 'cap':
            return (
                <g>
                    <path d="M24 36 Q50 20 76 36 L74 40 Q50 30 26 40z" fill={accent} />
                    <rect x="22" y="38" width="56" height="7" rx="2" fill={accent} />
                </g>
            );
        case 'beanie':
            return (
                <g>
                    <ellipse cx="50" cy="34" rx="24" ry="13" fill={accent} />
                    <rect x="26" y="34" width="48" height="9" rx="2" fill={accent} />
                    <path d="M26 43 h48" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                </g>
            );
        case 'earrings':
            return (
                <g fill={accent}>
                    <circle cx="22" cy="52" r="3.5" />
                    <circle cx="78" cy="52" r="3.5" />
                </g>
            );
        case 'hoop_earrings':
            return (
                <g stroke={accent} strokeWidth="2" fill="none">
                    <circle cx="22" cy="54" r="4" />
                    <circle cx="78" cy="54" r="4" />
                </g>
            );
        case 'headphones':
            return (
                <g>
                    <path d="M20 44 Q20 28 50 26 Q80 28 80 44"
                        fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
                    <rect x="12" y="42" width="12" height="18" rx="4" fill={accent} />
                    <rect x="76" y="42" width="12" height="18" rx="4" fill={accent} />
                </g>
            );
        case 'scarf':
            return <path d="M20 62 Q50 70 80 62v6Q50 76 20 68z" fill={accent} opacity={0.92} />;
        case 'necklace':
            return (
                <g>
                    <path d="M36 72 Q50 79 64 72" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" />
                    <circle cx="50" cy="77" r="2.8" fill={accent} />
                </g>
            );
        case 'chain_necklace':
            return (
                <g>
                    <path d="M34 72 Q50 80 66 72" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
                    <rect x="47.5" y="75" width="5" height="5" rx="1" fill={accent} />
                </g>
            );
        case 'nose_piercing':
            return (
                <circle cx="50" cy="57" r="1.6" fill={accent} stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
            );
        case 'brow_piercing':
            return (
                <g fill={accent}>
                    <rect x="35" y="42" width="1.5" height="5" rx="0.75" />
                    <circle cx="35.75" cy="42" r="1.3" />
                    <circle cx="35.75" cy="47" r="1.3" />
                </g>
            );
        case 'crown':
            return (
                <g fill={accent}>
                    <path d="M26 34 L30 24 L38 32 L50 18 L62 32 L70 24 L74 34 Z" opacity={0.95} />
                    <rect x="28" y="34" width="44" height="6" rx="1.5" />
                    <circle cx="50" cy="28" r="2" fill="rgba(255,255,255,0.6)" />
                </g>
            );
        case 'mask':
            return (
                <g>
                    <rect x="32" y="55" width="36" height="16" rx="5" fill="rgba(255,255,255,0.85)" stroke={accent} strokeWidth="1" />
                    <path d="M34 59 h32 M34 63 h32 M34 67 h32" stroke={accent} strokeWidth="0.6" opacity={0.3} />
                </g>
            );
        case 'bandana':
            return (
                <g>
                    <path d="M22 48 Q50 42 78 48 Q70 56 50 56 Q30 56 22 48Z" fill={accent} opacity={0.88} />
                    <path d="M22 48 Q18 54 20 58 Q28 54 30 50" fill={accent} opacity={0.75} />
                </g>
            );
        case 'none':
        default:
            return null;
    }
}

// ── Expression / yeux / bouche ─────────────────────────────────────────────
function ExpressionFace({ expression, eyeColor, eyeShape, fm, winkLeft, lipColor }) {
    const yb = 44 + fm.browDy;
    const browThick = fm.rx < 19 ? 1.3 : 0.95;
    const lc = lipColor || '#b45309';

    const brows = (
        <g stroke="#3d2914" strokeWidth={browThick} fill="none" strokeLinecap="round" opacity={0.78}>
            <path d={`M${34 - fm.rx * 0.1} ${yb} Q${40} ${yb - 2.5} ${44} ${yb + 0.5}`}
                style={expression === 'sad' ? { transform: 'rotate(8deg)', transformOrigin: '39px 44px' } : {}} />
            <path d={`M${56} ${yb + 0.5} Q${60} ${yb - 2.5} ${66 + fm.rx * 0.1} ${yb}`}
                style={expression === 'sad' ? { transform: 'rotate(-8deg)', transformOrigin: '61px 44px' } : {}} />
        </g>
    );

    function drawEye(cx, isLeft) {
        if ((expression === 'wink' && isLeft) || (winkLeft && isLeft)) {
            return (
                <path d={`M${cx - 4} 48 Q${cx} 46 ${cx + 4} 48`}
                    stroke={eyeColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            );
        }
        switch (eyeShape) {
            case 'almond':
                return (
                    <g>
                        <path d={`M${cx - fm.eyeRx - 1} 48 Q${cx} ${48 - fm.eyeRy - 1} ${cx + fm.eyeRx + 1} 48 Q${cx} ${48 + fm.eyeRy * 0.55} ${cx - fm.eyeRx - 1} 48Z`}
                            fill={eyeColor} />
                        <circle cx={cx + 0.8} cy={47.2} r="1.1" fill="#fff" opacity={0.65} />
                        <circle cx={cx - 0.5} cy={47.8} r="0.5" fill="#fff" opacity={0.3} />
                    </g>
                );
            case 'hooded':
                return (
                    <g>
                        <ellipse cx={cx} cy="48" rx={fm.eyeRx} ry={fm.eyeRy} fill={eyeColor} />
                        <path d={`M${cx - fm.eyeRx - 1.5} 47 Q${cx} ${47 - fm.eyeRy * 0.7} ${cx + fm.eyeRx + 1.5} 47`}
                            fill="rgba(0,0,0,0.11)" />
                        <circle cx={cx + 0.8} cy={47.5} r="1.0" fill="#fff" opacity={0.6} />
                    </g>
                );
            case 'narrow':
                return (
                    <g>
                        <ellipse cx={cx} cy="48" rx={fm.eyeRx + 1} ry={fm.eyeRy * 0.65} fill={eyeColor} />
                        <circle cx={cx + 0.8} cy={47.5} r="0.9" fill="#fff" opacity={0.6} />
                    </g>
                );
            case 'round':
            default:
                return (
                    <g>
                        <ellipse cx={cx} cy="48" rx={fm.eyeRx} ry={fm.eyeRy} fill={eyeColor} />
                        <circle cx={cx + 0.8} cy={47.2} r="1.1" fill="#fff" opacity={0.65} />
                        <circle cx={cx - 0.5} cy={47.9} r="0.5" fill="#fff" opacity={0.3} />
                    </g>
                );
        }
    }

    let mouth;
    switch (expression) {
        case 'smile':
            mouth = (
                <g>
                    <path d="M40 58 Q50 66 60 58" fill="none" stroke={lc} strokeWidth="2" strokeLinecap="round" />
                    <path d="M42 58 Q50 65 58 58 Q50 63 42 58Z" fill={lc} opacity={0.4} />
                </g>
            );
            break;
        case 'laugh':
            mouth = (
                <g>
                    <path d="M42 57 Q50 68 58 57 Q50 64 42 57" fill={lc} opacity={0.6} stroke={lc} strokeWidth="1.2" />
                    <path d="M42 57 Q50 60 58 57" fill="none" stroke={lc} strokeWidth="1.4" />
                    <path d="M42 57 Q50 68 58 57" fill="#fecaca" opacity={0.25} />
                </g>
            );
            break;
        case 'curious':
            mouth = <ellipse cx="50" cy="58.5" rx="3.2" ry="3.8" fill={lc} opacity={0.5} />;
            break;
        case 'wink':
            mouth = (
                <g>
                    <path d="M42 58 Q50 63 58 58" fill="none" stroke={lc} strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M44 58 Q50 62 56 58 Q50 61 44 58Z" fill={lc} opacity={0.35} />
                </g>
            );
            break;
        case 'sad':
            mouth = (
                <g>
                    <path d="M42 62 Q50 57 58 62" fill="none" stroke={lc} strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M43 62 Q50 58 57 62 Q50 60 43 62Z" fill={lc} opacity={0.25} />
                </g>
            );
            break;
        case 'surprised':
            mouth = (
                <g>
                    <ellipse cx="50" cy="60" rx="5.5" ry="6.5" fill={lc} opacity={0.55} />
                    <ellipse cx="50" cy="60" rx="3.5" ry="4.5" fill="#fecaca" opacity={0.25} />
                </g>
            );
            break;
        case 'smirk':
            mouth = (
                <g>
                    <path d="M43 59.5 Q48 58 57 62.5" fill="none" stroke={lc} strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M45 59.5 Q50 58.5 55 61.5 Q50 61 45 59.5Z" fill={lc} opacity={0.35} />
                </g>
            );
            break;
        case 'cool':
            mouth = (
                <g>
                    <path d="M43 59 Q50 63 57 59" fill="none" stroke={lc} strokeWidth="1.6" strokeLinecap="round" />
                </g>
            );
            break;
        default: // neutral
            mouth = (
                <g>
                    <path d="M43 58 Q50 60.5 57 58" fill="none" stroke={lc} strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M44 58 Q50 60 56 58 Q50 59.5 44 58Z" fill={lc} opacity={0.22} />
                </g>
            );
    }

    const blush = (expression === 'smile' || expression === 'laugh' || expression === 'wink') ? (
        <g opacity={0.28}>
            <ellipse cx="32" cy="54.5" rx="5.5" ry="3" fill="#f472b6" />
            <ellipse cx="68" cy="54.5" rx="5.5" ry="3" fill="#f472b6" />
        </g>
    ) : null;

    return (
        <g>
            {brows}
            <g>
                {drawEye(40, true)}
                {drawEye(60, false)}
            </g>
            {blush}
            {mouth}
        </g>
    );
}

// ── Composant principal ───────────────────────────────────────────────────
export default function CharacterAvatar({ builder = {}, sizePx = 42, animated = false, winkOnHover = false }) {
    const b = mergeBuilder(builder);
    const {
        skin, hair, top, bottom,
        hairStyle, topStyle, bottomStyle,
        eyeColor, eyeShape, accessory, accent, expression, preset,
        nose, facialHair, facialHairColor, lipColor, skinDetails,
    } = b;
    const gid = useId().replace(/:/g, '');
    const fm = faceMetrics(preset);
    const hatLike = accessory === 'cap' || accessory === 'beanie' || accessory === 'headphones' || accessory === 'crown';

    return (
        <svg
            width={sizePx}
            height={sizePx}
            viewBox="0 0 100 100"
            className="flex-shrink-0 rounded-full"
            style={{
                border: '1px solid rgba(255, 255, 255, 0.14)',
                background: 'linear-gradient(160deg, rgba(30,41,59,0.35), rgba(15,23,42,0.5))',
            }}
            aria-hidden
        >
            {animated && (
                <style>{`
                  @keyframes bob-${gid} {
                    0%, 100% { transform: translateY(0) rotate(-0.8deg); }
                    35%       { transform: translateY(-2.5px) rotate(0.6deg); }
                    70%       { transform: translateY(1px) rotate(-0.4deg); }
                  }
                  .avatar-rig-${gid} {
                    animation: bob-${gid} 2.2s ease-in-out infinite;
                    transform-origin: 50px 56px;
                  }
                `}</style>
            )}

            <defs>
                <linearGradient id={`skin-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor={skin} stopOpacity={1}    />
                    <stop offset="55%"  stopColor={skin} stopOpacity={0.98} />
                    <stop offset="100%" stopColor={skin} stopOpacity={0.88} />
                </linearGradient>
                <linearGradient id={`cheek-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor={skin}     stopOpacity={0}    />
                    <stop offset="100%" stopColor="#c2410c"  stopOpacity={0.12} />
                </linearGradient>
                <radialGradient id={`face-depth-${gid}`} cx="50%" cy="60%" r="50%">
                    <stop offset="65%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
                </radialGradient>
            </defs>

            <circle cx="50" cy="50" r="48" fill="rgba(15,23,42,0.2)" />

            <g className={animated ? `avatar-rig-${gid}` : undefined}>
                {/* Layer 1: Vêtements */}
                <BottomLayer bottom={bottom} style={bottomStyle} />
                <TopLayer    top={top}    style={topStyle} />

                {/* Layer 2: Cou */}
                <NeckLayer skin={skin} />

                {/* Layer 3: Cheveux fond */}
                <HairBackLayer hair={hair} style={hairStyle} />

                {/* Layer 4: Visage */}
                <ellipse cx="50" cy="48" rx={fm.rx} ry={fm.ry} fill={`url(#skin-${gid})`} />
                <ellipse cx="50" cy="48" rx={fm.rx} ry={fm.ry} fill={`url(#face-depth-${gid})`} />
                <ellipse cx="50" cy="52" rx={fm.rx - 2} ry={fm.ry - 4} fill={`url(#cheek-${gid})`} />

                {/* Layer 5: Nez */}
                <NoseLayer style={nose} />

                {/* Layer 6: Yeux + sourcils + bouche */}
                <ExpressionFace
                    expression={expression}
                    eyeColor={eyeColor}
                    eyeShape={eyeShape}
                    fm={fm}
                    winkLeft={winkOnHover && expression !== 'wink'}
                    lipColor={lipColor}
                />

                {/* Layer 7: Pilosité faciale */}
                <FacialHairLayer style={facialHair} color={facialHairColor} />

                {/* Layer 8: Détails de la peau */}
                <SkinDetailsLayer style={skinDetails} />

                {/* Layer 9: Frange */}
                <HairBangLayer hair={hair} style={hairStyle} />

                {/* Layer 10: Accessoires */}
                {hatLike && <AccessoryLayer accessory={accessory} accent={accent} />}
                {!hatLike && accessory !== 'none' && (
                    <AccessoryLayer accessory={accessory} accent={accent} />
                )}
            </g>
        </svg>
    );
}

export { DEFAULTS as CHARACTER_AVATAR_DEFAULTS, mergeBuilder as mergeCharacterBuilder };
