import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEn from './locales/en.json';
import translationAr from './locales/ar.json';
import translationKu from './locales/ku.json';

import sidebarEn from './locales/Sidebar/en.json';
import sidebarAr from './locales/Sidebar/ar.json';
import sidebarKu from './locales/Sidebar/ku.json';

import usersEn from './locales/Users/en.json';
import usersAr from './locales/Users/ar.json';
import usersKu from './locales/Users/ku.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEn,
      sidebar: sidebarEn,
      users: usersEn,
    },
    ar: {
      translation: translationAr,
      sidebar: sidebarAr,
      users: usersAr,
    },
    ku: {
      translation: translationKu,
      sidebar: sidebarKu,
      users: usersKu,
    },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  ns: ['translation', 'sidebar', 'users'], // namespaces
  defaultNS: 'translation',
  interpolation: { escapeValue: false },
});

export default i18n;
