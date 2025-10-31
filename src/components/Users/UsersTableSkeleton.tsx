import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const UsersTableSkeleton = () => (
  <TableRow>
    {/* User Info Skeleton - matches Avatar + Name + ID */}
    <TableCell className='font-medium'>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-10 w-10 rounded-full shrink-0 border-2 border-transparent' />
        <div className='flex flex-col'>
          <Skeleton className='h-[1.125rem] w-28 mb-0.5' /> {/* Name - text-sm height */}
          <Skeleton className='h-4 w-24' /> {/* ID - text-xs height */}
        </div>
      </div>
    </TableCell>

    {/* Contact Info Skeleton - matches Email + Phone */}
    <TableCell>
      <div className='flex flex-col gap-1.5 min-w-[200px]'>
        <div className='flex items-center gap-2 text-sm'>
          <Skeleton className='h-3.5 w-3.5 rounded' /> {/* Mail icon */}
          <Skeleton className='h-4 w-40' /> {/* Email - text-xs */}
        </div>
        <div className='flex items-center gap-2 text-sm'>
          <Skeleton className='h-3.5 w-3.5 rounded' /> {/* Phone icon */}
          <Skeleton className='h-4 w-28' /> {/* Phone number - text-xs */}
        </div>
      </div>
    </TableCell>

    {/* Role Skeleton - matches Badge */}
    <TableCell>
      <Skeleton className='h-6 w-24 rounded-md' />
    </TableCell>

    {/* Location Skeleton - matches Building icon + Name */}
    <TableCell>
      <div className='flex items-center gap-2 min-w-[150px]'>
        <Skeleton className='h-4 w-4 rounded' /> {/* Building icon */}
        <Skeleton className='h-[1.125rem] w-32' /> {/* Building name - text-sm height */}
      </div>
    </TableCell>
  </TableRow>
);

export default UsersTableSkeleton;
