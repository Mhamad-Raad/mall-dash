import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './SideBar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className='p-4'>
          <Navbar />
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
