import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Lock, Image as ImageIcon } from 'lucide-react';

export default function AdminForm() {
  return (
    <>
      {/* Profile Picture */}
      <div className='space-y-2'>
        <Label htmlFor='admin-photo' className='flex items-center gap-2'>
          <ImageIcon className='size-4 text-muted-foreground' />
          Profile Picture
        </Label>
        <div className='flex items-center gap-4'>
          <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed'>
            <ImageIcon className='size-8 text-muted-foreground' />
          </div>
          <Input
            id='admin-photo'
            type='file'
            accept='image/*'
            className='flex-1'
          />
        </div>
      </div>

      <Separator />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='admin-firstname' className='flex items-center gap-2'>
            <User className='size-4 text-muted-foreground' />
            First Name
          </Label>
          <Input id='admin-firstname' placeholder='Enter first name' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='admin-lastname' className='flex items-center gap-2'>
            <User className='size-4 text-muted-foreground' />
            Last Name
          </Label>
          <Input id='admin-lastname' placeholder='Enter last name' />
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
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='admin-password' className='flex items-center gap-2'>
            <Lock className='size-4 text-muted-foreground' />
            Password
          </Label>
          <Input
            id='admin-password'
            type='password'
            placeholder='Enter secure password'
          />
        </div>
      </div>
    </>
  );
}
