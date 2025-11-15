import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Mail, Lock, Image as ImageIcon, Phone, Shield } from 'lucide-react';
import roles from '@/constants/roles';

type StaffFormProps = {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    role: number;
    photo?: File | null;
  };
  onInputChange: (field: string, value: unknown) => void;
};

export default function StaffForm({ formData, onInputChange }: StaffFormProps) {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (formData.photo instanceof File) {
      const url = URL.createObjectURL(formData.photo);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview('');
    }
  }, [formData.photo]);

  return (
    <>
      {/* Profile Picture */}
      <div className='space-y-2'>
        <Label htmlFor='admin-photo' className='flex items-center gap-2'>
          <ImageIcon className='size-4 text-muted-foreground' />
          Profile Picture (Optional)
        </Label>
        <div className='flex items-center gap-4'>
          <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed overflow-hidden'>
            {preview ? (
              <img src={preview} alt='Preview' className='w-full h-full object-cover' />
            ) : (
              <ImageIcon className='size-8 text-muted-foreground' />
            )}
          </div>
          <Input
            id='admin-photo'
            type='file'
            accept='image/*'
            className='flex-1'
            onChange={(e) =>
              onInputChange('photo', e.target.files?.[0] || null)
            }
          />
        </div>
        {formData.photo && (
          <p className='text-xs text-muted-foreground'>
            Selected: {formData.photo.name}
          </p>
        )}
      </div>

      <Separator />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='admin-firstname' className='flex items-center gap-2'>
            <User className='size-4 text-muted-foreground' />
            First Name
          </Label>
          <Input
            id='admin-firstname'
            placeholder='Enter first name'
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='admin-lastname' className='flex items-center gap-2'>
            <User className='size-4 text-muted-foreground' />
            Last Name
          </Label>
          <Input
            id='admin-lastname'
            placeholder='Enter last name'
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='admin-email' className='flex items-center gap-2'>
            <Mail className='size-4 text-muted-foreground' />
            Email Address
          </Label>
          <Input
            id='admin-email'
            type='email'
            placeholder='admin@example.com'
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='admin-phone' className='flex items-center gap-2'>
            <Phone className='size-4 text-muted-foreground' />
            Phone Number
          </Label>
          <Input
            id='admin-phone'
            type='tel'
            placeholder='Enter phone number'
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='staff-role' className='flex items-center gap-2'>
            <Shield className='size-4 text-muted-foreground' />
            Role
          </Label>
          <Select
            value={formData.role.toString()}
            onValueChange={(value) => onInputChange('role', parseInt(value))}
          >
            <SelectTrigger id='staff-role'>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='admin-password' className='flex items-center gap-2'>
              <Lock className='size-4 text-muted-foreground' />
              Password
            </Label>
            <Input
              id='admin-password'
              type='password'
              placeholder='Enter secure password'
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='admin-confirm-password'
              className='flex items-center gap-2'
            >
              <Lock className='size-4 text-muted-foreground' />
              Confirm Password
            </Label>
            <Input
              id='admin-confirm-password'
              type='password'
              placeholder='Re-enter password'
              value={formData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
