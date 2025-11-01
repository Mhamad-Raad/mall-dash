import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BuildingListItem } from '@/interfaces/Building.interface';
import BuildingsTable from '@/components/Buildings/BuildingsTable';
import BuildingsFilters from '@/components/Buildings/BuildingsFilters';

// Mock data for buildings list (API structure)
export const buildingsListData: BuildingListItem[] = [
  {
    id: 1,
    name: 'Test',
    numberOfFloors: 10,
    totalApartments: 80,
    occupants: 42
  },
  {
    id: 2,
    name: 'Central Plaza',
    numberOfFloors: 5,
    totalApartments: 40,
    occupants: 35
  },
  {
    id: 3,
    name: 'Main Tower',
    numberOfFloors: 8,
    totalApartments: 64,
    occupants: 52
  },
  {
    id: 4,
    name: 'Sunset Residency',
    numberOfFloors: 12,
    totalApartments: 96,
    occupants: 78
  },
  {
    id: 5,
    name: 'North Block',
    numberOfFloors: 6,
    totalApartments: 48,
    occupants: 40
  }
];

const Buildings = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  // Filter buildings based on search
  const filteredBuildings = useMemo(() => {
    if (!search) return buildingsListData;
    
    const searchLower = search.toLowerCase();
    return buildingsListData.filter((building) =>
      building.name.toLowerCase().includes(searchLower)
    );
  }, [search]);

  return (
    <section className='w-full h-full flex flex-col gap-6 overflow-hidden'>
      {/* Filters Section */}
      <BuildingsFilters />

      {/* Buildings Table */}
      <div className='flex-1 min-h-0'>
        <BuildingsTable buildings={filteredBuildings} />
      </div>
    </section>
  );
};

export default Buildings;
