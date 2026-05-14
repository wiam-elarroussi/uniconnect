import { useTranslation } from 'react-i18next';

export default function DashboardFloatHelp({ onOpenChatbot }) {
    const { t } = useTranslation();
    return (
        <div className="fixed bottom-[5.5rem] right-3 z-[80] flex flex-col items-end gap-2 sm:right-5 lg:bottom-6">

            {/* WhatsApp */}
            <a
                href="https://wa.me/212776564469"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp UniConnect"
                className="group flex items-center gap-2"
            >
                <span className="hidden group-hover:flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-sm whitespace-nowrap"
                      style={{ background: 'rgba(18,140,126,0.92)' }}>
                    Support WhatsApp
                </span>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)', boxShadow: '0 4px 14px rgba(37,211,102,0.4)' }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.527 5.845L0 24l6.348-1.497A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.794 9.794 0 01-5.017-1.378l-.36-.214-3.727.879.936-3.619-.235-.372A9.76 9.76 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
                    </svg>
                </span>
            </a>

            {/* Chatbot IA */}
            <button
                type="button"
                onClick={onOpenChatbot}
                aria-label={t('dashboard.chatbotAria', { defaultValue: "Assistant IA" })}
                className="group flex items-center gap-2"
            >
                <span className="hidden group-hover:flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-sm whitespace-nowrap"
                      style={{ background: 'rgba(37,99,235,0.92)' }}>
                    Assistant IA
                </span>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
                    </svg>
                </span>
            </button>
        </div>
    );
}
