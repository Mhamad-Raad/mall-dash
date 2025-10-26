import { Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ContactInfoCardProps {
  formData: {
    email: string;
    phoneNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const ContactInfoCard = ({ formData, onInputChange }: ContactInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl flex items-center gap-2'>
          <Mail className='h-5 w-5' />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='flex items-center gap-2 text-sm'>
            <Mail className='h-4 w-4' />
            Email Address
          </Label>
          <Input
            id='email'
            type='email'
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className='pl-6'
          />
        </div>
        <Separator />
        <div className='space-y-2'>
          <Label htmlFor='phone' className='flex items-center gap-2 text-sm'>
            <Phone className='h-4 w-4' />
            Phone Number
          </Label>
          <Input
            id='phone'
            type='tel'
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            className='pl-6'
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
