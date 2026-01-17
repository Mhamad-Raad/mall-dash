import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SupportTicketsTable from '@/components/SupportTickets/SupportTicketsTable';
import type { AppDispatch } from '@/store/store';
import { fetchSupportTickets } from '@/store/slices/supportTicketsSlice';
import SupportTicketsFilters from '@/components/SupportTickets/SupportTicketsFilters';
import type { TicketStatus } from '@/interfaces/SupportTicket.interface';

const parseStatusParam = (statusParam: string | null): TicketStatus | 'all' => {
  if (statusParam === null || statusParam === 'all') {
    return 'all';
  }

  const num = Number(statusParam);

  if (num === 0 || num === 1 || num === 2 || num === 3) {
    return num as TicketStatus;
  }

  return 'all';
};

const SupportTickets = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('supportTickets');

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 40;
    const status = parseStatusParam(searchParams.get('status'));
    const search = searchParams.get('search') || '';

    dispatch(
      fetchSupportTickets({
        page,
        limit,
        status,
        search,
      }),
    );
  }, [dispatch, searchParams]);

  return (
    <section className='w-full h-full flex flex-col gap-4 overflow-hidden'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {t('page.title')}
          </h1>
          <p className='text-muted-foreground mt-2'>{t('page.subtitle')}</p>
        </div>
      </div>

      <SupportTicketsFilters />
      <div className='flex-1 min-h-0 flex flex-col'>
        <SupportTicketsTable />
      </div>
    </section>
  );
};

export default SupportTickets;

