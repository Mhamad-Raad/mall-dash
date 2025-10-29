import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

import UserDetailHeader from '@/components/Users/UserDetail/UserDetailHeader';
import UserProfileCard from '@/components/Users/UserDetail/UserProfileCard';
import ContactInfoCard from '@/components/Users/UserDetail/ContactInfoCard';
import LocationRoleCard from '@/components/Users/UserDetail/LocationRoleCard';
import UserDetailSkeleton from '@/components/Users/UserDetail/UserDetailSkeloton';
import UserErrorCard from '@/components/Users/UserDetail/UserErrorCard';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchUserById, clearUser } from '@/store/slices/userSlice';

import type { UserType } from '@/interfaces/Users.interface';
import { initialUser } from '@/constants/Users';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get user, loading, and error from Redux store
  const {
    user,
    luser: loading,
    euser: error,
  } = useSelector((state: RootState) => state.user);

  // Local state for editable form data
  const [formData, setFormData] = useState<UserType>(initialUser);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearUser());
    };
  }, [id, dispatch]);

  // Update formData when user data is loaded from Redux
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSave = () => {
    console.log('Saving user data:', formData);
  };

  const hasChanges = useMemo(() => {
    const keys = Object.keys(user) as Array<keyof UserType>;
    return keys.some((key) => user[key] !== formData[key]);
  }, [user, formData]);

  if (error) return <UserErrorCard error={error} />;
  if (loading) return <UserDetailSkeleton />;

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      <UserDetailHeader
        onBack={() => navigate('/users')}
        onSave={handleSave}
        hasChanges={hasChanges}
      />

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
      </div>
    </div>
  );
};

export default UserDetail;
