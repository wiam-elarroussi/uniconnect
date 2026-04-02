// resources/js/Components/Dashboard/Avatar.jsx
// Avec previewOnHover : la zone profil ne montre que la photo (ou initiales si pas de photo) —
// l’avatar vectoriel n’apparaît que dans l’aperçu au survol / toucher, puis disparaît.
import CharacterAvatar, { mergeCharacterBuilder } from './CharacterAvatar';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
    /** Après un tap tactile, l’aperçu reste visible encore ce délai (ms), puis se ferme. */
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
    const mergedBuilder = mergeCharacterBuilder(builder);

    useLayoutEffect(() => {
        if (!previewOnHover || !hover || !wrapRef.current) {
            return;
        }
        const r = wrapRef.current.getBoundingClientRect();
        setTip({
            top: r.bottom + 8,
            left: r.left + r.width / 2,
        });
    }, [previewOnHover, hover, px, showImg]);

    const inner = showImg ? (
        <img
            src={src}
            alt=""
            className="w-full h-full rounded-full object-cover"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onError={() => setImgError(true)}
        />
    ) : null;

    const vectorAvatar = (sizeVal) => <CharacterAvatar builder={mergedBuilder} sizePx={sizeVal} />;

    /** Sans photo : initiales dans le cercle (pas l’avatar vectoriel) lorsque previewOnHover */
    const initialsOnly = (sizeVal) => (
        <div
            className="w-full h-full rounded-full flex items-center justify-center font-bold text-white select-none"
            style={{
                background: `linear-gradient(135deg,hsl(${hue},65%,45%),hsl(${hue2},60%,40%))`,
                fontSize: sizeVal * 0.38,
                fontFamily: 'Syne, system-ui, sans-serif',
                border: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            {initial}
        </div>
    );

    /**
     * Contenu du cercle : jamais photo + avatar mélangés.
     * - previewOnHover + photo → uniquement la photo.
     * - previewOnHover + pas de photo → initiales (l’avatar vectoriel est dans l’aperçu).
     * - sinon → photo ou avatar vectoriel classique.
     */
    const circleContent = (sizeVal) => {
        if (showImg) {
            return inner;
        }
        if (previewOnHover) {
            return initialsOnly(sizeVal);
        }
        return vectorAvatar(sizeVal);
    };

    const previewSize = 112;

    const hoverPortal =
        previewOnHover &&
        hover &&
        typeof document !== 'undefined' &&
        createPortal(
            <div
                className="pointer-events-none fixed z-[9998] flex flex-col items-center gap-1 rounded-2xl border px-3 py-2 shadow-2xl"
                style={{
                    top: tip.top,
                    left: tip.left,
                    transform: 'translateX(-50%)',
                    background: 'var(--panel-bg, rgba(15,23,42,0.96))',
                    borderColor: 'var(--border, rgba(255,255,255,0.12))',
                    maxWidth: 200,
                }}
            >
                <CharacterAvatar
                    builder={mergedBuilder}
                    sizePx={previewSize}
                    animated
                    winkOnHover={hover}
                />
                {previewLabel && (
                    <span className="text-[11px] font-bold text-center truncate max-w-[180px]" style={{ color: 'var(--text-1, #f0f4ff)' }}>
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
                circleContent(px)
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
                        if (e.pointerType === 'mouse') {
                            clearTouchHideTimer();
                            setHover(true);
                        }
                    }}
                    onPointerLeave={(e) => {
                        if (e.pointerType === 'mouse') {
                            clearTouchHideTimer();
                            setHover(false);
                        }
                    }}
                    onPointerDown={(e) => {
                        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                            clearTouchHideTimer();
                            setHover(true);
                        }
                    }}
                    onPointerUp={(e) => {
                        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                            scheduleTouchHide();
                        }
                    }}
                    onPointerCancel={() => {
                        clearTouchHideTimer();
                        setHover(false);
                    }}
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
