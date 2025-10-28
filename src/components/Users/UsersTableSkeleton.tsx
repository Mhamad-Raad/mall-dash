import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const UsersTableSkeleton = () => (
  <TableRow className='hover:bg-transparent'>
    {/* User Info Skeleton */}
    <TableCell>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>
    </TableCell>

    {/* Contact Info Skeleton */}
    <TableCell>
      <div className='flex flex-col gap-1.5 min-w-[200px]'>
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-4 w-36' />
      </div>
    </TableCell>

    {/* Role Skeleton */}
    <TableCell>
      <Skeleton className='h-6 w-20 rounded-full' />
    </TableCell>

    {/* Location Skeleton */}
    <TableCell>
      <div className='flex items-center gap-2 min-w-[150px]'>
        <Skeleton className='h-4 w-4' />
        <Skeleton className='h-4 w-32' />
      </div>
    </TableCell>
  </TableRow>
);

export default UsersTableSkeleton;
