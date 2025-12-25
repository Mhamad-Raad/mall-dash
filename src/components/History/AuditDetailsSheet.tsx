import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import ChangeComparison from '@/components/ui/Modals/ChangeComparison';
import { clearSelectedLog } from '@/store/slices/auditSlice';
import type { RootState, AppDispatch } from '@/store/store';
import type { ChangeDetail } from '@/components/ui/Modals/ConfirmModal';

interface AuditDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuditDetailsSheet = ({ open, onOpenChange }: AuditDetailsSheetProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedLog, detailsLoading } = useSelector(
    (state: RootState) => state.audit
  );

  // Clear selected log when sheet closes
  useEffect(() => {
    if (!open) {
      // Small delay to allow animation to finish
      const timer = setTimeout(() => {
        dispatch(clearSelectedLog());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, dispatch]);

  const formatChanges = (): ChangeDetail[] => {
    if (!selectedLog) return [];
    
    const oldValues = selectedLog.oldValues || {};
    const newValues = selectedLog.newValues || {};
    
    const allKeys = Array.from(
      new Set([...Object.keys(oldValues), ...Object.keys(newValues)])
    );

    return allKeys.map((key) => ({
      field: key,
      oldValue: oldValues[key] !== undefined ? String(oldValues[key]) : '',
      newValue: newValues[key] !== undefined ? String(newValues[key]) : '',
    }));
  };

  const changes = formatChanges();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='sm:max-w-xl w-full overflow-hidden flex flex-col'>
        <SheetHeader className='space-y-4 pb-6 border-b'>
          <SheetTitle className='text-2xl font-bold flex items-center gap-2'>
            Audit Details
            {selectedLog && (
              <Badge variant='outline' className='ml-2 font-normal text-sm'>
                #{selectedLog.id}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            View detailed information about this audit log entry.
          </SheetDescription>
        </SheetHeader>

        {detailsLoading ? (
          <div className='flex-1 py-6 space-y-6'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-32 w-full' />
            </div>
          </div>
        ) : selectedLog ? (
          <ScrollArea className='flex-1 -mx-6 px-6'>
            <div className='py-6 space-y-8'>
              {/* Basic Info Grid */}
              <div className='grid grid-cols-2 gap-6'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Entity
                  </label>
                  <p className='font-medium text-foreground'>
                    {selectedLog.entityName}
                  </p>
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Entity ID
                  </label>
                  <p className='font-mono text-sm font-medium text-foreground bg-muted/50 px-2 py-1 rounded w-fit'>
                    {selectedLog.entityId}
                  </p>
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Action
                  </label>
                  <div>
                    <Badge
                      variant={
                        selectedLog.action === 'Create' || selectedLog.action === 'Created'
                          ? 'default' // default is usually primary/dark
                          : selectedLog.action === 'Delete' || selectedLog.action === 'Deleted'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={
                        selectedLog.action === 'Create' || selectedLog.action === 'Created'
                          ? 'bg-green-600 hover:bg-green-700'
                          : ''
                      }
                    >
                      {selectedLog.action}
                    </Badge>
                  </div>
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Date & Time
                  </label>
                  <p className='font-medium text-foreground'>
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className='col-span-2 space-y-1.5'>
                  <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    User
                  </label>
                  <div className='flex items-center gap-2'>
                    <div className='size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs'>
                      {selectedLog.userEmail?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium'>
                        {selectedLog.userEmail}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {selectedLog.userId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Changes Section */}
              {changes.length > 0 && (
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                      Changes
                    </label>
                    <Badge variant='outline' className='h-5 px-1.5 text-[10px]'>
                      {changes.length} field{changes.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <ChangeComparison changes={changes} />
                </div>
              )}

              {/* Technical Details */}
              <div className='space-y-3 pt-4 border-t'>
                <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  Technical Details
                </label>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  {selectedLog.ipAddress && (
                    <div className='flex flex-col gap-1'>
                      <span className='text-muted-foreground text-xs'>IP Address</span>
                      <span className='font-mono bg-muted/30 px-2 py-1 rounded text-xs w-fit'>
                        {selectedLog.ipAddress}
                      </span>
                    </div>
                  )}
                  {selectedLog.userAgent && (
                    <div className='col-span-2 flex flex-col gap-1'>
                      <span className='text-muted-foreground text-xs'>User Agent</span>
                      <span className='font-mono bg-muted/30 px-2 py-1 rounded text-xs break-all'>
                        {selectedLog.userAgent}
                      </span>
                    </div>
                  )}
                  {selectedLog.affectedColumns && selectedLog.affectedColumns.length > 0 && (
                     <div className='col-span-2 flex flex-col gap-1'>
                     <span className='text-muted-foreground text-xs'>Affected Columns</span>
                     <div className='flex flex-wrap gap-1'>
                        {selectedLog.affectedColumns.map((col, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{col}</Badge>
                        ))}
                     </div>
                   </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className='flex-1 flex items-center justify-center text-muted-foreground'>
            No details available.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AuditDetailsSheet;