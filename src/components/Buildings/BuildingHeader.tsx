import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Pencil, Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ConfirmModal, {
  type ChangeDetail,
} from '@/components/ui/Modals/ConfirmModal';
import { putBuildingName } from '@/store/slices/buildingSlice';
import type { RootState, AppDispatch } from '@/store/store';
interface BuildingHeaderProps {
  onDeleteBuilding?: () => void;
}

const BuildingHeader = ({ onDeleteBuilding }: BuildingHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { building, loading, error } = useSelector(
    (state: RootState) => state.building
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(building?.name || '');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleBackNavigation = () => navigate('/buildings');

  const handleEditClick = () => {
    setIsEditing(true);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(building?.name || '');
    setSuccess(null);
  };

  // After modal confirms, dispatch the redux thunk
  const handleModalConfirm = async () => {
    setShowConfirmModal(false);
    if (!building?.id) return;
    const resultAction = await dispatch(
      putBuildingName({ id: building.id, name: editedName.trim() })
    );
    if (putBuildingName.fulfilled.match(resultAction)) {
      setIsEditing(false);
      setSuccess('Building name updated.');
    }
    // Optionally handle error via redux error state
  };

  const handleShowModal = () => {
    setShowConfirmModal(true);
  };

  // Only allow confirming when the name is not empty and actually changed
  const confirmEnabled =
    !loading &&
    !!editedName.trim() &&
    editedName.trim() !== (building?.name?.trim() || '');

  // Changes summary for the modal
  const changes: ChangeDetail[] = [
    {
      field: 'Building Name',
      oldValue: building?.name || '',
      newValue: editedName.trim(),
    },
  ];

  return (
    <div>
      <Button
        variant='ghost'
        onClick={handleBackNavigation}
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
          <div className='w-full flex items-center gap-3'>
            {!isEditing ? (
              <div className='w-full flex items-center justify-between'>
                <div className=''>
                  <span className='text-3xl md:text-4xl font-bold'>
                    {building?.name}
                  </span>
                  <Button
                    variant='ghost'
                    onClick={handleEditClick}
                    size='icon'
                    className='ml-2'
                  >
                    <Pencil className='w-5 h-5 text-muted-foreground' />
                  </Button>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={onDeleteBuilding}
                  className='ml-2 bg-destructive/10 text-destructive hover:bg-destructive/20'
                  type='button'
                  aria-label='Delete Building'
                >
                  <Trash2 className='w-5 h-5' />
                </Button>
              </div>
            ) : (
              <TooltipProvider>
                <div className='flex items-center gap-2'>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className='text-3xl md:text-4xl font-bold h-auto py-2 px-3 max-w-md'
                    autoFocus
                    disabled={loading}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size='icon'
                        onClick={handleShowModal}
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={!confirmEnabled}
                        className={
                          'ml-2 bg-green-600 hover:bg-green-700 text-white'
                        }
                        type='button'
                      >
                        <Check className='w-5 h-5' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!confirmEnabled
                        ? !editedName.trim()
                          ? 'Name required'
                          : 'Name must be changed'
                        : 'Confirm name change'}
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={handleCancel}
                    disabled={loading}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <X className='w-5 h-5 text-destructive' />
                  </Button>
                </div>
                {(error || success) && (
                  <div
                    className={`mt-2 text-sm ${
                      error ? 'text-destructive' : 'text-green-500'
                    }`}
                  >
                    {error || success}
                  </div>
                )}
                {/* Confirmation Modal for changing name */}
                <ConfirmModal
                  open={showConfirmModal}
                  title='Confirm Name Change'
                  description={`Are you sure you want to change the building name?`}
                  warning='Please double check all details before confirming.'
                  confirmType='warning'
                  confirmLabel='Confirm'
                  cancelLabel='Cancel'
                  changes={changes}
                  onCancel={() => setShowConfirmModal(false)}
                  onConfirm={handleModalConfirm}
                />
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingHeader;
