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
import type { UserType } from '@/interfaces/Users.interface';

import roles from '@/constants/roles';

interface UserProfileCardProps {
  formData: UserType;
  onInputChange: (field: string, value: string | number) => void;
}

const UserProfileCard = ({ formData, onInputChange }: UserProfileCardProps) => {
  return (
    <Card className='mb-6'>
      <CardHeader className='pb-4'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
          <Avatar className='h-24 w-24 border-4 border-background shadow-xl'>
            <AvatarImage
              src={formData.src}
              alt={`${formData?.firstName}'s profile picture`}
            />
            <AvatarFallback className='text-2xl font-bold bg-primary/10 text-primary'>
              {formData.fallback}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 w-full'>
            <div className='flex flex-col gap-3 mb-2'>
              <div className='space-y-1'>
                <Label htmlFor='name'>First Name</Label>
                <Input
                  id='name'
                  value={formData.firstName}
                  onChange={(e) => onInputChange('firstName', e.target.value)}
                  className='text-2xl font-bold h-auto py-2'
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='name'>Last Name</Label>
                <Input
                  id='name'
                  value={formData.lastName}
                  onChange={(e) => onInputChange('lastName', e.target.value)}
                  className='text-2xl font-bold h-auto py-2'
                />
              </div>
              <CardDescription className='text-base'>
                User ID: {formData._id}
              </CardDescription>
              <div className='flex items-center gap-2'>
                <Label
                  htmlFor='userType'
                  className='text-sm text-muted-foreground'
                >
                  Role:
                </Label>
                <Select
                  value={formData.role as any}
                  onValueChange={(value) => onInputChange('role', value)}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role, index) => (
                      <SelectItem value={index as any} key={index}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserProfileCard;
