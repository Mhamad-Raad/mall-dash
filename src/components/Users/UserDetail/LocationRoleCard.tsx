import { Building2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface LocationCardProps {
  formData: {
    buildingName: string;
    type: string;
  };
  onInputChange: (field: string, value: string | number) => void;
}

const LocationCard = ({ formData, onInputChange }: LocationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl flex items-center gap-2'>
          <Building2 className='h-5 w-5' />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='building' className='flex items-center gap-2 text-sm'>
            <MapPin className='h-4 w-4' />
            Building
          </Label>
          <Input
            id='building'
            value={formData?.buildingName}
            onChange={(e) => onInputChange('buildingName', e.target.value)}
            className='pl-6'
          />
        </div>
        <Separator />
      </CardContent>
    </Card>
  );
};

export default LocationCard;
