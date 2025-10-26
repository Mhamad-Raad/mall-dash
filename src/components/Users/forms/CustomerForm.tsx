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

export default function CustomerForm() {
  return (
    <>
      {/* Profile Picture */}
      <div className='space-y-2'>
        <Label htmlFor='customer-photo' className='flex items-center gap-2'>
          <ImageIcon className='size-4 text-muted-foreground' />
          Profile Picture
        </Label>
        <div className='flex items-center gap-4'>
          <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed'>
            <ImageIcon className='size-8 text-muted-foreground' />
          </div>
          <Input
            id='customer-photo'
            type='file'
            accept='image/*'
            className='flex-1'
          />
        </div>
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
            <Input id='customer-firstname' placeholder='Enter first name' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-lastname' className='flex items-center gap-2'>
              <User className='size-4 text-muted-foreground' />
              Last Name
            </Label>
            <Input id='customer-lastname' placeholder='Enter last name' />
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
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Address */}
      <div className='space-y-4'>
        <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2'>
          <Building2 className='size-4' />
          Address
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='customer-building'>Building</Label>
            <Select>
              <SelectTrigger id='customer-building'>
                <SelectValue placeholder='Select building' />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-floor'>Floor</Label>
            <Select>
              <SelectTrigger id='customer-floor'>
                <SelectValue placeholder='Select floor' />
              </SelectTrigger>
              <SelectContent>
                {floors.map((f) => (
                  <SelectItem key={f} value={f}>
                    Floor {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='customer-apartment'>Apartment</Label>
            <Select>
              <SelectTrigger id='customer-apartment'>
                <SelectValue placeholder='Select apt' />
              </SelectTrigger>
              <SelectContent>
                {apartments.map((a) => (
                  <SelectItem key={a} value={a}>
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
