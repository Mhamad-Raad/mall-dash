import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoadingPage from './pages/LoadingPage';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Users from './pages/users/Users';
import CreateUser from './pages/users/CreateUser';
import UserDetail from './pages/users/UserDetail';
import Buildings from './pages/buildings/Buildings';
import BuildingDetail from './pages/buildings/BuildingDetail';
import CreateBuilding from './pages/buildings/CreateBuilding';
import Vendors from './pages/vendors/Vendors';
import VendorDetail from './pages/vendors/VendorDetail';
import CreateVendor from './pages/vendors/CreateVendor';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Themes from './pages/settings/Themes';

import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <LoadingPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/users/create',
        element: <CreateUser />,
      },
      {
        path: '/users/:id',
        element: <UserDetail />,
      },
      {
        path: '/buildings',
        element: <Buildings />,
      },
      {
        path: '/buildings/create',
        element: <CreateBuilding />,
      },
      {
        path: '/buildings/:id',
        element: <BuildingDetail />,
      },
      {
        path: '/vendors',
        element: <Vendors />,
      },
      {
        path: '/vendors/create',
        element: <CreateVendor />,
      },
      {
        path: '/vendors/:id',
        element: <VendorDetail />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/reports',
        element: <Reports />,
      },
      {
        path: '/settings/themes',
        element: <Themes />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
