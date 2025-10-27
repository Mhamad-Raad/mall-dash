import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import BuildingSummaryCards from '@/components/Buildings/BuildingSummaryCards';
import BuildingFloors from '@/components/Buildings/BuildingFloors';
import EditApartmentDialog from '@/components/Buildings/EditApartmentDialog';
import { buildingsData } from './Buildings';
import type { Apartment, Occupant } from '@/interfaces/Building.interface';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [editedOccupants, setEditedOccupants] = useState<Occupant[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const getTotalOccupants = () => {
    return building.floors.reduce(
      (total, floor) =>
        total + floor.apartments.reduce((floorTotal, apt) => floorTotal + apt.occupants.length, 0),
      0
    );
  };

  const handleApartmentClick = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setEditedOccupants([...apartment.occupants]);
    setIsDialogOpen(true);
  };

  const handleAddOccupant = () => {
    const newOccupant: Occupant = {
      id: Date.now(),
      name: '',
      email: '',
    };
    setEditedOccupants([...editedOccupants, newOccupant]);
  };

  const handleRemoveOccupant = (occupantId: number) => {
    setEditedOccupants(editedOccupants.filter((occ) => occ.id !== occupantId));
  };

  const handleOccupantChange = (occupantId: number, field: 'name' | 'email', value: string) => {
    setEditedOccupants(
      editedOccupants.map((occ) =>
        occ.id === occupantId ? { ...occ, [field]: value } : occ
      )
    );
  };

  const handleSave = () => {
    if (selectedApartment) {
      const floorIndex = building.floors.findIndex((floor) =>
        floor.apartments.some((apt) => apt.id === selectedApartment.id)
      );
      if (floorIndex !== -1) {
        const apartmentIndex = building.floors[floorIndex].apartments.findIndex(
          (apt) => apt.id === selectedApartment.id
        );
        if (apartmentIndex !== -1) {
          building.floors[floorIndex].apartments[apartmentIndex].occupants = editedOccupants;
        }
      }
    }
    setIsDialogOpen(false);
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
      <BuildingSummaryCards
        totalOccupants={getTotalOccupants()}
        totalFloors={building.floors.length}
        totalApartments={getTotalApartments()}
      />

      {/* Floors and Apartments */}
      <BuildingFloors floors={building.floors} onApartmentEdit={handleApartmentClick} />

      {/* Edit Apartment Dialog */}
      <EditApartmentDialog
        apartment={selectedApartment}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        occupants={editedOccupants}
        onAddOccupant={handleAddOccupant}
        onRemoveOccupant={handleRemoveOccupant}
        onOccupantChange={handleOccupantChange}
        onSave={handleSave}
      />
    </div>
  );
};

export default BuildingDetail;
