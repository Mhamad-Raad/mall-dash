import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SidebarTrigger } from '@/components/ui/sidebar';

import ThemeButton from '../ui/ThemeButton';
import LocaleToggle from '../locale-button';

export default function Navbar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const path = location.pathname;
  const pageTitle = path === '/' ? 'HOME' : capitalize(path.replace(/^\//, ''));
  return (
    <div className='p-[6px] flex items-center justify-between border-1 rounded-lg'>
      <div className='flex items-center gap-1'>
        <SidebarTrigger />
        <span className='font-medium'>{t(pageTitle)}</span>
      </div>
      <div className='flex items-center gap-1'>
        <LocaleToggle />
        <ThemeButton />
      </div>
    </div>
  );
}
