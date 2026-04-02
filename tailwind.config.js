import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            // ── Palette officielle UniConnect ──────────────────────────────
            colors: {
                brand: {
                    blue:    '#2563EB', // Bleu Royal   — boutons, liens
                    indigo:  '#4F46E5', // Indigo Doux  — dégradés, hover
                    emerald: '#10B981', // Émeraude     — succès, badges RGPD
                    slate:   '#0F172A', // Ardoise foncé — titres, texte
                    bg:      '#F8FAFC', // Fond perle    — background global
                },
            },

            // ── Typographie ────────────────────────────────────────────────
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },

            // ── Keyframes & animations ─────────────────────────────────────
            keyframes: {
                shimmer: {
                    '0%':   { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition:  '200% center' },
                },
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%':      { transform: 'translateY(-10px)' },
                },
                pulseSlow: {
                    '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                    '50%':      { opacity: '0.7', transform: 'scale(1.06)' },
                },
            },
            animation: {
                shimmer:     'shimmer 3s linear infinite',
                fadeUp:      'fadeUp 0.5s ease both',
                float:       'float 5s ease-in-out infinite',
                pulseSlow:   'pulseSlow 6s ease-in-out infinite',
            },
        },
    },

    plugins: [forms],
};