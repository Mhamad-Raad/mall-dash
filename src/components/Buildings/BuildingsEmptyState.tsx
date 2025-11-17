import { Building2 } from 'lucide-react';

const BuildingsEmptyState = () => {
  return (
    <div className='flex flex-col items-center justify-center py-12 gap-4 bg-card border rounded-lg shadow text-center'>
      <span className='p-4 rounded-full bg-muted'>
        <Building2 className='h-10 w-10 text-primary' />
      </span>
      <h2 className='text-xl font-semibold'>No buildings found</h2>
      <p className='text-muted-foreground max-w-xs'>
        There are currently no buildings in the system.
      </p>
    </div>
  );
};

export default BuildingsEmptyState;
