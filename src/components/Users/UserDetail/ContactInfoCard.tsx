import { Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { UserFormData } from '@/interfaces/Users.interface';

interface ContactInfoCardProps {
  formData: UserFormData;
  onInputChange: (field: keyof UserFormData, value: string) => void;
}

const ContactInfoCard = ({ formData, onInputChange }: ContactInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Contact Information</CardTitle>
        <CardDescription>
          Email and phone details
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-sm font-medium flex items-center gap-2'>
            <Mail className='size-4 text-primary' />
            Email Address <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='john.doe@example.com'
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className='h-11'
          />
        </div>
        <Separator />
        <div className='space-y-2'>
          <Label htmlFor='phone' className='text-sm font-medium flex items-center gap-2'>
            <Phone className='size-4 text-primary' />
            Phone Number <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='phone'
            type='tel'
            placeholder='+1 (555) 000-0000'
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            className='h-11'
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
