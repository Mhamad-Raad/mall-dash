import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ApartmentCard from './ApartmentCard';
import ConfirmModal from '@/components/ui/Modals/ConfirmModal';
import {
  postBuildingFloor,
  removeBuildingFloor,
} from '@/store/slices/buildingSlice';
import type { RootState, AppDispatch } from '@/store/store';

const BuildingFloors = ({ onApartmentEdit }: { onApartmentEdit: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { building, loading, error } = useSelector(
    (state: RootState) => state.building
  );

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const floors = Array.isArray(building?.floors) ? building.floors : [];

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFloor, setDeleteFloor] = useState<any>(null);

  // ---- ADD FLOOR ----
  const handleAddFloorClick = () => setShowAddModal(true);

  const handleAddFloorConfirm = async () => {
    setShowAddModal(false);
    if (building?.id) {
      await dispatch(postBuildingFloor(building.id));
      // You can refresh the full building here if wanted.
    }
  };

  // ---- DELETE FLOOR ----
  const handleDeleteFloorClick = (floor: any) => {
    setDeleteFloor(floor);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const handleDeleteFloorConfirm = async () => {
    setDeleteError(null);
    if (deleteFloor?.id) {
      const result = await dispatch(removeBuildingFloor(deleteFloor.id));
      if (removeBuildingFloor.rejected.match(result)) {
        // result.payload might be string or object or undefined
        const payload: any = result.payload;
        const errMsg =
          payload?.error ??
          payload?.message ??
          (typeof payload === 'string' ? payload : null) ??
          'Failed to delete floor.';
        setDeleteError(errMsg || 'Failed to delete floor.');
      } else {
        setShowDeleteModal(false);
        setDeleteFloor(null);
        setDeleteError(null);
      }
    }
  };

  console.log(building);

  return (
    <div className='space-y-6'>
      {/* Title & Add */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Layers className='h-6 w-6 text-primary' />
          <h2 className='text-2xl font-bold'>Floors & Apartments</h2>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={handleAddFloorClick}
          className='gap-1'
          disabled={loading}
        >
          <Plus className='w-4 h-4 mr-1' />
          Add Floor
        </Button>
      </div>
      {error && (
        <div className='text-destructive text-center py-2'>{error}</div>
      )}
      <Card className='border-2 shadow-lg'>
        <Accordion type='multiple' className='w-full'>
          {[...floors]
            .sort((a, b) => a.floorNumber - b.floorNumber)
            .map((floor) => (
              <AccordionItem key={floor?.id} value={`floor-${floor?.id}`}>
                <AccordionTrigger className='px-6 hover:no-underline hover:bg-muted/50'>
                  <div className='flex items-center justify-between w-full pr-4'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-primary/10'>
                        <Layers className='h-5 w-5 text-primary' />
                      </div>
                      <div className='text-left'>
                        <p className='text-xl font-semibold'>
                          Floor {floor?.floorNumber}
                        </p>
                        <p className='text-sm text-muted-foreground font-normal'>
                          {floor?.apartments?.length || 0} apartment
                          {floor?.apartments?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFloorClick(floor);
                      }}
                      className='text-destructive hover:bg-destructive/10'
                      title='Delete Floor'
                      disabled={loading}
                    >
                      <Trash2 className='w-5 h-5' />
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='px-6 pb-6'>
                  <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-4'>
                    {[...(floor?.apartments ?? [])].map((apartment) => (
                      <ApartmentCard
                        key={apartment?.id}
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

      {/* Add Floor Modal */}
      <ConfirmModal
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onConfirm={handleAddFloorConfirm}
        title='Add Floor'
        description='Are you sure you want to add a new floor to this building?'
        confirmType='success'
        confirmLabel='Add Floor'
        cancelLabel='Cancel'
        changes={[]}
      />

      {/* Delete Floor Modal */}
      <ConfirmModal
        open={showDeleteModal}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteFloor(null);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteFloorConfirm}
        title='Delete Floor'
        description={`Are you sure you want to delete Floor ${
          deleteFloor?.floorNumber || ''
        }?`}
        warning={
          deleteError ||
          'WARNING! This will permanently remove the floor and all its apartments.'
        }
        confirmType='danger'
        confirmLabel='Delete'
        cancelLabel='Cancel'
        changes={
          deleteFloor
            ? [
                {
                  field: 'Floor Number',
                  oldValue: deleteFloor.floorNumber,
                  newValue: 'Will be deleted',
                },
              ]
            : []
        }
      />
    </div>
  );
};

export default BuildingFloors;
