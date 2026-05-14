// resources/js/Components/Welcome/FeaturesSection.jsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FEATURE_LAYOUT } from './constants';

const TAILWIND_ICON = {
  blue:    'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300',
  indigo:  'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300',
  emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300',
};

const TAILWIND_BADGE = {
  blue:    'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200',
  indigo:  'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200',
  emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200',
};

const RING = { blue: '#2563EB', indigo: '#4F46E5', emerald: '#10B981' };

export function TickerBand() {
  const { t } = useTranslation();
  const tags = t('welcomePage.ticker', { returnObjects: true }) || [];

  return (
    <div className="relative z-10 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 py-3 dark:from-blue-800 dark:to-indigo-900">
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              {Array.isArray(tags) && tags.map((tag) => (
                <span key={`${i}-${tag}`} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-white/90">
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

function FeatureCard({ icon, color, title, desc, badge, index }) {
  const [hovered, setHovered] = useState(false);
  const ring = RING[color] || RING.blue;
  const twIcon = TAILWIND_ICON[color] || TAILWIND_ICON.blue;
  const twBadge = TAILWIND_BADGE[color] || TAILWIND_BADGE.blue;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px -12px ${ring}30` : '0 1px 3px rgba(0,0,0,0.07)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        animationDelay: `${index * 80}ms`,
      }}
      className="fade-up relative cursor-default rounded-2xl border border-gray-100 bg-white p-6 dark:border-slate-700/80 dark:bg-slate-900/50 dark:shadow-lg dark:shadow-black/20"
    >
      <div
        style={{ background: ring, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}
        className="absolute left-6 right-6 top-0 h-0.5 rounded-full"
      />

      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${twIcon}`}>
        {icon}
      </div>

      <span className={`mb-3 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${twBadge}`}>
        {badge}
      </span>

      <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );
}

export function FeaturesSection() {
  const { t } = useTranslation();
  const items = t('welcomePage.featureItems', { returnObjects: true }) || [];

  return (
    <section id="features" className="relative z-10 scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 md:scroll-mt-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            {t('welcomePage.features.sectionBadge')}
          </span>
          <h2 className="mb-4 text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-slate-100">
            {t('welcomePage.features.titleLine1')} <span className="gradient-text">{t('welcomePage.features.titleHighlight')}</span>
            <br />
            {t('welcomePage.features.titleLine2')}
          </h2>
          <p className="mx-auto max-w-xl text-slate-500 dark:text-slate-400">{t('welcomePage.features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_LAYOUT.map((layout, i) => {
            const item = items[i];
            if (!item) {
              return null;
            }
            return (
              <FeatureCard
                key={i}
                icon={layout.icon}
                color={layout.color}
                title={item.title}
                desc={item.desc}
                badge={item.badge}
                index={i}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
