import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import sidebarEn from './locales/Sidebar/en.json';
import sidebarAr from './locales/Sidebar/ar.json';
import sidebarKu from './locales/Sidebar/ku.json';

import usersEn from './locales/Users/en.json';
import usersAr from './locales/Users/ar.json';
import usersKu from './locales/Users/ku.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      sidebar: sidebarEn,
      users: usersEn,
    },
    ar: {
      sidebar: sidebarAr,
      users: usersAr,
    },
    ku: {
      sidebar: sidebarKu,
      users: usersKu,
    },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  ns: ['sidebar', 'users'], // namespaces
  defaultNS: 'sidebar',
  interpolation: { escapeValue: false },
});

export default i18n;
