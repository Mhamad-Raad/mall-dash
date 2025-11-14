import { useState, useEffect } from 'react';
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
import roles from '@/constants/roles';
import { User as UserIcon } from 'lucide-react';
import type { UserFormData } from '@/interfaces/Users.interface';

interface UserProfileCardProps {
  formData: UserFormData;
  onInputChange: (field: keyof UserFormData, value: string | number | File) => void;
}

const UserProfileCard = ({ formData, onInputChange }: UserProfileCardProps) => {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (formData.imageFile instanceof File) {
      const url = URL.createObjectURL(formData.imageFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(formData.profileImageUrl || '');
    }
  }, [formData.imageFile, formData.profileImageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onInputChange('imageFile', file); // Only save the actual File
  };

  const initials =
    (formData.firstName?.[0] || '') + (formData.lastName?.[0] || '');

  console.log('Rendering U', preview);

  return (
    <Card className='mb-6'>
      <CardHeader className='pb-4'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
          <div className='relative'>
            <Avatar className='h-24 w-24 border-4 border-background shadow-xl'>
              <AvatarImage
                src={preview || '/default-user.png'}
                alt={`${formData.firstName}'s profile picture`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-user.png';
                }}
              />
              <AvatarFallback className='bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold'>
                {initials.trim() ? (
                  initials
                ) : (
                  <UserIcon className='w-12 h-12 text-muted-foreground' />
                )}
              </AvatarFallback>
            </Avatar>
            <label className='absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow cursor-pointer hover:bg-primary/90 transition'>
              <Input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageChange}
              />
              <span className='text-xs'>Edit</span>
            </label>
          </div>
          <div className='flex-1 w-full'>
            <div className='flex flex-col gap-3 mb-2'>
              <div className='space-y-1'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  value={formData.firstName}
                  onChange={(e) => onInputChange('firstName', e.target.value)}
                  className='text-2xl font-bold h-auto py-2'
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
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
                  value={String(formData.role)}
                  onValueChange={(value) =>
                    onInputChange('role', Number(value))
                  }
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role, index) => (
                      <SelectItem value={String(index)} key={index}>
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
