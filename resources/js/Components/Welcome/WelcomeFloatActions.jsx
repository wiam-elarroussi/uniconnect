import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Contact : bas-gauche → ancre vers la zone « Contactez-nous ».
 * Retour en haut : bas-droite (visible après scroll).
 */
export default function WelcomeFloatActions() {
  const { t } = useTranslation();
  const [showTop, setShowTop] = useState(false);

  const onScroll = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    setShowTop(window.scrollY > 420);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById('contactez-nous') || document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const safeArea = { paddingBottom: 'env(safe-area-inset-bottom, 0px)' };

  return (
    <>
      <div
        className="pointer-events-auto fixed bottom-6 left-4 z-40 sm:bottom-8 sm:left-6"
        style={safeArea}
      >
        <a
          href="#contactez-nous"
          onClick={scrollToContact}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/90 text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur-md transition-transform hover:scale-105 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-200 dark:shadow-black/30"
          title={t('welcome.floatContact')}
          aria-label={t('welcome.floatContact')}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </a>
      </div>

      {showTop && (
        <div
          className="pointer-events-auto fixed bottom-6 right-4 z-40 sm:bottom-8 sm:right-6"
          style={safeArea}
        >
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 dark:border-sky-500/30"
            title={t('welcome.floatBackTop')}
            aria-label={t('welcome.floatBackTop')}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
