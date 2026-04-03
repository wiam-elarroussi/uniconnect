// resources/js/Components/Dashboard/PostCard.jsx
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, router } from '@inertiajs/react';
import Avatar from './Avatar';
import EmojiPicker from './EmojiPicker';
import { Ic } from './Icons';

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
  const [showMenu, setMenu]   = useState(false);
  const [showCmts, setCmts]   = useState(false);
  const [cmtText, setCT]      = useState('');
  const [liked, setLiked]     = useState(!!p.liked_by_me);
  const [saved, setSaved]     = useState(!!p.saved_by_me);
  const [likes, setLikes]     = useState(p.likes_count ?? 0);
  const [likeAnim, setLA]     = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [likersOpen, setLikersOpen] = useState(false);
  const isOwn = p.user_id === auth.user.id;
  const likersPreview = p.likers_preview ?? [];
  const tag   = detectTag(p.body, tagMap);

  const comments = p.comments ?? [];
  const shareUrl = `${window.location.origin}${window.location.pathname}#post-${p.id}`;

  const reloadDashboard = () => router.reload();

  const handleLike = () => {
    setLiked(prev => {
      const next = !prev;
      setLikes(count => (next ? count + 1 : Math.max(0, count - 1)));
      if (next) {
        setLA(true);
        setTimeout(() => setLA(false), 350);
      }
      return next;
    });

    router.post(route('posts.likes.toggle', p.id), {}, { onSuccess: reloadDashboard });
  };

  const handleSave = () => {
    setSaved(prev => {
      const next = !prev;
      return next;
    });

    router.post(route('posts.saves.toggle', p.id), {}, { onSuccess: reloadDashboard });
  };

  const addCmt = (e) => {
    e.preventDefault();
    if (!cmtText.trim()) return;

    router.post(route('posts.comments.store', p.id), { body: cmtText }, {
      onSuccess: () => {
        setCT('');
        setCmts(true);
        reloadDashboard();
      },
    });
  };

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
    <article id={`post-${p.id}`} className="glass-card rounded-2xl overflow-hidden post-card scan-line noise relative max-w-[min(100%,468px)] mx-auto w-full">

      {/* ── Ambient glow top ── */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(99,179,237,0.4),transparent)'}} />

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
              {p.channel?.name && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full truncate max-w-[10rem]"
                      style={{ background: 'rgba(183,148,244,0.12)', color: 'var(--accent-2)', border: '1px solid rgba(183,148,244,0.25)' }}>
                  {p.channel.name}
                </span>
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
                <Ic.Share /> Partager
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Tag ── */}
      {tag && (
        <div className="px-5 pb-3">
          <span className={`inline-flex items-center text-[10px] font-bold px-3 py-1 rounded-full ${tag.cls}`}>
            {tag.label}
          </span>
        </div>
      )}

      {/* ── Body ── */}
      <div className="px-5 pb-4 space-y-3">
        {p.body && <p className="text-base leading-relaxed" style={{color:'var(--text-2)'}}>{p.body}</p>}
        {p.media_url && (
          p.media_url.match(/\.(mp4|webm|mov)$/i) ? (
            <video controls className="w-full rounded-2xl border bg-black/20" style={{ borderColor: 'var(--border)', maxHeight: 'min(85vh, 720px)' }}>
              <source src={p.media_url} />
            </video>
          ) : (
            <img src={p.media_url} alt={t('dashboard.postCard.mediaAlt')} className="w-full object-cover rounded-2xl border" style={{ borderColor: 'var(--border)', maxHeight: 'min(85vh, 720px)' }} />
          )
        )}
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 h-px" style={{background:'var(--border)'}} />

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
            <button onClick={() => setCmts(v=>!v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all"
              style={showCmts ? {color:'var(--accent-1)',background:'rgba(99,179,237,0.1)'} : {color:'var(--text-3)'}}>
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

      {/* ── Comments ── */}
      {showCmts && (
        <div style={{borderTop:'1px solid var(--border)',background:'var(--comments-bg)'}}>
          {comments.length > 0 && (
            <div className="px-5 pt-3 space-y-3 max-h-40 overflow-y-auto">
              {comments.map(c => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <Avatar name={c.user?.name} size="xs" builder={c.user?.avatar_builder} />
                  <div className="rounded-2xl rounded-tl-sm px-3 py-2 flex-1"
                       style={{background:'var(--bg-glass2)',border:'1px solid var(--border)'}}>
                    <span className="font-display font-bold text-xs mr-1.5" style={{color:'var(--text-1)'}}>
                      {(c.user?.name ?? '').split(' ')[0]}
                    </span>
                    <span className="text-xs" style={{color:'var(--text-2)'}}>{c.body}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={addCmt} className="flex items-center gap-3 px-5 py-3">
            <Avatar name={auth.user.name} size="sm" src={auth.user.avatar_url} builder={auth.user.avatar_builder} />
            <div className="flex-1 flex items-center rounded-full px-4 py-2 gap-2 input-neo">
              <input type="text" value={cmtText} onChange={e=>setCT(e.target.value)}
                placeholder={t('dashboard.postCard.commentPlaceholder')}
                className="flex-1 bg-transparent outline-none text-xs" style={{color:'var(--text-1)'}} />
              <EmojiPicker placement="down" onPick={(emoji) => setCT((c) => (c || '') + emoji)}>
                <Ic.Smile />
              </EmojiPicker>
            </div>
            {cmtText.trim() && (
              <button type="submit" className="text-xs font-bold" style={{color:'var(--accent-1)'}}>{t('dashboard.postCard.postComment')}</button>
            )}
          </form>
        </div>
      )}

      {shareToast && (
        <div className="absolute bottom-4 right-4 px-3 py-2 rounded-xl text-xs font-bold"
             style={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', color: 'var(--text-1)' }}>
          {t('dashboard.postCard.linkCopied')}
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
          </div>
        </div>
      )}
    </article>
  );
}