import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './SideBar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className='flex flex-col gap-8 p-4'>
          <Navbar />
          <section className='px-4'>
            <Outlet />
          </section>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
