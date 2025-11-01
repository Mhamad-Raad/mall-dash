import { Home, Users, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BuildingDetailApartment } from '@/interfaces/Building.interface';

interface ApartmentCardProps {
  apartment: BuildingDetailApartment;
  onEdit: (apartment: BuildingDetailApartment) => void;
}

const ApartmentCard = ({ apartment, onEdit }: ApartmentCardProps) => {
  return (
    <Card
      className='border-2 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md group'
      onClick={() => onEdit(apartment)}
    >
      <CardContent className='p-4'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/5 border'>
                <Home className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='font-bold text-lg'>Apt {apartment.apartmentNumber}</p>
              </div>
            </div>
            <Pencil className='h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>
          {apartment.occupant ? (
            <div className='border-t pt-3 mt-1'>
              <div className='flex items-center gap-2 mb-2'>
                <Users className='h-3.5 w-3.5 text-muted-foreground' />
                <p className='text-xs font-semibold text-muted-foreground uppercase'>
                  Occupant
                </p>
              </div>
              <div className='space-y-2'>
                <div className='flex flex-col gap-1'>
                  <Badge variant='secondary' className='text-xs w-fit'>
                    {apartment.occupant.name}
                  </Badge>
                  <p className='text-xs text-muted-foreground'>{apartment.occupant.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className='border-t pt-3 mt-1'>
              <p className='text-xs text-muted-foreground italic'>No occupant</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard;
