// resources/js/Components/Welcome/TestimonialsSection.jsx

import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { IconArrow, IconShield, IconStar } from './constants';

// ── Carte Témoignage ──────────────────────────────────────────────────────────
function TestimonialCard({ name, role, text, avatar }) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400"><IconStar /></span>
        ))}
      </div>
      <p className="text-slate-600 text-lg leading-relaxed mb-6 italic">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          {avatar}
        </div>
        <div>
          <p className="text-slate-900 font-bold">{name}</p>
          <p className="text-blue-600 text-xs font-medium">{role}</p>
        </div>
      </div>
    </div>
  );
}

// ── Section Témoignages ───────────────────────────────────────────────────────
export function TestimonialsSection({ activeTab, setActiveTab }) {
  const { t } = useTranslation();
  const items = t('welcomePage.testimonials.items', { returnObjects: true }) || [];
  const titleLine2 = t('welcomePage.testimonials.titleLine2');

  return (
    <section id="community" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-blue-50/60 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full mb-4">
            {t('welcomePage.testimonials.sectionBadge')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            {t('welcomePage.testimonials.titleLine1')}
            <br />
            <span className="gradient-text">{t('welcomePage.testimonials.titleHighlight')}</span>
            {titleLine2 ? (
              <>
                {' '}
                {titleLine2}
              </>
            ) : null}
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative h-[350px] md:h-[280px]">
          {Array.isArray(items) && items.map((row, i) => (
            <div
              key={`testimonial-${i}`}
              className="absolute inset-0 transition-all duration-700 ease-in-out"
              style={{
                opacity: activeTab === i ? 1 : 0,
                transform: activeTab === i ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.9)',
                filter: activeTab === i ? 'blur(0px)' : 'blur(4px)',
                pointerEvents: activeTab === i ? 'auto' : 'none',
                zIndex: activeTab === i ? 20 : 10,
              }}
            >
              <div className="max-w-2xl mx-auto px-4">
                <TestimonialCard {...row} />
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.isArray(items) && items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`transition-all duration-500 rounded-full ${
                activeTab === i
                  ? 'w-10 h-2 bg-blue-600 shadow-lg shadow-blue-200'
                  : 'w-2 h-2 bg-blue-200 hover:bg-blue-300'
              }`}
              aria-label={t('welcomePage.testimonials.ariaDot', { n: i + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section CTA Final ─────────────────────────────────────────────────────────
export function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {t('welcomePage.cta.badge')}
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              {t('welcomePage.cta.title')}
              <br />
              {t('welcomePage.cta.titleLine2')}
            </h2>

            <p className="text-blue-100 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              {t('welcomePage.cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={route('register')}
                className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl text-base flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                {t('welcomePage.cta.createAccount')} <IconArrow />
              </Link>
              <Link href={route('login')}
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl text-base flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/20">
                {t('welcomePage.cta.alreadyMember')}
              </Link>
            </div>

            <p className="text-blue-200/70 text-xs mt-6 flex items-center justify-center gap-1.5">
              <IconShield /> {t('welcomePage.cta.footerLine')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function WelcomeFooter() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 border-t border-gray-100 bg-white/60 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <div className="flex items-center gap-3 font-bold text-slate-700">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img src="/logo_transparent.png" alt="" className="w-full h-full object-contain" />
          </div>
          Uni<span className="text-blue-600">Connect</span>
        </div>
        <p className="text-center">
          {t('welcomePage.footer.credit')}{' '}
          <span className="text-slate-500 font-medium">{t('welcomePage.footer.engineered')}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-xs">{t('welcomePage.footer.tagline')}</span>
        </div>
      </div>
    </footer>
  );
}
