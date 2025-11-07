import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, Store, Clock, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

const CreateVendor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    openingTime: '',
    closeTime: '',
    type: '1',
    userId: '',
  });

  const vendorTypes = [
    { value: '1', label: 'Restaurant' },
    { value: '2', label: 'Market' },
    { value: '3', label: 'Bakery' },
    { value: '4', label: 'Cafe' },
    { value: '5', label: 'Clothing Store' },
    { value: '6', label: 'Electronics' },
    { value: '7', label: 'Pharmacy' },
    { value: '8', label: 'Other' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter vendor name');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter vendor description');
      return false;
    }
    if (!formData.openingTime) {
      toast.error('Please select opening time');
      return false;
    }
    if (!formData.closeTime) {
      toast.error('Please select closing time');
      return false;
    }
    if (!formData.userId.trim()) {
      toast.error('Please enter user ID');
      return false;
    }

    // Validate time logic
    if (formData.openingTime >= formData.closeTime) {
      toast.error('Closing time must be after opening time');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data to send to API
      const vendorData = {
        name: formData.name,
        description: formData.description,
        openingTime: formData.openingTime,
        closeTime: formData.closeTime,
        type: parseInt(formData.type),
        userId: formData.userId,
      };

      console.log('Submitting vendor data:', vendorData);

      // TODO: Replace with actual API call
      // await createVendor(vendorData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Vendor created successfully!');
      navigate('/vendors');
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast.error('Failed to create vendor. Please try again.');
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
          <h1 className='text-3xl font-bold tracking-tight'>Create New Vendor</h1>
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
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className='resize-none h-24'
                    required
                  />
                  <p className='text-xs text-muted-foreground'>
                    {formData.description.length}/500 characters
                  </p>
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
                        <SelectItem key={type.value} value={type.value}>
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
                      onChange={(e) => handleInputChange('openingTime', e.target.value)}
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
                      onChange={(e) => handleInputChange('closeTime', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {formData.openingTime && formData.closeTime && (
                    <>
                      Vendor will be open from {formData.openingTime} to {formData.closeTime}
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
                    User ID <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='userId'
                    placeholder='Enter user ID'
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    required
                  />
                  <p className='text-xs text-muted-foreground'>
                    The user ID of the person who will manage this vendor
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
                  <p className='text-sm font-medium text-muted-foreground'>Vendor Name</p>
                  <p className='text-sm font-semibold'>
                    {formData.name || 'Not set'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>Type</p>
                  <p className='text-sm'>
                    {vendorTypes.find((t) => t.value === formData.type)?.label || 'Not selected'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>Hours</p>
                  <p className='text-sm'>
                    {formData.openingTime && formData.closeTime
                      ? `${formData.openingTime} - ${formData.closeTime}`
                      : 'Not set'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>User ID</p>
                  <p className='text-xs font-mono'>
                    {formData.userId || 'Not assigned'}
                  </p>
                </div>
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
                  <span className='font-medium'>Note:</span> All fields marked with{' '}
                  <span className='text-destructive'>*</span> are required. Make sure
                  to provide accurate information for the vendor.
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
