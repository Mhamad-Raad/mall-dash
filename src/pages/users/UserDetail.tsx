import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

// Import users data - In production, this would come from an API/context
import { usersData } from './Users';

// Import UserDetail components
import UserDetailHeader from '@/components/Users/UserDetail/UserDetailHeader';
import UserProfileCard from '@/components/Users/UserDetail/UserProfileCard';
import ContactInfoCard from '@/components/Users/UserDetail/ContactInfoCard';
import LocationRoleCard from '@/components/Users/UserDetail/LocationRoleCard';
import AccountDetailsCard from '@/components/Users/UserDetail/AccountDetailsCard';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the user by ID
  const user = usersData.find((u) => u.id === id);

  // State for editable fields
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    buildingName: user?.buildingName || '',
    type: user?.type || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In production, this would call an API to update the user
    console.log('Saving user data:', formData);
    // Add your save logic here
  };

  // If user not found, show error state
  if (!user) {
    return (
      <div className='flex flex-col gap-6 p-4 md:p-6'>
        <Button
          variant='ghost'
          className='mb-6'
          onClick={() => navigate('/users')}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Users
        </Button>
        <Card className='p-12 text-center'>
          <CardTitle className='text-2xl mb-2'>User Not Found</CardTitle>
          <CardDescription>The user you're looking for doesn't exist.</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      <UserDetailHeader onBack={() => navigate('/users')} onSave={handleSave} />

      <UserProfileCard user={user} formData={formData} onInputChange={handleInputChange} />

      {/* Information Grid */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <ContactInfoCard formData={formData} onInputChange={handleInputChange} />

        <LocationRoleCard formData={formData} onInputChange={handleInputChange} />

        <AccountDetailsCard />
      </div>
    </div>
  );
};

export default UserDetail;
