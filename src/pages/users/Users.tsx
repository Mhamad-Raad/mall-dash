import UsersFilters from '@/components/Users/UsersFilters';
import UsersTable from '@/components/Users/UsersTable';

const Users = () => {
  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      {/* Filters Section */}
      <UsersFilters />

      {/* Users Table */}
      <div className='flex-1 min-h-0'>
        <UsersTable />
      </div>
    </section>
  );
};

export default Users;
