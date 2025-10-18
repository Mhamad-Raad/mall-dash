import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './SideBar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className='flex flex-col gap-8 p-4'>
          <Navbar />
          <section className='p-5'>
            <Outlet />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
