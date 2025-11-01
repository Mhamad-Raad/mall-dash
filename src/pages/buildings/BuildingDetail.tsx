import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BuildingHeader from '@/components/Buildings/BuildingHeader';
import BuildingSummaryCards from '@/components/Buildings/BuildingSummaryCards';
import BuildingFloors from '@/components/Buildings/BuildingFloors';
import EditApartmentDialog from '@/components/Buildings/EditApartmentDialog';
import type { Occupant, BuildingDetail, BuildingDetailApartment } from '@/interfaces/Building.interface';

// Temporary mock data for building detail (will be replaced with API data)
const buildingsDetailData: BuildingDetail[] = [
  {
    id: 1,
    name: 'Test',
    floors: [
      {
        id: 1,
        floorNumber: 1,
        apartments: [
          {
            id: 1,
            apartmentNumber: 1,
            occupant: {
              id: '43d42906-bb98-4664-a567-57f28676dcc9',
              name: 'Margaret Jones',
              email: 'adminMargaret123@maldash.com',
            },
          },
          {
            id: 2,
            apartmentNumber: 2,
            occupant: {
              id: '9a10d735-3f12-4f05-a827-a1b555316e3c',
              name: 'Kevin Peterson',
              email: 'vendorKevin123@maldash.com',
            },
          },
          {
            id: 3,
            apartmentNumber: 3,
            occupant: null,
          },
          {
            id: 4,
            apartmentNumber: 4,
            occupant: null,
          },
          {
            id: 5,
            apartmentNumber: 5,
            occupant: null,
          },
        ],
      },
    ],
  },
];

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedApartment, setSelectedApartment] = useState<BuildingDetailApartment | null>(null);
  const [editedOccupant, setEditedOccupant] = useState<Occupant | null>(null);
  const [editedApartmentName, setEditedApartmentName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Find the building by ID
  const building = buildingsDetailData.find((b) => b.id === Number(id));

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
        total + floor.apartments.filter((apt) => apt.occupant !== null).length,
      0
    );
  };

  const handleApartmentClick = (apartment: BuildingDetailApartment) => {
    setSelectedApartment(apartment);
    setEditedOccupant(apartment.occupant ? { ...apartment.occupant } : null);
    setEditedApartmentName('');
    setIsDialogOpen(true);
  };

  const handleAddOccupant = () => {
    const newOccupant: Occupant = {
      id: crypto.randomUUID(),
      name: '',
      email: '',
    };
    setEditedOccupant(newOccupant);
  };

  const handleRemoveOccupant = () => {
    setEditedOccupant(null);
  };

  const handleOccupantChange = (field: 'name' | 'email', value: string) => {
    if (editedOccupant) {
      setEditedOccupant({ ...editedOccupant, [field]: value });
    }
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
          building.floors[floorIndex].apartments[apartmentIndex].occupant = editedOccupant;
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
      <BuildingFloors floors={building.floors} onApartmentEdit={handleApartmentClick} />

      {/* Edit Apartment Dialog */}
      <EditApartmentDialog
        apartment={selectedApartment}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        occupant={editedOccupant}
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
