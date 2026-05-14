import ApplicationLogo from '@/Components/ApplicationLogo';
import { Ic } from '@/Components/Dashboard/Icons';
import FeedPreferencesBar, { getFeedAmbient } from '@/Components/Layout/FeedPreferencesBar';
import FeedOverlays from '@/Components/Layout/FeedOverlays';
import { FeedUIProvider, useFeedUI } from '@/contexts/FeedUIContext';
import NavGlyph from '@/Components/Nav/NavGlyph';
import { Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const BG_KEY = 'uniconnect.dashboard.bg';

const RAIL_LBL =
  'min-w-0 max-w-0 flex-1 overflow-hidden text-ellipsis text-left text-sm font-semibold leading-tight opacity-0 transition-all duration-200 group-hover/nav:max-w-[12rem] group-hover/nav:opacity-100';

function MobileNavItem({ href, icon, label, routeName, isLight, badge }) {
  const current = isRouteCurrent(routeName);
  const color = current
    ? '#2563eb'
    : isLight ? '#71717a' : '#c4c4cc';
  return (
    <Link
      href={href}
      className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1 min-w-0"
      aria-label={label}
    >
      <span className="relative flex items-center justify-center">
        <NavGlyph name={icon} className="h-[22px] w-[22px]" style={{ color }} />
        {badge > 0 && (
          <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </span>
      <span
        className="text-[10px] font-semibold leading-none truncate max-w-full px-1"
        style={{ color, letterSpacing: '0.01em' }}
      >
        {label}
      </span>
    </Link>
  );
}

function MobileNavBtn({ icon, label, isLight, onClick, active, badge }) {
  const color = active ? '#2563eb' : isLight ? '#71717a' : '#c4c4cc';
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1 min-w-0"
      aria-label={label}
    >
      <span className="relative flex items-center justify-center">
        <NavGlyph name={icon} className="h-[22px] w-[22px]" style={{ color }} />
        {badge > 0 && (
          <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </span>
      <span
        className="text-[10px] font-semibold leading-none truncate max-w-full px-1"
        style={{ color, letterSpacing: '0.01em' }}
      >
        {label}
      </span>
    </button>
  );
}

function tooltipSurface(isLight) {
  return isLight
    ? 'bg-zinc-900 text-white shadow-md'
    : 'bg-zinc-100 text-zinc-900 shadow-md border border-zinc-700/40';
}

function NavIconButton({ icon, label, active, isLight, onClick, as = 'button' }) {
  const inner = (
    <span
      className={
        'group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12 ' +
        (active
          ? isLight
            ? 'text-zinc-900 bg-zinc-100'
            : 'text-white bg-white/10'
          : isLight
            ? 'text-zinc-600 hover:bg-zinc-100'
            : 'text-zinc-200 hover:bg-white/5')
      }
    >
      <NavGlyph name={icon} className="h-5 w-5 sm:h-6 sm:w-6" />
      <span
        className={
          'pointer-events-none absolute left-full top-1/2 z-[60] ml-3 -translate-y-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold opacity-0 transition-opacity duration-150 max-lg:hidden ' +
          tooltipSurface(isLight) +
          ' group-hover:opacity-100'
        }
      >
        {label}
      </span>
    </span>
  );
  if (as === 'link') {
    return (
      <Link href={onClick} className="flex justify-center" aria-label={label}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className="flex justify-center" aria-label={label}>
      {inner}
    </button>
  );
}

function isRouteCurrent(name) {
  if (!name) return false;
  try {
    return route().current(name);
  } catch {
    return false;
  }
}

function NavIconLink({ href, icon, label, active, isLight, routeName }) {
  const current = isRouteCurrent(routeName);
  return (
    <div className="flex justify-center">
      <Link
        href={href}
        className="group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12"
        aria-label={label}
        title={label}
        style={
          active || current
            ? { background: 'transparent' }
            : undefined
        }
      >
        <span
          className={
            'absolute inset-0 rounded-xl ' +
            (active || current
              ? isLight
                ? 'bg-zinc-100'
                : 'bg-white/10'
              : '')
          }
        />
        <span
          className={
            'relative z-10 ' +
            (active || current
              ? isLight
                ? 'text-zinc-900'
                : 'text-white'
              : isLight
                ? 'text-zinc-600'
                : 'text-zinc-200')
          }
        >
          <NavGlyph name={icon} className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <span
          className={
            'pointer-events-none absolute left-full top-1/2 z-[60] ml-3 -translate-y-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold opacity-0 transition-opacity duration-150 max-lg:hidden ' +
            tooltipSurface(isLight) +
            ' group-hover:opacity-100'
          }
        >
          {label}
        </span>
      </Link>
    </div>
  );
}

function NavRailLink({ href, icon, label, isLight, routeName }) {
  const current = isRouteCurrent(routeName);
  return (
    <Link
      href={href}
      className={
        'flex w-full min-w-0 items-center gap-0.5 rounded-xl py-1.5 pl-0.5 pr-1 transition-colors ' +
        (current
          ? isLight
            ? 'bg-zinc-100 text-zinc-900'
            : 'bg-white/10 text-white'
          : isLight
            ? 'text-zinc-600 hover:bg-zinc-100'
            : 'text-zinc-200 hover:bg-white/5')
      }
      title={label}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
        <NavGlyph name={icon} className="w-6 h-6" />
      </span>
      <span className={RAIL_LBL + ' ' + (isLight ? 'text-zinc-800' : 'text-zinc-100')}>{label}</span>
    </Link>
  );
}

function NavRailButton({ icon, label, isLight, onClick, active, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex w-full min-w-0 items-center gap-0.5 rounded-xl py-1.5 pl-0.5 pr-1 text-left transition-colors ' +
        (active
          ? isLight
            ? 'bg-zinc-100 text-zinc-900'
            : 'bg-white/10 text-white'
          : isLight
            ? 'text-zinc-600 hover:bg-zinc-100'
            : 'text-zinc-200 hover:bg-white/5')
      }
      title={label}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <NavGlyph name={icon} className="w-6 h-6" />
        {badge}
      </span>
      <span className={RAIL_LBL + ' ' + (isLight ? 'text-zinc-800' : 'text-zinc-100')}>{label}</span>
    </button>
  );
}

function NavRailIconLink({ href, icon, label, isLight, routeName, badge }) {
  const current = isRouteCurrent(routeName);
  return (
    <Link
      href={href}
      className={
        'flex w-full min-w-0 items-center gap-0.5 rounded-xl py-1.5 pl-0.5 pr-1 text-left transition-colors ' +
        (current
          ? isLight
            ? 'bg-zinc-100 text-zinc-900'
            : 'bg-white/10 text-white'
          : isLight
            ? 'text-zinc-600 hover:bg-zinc-100'
            : 'text-zinc-200 hover:bg-white/5')
      }
      title={label}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <NavGlyph name={icon} className="w-6 h-6" />
        {badge}
      </span>
      <span className={RAIL_LBL + ' ' + (isLight ? 'text-zinc-800' : 'text-zinc-100')}>{label}</span>
    </Link>
  );
}

function MorePanel({
  isLight,
  onClose,
  t,
  isSuperAdmin,
  isUniAdmin,
  hasUniversity,
}) {
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[45] cursor-default bg-black/25 lg:bg-black/20"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={
          'fixed z-[50] w-[min(20rem,calc(100vw-1rem))] max-h-[80vh] overflow-y-auto rounded-2xl border p-3 shadow-2xl ' +
          'bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 lg:bottom-8 lg:left-20 lg:translate-x-0 ' +
          (isLight ? 'border-zinc-200 bg-white' : 'border-zinc-700/60 bg-zinc-900')
        }
      >
        <p className={'mb-2 text-xs font-bold uppercase tracking-wide ' + (isLight ? 'text-zinc-500' : 'text-zinc-400')}>
          {t('nav.more', { defaultValue: 'Plus' })}
        </p>
        <div className="space-y-2">
          <div
            className={'space-y-0.5 ' + (isLight ? 'border-zinc-100' : 'border-zinc-800')}
            onClick={onClose}
          >
            <Link
              href={route('profile.edit')}
              className={'block rounded-lg px-2 py-2 text-sm ' + (isLight ? 'text-zinc-800 hover:bg-zinc-100' : 'text-zinc-200 hover:bg-white/5')}
            >
              {t('nav.profile')}
            </Link>
            <Link
              href={route('my-posts.index')}
              className={'block rounded-lg px-2 py-2 text-sm ' + (isLight ? 'text-zinc-800 hover:bg-zinc-100' : 'text-zinc-200 hover:bg-white/5')}
            >
              {t('nav.myPosts')}
            </Link>
            {hasUniversity && (
              <Link
                href={route('channels.index')}
                className={'block rounded-lg px-2 py-2 text-sm ' + (isLight ? 'text-zinc-800 hover:bg-zinc-100' : 'text-zinc-200 hover:bg-white/5')}
              >
                {t('nav.channels')}
              </Link>
            )}
            <Link
              href={route('saved-posts.index')}
              className={'block rounded-lg px-2 py-2 text-sm ' + (isLight ? 'text-zinc-800 hover:bg-zinc-100' : 'text-zinc-200 hover:bg-white/5')}
            >
              {t('nav.saved')}
            </Link>
            <Link
              href={route('stories.index')}
              className={'block rounded-lg px-2 py-2 text-sm ' + (isLight ? 'text-zinc-800 hover:bg-zinc-100' : 'text-zinc-200 hover:bg-white/5')}
            >
              {t('nav.stories')}
            </Link>
            {isUniAdmin && (
              <Link
                href={route('admin.dashboard')}
                className={'block rounded-lg px-2 py-2 text-sm ' + (isLight ? 'text-zinc-800 hover:bg-zinc-100' : 'text-zinc-200 hover:bg-white/5')}
              >
                {t('nav.moderation')}
              </Link>
            )}
            {isSuperAdmin && (
              <Link
                href={route('superadmin.dashboard')}
                className={'block rounded-lg px-2 py-2 text-sm ' + (isLight ? 'text-zinc-800 hover:bg-zinc-100' : 'text-zinc-200 hover:bg-white/5')}
              >
                {t('nav.superAdmin')}
              </Link>
            )}
            <button
              type="button"
              onClick={() => router.post(route('logout'))}
              className={'w-full rounded-lg px-2 py-2 text-left text-sm text-red-500 ' + (isLight ? 'hover:bg-red-50' : 'hover:bg-red-950/30')}
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Choix post / story : petit panneau ancré au bouton Créer (barre latérale ou bas d’écran), sans grosse modale.
 */
function FeedCreateMenu({ railRef, mobileRef, isLight }) {
  const { t } = useTranslation();
  const { createMenuOpen, closeCreateMenu, openComposer, openStoryCreate, toggleCreateMenu } = useFeedUI();
  const [pos, setPos] = useState(
    /** @type {{ top: number; left: number; transform: string; maxW: number } | null} */ (null)
  );

  const recalc = useCallback(() => {
    if (!createMenuOpen) {
      setPos(null);
      return;
    }
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const isLg = w >= 1024;
    const el = isLg ? railRef.current : mobileRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const maxW = Math.min(280, w - 24);
    if (isLg) {
      const left = Math.min(r.right + 8, w - maxW - 8);
      setPos({
        top: r.top + r.height / 2,
        left,
        transform: 'translateY(-50%)',
        maxW,
      });
    } else {
      setPos({
        top: r.top - 8,
        left: r.left + r.width / 2,
        transform: 'translate(-50%, -100%)',
        maxW,
      });
    }
  }, [createMenuOpen, railRef, mobileRef]);

  useLayoutEffect(() => {
    recalc();
  }, [recalc]);

  useEffect(() => {
    if (!createMenuOpen) return undefined;
    const h = () => recalc();
    const onKey = (e) => {
      if (e.key === 'Escape') closeCreateMenu();
    };
    window.addEventListener('resize', h);
    window.addEventListener('scroll', h, true);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', h);
      window.removeEventListener('scroll', h, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [createMenuOpen, recalc, closeCreateMenu]);

  if (!createMenuOpen) return null;

  const baseBtn =
    'flex w-full min-h-12 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition ' +
    (isLight
      ? 'border-zinc-200 bg-white/95 hover:bg-zinc-50 text-zinc-900'
      : 'border-zinc-600/80 bg-zinc-900/95 hover:bg-zinc-800/90 text-zinc-100');

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[48] cursor-default bg-black/10"
        onClick={closeCreateMenu}
        aria-label={t('dashboard.close')}
      />
      {pos && (
        <div
          className="fixed z-[60] flex flex-col gap-1.5 rounded-2xl border p-2 shadow-2xl"
          style={{
            top: pos.top,
            left: pos.left,
            transform: pos.transform,
            maxWidth: pos.maxW,
            width: pos.maxW,
            borderColor: isLight ? 'rgb(228 228 231)' : 'rgb(63 63 70)',
            background: isLight ? 'rgba(255,255,255,0.98)' : 'rgb(24 24 27)',
          }}
          role="menu"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <p
            className="px-1.5 py-0.5 text-center text-xs font-bold uppercase tracking-wide"
            style={{ color: isLight ? 'rgb(82 82 91)' : 'rgb(161 161 170)' }}
          >
            {t('nav.createChooseTitle')}
          </p>
          <button
            type="button"
            className={baseBtn}
            onClick={() => {
              closeCreateMenu();
              openComposer();
            }}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: 'rgba(99,179,237,0.2)', color: 'rgb(56 189 248)' }}
            >
              <span className="scale-100 [&_svg]:h-5 [&_svg]:w-5">
                <Ic.TypeText />
              </span>
            </span>
            <span>
              <span className="block font-bold leading-tight">{t('nav.createOptionPost')}</span>
              <span className="text-[10px] leading-tight" style={{ color: isLight ? 'rgb(113 113 122)' : 'rgb(161 161 170)' }}>
                {t('nav.createOptionPostHint')}
              </span>
            </span>
          </button>
          <button
            type="button"
            className={baseBtn}
            onClick={() => {
              closeCreateMenu();
              openStoryCreate();
            }}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: 'rgba(167,139,250,0.2)', color: 'rgb(196 181 253)' }}
            >
              <span className="scale-100">
                <Ic.Image />
              </span>
            </span>
            <span>
              <span className="block font-bold leading-tight">{t('nav.createOptionStory')}</span>
              <span className="text-[10px] leading-tight" style={{ color: isLight ? 'rgb(113 113 122)' : 'rgb(161 161 170)' }}>
                {t('nav.createOptionStoryHint')}
              </span>
            </span>
          </button>
        </div>
      )}
    </>
  );
}

const OVERLAY_SHELL = {
  light: {
    '--bg-card': 'rgba(255,255,255,0.80)', '--bg-glass': 'rgba(2,6,23,0.03)', '--bg-glass2': 'rgba(2,6,23,0.05)',
    '--border': 'rgba(2,6,23,0.10)', '--border-glow': 'rgba(37,99,235,0.18)', '--panel-bg': 'rgb(255, 255, 255)',
    '--comments-bg': 'rgba(2,6,23,0.035)', '--shadow-strong': 'rgba(2,6,23,0.14)', '--input-bg': 'rgba(2,6,23,0.02)',
    '--input-border': 'rgba(2,6,23,0.08)', '--input-placeholder': '#64748b', '--text-1': '#0f172a',
    '--text-2': '#334155', '--text-3': '#64748b', '--accent-1': 'rgb(56, 189, 248)', '--accent-2': 'rgb(167, 139, 250)',
  },
  dark: {
    '--bg-card': 'rgba(10,12,28,0.85)', '--bg-glass': 'rgba(255,255,255,0.04)', '--bg-glass2': 'rgba(255,255,255,0.07)',
    '--border': 'rgba(255,255,255,0.07)', '--border-glow': 'rgba(99,179,237,0.30)', '--panel-bg': 'rgb(12, 14, 26)',
    '--comments-bg': 'rgba(0,0,0,0.20)', '--shadow-strong': 'rgba(0,0,0,0.40)', '--input-bg': 'rgba(255,255,255,0.03)',
    '--input-border': 'rgba(255,255,255,0.07)', '--input-placeholder': '#4a5578', '--text-1': '#f0f4ff',
    '--text-2': '#8b9cc8', '--text-3': '#4a5578', '--accent-1': 'rgb(99, 179, 237)', '--accent-2': 'rgb(183, 148, 244)',
  },
};

function GlobalFeedOverlays({ isLight }) {
  const { composerOpen, closeComposer, storyCreateOpen } = useFeedUI();
  const { auth } = usePage().props;
  const channels = usePage().props.channels ?? [];
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const hour = new Date().getHours();
  const isFocus = hour >= 23 || hour < 7;
  const theme = isLight ? OVERLAY_SHELL.light : OVERLAY_SHELL.dark;

  const handleSubmit = (formData, onSuccess) => {
    setProcessing(true);
    setErrors({});
    router.post(route('posts.store'), formData, {
      forceFormData: true,
      onSuccess: () => { setProcessing(false); onSuccess(); closeComposer(); },
      onError: (errs) => { setProcessing(false); setErrors(errs); },
    });
  };

  if (!composerOpen && !storyCreateOpen) return null;

  return (
    <FeedOverlays
      theme={theme}
      isFocus={isFocus}
      auth={auth}
      channels={channels}
      processing={processing}
      errors={errors}
      onComposerSubmit={handleSubmit}
    />
  );
}

function FeedNavFrameInner({ children, moodId, setMoodId, isLight }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const user = auth?.user;
  const { toggleCreateMenu, moreOpen, setMoreOpen, unreadCount, createMenuOpen } = useFeedUI();
  const railCreateRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const mobileCreateRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [bgId, setBgId] = useState(() => {
    if (typeof window === 'undefined') return 'nebula';
    return window.localStorage.getItem(BG_KEY) || 'nebula';
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(BG_KEY, bgId);
  }, [bgId]);

  const isSuperAdmin = user?.role === 'super_admin';
  const isUniAdmin = user?.role === 'admin';
  const hasUniversity = Boolean(user?.university_id);

  const mainNav = useMemo(() => {
    if (isSuperAdmin) {
      return [
        { key: 'sa', href: route('superadmin.dashboard'), icon: 'super', label: t('nav.superAdmin'), r: 'superadmin.*' },
        { key: 'mp', href: route('my-posts.index'), icon: 'posts', label: t('nav.myPosts'), r: 'my-posts.*' },
      ];
    }
    const items = [
      { key: 'home', href: route('dashboard'), icon: 'home', label: t('nav.feed'), r: 'dashboard' },
    ];
    if (hasUniversity) {
      items.push({ key: 'ch', href: route('channels.index'), icon: 'channels', label: t('nav.channels'), r: 'channels.*' });
      items.push({ key: 'lib', href: route('library.index'), icon: 'library', label: t('nav.library'), r: 'library.*' });
      items.push({ key: 'sug', href: route('suggestions.index'), icon: 'compass', label: t('nav.suggestions'), r: 'suggestions.*' });
    }
    items.push(
      { key: 'myp', href: route('my-posts.index'), icon: 'posts', label: t('nav.myPosts'), r: 'my-posts.*' },
    );
    if (isUniAdmin) {
      items.push({ key: 'mod', href: route('admin.dashboard'), icon: 'shield', label: t('nav.moderation'), r: 'admin.*' });
    }
    items.push(
      { key: 'msg', href: route('messages.index'), icon: 'chat', label: t('nav.messages'), r: 'messages.*' },
      { key: 'st', href: route('stories.index'), icon: 'reels', label: t('nav.stories'), r: 'stories.*' },
      { key: 'sv', href: route('saved-posts.index'), icon: 'bookmark', label: t('nav.saved'), r: 'saved-posts.*' },
    );
    return items;
  }, [t, isSuperAdmin, isUniAdmin, hasUniversity]);

  const border = isLight ? 'border-zinc-200' : 'border-zinc-800/80';
  const barBg = isLight ? 'bg-white' : 'bg-zinc-950';
  const feedAmbient = getFeedAmbient(moodId, bgId);

  const closeMore = () => setMoreOpen?.(false);
  const profileHref = user?.id ? route('users.show', user.id) : route('profile.edit');
  const feedMainRef = useRef(null);
  // Inertia lit `querySelectorAll('[scroll-region]')` ; en JSX la prop ne sort pas toujours dans le DOM.
  useLayoutEffect(() => {
    feedMainRef.current?.setAttribute('scroll-region', '');
  }, []);

  return (
    <div className="feed-root flex h-full min-h-0 min-w-0 flex-1">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .feed-root { font-family: Inter, system-ui, sans-serif; }
        .feed-main-scroll {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
      `}</style>
      <aside
        className={
          'group/nav fixed bottom-0 left-0 top-0 z-50 hidden w-[72px] flex-col overflow-x-hidden overflow-y-auto border-r shadow-sm transition-[width] duration-200 ease-out ' +
          border +
          ' ' +
          barBg +
          ' hover:w-56 hover:shadow-md lg:flex'
        }
      >
        <Link
          href={route('welcome')}
          className="flex h-16 min-h-[4rem] shrink-0 items-center border-b border-inherit py-0 pl-0.5 pr-1"
          title={t('nav.welcome', { defaultValue: 'Page d’accueil' })}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center">
            <ApplicationLogo size="sm" showText={false} />
          </span>
          <span className={RAIL_LBL + ' font-bold ' + (isLight ? 'text-zinc-900' : 'text-white')}>
            {t('nav.brand', { defaultValue: 'UniConnect' })}
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-0.5 px-1.5 py-2">
          {mainNav.map((item) => (
            <NavRailLink
              key={item.key}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isLight={isLight}
              routeName={item.r}
            />
          ))}
          <div
            className="my-1 h-px w-full"
            style={{ background: isLight ? '#e4e4e7' : '#3f3f46' }}
          />
          <div ref={railCreateRef} className="w-full">
            <NavRailButton
              icon="plus"
              label={t('nav.create', { defaultValue: 'Créer' })}
              isLight={isLight}
              onClick={() => toggleCreateMenu?.()}
              active={createMenuOpen}
            />
          </div>
          <NavRailIconLink
            href={route('notifications.index')}
            icon="bell"
            label={t('dashboard.notifications')}
            isLight={isLight}
            routeName="notifications.*"
            badge={
              unreadCount > 0 ? (
                <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950" />
              ) : null
            }
          />
          <div className="mt-auto flex flex-col gap-0.5 pb-2">
            <Link
              href={profileHref}
              className={
                'flex w-full min-w-0 items-center gap-0.5 rounded-xl py-1.5 pl-0.5 pr-1 transition-colors ' +
                (isLight
                  ? 'text-zinc-600 hover:bg-zinc-100'
                  : 'text-zinc-200 hover:bg-white/5')
              }
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                <span
                  className={
                    'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ' +
                    (isLight
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white')
                  }
                >
                  {(user?.name || '?').charAt(0).toUpperCase()}
                </span>
              </span>
              <span className={RAIL_LBL + ' ' + (isLight ? 'text-zinc-800' : 'text-zinc-100')}>
                {t('nav.profile')}
              </span>
            </Link>
            <NavRailButton
              icon="more"
              label={t('nav.more', { defaultValue: 'Plus' })}
              isLight={isLight}
              active={moreOpen}
              onClick={() => setMoreOpen?.((v) => !v)}
            />
          </div>
        </nav>
      </aside>

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col pb-16 pl-0 lg:pb-0 lg:pl-[72px]">
        <header
          className={
            'sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b px-3 backdrop-blur-xl lg:hidden ' +
            (isLight
              ? 'border-slate-200/60 bg-white/90'
              : 'border-white/10 bg-slate-950/25')
          }
        >
          <Link href={route('welcome')} className="flex items-center" aria-label={t('nav.welcome', { defaultValue: 'Bienvenue' })}>
            <ApplicationLogo size="sm" showText={false} />
          </Link>
          <button
            type="button"
            onClick={() => setMoreOpen?.((o) => !o)}
            className={
              'flex h-10 w-10 items-center justify-center rounded-xl ' + (isLight ? 'text-zinc-800 hover:bg-zinc-100' : 'text-zinc-200 hover:bg-white/5')
            }
            aria-label={t('nav.more', { defaultValue: 'Plus' })}
          >
            <NavGlyph name="more" className="w-6 h-6" />
          </button>
        </header>
        {/* La barre d’outils est hors de la zone scroll : le fil défile seul, le menu profil n’est plus coupé. */}
        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div
            className={
              'relative z-20 shrink-0 border-b px-0 pb-0 pt-0.5 backdrop-blur-sm ' +
              (isLight
                ? 'border-slate-200/30 bg-gradient-to-b from-white/85 to-white/20'
                : 'border-white/[0.07] bg-gradient-to-b from-slate-950/50 to-transparent')
            }
          >
            <FeedPreferencesBar
              isLight={isLight}
              moodId={moodId}
              setMoodId={setMoodId}
              bgId={bgId}
              setBgId={setBgId}
            />
          </div>
          <div
            id="uni-feed-main-scroll"
            ref={feedMainRef}
            className="feed-main-scroll min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden"
            style={{ background: feedAmbient?.background }}
          >
            {children}
          </div>
        </main>
      </div>

      <nav
        className={
          'fixed bottom-0 left-0 right-0 z-40 h-[4rem] border-t backdrop-blur-xl lg:hidden ' +
          (isLight
            ? 'border-slate-200/70 bg-white/92'
            : 'border-white/10 bg-slate-950/85')
        }
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Navigation"
      >
        <div className="flex h-full w-full items-center justify-around px-1">
          {mainNav.map((item) => {
            const cur = isRouteCurrent(item.r);
            return (
              <Link
                key={`m-${item.key}`}
                href={item.href}
                aria-label={item.label}
                className="flex h-full flex-1 items-center justify-center"
              >
                <NavGlyph
                  name={item.icon}
                  className="h-[22px] w-[22px] transition-colors"
                  style={{ color: cur ? '#2563eb' : isLight ? '#71717a' : '#c4c4cc' }}
                />
              </Link>
            );
          })}
          <div ref={mobileCreateRef} className="flex flex-1 justify-center">
            <button
              type="button"
              onClick={() => toggleCreateMenu?.()}
              aria-label={t('nav.create', { defaultValue: 'Créer' })}
              className="flex h-full w-full items-center justify-center"
            >
              <NavGlyph
                name="plus"
                className="h-[22px] w-[22px] transition-colors"
                style={{ color: createMenuOpen ? '#2563eb' : isLight ? '#71717a' : '#c4c4cc' }}
              />
            </button>
          </div>
          <Link
            href={route('notifications.index')}
            aria-label={t('dashboard.notifications')}
            className="relative flex flex-1 h-full items-center justify-center"
          >
            <NavGlyph
              name="bell"
              className="h-[22px] w-[22px] transition-colors"
              style={{ color: isRouteCurrent('notifications.index') ? '#2563eb' : isLight ? '#71717a' : '#c4c4cc' }}
            />
            {unreadCount > 0 && (
              <span className="absolute right-[calc(50%-14px)] top-[10px] h-2 w-2 rounded-full bg-red-500" />
            )}
          </Link>
          <Link
            href={profileHref}
            aria-label={t('nav.profile')}
            className="flex flex-1 h-full items-center justify-center"
          >
            <div
              className="flex h-[26px] w-[26px] items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#6d28d9,#4f46e5)' }}
            >
              {(user?.name || '?').charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>
      </nav>

      <FeedCreateMenu railRef={railCreateRef} mobileRef={mobileCreateRef} isLight={isLight} />

      {moreOpen && (
        <MorePanel
          isLight={isLight}
          onClose={closeMore}
          t={t}
          isSuperAdmin={isSuperAdmin}
          isUniAdmin={isUniAdmin}
          hasUniversity={hasUniversity}
        />
      )}
      <GlobalFeedOverlays isLight={isLight} />
    </div>
  );
}

/**
 * @param {{ children: import('react').ReactNode, moodId: string, setMoodId: (v: string) => void, isLight: boolean }} props
 */
export default function FeedNavFrame({ children, moodId, setMoodId, isLight }) {
  return (
    <FeedUIProvider>
      <FeedNavFrameInner moodId={moodId} setMoodId={setMoodId} isLight={isLight}>
        {children}
      </FeedNavFrameInner>
    </FeedUIProvider>
  );
}
