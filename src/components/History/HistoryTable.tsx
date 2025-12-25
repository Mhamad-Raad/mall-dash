import { useSelector } from 'react-redux';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import CustomTablePagination from '../CustomTablePagination';
import type { RootState } from '@/store/store';
import type { AuditLog } from '@/interfaces/Audit.interface';

const HistoryTable = () => {
  const { logs, loading, error, total } = useSelector(
    (state: RootState) => state.audit
  );

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      <ScrollArea className='h-[calc(100vh-280px)] md:h-[calc(100vh-280px)]'>
        <div className='relative w-full overflow-auto'>
          <Table className='w-full min-w-[1000px]'>
            <TableHeader>
              <TableRow className='hover:bg-transparent border-b bg-muted/50'>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Action
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Entity
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Entity ID
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  User Email
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Date & Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className='border-b'>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-24' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-32' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-20' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-24' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-6 w-40' />
                    </TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    No history found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log: AuditLog, index) => (
                  <TableRow
                    key={log.id || index}
                    className='hover:bg-muted/50 transition-colors border-b last:border-0'
                  >
                    <TableCell className='font-medium py-4'>
                      {log.action || '-'}
                    </TableCell>
                    <TableCell className='py-4'>
                      {log.entityName || '-'}
                    </TableCell>
                    <TableCell className='py-4 font-mono text-sm text-muted-foreground'>
                      {log.entityId || '-'}
                    </TableCell>
                    <TableCell className='py-4 text-sm text-muted-foreground'>
                      {log.userEmail || '-'}
                    </TableCell>
                    <TableCell className='py-4'>
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className='p-4 border-t bg-muted/20 sticky left-0 right-0'>
            <CustomTablePagination
              total={total}
              suggestions={[10, 20, 50, 100]}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryTable;

