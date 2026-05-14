// resources/js/Components/Welcome/HeroSection.jsx

import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { IconArrow, IconCheck, IconZap } from './constants';

export default function HeroSection({ heroRef }) {
  const { t } = useTranslation();
  const stats = t('welcomePage.stats', { returnObjects: true }) || [];

  return (
    <section
      ref={heroRef}
      className="hero-grid relative flex min-h-screen min-h-[100dvh] flex-col items-center justify-center px-4 pt-[max(5.5rem,env(safe-area-inset-top))] pb-12 sm:px-6 sm:pb-16 sm:pt-24"
    >
      <div className="fade-up mb-8" style={{ animationDelay: '0.1s' }}>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          {t('welcomePage.hero.badge')}
        </span>
      </div>

      <div className="float fade-up mb-8" style={{ animationDelay: '0.2s' }}>
        <div className="relative">
          <div className="absolute inset-0 scale-110 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 opacity-30 blur-xl dark:opacity-20" />
          <img
            src="/logo_transparent.png"
            alt="UniConnect Logo"
            className="relative h-20 w-20 rounded-3xl border-4 border-white bg-white object-contain shadow-2xl sm:h-24 sm:w-24 dark:border-slate-700 dark:bg-slate-900"
          />
          <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg dark:border-slate-800">
            <IconCheck />
          </div>
        </div>
      </div>

      <h1
        className="fade-up mb-5 text-center font-black leading-[1.05] tracking-tight"
        style={{ fontSize: 'clamp(2.2rem, 8vw, 5.5rem)', animationDelay: '0.25s' }}
      >
        <span className="text-slate-900 dark:text-slate-100">Uni</span>
        <span className="gradient-text">Connect</span>
        <br />
        <span
          className="block text-center font-bold
            bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800
            bg-clip-text text-transparent [background-size:200%_auto] animate-shimmer
            dark:from-slate-100 dark:via-sky-300 dark:to-indigo-200"
          style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}
        >
          {t('welcomePage.hero.tagline')}
        </span>
      </h1>

      <p
        className="fade-up mb-10 max-w-xl text-center text-lg leading-relaxed text-slate-500 dark:text-slate-400"
        style={{ animationDelay: '0.35s' }}
      >
        {t('welcomePage.hero.subtitleBefore')}
        <span className="font-semibold text-blue-600 dark:text-sky-400">{t('welcomePage.hero.subtitleHighlight')}</span>
        {t('welcomePage.hero.subtitleAfter')}
      </p>

      <div
        className="fade-up mb-10 flex w-full max-w-md flex-col items-stretch justify-center gap-3 px-1 sm:mb-14 sm:max-w-none sm:flex-row sm:items-center"
        style={{ animationDelay: '0.45s' }}
      >
        <Link
          href={route('register')}
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white sm:w-auto sm:px-8 sm:text-base"
        >
          {t('welcomePage.hero.ctaJoin')} <IconArrow />
        </Link>
        <a
          href="#features"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:text-sky-300 sm:w-auto sm:px-8 sm:text-base"
        >
          <IconZap /> {t('welcomePage.hero.ctaDiscover')}
        </a>
      </div>

      <div className="fade-up w-full max-w-3xl" style={{ animationDelay: '0.55s' }}>
        <div className="glass mx-auto grid w-full max-w-3xl grid-cols-2 gap-0 divide-y rounded-2xl border border-white/60 shadow-xl dark:divide-slate-700/80 md:grid-cols-4 md:divide-x md:divide-y-0">
          {Array.isArray(stats) &&
            stats.map((row) => (
              <div key={row.label} className="px-4 py-2 text-center md:py-0">
                <p className="text-2xl font-black">
                  <span className="gradient-text">{row.value}</span>
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">{row.label}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 opacity-40">
        <span className="font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">{t('welcomePage.hero.scroll')}</span>
        <div className="h-10 w-px bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-500" />
      </div>
    </section>
  );
}
