import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Lock, Image as ImageIcon, Store, Phone, MapPin } from 'lucide-react';

export default function VendorForm() {
  return (
    <>
      {/* Profile Picture */}
      <div className='space-y-2'>
        <Label htmlFor='vendor-photo' className='flex items-center gap-2'>
          <ImageIcon className='size-4 text-muted-foreground' />
          Store Logo
        </Label>
        <div className='flex items-center gap-4'>
          <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed'>
            <Store className='size-8 text-muted-foreground' />
          </div>
          <Input
            id='vendor-photo'
            type='file'
            accept='image/*'
            className='flex-1'
          />
        </div>
      </div>

      <Separator />

      {/* Business Information */}
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='vendor-business' className='flex items-center gap-2'>
            <Store className='size-4 text-muted-foreground' />
            Business Name
          </Label>
          <Input id='vendor-business' placeholder='Enter business name' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='vendor-description' className='flex items-center gap-2'>
            Description
          </Label>
          <Textarea
            id='vendor-description'
            placeholder='Brief description of your business'
            rows={3}
          />
        </div>
      </div>

      <Separator />

      {/* Contact Person */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='vendor-firstname' className='flex items-center gap-2'>
            <User className='size-4 text-muted-foreground' />
            Contact First Name
          </Label>
          <Input id='vendor-firstname' placeholder='Enter first name' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='vendor-lastname' className='flex items-center gap-2'>
            <User className='size-4 text-muted-foreground' />
            Contact Last Name
          </Label>
          <Input id='vendor-lastname' placeholder='Enter last name' />
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='vendor-email' className='flex items-center gap-2'>
            <Mail className='size-4 text-muted-foreground' />
            Email Address
          </Label>
          <Input
            id='vendor-email'
            type='email'
            placeholder='vendor@example.com'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='vendor-phone' className='flex items-center gap-2'>
            <Phone className='size-4 text-muted-foreground' />
            Phone Number
          </Label>
          <Input
            id='vendor-phone'
            type='tel'
            placeholder='+1 (555) 000-0000'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='vendor-address' className='flex items-center gap-2'>
            <MapPin className='size-4 text-muted-foreground' />
            Business Address
          </Label>
          <Input
            id='vendor-address'
            placeholder='Enter business address'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='vendor-password' className='flex items-center gap-2'>
            <Lock className='size-4 text-muted-foreground' />
            Password
          </Label>
          <Input
            id='vendor-password'
            type='password'
            placeholder='Enter secure password'
          />
        </div>
      </div>
    </>
  );
}
