import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Layers, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { buildingsData } from './Buildings';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the building by ID
  const building = buildingsData.find((b) => b.id === Number(id));

  // If building not found, show error state
  if (!building) {
    return (
      <div className='container mx-auto p-6 max-w-6xl'>
        <Button variant='ghost' className='mb-6' onClick={() => navigate('/buildings')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Buildings
        </Button>
        <Card className='p-12 text-center'>
          <CardTitle className='text-2xl mb-2'>Building Not Found</CardTitle>
          <CardDescription>The building you're looking for doesn't exist.</CardDescription>
        </Card>
      </div>
    );
  }

  const getTotalApartments = () => {
    return building.floors.reduce((total, floor) => total + floor.apartments.length, 0);
  };

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
        {/* Header Section */}
        <div>
          <Button
            variant='ghost'
            onClick={() => navigate('/buildings')}
            className='mb-4 hover:bg-muted/50'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Buildings
          </Button>

          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='p-4 rounded-xl bg-primary/10 border-2 border-primary/20'>
                <Building2 className='h-10 w-10 text-primary' />
              </div>
              <div>
                <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>{building.name}</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='grid gap-6 md:grid-cols-3'>
          <Card className='border-2 shadow-lg'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                <Building2 className='h-4 w-4' />
                Building Name
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{building.name}</p>
            </CardContent>
          </Card>

          <Card className='border-2 shadow-lg'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                <Layers className='h-4 w-4' />
                Total Floors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{building.floors.length}</p>
            </CardContent>
          </Card>

          <Card className='border-2 shadow-lg'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                <Home className='h-4 w-4' />
                Total Apartments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{getTotalApartments()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Floors and Apartments */}
        <div className='space-y-6'>
          <div className='flex items-center gap-2'>
            <Layers className='h-6 w-6 text-primary' />
            <h2 className='text-2xl font-bold'>Floors & Apartments</h2>
          </div>

          <Card className='border-2 shadow-lg'>
            <Accordion type='multiple' className='w-full'>
              {building.floors
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
                              {floor.apartments.length} apartment{floor.apartments.length !== 1 ? 's' : ''}
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
                            <Card
                              key={apartment.id}
                              className='border-2 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md'
                            >
                              <CardContent className='p-4'>
                                <div className='flex items-center gap-3'>
                                  <div className='p-2 rounded-lg bg-primary/5 border'>
                                    <Home className='h-5 w-5 text-primary' />
                                  </div>
                                  <div>
                                    <p className='font-bold text-lg'>Apt {apartment.apartmentNumber}</p>
                                    <p className='text-xs text-muted-foreground'>ID: {apartment.id}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </Card>
        </div>
    </div>
  );
};

export default BuildingDetail;
