import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import CustomTablePagination from '../CustomTablePagination';
import type { RootState } from '@/store/store';
import type { Request } from '@/interfaces/Request.interface';

const RequestsTable = () => {
  const navigate = useNavigate();
  const { requests, loading, error, total } = useSelector(
    (state: RootState) => state.requests
  );

  const handleRowClick = (id: string) => {
    navigate(`/requests/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20';
      case 'Resolved':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20';
    }
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden flex-1 min-h-0'>
      <ScrollArea className='flex-1 min-h-0'>
        <div className='relative w-full overflow-auto'>
          <Table className='w-full min-w-[1000px]'>
            <TableHeader>
              <TableRow className='hover:bg-transparent border-b bg-muted/50'>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  ID
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Title
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Tenant
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Status
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Date & Time Sent
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className='border-b'>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-20' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-48' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-32' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-24' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-20' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-32' />
                    </TableCell>
                  </TableRow>
                ))
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request: Request) => (
                  <TableRow
                    key={request.id}
                    className='hover:bg-muted/50 transition-colors border-b last:border-0 cursor-pointer'
                    onClick={() => handleRowClick(request.id)}
                  >
                    <TableCell className='font-mono text-sm font-medium py-4'>
                      {request.id}
                    </TableCell>
                    <TableCell className='font-medium py-4'>
                      {request.title}
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex flex-col'>
                        <span className='font-medium'>
                          {request.tenantName}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {request.tenantId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <Badge
                        variant='outline'
                        className={getStatusColor(request.status)}
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='py-4 text-muted-foreground'>
                      {new Date(request.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      <div className='p-4 border-t bg-muted/20 shrink-0'>
        <CustomTablePagination
          total={total}
          suggestions={[10, 20, 50, 100]}
        />
      </div>
    </div>
  );
};

export default RequestsTable;

