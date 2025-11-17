import { Building2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserFormData } from '@/interfaces/Users.interface';

interface LocationCardProps {
  formData: UserFormData;
  onInputChange: (field: keyof UserFormData, value: string | number) => void;
}

const LocationCard = ({ formData, onInputChange }: LocationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Location Information</CardTitle>
        <CardDescription>
          Building and address details
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-2 pb-2'>
          <Building2 className='size-5 text-primary' />
          <h3 className='text-base font-semibold'>Address</h3>
          <span className='text-xs text-muted-foreground font-normal ml-auto'>(Optional)</span>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='building' className='text-sm font-medium'>
            Building
          </Label>
          <Input
            id='building'
            placeholder='Enter building name'
            value={formData?.buildingName || ''}
            onChange={(e) => onInputChange('buildingName', e.target.value)}
            className='h-11'
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
