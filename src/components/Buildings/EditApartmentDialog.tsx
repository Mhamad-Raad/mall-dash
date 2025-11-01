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
import type { BuildingDetailApartment, Occupant } from '@/interfaces/Building.interface';

interface EditApartmentDialogProps {
  apartment: BuildingDetailApartment | null;
  isOpen: boolean;
  onClose: () => void;
  occupant: Occupant | null;
  apartmentName?: string;
  onApartmentNameChange?: (newName: string) => void;
  onAddOccupant: () => void;
  onRemoveOccupant: () => void;
  onOccupantChange: (field: 'name' | 'email', value: string) => void;
  onSave: () => void;
}

const EditApartmentDialog = ({
  apartment,
  isOpen,
  onClose,
  occupant,
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
            Manage apartment occupant. Add or edit occupant information.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='flex-1 overflow-auto pr-4'>
          <div className='space-y-4 py-4'>
            <div className='border-t pt-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold flex items-center gap-2'>
                  <Users className='h-4 w-4' />
                  Occupant
                </h3>
                {!occupant && (
                  <Button onClick={onAddOccupant} size='sm' variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Occupant
                  </Button>
                )}
              </div>

              {occupant ? (
                <Card className='border-2'>
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-4'>
                      <div className='flex-1 space-y-3'>
                        <div>
                          <Label htmlFor='occupant-name' className='text-xs font-semibold'>
                            Name *
                          </Label>
                          <Input
                            id='occupant-name'
                            value={occupant.name}
                            onChange={(e) => onOccupantChange('name', e.target.value)}
                            placeholder='Enter occupant name'
                            className='mt-1'
                          />
                        </div>
                        <div>
                          <Label htmlFor='occupant-email' className='text-xs font-semibold'>
                            Email *
                          </Label>
                          <Input
                            id='occupant-email'
                            type='email'
                            value={occupant.email}
                            onChange={(e) => onOccupantChange('email', e.target.value)}
                            placeholder='Enter email address'
                            className='mt-1'
                          />
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={onRemoveOccupant}
                        className='text-destructive hover:text-destructive hover:bg-destructive/10'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className='text-center py-8 border rounded-lg bg-muted/30'>
                  <p className='text-sm text-muted-foreground mb-3'>No occupant assigned</p>
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
          <Button variant='outline' onClick={onClose} className='w-full sm:w-auto'>
            Cancel
          </Button>
          <Button onClick={onSave} className='w-full sm:w-auto'>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditApartmentDialog;
