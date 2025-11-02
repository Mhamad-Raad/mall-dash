import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Building2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { RootState } from '@/store/store';

const BuildingHeader = () => {
  const navigate = useNavigate();

  const { building } = useSelector((state: RootState) => state.building);

  const [editedName, setEditedName] = useState(building?.name || '');

  const handleBackNavigation = () => {
    navigate('/buildings');
  };

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
            <div className='flex items-center gap-2'>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className='text-3xl md:text-4xl font-bold h-auto py-2 px-3 max-w-md'
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingHeader;
