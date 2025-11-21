import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import sidebarEn from './locales/Sidebar/en.json';
import sidebarAr from './locales/Sidebar/ar.json';
import sidebarKu from './locales/Sidebar/ku.json';

import usersEn from './locales/Users/en.json';
import usersAr from './locales/Users/ar.json';
import usersKu from './locales/Users/ku.json';

import buildingsEn from './locales/Buildings/en.json';
import buildingsAr from './locales/Buildings/ar.json';
import buildingsKu from './locales/Buildings/ku.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      sidebar: sidebarEn,
      users: usersEn,
      buildings: buildingsEn,
    },
    ar: {
      sidebar: sidebarAr,
      users: usersAr,
      buildings: buildingsAr,
    },
    ku: {
      sidebar: sidebarKu,
      users: usersKu,
      buildings: buildingsKu,
    },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  ns: ['sidebar', 'users', 'buildings'], // namespaces
  defaultNS: 'sidebar',
  interpolation: { escapeValue: false },
});

export default i18n;
