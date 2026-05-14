import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link } from '@inertiajs/react';
import { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const GuestThemeContext = createContext(false);

export default function GuestLayout({ children }) {
    const { t } = useTranslation();

    const features = [
        { icon: '\u{1F4F0}', text: t('guest.features.feed') },
        { icon: '\u{1F4AC}', text: t('guest.features.messages') },
        { icon: '\u{1F4E1}', text: t('guest.features.channels') },
        { icon: '\u{1F4DA}', text: t('guest.features.library') },
        { icon: '\u{1F30D}', text: t('guest.features.interface') },
    ];
    const [isDark, setIsDark] = useState(() =>
        typeof window !== 'undefined' &&
        window.localStorage.getItem('uniconnect.dashboard.mood') === 'dark'
    );

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'uniconnect.dashboard.mood') setIsDark(e.newValue === 'dark');
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    return (
        <div className="min-h-screen flex">

            {/* Left branding panel — desktop only */}
            <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between p-10 relative overflow-hidden"
                 style={{ background: 'linear-gradient(145deg, #0b1437 0%, #0f2060 40%, #0a1a4a 100%)' }}>

                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none"
                     style={{
                         backgroundImage: 'linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px)',
                         backgroundSize: '40px 40px'
                     }} />

                {/* Decorative blobs */}
                <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
                     style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)' }} />
                <div className="absolute bottom-20 right-0 w-56 h-56 rounded-full pointer-events-none"
                     style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)' }} />

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                            <img src="/logo_transparent.png" alt="UniConnect" className="w-full h-full object-contain p-1" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">
                            Uni<span style={{ background: 'linear-gradient(90deg,#60a5fa,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Connect</span>
                        </span>
                    </Link>
                </div>

                {/* Center content */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-3">
                            {t('guest.headline1')}<br />
                            <span style={{ background: 'linear-gradient(90deg,#60a5fa,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                {t('guest.headline2')}
                            </span>
                        </h2>
                        <p className="text-blue-200/70 text-sm leading-relaxed">
                            {t('guest.subtitle')}
                        </p>
                    </div>

                    <div className="space-y-3">
                        {features.map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {icon}
                                </span>
                                <span className="text-sm text-blue-100/80 font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs text-blue-200/50 font-medium">{t('guest.footerRGPD')}</span>
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div
                className="flex-1 flex flex-col min-h-screen transition-colors duration-300"
                style={{ background: isDark ? 'rgb(8,10,22)' : 'rgb(248,250,252)' }}
            >
                {/* Mobile header */}
                <div className="flex items-center justify-between px-4 pt-5 pb-2 lg:px-8 lg:pt-8">
                    <Link href="/" className="flex items-center gap-2 lg:hidden">
                        <div className={`w-8 h-8 rounded-lg overflow-hidden border ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                            <img src="/logo_transparent.png" alt="UniConnect" className="w-full h-full object-contain p-0.5" />
                        </div>
                        <span className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Uni<span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Connect</span>
                        </span>
                    </Link>
                    <div className="ml-auto">
                        <LanguageSwitcher variant="compact" />
                    </div>
                </div>

                {/* Centered form area */}
                <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-10">
                    <div className="w-full max-w-[22rem] sm:max-w-[24rem]">

                        {/* Form card */}
                        <div
                            className="rounded-2xl border"
                            style={isDark
                                ? { background: 'rgba(12,16,36,0.97)', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }
                                : { background: '#ffffff', borderColor: 'rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)' }
                            }
                        >
                            <div className="px-6 py-7 sm:px-7">
                                <GuestThemeContext.Provider value={isDark}>
                                    {children}
                                </GuestThemeContext.Provider>
                            </div>
                        </div>

                        {/* Mini footer */}
                        <p className={`mt-5 text-center text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            {t('guest.copyright')}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { font-family: 'Inter', sans-serif; }
            `}</style>
        </div>
    );
}
