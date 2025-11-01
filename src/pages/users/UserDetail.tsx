import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import UserDetailHeader from '@/components/Users/UserDetail/UserDetailHeader';
import UserProfileCard from '@/components/Users/UserDetail/UserProfileCard';
import ContactInfoCard from '@/components/Users/UserDetail/ContactInfoCard';
import LocationRoleCard from '@/components/Users/UserDetail/LocationRoleCard';
import UserDetailSkeleton from '@/components/Users/UserDetail/UserDetailSkeloton';
import UserErrorCard from '@/components/Users/UserDetail/UserErrorCard';
import ConfirmModal, { type ChangeDetail } from '@/components/ui/Modals/ConfirmModal';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import {
  fetchUserById,
  clearUser,
  updateUser,
  deleteUser,
} from '@/store/slices/userSlice';

import type { UserType } from '@/interfaces/Users.interface';
import { initialUser } from '@/constants/Users';
import roles from '@/constants/roles';

import { toast } from 'sonner';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Get user, loading, error, updating/deleting states from Redux store
  const {
    user,
    luser: loading,
    euser: error,
    updating,
    updatingError,
    deleting,
    deletingError,
  } = useSelector((state: RootState) => state.user);

  // Local state for editable form data
  const [formData, setFormData] = useState<UserType>(initialUser);

  // Compare local form data with redux user
  const hasChanges = useMemo(() => {
    const keys = Object.keys(user) as Array<keyof UserType>;
    return keys.some((key) => user[key] !== formData[key]);
  }, [user, formData]);

  // Calculate the specific changes for display in modal
  const changes = useMemo((): ChangeDetail[] => {
    // Safety check - only calculate if user is loaded
    if (!user || !user._id) return [];
    
    const changesList: ChangeDetail[] = [];
    
    const fieldLabels: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      role: 'Role',
    };

    // Check each editable field
    (['firstName', 'lastName', 'email', 'phoneNumber', 'role'] as const).forEach((key) => {
      if (user[key] !== formData[key]) {
        let oldVal = user[key];
        let newVal = formData[key];

        // Format role as label
        if (key === 'role' && typeof oldVal === 'number' && typeof newVal === 'number') {
          oldVal = roles[oldVal] || `Role ${oldVal}`;
          newVal = roles[newVal] || `Role ${newVal}`;
        }

        changesList.push({
          field: fieldLabels[key],
          oldValue: String(oldVal ?? ''),
          newValue: String(newVal ?? ''),
        });
      }
    });

    return changesList;
  }, [user, formData]);

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

  // Sync local form data with loaded user
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        buildingName: user.buildingName ?? '',
      });
    }
  }, [user]);

  // Listen for update/delete outcomes & show notifications
  useEffect(() => {
    if (updatingError) {
      toast.error(updatingError);
      setShowUpdateModal(false); // Close modal even on error
    }
    if (!updating && showUpdateModal && !updatingError) {
      // If updating goes from true to false and there was no error
      setShowUpdateModal(false);
      toast.success('User updated successfully!');
    }
  }, [updating, updatingError]);

  useEffect(() => {
    if (deletingError) {
      toast.error(deletingError);
    }
    if (!deleting && showDeleteModal && !deletingError) {
      setShowDeleteModal(false);
      toast.success('User deleted!');
      navigate('/users');
    }
  }, [deleting, deletingError, navigate]);

  // Modal togglers
  const handletoggleUpdateModal = () => setShowUpdateModal((v) => !v);
  const handletoggleDeleteModal = () => setShowDeleteModal((v) => !v);

  // Handlers for modal confirm
  const handleUpdateUser = async () => {
    // Cleaned payload to avoid undefined
    const { _id, ...payload } = formData;
    await dispatch(
      updateUser({
        id: id || user._id,
        update: {
          firstName: payload.firstName ?? '',
          lastName: payload.lastName ?? '',
          email: payload.email ?? '',
          phoneNumber: payload.phoneNumber ?? '',
          role: payload.role ?? null,
        },
      })
    );
    // Notification handled by useEffect above
  };

  const handleDeleteUser = async () => {
    await dispatch(deleteUser(id || user._id));
    // Notification handled by useEffect above
  };

  if (error) return <UserErrorCard error={error} />;
  if (loading) return <UserDetailSkeleton />;

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      <UserDetailHeader
        onBack={() => navigate(-1)}
        onSave={handletoggleUpdateModal}
        onDelete={handletoggleDeleteModal}
        hasChanges={hasChanges}
      />
      <UserProfileCard formData={formData} onInputChange={handleInputChange} />
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
      <ConfirmModal
        open={showUpdateModal}
        title='Update User'
        description='Are you sure you want to update this user?'
        userName={`${user.firstName} ${user.lastName}`}
        confirmType='warning'
        confirmLabel='Update'
        cancelLabel='Cancel'
        onCancel={handletoggleUpdateModal}
        onConfirm={handleUpdateUser}
        changes={changes}
      />
      <ConfirmModal
        open={showDeleteModal}
        title='Delete User'
        description='Are you sure you want to delete this user?'
        userName={`${user.firstName} ${user.lastName}`}
        warning='WARNING! This action cannot be undone.'
        confirmType='danger'
        confirmLabel='Delete'
        cancelLabel='Cancel'
        onCancel={handletoggleDeleteModal}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UserDetail;
