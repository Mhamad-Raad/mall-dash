import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Save,
  Trash2,
  Clock,
  User,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { toast } from 'sonner';
import type { AppDispatch, RootState } from '@/store/store';
import {
  fetchVendorById,
  updateVendor,
  clearVendor,
} from '@/store/slices/vendorSlice';
import { vendorTypes } from '@/constants/vendorTypes';
import { convertToUTCFormat } from '@/lib/timeUtils';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchUsers } from '@/data/Users';

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { vendor, loading, error, updating, updateError } = useSelector(
    (state: RootState) => state.vendor
  );

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
  const [preview, setPreview] = useState<string>('');

  // Fetch vendor on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchVendorById(id));
    }
    return () => {
      dispatch(clearVendor());
    };
  }, [dispatch, id]);

  // Update form data when vendor is loaded
  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.businessName,
        description: vendor.description || '',
        openingTime: vendor.workingHours.open,
        closeTime: vendor.workingHours.close,
        type: String(
          vendorTypes.find((t) => t.label === vendor.type)?.value || '1'
        ),
        userId: vendor.userId || '',
        userName: vendor.ownerName || '',
        photo: null,
      });
      if (vendor.logo) {
        setPreview(vendor.logo);
      }
    }
  }, [vendor]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error('Failed to Load Vendor', {
        description: error,
      });
    }
  }, [error]);

  // Show update error toast
  useEffect(() => {
    if (updateError) {
      toast.error('Failed to Update Vendor', {
        description: updateError,
      });
    }
  }, [updateError]);

  // Handle photo preview
  useEffect(() => {
    if (formData.photo instanceof File) {
      const url = URL.createObjectURL(formData.photo);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
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
    if (vendor?.logo) {
      setPreview(vendor.logo);
    } else {
      setPreview('');
    }
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!id) {
      toast.error('Error', { description: 'Vendor ID is missing' });
      return;
    }

    // Only include ProfileImageUrl if a new photo was selected
    const vendorData: any = {
      name: formData.name,
      description: formData.description,
      openingTime: convertToUTCFormat(formData.openingTime),
      closeTime: convertToUTCFormat(formData.closeTime),
      type: parseInt(formData.type),
      userId: formData.userId,
    };

    // Only add ProfileImageUrl if user selected a new image file
    if (formData.photo instanceof File) {
      console.log('Adding new photo to vendorData');
      vendorData.ProfileImageUrl = formData.photo;
    } else {
      console.log('No new photo selected, sending JSON only');
    }

    console.log('vendorData being sent:', {
      ...vendorData,
      ProfileImageUrl: vendorData.ProfileImageUrl ? 'File object' : 'undefined'
    });

    const result = await dispatch(updateVendor({ id, vendorData }));

    if (updateVendor.fulfilled.match(result)) {
      toast.success('Vendor Updated Successfully!', {
        description: `${formData.name} has been updated.`,
      });
      navigate('/vendors');
    }
  };

  const handleDelete = () => {
    // TODO: Implement API call to delete vendor
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      console.log('Deleting vendor:', id);
      navigate('/vendors');
    }
  };

  console.log(vendor);

  if (loading) {
    return (
      <div className='flex flex-col gap-6 p-4 md:p-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' onClick={() => navigate(-1)}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Vendors
          </Button>
        </div>
        <div className='flex items-center justify-center h-64'>
          <p className='text-muted-foreground'>Loading vendor...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className='flex flex-col gap-6 p-4 md:p-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' onClick={() => navigate(-1)}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Vendors
          </Button>
        </div>
        <div className='flex items-center justify-center h-64'>
          <p className='text-muted-foreground'>{error || 'Vendor not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <Button variant='ghost' onClick={() => navigate(-1)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Vendors
        </Button>
        <div className='flex gap-2'>
          <Button onClick={handleSave} disabled={updating}>
            <Save className='mr-2 h-4 w-4' />
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={updating}
          >
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
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className='text-2xl font-bold h-auto py-2 mb-2'
                />
                <div className='flex items-center gap-2 mt-2'>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorTypes.map((type) => (
                        <SelectItem key={type.value} value={String(type.value)}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className='text-sm text-muted-foreground'>
                    ID: {vendor._id}
                  </span>
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
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='vendor-photo' className='flex items-center gap-2'>
              <ImageIcon className='size-4 text-muted-foreground' />
              Vendor Logo/Image
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
                  disabled={updating}
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
                      disabled={updating}
                    >
                      <X className='size-4' />
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
              <Label htmlFor='openingTime'>Opening Time</Label>
              <Input
                id='openingTime'
                type='time'
                value={formData.openingTime}
                onChange={(e) =>
                  handleInputChange('openingTime', e.target.value)
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='closeTime'>Closing Time</Label>
              <Input
                id='closeTime'
                type='time'
                value={formData.closeTime}
                onChange={(e) => handleInputChange('closeTime', e.target.value)}
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
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='userId'>
              Select User <span className='text-destructive'>*</span>
            </Label>
            <ObjectAutoComplete
              fetchOptions={async (query) => {
                const res = await fetchUsers({
                  searchTerm: query,
                  limit: 10,
                  role: 2,
                });
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
                {vendor?.email && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    Email: {vendor.email}
                  </p>
                )}
                {vendor?.phoneNumber && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    Phone: {vendor.phoneNumber}
                  </p>
                )}
              </div>
            )}
            <p className='text-xs text-muted-foreground'>
              Search and select the user who will manage this vendor
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDetail;
