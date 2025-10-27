import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Layers, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
                <p className='text-muted-foreground mt-1'>Building ID: {building.id}</p>
              </div>
            </div>
            <Badge
              variant='outline'
              className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 font-bold text-base px-4 py-2 w-fit'
            >
              ● Active
            </Badge>
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

          {building.floors
            .sort((a, b) => a.floorNumber - b.floorNumber)
            .map((floor) => (
              <Card key={floor.id} className='border-2 shadow-lg hover:shadow-xl transition-shadow'>
                <CardHeader className='border-b'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-primary/10'>
                        <Layers className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <CardTitle className='text-xl'>Floor {floor.floorNumber}</CardTitle>
                        <CardDescription>
                          {floor.apartments.length} apartment{floor.apartments.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant='outline' className='font-semibold'>
                      ID: {floor.id}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
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
                </CardContent>
              </Card>
            ))}
        </div>
    </div>
  );
};

export default BuildingDetail;
