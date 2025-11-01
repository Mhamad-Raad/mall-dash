import type { BuildingListItem } from '@/interfaces/Building.interface';
import BuildingsTable from '@/components/Buildings/BuildingsTable';

// Mock data for buildings list (API structure)
export const buildingsListData: BuildingListItem[] = [
  {
    id: 1,
    name: 'Test',
    numberOfFloors: 10,
    totalApartments: 80,
    occupants: 42
  }
];

const Buildings = () => {
  return (
    <section className='w-full flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Buildings</h1>
        <p className='text-muted-foreground'>Manage buildings, floors, and apartments</p>
      </div>

      <BuildingsTable buildings={buildingsListData} />
    </section>
  );
};

export default Buildings;
