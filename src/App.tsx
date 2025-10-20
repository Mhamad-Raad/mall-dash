import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Users from './pages/Users';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/users' element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

