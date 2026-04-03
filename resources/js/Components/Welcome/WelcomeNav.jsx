// resources/js/Components/Welcome/WelcomeNav.jsx

import { useState } from 'react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { IconArrow } from './constants';

export default function WelcomeNav({ auth, scrolled }) {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const anchors = [
    { label: t('welcome.navFeatures'), anchor: 'features' },
    { label: t('welcome.navEthics'), anchor: 'ethique' },
    { label: t('welcome.navCommunity'), anchor: 'community' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-md border-b border-white/50 py-2 sm:py-3' : 'py-3 sm:py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden shadow-md border-2 border-white shrink-0">
            <img src="/logo_transparent.png" alt="UniConnect" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight truncate">
            Uni<span className="gradient-text">Connect</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          {anchors.map(({ label, anchor }) => (
            <a
              key={anchor}
              href={`#${anchor}`}
              className="hover:text-blue-600 transition-colors duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA + lang + mobile toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageSwitcher variant="compact" className="flex-shrink-0" />

          <button
            type="button"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-700"
            aria-expanded={mobileOpen}
            aria-label={t('nav.menu')}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {auth.user ? (
            <Link
              href={route('dashboard')}
              className="hidden sm:inline-flex btn-primary px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-full items-center gap-2"
            >
              {t('welcome.dashboard')} <IconArrow />
            </Link>
          ) : (
            <>
              <Link
                href={route('login')}
                className="hidden sm:inline-block px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors rounded-full"
              >
                {t('welcome.login')}
              </Link>
              <Link
                href={route('register')}
                className="btn-primary px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-full inline-flex items-center gap-1 sm:gap-2"
              >
                {t('welcome.register')}
                <IconArrow />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100/80 bg-white/95 backdrop-blur-md shadow-lg">
          <div className="max-w-6xl mx-auto px-3 py-3 flex flex-col gap-1">
            {anchors.map(({ label, anchor }) => (
              <a
                key={anchor}
                href={`#${anchor}`}
                className="py-3 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
            {auth.user ? (
              <Link
                href={route('dashboard')}
                className="mt-2 py-3 px-3 rounded-xl text-center text-sm font-bold bg-blue-600 text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t('welcome.dashboard')}
              </Link>
            ) : (
              <Link
                href={route('login')}
                className="mt-2 py-3 px-3 rounded-xl text-center text-sm font-semibold text-slate-700 border border-slate-200"
                onClick={() => setMobileOpen(false)}
              >
                {t('welcome.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
