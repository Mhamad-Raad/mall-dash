import { Home, Users, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type {
  BuildingDetailApartment,
  Occupant,
} from '@/interfaces/Building.interface';

interface EditApartmentDialogProps {
  apartment: BuildingDetailApartment | null;
  isOpen: boolean;
  onClose: () => void;
  occupants: Occupant[];
  apartmentName?: string;
  onApartmentNameChange?: (update: string) => void;
  onAddOccupant: () => void;
  onRemoveOccupant: () => void;
  onOccupantChange: () => void;
  onSave: () => void;
}

const EditApartmentDialog = ({
  apartment,
  isOpen,
  onClose,
  occupants,
  apartmentName,
  onApartmentNameChange,
  onAddOccupant,
  onRemoveOccupant,
  onOccupantChange,
  onSave,
}: EditApartmentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Home className='h-5 w-5 text-primary' />
            Edit Apartment {apartment?.apartmentNumber}
          </DialogTitle>
          <DialogDescription>
            Manage apartment occupants. Add or edit occupant information.
          </DialogDescription>
        </DialogHeader>

        <div className='mb-4'>
          <Label htmlFor='apartment-name' className='text-xs font-semibold'>
            Apartment Name
          </Label>
          <Input
            id='apartment-name'
            value={apartmentName ?? ''}
            onChange={(e) =>
              onApartmentNameChange && onApartmentNameChange(e.target.value)
            }
            placeholder='Enter apartment name'
            className='mt-1'
          />
        </div>

        <ScrollArea className='flex-1 overflow-auto pr-4'>
          <div className='space-y-4 py-4'>
            <div className='border-t pt-4 space-y-4'>
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

              {occupants.length > 0 ? (
                <Card className='border-2'>
                  <CardContent className='p-4'>
                    {occupants.map((occupant) => (
                      <div
                        key={occupant.id}
                        className='flex items-start gap-4 mb-4'
                      >
                        <div className='flex-1 space-y-3'>
                          <Label
                            htmlFor={`occupant-name-${occupant.id}`}
                            className='text-xs font-semibold'
                          >
                            Name *
                          </Label>
                          <Input
                            id={`occupant-name-${occupant.id}`}
                            value={occupant.name}
                            onChange={() => onOccupantChange()}
                            placeholder='Enter occupant name'
                            className='mt-1'
                          />
                          <Label
                            htmlFor={`occupant-email-${occupant.id}`}
                            className='text-xs font-semibold'
                          >
                            Email *
                          </Label>
                          <Input
                            id={`occupant-email-${occupant.id}`}
                            type='email'
                            value={occupant.email}
                            onChange={() => onOccupantChange()}
                            placeholder='Enter email address'
                            className='mt-1'
                          />
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onRemoveOccupant()}
                          className='text-destructive hover:text-destructive hover:bg-destructive/10'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <div className='text-center py-8 border rounded-lg bg-muted/30'>
                  <p className='text-sm text-muted-foreground mb-3'>
                    No occupants assigned
                  </p>
                  <Button onClick={onAddOccupant} size='sm' variant='default'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Occupant
                  </Button>
                </div>
              )}
            </div>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        <div className='flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t bg-background shrink-0'>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full sm:w-auto'
          >
            Cancel
          </Button>
          <Button onClick={onSave} className='w-full sm:w-auto'>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditApartmentDialog;
