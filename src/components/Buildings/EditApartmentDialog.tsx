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
import type { Apartment, Occupant } from '@/interfaces/Building.interface';
import { useEffect, useState } from 'react';

interface EditApartmentDialogProps {
  apartment: Apartment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditApartmentDialog = ({
  apartment,
  isOpen,
  onClose,
  onSave,
}: EditApartmentDialogProps) => {
  const [apartmentName, setApartmentName] = useState('');

  useEffect(() => {
    setApartmentName(apartment?.apartmentName ?? '');
  }, [apartment?.apartmentName]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Home className='h-5 w-5 text-primary' />
            Edit Apartment {apartment?.apartmentName}
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
            value={apartmentName}
            onChange={(e) => setApartmentName(e.target.value)}
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
                  Occupant
                </h3>
                {!apartment?.occupant && (
                  <Button size='sm' variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Occupant
                  </Button>
                )}
              </div>

              {apartment?.occupant ? (
                <div className='flex items-center gap-4'>
                  {/* Avatar: use initials or fallback image */}
                  <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary uppercase'>
                    {false ? (
                      <div />
                    ) : (
                      // <img
                      //   src={apartment.occupant.avatarUrl}
                      //   alt={apartment.occupant.name}
                      //   className='w-12 h-12 object-cover rounded-full'
                      // />
                      // Use initials (first letters of name, fallback "?")
                      apartment.occupant.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('') || '?'
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-lg font-medium'>
                      {apartment.occupant.name}
                    </span>
                    <span className='text-muted-foreground text-sm'>
                      {apartment.occupant.email}
                    </span>
                  </div>
                </div>
              ) : (
                <div className='text-center py-8 border rounded-lg bg-muted/30'>
                  <p className='text-sm text-muted-foreground mb-3'>
                    No occupants assigned
                  </p>
                  <Button size='sm' variant='default'>
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
