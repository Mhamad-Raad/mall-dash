import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchVendorById,  updateVendor,  clearVendor,  deleteVendor } from '@/store/slices/vendorSlice';
import { vendorTypes } from '@/constants/vendorTypes';
import { convertToUTCFormat } from '@/lib/timeUtils';
import ConfirmModal from '@/components/ui/Modals/ConfirmModal';
import VendorDetailSkeleton from '@/components/Vendors/VendorDetailSkeleton';
import VendorDetailError from '@/components/Vendors/VendorDetailError';
import VendorPhotoUpload from '@/components/Vendors/VendorPhotoUpload';
import VendorBasicInfo from '@/components/Vendors/VendorBasicInfo';
import VendorWorkingHours from '@/components/Vendors/VendorWorkingHours';
import VendorUserAssignment from '@/components/Vendors/VendorUserAssignment';

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
  const [hasFetched, setHasFetched] = useState(false);

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
    if (id && !hasFetched) {
      dispatch(fetchVendorById(id));
      setHasFetched(true);
    }
    return () => {
      dispatch(clearVendor());
    };
  }, [dispatch, id, hasFetched]);

  // Update form data when vendor is loaded
  useEffect(() => {
    if (vendor && !formData.name) {
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

  const handleTimeChange = useCallback((type: 'open' | 'close', time: string) => {
    if (type === 'open') {
      setFormData((prev) => ({ ...prev, openingTime: time }));
    } else {
      setFormData((prev) => ({ ...prev, closeTime: time }));
    }
  }, []);

  const handleUserSelect = useCallback((userId: string, userName: string) => {
    setFormData((prev) => ({ ...prev, userId, userName }));
  }, []);

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
            <VendorPhotoUpload
              preview={preview}
              onPhotoChange={handlePhotoChange}
              onPhotoRemove={handlePhotoRemove}
              disabled={updating}
            />
            <VendorBasicInfo
              name={formData.name}
              description={formData.description}
              type={formData.type}
              vendorId={vendor._id}
              onInputChange={handleInputChange}
              disabled={updating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Working Hours Card */}
      <VendorWorkingHours
        openingTime={formData.openingTime}
        closeTime={formData.closeTime}
        onInputChange={handleInputChange}
        onTimeChange={handleTimeChange}
        disabled={updating}
      />

      {/* User Assignment */}
      <VendorUserAssignment
        userId={formData.userId}
        userName={formData.userName}
        vendorEmail={vendor?.email}
        vendorPhone={vendor?.phoneNumber}
        onUserSelect={handleUserSelect}
      />
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
