import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Sambal (sbl) is a scaffold: any key it is missing falls back to
    // Filipino first, then English. English and Filipino fall back to English.
    fallbackLng: {
      sbl: ['fil', 'en'],
      default: ['en'],
    },
    supportedLngs: ['en', 'fil', 'sbl'],
    // Treat 'en-US', 'fil-PH', etc. as their base language (avoids 404s).
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    debug: import.meta.env.DEV,
    defaultNS: 'common',
    ns: ['common'],

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
