import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Package,
  BarChart3,
  Settings,
  FileText,
  ShoppingCart,
  Building2,
  Store,
} from 'lucide-react';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

import { NavUser } from '@/components/ui/nav-user';

import { logoutUser } from '@/data/Authorization';

import Logo from '@/assets/Logo.jpg';

// Main navigation items
const mainNavItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users,
  },
  {
    title: 'Buildings',
    url: '/buildings',
    icon: Building2,
  },
  {
    title: 'Vendors',
    url: '/vendors',
    icon: Store,
  },
  {
    title: 'Products',
    url: '#',
    icon: Package,
  },
  {
    title: 'Orders',
    url: '#',
    icon: ShoppingCart,
  },
];

// Management items
const managementItems = [
  {
    title: 'Analytics',
    url: '#',
    icon: BarChart3,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
  },
];

// Settings items
const settingsItems = [
  {
    title: 'Profile',
    url: '/profile',
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: me } = useSelector((state: RootState) => state.me);

  const user = {
    name: me ? `${me.firstName} ${me.lastName}` : 'Guest User',
    email: me?.email || '',
    avatar: me?.profileImageUrl || '',
    initials: me
      ? `${me.firstName?.[0] || ''}${me.lastName?.[0] || ''}`.toUpperCase()
      : 'GU',
  };

  const isActive = (url: string) => {
    if (url === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(url);
  };

  const handleUserLogout = async () => {
    await logoutUser();
  };

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size='lg'
              className='my-2 hover:bg-primary/10 transition-all duration-300 group/logo'
              onClick={() => navigate('/')}
            >
              <a href='/' className='cursor-pointer'>
                <div className='relative shrink-0'>
                  <div className='absolute inset-0 bg-primary/20 rounded-lg blur-sm group-hover/logo:bg-primary/30 transition-all duration-300' />
                  <img
                    src={Logo}
                    title='Akkooo Logo'
                    className='size-8 rounded-lg relative z-10 shadow-md group-hover/logo:scale-110 transition-transform duration-300'
                  />
                </div>
                <div className='flex flex-col min-w-0'>
                  <span className='text-base font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent group-hover/logo:from-primary group-hover/logo:to-primary transition-all duration-300 truncate'>
                    Akkooo Mall
                  </span>
                  <span className='text-[10px] text-muted-foreground font-medium tracking-wider uppercase truncate'>
                    Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider'>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='mt-2'>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                    className={`
                      transition-all duration-200
                      ${
                        isActive(item.url)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm'
                          : 'hover:bg-muted/50'
                      }
                    `}
                  >
                    <a
                      href={item.url}
                      onClick={(e) => {
                        if (item.url !== '#') {
                          e.preventDefault();
                          navigate(item.url);
                        }
                      }}
                      className='cursor-pointer'
                    >
                      <item.icon className='transition-all group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5' />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider'>
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='mt-2'>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                    className={`
                      transition-all duration-200
                      ${
                        isActive(item.url)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm'
                          : 'hover:bg-muted/50'
                      }
                    `}
                  >
                    <a
                      href={item.url}
                      onClick={(e) => {
                        if (item.url !== '#') {
                          e.preventDefault();
                          navigate(item.url);
                        }
                      }}
                      className='cursor-pointer'
                    >
                      <item.icon className='transition-all group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5' />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider'>
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='mt-2'>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                    className={`
                      transition-all duration-200
                      ${
                        isActive(item.url)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm'
                          : 'hover:bg-muted/50'
                      }
                    `}
                  >
                    <a
                      href={item.url}
                      onClick={(e) => {
                        if (item.url !== '#') {
                          e.preventDefault();
                          navigate(item.url);
                        }
                      }}
                      className='cursor-pointer'
                    >
                      <item.icon className='transition-all group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5' />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
      <SidebarFooter>
        <NavUser
          user={user}
          onLogOut={handleUserLogout}
          onAccountClick={() => navigate('/profile')}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
