import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Store as StoreIcon, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { VendorType } from '@/interfaces/Vendor.interface';

// Mock data - replace with API call
const mockVendor: VendorType = {
  _id: '1',
  businessName: 'Mini-Markety barzyakan',
  ownerName: 'Ahmed Hassan',
  email: 'contact@minimarket.com',
  phoneNumber: '+964 770 123 4567',
  address: '123 Main Street',
  logo: '',
  fallback: 'MM',
  workingHours: {
    open: '08:00',
    close: '22:00',
  },
  type: 'Market',
  description: 'Your neighborhood grocery store with a wide selection of products',
  buildingName: 'Building A',
  apartmentNumber: '101',
};

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorType>(mockVendor);

  const handleInputChange = (field: keyof VendorType, value: any) => {
    setVendor((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkingHoursChange = (field: 'open' | 'close', value: string) => {
    setVendor((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // TODO: Implement API call to update vendor
    console.log('Saving vendor:', vendor);
  };

  const handleDelete = () => {
    // TODO: Implement API call to delete vendor
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      console.log('Deleting vendor:', id);
      navigate('/vendors');
    }
  };

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <Button variant='ghost' onClick={() => navigate(-1)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Vendors
        </Button>
        <div className='flex gap-2'>
          <Button onClick={handleSave}>
            <Save className='mr-2 h-4 w-4' />
            Save Changes
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </Button>
        </div>
      </div>

      {/* Business Profile Card */}
      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-20 w-20'>
                <AvatarImage src={vendor.logo} alt={vendor.businessName} />
                <AvatarFallback className='bg-primary/10 text-primary text-2xl font-bold'>
                  {vendor.fallback}
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  value={vendor.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className='text-2xl font-bold h-auto py-2 mb-2'
                />
                <div className='flex items-center gap-2 mt-2'>
                  <Select value={vendor.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Restaurant'>Restaurant</SelectItem>
                      <SelectItem value='Market'>Market</SelectItem>
                      <SelectItem value='Bakery'>Bakery</SelectItem>
                      <SelectItem value='Cafe'>Cafe</SelectItem>
                      <SelectItem value='Other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className='text-sm text-muted-foreground'>ID: {vendor._id}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={vendor.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Owner Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Owner Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='ownerName'>Owner Name</Label>
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4 text-muted-foreground' />
                <Input
                  id='ownerName'
                  value={vendor.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className='flex-1'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Mail className='h-5 w-5' />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  value={vendor.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className='flex-1'
                />
              </div>
            </div>
            <Separator />
            <div className='space-y-2'>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <Input
                  id='phoneNumber'
                  type='tel'
                  value={vendor.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className='flex-1'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='buildingName'>Building</Label>
              <div className='flex items-center gap-2'>
                <StoreIcon className='h-4 w-4 text-muted-foreground' />
                <Input
                  id='buildingName'
                  value={vendor.buildingName}
                  onChange={(e) => handleInputChange('buildingName', e.target.value)}
                  className='flex-1'
                />
              </div>
            </div>
            <Separator />
            <div className='space-y-2'>
              <Label htmlFor='apartmentNumber'>Apartment Number</Label>
              <Input
                id='apartmentNumber'
                value={vendor.apartmentNumber}
                onChange={(e) => handleInputChange('apartmentNumber', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='openTime'>Opening Time</Label>
                <Input
                  id='openTime'
                  type='time'
                  value={vendor.workingHours.open}
                  onChange={(e) => handleWorkingHoursChange('open', e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='closeTime'>Closing Time</Label>
                <Input
                  id='closeTime'
                  type='time'
                  value={vendor.workingHours.close}
                  onChange={(e) => handleWorkingHoursChange('close', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDetail;
