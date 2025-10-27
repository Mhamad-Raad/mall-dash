import { useState } from 'react';
import { Building2, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BuildingHeaderProps {
  buildingName: string;
  onNameChange: (newName: string) => void;
  onBack: () => void;
}

const BuildingHeader = ({ buildingName, onNameChange, onBack }: BuildingHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(buildingName);

  const handleSave = () => {
    if (editedName.trim()) {
      onNameChange(editedName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(buildingName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div>
      <Button variant='ghost' onClick={onBack} className='mb-4 hover:bg-muted/50'>
        <span className='mr-2'>←</span>
        Back to Buildings
      </Button>

      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='p-4 rounded-xl bg-primary/10 border-2 border-primary/20'>
            <Building2 className='h-10 w-10 text-primary' />
          </div>
          <div className='flex items-center gap-3'>
            {isEditing ? (
              <div className='flex items-center gap-2'>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className='text-3xl md:text-4xl font-bold h-auto py-2 px-3 max-w-md'
                  autoFocus
                />
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={handleSave}
                  className='text-green-600 hover:text-green-700 hover:bg-green-100'
                >
                  <Check className='h-5 w-5' />
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={handleCancel}
                  className='text-destructive hover:text-destructive hover:bg-destructive/10'
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>{buildingName}</h1>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => setIsEditing(true)}
                  className='hover:bg-primary/10'
                >
                  <Pencil className='h-5 w-5' />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingHeader;
