import { Home, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import type { ApartmentLayout } from './RoomCreator/types';
import { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchUsers } from '@/data/Users';
import { RoomCreator } from './RoomCreator';

export interface UserResult {
  id: number | string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface EditApartmentDialogProps {
  apartment: Apartment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (occupant: any, name: string, layout?: ApartmentLayout) => void;
  onDelete?: (apartmentId: number) => void;
  apartmentName: string;
  setApartmentName: (name: string) => void;
}

const DEFAULT_LAYOUT: ApartmentLayout = {
  rooms: [],
  doors: [],
  gridSize: 48,
};

const EditApartmentDialog = ({
  apartment,
  isOpen,
  onClose,
  onSave,
  apartmentName,
  setApartmentName,
  onDelete,
}: EditApartmentDialogProps) => {
  const { t } = useTranslation('buildings');
  const [pendingOccupant, setPendingOccupant] = useState<
    UserResult | null | 'remove'
  >(null);
  const [layout, setLayout] = useState<ApartmentLayout>(DEFAULT_LAYOUT);

  useEffect(() => {
    // Only reset layout when apartment changes or dialog opens
    // Don't reset when apartment.layout changes (to prevent overwriting user edits)
    if (isOpen && apartment) {
      setApartmentName(apartment.apartmentName ?? '');
      setPendingOccupant(apartment.occupant ? null : 'remove');
      setLayout(apartment.layout ?? DEFAULT_LAYOUT);
    }
  }, [
    apartment?.id,
    setApartmentName,
    isOpen,
  ]);

  // Cleanup memory when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Reset layout to release memory from large room/door arrays
      const cleanupTimer = setTimeout(() => {
        setLayout(DEFAULT_LAYOUT);
        setPendingOccupant(null);
      }, 300); // Small delay to allow closing animation

      return () => clearTimeout(cleanupTimer);
    }
  }, [isOpen]);

  const fetchUserObjects = useCallback(
    async (query: string): Promise<UserResult[]> => {
      const result = await fetchUsers({ searchTerm: query, limit: 5 });
      const users = Array.isArray(result?.data)
        ? result.data
            .filter((u: any) => !u.buildingName)
            .map((u: any) => ({
              id: u._id,
              name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
              email: u.email,
              avatarUrl: u.profileImageUrl,
            }))
        : [];
      return users;
    },
    []
  );

  // Final occupant preview logic:
  let occupant: UserResult | Occupant | null = null;
  if (pendingOccupant === 'remove') {
    occupant = null;
  } else if (pendingOccupant) {
    occupant = pendingOccupant;
  } else if (apartment?.occupant) {
    occupant = apartment.occupant;
  }

  const handleSave = () => {
    let userId: string | number | null = null;
    if (pendingOccupant === 'remove') {
      userId = null;
    } else if (
      pendingOccupant &&
      typeof pendingOccupant === 'object' &&
      'id' in pendingOccupant
    ) {
      userId = pendingOccupant.id;
    } else if (apartment?.occupant) {
      userId = apartment.occupant.id;
    }
    onSave(userId, apartmentName, layout);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='!w-screen !h-screen !max-w-none !max-h-none !rounded-none !translate-x-0 !translate-y-0 !top-0 !left-0 flex flex-col p-0 gap-0 overflow-hidden'>
        <DialogHeader className='px-6 pt-4 pb-3 border-b shrink-0'>
          <DialogTitle className='flex items-center gap-2'>
            <Home className='h-5 w-5 text-primary' />
            {t('detail.apartment.editApartment')} {apartment?.apartmentName}
          </DialogTitle>
          <DialogDescription>
            {t('detail.apartment.manageOccupants')}
          </DialogDescription>
        </DialogHeader>

        {/* Two-column layout: Details on left, Floor Plan on right */}
        <div className='flex-1 flex overflow-hidden'>
          {/* Left sidebar - Details & Occupant */}
          <div className='w-80 shrink-0 border-r p-4 overflow-auto space-y-4'>
            {/* Apartment Name */}
            <div>
              <Label htmlFor='apartment-name' className='text-xs font-semibold'>
                {t('detail.apartment.apartmentNameLabel')}
              </Label>
              <Input
                id='apartment-name'
                value={apartmentName}
                onChange={(e) => setApartmentName(e.target.value)}
                placeholder={t('detail.apartment.apartmentNamePlaceholder')}
                className='mt-1'
              />
            </div>

            {/* User Search */}
            <div>
              {occupant === null && (
                <ObjectAutoComplete<UserResult>
                  fetchOptions={fetchUserObjects}
                  getOptionLabel={(user) => `${user.name} (${user.email})`}
                  onSelectOption={(user) => setPendingOccupant(user)}
                  placeholder={t('detail.apartment.searchUserPlaceholder')}
                  debounceMs={250}
                />
              )}
            </div>

            {/* Occupant Section */}
            <div className='border-t pt-4 space-y-3'>
              <h3 className='text-sm font-semibold flex items-center gap-2'>
                <Users className='h-4 w-4' />
                {t('detail.apartment.occupantLabel')}
              </h3>
              {occupant ? (
                <div className='flex items-center justify-between gap-2 p-3 border rounded-lg bg-muted/20'>
                  <div className='flex gap-3 items-center min-w-0'>
                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary uppercase overflow-hidden shrink-0'>
                      {'avatarUrl' in occupant && occupant.avatarUrl ? (
                        <img
                          src={occupant.avatarUrl}
                          alt={occupant.name}
                          className='w-10 h-10 object-cover rounded-full'
                        />
                      ) : (
                        occupant.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('') || '?'
                      )}
                    </div>
                    <div className='flex flex-col min-w-0'>
                      <span className='font-medium truncate'>
                        {occupant.name}
                      </span>
                      <span className='text-muted-foreground text-xs truncate'>
                        {occupant.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='shrink-0'
                    onClick={() => setPendingOccupant('remove')}
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              ) : (
                <div className='text-center py-6 border rounded-lg bg-muted/30'>
                  <p className='text-sm text-muted-foreground'>
                    {t('detail.apartment.noOccupantsAssigned')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right area - Floor Plan Designer */}
          <div className='flex-1 p-4 overflow-auto'>
            <RoomCreator layout={layout} onLayoutChange={setLayout} />
          </div>
        </div>

        <div className='flex flex-col-reverse sm:flex-row justify-end gap-2 px-6 py-4 border-t bg-background shrink-0'>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full sm:w-auto'
          >
            {t('detail.apartment.cancel')}
          </Button>
          {apartment?.id && onDelete && (
            <Button
              variant='destructive'
              onClick={() => onDelete(apartment.id)}
              className='w-full sm:w-auto'
            >
              {t('detail.apartment.deleteApartment')}
            </Button>
          )}
          <Button onClick={handleSave} className='w-full sm:w-auto'>
            {t('detail.apartment.saveChanges')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditApartmentDialog;
