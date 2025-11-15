import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { User, Mail, Lock, Phone, Building2, Image as ImageIcon } from 'lucide-react';

const buildings = ['Sky Tower', 'Rose Heights', 'Emerald Plaza'];
const floors = ['1', '2', '3', '4', '5'];
const apartments = ['101', '202', '303', '404', '505'];

type CustomerFormProps = {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    buildingId: string;
    floorId: string;
    apartmentId: string;
    photo?: File | null;
  };
  onInputChange: (field: string, value: unknown) => void;
};

export default function CustomerForm({ formData, onInputChange }: CustomerFormProps) {
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
        <Label htmlFor='customer-photo' className='flex items-center gap-2'>
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
            id='customer-photo'
            type='file'
            accept='image/*'
            className='flex-1'
            onChange={(e) => onInputChange('photo', e.target.files?.[0] || null)}
          />
        </div>
        {formData.photo && (
          <p className='text-xs text-muted-foreground'>
            Selected: {formData.photo.name}
          </p>
        )}
      </div>

      <Separator />

      {/* Personal Information */}
      <div className='space-y-4'>
        <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide'>
          Personal Information
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='customer-firstname' className='flex items-center gap-2'>
              <User className='size-4 text-muted-foreground' />
              First Name
            </Label>
            <Input
              id='customer-firstname'
              placeholder='Enter first name'
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-lastname' className='flex items-center gap-2'>
              <User className='size-4 text-muted-foreground' />
              Last Name
            </Label>
            <Input
              id='customer-lastname'
              placeholder='Enter last name'
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className='space-y-4'>
        <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide'>
          Contact Information
        </h3>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='customer-phone' className='flex items-center gap-2'>
              <Phone className='size-4 text-muted-foreground' />
              Phone Number
            </Label>
            <Input
              id='customer-phone'
              type='tel'
              placeholder='+1 (555) 000-0000'
              value={formData.phoneNumber}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-email' className='flex items-center gap-2'>
              <Mail className='size-4 text-muted-foreground' />
              Email Address
            </Label>
            <Input
              id='customer-email'
              type='email'
              placeholder='customer@example.com'
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Security */}
      <div className='space-y-4'>
        <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide'>
          Security
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='customer-password' className='flex items-center gap-2'>
              <Lock className='size-4 text-muted-foreground' />
              Password
            </Label>
            <Input
              id='customer-password'
              type='password'
              placeholder='Enter password'
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='customer-confirm'
              className='flex items-center gap-2'
            >
              <Lock className='size-4 text-muted-foreground' />
              Confirm Password
            </Label>
            <Input
              id='customer-confirm'
              type='password'
              placeholder='Confirm password'
              value={formData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Address */}
      <div className='space-y-4'>
        <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2'>
          <Building2 className='size-4' />
          Address (Optional)
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='customer-building'>Building</Label>
            <Select
              value={formData.buildingId}
              onValueChange={(value) => onInputChange('buildingId', value)}
            >
              <SelectTrigger id='customer-building'>
                <SelectValue placeholder='Select building' />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((b, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-floor'>Floor</Label>
            <Select
              value={formData.floorId}
              onValueChange={(value) => onInputChange('floorId', value)}
            >
              <SelectTrigger id='customer-floor'>
                <SelectValue placeholder='Select floor' />
              </SelectTrigger>
              <SelectContent>
                {floors.map((f, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Floor {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-apartment'>Apartment</Label>
            <Select
              value={formData.apartmentId}
              onValueChange={(value) => onInputChange('apartmentId', value)}
            >
              <SelectTrigger id='customer-apartment'>
                <SelectValue placeholder='Select apt' />
              </SelectTrigger>
              <SelectContent>
                {apartments.map((a, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    #{a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}
