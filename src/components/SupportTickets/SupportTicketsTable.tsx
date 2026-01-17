import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/store/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import CustomTablePagination from '@/components/CustomTablePagination';
import type { SupportTicket } from '@/interfaces/SupportTicket.interface';

const statusColorMap: Record<number, string> = {
  0: 'bg-blue-50 text-blue-700 border-blue-200',
  1: 'bg-amber-50 text-amber-700 border-amber-200',
  2: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  3: 'bg-gray-100 text-gray-700 border-gray-200',
};

const priorityColorMap: Record<number, string> = {
  0: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  1: 'bg-blue-50 text-blue-700 border-blue-200',
  2: 'bg-amber-50 text-amber-700 border-amber-200',
  3: 'bg-red-50 text-red-700 border-red-200',
};

const formatDate = (value: string | undefined | null) => {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleString();
};

const renderSkeletonRow = (key: number) => (
  <TableRow key={key}>
    <TableCell>
      <Skeleton className='h-4 w-16' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-40' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-32' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-5 w-24' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-5 w-20' />
    </TableCell>
    <TableCell>
      <Skeleton className='h-4 w-32' />
    </TableCell>
  </TableRow>
);

const SupportTicketsTable = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('supportTickets');
  const { tickets, loading, error, total } = useSelector(
    (state: RootState) => state.supportTickets
  );

  const handleRowClick = (id: number) => {
    navigate(`/support-tickets/${id}`);
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-6'>
        <div className='text-center text-destructive text-sm'>
          {t('table.error', { message: error })}
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      <ScrollArea className='h-[calc(100vh-280px)]'>
        <Table className='w-full min-w-[900px]'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-b bg-muted/50'>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.ticket')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.subject')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.user')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.status')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.priority')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('table.headers.created')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) =>
                renderSkeletonRow(index)
              )
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='h-32 text-center text-sm text-muted-foreground'
                >
                  {t('table.empty')}
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket: SupportTicket) => (
                <TableRow
                  key={ticket.id}
                  className='hover:bg-muted/50 cursor-pointer'
                  onClick={() => handleRowClick(ticket.id)}
                >
                  <TableCell className='font-medium text-sm'>
                    #{ticket.ticketNumber || ticket.id}
                  </TableCell>
                  <TableCell className='text-sm max-w-xs'>
                    <div className='line-clamp-2'>{ticket.subject}</div>
                  </TableCell>
                  <TableCell className='text-sm'>
                    {ticket.userName || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`text-xs font-medium border ${
                        statusColorMap[ticket.status] || ''
                      }`}
                    >
                      {ticket.status === 0
                        ? t('status.open')
                        : ticket.status === 1
                        ? t('status.inProgress')
                        : ticket.status === 2
                        ? t('status.resolved')
                        : ticket.status === 3
                        ? t('status.closed')
                        : t('status.unknown')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`text-xs font-medium border ${
                        priorityColorMap[ticket.priority] || ''
                      }`}
                    >
                      {ticket.priority === 0
                        ? t('priority.low')
                        : ticket.priority === 1
                        ? t('priority.medium')
                        : ticket.priority === 2
                        ? t('priority.high')
                        : ticket.priority === 3
                        ? t('priority.urgent')
                        : ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-xs text-muted-foreground'>
                    {formatDate(ticket.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className='border-t px-3 py-2 bg-background'>
        <CustomTablePagination
          total={total}
          suggestions={[10, 20, 30, 40, 50]}
        />
      </div>
    </div>
  );
};

export default SupportTicketsTable;
