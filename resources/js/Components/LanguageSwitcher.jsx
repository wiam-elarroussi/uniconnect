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
 */
export default function LanguageSwitcher({ variant = 'default', className = '' }) {
    const { locale, availableLocales } = usePage().props;
    const { t } = useTranslation();

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
            className={`inline-flex items-center rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm ${isCompact ? 'p-0.5 gap-0' : 'p-1 gap-0.5'} ${className}`}
            role="group"
            aria-label={t('common.language')}
        >
            {locales.map(({ code, label }) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    className={`rounded-lg font-semibold transition-colors ${
                        isCompact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs'
                    } ${
                        locale === code
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    title={label}
                    aria-pressed={locale === code}
                >
                    {code === 'ar' ? 'عربي' : code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
