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
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Loader2, Save, X } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface EditProfileCardProps {
  formData: FormData;
  loading: boolean;
  hasChanges: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditProfileCard = ({
  formData,
  loading,
  hasChanges,
  onChange,
  onSave,
  onCancel,
}: EditProfileCardProps) => {
  return (
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
            onClick={onCancel}
            disabled={loading || !hasChanges}
            className='gap-2'
          >
            <X className='h-4 w-4' />
            Cancel
          </Button>
          <Button
            onClick={onSave}
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
  );
};

export default EditProfileCard;
