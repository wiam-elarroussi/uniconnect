import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from '../locales/ar.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import welcomePageAr from '../locales/welcomePage.ar.json';
import welcomePageEn from '../locales/welcomePage.en.json';
import welcomePageFr from '../locales/welcomePage.fr.json';

const lng =
    typeof window !== 'undefined' && window.__INITIAL_LOCALE__
        ? window.__INITIAL_LOCALE__
        : 'fr';

const mergeLocale = (base, welcomePage) => ({
    ...base,
    welcomePage,
});

void i18n.use(initReactI18next).init({
    resources: {
        en: { translation: mergeLocale(en, welcomePageEn) },
        fr: { translation: mergeLocale(fr, welcomePageFr) },
        ar: { translation: mergeLocale(ar, welcomePageAr) },
    },
    lng,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export default i18n;
