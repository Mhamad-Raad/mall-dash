import { Home, Users, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Apartment, Occupant } from '@/interfaces/Building.interface';

interface EditApartmentDialogProps {
  apartment: Apartment | null;
  isOpen: boolean;
  onClose: () => void;
  occupants: Occupant[];
  onAddOccupant: () => void;
  onRemoveOccupant: (occupantId: number) => void;
  onOccupantChange: (occupantId: number, field: 'name' | 'email', value: string) => void;
  onSave: () => void;
}

const EditApartmentDialog = ({
  apartment,
  isOpen,
  onClose,
  occupants,
  onAddOccupant,
  onRemoveOccupant,
  onOccupantChange,
  onSave,
}: EditApartmentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Home className='h-5 w-5 text-primary' />
            Edit Apartment {apartment?.apartmentNumber}
          </DialogTitle>
          <DialogDescription>
            Manage occupants for this apartment. Add, edit, or remove occupants.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-semibold flex items-center gap-2'>
              <Users className='h-4 w-4' />
              Occupants
            </h3>
            <Button onClick={onAddOccupant} size='sm' variant='outline'>
              <Plus className='h-4 w-4 mr-2' />
              Add Occupant
            </Button>
          </div>

          {occupants.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg'>
              <Users className='h-12 w-12 mx-auto mb-2 opacity-50' />
              <p className='text-sm'>No occupants yet</p>
              <p className='text-xs mt-1'>Click "Add Occupant" to add someone</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {occupants.map((occupant) => (
                <Card key={occupant.id} className='border-2'>
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-4'>
                      <div className='flex-1 space-y-3'>
                        <div>
                          <Label htmlFor={`name-${occupant.id}`} className='text-xs font-semibold'>
                            Name *
                          </Label>
                          <Input
                            id={`name-${occupant.id}`}
                            value={occupant.name}
                            onChange={(e) => onOccupantChange(occupant.id, 'name', e.target.value)}
                            placeholder='Enter occupant name'
                            className='mt-1'
                          />
                        </div>
                        <div>
                          <Label htmlFor={`email-${occupant.id}`} className='text-xs font-semibold'>
                            Email
                          </Label>
                          <Input
                            id={`email-${occupant.id}`}
                            type='email'
                            value={occupant.email || ''}
                            onChange={(e) => onOccupantChange(occupant.id, 'email', e.target.value)}
                            placeholder='Enter email address'
                            className='mt-1'
                          />
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onRemoveOccupant(occupant.id)}
                        className='text-destructive hover:text-destructive hover:bg-destructive/10'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className='flex justify-end gap-2 pt-4 border-t'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditApartmentDialog;
