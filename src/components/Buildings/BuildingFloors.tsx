import { Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ApartmentCard from './ApartmentCard';
import type { BuildingDetailFloor, BuildingDetailApartment } from '@/interfaces/Building.interface';

interface BuildingFloorsProps {
  floors: BuildingDetailFloor[];
  onApartmentEdit: (apartment: BuildingDetailApartment) => void;
}

const BuildingFloors = ({ floors, onApartmentEdit }: BuildingFloorsProps) => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2'>
        <Layers className='h-6 w-6 text-primary' />
        <h2 className='text-2xl font-bold'>Floors & Apartments</h2>
      </div>

      <Card className='border-2 shadow-lg'>
        <Accordion type='multiple' className='w-full'>
          {floors
            .sort((a, b) => a.floorNumber - b.floorNumber)
            .map((floor) => (
              <AccordionItem key={floor.id} value={`floor-${floor.id}`}>
                <AccordionTrigger className='px-6 hover:no-underline hover:bg-muted/50'>
                  <div className='flex items-center justify-between w-full pr-4'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-primary/10'>
                        <Layers className='h-5 w-5 text-primary' />
                      </div>
                      <div className='text-left'>
                        <p className='text-xl font-semibold'>Floor {floor.floorNumber}</p>
                        <p className='text-sm text-muted-foreground font-normal'>
                          {floor.apartments.length} apartment
                          {floor.apartments.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='px-6 pb-6'>
                  <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-4'>
                    {floor.apartments
                      .sort((a, b) => a.apartmentNumber - b.apartmentNumber)
                      .map((apartment) => (
                        <ApartmentCard
                          key={apartment.id}
                          apartment={apartment}
                          onEdit={onApartmentEdit}
                        />
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </Card>
    </div>
  );
};

export default BuildingFloors;
