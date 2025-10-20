import UsersFilters from '@/components/Users/UsersFilters';
import UsersTable from '@/components/Users/UsersTable';

const users = [
  {
    id: '1',
    src: 'https://randomuser.me/api/portraits/men/1.jpg',
    fallback: 'JD',
    name: 'John Doe',
    phoneNumber: '+1 202-555-0165',
    email: 'john.doe@example.com',
    type: 'Admin',
    buildingName: 'Central Plaza',
  },
  {
    id: '2',
    src: 'https://randomuser.me/api/portraits/women/2.jpg',
    fallback: 'AS',
    name: 'Anna Smith',
    phoneNumber: '+1 202-555-0148',
    email: 'anna.smith@example.com',
    type: 'User',
    buildingName: 'Main Tower',
  },
  {
    id: '3',
    src: 'https://randomuser.me/api/portraits/men/3.jpg',
    fallback: 'RW',
    name: 'Robert White',
    phoneNumber: '+1 202-555-0102',
    email: 'robert.white@example.com',
    type: 'Manager',
    buildingName: 'West Wing',
  },
  {
    id: '4',
    src: 'https://randomuser.me/api/portraits/women/4.jpg',
    fallback: 'LC',
    name: 'Lucy Carter',
    phoneNumber: '+1 202-555-0199',
    email: 'lucy.carter@example.com',
    type: 'User',
    buildingName: 'North Block',
  },
  {
    id: '1',
    src: 'https://randomuser.me/api/portraits/men/1.jpg',
    fallback: 'JD',
    name: 'John Doe',
    phoneNumber: '+1 202-555-0165',
    email: 'john.doe@example.com',
    type: 'Admin',
    buildingName: 'Central Plaza',
  },
  {
    id: '2',
    src: 'https://randomuser.me/api/portraits/women/2.jpg',
    fallback: 'AS',
    name: 'Anna Smith',
    phoneNumber: '+1 202-555-0148',
    email: 'anna.smith@example.com',
    type: 'User',
    buildingName: 'Main Tower',
  },
  {
    id: '3',
    src: 'https://randomuser.me/api/portraits/men/3.jpg',
    fallback: 'RW',
    name: 'Robert White',
    phoneNumber: '+1 202-555-0102',
    email: 'robert.white@example.com',
    type: 'Manager',
    buildingName: 'West Wing',
  },
  {
    id: '4',
    src: 'https://randomuser.me/api/portraits/women/4.jpg',
    fallback: 'LC',
    name: 'Lucy Carter',
    phoneNumber: '+1 202-555-0199',
    email: 'lucy.carter@example.com',
    type: 'User',
    buildingName: 'North Block',
  },
  {
    id: '1',
    src: 'https://randomuser.me/api/portraits/men/1.jpg',
    fallback: 'JD',
    name: 'John Doe',
    phoneNumber: '+1 202-555-0165',
    email: 'john.doe@example.com',
    type: 'Admin',
    buildingName: 'Central Plaza',
  },
  {
    id: '2',
    src: 'https://randomuser.me/api/portraits/women/2.jpg',
    fallback: 'AS',
    name: 'Anna Smith',
    phoneNumber: '+1 202-555-0148',
    email: 'anna.smith@example.com',
    type: 'User',
    buildingName: 'Main Tower',
  },
  {
    id: '3',
    src: 'https://randomuser.me/api/portraits/men/3.jpg',
    fallback: 'RW',
    name: 'Robert White',
    phoneNumber: '+1 202-555-0102',
    email: 'robert.white@example.com',
    type: 'Manager',
    buildingName: 'West Wing',
  },
  {
    id: '4',
    src: 'https://randomuser.me/api/portraits/women/4.jpg',
    fallback: 'LC',
    name: 'Lucy Carter',
    phoneNumber: '+1 202-555-0199',
    email: 'lucy.carter@example.com',
    type: 'User',
    buildingName: 'North Block',
  },
  {
    id: '1',
    src: 'https://randomuser.me/api/portraits/men/1.jpg',
    fallback: 'JD',
    name: 'John Doe',
    phoneNumber: '+1 202-555-0165',
    email: 'john.doe@example.com',
    type: 'Admin',
    buildingName: 'Central Plaza',
  },
  {
    id: '2',
    src: 'https://randomuser.me/api/portraits/women/2.jpg',
    fallback: 'AS',
    name: 'Anna Smith',
    phoneNumber: '+1 202-555-0148',
    email: 'anna.smith@example.com',
    type: 'User',
    buildingName: 'Main Tower',
  },
  {
    id: '3',
    src: 'https://randomuser.me/api/portraits/men/3.jpg',
    fallback: 'RW',
    name: 'Robert White',
    phoneNumber: '+1 202-555-0102',
    email: 'robert.white@example.com',
    type: 'Manager',
    buildingName: 'West Wing',
  },
  {
    id: '4',
    src: 'https://randomuser.me/api/portraits/women/4.jpg',
    fallback: 'LC',
    name: 'Lucy Carter',
    phoneNumber: '+1 202-555-0199',
    email: 'lucy.carter@example.com',
    type: 'User',
    buildingName: 'North Block',
  },
];


const Users = () => {
  return (
    <div className='w-full flex flex-col items-start gap-8'>
      <div className='w-full flex items-center bg-card border rounded-md p-4'>
        <UsersFilters />
      </div>
      <div className='w-full bg-card border rounded-md p-4'>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default Users;
