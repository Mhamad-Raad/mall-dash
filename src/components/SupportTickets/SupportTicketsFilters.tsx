import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { TICKET_STATUS_OPTIONS, type TicketStatus } from '@/interfaces/SupportTicket.interface';

const SupportTicketsFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('supportTickets');

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  const getStatusLabel = (value: TicketStatus | 'all') => {
    if (value === 'all') return t('status.all');
    if (value === 0) return t('status.open');
    if (value === 1) return t('status.inProgress');
    if (value === 2) return t('status.resolved');
    if (value === 3) return t('status.closed');
    return t('status.unknown');
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    if (status && status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    params.set('page', '1');
    navigate(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    navigate('?');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className='flex flex-col md:flex-row gap-4 mb-6 bg-card p-4 rounded-lg border shadow-sm'>
      <div className='flex-1 flex gap-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder={t('filters.searchPlaceholder')}
            className='pl-8'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-2'>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder={t('filters.statusPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {TICKET_STATUS_OPTIONS.map((option) => (
              <SelectItem key={String(option.value)} value={String(option.value)}>
                {getStatusLabel(option.value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleApply}>
          <Filter className='mr-2 h-4 w-4' />
          {t('filters.apply')}
        </Button>

        {(search || status !== 'all') && (
          <Button variant='ghost' onClick={clearFilters}>
            <X className='mr-2 h-4 w-4' />
            {t('filters.clear')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SupportTicketsFilters;
