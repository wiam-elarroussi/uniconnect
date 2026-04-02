// resources/js/Components/Welcome/FeaturesSection.jsx

import { useState } from 'react';
import { FEATURES, TICKER_TAGS } from './constants';

// ── Ticker ──────────────────────────────────────────────────────────────────
export function TickerBand() {
  return (
    <div className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 py-3 overflow-hidden">
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              {TICKER_TAGS.map(tag => (
                <span key={tag} className="flex items-center gap-2 text-white/90 text-sm font-medium whitespace-nowrap">
                  <span className="text-emerald-300">✦</span> {tag}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FeatureCard ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, color, title, desc, badge, index }) {
  const [hovered, setHovered] = useState(false);

  const colorMap = {
    blue:    { ring: '#2563EB', bg: '#EFF6FF', text: '#2563EB', badge: '#DBEAFE', badgeText: '#1D4ED8' },
    indigo:  { ring: '#4F46E5', bg: '#EEF2FF', text: '#4F46E5', badge: '#E0E7FF', badgeText: '#3730A3' },
    emerald: { ring: '#10B981', bg: '#ECFDF5', text: '#10B981', badge: '#D1FAE5', badgeText: '#065F46' },
  };
  const c = colorMap[color];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px -12px ${c.ring}30` : '0 1px 3px rgba(0,0,0,0.07)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        animationDelay: `${index * 80}ms`,
      }}
      className="relative bg-white rounded-2xl p-6 border border-gray-100 cursor-default fade-up"
    >
      {/* Accent line */}
      <div style={{ background: c.ring, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}
           className="absolute top-0 left-6 right-6 h-0.5 rounded-full" />

      <div style={{ background: c.bg, color: c.text }}
           className="w-11 h-11 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>

      <span style={{ background: c.badge, color: c.badgeText }}
            className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
        {badge}
      </span>

      <h3 className="text-slate-900 font-bold text-base mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ── FeaturesSection ──────────────────────────────────────────────────────────
export function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-4">
            Fonctionnalités
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            Conçu pour <span className="gradient-text">vous protéger</span><br />autant que vous aider
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Chaque feature a été réfléchie à travers le prisme du Triple Bottom Line : People, Planet, Profit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </div>
    </section>
  );
}