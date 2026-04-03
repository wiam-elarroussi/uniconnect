import LanguageSwitcher from '@/Components/LanguageSwitcher';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function GuestLayout({ children }) {
    const { t } = useTranslation();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handle = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handle);
        return () => window.removeEventListener('mousemove', handle);
    }, []);

    return (
        <div className="relative min-h-screen bg-slate-50 flex items-center justify-center px-4 overflow-hidden">
            <div className="absolute top-4 end-4 z-20">
                <LanguageSwitcher variant="compact" />
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { font-family: 'Inter', sans-serif; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-8px); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.35; transform: scale(1); }
                    50%      { opacity: 0.6;  transform: scale(1.06); }
                }

                .card-appear { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .logo-float  { animation: float 5s ease-in-out infinite; }
                .blob        { animation: pulse-slow 6s ease-in-out infinite; }
                .blob-2      { animation: pulse-slow 8s ease-in-out infinite; animation-delay: 3s; }

                /* Inputs personnalisés */
                .uni-input {
                    width: 100%;
                    background: #F8FAFC;
                    border: 1.5px solid #E2E8F0;
                    border-radius: 12px;
                    padding: 10px 14px;
                    font-size: 14px;
                    color: #0F172A;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                }
                .uni-input:focus {
                    background: #fff;
                    border-color: #93C5FD;
                    box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
                }
                .uni-input::placeholder { color: #94A3B8; }

                /* Bouton primaire */
                .uni-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%);
                    color: #fff;
                    font-weight: 700;
                    font-size: 14px;
                    padding: 11px 20px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    box-shadow: 0 4px 14px rgba(37,99,235,0.30);
                }
                .uni-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(37,99,235,0.40);
                }
                .uni-btn:active { transform: translateY(0); }
                .uni-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

                /* Labels */
                .uni-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 700;
                    color: #475569;
                    margin-bottom: 6px;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                }

                /* Checkbox */
                .uni-checkbox {
                    accent-color: #2563EB;
                    width: 15px;
                    height: 15px;
                    border-radius: 4px;
                }

                /* Error */
                .uni-error {
                    color: #EF4444;
                    font-size: 11px;
                    font-weight: 500;
                    margin-top: 4px;
                }
            `}</style>

            {/* ── Halo souris ── */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(37,99,235,0.08), transparent 70%)`
                }}
            />

            {/* ── Blobs fond ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="blob absolute -top-32 -left-32 w-96 h-96 rounded-full"
                     style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
                <div className="blob-2 absolute -bottom-32 -right-20 w-80 h-80 rounded-full"
                     style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%)' }} />
                {/* Grille subtile */}
                <div className="absolute inset-0 opacity-[0.025]"
                     style={{
                         backgroundImage: 'linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)',
                         backgroundSize: '48px 48px'
                     }} />
            </div>

            {/* ── Contenu centré ── */}
            <div className="relative z-10 w-full max-w-sm">

                {/* Logo */}
                <div className="flex flex-col items-center mb-7 card-appear" style={{ animationDelay: '0.05s' }}>
                    <Link href="/" className="logo-float block mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 blur-lg opacity-25 scale-110" />
                            <ApplicationLogo size="lg" showText={false} />
                        </div>
                    </Link>
                    <Link href="/">
                        <span className="text-2xl font-black tracking-tight">
                            <span className="text-slate-900">Uni</span>
                            <span style={{
                                background: 'linear-gradient(135deg,#2563EB,#4F46E5)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>Connect</span>
                        </span>
                    </Link>
                    <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        {t('guest.tagline')}
                    </p>
                </div>

                {/* Card formulaire */}
                <div
                    className="card-appear bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/60 overflow-hidden"
                    style={{ animationDelay: '0.12s' }}
                >
                    {/* Barre dégradée top */}
                    <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />

                    <div className="px-7 py-7">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <p className="card-appear text-center text-[10px] text-slate-400 mt-6 flex items-center justify-center gap-2"
                   style={{ animationDelay: '0.2s' }}>
                    <span className="w-6 h-px bg-slate-200" />
                    {t('guest.footer')}
                    <span className="w-6 h-px bg-slate-200" />
                </p>
            </div>
        </div>
    );
}