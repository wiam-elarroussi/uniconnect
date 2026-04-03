// resources/js/Pages/Welcome.jsx

import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import WelcomeStyles                          from '@/Components/Welcome/WelcomeStyles';
import WelcomeNav                             from '@/Components/Welcome/WelcomeNav';
import HeroSection                            from '@/Components/Welcome/HeroSection';
import { TickerBand, FeaturesSection }        from '@/Components/Welcome/FeaturesSection';
import { EthiqueSection, MethodologieSection } from '@/Components/Welcome/EthiqueSection';
import {
  TestimonialsSection,
  CtaSection,
  WelcomeFooter,
} from '@/Components/Welcome/TestimonialsSection';

function ContactSection() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, wasSuccessful } = useForm({
    name: '',
    email: '',
    body: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('contact.store'));
  };

  return (
    <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto rounded-3xl border border-blue-100 bg-white/85 backdrop-blur p-8 md:p-10">
        <h3 className="text-2xl font-black text-slate-900 mb-3">{t('welcome.contactTitle')}</h3>
        <p className="text-slate-600 mb-6">
          {t('welcome.contactIntro')}
        </p>
        <div className="flex flex-wrap gap-3 mb-8">
          <a
            href="mailto:contact@uniconnect.ma"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow-md shadow-blue-200/50 hover:bg-blue-500 transition-colors"
          >
            {t('welcome.email')}
          </a>
          <a
            href="https://wa.me/212776564469"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-800 font-semibold hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
          >
            {t('welcome.whatsapp')}
          </a>
        </div>

        {wasSuccessful && (
          <p className="mb-4 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            {t('welcome.contactSuccess')}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t('welcome.name')}</label>
              <input
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                required
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t('welcome.email')}</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                required
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">{t('welcome.message')}</label>
            <textarea
              value={data.body}
              onChange={(e) => setData('body', e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              required
            />
            {errors.body && <p className="text-xs text-red-600 mt-1">{errors.body}</p>}
          </div>
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 disabled:opacity-50"
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
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled]   = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const heroRef                   = useRef(null);
  const testimonialItems = t('welcomePage.testimonials.items', { returnObjects: true });
  const testimonialCount = Array.isArray(testimonialItems) ? testimonialItems.length : 6;

  // Halo souris + scroll
  useEffect(() => {
    const onMove   = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Auto-rotation témoignages
  useEffect(() => {
    if (testimonialCount < 1) return undefined;
    const id = setInterval(() => setActiveTab((p) => (p + 1) % testimonialCount), 4000);
    return () => clearInterval(id);
  }, [testimonialCount]);

  return (
    <>
      <Head title={t('welcomePage.headTitle')} />
      <WelcomeStyles />

      <div className="relative bg-slate-50 overflow-x-hidden min-w-0">

        {/* Halo souris */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: `radial-gradient(700px at ${mousePos.x}px ${mousePos.y}px, rgba(37,99,235,0.10), transparent 70%)` }}
        />

        {/* Blobs fond */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full pulse-slow"
               style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-15%] right-[-10%] w-[40vw] h-[40vw] rounded-full pulse-slow"
               style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%)', animationDelay: '2.5s' }} />
        </div>

        <WelcomeNav auth={auth} scrolled={scrolled} />
        <HeroSection auth={auth} heroRef={heroRef} />
        <TickerBand />
        <FeaturesSection />
        <EthiqueSection />
        <MethodologieSection />
        <TestimonialsSection activeTab={activeTab} setActiveTab={setActiveTab} />
        <ContactSection />
        <CtaSection />
        <WelcomeFooter />

      </div>
    </>
  );
}