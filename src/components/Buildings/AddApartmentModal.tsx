import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface AddApartmentModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (apartmentName: string) => void;
  floorNumber: number;
}

const AddApartmentModal = ({
  open,
  onCancel,
  onConfirm,
  floorNumber,
}: AddApartmentModalProps) => {
  const [apartmentName, setApartmentName] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!apartmentName.trim()) {
      setError('Apartment name is required.');
      return;
    }
    setError('');
    onConfirm(apartmentName.trim());
    setApartmentName('');
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>
            Create a new apartment for Floor {floorNumber}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-2 pt-2'>
          <label htmlFor='apartmentName' className='font-medium text-sm block'>
            Apartment Name
          </label>
          <Input
            id='apartmentName'
            value={apartmentName}
            onChange={(e) => setApartmentName(e.target.value)}
            placeholder='Apartment Name'
            autoFocus
          />
          {error && <div className='text-destructive text-xs'>{error}</div>}
        </div>
        <DialogFooter className='mt-4'>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Add Apartment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddApartmentModal;
