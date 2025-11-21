import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SidebarTrigger } from '@/components/ui/sidebar';

import ThemeButton from '../ui/ThemeButton';
import LocaleToggle from '../locale-button';
import NotificationPopover from './NotificationPopover';

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation('navbar');

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return t('dashboard');
    if (path === '/users') return t('users:title');
    if (path === '/users/create') return t('users:createUser.title');
    if (path === '/vendors') return t('vendorsManagement');
    if (path === '/products') return t('productsManagement');
    if (path === '/buildings') return t('buildingsManagement');
    if (path === '/reports') return t('reports');
    if (path === '/settings') return t('settings');
    return capitalize(path.replace(/^\//, '').replace(/-/g, ' '));
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return null;
    
    const segments = path.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      
      // Translate known segments
      let displayText = segment;
      if (segment === 'users') displayText = t('users');
      else if (segment === 'create') displayText = t('create');
      else if (segment === 'vendors') displayText = t('vendors');
      else if (segment === 'products') displayText = t('products');
      else if (segment === 'buildings') displayText = t('buildings');
      else if (segment === 'reports') displayText = t('reports');
      else if (segment === 'settings') displayText = t('settings');
      else displayText = capitalize(segment.replace(/-/g, ' '));
      
      return (
        <span key={segment} className="flex items-center gap-2">
          <span className="text-muted-foreground">/</span>
          <span className={isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}>
            {displayText}
          </span>
        </span>
      );
    });
  };

  return (
    <nav className='sticky top-0 z-50 flex items-center justify-between gap-4 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 px-4 py-3 shadow-sm'>
      {/* Left Section - Title & Breadcrumb */}
      <div className='flex items-center gap-3 flex-1 min-w-0'>
        <SidebarTrigger className='hover:bg-muted/50 transition-colors' />
        <div className='hidden sm:block h-6 w-px bg-border' />
        <div className='flex flex-col min-w-0'>
          <h1 className='text-lg font-bold tracking-tight truncate'>
            {getPageTitle()}
          </h1>
          <div className='hidden md:flex items-center gap-1 text-xs'>
            <span className='text-muted-foreground'>{t('home')}</span>
            {getBreadcrumb()}
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className='flex items-center gap-1 sm:gap-2'>

        {/* Notifications */}
        <NotificationPopover />

        {/* Divider */}
        <div className='hidden sm:block h-6 w-px bg-border mx-1' />

        {/* Locale Toggle */}
        <LocaleToggle />

        {/* Theme Toggle */}
        <ThemeButton />

        {/* Divider */}
        <div className='hidden sm:block h-6 w-px bg-border mx-1' />
      </div>
    </nav>
  );
}
