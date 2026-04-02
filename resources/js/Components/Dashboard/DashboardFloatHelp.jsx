/**
 * Boutons flottants (WhatsApp + assistant), toujours visibles en bas à droite.
 */
export default function DashboardFloatHelp({ onOpenChatbot }) {
    return (
        <div
            className="fixed bottom-5 right-4 sm:right-6 z-[90] flex flex-col gap-3 items-end"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <a
                href="https://wa.me/212776564469"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl transition-transform hover:scale-105"
                style={{
                    background: 'linear-gradient(135deg,#25D366,#128C7E)',
                    boxShadow: '0 12px 32px rgba(37,211,102,0.35)',
                }}
                title="WhatsApp UniConnect"
                aria-label="Ouvrir WhatsApp"
            >
                W
            </a>
            <button
                type="button"
                onClick={onOpenChatbot}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xl transition-transform hover:scale-105"
                style={{
                    background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 12px 32px rgba(37,99,235,0.35)',
                }}
                title="Assistant UniConnect (IA)"
                aria-label="Ouvrir l’assistant IA"
            >
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
                </svg>
            </button>
        </div>
    );
}
