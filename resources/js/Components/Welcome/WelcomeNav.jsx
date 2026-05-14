// resources/js/Components/Welcome/WelcomeNav.jsx

import { useState } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { IconArrow } from './constants';
import { useWelcomeMood } from './WelcomeMoodContext';

function ThemeToggle() {
  const { t } = useTranslation();
  const { mood, toggleMood } = useWelcomeMood();
  const isDark = mood === 'dark';

  return (
    <button
      type="button"
      onClick={toggleMood}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-amber-500 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800/80 dark:text-amber-300 dark:hover:bg-slate-800"
      aria-pressed={isDark}
      title={t('dashboard.moodAria')}
      aria-label={t('dashboard.moodAria')}
    >
      {isDark ? (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

export default function WelcomeNav({ auth, scrolled }) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const anchors = [
    { label: t('welcome.navFeatures'), anchor: 'features' },
    { label: t('welcome.navEthics'), anchor: 'ethique' },
    { label: t('welcome.navCommunity'), anchor: 'community' },
  ];

  return (
    <nav className="pointer-events-none fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={`pointer-events-auto mx-auto flex max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-lg shadow-slate-900/5 backdrop-blur-2xl transition-all duration-500 sm:rounded-3xl dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/40 ${
          scrolled ? 'ring-1 ring-slate-200/90 dark:ring-white/10' : 'bg-white/60 dark:bg-slate-900/60'
        }`}
      >
        <div className="relative flex items-center justify-between gap-2 px-3 py-2.5 sm:px-5 sm:py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-800/80 sm:h-12 sm:w-12">
              <img src="/logo_transparent.png" alt="UniConnect" className="h-full w-full object-contain p-0.5" />
            </div>
            <span className="hidden sm:inline text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
              Uni<span className="gradient-text">Connect</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400 md:flex">
            {anchors.map(({ label, anchor }) => (
              <a
                key={anchor}
                href={`#${anchor}`}
                className="transition-colors duration-200 hover:text-blue-600 dark:hover:text-sky-400"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher variant="compact" className="flex-shrink-0" />
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-200 md:hidden"
              aria-expanded={mobileOpen}
              aria-label={t('nav.menu')}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {auth.user ? (
              <Link
                href={route('dashboard')}
                className="btn-primary hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white sm:inline-flex"
              >
                {t('welcome.dashboard')} <IconArrow />
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="hidden rounded-full px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-sky-400 sm:inline-block sm:px-4 sm:text-sm"
                >
                  {t('welcome.login')}
                </Link>
                <Link
                  href={route('register')}
                  className="btn-primary inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-white sm:gap-2 sm:px-5 sm:text-sm"
                >
                  {t('welcome.register')}
                  <IconArrow />
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200/80 bg-white/95 px-3 py-3 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/95 md:hidden">
            <div className="mb-2 flex items-center justify-between sm:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('dashboard.mood')}
              </span>
              <ThemeToggle />
            </div>
            <div className="flex flex-col gap-1">
              {anchors.map(({ label, anchor }) => (
                <a
                  key={anchor}
                  href={`#${anchor}`}
                  className="rounded-xl py-3 pl-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-400"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </a>
              ))}
              {auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="mt-2 rounded-xl bg-blue-600 py-3 text-center text-sm font-bold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('welcome.dashboard')}
                </Link>
              ) : (
                <Link
                  href={route('login')}
                  className="mt-2 rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('welcome.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
