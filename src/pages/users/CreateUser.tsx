import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const userTypes = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Customer', value: 'Customer' },
  { label: 'Vendor', value: 'Vendor' },
];

const vendorTypes = [
  { label: 'Store', value: 'Store' },
  { label: 'Restaurant', value: 'Restaurant' },
  { label: 'Bakery', value: 'Bakery' },
];

const buildings = ['Sky Tower', 'Rose Heights', 'Emerald Plaza'];
const floors = ['1', '2', '3', '4', '5'];
const apartments = ['101', '202', '303', '404', '505'];

export default function CreateUser() {
  const [type, setType] = React.useState('Customer');
  const [vendorType, setVendorType] = React.useState('');

  return (
    <div className='px-4 py-8 flex justify-center'>
      <Card className='w-full max-w-3xl relative'>
        <CardHeader>
          <CardTitle className='text-lg font-black'>Create User</CardTitle>
        </CardHeader>

        <CardContent className='space-y-8'>
          {/* User Type */}
          <div>
            <label className='font-medium mb-2 block'>User Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder='Select user type' />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Admin Fields */}
          {type === 'Admin' && (
            <div className='grid gap-4'>
              <Input type='email' placeholder='Email' />
              <Input type='password' placeholder='Password' />
              <Input type='text' placeholder='First Name' />
              <Input type='text' placeholder='Last Name' />
            </div>
          )}

          {/* Customer Fields */}
          {type === 'Customer' && (
            <div className='grid gap-4'>
              <Input type='file' accept='image/*' />
              <Input type='tel' placeholder='Phone Number' />
              <Input type='email' placeholder='Email' />
              <Input type='password' placeholder='Password' />
              <Input type='password' placeholder='Confirm Password' />
              <Input type='text' placeholder='First Name' />
              <Input type='text' placeholder='Last Name' />

              <div>
                <label className='font-medium mb-1 block'>Address</label>
                <div className='flex gap-2'>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Building' />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Floor' />
                    </SelectTrigger>
                    <SelectContent>
                      {floors.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Apartment' />
                    </SelectTrigger>
                    <SelectContent>
                      {apartments.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Fields */}
          {type === 'Vendor' && (
            <div className='grid gap-4'>
              <Input type='text' placeholder='Name' />
              <Input type='file' accept='image/*' />
              <Textarea placeholder='Description' />
              <Input type='time' placeholder='Opening Time' />
              <Input type='time' placeholder='Closing Time' />
              <Select value={vendorType} onValueChange={setVendorType}>
                <SelectTrigger>
                  <SelectValue placeholder='Type' />
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
          )}
        </CardContent>

        {/* Sticky Submit Button */}
        <Button
          className='fixed z-50 bottom-8 right-8 rounded-full h-14 w-14 p-0 shadow-lg flex items-center justify-center'
          type='submit'
        >
          <Plus className='size-6' />
        </Button>
      </Card>
    </div>
  );
}
