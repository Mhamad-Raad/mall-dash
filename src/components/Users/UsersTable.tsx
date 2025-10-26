import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, Building2 } from 'lucide-react';

import type { Users as UsersTableProps } from '@/interfaces/Users.interface';
import CustomTablePagination from '../CustomTablePagination';

const getUserTypeColor = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower === 'admin') return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
  if (typeLower === 'manager') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  if (typeLower === 'user') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
};

const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className='rounded-lg border bg-card shadow-sm'>
      {/* Scrollable Table Container */}
      <ScrollArea className='h-[1000px] w-full'>
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
              <TableHead className='bg-card/95 backdrop-blur sticky top-0 z-10 text-right font-semibold border-b'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={`${user.id}-${index}`} className='hover:bg-muted/50 transition-colors'>
                {/* User Info with Avatar */}
                <TableCell className='font-medium'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10 border-2 border-background shadow-sm'>
                      <AvatarImage src={user.src} alt={user.name} />
                      <AvatarFallback className='text-xs font-semibold bg-primary/10 text-primary'>
                        {user.fallback}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='font-semibold text-sm'>{user.name}</span>
                      <span className='text-xs text-muted-foreground'>ID: {user.id}</span>
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
                      <span className='text-xs font-medium'>{user.phoneNumber}</span>
                    </div>
                  </div>
                </TableCell>

                {/* User Type/Role */}
                <TableCell>
                  <Badge variant='outline' className={`${getUserTypeColor(user.type)} font-semibold text-xs`}>
                    {user.type}
                  </Badge>
                </TableCell>

                {/* Building/Location */}
                <TableCell>
                  <div className='flex items-center gap-2 min-w-[150px]'>
                    <Building2 className='size-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>{user.buildingName}</span>
                  </div>
                </TableCell>

                {/* Actions Dropdown */}
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-[160px]'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='cursor-pointer'>
                        <Eye className='mr-2 h-4 w-4' />
                        <span>View details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer'>
                        <Edit className='mr-2 h-4 w-4' />
                        <span>Edit user</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='cursor-pointer text-destructive focus:text-destructive'>
                        <Trash2 className='mr-2 h-4 w-4' />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      
      {/* Pagination */}
      <div className='border-t px-4 py-3 bg-muted/30'>
        <CustomTablePagination total={10} suggestions={[10, 20, 40, 50, 100]} />
      </div>
    </div>
  );
};

export default UsersTable;
