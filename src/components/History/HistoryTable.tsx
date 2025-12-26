import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import {
  PenLine,
  Plus,
  Trash2,
  Eye,
  ChevronRight,
  User,
  Package,
  Building2,
  Store,
  Home,
  FileText,
  Calendar,
  Mail,
} from 'lucide-react';
import CustomTablePagination from '../CustomTablePagination';
import type { RootState } from '@/store/store';
import type { AuditLog } from '@/interfaces/Audit.interface';

const getActionConfig = (action: string) => {
  const actionLower = action?.toLowerCase() || '';
  if (actionLower === 'created' || actionLower === 'create') {
    return {
      icon: Plus,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      label: 'Created',
    };
  }
  if (actionLower === 'updated' || actionLower === 'update') {
    return {
      icon: PenLine,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      label: 'Updated',
    };
  }
  if (actionLower === 'deleted' || actionLower === 'delete') {
    return {
      icon: Trash2,
      color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      label: 'Deleted',
    };
  }
  if (actionLower === 'viewed' || actionLower === 'view') {
    return {
      icon: Eye,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      label: 'Viewed',
    };
  }
  return {
    icon: FileText,
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30',
    label: action || 'Unknown',
  };
};

const getEntityIcon = (entityName: string) => {
  const entityLower = entityName?.toLowerCase() || '';
  if (entityLower === 'user') return User;
  if (entityLower === 'product') return Package;
  if (entityLower === 'building') return Building2;
  if (entityLower === 'vendor') return Store;
  if (entityLower === 'apartment') return Home;
  return FileText;
};

const HistoryTable = () => {
  const navigate = useNavigate();
  const { logs, loading, error, total } = useSelector(
    (state: RootState) => state.audit
  );

  const handleRowClick = (id: string | number) => {
    navigate(`/history/${id}`);
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      <ScrollArea className='h-[calc(100vh-280px)]'>
        <Table className='w-full min-w-[1000px]'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-b bg-muted/50'>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12 w-[140px]'>
                Action
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12 w-[160px]'>
                Entity
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                Entity ID
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                User
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12 w-[180px]'>
                Date & Time
              </TableHead>
              <TableHead className='sticky top-0 z-10 w-12 bg-muted/50 backdrop-blur-sm border-b h-12'></TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className='border-b'>
                    <TableCell className='py-4'>
                      <Skeleton className='h-7 w-24 rounded-full' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex items-center gap-2'>
                        <Skeleton className='h-8 w-8 rounded-lg' />
                        <Skeleton className='h-5 w-20' />
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-5 w-32' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-5 w-40' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <div className='flex flex-col gap-1'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-3 w-16' />
                      </div>
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-5 w-5 rounded' />
                    </TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-32 text-center'>
                    <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                      <FileText className='h-8 w-8 opacity-50' />
                      <span>No audit history found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log: AuditLog, index) => {
                  const actionConfig = getActionConfig(log.action);
                  const ActionIcon = actionConfig.icon;
                  const EntityIcon = getEntityIcon(log.entityName);
                  
                  return (
                    <TableRow
                      key={log.id || index}
                      className='hover:bg-muted/50 transition-colors border-b last:border-0 cursor-pointer group'
                      onClick={() => handleRowClick(log.id)}
                    >
                      <TableCell className='py-3'>
                        <Badge
                          variant='outline'
                          className={`${actionConfig.color} gap-1.5 font-medium`}
                        >
                          <ActionIcon className='h-3.5 w-3.5' />
                          {actionConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className='py-3'>
                        <div className='flex items-center gap-2.5'>
                          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-muted/80'>
                            <EntityIcon className='h-4 w-4 text-muted-foreground' />
                          </div>
                          <span className='font-medium'>{log.entityName || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell className='py-3'>
                        <code className='rounded bg-muted/60 px-2 py-1 text-xs font-mono text-muted-foreground'>
                          {log.entityId || '-'}
                        </code>
                      </TableCell>
                      <TableCell className='py-3'>
                        <div className='flex items-center gap-2'>
                          <Mail className='h-3.5 w-3.5 text-muted-foreground' />
                          <span className='text-sm text-muted-foreground truncate max-w-[200px]'>
                            {log.userEmail || '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='py-3'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-3.5 w-3.5 text-muted-foreground' />
                          <div className='flex flex-col'>
                            <span className='text-sm font-medium'>
                              {log.timestamp
                                ? new Date(log.timestamp).toLocaleDateString()
                                : '-'}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {log.timestamp
                                ? new Date(log.timestamp).toLocaleTimeString()
                                : ''}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='py-3'>
                        <ChevronRight className='h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
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

export default HistoryTable;

