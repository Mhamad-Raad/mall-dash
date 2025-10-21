import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Users from './pages/users/Users';
import CreateUser from './pages/users/CreateUser';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <DashboardLayout />,
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

