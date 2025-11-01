import { useSelector } from 'react-redux';
import { Layers, Home, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RootState } from '@/store/store';

function getBuildingSummary(building: any) {
  const totalFloors = building?.floors?.length || 0;
  const totalApartments = building?.floors?.reduce(
    (sum: number, floor: any) => sum + (floor?.apartments?.length || 0),
    0
  );
  const totalOccupants = building?.floors?.reduce(
    (sum: number, floor: any) =>
      sum +
      (floor?.apartments?.reduce((aptSum: number, apartment: any) => {
        if (Array.isArray(apartment.occupants)) {
          return aptSum + apartment.occupants.length;
        }
        if (apartment.occupant && typeof apartment.occupant === 'object') {
          return aptSum + 1;
        }
        return aptSum;
      }, 0) || 0),
    0
  );

  return { totalFloors, totalApartments, totalOccupants };
}

const BuildingSummaryCards = () => {
  const { building } = useSelector((state: RootState) => state.building);
  const { totalFloors, totalApartments, totalOccupants } =
    getBuildingSummary(building);

  return (
    <div className='grid gap-6 md:grid-cols-3'>
      <Card className='border-2 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <Users className='h-5 w-5 text-primary' />
            Total Occupants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-4xl font-bold text-primary'>{totalOccupants}</p>
          <p className='text-sm text-muted-foreground mt-2'>
            Currently residing in this building
          </p>
        </CardContent>
      </Card>

      <Card className='border-2 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <Layers className='h-5 w-5 text-primary' />
            Total Floors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-4xl font-bold text-primary'>{totalFloors}</p>
          <p className='text-sm text-muted-foreground mt-2'>
            Levels in this building
          </p>
        </CardContent>
      </Card>

      <Card className='border-2 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
            <Home className='h-5 w-5 text-primary' />
            Total Apartments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-4xl font-bold text-primary'>{totalApartments}</p>
          <p className='text-sm text-muted-foreground mt-2'>
            Units available in building
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildingSummaryCards;
