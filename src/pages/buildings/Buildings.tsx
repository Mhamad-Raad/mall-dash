import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';

import BuildingsTable from '@/components/Buildings/BuildingsTable';
import BuildingsTableSkeleton from '@/components/Buildings/BuildingsTableSkeleton';
import BuildingsEmptyState from '@/components/Buildings/BuildingsEmptyState';
import CreateBuildingModal from '@/components/Buildings/CreateBuildingModal';

import { Building2, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { fetchBuildings } from '@/store/slices/buildingsSlice';

const Buildings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Redux state
  const { buildings, loading, error } = useSelector(
    (state: RootState) => state.buildings
  );

  // Debounced search input
  const [typed, setTyped] = useState(searchParams.get('search') || '');
  const [debounced, setDebounced] = useState(typed);
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebounced(typed), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [typed]);

  // Update URL when debounced changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debounced) {
      params.set('search', debounced);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
    // eslint-disable-next-line
  }, [debounced]);

  // Sync input with URL when user navigates
  useEffect(() => {
    setTyped(searchParams.get('search') || '');
  }, [searchParams]);

  // Pagination and filters (extract from URL)
  const limit = parseInt(searchParams.get('limit') || '40', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    if (limit && page) {
      dispatch(fetchBuildings({ page, limit, searchName: debounced }));
    }
  }, [dispatch, limit, page, debounced]);

  return (
    <section className='w-full flex flex-col gap-6'>
      <Card className='shadow-lg border-2'>
        <CardHeader className='border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <CardTitle className='text-2xl flex items-center gap-3'>
            <span className='rounded-lg bg-primary/10'>
              <Building2 className='h-5 w-5 text-primary' />
            </span>
            All Buildings
          </CardTitle>
          <div className='flex items-center gap-3'>
            <div className='relative w-full max-w-xs'>
              <Input
                className='pl-10 pr-4 py-2 rounded-full border-2 border-muted-foreground focus:border-primary transition-all shadow hover:shadow-md bg-background focus:bg-card'
                type='text'
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder='Search buildings...'
              />
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                <Search className='h-5 w-5' />
              </span>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className='flex items-center gap-2'
            >
              <Plus className='h-4 w-4' />
              Create
            </Button>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? (
            <BuildingsTableSkeleton />
          ) : error ? (
            <div className='bg-red-100 text-red-600 px-4 py-2 rounded border'>
              {error}
            </div>
          ) : buildings.length === 0 ? (
            <BuildingsEmptyState />
          ) : (
            <BuildingsTable />
          )}
        </CardContent>
      </Card>

      <CreateBuildingModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </section>
  );
};

export default Buildings;
