import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Store, Clock, User, FileText, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';

import { vendorTypes } from '@/constants/vendorTypes';
import { createVendor } from '@/data/Vendor';
import { fetchUsers } from '@/data/Users';
import { convertToUTCFormat } from '@/lib/timeUtils';

const CreateVendor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    openingTime: '',
    closeTime: '',
    type: '1',
    userId: '',
    userName: '',
    photo: null as File | null,
  });

  useEffect(() => {
    if (formData.photo instanceof File) {
      const url = URL.createObjectURL(formData.photo);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview('');
    }
  }, [formData.photo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const handlePhotoRemove = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Validation Error', {
        description: 'Please enter vendor name',
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Validation Error', {
        description: 'Please enter vendor description',
      });
      return false;
    }
    if (!formData.openingTime) {
      toast.error('Validation Error', {
        description: 'Please select opening time',
      });
      return false;
    }
    if (!formData.closeTime) {
      toast.error('Validation Error', {
        description: 'Please select closing time',
      });
      return false;
    }
    if (!formData.userId.trim()) {
      toast.error('Validation Error', {
        description: 'Please select a user to manage this vendor',
      });
      return false;
    }

    // Validate time logic
    if (formData.openingTime >= formData.closeTime) {
      toast.error('Validation Error', {
        description: 'Closing time must be after opening time',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', formData);

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data to send to API with UTC time format
      const vendorData = {
        name: formData.name,
        description: formData.description,
        openingTime: convertToUTCFormat(formData.openingTime),
        closeTime: convertToUTCFormat(formData.closeTime),
        type: parseInt(formData.type),
        userId: formData.userId,
        ...(formData.photo ? { ProfileImageUrl: formData.photo } : {}),
      };

      console.log('Sending vendor data:', vendorData);
      const res = await createVendor(vendorData);
      console.log('Response:', res);

      if (res.error) {
        toast.error('Failed to Create Vendor', {
          description: res.error || 'An error occurred while creating the vendor.',
        });
      } else {
        toast.success('Vendor Created Successfully!', {
          description: `${formData.name} has been added to the system.`,
        });
        navigate('/vendors');
      }
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast.error('Failed to Create Vendor', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/vendors');
  };

  return (
    <div className='w-full h-full flex flex-col gap-6 p-6 overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={handleCancel}
          className='h-10 w-10'
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Create New Vendor
          </h1>
          <p className='text-muted-foreground'>
            Add a new vendor to your mall directory
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Form */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Store className='h-5 w-5' />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the vendor's basic details
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>
                    Vendor Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='name'
                    placeholder='e.g., Aland StakeHouse'
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>
                    Description <span className='text-destructive'>*</span>
                  </Label>
                  <Textarea
                    id='description'
                    placeholder='Brief description of the vendor and their offerings...'
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    className='resize-none h-24'
                    required
                  />
                  <p className='text-xs text-muted-foreground'>
                    {formData.description.length}/500 characters
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='vendor-photo' className='flex items-center gap-2'>
                    <ImageIcon className='size-4 text-muted-foreground' />
                    Vendor Logo/Image (Optional)
                  </Label>
                  <div className='flex items-center gap-4'>
                    <div className='w-20 h-20 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed overflow-hidden'>
                      {preview ? (
                        <img
                          src={preview}
                          alt='Preview'
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <ImageIcon className='size-8 text-muted-foreground' />
                      )}
                    </div>
                    <div className='flex-1 space-y-2'>
                      <Input
                        id='vendor-photo'
                        type='file'
                        accept='image/*'
                        onChange={handlePhotoChange}
                        disabled={isSubmitting}
                      />
                      {formData.photo && (
                        <div className='flex items-center justify-between'>
                          <p className='text-xs text-muted-foreground'>
                            Selected: {formData.photo.name}
                          </p>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={handlePhotoRemove}
                            disabled={isSubmitting}
                          >
                            <X className='size-4' />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='type'>
                    Vendor Type <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger id='type'>
                      <SelectValue placeholder='Select vendor type' />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorTypes.map((type) => (
                        <SelectItem key={type.value} value={String(type.value)}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5' />
                  Working Hours
                </CardTitle>
                <CardDescription>
                  Set the vendor's operating hours
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='openingTime'>
                      Opening Time <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='openingTime'
                      type='time'
                      value={formData.openingTime}
                      onChange={(e) =>
                        handleInputChange('openingTime', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='closeTime'>
                      Closing Time <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='closeTime'
                      type='time'
                      value={formData.closeTime}
                      onChange={(e) =>
                        handleInputChange('closeTime', e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {formData.openingTime && formData.closeTime && (
                    <>
                      Vendor will be open from {formData.openingTime} to{' '}
                      {formData.closeTime}
                    </>
                  )}
                </p>
              </CardContent>
            </Card>

            {/* User Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  User Assignment
                </CardTitle>
                <CardDescription>
                  Assign a user to manage this vendor
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='userId'>
                    Select User <span className='text-destructive'>*</span>
                  </Label>
                  <ObjectAutoComplete
                    fetchOptions={async (query) => {
                      const res = await fetchUsers({ searchTerm: query, limit: 10, role: 2 });
                      if (res.error || !res.data) return [];
                      return res.data;
                    }}
                    onSelectOption={(user: any) => {
                      if (user) {
                        setFormData((prev) => ({
                          ...prev,
                          userId: user._id || user.id,
                          userName: `${user.firstName} ${user.lastName}`,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          userId: '',
                          userName: '',
                        }));
                      }
                    }}
                    getOptionLabel={(user: any) =>
                      `${user.firstName} ${user.lastName} (${user.email})`
                    }
                    placeholder='Search for a user by name or email...'
                  />
                  {formData.userName && (
                    <div className='mt-2 p-3 bg-primary/5 border border-primary/20 rounded-md'>
                      <p className='text-sm font-medium text-primary'>
                        Selected User: {formData.userName}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        User ID: {formData.userId}
                      </p>
                    </div>
                  )}
                  <p className='text-xs text-muted-foreground'>
                    Search and select the user who will manage this vendor
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Preview & Actions */}
          <div className='space-y-6'>
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Vendor Name
                  </p>
                  <p className='text-sm font-semibold'>
                    {formData.name || 'Not set'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Type
                  </p>
                  <p className='text-sm'>
                    {vendorTypes.find((t) => t.value === parseInt(formData.type))
                      ?.label || 'Not selected'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Hours
                  </p>
                  <p className='text-sm'>
                    {formData.openingTime && formData.closeTime
                      ? `${formData.openingTime} - ${formData.closeTime}`
                      : 'Not set'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Assigned User
                  </p>
                  <p className='text-sm'>
                    {formData.userName || 'Not assigned'}
                  </p>
                  {formData.userId && (
                    <p className='text-xs font-mono text-muted-foreground'>
                      ID: {formData.userId}
                    </p>
                  )}
                </div>
                {formData.photo && (
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Logo/Image
                    </p>
                    <div className='w-full h-32 rounded-lg bg-muted flex items-center justify-center border overflow-hidden'>
                      <img
                        src={preview}
                        alt='Vendor preview'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className='pt-6 space-y-3'>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Vendor'}
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className='bg-muted/50'>
              <CardContent className='pt-6'>
                <p className='text-sm text-muted-foreground'>
                  <span className='font-medium'>Note:</span> All fields marked
                  with <span className='text-destructive'>*</span> are required.
                  Make sure to provide accurate information for the vendor.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateVendor;
