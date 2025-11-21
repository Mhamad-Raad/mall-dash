import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import StaffForm from '@/components/Users/forms/StaffForm';
import CustomerForm from '@/components/Users/forms/CustomerForm';

import { createUser } from '@/data/Users';

export default function CreateUser() {
  const { t } = useTranslation('users');
  const navigate = useNavigate();

  const [type, setType] = useState('Staff');
  const [staffFormData, setStaffFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 1,
    photo: null,
  });

  const [customerFormData, setCustomerFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    buildingId: '',
    floorId: '',
    apartmentId: '',
    photo: null,
  });

  const [loading, setLoading] = useState(false);

  // Handler to update staff form data
  const handleStaffInputChange = (field: string, value: unknown) => {
    setStaffFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handler to update customer form data
  const handleCustomerInputChange = (field: string, value: unknown) => {
    setCustomerFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate('/users');
  };

  const handleCreateUser = async () => {
    setLoading(true);

    let data = {};
    let userName = '';

    if (type === 'Staff') {
      const { confirmPassword, photo, ...userData } = staffFormData;

      if (staffFormData.password !== staffFormData.confirmPassword) {
        toast.error(t('createUser.passwordMismatch'), {
          description: t('createUser.passwordMismatchDesc'),
        });
        setLoading(false);
        return;
      }

      userName = `${staffFormData.firstName} ${staffFormData.lastName}`;
      data = {
        ...userData,
        ...(photo ? { ProfileImageUrl: photo } : {}),
      };
    } else if (type === 'Customer') {
      const { confirmPassword, photo, buildingId, floorId, apartmentId, ...userData } = customerFormData;

      if (customerFormData.password !== customerFormData.confirmPassword) {
        toast.error(t('createUser.passwordMismatch'), {
          description: t('createUser.passwordMismatchDesc'),
        });
        setLoading(false);
        return;
      }

      userName = `${customerFormData.firstName} ${customerFormData.lastName}`;
      data = {
        ...userData,
        role: 3, // Tenant role index
        ...(photo ? { ProfileImageUrl: photo } : {}),
        ...(buildingId ? { buildingId: parseInt(buildingId) } : {}),
        ...(floorId ? { floorId: parseInt(floorId) } : {}),
        ...(apartmentId ? { apartmentId: parseInt(apartmentId) } : {}),
      };
    }

    const res = await createUser(data as any);

    setLoading(false);

    if (res.error) {
      toast.error(t('createUser.createError'), {
        description: res.error || t('createUser.createErrorDesc'),
      });
    } else {
      toast.success(t('createUser.createSuccess'), {
        description: t('createUser.createSuccessDesc', { name: userName }),
      });
      navigate('/users');
    }
  };

  return (
    <div className='w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] h-full flex flex-col -m-4 md:-m-6'>
      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24'>
        {/* Header */}
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
                {t('createUser.title')}
              </h1>
              <p className='text-xs sm:text-sm text-muted-foreground'>
                {t('createUser.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='space-y-6'>
          {/* User Type Selection */}
          <UserTypeSelector selectedType={type} onTypeChange={setType} />

          {/* Form Fields */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>{t('createUser.userInformation')}</CardTitle>
              <CardDescription>
                {t('createUser.fillDetails', { type: type.toLowerCase() })}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {type === 'Staff' && (
                <StaffForm
                  formData={staffFormData}
                  onInputChange={handleStaffInputChange}
                />
              )}
              {type === 'Customer' && (
                <CustomerForm
                  formData={customerFormData}
                  onInputChange={handleCustomerInputChange}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Footer with Action Buttons */}
      <div className='sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-4 md:px-6'>
        <div className='flex gap-2 justify-end'>
          <Button variant='outline' onClick={handleBack} className='gap-2'>
            {t('createUser.cancel')}
          </Button>
          <Button
            className='gap-2'
            onClick={handleCreateUser}
            disabled={loading}
          >
            <Save className='size-4' />
            {loading ? t('createUser.creating') : t('createUser.createButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}
