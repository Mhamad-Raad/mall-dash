import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoadingPage from './pages/LoadingPage';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Users from './pages/users/Users';
import CreateUser from './pages/users/CreateUser';
import UserDetail from './pages/users/UserDetail';
import Buildings from './pages/buildings/Buildings';
import BuildingDetail from './pages/buildings/BuildingDetail';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <LoadingPage />,
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
        path: '/buildings/:id',
        element: <BuildingDetail />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

