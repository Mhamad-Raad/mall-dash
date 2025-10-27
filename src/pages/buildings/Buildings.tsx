import type { Building } from '@/interfaces/Building.interface';
import BuildingsTable from '@/components/Buildings/BuildingsTable';

// Mock data for buildings
export const buildingsData: Building[] = [
  {
    id: 1,
    name: 'Central Plaza',
    floors: [
      {
        id: 1,
        floorNumber: 1,
        apartments: [
          { id: 1, apartmentNumber: 1 },
          { id: 2, apartmentNumber: 2 },
          { id: 3, apartmentNumber: 3 },
        ],
      },
      {
        id: 2,
        floorNumber: 2,
        apartments: [
          { id: 4, apartmentNumber: 1 },
          { id: 5, apartmentNumber: 2 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Main Tower',
    floors: [
      {
        id: 6,
        floorNumber: 1,
        apartments: [
          { id: 10, apartmentNumber: 1 },
          { id: 11, apartmentNumber: 2 },
          { id: 12, apartmentNumber: 3 },
          { id: 13, apartmentNumber: 4 },
        ],
      },
      {
        id: 7,
        floorNumber: 2,
        apartments: [
          { id: 14, apartmentNumber: 1 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Sunset Residency',
    floors: [
      {
        id: 3,
        floorNumber: 1,
        apartments: [
          { id: 15, apartmentNumber: 1 },
          { id: 16, apartmentNumber: 2 },
        ],
      },
      {
        id: 4,
        floorNumber: 2,
        apartments: [
          { id: 17, apartmentNumber: 1 },
          { id: 18, apartmentNumber: 2 },
          { id: 19, apartmentNumber: 3 },
        ],
      },
      {
        id: 5,
        floorNumber: 3,
        apartments: [
          { id: 20, apartmentNumber: 1 },
          { id: 21, apartmentNumber: 2 },
          { id: 22, apartmentNumber: 3 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'North Block',
    floors: [
      {
        id: 8,
        floorNumber: 1,
        apartments: [
          { id: 23, apartmentNumber: 1 },
          { id: 24, apartmentNumber: 2 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'West Wing',
    floors: [
      {
        id: 9,
        floorNumber: 1,
        apartments: [
          { id: 25, apartmentNumber: 1 },
          { id: 26, apartmentNumber: 2 },
          { id: 27, apartmentNumber: 3 },
        ],
      },
      {
        id: 10,
        floorNumber: 2,
        apartments: [
          { id: 28, apartmentNumber: 1 },
          { id: 29, apartmentNumber: 2 },
        ],
      },
    ],
  },
];

const Buildings = () => {
  return (
    <section className='w-full flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Buildings</h1>
        <p className='text-muted-foreground'>Manage buildings, floors, and apartments</p>
      </div>

      <BuildingsTable buildings={buildingsData} />
    </section>
  );
};

export default Buildings;
