import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { Users as UsersTableProps } from '@/interfaces/Users.interface';

const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className='[&>div]:rounded-sm [&>div]:border'>
      {/* Scrollable Table Container */}
      <ScrollArea className='h-[500px] overflow-y-auto'>
        <Table className='min-w-full'>
          <TableHeader>
            <TableRow className='bg-background'>
              <TableHead className='w-12 bg-background sticky top-0 z-10'></TableHead>
              <TableHead className='bg-background sticky top-0 z-10'>
                Name
              </TableHead>
              <TableHead className='bg-background sticky top-0 z-10'>
                Po.N.
              </TableHead>
              <TableHead className='bg-background sticky top-0 z-10'>
                Email
              </TableHead>
              <TableHead className='bg-background sticky top-0 z-10'>
                Type
              </TableHead>
              <TableHead className='bg-background sticky top-0 z-10'>
                Building
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src={user.src} alt={user.fallback} />
                      <AvatarFallback className='text-xs'>
                        {user.fallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TableCell>

                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>{user.buildingName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default UsersTable;
