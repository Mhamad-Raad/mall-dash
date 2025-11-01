import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';

import BuildingsTable from '@/components/Buildings/BuildingsTable';
import BuildingsTableSkeleton from '@/components/Buildings/BuildingsTableSkeleton';

// (If needed: import { Building } from '@/interfaces/Building.interface')
import { fetchBuildings } from '@/store/slices/buildingsSlice';

const Buildings = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { buildings, loading, error } = useSelector(
    (state: RootState) => state.buildings
  );

  useEffect(() => {
    dispatch(fetchBuildings({ page: 1, limit: 20 }));
  }, [dispatch]);

  return (
    <section className='w-full flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Buildings</h1>
        <p className='text-muted-foreground'>
          Manage buildings, floors, and apartments
        </p>
      </div>

      {loading ? (
        <BuildingsTableSkeleton />
      ) : error ? (
        <div className='bg-red-100 text-red-600 px-4 py-2 rounded border'>
          {error}
        </div>
      ) : buildings.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-40 text-lg text-muted-foreground'>
          No buildings found.
        </div>
      ) : (
        <BuildingsTable />
      )}
    </section>
  );
};

export default Buildings;
