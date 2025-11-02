import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Pencil, Check, X } from 'lucide-react';
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
import type { RootState } from '@/store/store';

const BuildingHeader = () => {
  const navigate = useNavigate();
  const { building } = useSelector((state: RootState) => state.building);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(building?.name || '');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleBackNavigation = () => navigate('/buildings');

  const handleEditClick = () => {
    setIsEditing(true);
    setFeedback(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(building?.name || '');
    setFeedback(null);
  };

  // Called after modal confirms
  const doConfirmUpdate = async () => {
    setLoading(true);
    setShowConfirmModal(false);
    setFeedback(null);
    try {
      // await api call here
      setIsEditing(false);
      setFeedback({ type: 'success', message: 'Building name updated.' });
      // Re-fetch or update Redux store here
    } catch (error: any) {
      setFeedback({
        type: 'error',
        message: error.message || 'Failed to update name.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = async () => {
    await doConfirmUpdate();
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
          <div className='flex items-center gap-3'>
            {!isEditing ? (
              <>
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
              </>
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
                {feedback && (
                  <div
                    className={`mt-2 text-sm ${
                      feedback.type === 'success'
                        ? 'text-green-500'
                        : 'text-destructive'
                    }`}
                  >
                    {feedback.message}
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
