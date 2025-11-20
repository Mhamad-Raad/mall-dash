import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { vendorTypes } from '@/constants/vendorTypes';

interface VendorBasicInfoProps {
  name: string;
  description: string;
  type: string;
  vendorId: string;
  onInputChange: (field: string, value: string) => void;
  disabled?: boolean;
}

const VendorBasicInfo = ({
  name,
  description,
  type,
  vendorId,
  onInputChange,
  disabled,
}: VendorBasicInfoProps) => {
  return (
    <div className='flex-1 space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>
          Business Name <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='name'
          value={name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder='Enter business name'
          disabled={disabled}
          className='text-lg font-semibold'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='type'>
          Business Type <span className='text-destructive'>*</span>
        </Label>
        <Select
          value={type}
          onValueChange={(value) => onInputChange('type', value)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select type' />
          </SelectTrigger>
          <SelectContent>
            {vendorTypes.map((type) => (
              <SelectItem key={type.value} value={String(type.value)}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>
          Description <span className='text-destructive'>*</span>
        </Label>
        <Textarea
          id='description'
          value={description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={6}
          placeholder='Describe your business...'
          disabled={disabled}
        />
      </div>

      <div className='pt-2'>
        <span className='text-xs text-muted-foreground'>
          ID: {vendorId}
        </span>
      </div>
    </div>
  );
};

export default VendorBasicInfo;
