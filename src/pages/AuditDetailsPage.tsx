import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  User,
  Shield,
  Activity,
  Monitor,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ChangeComparison from '@/components/ui/Modals/ChangeComparison';
import { fetchAuditLogDetails, clearSelectedLog } from '@/store/slices/auditSlice';
import type { RootState, AppDispatch } from '@/store/store';
import type { ChangeDetail } from '@/components/ui/Modals/ConfirmModal';

const AuditDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedLog, detailsLoading, error } = useSelector(
    (state: RootState) => state.audit
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAuditLogDetails(id));
    }
    return () => {
      dispatch(clearSelectedLog());
    };
  }, [id, dispatch]);

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

  if (error) {
    return (
      <div className='container mx-auto py-6 px-4 md:px-6 max-w-5xl'>
        <Button variant='ghost' onClick={() => navigate('/history')} className='mb-6'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to History
        </Button>
        <Card className='border-destructive/50'>
          <CardContent className='pt-6 text-center text-destructive'>
            <p>Error loading audit details: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-6 px-4 md:px-6 max-w-5xl'>
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='ghost' onClick={() => navigate('/history')} className='h-9 px-2'>
          <ArrowLeft className='h-5 w-5' />
          <span className='sr-only'>Back</span>
        </Button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Audit Log Details</h1>
          <p className='text-muted-foreground'>
            Viewing details for log #{id}
          </p>
        </div>
      </div>

      {detailsLoading ? (
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-6'>
            <Skeleton className='h-[200px] w-full rounded-xl' />
            <Skeleton className='h-[150px] w-full rounded-xl' />
          </div>
          <Skeleton className='h-[400px] w-full rounded-xl' />
        </div>
      ) : selectedLog ? (
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Left Column: Meta Info */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Main Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Activity className='h-5 w-5 text-primary' />
                  Activity Info
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Action
                  </label>
                  <div>
                    <Badge
                      variant={
                        selectedLog.action === 'Create' || selectedLog.action === 'Created'
                          ? 'default'
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

                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Entity
                  </label>
                  <div className='font-medium'>{selectedLog.entityName}</div>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                    Entity ID
                  </label>
                  <div className='font-mono text-sm bg-muted/50 px-2 py-1 rounded w-fit'>
                    {selectedLog.entityId}
                  </div>
                </div>

                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    Timestamp
                  </label>
                  <div className='text-sm'>
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <User className='h-5 w-5 text-primary' />
                  User Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold'>
                    {selectedLog.userEmail?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className='overflow-hidden'>
                    <div className='font-medium truncate' title={selectedLog.userEmail}>
                      {selectedLog.userEmail}
                    </div>
                    <div className='text-xs text-muted-foreground truncate' title={selectedLog.userId}>
                      ID: {selectedLog.userId}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Monitor className='h-5 w-5 text-primary' />
                  Technical Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 text-sm'>
                {selectedLog.ipAddress && (
                  <div className='space-y-1'>
                    <label className='text-xs text-muted-foreground'>IP Address</label>
                    <div className='font-mono bg-muted/30 px-2 py-1 rounded w-fit'>
                      {selectedLog.ipAddress}
                    </div>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div className='space-y-1'>
                    <label className='text-xs text-muted-foreground'>User Agent</label>
                    <div className='font-mono text-xs bg-muted/30 px-2 py-1 rounded break-all'>
                      {selectedLog.userAgent}
                    </div>
                  </div>
                )}
                {selectedLog.affectedColumns && selectedLog.affectedColumns.length > 0 && (
                  <div className='space-y-1'>
                    <label className='text-xs text-muted-foreground'>Affected Columns</label>
                    <div className='flex flex-wrap gap-1'>
                      {selectedLog.affectedColumns.map((col, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {col}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Changes */}
          <div className='lg:col-span-2'>
            <Card className='h-full flex flex-col'>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Database className='h-5 w-5 text-primary' />
                  Data Changes
                  <Badge variant='outline' className='ml-2 font-normal text-xs'>
                    {changes.length} field{changes.length !== 1 ? 's' : ''} modified
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-1'>
                {changes.length > 0 ? (
                  <ChangeComparison changes={changes} />
                ) : (
                  <div className='h-full flex flex-col items-center justify-center text-muted-foreground p-8 min-h-[200px]'>
                    <Shield className='h-12 w-12 mb-4 opacity-20' />
                    <p>No field changes recorded for this action.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center py-12'>
          <p className='text-muted-foreground'>Audit log not found.</p>
        </div>
      )}
    </div>
  );
};

export default AuditDetailsPage;
