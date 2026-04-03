// resources/js/Components/Welcome/HeroSection.jsx

import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { IconArrow, IconCheck, IconZap } from './constants';

export default function HeroSection({ auth, heroRef }) {
  const { t } = useTranslation();
  const stats = t('welcomePage.stats', { returnObjects: true }) || [];

  return (
    <section
      ref={heroRef}
      className="relative hero-grid min-h-[100dvh] min-h-screen flex flex-col items-center justify-center pt-[max(5.5rem,env(safe-area-inset-top))] sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6"
    >

      {/* Badge */}
      <div className="fade-up mb-8" style={{ animationDelay: '0.1s' }}>
        <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          {t('welcomePage.hero.badge')}
        </span>
      </div>

      {/* Logo flottant */}
      <div className="fade-up mb-8 float" style={{ animationDelay: '0.2s' }}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl blur-xl opacity-30 scale-110" />
          <img
            src="/logo_transparent.png"
            alt="UniConnect Logo"
            className="relative h-20 w-20 sm:h-24 sm:w-24 object-contain rounded-3xl shadow-2xl border-4 border-white bg-white"
          />
          <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <IconCheck />
          </div>
        </div>
      </div>

      {/* Titre */}
      <h1
        className="fade-up text-center font-black tracking-tight mb-5 leading-[1.05]"
        style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', animationDelay: '0.25s' }}
      >
        <span className="text-slate-900">Uni</span>
        <span className="gradient-text">Connect</span>
        <br />
        <span className="shimmer-text" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700 }}>
          {t('welcomePage.hero.tagline')}
        </span>
      </h1>

      {/* Sous-titre */}
      <p className="fade-up text-slate-500 text-lg leading-relaxed max-w-xl text-center mb-10"
         style={{ animationDelay: '0.35s' }}>
        {t('welcomePage.hero.subtitleBefore')}
        <span className="text-blue-600 font-semibold">{t('welcomePage.hero.subtitleHighlight')}</span>
        {t('welcomePage.hero.subtitleAfter')}
      </p>

      {/* CTAs */}
      <div className="fade-up flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center w-full max-w-md sm:max-w-none mb-10 sm:mb-14 px-1"
           style={{ animationDelay: '0.45s' }}>
        <Link href={route('register')}
          className="btn-primary px-6 sm:px-8 py-3.5 text-white font-bold rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto">
          {t('welcomePage.hero.ctaJoin')} <IconArrow />
        </Link>
        <a href="#features"
          className="px-6 sm:px-8 py-3.5 bg-white border border-gray-200 text-slate-700 font-semibold rounded-2xl text-sm sm:text-base hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto">
          <IconZap /> {t('welcomePage.hero.ctaDiscover')}
        </a>
      </div>

      {/* Stats */}
      <div className="fade-up w-full max-w-3xl" style={{ animationDelay: '0.55s' }}>
        <div className="glass rounded-2xl border border-white/60 shadow-xl px-2 sm:px-4 py-4 sm:py-5 grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 w-full max-w-3xl mx-auto">
          {Array.isArray(stats) && stats.map((row) => (
            <div key={row.label} className="text-center py-2 md:py-0 px-4">
              <p className="text-2xl font-black gradient-text">{row.value}</p>
              <p className="text-slate-400 text-xs font-medium mt-0.5">{row.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <span className="text-xs text-slate-400 font-mono uppercase tracking-widest">{t('welcomePage.hero.scroll')}</span>
        <div className="w-px h-10 bg-gradient-to-b from-slate-400 to-transparent" />
      </div>
    </section>
  );
}
