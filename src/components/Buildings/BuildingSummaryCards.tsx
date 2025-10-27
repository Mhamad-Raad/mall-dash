import { Layers, Home, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BuildingSummaryCardsProps {
  totalOccupants: number;
  totalFloors: number;
  totalApartments: number;
}

const BuildingSummaryCards = ({
  totalOccupants,
  totalFloors,
  totalApartments,
}: BuildingSummaryCardsProps) => {
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
          <p className='text-sm text-muted-foreground mt-2'>Currently residing in this building</p>
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
          <p className='text-sm text-muted-foreground mt-2'>Levels in this building</p>
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
          <p className='text-sm text-muted-foreground mt-2'>Units available in building</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildingSummaryCards;
