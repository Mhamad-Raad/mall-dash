import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';

import UsersFilters from '@/components/Users/UsersFilters';
import UsersTable from '@/components/Users/UsersTable';
import { User as UserIcon } from 'lucide-react';

import { fetchUsers } from '@/store/slices/usersSlice';

const Users = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    lusers: loading,
    eusers: error,
  } = useSelector((state: RootState) => state.users);

  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  const roleParam = searchParams.get('role');
  const role = roleParam !== null ? Number(roleParam) : null;
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const params: Record<string, any> = { limit, page };
    if (role !== -1) params.role = role;
    if (search) params.search = search;
    dispatch(fetchUsers(params));
  }, [dispatch, limit, page, role, search]);

  const hasNoUsers = !loading && users.length === 0 && !error;
  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      {/* Filters Section */}
      <UsersFilters />

      {/* Users Table OR Empty State */}
      <div className='flex-1 min-h-0'>
        {hasNoUsers ? (
          <div className='flex flex-col items-center justify-center h-full text-center p-8'>
            <UserIcon className='w-12 h-12 text-muted-foreground mb-4' />
            <h2 className='text-xl font-semibold mb-2'>No users found</h2>
            <p className='text-muted-foreground mb-4'>
              Try adjusting your filters or create a new user.
            </p>
          </div>
        ) : (
          <UsersTable />
        )}
      </div>
    </section>
  );
};

export default Users;
