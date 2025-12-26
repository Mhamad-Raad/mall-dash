import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  User,
  Package,
  Building2,
  Store,
  Home,
  FileText,
  Plus,
  PenLine,
  Trash2,
  Eye,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { fetchAuditLogDetails, clearSelectedLog } from '@/store/slices/auditSlice';
import type { RootState, AppDispatch } from '@/store/store';
import { useState } from 'react';

const getActionConfig = (action: string) => {
  const actionLower = action?.toLowerCase() || '';
  if (actionLower === 'created' || actionLower === 'create') {
    return {
      icon: Plus,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      bgColor: 'bg-emerald-500',
      label: 'Created',
    };
  }
  if (actionLower === 'updated' || actionLower === 'update') {
    return {
      icon: PenLine,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      bgColor: 'bg-blue-500',
      label: 'Updated',
    };
  }
  if (actionLower === 'deleted' || actionLower === 'delete') {
    return {
      icon: Trash2,
      color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      bgColor: 'bg-red-500',
      label: 'Deleted',
    };
  }
  if (actionLower === 'viewed' || actionLower === 'view') {
    return {
      icon: Eye,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      bgColor: 'bg-purple-500',
      label: 'Viewed',
    };
  }
  return {
    icon: FileText,
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30',
    bgColor: 'bg-gray-500',
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

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const formatFieldName = (field: string): string => {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant='ghost'
      size='icon'
      className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
      onClick={handleCopy}
    >
      {copied ? (
        <Check className='h-3 w-3 text-green-500' />
      ) : (
        <Copy className='h-3 w-3 text-muted-foreground' />
      )}
    </Button>
  );
};

const ChangeRow = ({
  field,
  oldValue,
  newValue,
  isNew,
}: {
  field: string;
  oldValue: string;
  newValue: string;
  isNew: boolean;
}) => {
  const hasChange = oldValue !== newValue;

  return (
    <div className='group grid grid-cols-[140px_1fr_24px_1fr] gap-2 items-start py-3 px-4 hover:bg-muted/30 transition-colors overflow-hidden'>
      <div className='flex items-center gap-2 min-w-0'>
        <span className='text-sm font-medium text-foreground truncate'>{formatFieldName(field)}</span>
      </div>
      <div className='min-w-0'>
        {isNew ? (
          <span className='text-xs text-muted-foreground italic'>—</span>
        ) : (
          <code className='text-xs bg-muted/50 px-2 py-1 rounded block break-all text-muted-foreground'>
            {oldValue || <span className='italic'>empty</span>}
          </code>
        )}
      </div>
      <div className='flex justify-center pt-1'>
        {hasChange && (
          <div className='rounded-full bg-primary/10 p-1'>
            <ArrowRight className='h-3 w-3 text-primary' />
          </div>
        )}
      </div>
      <div className='min-w-0'>
        <code className='text-xs bg-primary/5 border border-primary/20 px-2 py-1 rounded block break-all text-foreground'>
          {newValue || <span className='italic text-muted-foreground'>empty</span>}
        </code>
      </div>
    </div>
  );
};

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

  const formatChanges = () => {
    if (!selectedLog) return [];

    const oldValues = selectedLog.oldValues || {};
    const newValues = selectedLog.newValues || {};

    const allKeys = Array.from(
      new Set([...Object.keys(oldValues), ...Object.keys(newValues)])
    );

    return allKeys.map((key) => ({
      field: key,
      oldValue: formatValue(oldValues[key]),
      newValue: formatValue(newValues[key]),
    }));
  };

  const changes = formatChanges();
  const isCreated =
    selectedLog?.action?.toLowerCase() === 'created' ||
    selectedLog?.action?.toLowerCase() === 'create';
  const isDeleted =
    selectedLog?.action?.toLowerCase() === 'deleted' ||
    selectedLog?.action?.toLowerCase() === 'delete';

  if (error) {
    return (
      <section className='w-full h-full flex flex-col gap-4 overflow-hidden'>
        <div className='flex items-center gap-3'>
          <Button variant='ghost' size='icon' onClick={() => navigate('/history')}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-xl font-semibold'>Audit Log Details</h1>
        </div>
        <Card className='border-destructive/50'>
          <CardContent className='py-8 text-center text-destructive'>
            <p>Error loading audit details: {error}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (detailsLoading) {
    return (
      <section className='w-full h-full flex flex-col gap-4 overflow-hidden'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-9 w-9 rounded-md' />
          <Skeleton className='h-6 w-48' />
        </div>
        <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <Skeleton className='h-full rounded-xl' />
          <Skeleton className='h-full lg:col-span-2 rounded-xl' />
        </div>
      </section>
    );
  }

  if (!selectedLog) {
    return (
      <section className='w-full h-full flex flex-col gap-4 overflow-hidden'>
        <div className='flex items-center gap-3'>
          <Button variant='ghost' size='icon' onClick={() => navigate('/history')}>
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-xl font-semibold'>Audit Log Details</h1>
        </div>
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-muted-foreground'>Audit log not found.</p>
        </div>
      </section>
    );
  }

  const actionConfig = getActionConfig(selectedLog.action);
  const ActionIcon = actionConfig.icon;
  const EntityIcon = getEntityIcon(selectedLog.entityName);

  return (
    <section className='w-full h-full flex flex-col gap-4 overflow-x-hidden overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/history')}
            className='shrink-0'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div className='flex items-center gap-3'>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${actionConfig.color}`}
            >
              <ActionIcon className='h-5 w-5' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-xl font-semibold'>
                  {selectedLog.entityName} {actionConfig.label}
                </h1>
                <Badge variant='outline' className='font-mono text-xs'>
                  #{selectedLog.entityId}
                </Badge>
              </div>
              <p className='text-sm text-muted-foreground'>
                Audit Log #{id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 overflow-hidden'>
        {/* Left Column - Details */}
        <Card className='flex flex-col overflow-hidden'>
          <ScrollArea className='flex-1'>
            <div className='p-5 space-y-6'>
              {/* User Section */}
              <div className='space-y-3'>
                <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  Performed By
                </h3>
                <div className='flex items-center gap-3 group'>
                  <Avatar className='h-12 w-12'>
                    <AvatarImage src={selectedLog.profileImageUrl} alt={selectedLog.userEmail} />
                    <AvatarFallback className='bg-primary/10 text-primary font-medium'>
                      {selectedLog.userEmail?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium truncate'>{selectedLog.userEmail}</p>
                    <p className='text-xs text-muted-foreground font-mono truncate'>
                      {selectedLog.userId}
                    </p>
                  </div>
                  <CopyButton text={selectedLog.userEmail || ''} />
                </div>
              </div>

              <Separator />

              {/* Action & Target */}
              <div className='space-y-3'>
                <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  Action Details
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>Action</span>
                    <Badge variant='outline' className={`${actionConfig.color} gap-1`}>
                      <ActionIcon className='h-3 w-3' />
                      {actionConfig.label}
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>Entity</span>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-6 w-6 items-center justify-center rounded bg-muted/60'>
                        <EntityIcon className='h-3.5 w-3.5 text-muted-foreground' />
                      </div>
                      <span className='font-medium text-sm'>{selectedLog.entityName}</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between group'>
                    <span className='text-sm text-muted-foreground'>Entity ID</span>
                    <div className='flex items-center gap-1'>
                      <code className='text-xs bg-muted/50 px-2 py-0.5 rounded font-mono'>
                        {selectedLog.entityId}
                      </code>
                      <CopyButton text={selectedLog.entityId || ''} />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timestamp */}
              <div className='space-y-3'>
                <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  Timestamp
                </h3>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50'>
                    <Clock className='h-5 w-5 text-muted-foreground' />
                  </div>
                  <div>
                    <p className='font-medium'>
                      {new Date(selectedLog.timestamp).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {new Date(selectedLog.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              {(selectedLog.ipAddress || selectedLog.userAgent) && (
                <>
                  <Separator />
                  <div className='space-y-3'>
                    <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                      Technical Details
                    </h3>
                    {selectedLog.ipAddress && (
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-muted-foreground'>IP Address</span>
                        <code className='text-xs bg-muted/50 px-2 py-0.5 rounded font-mono'>
                          {selectedLog.ipAddress}
                        </code>
                      </div>
                    )}
                    {selectedLog.userAgent && (
                      <div className='space-y-1'>
                        <span className='text-sm text-muted-foreground'>User Agent</span>
                        <code className='text-[10px] bg-muted/50 px-2 py-1 rounded font-mono block break-all text-muted-foreground'>
                          {selectedLog.userAgent}
                        </code>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* View Entity Link - Only show if not deleted */}
              {!isDeleted && (
                <>
                  <Separator />
                  <Button
                    variant='outline'
                    className='w-full gap-2'
                    onClick={() => {
                      const entityLower = selectedLog.entityName?.toLowerCase();
                      if (entityLower === 'user') navigate(`/users/${selectedLog.entityId}`);
                      else if (entityLower === 'vendor') navigate(`/vendors/${selectedLog.entityId}`);
                      else if (entityLower === 'product') navigate(`/products/${selectedLog.entityId}`);
                      else if (entityLower === 'building') navigate(`/buildings/${selectedLog.entityId}`);
                    }}
                  >
                    <ExternalLink className='h-4 w-4' />
                    View {selectedLog.entityName}
                  </Button>
                </>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Column - Changes */}
        <Card className='lg:col-span-2 flex flex-col overflow-hidden'>
          <div className='p-4 border-b bg-muted/30 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold'>
                {isCreated ? 'Created Values' : isDeleted ? 'Deleted Values' : 'Data Changes'}
              </h3>
              <Badge variant='outline' className='text-xs font-normal'>
                {changes.length} field{changes.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          {changes.length > 0 ? (
            <ScrollArea className='flex-1'>
              {/* Header Row */}
              {!isCreated && !isDeleted && (
                <div className='grid grid-cols-[140px_1fr_24px_1fr] gap-2 py-2 px-4 border-b bg-muted/20 text-xs font-medium text-muted-foreground'>
                  <div>Field</div>
                  <div>Previous Value</div>
                  <div></div>
                  <div>New Value</div>
                </div>
              )}

              {/* For Created - show only new values */}
              {isCreated ? (
                <div className='divide-y'>
                  {changes.map((change, index) => (
                    <div
                      key={index}
                      className='flex items-start justify-between py-3 px-4 hover:bg-muted/30 transition-colors'
                    >
                      <span className='text-sm font-medium text-foreground'>
                        {formatFieldName(change.field)}
                      </span>
                      <code className='text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded max-w-[60%] break-all text-right'>
                        {change.newValue}
                      </code>
                    </div>
                  ))}
                </div>
              ) : isDeleted ? (
                /* For Deleted - show only old values */
                <div className='divide-y'>
                  {changes.map((change, index) => (
                    <div
                      key={index}
                      className='flex items-start justify-between py-3 px-4 hover:bg-muted/30 transition-colors'
                    >
                      <span className='text-sm font-medium text-foreground'>
                        {formatFieldName(change.field)}
                      </span>
                      <code className='text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2 py-1 rounded max-w-[60%] break-all text-right line-through'>
                        {change.oldValue}
                      </code>
                    </div>
                  ))}
                </div>
              ) : (
                /* For Updated - show comparison */
                <div className='divide-y'>
                  {changes.map((change, index) => (
                    <ChangeRow
                      key={index}
                      field={change.field}
                      oldValue={change.oldValue}
                      newValue={change.newValue}
                      isNew={change.oldValue === 'null'}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          ) : (
            <div className='flex-1 flex flex-col items-center justify-center text-muted-foreground p-8'>
              <div className='rounded-full bg-muted/50 p-4 mb-4'>
                <FileText className='h-8 w-8 opacity-50' />
              </div>
              <p className='font-medium'>No data changes recorded</p>
              <p className='text-sm text-muted-foreground/70'>
                This action did not modify any fields
              </p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default AuditDetailsPage;
