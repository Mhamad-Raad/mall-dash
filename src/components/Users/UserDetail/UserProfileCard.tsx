import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User } from '@/interfaces/Users.interface';

interface UserProfileCardProps {
  user: User;
  formData: {
    name: string;
    type: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const UserProfileCard = ({ user, formData, onInputChange }: UserProfileCardProps) => {
  return (
    <Card className='mb-6'>
      <CardHeader className='pb-4'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
          <Avatar className='h-24 w-24 border-4 border-background shadow-xl'>
            <AvatarImage src={user.src} alt={user.name} />
            <AvatarFallback className='text-2xl font-bold bg-primary/10 text-primary'>
              {user.fallback}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 w-full'>
            <div className='flex flex-col gap-3 mb-2'>
              <div className='space-y-1'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) => onInputChange('name', e.target.value)}
                  className='text-2xl font-bold h-auto py-2'
                />
              </div>
              <div className='flex items-center gap-2'>
                <Label htmlFor='userType' className='text-sm text-muted-foreground'>
                  Role:
                </Label>
                <Select value={formData.type} onValueChange={(value) => onInputChange('type', value)}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Admin'>Admin</SelectItem>
                    <SelectItem value='Manager'>Manager</SelectItem>
                    <SelectItem value='User'>User</SelectItem>
                    <SelectItem value='Technician'>Technician</SelectItem>
                    <SelectItem value='Security'>Security</SelectItem>
                    <SelectItem value='Maintenance'>Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription className='text-base'>User ID: {user.id}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserProfileCard;
