// resources/js/Components/Welcome/TestimonialsSection.jsx

import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { IconArrow, IconShield, IconStar } from './constants';

function TestimonialCard({ name, role, text, avatar }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/50 dark:shadow-xl dark:shadow-black/20">
      <div className="mb-4 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            <IconStar />
          </span>
        ))}
      </div>
      <p className="mb-6 text-lg italic leading-relaxed text-slate-600 dark:text-slate-300">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
          {avatar}
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{name}</p>
          <p className="text-xs font-medium text-blue-600 dark:text-sky-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({ activeTab, setActiveTab }) {
  const { t } = useTranslation();
  const items = t('welcomePage.testimonials.items', { returnObjects: true }) || [];
  const titleLine2 = t('welcomePage.testimonials.titleLine2');

  return (
    <section
      id="community"
      className="relative z-10 scroll-mt-24 overflow-hidden bg-blue-50/60 px-4 py-16 sm:px-6 sm:py-24 dark:bg-slate-900/50 md:scroll-mt-28"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 dark:bg-sky-500/10 dark:text-sky-300">
            {t('welcomePage.testimonials.sectionBadge')}
          </span>
          <h2 className="mb-4 text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-slate-100">
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

        <div className="relative h-[350px] md:h-[280px]">
          {Array.isArray(items) &&
            items.map((row, i) => (
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
                <div className="mx-auto max-w-2xl px-4">
                  <TestimonialCard {...row} />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-12 flex justify-center gap-3">
          {Array.isArray(items) &&
            items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`transition-all duration-500 rounded-full ${
                  activeTab === i
                    ? 'h-2 w-10 bg-blue-600 shadow-lg shadow-blue-200 dark:shadow-cyan-500/20'
                    : 'h-2 w-2 bg-blue-200 hover:bg-blue-300 dark:bg-slate-600 dark:hover:bg-slate-500'
                }`}
                aria-label={t('welcomePage.testimonials.ariaDot', { n: i + 1 })}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-12 shadow-2xl dark:from-slate-800 dark:via-indigo-900 dark:to-slate-900">
          <div className="absolute -right-4 top-0 h-48 w-48 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
          <div className="absolute -left-4 bottom-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10" />

          <div className="relative">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              {t('welcomePage.cta.badge')}
            </span>

            <h2 className="mb-5 text-4xl font-black leading-tight text-white md:text-5xl">
              {t('welcomePage.cta.title')}
              <br />
              {t('welcomePage.cta.titleLine2')}
            </h2>

            <p className="mx-auto mb-8 max-w-md text-lg leading-relaxed text-blue-100 dark:text-slate-200">
              {t('welcomePage.cta.subtitle')}
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={route('register')}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl dark:bg-slate-100 dark:text-indigo-900 dark:hover:bg-white"
              >
                {t('welcomePage.cta.createAccount')} <IconArrow />
              </Link>
              <Link
                href={route('login')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/20"
              >
                {t('welcomePage.cta.alreadyMember')}
              </Link>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-blue-200/70 dark:text-slate-300/90">
              <IconShield /> {t('welcomePage.cta.footerLine')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WelcomeFooter() {
  const { t } = useTranslation();
  const links = [
    { href: '#features', label: t('welcome.navFeatures') },
    { href: '#ethique', label: t('welcome.navEthics') },
    { href: '#community', label: t('welcome.navCommunity') },
  ];

  return (
    <footer className="relative z-10 border-t border-gray-100 bg-white/60 py-10 px-6 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-200">
            <div className="h-10 w-10 overflow-hidden rounded-lg">
              <img src="/logo_transparent.png" alt="" className="h-full w-full object-contain" />
            </div>
            <span>
              Uni<span className="text-blue-600 dark:text-sky-400">Connect</span>
            </span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400" aria-label={t('welcome.footerNavAria')}>
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="transition-colors hover:text-blue-600 dark:hover:text-sky-400"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-6 text-sm text-slate-400 dark:border-slate-800 sm:flex-row">
          <p className="text-center sm:text-left">
            {t('welcomePage.footer.credit')}{' '}
            <span className="font-medium text-slate-500 dark:text-slate-400">{t('welcomePage.footer.engineered')}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs dark:text-slate-400">{t('welcomePage.footer.tagline')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
