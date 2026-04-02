import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const EMOJIS = [
  '😀', '😂', '🤣', '😍', '🥰', '😊', '👍', '👏', '🔥', '❤️', '✨', '🎉',
  '💡', '📎', '🎯', '🙏', '🤔', '💯', '⭐', '📚', '✅', '🎓', '📝', '☕',
];

/**
 * Panneau en portail pour ne pas être coupé par overflow:hidden du composer.
 */
export default function EmojiPicker({ onPick, children, placement = 'up' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelW = 220;
    const panelH = 200;
    let left = r.left;
    if (left + panelW > window.innerWidth - 8) {
      left = window.innerWidth - panelW - 8;
    }
    if (left < 8) left = 8;
    if (placement === 'up') {
      setCoords({ top: r.top - panelH - 6, left });
    } else {
      setCoords({ top: r.bottom + 6, left });
    }
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    updatePosition();
    const onWin = () => updatePosition();
    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, true);
    return () => {
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin, true);
    };
    // updatePosition lit triggerRef + placement — recalculer à chaque ouverture
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only open + placement
  }, [open, placement]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (rootRef.current?.contains(e.target)) return;
      const panel = document.getElementById('uniconnect-emoji-panel');
      if (panel?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const panel = open ? (
    <div
      id="uniconnect-emoji-panel"
      role="listbox"
      className="fixed z-[9999] p-2 rounded-xl grid grid-cols-6 gap-0.5 min-w-[200px] max-w-[220px] shadow-2xl"
      style={{
        top: coords.top,
        left: coords.left,
        background: 'var(--panel-bg, rgba(15,23,42,0.98))',
        border: '1px solid var(--border, rgba(255,255,255,0.12))',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className="w-8 h-8 text-lg leading-none rounded-lg hover:bg-white/10 flex items-center justify-center"
          onClick={() => {
            onPick(emoji);
            setOpen(false);
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="p-2 rounded-xl transition-all hover:bg-white/5"
        style={{ color: 'var(--text-3)' }}
        title="Emojis"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!open) updatePosition();
          setOpen((v) => !v);
        }}
      >
        {children}
      </button>
      {typeof document !== 'undefined' && panel ? createPortal(panel, document.body) : null}
    </div>
  );
}
