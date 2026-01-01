import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ApartmentLayout } from './types';

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layout: ApartmentLayout;
  onSave: (name: string, layout: ApartmentLayout) => void;
}

export const SaveTemplateDialog = ({
  open,
  onOpenChange,
  layout,
  onSave,
}: SaveTemplateDialogProps) => {
  const [templateName, setTemplateName] = useState('');
  const doors = layout.doors || [];

  const handleSave = () => {
    if (templateName.trim()) {
      onSave(templateName.trim(), layout);
      onOpenChange(false);
      setTemplateName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Save the current layout as a reusable template for other apartments.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='template-name'>Template Name</Label>
            <Input
              id='template-name'
              placeholder='e.g., Studio Apartment, 2BR Layout'
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          <div className='text-sm text-muted-foreground'>
            <p>This template will include:</p>
            <ul className='list-disc list-inside mt-1 space-y-0.5'>
              <li>{layout.rooms.length} room{layout.rooms.length !== 1 ? 's' : ''}</li>
              <li>{doors.length} door{doors.length !== 1 ? 's' : ''}</li>
              <li>{layout.rooms.reduce((sum, room) => sum + room.width * room.height, 0).toFixed(2)} m² total area</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!templateName.trim()}>
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
