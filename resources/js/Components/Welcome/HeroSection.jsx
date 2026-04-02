// resources/js/Components/Welcome/HeroSection.jsx

import { Link } from '@inertiajs/react';
import { IconArrow, IconCheck, IconZap, STATS } from './constants';

export default function HeroSection({ auth, heroRef }) {
  return (
    <section ref={heroRef} className="relative hero-grid min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6">

      {/* Badge */}
      <div className="fade-up mb-8" style={{ animationDelay: '0.1s' }}>
        <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Projet PIDR · SupMTI · Mars 2026
        </span>
      </div>

      {/* Logo flottant */}
      <div className="fade-up mb-8 float" style={{ animationDelay: '0.2s' }}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl blur-xl opacity-30 scale-110" />
          <img
            src="/logo_transparent.png"
            alt="UniConnect Logo"
            className="relative h-24 w-24 object-contain rounded-3xl shadow-2xl border-4 border-white bg-white"
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
          L'Entraide Académique Éthique
        </span>
      </h1>

      {/* Sous-titre */}
      <p className="fade-up text-slate-500 text-lg leading-relaxed max-w-xl text-center mb-10"
         style={{ animationDelay: '0.35s' }}>
        Le premier réseau social{' '}
        <span className="text-blue-600 font-semibold">exclusif aux étudiants SupMTI</span>.
        Conçu pour l'intelligence collective — sans manipulation, sans publicité, sans dépendance.
      </p>

      {/* CTAs */}
      <div className="fade-up flex flex-col sm:flex-row gap-3 items-center justify-center mb-14"
           style={{ animationDelay: '0.45s' }}>
        <Link href={route('register')}
          className="btn-primary px-8 py-3.5 text-white font-bold rounded-2xl text-base flex items-center gap-2">
          Rejoindre la communauté <IconArrow />
        </Link>
        <a href="#features"
          className="px-8 py-3.5 bg-white border border-gray-200 text-slate-700 font-semibold rounded-2xl text-base hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm flex items-center gap-2">
          <IconZap /> Découvrir le projet
        </a>
      </div>

      {/* Stats */}
      <div className="fade-up w-full max-w-3xl" style={{ animationDelay: '0.55s' }}>
        <div className="glass rounded-2xl border border-white/60 shadow-xl px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center py-2 md:py-0 px-4">
              <p className="text-2xl font-black gradient-text">{value}</p>
              <p className="text-slate-400 text-xs font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <span className="text-xs text-slate-400 font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-slate-400 to-transparent" />
      </div>
    </section>
  );
}