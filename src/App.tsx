import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LoadingPage from './pages/LoadingPage';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Users from './pages/users/Users';
import CreateUser from './pages/users/CreateUser';

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
        path: '*',
        element: <NotFound />, // catch-all for unmatched paths
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

