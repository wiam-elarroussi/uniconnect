import '../css/app.css';
import './bootstrap';

import i18n from '@/i18n/config';
import GlobalFlashToasts from '@/Components/GlobalFlashToasts';
import { I18nextProvider } from 'react-i18next';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import toast, { Toaster } from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function syncCsrfMetaFromPage(page) {
    const token = page?.props?.csrf_token;
    if (typeof token !== 'string' || !token) {
        return;
    }
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) {
        meta.setAttribute('content', token);
    }
}

// Session / jeton CSRF : après chaque navigation Inertia, aligner le meta (axios, libs tierces).
document.addEventListener('inertia:success', (event) => {
    syncCsrfMetaFromPage(event.detail?.page);
    const page = event.detail?.page;
    const loc = page?.props?.locale;
    const dir = page?.props?.localeDir;
    if (loc) {
        void i18n.changeLanguage(loc);
        document.documentElement.setAttribute('lang', loc);
    }
    if (dir) {
        document.documentElement.setAttribute('dir', dir);
    }
    if (loc === 'ar') {
        document.body?.classList.add('font-arabic');
    } else {
        document.body?.classList.remove('font-arabic');
    }
});

function firstMessageFromLaravelValidation(data) {
    try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        const errs = parsed?.errors;
        if (errs && typeof errs === 'object') {
            const flat = Object.values(errs).flat();
            if (flat.length) {
                return String(flat[0]);
            }
        }
        if (parsed?.message) {
            return String(parsed.message);
        }
    } catch (_) {
        /* ignore */
    }
    return null;
}

// Réponses non-Inertia (ex. 422 JSON validation) : éviter la modale HTML et afficher un message clair.
document.addEventListener('inertia:invalid', (event) => {
    const status = event.detail?.response?.status;
    const raw = event.detail?.response?.data;

    if (status === 419) {
        event.preventDefault();
        window.location.reload();
        return;
    }

    event.preventDefault();

    const msg =
        firstMessageFromLaravelValidation(raw)
        || (status === 422 ? i18n.t('errors.checkForm') : null)
        || (status === 429 ? i18n.t('errors.tooManyAttempts') : null)
        || i18n.t('errors.generic');

    toast.error(msg, { duration: 6000 });
});

const pages = import.meta.glob('./Pages/**/*.jsx');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(`./Pages/${name}.jsx`, pages);
        const Component = page.default;

        return {
            ...page,
            default: function PageWithToasts(props) {
                return (
                    <>
                        <Component {...props} />
                        <GlobalFlashToasts />
                    </>
                );
            },
        };
    },
    setup({ el, App, props }) {
        const initial = props.initialPage?.props;
        if (initial?.locale) {
            void i18n.changeLanguage(initial.locale);
            document.documentElement.setAttribute('lang', initial.locale);
        }
        if (initial?.localeDir) {
            document.documentElement.setAttribute('dir', initial.localeDir);
        }
        if (initial?.locale === 'ar') {
            document.body?.classList.add('font-arabic');
        }

        const root = createRoot(el);

        root.render(
            <I18nextProvider i18n={i18n}>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: { fontSize: '14px' },
                    }}
                />
            </I18nextProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
