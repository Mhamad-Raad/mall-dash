import { useNavigate } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Search, Plus, Filter, Download, Users as UsersIcon } from 'lucide-react';

const UsersFilters = () => {
  const navigate = useNavigate();

  const handleOnCreate = () => {
    navigate('/users/create');
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Header with Title and Create Button */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-primary/10 text-primary'>
            <UsersIcon className='size-5' />
          </div>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Users Management</h2>
            <p className='text-sm text-muted-foreground'>Manage and monitor all users</p>
          </div>
        </div>
        
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            className='gap-2'
          >
            <Download className='size-4' />
            <span className='hidden sm:inline'>Export</span>
          </Button>
          <Button
            type='button'
            className='gap-2'
            onClick={handleOnCreate}
          >
            <Plus className='size-4' />
            <span className='hidden sm:inline font-semibold'>Add User</span>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-muted/30 rounded-lg border'>
        <div className='flex items-center gap-2 flex-1 w-full'>
          <Filter className='size-4 text-muted-foreground' />
          <span className='text-sm font-medium text-muted-foreground'>Filters:</span>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-wrap'>
          {/* Search Input */}
          <div className='relative flex-1 sm:min-w-[250px]'>
            <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3'>
              <Search className='size-4' />
            </div>
            <Input
              type='text'
              placeholder='Search users by name or email...'
              className='pl-9 bg-background'
            />
          </div>

          {/* Role Filter */}
          <Select defaultValue='All'>
            <SelectTrigger className='w-full sm:w-[160px] bg-background'>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>
                <div className='flex items-center gap-2'>
                  <span>All Roles</span>
                  <Badge variant='secondary' className='ml-auto text-xs'>All</Badge>
                </div>
              </SelectItem>
              <SelectItem value='Admin'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-purple-500' />
                  <span>Admin</span>
                </div>
              </SelectItem>
              <SelectItem value='Manager'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-blue-500' />
                  <span>Manager</span>
                </div>
              </SelectItem>
              <SelectItem value='User'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-green-500' />
                  <span>User</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Building Filter */}
          <Select defaultValue='AllBuildings'>
            <SelectTrigger className='w-full sm:w-[160px] bg-background'>
              <SelectValue placeholder='Select building' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='AllBuildings'>All Buildings</SelectItem>
              <SelectItem value='Central'>Central Plaza</SelectItem>
              <SelectItem value='Main'>Main Tower</SelectItem>
              <SelectItem value='West'>West Wing</SelectItem>
              <SelectItem value='North'>North Block</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UsersFilters;
