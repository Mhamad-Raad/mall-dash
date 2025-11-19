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
import ConfirmModal from '@/components/ui/Modals/ConfirmModal';

import type { Apartment } from '@/interfaces/Building.interface';

import {
  getBuildingById,
  clearBuilding,
  updateApartmentThunk,
  deleteApartmentThunk,
  deleteBuildingThunk,
} from '@/store/slices/buildingSlice';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { building, loading, error } = useSelector(
    (state: RootState) => state.building
  );

  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [editedApartmentName, setEditedApartmentName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteApartmentId, setDeleteApartmentId] = useState<number | null>(
    null
  );
  const [showDeleteApartmentModal, setShowDeleteApartmentModal] =
    useState(false);

  const [showDeleteBuildingModal, setShowDeleteBuildingModal] = useState(false);

  const confirmDeleteBuilding = async () => {
    setShowDeleteBuildingModal(false);
    navigate('/buildings');
    if (id) {
      await dispatch(deleteBuildingThunk(Number(id)));
    }
  };

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

  const handleDeleteApartment = (id: number) => {
    setDeleteApartmentId(id);
    setShowDeleteApartmentModal(true);
  };

  const confirmDeleteApartment = async () => {
    setShowDeleteApartmentModal(false);
    setIsDialogOpen(false);
    try {
      if (deleteApartmentId) {
        await dispatch(deleteApartmentThunk(deleteApartmentId));
        if (building?.id) await dispatch(getBuildingById(building.id));
      }
    } finally {
      setDeleteApartmentId(null);
      setSelectedApartment(null);
    }
  };

  return (
    <section className='w-full h-full flex flex-col gap-4 overflow-hidden'>
      <BuildingHeader
        onDeleteBuilding={() => setShowDeleteBuildingModal(true)}
      />
      <BuildingSummaryCards />
      <BuildingFloors onApartmentEdit={handleApartmentClick} />
      <EditApartmentDialog
        apartment={selectedApartment as any}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        onDelete={handleDeleteApartment}
        apartmentName={editedApartmentName}
        setApartmentName={setEditedApartmentName}
      />

      <ConfirmModal
        open={showDeleteApartmentModal}
        onCancel={() => {
          setShowDeleteApartmentModal(false);
          setDeleteApartmentId(null);
        }}
        onConfirm={confirmDeleteApartment}
        title='Delete Apartment'
        description='Are you sure you want to permanently delete this apartment?'
        confirmLabel='Delete'
        confirmType='danger'
        cancelLabel='Cancel'
        warning='This action cannot be undone.'
        changes={[
          {
            field: 'Apartment',
            oldValue: selectedApartment?.apartmentName || '',
            newValue: 'Will be deleted',
          },
        ]}
      />

      <ConfirmModal
        open={showDeleteBuildingModal}
        onCancel={() => setShowDeleteBuildingModal(false)}
        onConfirm={confirmDeleteBuilding}
        title='Delete Building'
        description='Are you sure you want to permanently delete this building?'
        confirmLabel='Delete'
        confirmType='danger'
        cancelLabel='Cancel'
        warning='This action cannot be undone.'
        changes={[
          {
            field: 'Building Name',
            oldValue: building?.name || '',
            newValue: 'Will be deleted',
          },
        ]}
      />
    </section>
  );
};

export default BuildingDetail;
