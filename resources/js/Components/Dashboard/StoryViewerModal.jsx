import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function getDurationMs(story) {
  if (!story) return 8000;
  if (!story.media_url) return 22000;
  if (story.media_url.match(/\.(mp4|webm|mov)$/i)) return null;
  return 8000;
}

function isVideo(story) {
  return Boolean(story?.media_url?.match(/\.(mp4|webm|mov)$/i));
}

function timeAgo(date) {
  const m = Math.floor((Date.now() - new Date(date)) / 60000);
  if (m < 1) return 'à l\'instant';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

function markViewed(storyId) {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
  fetch(`/stories/${storyId}/view`, {
    method: 'POST',
    headers: { 'X-CSRF-TOKEN': token, Accept: 'application/json' },
  }).catch(() => {});
}

function sendReact(storyId, emoji) {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
  fetch(`/stories/${storyId}/react`, {
    method: 'POST',
    headers: { 'X-CSRF-TOKEN': token, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ reaction: emoji }),
  }).catch(() => {});
}

export default function StoryViewerModal({ open, stories = [], initialIndex = 0, onClose }) {
  const { t } = useTranslation();
  const [snapshot, setSnapshot] = useState([]);
  const [idx, setIdx]           = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused]     = useState(false);
  const [reacted, setReacted]   = useState(null);

  const pausedRef    = useRef(false);
  const videoRef     = useRef(null);
  const timerRef     = useRef(null);
  const holdTimer    = useRef(null);
  const snapshotRef  = useRef([]);
  const idxRef       = useRef(0);
  const onCloseRef   = useRef(onClose);
  const touchStart   = useRef({ x: 0, y: 0 });
  const dragging     = useRef(false);
  const cardRef      = useRef(null);

  onCloseRef.current  = onClose;
  snapshotRef.current = snapshot;
  idxRef.current      = idx;

  const doPause  = useCallback(() => { pausedRef.current = true;  setPaused(true);  }, []);
  const doResume = useCallback(() => { pausedRef.current = false; setPaused(false); }, []);

  const goNext = useCallback(() => {
    clearInterval(timerRef.current);
    setProgress(0);
    pausedRef.current = false;
    setPaused(false);
    setReacted(null);
    setIdx((i) => {
      const snap = snapshotRef.current;
      if (i >= snap.length - 1) { onCloseRef.current(); return i; }
      return i + 1;
    });
  }, []);

  const goPrev = useCallback(() => {
    clearInterval(timerRef.current);
    setProgress(0);
    pausedRef.current = false;
    setPaused(false);
    setReacted(null);
    setIdx((i) => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    if (!open) return;
    const snap = [...stories];
    setSnapshot(snap);
    snapshotRef.current = snap;
    setIdx(initialIndex);
    idxRef.current = initialIndex;
    setProgress(0);
    setReacted(null);
    pausedRef.current = false;
    setPaused(false);
  }, [open, initialIndex, stories]);

  useEffect(() => {
    if (!open || !snapshot.length) return;
    const story = snapshot[idx];
    if (!story) return;
    markViewed(story.id);
    clearInterval(timerRef.current);
    setProgress(0);
    const dur = getDurationMs(story);
    if (dur === null) return;
    const STEP = 80;
    const inc  = (STEP / dur) * 100;
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setProgress((p) => {
        const next = p + inc;
        if (next >= 100) {
          clearInterval(timerRef.current);
          const snap = snapshotRef.current;
          const cur  = idxRef.current;
          if (cur >= snap.length - 1) { onCloseRef.current(); }
          else { setIdx(cur + 1); idxRef.current = cur + 1; }
          return 100;
        }
        return next;
      });
    }, STEP);
    return () => clearInterval(timerRef.current);
  }, [open, idx, snapshot]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else v.play().catch(() => {});
  }, [paused]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'Escape')     onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, goNext, goPrev]);

  // Swipe down to close — native listener for passive:false
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !open) return;
    const onStart = (e) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragging.current = false;
    };
    const onMove = (e) => {
      const dy = e.touches[0].clientY - touchStart.current.y;
      const dx = e.touches[0].clientX - touchStart.current.x;
      if (dy > 20 && Math.abs(dy) > Math.abs(dx)) {
        dragging.current = true;
        e.preventDefault();
        const pct = Math.min(dy / 200, 1);
        el.style.transform = `translateY(${dy * 0.4}px) scale(${1 - pct * 0.08})`;
        el.style.opacity = String(1 - pct * 0.4);
      }
    };
    const onEnd = (e) => {
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      el.style.transform = '';
      el.style.opacity = '';
      if (dragging.current) {
        dragging.current = false;
        if (dy > 80) { onCloseRef.current(); return; }
        return;
      }
      // Tap navigation
      clearTimeout(holdTimer.current);
      if (pausedRef.current) { doResume(); return; }
      if (Math.abs(dx) > 40) { dx < 0 ? goNext() : goPrev(); return; }
      const x = e.changedTouches[0].clientX;
      const w = el.getBoundingClientRect().width;
      x < w * 0.4 ? goPrev() : goNext();
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [open, goNext, goPrev, doResume]);

  if (!open || !snapshot.length) return null;
  const story = snapshot[idx];
  if (!story) return null;
  const showVideo = isVideo(story);

  const onMouseDown = () => { holdTimer.current = setTimeout(doPause, 300); };
  const onMouseUp   = () => { clearTimeout(holdTimer.current); if (paused) doResume(); };

  const handleReact = (emoji) => {
    sendReact(story.id, emoji);
    setReacted(emoji);
    setTimeout(() => setReacted(null), 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCloseRef.current(); }}
    >
      {/* Prev / Next arrows (desktop) */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 z-20"
        aria-label={t('pages.stories.prev', { defaultValue: 'Précédent' })}
      >‹</button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-2xl hover:bg-white/20 z-20"
        aria-label={t('pages.stories.next', { defaultValue: 'Suivant' })}
      >›</button>

      {/* Story card — full screen mobile, 9:16 centered on desktop */}
      <div
        ref={cardRef}
        className="relative h-full w-full overflow-hidden bg-black sm:rounded-2xl sm:h-auto sm:w-[22rem] sm:aspect-[9/16]"
        style={{ transition: 'transform 0.1s, opacity 0.1s', maxHeight: '100dvh' }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={(e) => {
          // Desktop tap navigation (no touch)
          if ('ontouchstart' in window) return;
          clearTimeout(holdTimer.current);
          if (paused) { doResume(); return; }
          const x = e.clientX;
          const w = e.currentTarget.getBoundingClientRect().width;
          x < w * 0.4 ? goPrev() : goNext();
        }}
      >
        {/* Progress bars — always overlaid inside card */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-[3px] px-3 pt-3">
          {snapshot.map((_, i) => (
            <div key={i} className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-none"
                style={{ width: `${i < idx ? 100 : i === idx ? progress : 0}%` }}
              />
            </div>
          ))}
        </div>

        {/* Header — always overlaid inside card */}
        <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-3 pt-1">
          <div className="flex items-center gap-2">
            {story.user?.avatar_url ? (
              <img src={story.user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/30" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                {(story.user?.name || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-white leading-none drop-shadow">{story.user?.name}</p>
              <p className="text-[10px] text-white/55 mt-0.5">{story.created_at ? timeAgo(story.created_at) : ''}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onCloseRef.current(); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white text-xl leading-none hover:bg-black/50"
            aria-label={t('pages.stories.close', { defaultValue: 'Fermer' })}
          >×</button>
        </div>

        {/* Media */}
        {!story.media_url && story.body ? (
          <div
            className="flex h-full min-h-[100dvh] w-full items-center justify-center p-8 text-center text-xl font-semibold leading-relaxed text-white sm:min-h-0"
            style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)' }}
          >
            {story.body}
          </div>
        ) : showVideo ? (
          <video
            key={story.id}
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full min-h-[100dvh] w-full object-cover sm:min-h-0 sm:h-full"
            onTimeUpdate={() => {
              const v = videoRef.current;
              if (!v || !v.duration || Number.isNaN(v.duration) || pausedRef.current) return;
              setProgress((v.currentTime / v.duration) * 100);
            }}
            onEnded={goNext}
          >
            <source src={story.media_url} />
          </video>
        ) : (
          <img
            src={story.media_url}
            alt=""
            className="h-full min-h-[100dvh] w-full object-cover sm:min-h-0 sm:h-full"
            draggable={false}
          />
        )}

        {/* Caption */}
        {story.media_url && story.body && (
          <div className="absolute bottom-16 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-8 text-sm text-white z-10">
            {story.body}
          </div>
        )}

        {/* Pause indicator */}
        {paused && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
            <div className="rounded-full bg-black/50 p-4">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Reaction pop */}
        {reacted && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center z-30"
            style={{ animation: 'storyReact 0.4s ease-out forwards' }}
          >
            <span style={{ fontSize: 72 }}>{reacted}</span>
          </div>
        )}

        {/* Bottom: reactions + views */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 pb-5 pt-2 z-20"
          style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.5),transparent)' }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="flex gap-3">
            {['❤️','🔥','👏','😍','😂'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={(e) => { e.stopPropagation(); handleReact(emoji); }}
                className="text-2xl transition-transform active:scale-125 hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
          <span className="text-xs text-white/50">{story.views_count ?? 0} vues</span>
        </div>
      </div>

      <style>{`
        @keyframes storyReact {
          0%   { opacity:0; transform:scale(0.3); }
          50%  { opacity:1; transform:scale(1.1); }
          100% { opacity:0; transform:scale(1.3); }
        }
      `}</style>
    </div>
  );
}
