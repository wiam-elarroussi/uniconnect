// resources/js/Components/Dashboard/PostCard.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link, router } from '@inertiajs/react';
import Avatar from './Avatar';
import EmojiPicker from './EmojiPicker';
import { Ic } from './Icons';

/** Mémorisé côté client : survit au remontage des composants après la réponse Inertia (ex. retour de post comment). */
const COMMENTS_MODAL_KEY = 'uniconnect.dashboard.commentsModalPostId';

function getStoredCommentsModalPostId() {
  if (typeof window === 'undefined') return null;
  try {
    const v = sessionStorage.getItem(COMMENTS_MODAL_KEY);
    if (v == null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function setStoredCommentsModalPostId(id) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(COMMENTS_MODAL_KEY, String(id));
}

function clearStoredCommentsModalPostId() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(COMMENTS_MODAL_KEY);
}

function detectTag(text, tagMap) {
  if (!text) return null;
  const low = text.toLowerCase();
  if (low.includes('question') || low.includes('سؤال') || text.startsWith('💡')) return tagMap.question;
  if (low.includes('ressource') || low.includes('resource') || low.includes('مورد') || text.startsWith('📎')) return tagMap.ressource;
  if (low.includes('projet') || low.includes('project') || low.includes('مشروع') || text.startsWith('🎯')) return tagMap.projet;
  return null;
}

export default function PostCard({ p, auth, university, onDelete }) {
  const { t, i18n } = useTranslation();
  const tagMap = useMemo(() => ({
    question:  { label: t('dashboard.postCard.tagQuestion'),  cls: 'tag-question' },
    ressource: { label: t('dashboard.postCard.tagResource'), cls: 'tag-resource' },
    projet:    { label: t('dashboard.postCard.tagProject'),    cls: 'tag-project' },
  }), [t]);

  const timeAgo = (date) => {
    const m = Math.floor((Date.now() - new Date(date)) / 60000);
    if (m < 1) return t('dashboard.postCard.justNow');
    if (m < 60) return t('dashboard.postCard.minShort', { n: m });
    const h = Math.floor(m / 60);
    if (h < 24) return t('dashboard.postCard.hourShort', { n: h });
    const locale = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'en' ? 'en-US' : 'fr-FR';
    return new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  };

  const numLocale = i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const mediaItems = useMemo(() => {
    if (Array.isArray(p.media) && p.media.length > 0) {
      return p.media.map((m) => ({
        url: m.url,
        is_video: Boolean(m.is_video),
      }));
    }
    if (p.media_url) {
      return [
        {
          url: p.media_url,
          is_video: /(\.mp4|\.webm|\.mov)(\?|#|$)/i.test(String(p.media_url)),
        },
      ];
    }
    return [];
  }, [p.media, p.media_url, p.id]);
  /** Ordre exact : textes et médias comme des blocs équivalents (cf. `post_items` / `content_slides`). */
  // Sépare les slides texte des slides média pour un affichage Instagram-like
  const carouselSlides = useMemo(() => {
    if (Array.isArray(p.content_slides) && p.content_slides.length > 0) {
      const s = [];
      let mediaIndex = 0;
      for (const sl of p.content_slides) {
        if (sl.type === 'text') {
          s.push({ kind: 'text', body: sl.body ?? '' });
        } else if (sl.type === 'media') {
          s.push({
            kind: 'media',
            item: { url: sl.url, is_video: Boolean(sl.is_video) },
            mediaIndex: mediaIndex++,
          });
        }
      }
      return s;
    }
    const s = [];
    if (p.body?.trim()) {
      s.push({ kind: 'text', body: p.body });
    }
    for (let i = 0; i < mediaItems.length; i++) {
      s.push({ kind: 'media', item: mediaItems[i], mediaIndex: i });
    }
    return s;
  }, [p.content_slides, p.body, p.id, mediaItems]);

  // Slides média uniquement pour le carousel visuel
  const mediaSlides = useMemo(() => carouselSlides.filter(s => s.kind === 'media'), [carouselSlides]);
  // Corps texte affiché en caption en dessous de l'image
  const textBody = useMemo(() => {
    const first = carouselSlides.find(s => s.kind === 'text');
    return first?.body ?? p.body ?? '';
  }, [carouselSlides, p.body]);
  const hasMedia = mediaSlides.length > 0;
  const numMediaSlides = mediaSlides.length;

  const mainFrameClass = 'relative w-full overflow-hidden bg-black/5';
  const [slideIndex, setSlideIndex] = useState(0);
  const videoEls = useRef(/** @type {(HTMLVideoElement|null)[]} */ ([]));
  const carouselRef = useRef(null);
  const swipeState = useRef({ startX: 0, startY: 0 });
  const [doubleTapTimer, setDoubleTapTimer] = useState(null);
  const [showMenu, setMenu] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [cmtText, setCT]      = useState('');
  const [liked, setLiked]     = useState(!!p.liked_by_me);
  const [saved, setSaved]     = useState(!!p.saved_by_me);
  const [likes, setLikes]     = useState(p.likes_count ?? 0);
  const [likeAnim, setLA]     = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [likersOpen, setLikersOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null); // { id, username }
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const cmtInputRef = useRef(null);
  const isOwn = p.user_id === auth.user.id;
  const [likersPreview, setLikersPreview] = useState(() => p.likers_preview ?? []);
  const tag   = detectTag(p.body, tagMap);

  const comments = p.comments ?? [];
  const shareUrl = `${window.location.origin}${window.location.pathname}#post-${p.id}`;

  const goPrev = () => {
    if (numMediaSlides < 2) return;
    setSlideIndex((i) => (i - 1 + numMediaSlides) % numMediaSlides);
  };
  const goNext = () => {
    if (numMediaSlides < 2) return;
    setSlideIndex((i) => (i + 1) % numMediaSlides);
  };

  // Double-tap to like (Instagram style)
  const handleImageTap = () => {
    if (doubleTapTimer) {
      clearTimeout(doubleTapTimer);
      setDoubleTapTimer(null);
      if (!liked) handleLike();
    } else {
      const t = setTimeout(() => setDoubleTapTimer(null), 280);
      setDoubleTapTimer(t);
    }
  };

  useEffect(() => {
    setSlideIndex(0);
  }, [p.id]);

  useEffect(() => {
    if (numMediaSlides === 0) return;
    const current = mediaSlides[slideIndex];
    videoEls.current.forEach((el, mediaIndex) => {
      if (!el) return;
      const isActive = current?.mediaIndex === mediaIndex && current.item.is_video;
      if (isActive) {
        el.muted = true;
        const pl = el.play();
        if (pl && typeof pl.then === 'function') pl.catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    });
  }, [slideIndex, numMediaSlides, mediaSlides, p.id]);

  useEffect(() => {
    if (slideIndex >= numMediaSlides && numMediaSlides > 0) setSlideIndex(0);
  }, [numMediaSlides, slideIndex, p.id]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || numMediaSlides < 2) return;
    const n = numMediaSlides;

    // Touch swipe (mobile)
    const onStart = (e) => {
      swipeState.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
    };
    const onEnd = (e) => {
      const dx = e.changedTouches[0].clientX - swipeState.current.startX;
      const dy = e.changedTouches[0].clientY - swipeState.current.startY;
      if (Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 48) return;
      setSlideIndex((prev) => (dx < 0 ? (prev + 1) % n : (prev - 1 + n) % n));
    };

    // Mouse wheel / trackpad (desktop): horizontal swipe → carousel, vertical → page scroll
    let wheelCooldown = false;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical → let page scroll
      e.preventDefault();
      if (wheelCooldown) return;
      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, 380);
      setSlideIndex((prev) => (e.deltaX > 0 ? (prev + 1) % n : (prev - 1 + n) % n));
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('wheel', onWheel);
    };
  }, [numMediaSlides]);

  const setCommentsOpenPersist = (open) => {
    setCommentsOpen(open);
    if (!open) {
      setReplyTo(null);
      setExpandedReplies(new Set());
    }
    if (typeof window === 'undefined') return;
    if (open) {
      setStoredCommentsModalPostId(p.id);
    } else {
      if (getStoredCommentsModalPostId() === p.id) {
        clearStoredCommentsModalPostId();
      }
    }
  };

  useLayoutEffect(() => {
    if (getStoredCommentsModalPostId() === p.id) {
      setCommentsOpen(true);
    } else {
      setCommentsOpen(false);
    }
  }, [p.id]);

  /** Sync des props Inertia (navigation) — j'aime / sauvegarde passent par axios pour la réactivité. */
  useEffect(() => {
    setLiked(!!p.liked_by_me);
    setLikes(p.likes_count ?? 0);
    setSaved(!!p.saved_by_me);
    setLikersPreview(p.likers_preview ?? []);
  }, [p.id, p.liked_by_me, p.likes_count, p.saved_by_me]);

  const handleLike = () => {
    const revert = { liked, likes, likers: likersPreview.slice() };
    setLiked((prev) => {
      const next = !prev;
      setLikes((count) => (next ? count + 1 : Math.max(0, count - 1)));
      if (next) {
        setLA(true);
        setTimeout(() => setLA(false), 350);
      }
      return next;
    });
    axios
      .post(route('posts.likes.toggle', p.id), {})
      .then((res) => {
        const d = res.data;
        setLiked(!!d.liked_by_me);
        setLikes(d.likes_count ?? 0);
        setLikersPreview(d.likers_preview ?? []);
      })
      .catch(() => {
        setLiked(revert.liked);
        setLikes(revert.likes);
        setLikersPreview(revert.likers);
      });
  };

  const handleSave = () => {
    const prevSaved = saved;
    setSaved((s) => !s);
    axios
      .post(route('posts.saves.toggle', p.id), {})
      .then((res) => {
        setSaved(!!res.data.saved_by_me);
      })
      .catch(() => {
        setSaved(prevSaved);
      });
  };

  const addCmt = (e) => {
    e.preventDefault();
    if (!cmtText.trim()) return;
    const payload = { body: cmtText };
    if (replyTo) payload.parent_id = replyTo.id;

    router.post(
      route('posts.comments.store', p.id),
      payload,
      {
        preserveScroll: true,
        onSuccess: () => {
          setCT('');
          setReplyTo(null);
          setCommentsOpenPersist(true);
        },
      }
    );
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const startReply = (commentId, username) => {
    setReplyTo({ id: commentId, username });
    setTimeout(() => cmtInputRef.current?.focus(), 50);
  };

  useEffect(() => {
    if (!commentsOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setCommentsOpenPersist(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [commentsOpen]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: t('dashboard.postCard.shareTitle'), url: shareUrl });
      } else {
        // Desktop fallback: open our share menu
        setShareOpen(v => !v);
      }
    } catch (e) {
      // user cancelled share or denied clipboard: ignore
    }
  };

  const copyShareLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 1200);
      } else {
        prompt(t('dashboard.postCard.promptCopy'), shareUrl);
      }
    } finally {
      setShareOpen(false);
    }
  };

  return (
    <article
      id={`post-${p.id}`}
      className="relative mx-auto w-full bg-transparent"
      style={{ borderBottom: '1px solid var(--border)' }}
    >

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={route('users.show', p.user_id)} className="shrink-0" aria-label={t('dashboard.postCard.profileAria', { name: p.user?.name ?? '' })}>
            <Avatar
              name={p.user?.name}
              size="md"
              src={p.user?.avatar_url}
              builder={p.user?.avatar_builder}
              online={false}
              previewOnHover
              previewLabel={p.user?.name}
            />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={route('users.show', p.user_id)} className="font-display font-bold text-sm truncate hover:underline" style={{color:'var(--text-1)'}}>
                {p.user?.name}
              </Link>
              {p.channel?.name && (p.channel?.id || p.channel_id) && (
                <Link
                  href={route('channels.show', p.channel?.id ?? p.channel_id)}
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full truncate max-w-[10rem] hover:opacity-90"
                  style={{ background: 'rgba(183,148,244,0.12)', color: 'var(--accent-2)', border: '1px solid rgba(183,148,244,0.25)' }}
                  title={t('dashboard.postCard.openChannelFeed')}
                >
                  {p.channel.name}
                </Link>
              )}
              {isOwn && (
                <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{background:'rgba(99,179,237,0.1)',color:'var(--accent-1)',border:'1px solid rgba(99,179,237,0.2)'}}>
                  {t('dashboard.postCard.you')}
                </span>
              )}
              {/* Verified dot */}
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{background:'rgba(99,179,237,0.2)'}}>
                <svg viewBox="0 0 10 10" className="w-2 h-2"><path d="M2 5L4 7L8 3" stroke="#63b3ed" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span style={{color:'var(--text-3)'}} className="text-[10px]">{timeAgo(p.created_at)}</span>
              <span style={{color:'var(--text-3)'}} className="text-[10px]">·</span>
              <span style={{color:'var(--text-3)'}} className="text-[10px] flex items-center gap-0.5"><Ic.Globe /> {university}</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button onClick={() => setMenu(v=>!v)}
            className="p-2 rounded-xl transition-all hover:bg-white/5" style={{color:'var(--text-3)'}}>
            <Ic.Dots />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 z-30 rounded-2xl py-2 w-48 overflow-hidden"
                 style={{background:'var(--panel-bg)',border:'1px solid var(--border)',backdropFilter:'blur(20px)',boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
              {isOwn && (
                <button onClick={() => { setMenu(false); onDelete(p.id); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
                  style={{color:'#fc8181'}}>
                  <Ic.Trash /> {t('dashboard.postCard.delete')}
                </button>
              )}
              <button onClick={() => { setMenu(false); handleSave(); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
                style={{color:'var(--text-1)'}}>
                {saved ? <Ic.BookOn /> : <Ic.BookOff />} {saved ? t('dashboard.postCard.unsave') : t('dashboard.postCard.save')}
              </button>
              <button onClick={() => { setMenu(false); handleShare(); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
                style={{color:'var(--text-1)'}}>
                <Ic.Share /> {t('dashboard.postCard.share')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Tag ── */}
      {tag && !hasMedia && (
        <div className="px-4 pb-2">
          <span className={`inline-flex items-center text-[10px] font-bold px-3 py-1 rounded-full ${tag.cls}`}>
            {tag.label}
          </span>
        </div>
      )}

      {/* ── TEXT-ONLY post (no media) : affichage en carte ── */}
      {!hasMedia && textBody && (
        <div className="mx-4 mb-3 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(160deg,rgba(99,179,237,0.07) 0%,rgba(183,148,244,0.05) 100%)', border: '1px solid var(--border)' }}>
          <p className="whitespace-pre-wrap break-words px-5 py-5 text-[15px] leading-relaxed"
            style={{ color: 'var(--text-1)' }}>
            {textBody}
          </p>
        </div>
      )}

      {/* ── MÉDIA : carousel bord-à-bord, ratio naturel ── */}
      {hasMedia && (
        <div
          ref={carouselRef}
          className={mainFrameClass}
          onClick={handleImageTap}
          role="group"
          tabIndex={0}
          onKeyDown={(e) => {
            if (numMediaSlides < 2) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
          }}
          aria-label={t('dashboard.postCard.carouselSlide', { current: slideIndex + 1, total: numMediaSlides })}
          style={{ cursor: 'default', touchAction: 'pan-y' }}
        >
          {/* Counter badge top-right for multiple images */}
          {numMediaSlides > 1 && (
            <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: '#fff' }}>
              {slideIndex + 1} / {numMediaSlides}
            </div>
          )}

          {/* Tag badge overlay for media posts */}
          {tag && (
            <div className="absolute top-3 left-3 z-20">
              <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full ${tag.cls}`}>
                {tag.label}
              </span>
            </div>
          )}

          {mediaSlides.map((slide, i) => (
            <div
              key={`${p.id}-media-${slide.mediaIndex}`}
              className={i === slideIndex ? 'block' : 'hidden'}
              aria-hidden={i !== slideIndex}
            >
              {slide.item.is_video ? (
                <video
                  className="w-full max-h-[75vh] object-contain bg-black"
                  style={{ display: 'block' }}
                  controls
                  playsInline
                  muted
                  preload="metadata"
                  ref={(el) => { videoEls.current[slide.mediaIndex] = el; }}
                >
                  <source src={slide.item.url} />
                </video>
              ) : (
                <img
                  src={slide.item.url}
                  alt={i === 0 ? t('dashboard.postCard.mediaAlt') : ''}
                  className="w-full max-h-[75vh] object-contain"
                  style={{ display: 'block', background: 'var(--bg-card)' }}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              )}
            </div>
          ))}

          {/* Navigation arrows */}
          {numMediaSlides > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                aria-label={t('dashboard.postCard.carouselPrev')}
              >
                <Ic.ChevronLeft />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                aria-label={t('dashboard.postCard.carouselNext')}
              >
                <Ic.ChevronRight />
              </button>
              {/* Dots */}
              <div className="pointer-events-auto absolute bottom-2.5 left-0 right-0 z-20 flex items-center justify-center gap-1.5">
                {mediaSlides.map((_, i) => (
                  <button
                    key={`${p.id}-dot-${i}`}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSlideIndex(i); }}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === slideIndex ? '1.1rem' : '0.35rem',
                      background: i === slideIndex ? 'white' : 'rgba(255,255,255,0.45)',
                    }}
                    aria-current={i === slideIndex ? 'true' : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Caption (texte + média) ── */}
      {hasMedia && textBody && (
        <div className="px-4 pt-3 pb-1">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ color: 'var(--text-1)' }}>
            <span className="font-bold mr-1.5" style={{ color: 'var(--text-1)' }}>{p.user?.name}</span>
            {textBody}
          </p>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {/* Like */}
            <button onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${likeAnim ? 'd-pop' : ''} ${liked ? 'text-red-400' : ''}`}
              style={liked ? {color:'#fc8181',background:'rgba(252,129,129,0.1)'} : {color:'var(--text-3)'}}>
              {liked ? <Ic.HeartOn /> : <Ic.HeartOff />}
              <span className="text-xs font-medium">{likes.toLocaleString(numLocale)}</span>
            </button>

            {/* Comment */}
            <button
              type="button"
              onClick={() => setCommentsOpenPersist(true)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all"
              style={commentsOpen ? { color: 'var(--accent-1)', background: 'rgba(99,179,237,0.1)' } : { color: 'var(--text-3)' }}
            >
              <Ic.Chat />
              {(comments?.length ?? 0) > 0 && <span className="text-xs font-medium">{comments.length}</span>}
            </button>

            {/* Share */}
            <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all hover:bg-white/5"
              style={{color:'var(--text-3)'}}>
              <Ic.Share />
            </button>
          </div>

          {/* Bookmark */}
          <button onClick={handleSave}
            className="px-3 py-2 rounded-xl transition-all"
            style={saved ? {color:'var(--accent-1)',background:'rgba(99,179,237,0.1)'} : {color:'var(--text-3)'}}>
            {saved ? <Ic.BookOn /> : <Ic.BookOff />}
          </button>
        </div>

        {/* Liked by */}
        <div className="flex items-center gap-2 px-1 mt-0.5 flex-wrap">
          <div className="flex -space-x-1.5">
            {likersPreview.length === 0 ? (
              <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                {likes === 0 ? t('dashboard.postCard.noLikesYet') : ''}
              </span>
            ) : (
              likersPreview.slice(0, 5).map((u) => (
                <Link
                  key={u.id}
                  href={route('users.show', u.id)}
                  className="relative rounded-full border-2 z-[1]"
                  style={{ borderColor: 'var(--bg-deep)' }}
                  title={u.name}
                >
                  <Avatar name={u.name} size="xs" src={u.avatar_url} builder={u.avatar_builder} />
                </Link>
              ))
            )}
          </div>
          {likes > 0 && (
            <button
              type="button"
              onClick={() => setLikersOpen(true)}
              className="text-[10px] text-left hover:underline"
              style={{ color: 'var(--text-3)' }}
            >
              <span style={{ color: 'var(--text-2)' }} className="font-medium">
                {t('dashboard.postCard.likesCount', { n: likes.toLocaleString(numLocale) })}
              </span>
              {likersPreview.length < likes ? t('dashboard.postCard.seeList') : ''}
            </button>
          )}
        </div>
      </div>

      {shareToast && (
        <div className="absolute bottom-4 right-4 px-3 py-2 rounded-xl text-xs font-bold"
             style={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', color: 'var(--text-1)' }}>
          {t('dashboard.postCard.linkCopied')}
        </div>
      )}

      {commentsOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-end sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`post-comments-title-${p.id}`}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default border-0 bg-slate-950/45 backdrop-blur-md dark:bg-slate-950/55"
            style={{ WebkitBackdropFilter: 'blur(10px)' }}
            onClick={() => setCommentsOpenPersist(false)}
            aria-label={t('dashboard.postCard.commentsModalClose')}
          />
          <div
            className="relative z-10 flex max-h-[min(88dvh,560px)] w-full sm:max-w-[min(28rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl shadow-2xl"
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="min-w-0 flex-1">
                <p id={`post-comments-title-${p.id}`} className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>
                  {t('dashboard.postCard.commentsModalTitle', { n: comments.length })}
                </p>
                <p className="mt-0.5 text-xs font-semibold" style={{ color: 'var(--text-1)' }}>
                  {p.user?.name}
                </p>
                {p.body && (
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                    {p.body}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setCommentsOpenPersist(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg leading-none transition hover:bg-white/5"
                style={{ color: 'var(--text-2)' }}
                aria-label={t('dashboard.postCard.commentsModalClose')}
              >
                ×
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {comments.length === 0 ? (
                <p className="py-6 text-center text-sm" style={{ color: 'var(--text-3)' }}>
                  {t('dashboard.postCard.commentsModalEmpty')}
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id}>
                    {/* Top-level comment */}
                    <div className="flex items-start gap-2.5">
                      <Link href={route('users.show', c.user?.id ?? c.user_id)} className="shrink-0">
                        <Avatar name={c.user?.name} size="sm" src={c.user?.avatar_url} builder={c.user?.avatar_builder} />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="rounded-2xl rounded-tl-sm px-3 py-2" style={{ background: 'var(--bg-glass2)', border: '1px solid var(--border)' }}>
                          <Link
                            href={route('users.show', c.user?.id ?? c.user_id)}
                            className="font-display text-xs font-bold hover:underline"
                            style={{ color: 'var(--text-1)' }}
                          >
                            {c.user?.name ?? '—'}
                          </Link>
                          <p className="mt-0.5 text-sm leading-snug" style={{ color: 'var(--text-2)' }}>{c.body}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 px-1">
                          <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>{timeAgo(c.created_at)}</span>
                          <button
                            type="button"
                            onClick={() => startReply(c.id, c.user?.name ?? '')}
                            className="text-[11px] font-bold hover:underline"
                            style={{ color: 'var(--text-3)' }}
                          >
                            {t('dashboard.postCard.reply')}
                          </button>
                        </div>

                        {/* View/hide replies toggle */}
                        {c.replies?.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleReplies(c.id)}
                            className="flex items-center gap-2 mt-2 px-1"
                            style={{ color: 'var(--accent-1)' }}
                          >
                            <div className="h-px w-5 rounded-full" style={{ background: 'var(--accent-1)', opacity: 0.5 }} />
                            <span className="text-xs font-semibold">
                              {expandedReplies.has(c.id)
                                ? t('dashboard.postCard.hideReplies')
                                : c.replies.length === 1
                                  ? t('dashboard.postCard.showRepliesOne')
                                  : t('dashboard.postCard.showRepliesMany', { n: c.replies.length })}
                            </span>
                          </button>
                        )}

                        {/* Replies */}
                        {expandedReplies.has(c.id) && c.replies?.map((r) => (
                          <div key={r.id} className="mt-2.5 flex items-start gap-2 pl-3 border-l-2" style={{ borderColor: 'var(--border)' }}>
                            <Link href={route('users.show', r.user?.id ?? r.user_id)} className="shrink-0">
                              <Avatar name={r.user?.name} size="xs" src={r.user?.avatar_url} builder={r.user?.avatar_builder} />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <div className="rounded-2xl rounded-tl-sm px-3 py-1.5" style={{ background: 'var(--bg-glass2)', border: '1px solid var(--border)' }}>
                                <Link
                                  href={route('users.show', r.user?.id ?? r.user_id)}
                                  className="font-display text-xs font-bold hover:underline"
                                  style={{ color: 'var(--text-1)' }}
                                >
                                  {r.user?.name ?? '—'}
                                </Link>
                                <p className="mt-0.5 text-sm leading-snug" style={{ color: 'var(--text-2)' }}>{r.body}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 px-1">
                                <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>{timeAgo(r.created_at)}</span>
                                <button
                                  type="button"
                                  onClick={() => startReply(c.id, c.user?.name ?? '')}
                                  className="text-[11px] font-bold hover:underline"
                                  style={{ color: 'var(--text-3)' }}
                                >
                                  Répondre
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Reply banner */}
            {replyTo && (
              <div
                className="flex shrink-0 items-center gap-2 border-t px-4 py-2"
                style={{ borderColor: 'var(--border)', background: 'rgba(99,179,237,0.05)' }}
              >
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                  {t('dashboard.postCard.replyTo')}{' '}
                  <span className="font-bold" style={{ color: 'var(--accent-1)' }}>
                    @{replyTo.username}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => { setReplyTo(null); setCT(''); }}
                  className="ml-auto text-sm font-bold leading-none hover:opacity-70"
                  style={{ color: 'var(--text-3)' }}
                  aria-label="Annuler la réponse"
                >
                  ×
                </button>
              </div>
            )}

            <form
              onSubmit={addCmt}
              className="flex shrink-0 items-center gap-2 border-t px-3 py-3 sm:gap-3 sm:px-4"
              style={{ borderColor: 'var(--border)', background: 'var(--comments-bg)' }}
            >
              <Avatar name={auth.user.name} size="sm" src={auth.user.avatar_url} builder={auth.user.avatar_builder} />
              <div className="input-neo flex flex-1 items-center gap-2 rounded-full px-3 py-2 sm:px-4">
                <input
                  ref={cmtInputRef}
                  type="text"
                  value={cmtText}
                  onChange={(e) => setCT(e.target.value)}
                  placeholder={replyTo ? t('dashboard.postCard.replyToPlaceholder', { username: replyTo.username }) : t('dashboard.postCard.commentPlaceholder')}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text-1)' }}
                />
                <EmojiPicker placement="up" onPick={(emoji) => setCT((c) => (c || '') + emoji)}>
                  <Ic.Smile />
                </EmojiPicker>
              </div>
              {cmtText.trim() && (
                <button type="submit" className="shrink-0 text-sm font-bold" style={{ color: 'var(--accent-1)' }}>
                  {t('dashboard.postCard.postComment')}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {likersOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={() => setLikersOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden max-h-[70vh] flex flex-col"
            style={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{t('dashboard.postCard.likesModalTitle', { n: likes })}</p>
              <button type="button" onClick={() => setLikersOpen(false)} className="w-8 h-8 rounded-xl hover:bg-white/5" style={{ color: 'var(--text-2)' }}>
                ×
              </button>
            </div>
            <ul className="overflow-y-auto p-2 space-y-1">
              {likersPreview.length === 0 ? (
                <li className="text-xs px-2 py-4 text-center" style={{ color: 'var(--text-3)' }}>{t('dashboard.postCard.noLikersDetail')}</li>
              ) : (
                likersPreview.map((u) => (
                  <li key={u.id}>
                    <Link
                      href={route('users.show', u.id)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5"
                      style={{ color: 'var(--text-1)' }}
                      onClick={() => setLikersOpen(false)}
                    >
                      <Avatar name={u.name} size="sm" src={u.avatar_url} builder={u.avatar_builder} />
                      <span className="text-sm font-medium truncate">{u.name}</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {shareOpen && (
        <div
          className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 rounded-2xl overflow-hidden"
          style={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.55)' }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>{t('dashboard.postCard.shareMenuTitle')}</p>
            <button onClick={() => setShareOpen(false)} className="w-8 h-8 rounded-xl hover:bg-white/5" style={{ color: 'var(--text-2)' }}>
              ×
            </button>
          </div>
          <div className="p-2">
            <button
              onClick={copyShareLink}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5"
              style={{ color: 'var(--text-1)' }}
            >
              <span className="text-sm font-medium">{t('dashboard.postCard.copyLink')}</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{t('dashboard.postCard.copyHint')}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5"
              style={{ color: 'var(--text-1)' }}
              onClick={() => setShareOpen(false)}
            >
              <span className="text-sm font-medium">{t('dashboard.postCard.whatsapp')}</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>wa.me</span>
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent('UniConnect')}&body=${encodeURIComponent(shareUrl)}`}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5"
              style={{ color: 'var(--text-1)' }}
              onClick={() => setShareOpen(false)}
            >
              <span className="text-sm font-medium">{t('dashboard.postCard.email')}</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>mailto</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5"
              style={{ color: 'var(--text-1)' }}
              onClick={() => setShareOpen(false)}
            >
              <span className="text-sm font-medium">LinkedIn</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>share</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5"
              style={{ color: 'var(--text-1)' }}
              onClick={() => setShareOpen(false)}
            >
              <span className="text-sm font-medium">{t('dashboard.postCard.xTwitter')}</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>tweet</span>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5"
              style={{ color: 'var(--text-1)' }}
              onClick={() => setShareOpen(false)}
            >
              <span className="text-sm font-medium">{t('dashboard.postCard.facebook')}</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>fb</span>
            </a>

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(t('dashboard.postCard.shareTitle'))}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5"
              style={{ color: 'var(--text-1)' }}
              onClick={() => setShareOpen(false)}
            >
              <span className="text-sm font-medium">{t('dashboard.postCard.telegram')}</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>t.me</span>
            </a>

            <a
              href={`fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5"
              style={{ color: 'var(--text-1)' }}
              onClick={() => setShareOpen(false)}
            >
              <span className="text-sm font-medium">{t('dashboard.postCard.messenger')}</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{t('dashboard.postCard.messengerHint')}</span>
            </a>
          </div>
        </div>
      )}
    </article>
  );
}
