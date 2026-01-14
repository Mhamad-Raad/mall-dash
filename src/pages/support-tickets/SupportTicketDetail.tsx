import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  User,
  Clock,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ConfirmModal, {
  type ChangeDetail,
} from '@/components/ui/Modals/ConfirmModal';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/utils';

import {
  fetchSupportTicketById,
  updateSupportTicketStatus,
} from '@/data/SupportTickets';

import type { SupportTicketDetailInterface } from '@/data/SupportTickets';

import type { TicketStatus } from '@/interfaces/SupportTicket.interface';

const getStatusText = (status: TicketStatus) => {
  if (status === 0) return 'Open';
  if (status === 1) return 'In Progress';
  if (status === 2) return 'Resolved';
  if (status === 3) return 'Closed';
  return 'Unknown';
};

const getStatusBadgeClass = (status: TicketStatus) => {
  if (status === 0) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 1) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 2) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 3) return 'bg-gray-100 text-gray-700 border-gray-200';
  return '';
};

const formatDateTime = (date: string | Date | null | undefined) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
};

const SupportTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<SupportTicketDetailInterface | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<TicketStatus | null>(null);
  const [adminNotesDraft, setAdminNotesDraft] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      const numericId = Number(id);

      if (Number.isNaN(numericId)) {
        setError('Invalid ticket id');
        setLoading(false);
        return;
      }

      const result = await fetchSupportTicketById(numericId);

      if ('error' in result) {
        setError(result.error);
        setTicket(null);
      } else {
        setTicket(result);
        setError(null);
        setStatusDraft(result.status);
        setAdminNotesDraft(result.adminNotes ?? '');
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const hasChanges = useMemo(() => {
    if (!ticket) return false;
    const statusChanged = statusDraft !== null && statusDraft !== ticket.status;
    const notesChanged = (ticket.adminNotes ?? '') !== adminNotesDraft;
    return statusChanged || notesChanged;
  }, [ticket, statusDraft, adminNotesDraft]);

  const changes = useMemo((): ChangeDetail[] => {
    if (!ticket) return [];
    const list: ChangeDetail[] = [];

    if (statusDraft !== null && statusDraft !== ticket.status) {
      list.push({
        field: 'Status',
        oldValue: getStatusText(ticket.status),
        newValue: getStatusText(statusDraft),
      });
    }

    if ((ticket.adminNotes ?? '') !== adminNotesDraft) {
      list.push({
        field: 'Admin notes',
        oldValue:
          ticket.adminNotes && ticket.adminNotes.trim().length > 0
            ? 'Has notes'
            : 'Empty',
        newValue: adminNotesDraft.trim().length > 0 ? 'Has notes' : 'Empty',
      });
    }

    return list;
  }, [ticket, statusDraft, adminNotesDraft]);

  const handleToggleUpdateModal = () => {
    if (!hasChanges || !ticket) return;
    setShowUpdateModal((v) => !v);
  };

  const handleUpdateTicket = async () => {
    if (!ticket || !id || statusDraft === null) return;

    setUpdating(true);

    const body = {
      status: statusDraft,
      adminNotes: adminNotesDraft.trim().length > 0 ? adminNotesDraft : null,
    };

    const numericId = Number(id);

    const result = await updateSupportTicketStatus(numericId, body);

    if ('error' in result) {
      const errors = (result as any).errors;
      if (errors && Array.isArray(errors)) {
        showValidationErrors(
          'Failed to update ticket',
          errors,
          'An error occurred while updating the ticket'
        );
      } else {
        showValidationErrors(
          'Failed to update ticket',
          result.error,
          'An error occurred while updating the ticket'
        );
      }
      setUpdating(false);
      return;
    }

    setTicket(result);
    setStatusDraft(result.status);
    setAdminNotesDraft(result.adminNotes ?? '');
    setUpdating(false);
    setShowUpdateModal(false);
    toast.success('Ticket updated successfully!');
  };

  if (loading) {
    return (
      <section className='w-full h-full flex flex-col gap-4 overflow-hidden p-4 md:p-6'>
        <div className='flex items-center gap-3 mb-2'>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full'
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div className='space-y-1'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-4 w-64' />
          </div>
        </div>

        <Card className='mt-2'>
          <CardContent className='p-6 space-y-4'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-4 w-4/6' />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error || !ticket) {
    return (
      <section className='w-full h-full flex flex-col gap-4 overflow-hidden p-4 md:p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full'
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <h1 className='text-xl font-semibold'>Support Ticket</h1>
        </div>

        <Card className='border-destructive/30 bg-destructive/5'>
          <CardContent className='p-6 flex flex-col items-center justify-center text-center gap-3'>
            <AlertCircle className='h-10 w-10 text-destructive mb-1' />
            <h2 className='text-lg font-semibold'>Unable to load ticket</h2>
            <p className='text-sm text-muted-foreground'>
              {error || 'Ticket not found or you do not have access.'}
            </p>
            <div className='mt-4 flex gap-2'>
              <Button
                variant='outline'
                onClick={() => navigate('/support-tickets')}
              >
                Back to tickets
              </Button>
              <Button variant='default' onClick={() => navigate(0)}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className='w-full h-full flex flex-col gap-4 overflow-hidden p-4 md:p-6'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full'
            onClick={() => navigate('/support-tickets')}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Ticket #{ticket.ticketNumber || ticket.id}
            </h1>
            <p className='text-sm text-muted-foreground'>
              Created at {formatDateTime(ticket.createdAt)}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Select
            value={String(statusDraft ?? ticket.status)}
            onValueChange={(value) =>
              setStatusDraft(Number(value) as TicketStatus)
            }
            disabled={updating}
          >
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Open</SelectItem>
              <SelectItem value='1'>In Progress</SelectItem>
              <SelectItem value='2'>Resolved</SelectItem>
              <SelectItem value='3'>Closed</SelectItem>
            </SelectContent>
          </Select>
          <Badge
            variant='outline'
            className={`text-xs font-medium px-3 py-1 ${getStatusBadgeClass(
              statusDraft ?? ticket.status
            )}`}
          >
            {getStatusText(statusDraft ?? ticket.status)}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0'>
        <div className='lg:col-span-2 flex flex-col gap-4 min-h-0'>
          <Card className='flex-1'>
            <CardHeader>
              <CardTitle className='text-base'>Ticket details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <p className='text-xs font-medium text-muted-foreground uppercase mb-1.5'>
                    Subject
                  </p>
                  <p className='text-sm font-medium'>{ticket.subject}</p>
                </div>

                <div>
                  <p className='text-xs font-medium text-muted-foreground uppercase mb-1.5'>
                    Description
                  </p>
                  <ScrollArea className='max-h-64 rounded-md border bg-muted/30 p-3'>
                    <p className='text-sm whitespace-pre-line leading-relaxed'>
                      {ticket.description}
                    </p>
                  </ScrollArea>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-xs font-medium text-muted-foreground uppercase mb-1.5'>
                      Priority
                    </p>
                    <Badge variant='outline' className='text-xs font-medium'>
                      {ticket.priority === 0
                        ? 'Low'
                        : ticket.priority === 1
                        ? 'Medium'
                        : ticket.priority === 2
                        ? 'High'
                        : ticket.priority === 3
                        ? 'Urgent'
                        : ticket.priority}
                    </Badge>
                  </div>

                  <div>
                    <p className='text-xs font-medium text-muted-foreground uppercase mb-1.5'>
                      Resolved at
                    </p>
                    <p className='text-sm'>
                      {ticket.resolvedAt
                        ? formatDateTime(ticket.resolvedAt)
                        : 'Not resolved yet'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className='text-xs font-medium text-muted-foreground uppercase mb-1.5'>
                    Admin notes
                  </p>
                  <Textarea
                    value={adminNotesDraft}
                    onChange={(e) => setAdminNotesDraft(e.target.value)}
                    placeholder='Add internal notes about this ticket...'
                    className='min-h-[100px] text-sm'
                    disabled={updating}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex flex-col gap-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Requester</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center'>
                  <User className='h-4 w-4 text-primary' />
                </div>
                <div>
                  <p className='text-sm font-medium'>{ticket.userName}</p>
                  <p className='text-xs text-muted-foreground'>
                    User ID: {ticket.userId}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Mail className='h-4 w-4' />
                <span>{ticket.userEmail}</span>
              </div>

              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Clock className='h-4 w-4' />
                <span>Created {formatDateTime(ticket.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.imageUrls && ticket.imageUrls.length > 0 ? (
                <div className='grid grid-cols-2 gap-2'>
                  {ticket.imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className='relative group rounded-md overflow-hidden border bg-muted/40'
                    >
                      <img
                        src={url}
                        alt={`Attachment ${index + 1}`}
                        className='w-full h-24 object-cover transition-transform group-hover:scale-105'
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground py-4'>
                  <ImageIcon className='h-6 w-6' />
                  <span>No attachments</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className='flex justify-end gap-2 mt-2'>
        <Button
          variant='outline'
          onClick={() => navigate('/support-tickets')}
          disabled={updating}
        >
          Back
        </Button>
        <Button
          onClick={handleToggleUpdateModal}
          disabled={!hasChanges || updating}
        >
          Save changes
        </Button>
      </div>

      <ConfirmModal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        onConfirm={handleUpdateTicket}
        title='Update ticket'
        description='Are you sure you want to update this support ticket?'
        confirmType='warning'
        confirmLabel='Update ticket'
        cancelLabel='Cancel'
        changes={changes}
      />
    </section>
  );
};

export default SupportTicketDetail;

