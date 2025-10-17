import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './SideBar';

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full p-4'>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
