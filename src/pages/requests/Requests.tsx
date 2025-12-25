import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import RequestsFilters from '@/components/Requests/RequestsFilters';
import RequestsTable from '@/components/Requests/RequestsTable';
import { fetchRequests } from '@/store/slices/requestsSlice';
import type { AppDispatch, RootState } from '@/store/store';

const RequestsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { limit } = useSelector((state: RootState) => state.requests);

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'All';

    dispatch(
      fetchRequests({
        page,
        limit,
        search,
        status,
      })
    );
  }, [dispatch, searchParams, limit]);

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Tenant Requests</h1>
          <p className='text-muted-foreground mt-2'>
            Manage maintenance and service requests from tenants.
          </p>
        </div>
      </div>
      
      <RequestsFilters />
      <RequestsTable />
    </div>
  );
};

export default RequestsPage;
