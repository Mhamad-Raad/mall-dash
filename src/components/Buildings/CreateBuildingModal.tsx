import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { createBuilding } from '@/data/Buildings';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CreateBuildingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateBuildingModal = ({
  open,
  onOpenChange,
}: CreateBuildingModalProps) => {
  const [buildingName, setBuildingName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buildingName.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await createBuilding({
        name: buildingName,
        floors: [{ floorNumber: 1, numberOfApartments: 1 }],
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setBuildingName('');
        onOpenChange(false);
        navigate(`/buildings/${result?.result?.id}`);
      }
    } catch (err: any) {
      setError('Failed to create building.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setBuildingName('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create New Building</DialogTitle>
          <DialogDescription>
            Enter the name of the building you want to create.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Building Name</Label>
              <Input
                id='name'
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                placeholder='Enter building name...'
                className='col-span-3'
                autoFocus
              />
            </div>
            {error && <span className='text-red-500'>{error}</span>}
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting || !buildingName.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Building'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBuildingModal;
