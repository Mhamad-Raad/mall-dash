import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BuildingsEmptyState = () => {
  const navigate = useNavigate();

  const handleCreateBuilding = () => {
    navigate('/buildings/create');
  };

  return (
    <div className='flex flex-col items-center justify-center py-12 gap-4 bg-card border rounded-lg shadow text-center'>
      <span className='p-4 rounded-full bg-muted'>
        <Building2 className='h-10 w-10 text-primary' />
      </span>
      <h2 className='text-xl font-semibold'>No buildings found</h2>
      <p className='text-muted-foreground max-w-xs'>
        There are currently no buildings in the system.
        <br />
        Start by adding your first building!
      </p>
      <Button className='mt-3 gap-2' onClick={handleCreateBuilding}>
        <Plus className='h-4 w-4' />
        Add Building
      </Button>
    </div>
  );
};

export default BuildingsEmptyState;
