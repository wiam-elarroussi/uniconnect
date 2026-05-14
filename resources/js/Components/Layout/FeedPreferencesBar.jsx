import LanguageSwitcher from '@/Components/LanguageSwitcher';
import Dropdown from '@/Components/Dropdown';
import { Link, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const BG_OPTION_KEYS = [
  { id: 'nebula', label: 'Nebula' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'sunrise', label: 'Sunrise' },
];

/** Pastilles aperçu : tons doux en mode clair, plus saturés en mode sombre */
const BG_SWATCH_LIGHT = {
  nebula: 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)',
  aurora: 'linear-gradient(135deg, #6ee7b7 0%, #5eead4 100%)',
  /** 3ᵉ — ton pierre / taupe, sans bleu ni violet (≠ Nebula) */
  midnight: 'linear-gradient(135deg, #a8a29e 0%, #d6d3d1 100%)',
  sunrise: 'linear-gradient(135deg, #fb923c 0%, #fcd34d 100%)',
};
const BG_SWATCH_DARK = {
  nebula: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
  aurora: 'linear-gradient(135deg, #059669 0%, #0e7490 100%)',
  midnight: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
  sunrise: 'linear-gradient(135deg, #ea580c 0%, #ca8a04 100%)',
};

function SunIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 109 0 4.5 4.5 0 00-9 0zM18.894 6.106a.75.75 0 010 1.06l-1.591 1.59a.75.75 0 11-1.06-1.06l1.59-1.59a.75.75 0 011.06 0zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.196 18.196a.75.75 0 010 1.06l-1.59 1.592a.75.75 0 11-1.06-1.06l1.59-1.592a.75.75 0 011.06 0zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.528 17.47l-1.59 1.53a.75.75 0 01-1.06-1.06l1.53-1.59a.75.75 0 011.06 1.06zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.404a.75.75 0 010-1.06L8.3 4.7a.75.75 0 111.06 1.06L7.7 6.4a.75.75 0 01-1.06 0z" />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

/**
 * Barre d’outils fil : thème, ambiance, langue, menu profil — compacte mobile + desktop.
 */
