// resources/js/Components/Welcome/EthiqueSection.jsx

import { useTranslation } from 'react-i18next';
import { IconCheck, PILIER_COLORS } from './constants';

// ── Section Piliers Éthiques ─────────────────────────────────────────────────
export function EthiqueSection() {
  const { t } = useTranslation();
  const pillars = t('welcomePage.ethics.pillars', { returnObjects: true }) || [];

  return (
    <section id="ethique" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Glow central */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full mb-4">
            {t('welcomePage.ethics.sectionBadge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {t('welcomePage.ethics.title')}
            <span style={{ color: '#10B981' }}>{t('welcomePage.ethics.titleHighlight')}</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            {t('welcomePage.ethics.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {Array.isArray(pillars) && pillars.map((pillar, idx) => {
            const color = PILIER_COLORS[idx] || '#2563EB';
            const { emoji, title, subtitle, points } = pillar;
            return (
              <div key={title}
                className="rounded-2xl p-7 border transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${color}30` }}>
                <div className="text-4xl mb-4">{emoji}</div>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{subtitle}</span>
                <h3 className="text-2xl font-black text-white mb-4">{title}</h3>
                <ul className="space-y-2.5">
                  {(points || []).map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-slate-400 text-sm">
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: `${color}20`, color }}>
                        <IconCheck />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Citation */}
        <div className="mt-14 text-center">
          <blockquote className="text-xl md:text-2xl font-bold text-white/80 max-w-2xl mx-auto italic">
            &ldquo;{t('welcomePage.ethics.quote')}{' '}
            <span style={{ color: '#10B981' }}>{t('welcomePage.ethics.quoteHighlight')}</span>&rdquo;
          </blockquote>
          <p className="text-slate-500 text-sm mt-3">{t('welcomePage.ethics.quoteAuthor')}</p>
        </div>
      </div>
    </section>
  );
}

// ── Section Méthodologie PIDR ────────────────────────────────────────────────
export function MethodologieSection() {
  const { t } = useTranslation();
  const steps = t('welcomePage.steps', { returnObjects: true }) || [];

  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-4">
            {t('welcomePage.methodology.sectionBadge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            {t('welcomePage.methodology.title')} <span className="gradient-text">{t('welcomePage.methodology.titleHighlight')}</span>
          </h2>
        </div>

        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-indigo-200 to-transparent md:-translate-x-0.5" />

          {Array.isArray(steps) && steps.map(({ step, title, desc, side }) => (
            <div key={step}
              className={`relative flex items-start gap-4 mb-10 md:mb-8 pl-14 md:pl-0 ${
                side === 'right' ? 'md:flex-row-reverse md:text-right' : 'md:flex-row md:text-left'
              }`}>
              {/* Nœud */}
              <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-xl bg-white border-2 border-blue-200 shadow-sm flex items-center justify-center z-10">
                <span className="text-xs font-black text-blue-600">{step}</span>
              </div>

              <div className={`md:w-[calc(50%-3rem)] ${side === 'right' ? 'md:ml-auto md:pl-6' : 'md:mr-auto md:pr-6'} bg-white rounded-2xl border border-gray-100 shadow-sm p-5`}>
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-slate-500 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
