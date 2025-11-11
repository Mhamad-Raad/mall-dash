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
import type { Apartment } from '@/interfaces/Building.interface';

import {
  getBuildingById,
  clearBuilding,
  updateApartmentThunk,
} from '@/store/slices/buildingSlice';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { building, loading, error } = useSelector(
    (state: RootState) => state.building
  );

  // Popup state
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [editedApartmentName, setEditedApartmentName] = useState<string>('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(getBuildingById(Number(id)));
    return () => {
      dispatch(clearBuilding());
    };
  }, [dispatch, id]);

  if (loading) {
    return <BuildingDetailSkeleton />;
  }
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
    setEditedApartmentName(apartment?.apartmentName ?? '');
    setIsDialogOpen(true);
  };

  // Runs when clicking save in dialog
  const handleSave = async (occupant: any, name: string) => {
    setIsDialogOpen(false);
    if (selectedApartment) {
      await dispatch(
        updateApartmentThunk({
          id: selectedApartment.id,
          apartmentName: name,
          userId: occupant,
        })
      );
    }
    if (building?.id) {
      await dispatch(getBuildingById(building.id));
    }
    setSelectedApartment(null);
  };

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      <BuildingHeader />
      <BuildingSummaryCards />
      <BuildingFloors onApartmentEdit={handleApartmentClick} />
      <EditApartmentDialog
        apartment={selectedApartment as any}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        apartmentName={editedApartmentName}
        setApartmentName={setEditedApartmentName}
      />
    </div>
  );
};

export default BuildingDetail;
