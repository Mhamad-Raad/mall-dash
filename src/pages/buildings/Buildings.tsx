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
          { id: 1, apartmentNumber: 1, name: 'Sunset Suite', occupants: [{ id: 1, name: 'John Smith', email: 'john.smith@email.com' }] },
          { id: 2, apartmentNumber: 2, name: 'Ocean View', occupants: [{ id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com' }, { id: 3, name: 'Mike Davis', email: 'mike.d@email.com' }] },
          { id: 3, apartmentNumber: 3, occupants: [] },
        ],
      },
      {
        id: 2,
        floorNumber: 2,
        apartments: [
          { id: 4, apartmentNumber: 1, occupants: [{ id: 4, name: 'Emily Brown', email: 'emily.b@email.com' }] },
          { id: 5, apartmentNumber: 2, occupants: [{ id: 5, name: 'David Wilson', email: 'david.w@email.com' }] },
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
          { id: 10, apartmentNumber: 1, occupants: [{ id: 6, name: 'Lisa Anderson', email: 'lisa.a@email.com' }] },
          { id: 11, apartmentNumber: 2, occupants: [] },
          { id: 12, apartmentNumber: 3, occupants: [{ id: 7, name: 'James Taylor', email: 'james.t@email.com' }] },
          { id: 13, apartmentNumber: 4, occupants: [{ id: 8, name: 'Maria Garcia', email: 'maria.g@email.com' }, { id: 9, name: 'Robert Martinez', email: 'robert.m@email.com' }] },
        ],
      },
      {
        id: 7,
        floorNumber: 2,
        apartments: [
          { id: 14, apartmentNumber: 1, occupants: [{ id: 10, name: 'Jennifer Lee', email: 'jennifer.l@email.com' }] },
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
          { id: 15, apartmentNumber: 1, occupants: [{ id: 11, name: 'Chris White', email: 'chris.w@email.com' }] },
          { id: 16, apartmentNumber: 2, occupants: [] },
        ],
      },
      {
        id: 4,
        floorNumber: 2,
        apartments: [
          { id: 17, apartmentNumber: 1, occupants: [{ id: 12, name: 'Amanda Harris', email: 'amanda.h@email.com' }] },
          { id: 18, apartmentNumber: 2, occupants: [{ id: 13, name: 'Kevin Clark', email: 'kevin.c@email.com' }] },
          { id: 19, apartmentNumber: 3, occupants: [] },
        ],
      },
      {
        id: 5,
        floorNumber: 3,
        apartments: [
          { id: 20, apartmentNumber: 1, occupants: [{ id: 14, name: 'Michelle Lewis', email: 'michelle.l@email.com' }] },
          { id: 21, apartmentNumber: 2, occupants: [{ id: 15, name: 'Daniel Walker', email: 'daniel.w@email.com' }] },
          { id: 22, apartmentNumber: 3, occupants: [{ id: 16, name: 'Jessica Hall', email: 'jessica.h@email.com' }] },
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
          { id: 23, apartmentNumber: 1, occupants: [] },
          { id: 24, apartmentNumber: 2, occupants: [{ id: 17, name: 'Ryan Allen', email: 'ryan.a@email.com' }] },
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
          { id: 25, apartmentNumber: 1, occupants: [{ id: 18, name: 'Stephanie Young', email: 'stephanie.y@email.com' }] },
          { id: 26, apartmentNumber: 2, occupants: [] },
          { id: 27, apartmentNumber: 3, occupants: [{ id: 19, name: 'Brian King', email: 'brian.k@email.com' }] },
        ],
      },
      {
        id: 10,
        floorNumber: 2,
        apartments: [
          { id: 28, apartmentNumber: 1, occupants: [{ id: 20, name: 'Nicole Wright', email: 'nicole.w@email.com' }] },
          { id: 29, apartmentNumber: 2, occupants: [{ id: 21, name: 'Matthew Scott', email: 'matthew.s@email.com' }] },
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
