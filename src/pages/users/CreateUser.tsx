import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, ArrowLeft, Save } from 'lucide-react';
import UserTypeSelector from '@/components/Users/UserTypeSelector';
import AdminForm from '@/components/Users/forms/AdminForm';
import CustomerForm from '@/components/Users/forms/CustomerForm';
import VendorForm from '@/components/Users/forms/VendorForm';

import { createUser } from '@/data/Users';

export default function CreateUser() {
  const navigate = useNavigate();

  const [type, setType] = useState('Customer');
  const [adminFormData, setAdminFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 1,
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  // Handler to update form data from child
  const handleAdminInputChange = (field: string, value: unknown) => {
    setAdminFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate('/users');
  };

  const handleCreateUser = async () => {
    setLoading(true);

    let data = {};
    if (type === 'Admin') {
      const { confirmPassword, photo, ...userData } = adminFormData;
      if (adminFormData.password !== adminFormData.confirmPassword) {
        toast.error('Passwords do not match', {
          description: 'Please make sure both password fields are identical.',
        });
        setLoading(false);
        return;
      }

      // Include ProfileImageUrl if photo is provided
      data = {
        ...userData,
        ...(photo ? { ProfileImageUrl: photo } : {}),
      };
    } else {
      toast.warning('Feature Not Available', {
        description: 'Only Admin user creation is currently implemented.',
      });
      setLoading(false);
      return;
    }

    const res = await createUser(data as any);

    setLoading(false);

    if (res.error) {
      toast.error('Failed to Create User', {
        description: res.error || 'An error occurred while creating the user.',
      });
    } else {
      toast.success('User Created Successfully!', {
        description: `${adminFormData.firstName} ${adminFormData.lastName} has been added to the system.`,
      });
      navigate('/users');
    }
  };

  return (
    <div className='w-full p-4 md:p-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-3 sm:gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={handleBack}
            className='h-10 w-10 shrink-0'
          >
            <ArrowLeft className='size-4' />
          </Button>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='p-2 rounded-lg bg-primary/10 text-primary shrink-0'>
              <UserPlus className='size-5' />
            </div>
            <div className='min-w-0'>
              <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>
                Create New User
              </h1>
              <p className='text-xs sm:text-sm text-muted-foreground'>
                Add a new user to the system
              </p>
            </div>
          </div>
        </div>
        <div className='flex gap-2 self-end sm:self-auto'>
          <Button variant='outline' onClick={handleBack} className='gap-2'>
            <span className='hidden sm:inline'>Cancel</span>
            <span className='sm:hidden'>Cancel</span>
          </Button>
          <Button
            className='gap-2'
            onClick={handleCreateUser}
            disabled={loading}
          >
            <Save className='size-4' />
            {loading ? (
              <span>Creating...</span>
            ) : (
              <span className='hidden sm:inline'>Create User</span>
            )}
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div className='space-y-6'>
        {/* User Type Selection */}
        <UserTypeSelector selectedType={type} onTypeChange={setType} />

        {/* Form Fields */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>User Information</CardTitle>
            <CardDescription>
              Fill in the details for the new {type.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {type === 'Admin' && (
              <AdminForm
                formData={adminFormData}
                onInputChange={handleAdminInputChange}
              />
            )}
            {type === 'Customer' && <CustomerForm />}
            {type === 'Vendor' && <VendorForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
