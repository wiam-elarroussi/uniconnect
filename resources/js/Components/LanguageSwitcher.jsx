import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const FALLBACK_LOCALES = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
];

function localeUpdateUrl() {
    try {
        if (typeof route === 'function') {
            return route('locale.update');
        }
    } catch {
        /* Ziggy indisponible */
    }
    return '/locale';
}

/**
 * @param {'compact' | 'default'} variant
 * @param {'default' | 'onDark'} tone — onDark : pastilles lisibles sur fond sombre (barre fil, etc.)
 */
export default function LanguageSwitcher({ variant = 'default', className = '', tone = 'default' }) {
    const { locale, availableLocales } = usePage().props;
    const { t } = useTranslation();

    const onDark = tone === 'onDark';
    const locales = Array.isArray(availableLocales) && availableLocales.length > 0 ? availableLocales : FALLBACK_LOCALES;

    const setLocale = (code) => {
        if (code === locale) return;

        const url = localeUpdateUrl();

        router.post(url, { locale: code }, {
            preserveScroll: true,
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    const isCompact = variant === 'compact';

    return (
        <div
            className={[
                'inline-flex shrink-0 items-center rounded-xl border backdrop-blur-sm',
                isCompact ? 'p-0.5 gap-0' : 'p-1 gap-0.5',
                onDark
                    ? 'border-white/10 bg-white/[0.06] shadow-none'
                    : 'border-slate-200/80 bg-white/90 shadow-sm',
                className,
            ].join(' ')}
            role="group"
            aria-label={t('common.language')}
        >
            {locales.map(({ code, label }) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    className={[
                        'rounded-lg font-semibold transition-colors',
                        isCompact ? 'px-1.5 py-0.5 text-[10px] sm:px-2 sm:py-1' : 'px-2.5 py-1.5 text-xs',
                        onDark
                            ? locale === code
                                ? 'bg-cyan-500/25 text-cyan-50 shadow-inner'
                                : 'text-slate-400 hover:bg-white/10 hover:text-slate-100'
                            : locale === code
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    ].join(' ')}
                    title={label}
                    aria-pressed={locale === code}
                >
                    {code === 'ar' ? 'عربي' : code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
