import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, ArrowLeft, Save } from 'lucide-react';
import UserTypeSelector from '@/components/Users/UserTypeSelector';
import AdminForm from '@/components/Users/forms/AdminForm';
import CustomerForm from '@/components/Users/forms/CustomerForm';
import VendorForm from '@/components/Users/forms/VendorForm';

export default function CreateUser() {
  const [type, setType] = React.useState('Customer');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/users');
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
              <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>Create New User</h1>
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
          <Button className='gap-2'>
            <Save className='size-4' />
            <span className='hidden sm:inline'>Save User</span>
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
            {type === 'Admin' && <AdminForm />}
            {type === 'Customer' && <CustomerForm />}
            {type === 'Vendor' && <VendorForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
