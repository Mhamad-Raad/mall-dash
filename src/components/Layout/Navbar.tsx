import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import ThemeButton from '../ui/ThemeButton';
import LocaleToggle from '../locale-button';

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/users') return 'Users Management';
    if (path === '/users/create') return 'Create New User';
    return capitalize(path.replace(/^\//, '').replace(/-/g, ' '));
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return null;
    
    const segments = path.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      return (
        <span key={segment} className="flex items-center gap-2">
          <span className="text-muted-foreground">/</span>
          <span className={isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}>
            {capitalize(segment.replace(/-/g, ' '))}
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
            {t(getPageTitle())}
          </h1>
          <div className='hidden md:flex items-center gap-1 text-xs'>
            <span className='text-muted-foreground'>Home</span>
            {getBreadcrumb()}
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className='flex items-center gap-1 sm:gap-2'>

        {/* Notifications */}
        <Button
          variant='ghost'
          size='icon'
          className='relative hover:bg-muted/50 transition-colors'
        >
          <Bell className='size-4' />
          <Badge 
            variant='destructive' 
            className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]'
          >
            3
          </Badge>
        </Button>

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
