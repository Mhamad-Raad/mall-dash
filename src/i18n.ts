import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ar from './locales/ar.json';
import ku from './locales/ku.json';

i18n.use(initReactI18next).init({
  resources: {
    en: en,
    ar: ar,
    ku: ku,
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  ns: ['sidebar'], // namespaces
  defaultNS: 'sidebar',
  interpolation: { escapeValue: false },
});

export default i18n;
