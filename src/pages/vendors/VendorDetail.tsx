import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Clock,
  User,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  deleteVendor,
} from '@/store/slices/vendorSlice';
import { vendorTypes } from '@/constants/vendorTypes';
import { convertToUTCFormat } from '@/lib/timeUtils';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchUsers } from '@/data/Users';
import ConfirmModal from '@/components/ui/Modals/ConfirmModal';
import VendorDetailSkeleton from '@/components/Vendors/VendorDetailSkeleton';
import VendorDetailError from '@/components/Vendors/VendorDetailError';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDraggingOpen, setIsDraggingOpen] = useState(false);
  const [isDraggingClose, setIsDraggingClose] = useState(false);

  // Track if any changes have been made
  const hasChanges = useMemo(() => {
    if (!vendor) return false;

    // Check if photo was added
    if (formData.photo instanceof File) return true;

    // Check if photo was removed
    if (vendor.logo && !preview) return true;

    // Check other fields for changes
    return (
      vendor.businessName !== formData.name ||
      vendor.description !== (formData.description || '') ||
      vendor.workingHours.open !== formData.openingTime ||
      vendor.workingHours.close !== formData.closeTime ||
      String(vendorTypes.find((t) => t.label === vendor.type)?.value || '1') !== formData.type ||
      (vendor.userId || '') !== formData.userId
    );
  }, [vendor, formData, preview]);

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
    setPreview('');
    // Reset the file input
    const fileInput = document.getElementById('vendor-photo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleTimeSliderDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    type: 'open' | 'close'
  ) => {
    const timeline = e.currentTarget.parentElement;
    if (!timeline) return;

    const updateTime = (clientX: number) => {
      const rect = timeline.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const totalMinutes = Math.round(percent * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      if (type === 'open') {
        setIsDraggingOpen(true);
        setFormData((prev) => ({ ...prev, openingTime: timeString }));
      } else {
        setIsDraggingClose(true);
        setFormData((prev) => ({ ...prev, closeTime: timeString }));
      }
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateTime(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      setIsDraggingOpen(false);
      setIsDraggingClose(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    updateTime(e.clientX);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
      ProfileImageUrl: vendorData.ProfileImageUrl ? 'File object' : 'undefined',
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
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    navigate('/vendors');
    if (id) {
      await dispatch(deleteVendor(id));
      toast.success('Vendor Deleted', {
        description: 'The vendor has been successfully deleted.',
      });
    }
  };

  console.log(vendor);

  if (loading) {
    return <VendorDetailSkeleton />;
  }

  if (error || !vendor) {
    return <VendorDetailError error={error || undefined} onBack={() => navigate(-1)} />;
  }

  return (
    <div className='w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] h-full flex flex-col -m-4 md:-m-6'>
      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24'>
        {/* Header */}
        <div>
          <Button variant='ghost' onClick={() => navigate(-1)}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Vendors
          </Button>
        </div>

      {/* Vendor Information Card */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row gap-6'>
            {/* Square Image Section */}
            <div className='flex-shrink-0'>
              <div className='relative w-full md:w-56 aspect-square'>
                <input
                  id='vendor-photo'
                  type='file'
                  accept='image/*'
                  onChange={handlePhotoChange}
                  disabled={updating}
                  className='hidden'
                />
                <label
                  htmlFor='vendor-photo'
                  className='w-full h-full rounded-lg bg-background flex items-center justify-center border-2 border-dashed border-muted-foreground/25 overflow-hidden cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all group'
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt='Vendor logo'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='flex flex-col items-center gap-3 text-muted-foreground'>
                      <ImageIcon className='h-20 w-20 group-hover:text-primary/70 transition-colors' />
                      <div className='text-center'>
                        <p className='text-sm font-medium'>Upload Image</p>
                        <p className='text-xs mt-1'>Click to browse</p>
                      </div>
                    </div>
                  )}
                </label>
                {preview && (
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      handlePhotoRemove();
                    }}
                    disabled={updating}
                    className='absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg z-10 disabled:opacity-50'
                  >
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            </div>

            {/* Vendor Details Section */}
            <div className='flex-1 space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>
                  Business Name <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder='Enter business name'
                  disabled={updating}
                  className='text-lg font-semibold'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='type'>
                  Business Type <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                  disabled={updating}
                >
                  <SelectTrigger>
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
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>
                  Description <span className='text-destructive'>*</span>
                </Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  placeholder='Describe your business...'
                  disabled={updating}
                />
              </div>

              <div className='pt-2'>
                <span className='text-xs text-muted-foreground'>
                  ID: {vendor._id}
                </span>
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
        <CardContent className='space-y-6'>
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
                  onChange={(e) =>
                    handleInputChange('openingTime', e.target.value)
                  }
                  disabled={updating}
                  className='pl-10 h-11 text-base'
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
                  disabled={updating}
                  className='pl-10 h-11 text-base'
                />
                <Clock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
              </div>
            </div>
          </div>

          {/* Visual Schedule Display */}
          {formData.openingTime && formData.closeTime && (
            <div className='p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20'>
              <div className='flex items-center justify-between mb-3'>
                <p className='text-sm font-semibold text-primary'>Business Schedule</p>
                {(() => {
                  const [openHour, openMin] = formData.openingTime.split(':').map(Number);
                  const [closeHour, closeMin] = formData.closeTime.split(':').map(Number);
                  const totalMinutes = (closeHour * 60 + closeMin) - (openHour * 60 + openMin);
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;
                  return totalMinutes > 0 ? (
                    <span className='text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded'>
                      {hours}h {minutes > 0 ? `${minutes}m` : ''} open
                    </span>
                  ) : null;
                })()}
              </div>

              {/* 24-hour timeline */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-xs text-muted-foreground mb-1 px-1'>
                  <span className='font-medium'>12 AM</span>
                  <span>6 AM</span>
                  <span className='font-medium'>12 PM</span>
                  <span>6 PM</span>
                  <span className='font-medium'>11 PM</span>
                </div>
                <div className='relative h-10 bg-muted/50 rounded-full shadow-inner' style={{ overflow: 'visible' }}>
                  {/* Hour markers background */}
                  <div className='absolute inset-0 flex overflow-hidden rounded-full'>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className='flex-1 border-r border-muted-foreground/5 last:border-r-0'
                      />
                    ))}
                  </div>
                  
                  {(() => {
                    const [openHour, openMin] = formData.openingTime.split(':').map(Number);
                    const [closeHour, closeMin] = formData.closeTime.split(':').map(Number);
                    const openPercent = ((openHour * 60 + openMin) / (24 * 60)) * 100;
                    const closePercent = ((closeHour * 60 + closeMin) / (24 * 60)) * 100;
                    const width = closePercent - openPercent;
                    
                    return width > 0 ? (
                      <>
                        {/* Active hours bar with gradient and animation */}
                        <div 
                          className='absolute h-full transition-all duration-500 ease-in-out shadow-lg rounded-full overflow-hidden'
                          style={{ 
                            left: `${openPercent}%`, 
                            width: `${width}%`,
                            opacity: 0.85,
                            background: (() => {
                              const [openHour] = formData.openingTime.split(':').map(Number);
                              const [closeHour] = formData.closeTime.split(':').map(Number);
                              
                              // Get color based on hour of day
                              const getColorForHour = (hour: number) => {
                                if (hour >= 5 && hour < 12) return '#fbbf24'; // Morning: golden yellow
                                if (hour >= 12 && hour < 17) return '#60a5fa'; // Afternoon: bright blue
                                if (hour >= 17 && hour < 20) return '#f97316'; // Evening: orange
                                return '#6366f1'; // Night: indigo
                              };
                              
                              const startColor = getColorForHour(openHour);
                              const endColor = getColorForHour(closeHour);
                              
                              return `linear-gradient(to right, ${startColor}, ${endColor})`;
                            })()
                          }}
                        >
                          {/* Shimmer effect */}
                          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer' 
                               style={{
                                 backgroundSize: '200% 100%',
                                 animation: 'shimmer 3s infinite'
                               }}
                          />
                        </div>
                        
                        {/* Opening marker with pulse */}
                        <div 
                          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group select-none ${isDraggingOpen ? 'cursor-grabbing' : 'cursor-grab'}`}
                          style={{ left: `${openPercent}%`, zIndex: 100 }}
                          onMouseDown={(e) => handleTimeSliderDrag(e, 'open')}
                        >
                          <div className='relative'>
                            <div className={`w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg transition-transform ${isDraggingOpen ? 'scale-125' : 'group-hover:scale-125'}`} />
                            {!isDraggingOpen && (
                              <div className='absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75' />
                            )}
                          </div>
                          <div className='absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200'>
                            <div className='bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap'>
                              {isDraggingOpen ? formData.openingTime : 'Drag to adjust'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Closing marker with pulse */}
                        <div 
                          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group select-none ${isDraggingClose ? 'cursor-grabbing' : 'cursor-grab'}`}
                          style={{ left: `${closePercent}%`, zIndex: 100 }}
                          onMouseDown={(e) => handleTimeSliderDrag(e, 'close')}
                        >
                          <div className='relative'>
                            <div className={`w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg transition-transform ${isDraggingClose ? 'scale-125' : 'group-hover:scale-125'}`} />
                            {!isDraggingClose && (
                              <div className='absolute inset-0 w-4 h-4 bg-orange-500 rounded-full animate-ping opacity-75' />
                            )}
                          </div>
                          <div className='absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200'>
                            <div className='bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap'>
                              {isDraggingClose ? formData.closeTime : 'Drag to adjust'}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
                
                {/* Time labels with enhanced styling */}
                <div className='flex items-center justify-between text-xs pt-1'>
                  <div className='flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800'>
                    <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
                    <span className='font-semibold text-emerald-700 dark:text-emerald-400'>{formData.openingTime}</span>
                    <span className='text-emerald-600 dark:text-emerald-500 text-[10px]'>OPEN</span>
                  </div>
                  <div className='flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800'>
                    <span className='text-orange-600 dark:text-orange-500 text-[10px]'>CLOSE</span>
                    <span className='font-semibold text-orange-700 dark:text-orange-400'>{formData.closeTime}</span>
                    <div className='w-2 h-2 rounded-full bg-orange-500 animate-pulse'></div>
                  </div>
                </div>
              </div>
              
              {/* Additional info */}
              <div className='mt-3 pt-3 border-t border-primary/20'>
                <p className='text-xs text-muted-foreground'>
                  {(() => {
                    const [openHour] = formData.openingTime.split(':').map(Number);
                    const [closeHour] = formData.closeTime.split(':').map(Number);
                    
                    if (openHour < 12 && closeHour <= 14) return '🌅 Morning hours';
                    if (openHour < 12 && closeHour >= 17) return '☀️ All day service';
                    if (openHour >= 17) return '🌙 Evening/night hours';
                    if (openHour >= 12 && closeHour < 17) return '🌤️ Afternoon hours';
                    return '📅 Custom schedule';
                  })()}
                </p>
              </div>
            </div>
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
              initialValue={formData.userName}
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

      {/* Sticky Footer with Action Buttons */}
      <div className='sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 md:px-6'>
        <div className='flex gap-2 justify-end'>
          <button
            onClick={handleDelete}
            className='px-4 py-2 rounded-md border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors'
          >
            Delete Vendor
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || updating}
            className='px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title='Delete Vendor'
        description='Are you sure you want to permanently delete this vendor?'
        confirmLabel='Delete'
        confirmType='danger'
        cancelLabel='Cancel'
        warning='This action cannot be undone.'
        changes={[
          {
            field: 'Vendor Name',
            oldValue: vendor?.businessName || '',
            newValue: 'Will be deleted',
          },
        ]}
      />
    </div>
  );
};

export default VendorDetail;
