import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Clock, FileText, Image as ImageIcon, Store } from 'lucide-react';

const vendorTypes = [
  { label: 'Store', value: 'Store' },
  { label: 'Restaurant', value: 'Restaurant' },
  { label: 'Bakery', value: 'Bakery' },
];

export default function VendorForm() {
  const [vendorType, setVendorType] = React.useState('');

  return (
    <>
      {/* Business Logo */}
      <div className='space-y-2'>
        <Label htmlFor='vendor-logo' className='flex items-center gap-2'>
          <ImageIcon className='size-4 text-muted-foreground' />
          Business Logo
        </Label>
        <div className='flex items-center gap-4'>
          <div className='w-20 h-20 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed'>
            <Store className='size-8 text-muted-foreground' />
          </div>
          <Input
            id='vendor-logo'
            type='file'
            accept='image/*'
            className='flex-1'
          />
        </div>
      </div>

      <Separator />

      {/* Business Information */}
      <div className='space-y-4'>
        <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide'>
          Business Information
        </h3>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='vendor-name' className='flex items-center gap-2'>
              <Store className='size-4 text-muted-foreground' />
              Business Name
            </Label>
            <Input id='vendor-name' placeholder='Enter business name' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='vendor-type' className='flex items-center gap-2'>
              <FileText className='size-4 text-muted-foreground' />
              Business Type
            </Label>
            <Select value={vendorType} onValueChange={setVendorType}>
              <SelectTrigger id='vendor-type'>
                <SelectValue placeholder='Select business type' />
              </SelectTrigger>
              <SelectContent>
                {vendorTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='vendor-desc' className='flex items-center gap-2'>
              <FileText className='size-4 text-muted-foreground' />
              Description
            </Label>
            <Textarea
              id='vendor-desc'
              placeholder='Describe your business...'
              rows={4}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Operating Hours */}
      <div className='space-y-4'>
        <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2'>
          <Clock className='size-4' />
          Operating Hours
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='vendor-open'>Opening Time</Label>
            <Input id='vendor-open' type='time' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='vendor-close'>Closing Time</Label>
            <Input id='vendor-close' type='time' />
          </div>
        </div>
      </div>
    </>
  );
}
