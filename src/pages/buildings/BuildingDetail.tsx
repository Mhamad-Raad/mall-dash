import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';

import BuildingHeader from '@/components/Buildings/BuildingHeader';
import BuildingSummaryCards from '@/components/Buildings/BuildingSummaryCards';
import BuildingFloors from '@/components/Buildings/BuildingFloors';
import EditApartmentDialog from '@/components/Buildings/EditApartmentDialog';
import BuildingDetailSkeleton from '@/components/Buildings/BuildingDetailSkeleton';
import BuildingDetailError from '@/components/Buildings/BuildingDetailError';
import type { Apartment, Occupant } from '@/interfaces/Building.interface';

import { getBuildingById, clearBuilding } from '@/store/slices/buildingSlice';

const BuildingDetail = () => {
  const { id } = useParams(); // expects id of building
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { building, loading, error } = useSelector(
    (state: RootState) => state.building
  );

  // Dialog and editing states
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [editedOccupants, setEditedOccupants] = useState<Occupant[]>([]);
  const [editedApartmentName, setEditedApartmentName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch building on mount (and when id changes)
  useEffect(() => {
    if (id) dispatch(getBuildingById(Number(id)));
    return () => {
      dispatch(clearBuilding());
    };
  }, [dispatch, id]);

  // Loading state
  if (loading) {
    return <BuildingDetailSkeleton />;
  }

  // Error or not found
  if (error && !building) {
    return (
      <BuildingDetailError
        error={error || "The building you're looking for doesn't exist."}
        onBack={() => navigate('/buildings')}
      />
    );
  }

  const handleApartmentClick = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setEditedOccupants(
      Array.isArray(apartment?.occupants) ? apartment.occupants : []
    );
    setEditedApartmentName(apartment.name || '');
    setIsDialogOpen(true);
  };

  const handleAddOccupant = () => {};

  const handleRemoveOccupant = () => {};

  const handleOccupantChange = () => {};

  const handleSave = () => {
    // You can save the edited data here. Example: dispatch an update thunk or just close the dialog.
    setIsDialogOpen(false);
  };

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      {/* Header Section */}
      <BuildingHeader />

      {/* Summary Cards */}
      <BuildingSummaryCards />

      {/* Floors and Apartments */}
      <BuildingFloors onApartmentEdit={handleApartmentClick} />

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
