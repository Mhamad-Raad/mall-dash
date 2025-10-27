import { Building2, MapPin, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const getUserTypeColor = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower === 'admin')
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
  if (typeLower === 'manager')
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  if (typeLower === 'user')
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
  if (typeLower === 'technician')
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
  if (typeLower === 'security')
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
  if (typeLower === 'maintenance')
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
};

interface LocationRoleCardProps {
  formData: {
    buildingName: string;
    type: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const LocationRoleCard = ({ formData, onInputChange }: LocationRoleCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl flex items-center gap-2'>
          <Building2 className='h-5 w-5' />
          Location & Role
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
            value={formData.buildingName}
            onChange={(e) => onInputChange('buildingName', e.target.value)}
            className='pl-6'
          />
        </div>
        <Separator />
        <div className='space-y-2'>
          <Label className='flex items-center gap-2 text-sm'>
            <Shield className='h-4 w-4' />
            User Role
          </Label>
          <div className='pl-6'>
            <Badge variant='outline' className={`${getUserTypeColor(formData.type)} font-semibold`}>
              {formData.type}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationRoleCard;
