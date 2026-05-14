// resources/js/Components/Dashboard/Avatar.jsx
import CharacterAvatar, { mergeCharacterBuilder } from './CharacterAvatar';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ── DiceBear avatar generation ──────────────────────────────────────────────
const BG_PALETTE = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffdfbf', 'ffd5dc', 'e8d5f5', 'c8f7e4'];

function generateDicebearDataUri(seed, extraOpts = {}) {
    try {
        const avatar = createAvatar(avataaars, {
            seed: String(seed || 'uniconnect').toLowerCase().trim(),
            backgroundColor: BG_PALETTE,
            backgroundType: ['gradientLinear', 'solid'],
            radius: 50,
            ...extraOpts,
        });
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(avatar.toString())}`;
    } catch {
        return null;
    }
}

function DicebearAvatar({ name, sizePx, className = '', extraOpts = {} }) {
    const uri = useMemo(() => generateDicebearDataUri(name, extraOpts), [name, JSON.stringify(extraOpts)]);
    if (!uri) return null;
    return (
        <img
            src={uri}
            alt=""
            width={sizePx}
            height={sizePx}
            className={`rounded-full object-cover select-none ${className}`}
            style={{ width: sizePx, height: sizePx }}
            draggable={false}
        />
    );
}

export default function Avatar({
    name,
    size = 'md',
    online = false,
    story = false,
    pulse = false,
    src = null,
    builder = null,
    previewOnHover = false,
    previewLabel = null,
    touchPreviewDismissMs = 2000,
}) {
    const [imgError, setImgError] = useState(false);
    const [hover, setHover] = useState(false);
    const wrapRef = useRef(null);
    const touchHideTimerRef = useRef(null);

    const clearTouchHideTimer = () => {
        if (touchHideTimerRef.current) {
            clearTimeout(touchHideTimerRef.current);
            touchHideTimerRef.current = null;
        }
    };

    const scheduleTouchHide = () => {
        clearTouchHideTimer();
        touchHideTimerRef.current = setTimeout(() => {
            setHover(false);
            touchHideTimerRef.current = null;
        }, touchPreviewDismissMs);
    };

    useEffect(() => () => clearTouchHideTimer(), []);
    const [tip, setTip] = useState({ top: 0, left: 0 });

    const px = { xs: 28, sm: 36, md: 42, lg: 58, xl: 84 }[size] || 42;
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const hue = name ? ((name.charCodeAt(0) * 47 + (name.charCodeAt(1) || 0) * 19) % 360) : 220;
    const hue2 = (hue + 60) % 360;
    const showImg = src && !imgError;

    // builder.type === 'dicebear' → user picked a DiceBear avatar from the grid
    // builder has other keys (faceShape, skin…) → legacy CharacterAvatar
    // builder is empty / null → automatic DiceBear from name
    const isDicebearPick = Boolean(builder && builder.type === 'dicebear' && builder.seed);
    const isLegacyCharacter = Boolean(
        builder && typeof builder === 'object' && Object.keys(builder).length > 0 && builder.type !== 'dicebear'
    );
    const mergedBuilder = isLegacyCharacter ? mergeCharacterBuilder(builder) : null;

    // Effective DiceBear seed: custom pick or fallback to name
    const dicebearSeed = isDicebearPick ? builder.seed : (name || 'uniconnect');

    // Extra DiceBear options stored in builder (skin, hair, etc.)
    const dicebearExtraOpts = isDicebearPick ? (() => {
        const { type, seed, ...rest } = builder;
        return rest;
    })() : {};

    useLayoutEffect(() => {
        if (!previewOnHover || !wrapRef.current) return;
        if (!hover) { setTip({ top: 0, left: 0 }); return; }
        const r = wrapRef.current.getBoundingClientRect();
        const left = r.left + r.width / 2;
        const top = r.bottom + 8;
        setTip({ top, left });
    }, [previewOnHover, hover, px]);

    // ── What to show inside the circle ─────────────────────────────────────
    const circleContent = (sizeVal) => {
        // 1. Real photo
        if (showImg) {
            return (
                <img
                    src={src}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    onError={() => setImgError(true)}
                />
            );
        }

        // 2. Legacy CharacterAvatar (old users who customized before)
        if (isLegacyCharacter) {
            if (previewOnHover) {
                return (
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center font-bold text-white select-none"
                        style={{
                            background: `linear-gradient(135deg,hsl(${hue},65%,45%),hsl(${hue2},60%,40%))`,
                            fontSize: sizeVal * 0.38,
                        }}
                    >
                        {initial}
                    </div>
                );
            }
            return <CharacterAvatar builder={mergedBuilder} sizePx={sizeVal} />;
        }

        // 3. DiceBear (chosen from picker or automatic from name)
        return <DicebearAvatar name={dicebearSeed} sizePx={sizeVal} className="w-full h-full" extraOpts={dicebearExtraOpts} />;
    };

    // ── Hover preview ───────────────────────────────────────────────────────
    // Always show the DiceBear avatar on hover (even when photo is main display).
    const previewSize = 120;
    const previewContent = isLegacyCharacter
        ? <CharacterAvatar builder={mergedBuilder} sizePx={previewSize} animated winkOnHover={hover} />
        : <DicebearAvatar name={dicebearSeed} sizePx={previewSize} extraOpts={dicebearExtraOpts} />;

    const hoverPortal =
        previewOnHover &&
        hover &&
        tip.top > 0 &&
        typeof document !== 'undefined' &&
        createPortal(
            <div
                className="pointer-events-none flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-2.5 shadow-2xl"
                style={{
                    position: 'fixed',
                    top: tip.top,
                    left: tip.left,
                    transform: 'translateX(-50%)',
                    zIndex: 99999,
                    background: 'var(--panel-bg, rgba(15,23,42,0.96))',
                    borderColor: 'var(--border, rgba(255,255,255,0.12))',
                    maxWidth: 200,
                }}
            >
                {previewContent}
                {previewLabel && (
                    <span
                        className="text-[11px] font-bold text-center truncate max-w-[180px]"
                        style={{ color: 'var(--text-1, #f0f4ff)' }}
                    >
                        {previewLabel}
                    </span>
                )}
            </div>,
            document.body,
        );

    const core = (
        <>
            {story ? (
                <div className="absolute inset-0 rounded-full story-ring p-[2px]">
                    <div
                        className="w-full h-full rounded-full p-[2px] flex items-center justify-center overflow-hidden"
                        style={{ background: 'var(--bg-deep)' }}
                    >
                        {circleContent(px - 4)}
                    </div>
                </div>
            ) : pulse ? (
                <div className="absolute inset-0 rounded-full pulse-ring">
                    <div className="absolute inset-0 rounded-full holo-ring p-[2px]">
                        <div
                            className="w-full h-full rounded-full p-[2px] flex items-center justify-center overflow-hidden"
                            style={{ background: 'var(--bg-deep)' }}
                        >
                            {circleContent(px - 4)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                    {circleContent(px)}
                </div>
            )}

            {online && (
                <span
                    className="absolute rounded-full border-2 d-glow"
                    style={{
                        width: px * 0.26,
                        height: px * 0.26,
                        background: '#76e4b0',
                        bottom: 0,
                        right: 0,
                        borderColor: 'var(--bg-deep)',
                    }}
                />
            )}
        </>
    );

    if (previewOnHover) {
        return (
            <>
                <div
                    ref={wrapRef}
                    className="relative inline-flex flex-shrink-0 touch-manipulation"
                    style={{ width: px, height: px, touchAction: 'manipulation' }}
                    onPointerEnter={(e) => {
                        if (e.pointerType === 'mouse') { clearTouchHideTimer(); setHover(true); }
                    }}
                    onPointerLeave={(e) => {
                        if (e.pointerType === 'mouse') { clearTouchHideTimer(); setHover(false); }
                    }}
                    onPointerDown={(e) => {
                        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                            clearTouchHideTimer(); setHover(true);
                        }
                    }}
                    onPointerUp={(e) => {
                        if (e.pointerType === 'touch' || e.pointerType === 'pen') scheduleTouchHide();
                    }}
                    onPointerCancel={() => { clearTouchHideTimer(); setHover(false); }}
                >
                    {core}
                </div>
                {hoverPortal}
            </>
        );
    }

    return (
        <div className="relative flex-shrink-0" style={{ width: px, height: px }}>
            {core}
        </div>
    );
}
