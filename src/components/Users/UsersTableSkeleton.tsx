import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

const UsersTableSkeleton = () => (
  <TableRow className='border-b'>
    {/* User Info Skeleton - matches Avatar + Name + ID */}
    <TableCell className='py-4'>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-11 w-11 rounded-full shrink-0 border-2 border-transparent' />
        <div className='flex flex-col gap-0.5'>
          <Skeleton className='h-4 w-28' /> {/* Name - text-sm height */}
          <Skeleton className='h-3 w-20' /> {/* ID - text-[11px] height */}
        </div>
      </div>
    </TableCell>

    {/* Contact Info Skeleton - matches Email + Phone */}
    <TableCell className='py-4'>
      <div className='flex flex-col gap-2 min-w-[200px]'>
        <div className='flex items-center gap-2.5'>
          <Skeleton className='h-6 w-6 rounded-md' /> {/* Mail icon container */}
          <Skeleton className='h-3 w-40' /> {/* Email - text-xs */}
        </div>
        <div className='flex items-center gap-2.5'>
          <Skeleton className='h-6 w-6 rounded-md' /> {/* Phone icon container */}
          <Skeleton className='h-3 w-28' /> {/* Phone number - text-xs */}
        </div>
      </div>
    </TableCell>

    {/* Role Skeleton - matches Badge */}
    <TableCell className='py-4'>
      <Skeleton className='h-7 w-24 rounded-md' />
    </TableCell>

    {/* Location Skeleton - matches Building icon + Name */}
    <TableCell className='py-4'>
      <div className='flex items-center gap-2.5 min-w-[150px]'>
        <Skeleton className='h-6 w-6 rounded-md' /> {/* Building icon container */}
        <Skeleton className='h-3 w-32' /> {/* Building name - text-xs height */}
      </div>
    </TableCell>
    
    {/* ChevronRight Skeleton */}
    <TableCell className='py-4'>
      <Skeleton className='h-4 w-4 rounded' />
    </TableCell>
  </TableRow>
);

export default UsersTableSkeleton;
