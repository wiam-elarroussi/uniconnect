import '../css/app.css';
import './bootstrap';

import GlobalFlashToasts from '@/Components/GlobalFlashToasts';
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
        || (status === 422 ? 'Vérifiez les champs du formulaire.' : null)
        || (status === 429 ? 'Trop de tentatives. Patientez un instant.' : null)
        || 'Une erreur est survenue. Réessayez.';

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
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: { fontSize: '14px' },
                    }}
                />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
