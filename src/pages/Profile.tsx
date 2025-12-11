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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Camera,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Loader2,
  Save,
  X,
  ImageIcon,
} from 'lucide-react';
import type { RootState, AppDispatch } from '@/store/store';
import { updateUser } from '@/data/Users';
import { fetchMe } from '@/store/slices/meSlice';
import roles from '@/constants/roles';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user: me, loading: meLoading } = useSelector(
    (state: RootState) => state.me
  );

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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(me?.profileImageUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

    const response = await updateUser(userId, updateData);

    setLoading(false);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success('Profile updated successfully');
      dispatch(fetchMe());
      setImageFile(null);
    }
  };

  const handleCancel = () => {
    if (me) {
      setFormData({
        firstName: me.firstName || '',
        lastName: me.lastName || '',
        email: me.email || '',
        phoneNumber: me.phoneNumber || '',
      });
      setImagePreview(me.profileImageUrl || null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const hasChanges =
    me &&
    (formData.firstName !== me.firstName ||
      formData.lastName !== me.lastName ||
      formData.phoneNumber !== me.phoneNumber ||
      imageFile !== null);

  const getRoleName = (role: number) => {
    return roles[role] || 'Unknown';
  };

  const getRoleBadgeVariant = (role: number) => {
    switch (role) {
      case 0:
        return 'default'; // SuperAdmin
      case 1:
        return 'secondary'; // Admin
      default:
        return 'outline';
    }
  };

  if (meLoading || !me) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-muted-foreground'>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-[calc(100vh-10rem)] flex flex-col gap-4'>
      {/* Header Section */}
      <div className='flex flex-col gap-1 shrink-0'>
        <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
          My Profile
        </h1>
        <p className='text-muted-foreground'>
          Manage your account settings and personal information
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0'>
          {/* Profile Overview Card */}
          <Card className='lg:col-span-1 flex flex-col'>
            <CardContent className='pt-6 flex-1 flex flex-col'>
              <div className='flex flex-col items-center text-center space-y-4'>
                {/* Large Avatar with Upload */}
                <div className='relative group'>
                  <Avatar className='h-32 w-32 border-4 border-background shadow-xl'>
                    <AvatarImage
                      src={imagePreview || undefined}
                      alt='Profile'
                      className='object-cover'
                    />
                    <AvatarFallback className='text-3xl font-semibold bg-primary/10 text-primary'>
                      {me.firstName?.[0]?.toUpperCase()}
                      {me.lastName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type='file'
                    ref={fileInputRef}
                    className='hidden'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className='absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105'
                  >
                    <Camera className='h-4 w-4' />
                  </button>
                </div>

                {/* Image actions */}
                {imageFile && (
                  <div className='flex items-center gap-2'>
                    <Badge variant='secondary' className='gap-1'>
                      <ImageIcon className='h-3 w-3' />
                      New photo selected
                    </Badge>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleRemoveImage}
                      className='h-6 w-6 p-0'
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                )}

                {/* User Info */}
                <div className='space-y-1'>
                  <h2 className='text-xl font-semibold'>
                    {me.firstName} {me.lastName}
                  </h2>
                  <p className='text-sm text-muted-foreground'>{me.email}</p>
                </div>

                {/* Role Badge */}
                <Badge
                  variant={getRoleBadgeVariant(me.role)}
                  className='px-3 py-1'
                >
                  <Shield className='h-3 w-3 mr-1' />
                  {getRoleName(me.role)}
                </Badge>

                <Separator className='my-4' />

                {/* Quick Stats */}
                <div className='w-full space-y-3'>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='p-2 rounded-lg bg-muted'>
                      <Mail className='h-4 w-4 text-muted-foreground' />
                    </div>
                    <div className='flex-1 text-left'>
                      <p className='text-muted-foreground text-xs'>Email</p>
                      <p className='font-medium truncate'>{me.email}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <div className='p-2 rounded-lg bg-muted'>
                      <Phone className='h-4 w-4 text-muted-foreground' />
                    </div>
                    <div className='flex-1 text-left'>
                      <p className='text-muted-foreground text-xs'>Phone</p>
                      <p className='font-medium'>
                        {me.phoneNumber || 'Not set'}
                      </p>
                    </div>
                  </div>
                  {me.createdAt && (
                    <div className='flex items-center gap-3 text-sm'>
                      <div className='p-2 rounded-lg bg-muted'>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                      </div>
                      <div className='flex-1 text-left'>
                        <p className='text-muted-foreground text-xs'>
                          Member since
                        </p>
                        <p className='font-medium'>
                          {new Date(me.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Card */}
          <Card className='lg:col-span-2 flex flex-col'>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <div className='p-2 rounded-lg bg-primary/10'>
                  <User className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <CardTitle className='text-lg'>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6 flex-1 flex flex-col'>
              {/* Name Fields */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName' className='text-sm font-medium'>
                    First Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='firstName'
                    placeholder='Enter your first name'
                    value={formData.firstName}
                    onChange={handleChange}
                    className='h-11'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName' className='text-sm font-medium'>
                    Last Name <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='lastName'
                    placeholder='Enter your last name'
                    value={formData.lastName}
                    onChange={handleChange}
                    className='h-11'
                  />
                </div>
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm font-medium'>
                  Email Address
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='your.email@example.com'
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className='h-11 pl-10 bg-muted/50'
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Email address cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div className='space-y-2'>
                <Label htmlFor='phoneNumber' className='text-sm font-medium'>
                  Phone Number
                </Label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='phoneNumber'
                    type='tel'
                    placeholder='+1 (555) 000-0000'
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className='h-11 pl-10'
                  />
                </div>
              </div>

              <div className='flex-1' />

              <Separator />

              {/* Action Buttons */}
              <div className='flex flex-col-reverse sm:flex-row justify-end gap-3'>
                <Button
                  variant='outline'
                  onClick={handleCancel}
                  disabled={loading || !hasChanges}
                  className='gap-2'
                >
                  <X className='h-4 w-4' />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading || !hasChanges}
                  className='gap-2'
                >
                  {loading ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className='h-4 w-4' />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Profile;