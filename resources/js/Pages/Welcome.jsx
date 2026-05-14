// resources/js/Pages/Welcome.jsx

import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import WelcomeStyles from '@/Components/Welcome/WelcomeStyles';
import WelcomeNav from '@/Components/Welcome/WelcomeNav';
import HeroSection from '@/Components/Welcome/HeroSection';
import { TickerBand, FeaturesSection } from '@/Components/Welcome/FeaturesSection';
import { EthiqueSection } from '@/Components/Welcome/EthiqueSection';
import { TestimonialsSection, CtaSection, WelcomeFooter } from '@/Components/Welcome/TestimonialsSection';
import WelcomeFloatActions from '@/Components/Welcome/WelcomeFloatActions';
import { WelcomeMoodContext, WELCOME_MOOD_STORAGE_KEY } from '@/Components/Welcome/WelcomeMoodContext';

function ContactSection() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, wasSuccessful } = useForm({
    name: '',
    email: '',
    body: '',
  });
  const openForm = useForm({ body: '' });
  const [openSuccess, setOpenSuccess] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post(route('contact.store'));
  };

  const submitOpen = (e) => {
    e.preventDefault();
    setOpenSuccess(false);
    openForm.post(route('contact.open'), {
      onSuccess: () => {
        openForm.reset('body');
        setOpenSuccess(true);
      },
    });
  };

  return (
    <section
      id="contact"
      className="relative z-10 scroll-mt-24 px-4 py-16 sm:scroll-mt-28 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-4xl rounded-3xl border border-blue-100 bg-white/85 p-8 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 md:p-10">
        <h3
          id="contactez-nous"
          className="mb-3 text-2xl font-black text-slate-900 dark:text-slate-100"
        >
          {t('welcome.contactTitle')}
        </h3>
        <p className="mb-6 text-slate-600 dark:text-slate-400">{t('welcome.contactIntro')}</p>
        <div className="mb-8 flex flex-wrap gap-3">
          <a
            href="mailto:contact@uniconnect.ma"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200/50 transition-colors hover:bg-blue-500 dark:shadow-slate-900/30"
          >
            {t('welcome.email')}
          </a>
          <a
            href="https://wa.me/212776564469"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-600 dark:text-slate-200 dark:hover:border-sky-500/40 dark:hover:bg-slate-800/50"
          >
            {t('welcome.whatsapp')}
          </a>
        </div>

        <div className="mb-8 rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-5 dark:border-indigo-500/25 dark:bg-indigo-950/30">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('welcome.openMessageTitle')}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {t('welcome.openMessageIntro')}
          </p>
          <form onSubmit={submitOpen} className="mt-4 space-y-3">
            <textarea
              value={openForm.data.body}
              onChange={(e) => openForm.setData('body', e.target.value)}
              rows={4}
              required
              placeholder={t('welcome.openMessagePlaceholder')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950/50 dark:text-slate-100"
            />
            {openForm.errors.body && <p className="text-xs text-red-600 dark:text-rose-400">{openForm.errors.body}</p>}
            {openSuccess && (
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{t('welcome.openMessageSuccess')}</p>
            )}
            <button
              type="submit"
              disabled={openForm.processing}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              {openForm.processing ? t('welcome.sending') : t('welcome.openMessageSend')}
            </button>
          </form>
        </div>

        <p className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{t('welcome.classicFormTitle')}</p>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">{t('welcome.classicFormNote')}</p>

        {wasSuccessful && (
          <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
            {t('welcome.contactSuccess')}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">{t('welcome.name')}</label>
              <input
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950/50 dark:text-slate-100"
                required
              />
              {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-rose-400">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">{t('welcome.email')}</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950/50 dark:text-slate-100"
                required
              />
              {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-rose-400">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">{t('welcome.message')}</label>
            <textarea
              value={data.body}
              onChange={(e) => setData('body', e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950/50 dark:text-slate-100"
              required
            />
            {errors.body && <p className="mt-1 text-xs text-red-600 dark:text-rose-400">{errors.body}</p>}
          </div>
          <button
            type="submit"
            disabled={processing}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-50 dark:hover:bg-indigo-500"
          >
            {processing ? t('welcome.sending') : t('welcome.sendMessage')}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function Welcome({ auth }) {
  const { t } = useTranslation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const heroRef = useRef(null);
  const testimonialItems = t('welcomePage.testimonials.items', { returnObjects: true });
  const testimonialCount = Array.isArray(testimonialItems) ? testimonialItems.length : 6;

  const [moodId, setMoodId] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    const s = window.localStorage.getItem(WELCOME_MOOD_STORAGE_KEY);
    return s === 'dark' || s === 'light' ? s : 'light';
  });

  const toggleMood = useCallback(() => {
    setMoodId((m) => (m === 'dark' ? 'light' : 'dark'));
  }, []);

  const moodValue = useMemo(
    () => ({ mood: moodId, setMood: setMoodId, toggleMood }),
    [moodId, toggleMood]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    window.localStorage.setItem(WELCOME_MOOD_STORAGE_KEY, moodId);
    window.dispatchEvent(new CustomEvent('uniconnect:mood-change', { detail: { moodId } }));
  }, [moodId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const onMood = (e) => {
      const next = e?.detail?.moodId;
      if (next === 'dark' || next === 'light') {
        setMoodId(next);
      }
    };
    const onStorage = (e) => {
      if (e.key === WELCOME_MOOD_STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
        setMoodId(e.newValue);
      }
    };
    window.addEventListener('uniconnect:mood-change', onMood);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('uniconnect:mood-change', onMood);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    const onMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (testimonialCount < 1) {
      return undefined;
    }
    const id = setInterval(() => setActiveTab((p) => (p + 1) % testimonialCount), 4000);
    return () => clearInterval(id);
  }, [testimonialCount]);

  return (
    <>
      <Head title={t('welcomePage.headTitle')} />
      <WelcomeStyles />

      <WelcomeMoodContext.Provider value={moodValue}>
        <div className={moodId === 'dark' ? 'dark' : ''}>
          <div
            className="relative min-w-0 overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 [color-scheme:light] dark:bg-slate-950 dark:text-slate-100 dark:[color-scheme:dark]"
          >
            <div
              className="pointer-events-none fixed inset-0 z-0 dark:hidden"
              style={{
                background: `radial-gradient(700px at ${mousePos.x}px ${mousePos.y}px, rgba(37,99,235,0.10), transparent 70%)`,
              }}
            />
            <div
              className="pointer-events-none fixed inset-0 z-0 hidden dark:block"
              style={{
                background: `radial-gradient(700px at ${mousePos.x}px ${mousePos.y}px, rgba(56,189,248,0.12), transparent 70%)`,
              }}
            />

            <div className="pointer-events-none fixed left-0 top-0 z-0 h-full w-full overflow-hidden dark:hidden">
              <div
                className="absolute left-[-10%] top-[-20%] h-[50vw] w-[50vw] rounded-full pulse-slow"
                style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)' }}
              />
              <div
                className="absolute bottom-[-15%] right-[-10%] h-[40vw] w-[40vw] rounded-full pulse-slow"
                style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%)', animationDelay: '2.5s' }}
              />
            </div>
            <div className="pointer-events-none fixed left-0 top-0 z-0 hidden h-full w-full overflow-hidden dark:block">
              <div
                className="absolute left-[-10%] top-[-20%] h-[50vw] w-[50vw] rounded-full pulse-slow"
                style={{ background: 'radial-gradient(circle, rgba(30,64,175,0.2) 0%, transparent 70%)' }}
              />
              <div
                className="absolute bottom-[-15%] right-[-10%] h-[40vw] w-[40vw] rounded-full pulse-slow"
                style={{ background: 'radial-gradient(circle, rgba(67,56,202,0.15) 0%, transparent 70%)', animationDelay: '2.5s' }}
              />
            </div>

            <WelcomeNav auth={auth} scrolled={scrolled} />
            <WelcomeFloatActions />
            <HeroSection heroRef={heroRef} />
            <TickerBand />
            <FeaturesSection />
            <EthiqueSection />
            <TestimonialsSection activeTab={activeTab} setActiveTab={setActiveTab} />
            <ContactSection />
            <CtaSection />
            <WelcomeFooter />
          </div>
        </div>
      </WelcomeMoodContext.Provider>
    </>
  );
}
