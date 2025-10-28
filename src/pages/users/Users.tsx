import UsersFilters from '@/components/Users/UsersFilters';
import UsersTable from '@/components/Users/UsersTable';

const Users = () => {
  return (
    <section className='w-full flex flex-col gap-6'>
      {/* Filters Section */}
      <UsersFilters />

      {/* Users Table */}
      <UsersTable />
    </section>
  );
};

export default Users;
