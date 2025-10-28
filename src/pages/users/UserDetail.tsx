import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

// Import users data - In production, this would come from an API/context

// Import UserDetail components
import UserDetailHeader from '@/components/Users/UserDetail/UserDetailHeader';
import UserProfileCard from '@/components/Users/UserDetail/UserProfileCard';
import ContactInfoCard from '@/components/Users/UserDetail/ContactInfoCard';
import LocationRoleCard from '@/components/Users/UserDetail/LocationRoleCard';
import AccountDetailsCard from '@/components/Users/UserDetail/AccountDetailsCard';

import UserDetailSkeleton from '@/components/Users/UserDetail/UserDetailSkeloton';

import { fetchUserById } from '@/data/Users';

import type { UserType } from '@/interfaces/Users.interface';

import { initialUser } from '@/constants/Users';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // State for editable fields
  const [formData, setFormData] = useState<UserType>(initialUser);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      if (!id) return;

      const data = await fetchUserById(id);
      if (data.error) {
        setError(data.error);
      } else {
        setUser(data);
        setFormData(data);
      }
      setLoading(false);
    };

    getUser();
  }, []);

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
          <CardDescription>
            The user you're looking for doesn't exist.
          </CardDescription>
        </Card>
      </div>
    );
  }

  if (loading) return <UserDetailSkeleton />;

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      <UserDetailHeader onBack={() => navigate('/users')} onSave={handleSave} />

      <UserProfileCard formData={formData} onInputChange={handleInputChange} />

      {/* Information Grid */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <ContactInfoCard
          formData={formData}
          onInputChange={handleInputChange}
        />

        <LocationRoleCard
          formData={formData as any}
          onInputChange={handleInputChange}
        />

        <AccountDetailsCard />
      </div>
    </div>
  );
};

export default UserDetail;
