import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Search, Plus } from 'lucide-react';

const UsersFilters = () => {
  return (
    <div className='w-full flex items-center justify-between'>
      <Button type='button' className='flex items-center gap-1 text-md'>
        <Plus className='size-4' />
        <p className='font-black'>Create</p>
      </Button>

      <div className='flex gap-5'>
        <Select defaultValue='All'>
          <SelectTrigger className='w-[150px] [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0'>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent className='[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0'>
            <SelectItem value='All'>All</SelectItem>
            <SelectItem value='Admin'>Admin</SelectItem>
            <SelectItem value='Apartment'>Apartment</SelectItem>
            <SelectItem value='Vendor'>Vendor</SelectItem>
          </SelectContent>
        </Select>
        <div className='w-full max-w-xs space-y-2'>
          <div className='relative'>
            <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
              <Search className='size-4' />
              <span className='sr-only'>User</span>
            </div>
            <Input type='text' placeholder='Username' className='peer pl-9' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersFilters;
