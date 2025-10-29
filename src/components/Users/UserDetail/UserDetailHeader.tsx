import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserDetailHeaderProps {
  onBack: () => void;
  onSave: () => void;
  hasChanges: boolean;
}

const UserDetailHeader = ({
  onBack,
  onSave,
  hasChanges,
}: UserDetailHeaderProps) => {
  return (
    <div className='flex items-center justify-between mb-6'>
      <Button variant='ghost' onClick={onBack} disabled={hasChanges}>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Users
      </Button>
      <div className='flex gap-2'>
        <Button onClick={onSave} disabled={!hasChanges}>
          <Save className='mr-2 h-4 w-4' />
          Save Changes
        </Button>
        <Button variant='destructive'>Delete User</Button>
      </div>
    </div>
  );
};

export default UserDetailHeader;
