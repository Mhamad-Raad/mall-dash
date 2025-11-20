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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Store, Clock, User, FileText, UserCheck, Mail, Phone, CheckCircle2, Building2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import TimelineSlider from '@/components/Vendors/TimelineSlider';
import type { UserType } from '@/interfaces/Users.interface';
import VendorPhotoUpload from '@/components/Vendors/VendorPhotoUpload';
import VendorBasicInfo from '@/components/Vendors/VendorBasicInfo';

import { vendorTypes } from '@/constants/vendorTypes';
import { createVendor } from '@/data/Vendor';
import { fetchUsers } from '@/data/Users';
import { convertToUTCFormat } from '@/lib/timeUtils';

const CreateVendor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    openingTime: '09:00',
    closeTime: '17:00',
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

  const getRoleBadge = (role: number) => {
    switch (role) {
      case 0:
        return <Badge variant="destructive" className="text-xs"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      case 1:
        return <Badge variant="secondary" className="text-xs"><UserCheck className="w-3 h-3 mr-1" />Manager</Badge>;
      case 2:
        return <Badge variant="outline" className="text-xs"><User className="w-3 h-3 mr-1" />Vendor</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">User</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeChange = (type: 'open' | 'close', time: string) => {
    setFormData((prev) => ({
      ...prev,
      [type === 'open' ? 'openingTime' : 'closeTime']: time,
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
              <CardContent className='p-6'>
                <div className='flex flex-col md:flex-row gap-6'>
                  <VendorPhotoUpload
                    preview={preview}
                    onPhotoChange={handlePhotoChange}
                    onPhotoRemove={handlePhotoRemove}
                    disabled={isSubmitting}
                  />
                  <VendorBasicInfo
                    name={formData.name}
                    description={formData.description}
                    type={formData.type}
                    vendorId=""
                    onInputChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5 text-primary' />
                  <div>
                    <div className="text-lg font-semibold">Working Hours</div>
                    <div className="text-xs font-normal text-muted-foreground">Set the vendor's operating hours</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6 pt-6'>
                {/* Time Inputs with Icons */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='openingTime' className='text-sm font-medium'>
                      Opening Time <span className='text-destructive'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='openingTime'
                        type='time'
                        value={formData.openingTime}
                        onChange={(e) => handleInputChange('openingTime', e.target.value)}
                        disabled={isSubmitting}
                        className='pl-10 h-11 text-base'
                        required
                      />
                      <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='closeTime' className='text-sm font-medium'>
                      Closing Time <span className='text-destructive'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='closeTime'
                        type='time'
                        value={formData.closeTime}
                        onChange={(e) => handleInputChange('closeTime', e.target.value)}
                        disabled={isSubmitting}
                        className='pl-10 h-11 text-base'
                        required
                      />
                      <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                    </div>
                  </div>
                </div>

                {/* Visual Schedule Display */}
                {formData.openingTime && formData.closeTime && (
                  <TimelineSlider
                    openingTime={formData.openingTime}
                    closeTime={formData.closeTime}
                    onTimeChange={handleTimeChange}
                    disabled={isSubmitting}
                  />
                )}

                {/* Validation message */}
                {formData.openingTime && formData.closeTime && formData.openingTime >= formData.closeTime && (
                  <div className='p-3 rounded-lg bg-destructive/10 border border-destructive/20'>
                    <p className='text-sm text-destructive font-medium'>
                      ⚠️ Closing time must be after opening time
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Assignment */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className='flex items-center gap-2'>
                  <UserCheck className='h-5 w-5 text-primary' />
                  <div>
                    <div className="text-lg font-semibold">User Assignment</div>
                    <div className="text-xs font-normal text-muted-foreground">Assign a manager to this vendor</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 pt-6'>
                <div className='space-y-3'>
                  <Label htmlFor='userId' className="text-sm font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Select Vendor Manager
                    <span className='text-destructive'>*</span>
                  </Label>
                  <ObjectAutoComplete
                    fetchOptions={async (query) => {
                      const res = await fetchUsers({ searchTerm: query, limit: 10, role: 2 });
                      if (res.error || !res.data) return [];
                      return res.data;
                    }}
                    onSelectOption={(user: UserType | null) => {
                      if (user) {
                        setSelectedUser(user);
                        setFormData((prev) => ({
                          ...prev,
                          userId: user._id,
                          userName: `${user.firstName} ${user.lastName}`,
                        }));
                      } else {
                        setSelectedUser(null);
                        setFormData((prev) => ({
                          ...prev,
                          userId: '',
                          userName: '',
                        }));
                      }
                    }}
                    getOptionLabel={(user: UserType) =>
                      `${user.firstName} ${user.lastName} (${user.email})`
                    }
                    placeholder='🔍 Search by name or email...'
                  />
                  
                  {/* Enhanced User Display Card */}
                  {formData.userName && (
                    <div className='mt-4 p-4 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm space-y-4'>
                      {/* User Header with Avatar */}
                      <div className='flex items-start gap-4'>
                        <Avatar className='h-16 w-16 border-2 border-white dark:border-gray-800 shadow-md'>
                          <AvatarImage src={selectedUser?.profileImageUrl} alt={formData.userName} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-bold text-lg">
                            {selectedUser ? getInitials(selectedUser.firstName, selectedUser.lastName) : formData.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className='flex-1 space-y-2'>
                          <div className='flex items-start justify-between'>
                            <div>
                              <h4 className='font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                                {formData.userName}
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              </h4>
                              <p className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
                                ID: {formData.userId}
                              </p>
                            </div>
                            {selectedUser && getRoleBadge(selectedUser.role)}
                          </div>
                          
                          {/* Contact Info Grid */}
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3'>
                            {selectedUser?.email && (
                              <div className='flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-md border border-gray-200 dark:border-gray-700'>
                                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className='text-xs text-gray-500 dark:text-gray-400'>Email</p>
                                  <p className='text-xs font-medium text-gray-900 dark:text-gray-100 truncate'>
                                    {selectedUser.email}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {selectedUser?.phoneNumber && (
                              <div className='flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-md border border-gray-200 dark:border-gray-700'>
                                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className='text-xs text-gray-500 dark:text-gray-400'>Phone</p>
                                  <p className='text-xs font-medium text-gray-900 dark:text-gray-100 truncate'>
                                    {selectedUser.phoneNumber}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {selectedUser?.buildingName && (
                              <div className='flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-md border border-gray-200 dark:border-gray-700 md:col-span-2'>
                                <Building2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className='text-xs text-gray-500 dark:text-gray-400'>Building</p>
                                  <p className='text-xs font-medium text-gray-900 dark:text-gray-100 truncate'>
                                    {selectedUser.buildingName}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className='flex gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-800'>
                        {selectedUser?.email && (
                          <a
                            href={`mailto:${selectedUser.email}`}
                            className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors'
                          >
                            <Mail className="w-3 h-3" />
                            Send Email
                          </a>
                        )}
                        {selectedUser?.phoneNumber && (
                          <a
                            href={`tel:${selectedUser.phoneNumber}`}
                            className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors'
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </a>
                        )}
                      </div>
                    </div>
                  )}
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
