import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import UsersTableSkeleton from './UsersTableSkeleton';
import CustomTablePagination from '../CustomTablePagination';

import { Mail, Phone, Building2 } from 'lucide-react';

import type { UserType } from '@/interfaces/Users.interface';

import { fetchUsers } from '@/data/Users';

const getUserTypeColor = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower === 'admin' || typeLower === 'superadmin')
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
  if (typeLower === 'manager')
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  if (typeLower === 'user')
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
};

const UsersTable = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRowClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const data = await fetchUsers();

      if (data.error) {
        setError(data.error);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    getUsers();
  }, []);

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='rounded-lg border bg-card shadow-sm'>
      <Table className='w-full'>
        <TableHeader>
          <TableRow className='hover:bg-transparent border-b'>
            <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b'>
              User
            </TableHead>
            <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b'>
              Contact
            </TableHead>
            <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b'>
              Role
            </TableHead>
            <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 font-semibold border-b'>
              Location
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? // Render skeleton rows while loading
              Array.from({ length: 5 }).map((_, index) => (
                <UsersTableSkeleton key={`skeleton-${index}`} />
              ))
            : // Render actual user data
              users.map((user, index) => {
                const fullName = `${user.firstName} ${user.lastName}`;
                const userRole = user.roles[0];
                return (
                  <TableRow
                    key={`${user?.userId}-${index}`}
                    className='hover:bg-muted/50 transition-colors cursor-pointer'
                    onClick={() => handleRowClick(user?.userId)}
                  >
                    {/* User Info with Avatar */}
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10 border-2 border-background shadow-sm'>
                          <AvatarImage src={user.src} alt={fullName} />
                          <AvatarFallback className='text-xs font-semibold bg-primary/10 text-primary'>
                            {user.fallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <span className='font-semibold text-sm'>
                            {fullName}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            ID: {user?.userId}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact Information */}
                    <TableCell>
                      <div className='flex flex-col gap-1.5 min-w-[200px]'>
                        <div className='flex items-center gap-2 text-sm'>
                          <Mail className='size-3.5 text-muted-foreground' />
                          <span className='text-xs'>{user.email}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm'>
                          <Phone className='size-3.5 text-muted-foreground' />
                          <span className='text-xs font-medium'>
                            {user.phoneNumber}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* User Type/Role */}
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={`${getUserTypeColor(
                          userRole
                        )} font-semibold text-xs`}
                      >
                        {userRole}
                      </Badge>
                    </TableCell>

                    {/* Building/Location */}
                    <TableCell>
                      <div className='flex items-center gap-2 min-w-[150px]'>
                        <Building2 className='size-4 text-muted-foreground' />
                        <span className='text-sm font-medium'>
                          {user.buildingName}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className='border-t px-4 py-3 bg-muted/30'>
        <CustomTablePagination total={10} suggestions={[10, 20, 40, 50, 100]} />
      </div>
    </div>
  );
};

export default UsersTable;