export default function FeedPreferencesBar({ isLight, moodId, setMoodId, bgId, setBgId }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const user = auth?.user;

  const firstName = useMemo(() => {
    if (!user?.name) return '';
    return String(user.name).trim().split(/\s+/).filter(Boolean)[0] || user.name;
  }, [user?.name]);
  const initial = (user?.name || '?').charAt(0).toUpperCase();

  const bar =
    'rounded-2xl border ' +
    (isLight
      ? 'border-slate-200/50 bg-white/80 shadow-[0_1px_0_rgba(15,23,42,0.04)]'
      : 'border-white/[0.08] bg-slate-950/35 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl');

  const segWrap = 'flex shrink-0 rounded-full p-0.5 ' + (isLight ? 'bg-slate-200/70' : 'bg-white/10');
  const segLightOn =
    'flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-amber-500 transition ' +
    (isLight ? 'bg-white shadow-sm' : 'bg-white/15 text-amber-200');
  const segDarkOn =
    'flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition ' +
    (isLight ? 'bg-white text-slate-700 shadow-sm' : 'bg-indigo-500/35 text-sky-200 shadow-inner');
  const segOff =
    'flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition ' +
    (isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-100');

  const menuLink =
    (isLight
      ? 'flex w-full items-center px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50'
      : 'flex w-full items-center px-4 py-2.5 text-sm font-medium !text-slate-100 hover:bg-white/10') +
    ' transition-colors';
  const menuLogout =
    (isLight
      ? 'flex w-full items-center border-t border-slate-100 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50'
      : 'flex w-full items-center border-t border-white/10 px-4 py-2.5 text-sm font-medium text-rose-300 hover:bg-rose-500/10') +
    ' transition-colors';
  const menuPanel =
    'py-1.5 ' +
    (isLight
      ? '!border-slate-200/80 !bg-white/95 backdrop-blur-xl'
      : '!border-white/10 !bg-slate-950/80 backdrop-blur-2xl');

  const swatchStyle = (id) =>
    (isLight ? BG_SWATCH_LIGHT : BG_SWATCH_DARK)[id] || (isLight ? BG_SWATCH_LIGHT : BG_SWATCH_DARK).nebula;

  const swatchRing = (id) =>
    bgId === id
      ? isLight
        ? 'ring-2 ring-sky-500 ring-offset-1 sm:ring-offset-2 ring-offset-white'
        : 'ring-2 ring-cyan-400/90 ring-offset-1 sm:ring-offset-2 ring-offset-slate-900/90'
      : 'ring-0';

  return (
    <div className="w-full max-w-6xl mx-auto px-1.5 pb-0.5 pt-0 sm:px-3 sm:pb-1 sm:pt-0.5">
      <div className={bar}>
        {/* Une seule ligne : moins de hauteur sur mobile, pastilles + scroll du fil = uniquement les posts */}
        <div className="flex min-h-0 items-center justify-between gap-1 px-1.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
          <div className={segWrap} role="group" aria-label={t('dashboard.mood')}>
            <button
              type="button"
              onClick={() => setMoodId('light')}
              className={moodId === 'light' ? segLightOn : segOff}
              title={t('dashboard.light')}
              aria-pressed={moodId === 'light'}
            >
              <SunIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMoodId('dark')}
              className={moodId === 'dark' ? segDarkOn : segOff}
              title={t('dashboard.dark')}
              aria-pressed={moodId === 'dark'}
            >
              <MoonIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          <div
            className="flex min-w-0 flex-1 items-center justify-center gap-1 sm:gap-1.5"
            role="listbox"
            aria-label={t('dashboard.background')}
          >
            {BG_OPTION_KEYS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={bgId === id}
                title={label}
                onClick={() => setBgId(id)}
                className={
                  'h-5 w-5 shrink-0 rounded-full transition focus:outline-none focus:ring-2 focus:ring-cyan-500/50 sm:h-7 sm:w-7 ' +
                  swatchRing(id)
                }
                style={{ background: swatchStyle(id) }}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <LanguageSwitcher
              variant="compact"
              tone={isLight ? 'default' : 'onDark'}
            />
            {user && (
              <ProfileMenu
                firstName={firstName}
                initial={initial}
                isLight={isLight}
                menuLink={menuLink}
                menuLogout={menuLogout}
                menuPanel={menuPanel}
                t={t}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu({ firstName, initial, isLight, menuLink, menuLogout, menuPanel, t }) {
  const profilePill =
    'group flex max-w-[2.75rem] items-center justify-center gap-1.5 rounded-2xl border px-1 py-1 text-left transition sm:max-w-[12rem] sm:justify-start sm:px-1.5 ' +
    (isLight
      ? 'border-slate-200/70 bg-white/60 hover:border-slate-300 hover:bg-white'
      : 'border-white/10 bg-white/[0.07] hover:border-white/20 hover:bg-white/10');
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button
          type="button"
          className={profilePill}
          title={t('nav.profile')}
          aria-haspopup="menu"
          aria-label={t('nav.profile')}
        >
          <span
            className={
              'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white shadow-md sm:h-8 sm:w-8 sm:text-[11px] ' +
              (isLight
                ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
                : 'bg-gradient-to-br from-cyan-500 to-indigo-600')
            }
          >
            {initial}
          </span>
          <div className="hidden min-w-0 flex-1 pr-0.5 sm:block">
            <p
              className={
                'max-w-[7rem] truncate text-sm font-semibold leading-tight ' +
                (isLight ? 'text-slate-900' : 'text-slate-100')
              }
            >
              {firstName}
            </p>
            <p className={'text-[9px] font-medium leading-none ' + (isLight ? 'text-slate-500' : 'text-slate-500')}>
              {t('nav.profile')}
            </p>
          </div>
          <svg
            className="hidden h-3 w-3 flex-shrink-0 text-slate-500 sm:block"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </Dropdown.Trigger>
      <Dropdown.Content width="56" align="right" contentClasses={menuPanel}>
        <Link href={route('profile.edit')} className={menuLink} role="menuitem">
          {t('nav.profile')}
        </Link>
        <button
          type="button"
          role="menuitem"
          onClick={() => router.post(route('logout'))}
          className={menuLogout}
        >
          {t('nav.logout')}
        </button>
      </Dropdown.Content>
    </Dropdown>
  );
}

export function getFeedAmbient(moodId, bgId) {
  const isLight = moodId === 'light';
  const d = isLight ? AMBIENT_LIGHT : AMBIENT_DARK;
  return d[bgId] || d.nebula;
}

const AMBIENT_DARK = {
  nebula: {
    background:
      'radial-gradient(circle at 12% 20%, rgba(99,179,237,0.20), transparent 45%),' +
      'radial-gradient(circle at 85% 10%, rgba(183,148,244,0.14), transparent 40%),' +
      'radial-gradient(circle at 50% 95%, rgba(118,228,176,0.10), transparent 40%),' +
      'linear-gradient(180deg, #0b1433 0%, #060818 100%)',
  },
  aurora: {
    background:
      'radial-gradient(circle at 18% 18%, rgba(118,228,176,0.18), transparent 45%),' +
      'radial-gradient(circle at 82% 25%, rgba(99,179,237,0.14), transparent 42%),' +
      'radial-gradient(circle at 55% 90%, rgba(183,148,244,0.10), transparent 38%),' +
      'linear-gradient(180deg, #071a16 0%, #041016 100%)',
  },
  midnight: {
    background:
      'radial-gradient(circle at 15% 22%, rgba(99,179,237,0.14), transparent 45%),' +
      'radial-gradient(circle at 80% 10%, rgba(183,148,244,0.10), transparent 38%),' +
      'radial-gradient(circle at 55% 90%, rgba(118,228,176,0.08), transparent 38%),' +
      'linear-gradient(180deg, #03040a 0%, #050816 100%)',
  },
  sunrise: {
    background:
      'radial-gradient(circle at 18% 18%, rgba(246,173,85,0.16), transparent 45%),' +
      'radial-gradient(circle at 85% 15%, rgba(99,179,237,0.12), transparent 42%),' +
      'radial-gradient(circle at 50% 92%, rgba(183,148,244,0.10), transparent 38%),' +
      'linear-gradient(180deg, #1a0f08 0%, #090611 100%)',
  },
};

const AMBIENT_LIGHT = {
  // Indigo / violet (nettement différent du gris-lavande « minuit »)
  nebula: {
    background:
      'radial-gradient(circle at 14% 18%, rgba(99,102,241,0.28), transparent 48%),' +
      'radial-gradient(circle at 88% 12%, rgba(168,85,247,0.20), transparent 42%),' +
      'radial-gradient(circle at 48% 92%, rgba(59,130,246,0.14), transparent 40%),' +
      'linear-gradient(180deg, #e8e9ff 0%, #f3f0ff 55%, #faf8ff 100%)',
  },
  // Vert menthe / eau
  aurora: {
    background:
      'radial-gradient(circle at 16% 22%, rgba(16,185,129,0.22), transparent 48%),' +
      'radial-gradient(circle at 84% 20%, rgba(6,182,212,0.16), transparent 44%),' +
      'radial-gradient(circle at 50% 88%, rgba(45,212,191,0.12), transparent 40%),' +
      'linear-gradient(180deg, #e8fff4 0%, #f0fdf8 100%)',
  },
  // 3ᵉ thème : chaud pierre / grège (pas d’indigo, pas de bleu « nébuleuse »)
  midnight: {
    background:
      'radial-gradient(circle at 20% 30%, rgba(120,113,108,0.20), transparent 50%),' +
      'radial-gradient(circle at 78% 22%, rgba(168,162,158,0.16), transparent 48%),' +
      'radial-gradient(circle at 50% 88%, rgba(87,83,78,0.08), transparent 40%),' +
      'linear-gradient(180deg, #edeae6 0%, #f5f2ee 100%)',
  },
  sunrise: {
    background:
      'radial-gradient(circle at 16% 20%, rgba(249,115,22,0.20), transparent 45%),' +
      'radial-gradient(circle at 86% 16%, rgba(234,179,8,0.16), transparent 42%),' +
      'radial-gradient(circle at 50% 92%, rgba(251,191,36,0.10), transparent 38%),' +
      'linear-gradient(180deg, #fff4e0 0%, #fffdfb 100%)',
  },
};
