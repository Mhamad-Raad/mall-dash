import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BuildingHeader from '@/components/Buildings/BuildingHeader';
import BuildingSummaryCards from '@/components/Buildings/BuildingSummaryCards';
import BuildingFloors from '@/components/Buildings/BuildingFloors';
import EditApartmentDialog from '@/components/Buildings/EditApartmentDialog';
import type { Apartment, Occupant } from '@/interfaces/Building.interface';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [editedOccupants, setEditedOccupants] = useState<Occupant[]>([]);
  const [editedApartmentName, setEditedApartmentName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Find the building by ID
  const building = {};

  // If building not found, show error state
  if (!building) {
    return (
      <div className='container mx-auto p-6 max-w-6xl'>
        <Button
          variant='ghost'
          className='mb-6'
          onClick={() => navigate('/buildings')}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Buildings
        </Button>
        <Card className='p-12 text-center'>
          <CardTitle className='text-2xl mb-2'>Building Not Found</CardTitle>
          <CardDescription>
            The building you're looking for doesn't exist.
          </CardDescription>
        </Card>
      </div>
    );
  }

  const getTotalApartments = () => {
    return building.floors.reduce(
      (total, floor) => total + floor.apartments.length,
      0
    );
  };

  const getTotalOccupants = () => {
    return building.floors.reduce(
      (total, floor) =>
        total +
        floor.apartments.reduce(
          (floorTotal, apt) => floorTotal + apt.occupants.length,
          0
        ),
      0
    );
  };

  const handleApartmentClick = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setEditedOccupants([...apartment.occupants]);
    setEditedApartmentName(apartment.name || '');
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

  const handleOccupantChange = (
    occupantId: number,
    field: 'name' | 'email',
    value: string
  ) => {
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
          building.floors[floorIndex].apartments[apartmentIndex].occupants =
            editedOccupants;
          building.floors[floorIndex].apartments[apartmentIndex].name =
            editedApartmentName;
        }
      }
    }
    setIsDialogOpen(false);
  };

  const handleBuildingNameChange = (newName: string) => {
    building.name = newName;
  };

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      {/* Header Section */}
      <BuildingHeader
        buildingName={building.name}
        onNameChange={handleBuildingNameChange}
        onBack={() => navigate('/buildings')}
      />

      {/* Summary Cards */}
      <BuildingSummaryCards
        totalOccupants={getTotalOccupants()}
        totalFloors={building.floors.length}
        totalApartments={getTotalApartments()}
      />

      {/* Floors and Apartments */}
      <BuildingFloors
        floors={building.floors}
        onApartmentEdit={handleApartmentClick}
      />

      {/* Edit Apartment Dialog */}
      <EditApartmentDialog
        apartment={selectedApartment}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        occupants={editedOccupants}
        apartmentName={editedApartmentName}
        onApartmentNameChange={setEditedApartmentName}
        onAddOccupant={handleAddOccupant}
        onRemoveOccupant={handleRemoveOccupant}
        onOccupantChange={handleOccupantChange}
        onSave={handleSave}
      />
    </div>
  );
};

export default BuildingDetail;
