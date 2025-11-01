import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2, Plus, Trash2, GripVertical } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Floor {
  id: string;
  floorNumber: number | '';
  numberOfApartments: number | '';
}

const CreateBuilding = () => {
  const navigate = useNavigate();
  const [buildingName, setBuildingName] = useState('');
  const [floors, setFloors] = useState<Floor[]>([
    { id: crypto.randomUUID(), floorNumber: 1, numberOfApartments: 1 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFloor = () => {
    const newFloorNumber = floors.length > 0 
      ? Math.max(...floors.map(f => typeof f.floorNumber === 'number' ? f.floorNumber : 0)) + 1 
      : 1;
    
    setFloors([
      ...floors,
      {
        id: crypto.randomUUID(),
        floorNumber: newFloorNumber,
        numberOfApartments: 1
      }
    ]);
  };

  const handleRemoveFloor = (id: string) => {
    if (floors.length === 1) return; // Keep at least one floor
    setFloors(floors.filter(floor => floor.id !== id));
  };

  const handleFloorNumberChange = (id: string, value: string) => {
    // Only allow empty string or positive integers
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = value === '' ? '' : parseInt(value);
      setFloors(floors.map(floor => 
        floor.id === id ? { ...floor, floorNumber: numValue as number } : floor
      ));
    }
  };

  const handleApartmentCountChange = (id: string, value: string) => {
    // Only allow empty string or positive integers
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = value === '' ? '' : parseInt(value);
      setFloors(floors.map(floor => 
        floor.id === id ? { ...floor, numberOfApartments: numValue as number } : floor
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!buildingName.trim()) {
      alert('Please enter a building name');
      return;
    }

    if (floors.length === 0) {
      alert('Please add at least one floor');
      return;
    }

    const hasInvalidFloor = floors.some(
      floor => (typeof floor.floorNumber === 'number' ? floor.floorNumber : 0) < 1 || 
               (typeof floor.numberOfApartments === 'number' ? floor.numberOfApartments : 0) < 1 ||
               floor.floorNumber === '' || 
               floor.numberOfApartments === ''
    );

    if (hasInvalidFloor) {
      alert('Floor numbers and apartment counts must be at least 1');
      return;
    }

    setIsSubmitting(true);

    // Prepare data for API
    const buildingData = {
      name: buildingName,
      floors: floors.map(floor => ({
        floorNumber: typeof floor.floorNumber === 'number' ? floor.floorNumber : 1,
        numberOfApartments: typeof floor.numberOfApartments === 'number' ? floor.numberOfApartments : 1
      }))
    };

    try {
      // TODO: Replace with actual API call
      
      console.log('Building data to submit:', buildingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to buildings list
      navigate('/buildings');
    } catch (error) {
      console.error('Error creating building:', error);
      alert('Failed to create building. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/buildings');
  };

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-primary/10 text-primary'>
            <Building2 className='size-5' />
          </div>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Add New Building</h1>
            <p className='text-sm text-muted-foreground'>
              Create a new building with floors and apartments
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Building Name Card */}
        <Card>
          <CardHeader>
            <CardTitle>Building Information</CardTitle>
            <CardDescription>Enter the basic details of the building</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <Label htmlFor='buildingName'>Building Name *</Label>
              <Input
                id='buildingName'
                placeholder='e.g., Central Plaza, Main Tower'
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Floors Card */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Floors Configuration</CardTitle>
                <CardDescription>
                  Add and configure floors for this building
                </CardDescription>
              </div>
              <Button
                type='button'
                onClick={handleAddFloor}
                disabled={isSubmitting}
                className='gap-2'
              >
                <Plus className='size-4' />
                Add Floor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[400px] pr-4'>
              <div className='space-y-4'>
                {floors.map((floor) => (
                  <div
                    key={floor.id}
                    className='flex items-start gap-3 p-4 rounded-lg border bg-muted/30'
                  >
                    <div className='pt-2'>
                      <GripVertical className='size-5 text-muted-foreground' />
                    </div>
                    
                    <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {/* Floor Number */}
                      <div className='space-y-2'>
                        <Label htmlFor={`floor-number-${floor.id}`}>
                          Floor Number *
                        </Label>
                        <Input
                          id={`floor-number-${floor.id}`}
                          type='number'
                          min='1'
                          value={floor.floorNumber}
                          onChange={(e) => handleFloorNumberChange(floor.id, e.target.value)}
                          disabled={isSubmitting}
                          required
                          className='[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                        />
                      </div>

                      {/* Number of Apartments */}
                      <div className='space-y-2'>
                        <Label htmlFor={`apartment-count-${floor.id}`}>
                          Number of Apartments *
                        </Label>
                        <Input
                          id={`apartment-count-${floor.id}`}
                          type='number'
                          min='1'
                          value={floor.numberOfApartments}
                          onChange={(e) => handleApartmentCountChange(floor.id, e.target.value)}
                          disabled={isSubmitting}
                          required
                          className='[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                        />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => handleRemoveFloor(floor.id)}
                      disabled={floors.length === 1 || isSubmitting}
                      className='mt-7'
                    >
                      <Trash2 className='size-4 text-destructive' />
                    </Button>
                  </div>
                ))}

                {floors.length === 0 && (
                  <div className='text-center py-8 text-muted-foreground'>
                    No floors added yet. Click "Add Floor" to get started.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className='bg-primary/5 border-primary/20'>
          <CardHeader>
            <CardTitle className='text-lg'>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              <div>
                <p className='text-muted-foreground'>Building Name</p>
                <p className='font-semibold'>
                  {buildingName || 'Not set'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground'>Total Floors</p>
                <p className='font-semibold'>{floors.length}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Total Apartments</p>
                <p className='font-semibold'>
                  {floors.reduce((sum, floor) => {
                    const apartments = typeof floor.numberOfApartments === 'number' ? floor.numberOfApartments : 0;
                    return sum + apartments;
                  }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className='flex items-center justify-end gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Building'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBuilding;
