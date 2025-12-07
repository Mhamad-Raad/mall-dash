import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import type { RootState, AppDispatch } from '@/store/store';
import { updateUser } from '@/data/Users';
import { fetchMe } from '@/store/slices/meSlice';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: me } = useSelector((state: RootState) => state.me);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (me) {
      setFormData({
        firstName: me.firstName || '',
        lastName: me.lastName || '',
        email: me.email || '',
        phoneNumber: me.phoneNumber || '',
      });
      setImagePreview(me.profileImageUrl || null);
    }
  }, [me]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!me) return;
    setLoading(true);

    const updateData: any = {
      ...formData,
      role: me.role,
    };

    if (imageFile) {
      updateData.ProfileImageUrl = imageFile;
    }

    const userId = me._id || me.id;
    if (!userId) {
      toast.error('User ID is missing');
      setLoading(false);
      return;
    }

    // Assuming role is required by updateUser, we pass existing role
    const response = await updateUser(userId, updateData);

    setLoading(false);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success('Profile updated successfully');
      dispatch(fetchMe());
    }
  };

  if (!me) return <div>Loading...</div>;

  return (
    <div className='w-full h-full p-6 overflow-y-auto'>
      <div className='max-w-4xl mx-auto'>
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account profile information and email address
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Profile Picture */}
            <div className='flex items-center gap-6'>
              <Avatar className='h-24 w-24'>
                <AvatarImage
                  src={imagePreview || 'https://github.com/shadcn.png'}
                  alt='Profile'
                />
                <AvatarFallback className='text-2xl'>
                  {me.firstName?.[0]?.toUpperCase()}
                  {me.lastName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='space-y-2'>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageChange}
                />
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className='h-4 w-4 mr-2' />
                  Change Photo
                </Button>
                <p className='text-sm text-muted-foreground'>
                  JPG, PNG or GIF. Max size 2MB
                </p>
              </div>
            </div>

            {/* Name Fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  placeholder='John'
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  placeholder='Doe'
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='john.doe@example.com'
                value={formData.email}
                onChange={handleChange}
                disabled // Usually email is not editable or requires verification
              />
            </div>

            {/* Phone */}
            <div className='space-y-2'>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <Input
                id='phoneNumber'
                type='tel'
                placeholder='+1 (555) 000-0000'
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Save Button */}
            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() =>
                  setFormData({
                    firstName: me.firstName || '',
                    lastName: me.lastName || '',
                    email: me.email || '',
                    phoneNumber: me.phoneNumber || '',
                  })
                }
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

