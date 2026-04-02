import axios from 'axios';
import { useRef, useState } from 'react';

function formatLaravelErrors(errors) {
    if (!errors || typeof errors !== 'object') {
        return null;
    }
    return Object.values(errors)
        .flat()
        .filter(Boolean)
        .join(' ');
}

export default function DashboardChatbotModal({ open, onClose }) {
    const [messages, setMessages] = useState(() => [
        {
            role: 'assistant',
            text: 'Bonjour ! Je suis l’assistant UniConnect. Pose-moi une question (cours, organisation, vie étudiante). Tu peux aussi joindre une image.',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const fileRef = useRef(null);

    if (!open) {
        return null;
    }

    const send = async () => {
        const text = input.trim();
        const file = fileRef.current?.files?.[0];
        if (!text && !file) return;

        setInput('');
        const userParts = [];
        if (text) userParts.push({ type: 'text', text });
        if (file) userParts.push({ type: 'image', name: file.name });
        setMessages((m) => [...m, { role: 'user', parts: userParts }]);
        if (fileRef.current) fileRef.current.value = '';

        const fd = new FormData();
        if (text) fd.append('message', text);
        if (file) fd.append('image', file);

        setLoading(true);
        try {
            const res = await axios.post(route('chat.message'), fd, {
                validateStatus: () => true,
            });
            const data = res.data && typeof res.data === 'object' ? res.data : {};

            if (res.status >= 400) {
                const errText =
                    data.reply ||
                    data.message ||
                    formatLaravelErrors(data.errors) ||
                    (typeof res.data === 'string' ? res.data.slice(0, 400) : null) ||
                    `Erreur serveur (${res.status}). Réessaie ou recharge la page.`;
                setMessages((m) => [...m, { role: 'assistant', text: errText }]);

                return;
            }

            const reply =
                data.reply ??
                (data.configured === false
                    ? 'Assistant non configuré (clé OpenAI manquante côté serveur).'
                    : 'Réponse indisponible pour le moment.');
            setMessages((m) => [...m, { role: 'assistant', text: reply }]);
        } catch (e) {
            const msg =
                axios.isAxiosError(e) && e.response?.data
                    ? e.response.data.reply ||
                      e.response.data.message ||
                      formatLaravelErrors(e.response.data.errors) ||
                      'Erreur réseau ou serveur.'
                    : 'Erreur réseau. Vérifie ta connexion et réessaie.';
            setMessages((m) => [...m, { role: 'assistant', text: msg }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col max-h-[min(560px,85vh)] noise shadow-2xl"
                style={{
                    background: 'var(--panel-bg, rgba(10,12,28,0.97))',
                    border: '1px solid var(--border, rgba(255,255,255,0.1))',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <h2 className="font-display font-bold text-sm" style={{ color: 'var(--text-1)' }}>
                            Assistant UniConnect
                        </h2>
                        <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                            Propulsé par OpenAI (gpt-4o-mini)
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10"
                        style={{ color: 'var(--text-2)' }}
                        aria-label="Fermer"
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm" style={{ color: 'var(--text-2)' }}>
                    {messages.map((msg, i) =>
                        msg.role === 'assistant' ? (
                            <div
                                key={i}
                                className="rounded-xl px-3 py-2"
                                style={{ background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.15)' }}
                            >
                                {msg.text}
                            </div>
                        ) : (
                            <div key={i} className="flex flex-col gap-1 items-end">
                                {(msg.parts || []).map((p, j) =>
                                    p.type === 'text' ? (
                                        <div
                                            key={j}
                                            className="rounded-xl px-3 py-2 max-w-[95%]"
                                            style={{ background: 'rgba(255,255,255,0.06)' }}
                                        >
                                            {p.text}
                                        </div>
                                    ) : (
                                        <div
                                            key={j}
                                            className="text-[10px] px-2 py-1 rounded-lg"
                                            style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}
                                        >
                                            📎 {p.name}
                                        </div>
                                    ),
                                )}
                            </div>
                        ),
                    )}
                    {loading && (
                        <p className="text-xs animate-pulse" style={{ color: 'var(--text-3)' }}>
                            L’assistant réfléchit…
                        </p>
                    )}
                </div>

                <div className="p-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <input ref={fileRef} type="file" accept="image/*" className="text-[10px] w-full" style={{ color: 'var(--text-3)' }} />
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                            className="flex-1 rounded-xl px-3 py-2 text-sm input-neo"
                            style={{ color: 'var(--text-1)', borderColor: 'var(--border)' }}
                            placeholder="Écris ton message…"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={send}
                            disabled={loading}
                            className="px-4 py-2 rounded-xl text-sm font-bold text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)', opacity: loading ? 0.6 : 1 }}
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
