import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { Search, Plus, Filter, Users as UsersIcon } from 'lucide-react';

import AutoComplete from '@/components/AutoComplete';
import { fetchBuildingsByName } from '@/data/Buildings';

const roles = ['SuperAdmin', 'Admin', 'Vendor', 'Tenant'];

const UsersFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Use index, -1 means "All"
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  // typedSearch is what user is typing, search is debounced value synced to URL
  const [typedSearch, setTypedSearch] = useState(search);

  const [byBuildingName, setByBuildingName] = useState<string>('');

  const [role, setRole] = useState(() =>
    searchParams.get('role') !== null ? Number(searchParams.get('role')) : -1
  );

  // Debounce for search input
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(typedSearch);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [typedSearch]);

  // Update search params in URL whenever any filter changes (debounced search)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    if (byBuildingName) {
      params.set('buildingNameSearch', byBuildingName);
    } else {
      params.delete('buildingNameSearch');
    }
    if (role !== -1) {
      params.set('role', String(role));
    } else {
      params.delete('role');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
    // eslint-disable-next-line
  }, [search, byBuildingName, role]);

  // Sync state if URL changes externally (browser nav)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
    setTypedSearch(urlSearch);
    setRole(
      searchParams.get('role') !== null ? Number(searchParams.get('role')) : -1
    );
    setByBuildingName(searchParams.get('buildingNameSearch') || '');
    // eslint-disable-next-line
  }, [searchParams]);

  const handleOnCreate = () => {
    navigate('/users/create');
  };

  // Async fetching function for AutoComplete
  const fetchBuildingNames = async (input: string) => {
    if (!input) return [];
    const res = await fetchBuildingsByName(input);
    return Array.isArray(res?.data) ? res.data.map((b: any) => b.name) : [];
  };

  const handleBuildingNameSelect = (value: string) => {
    setByBuildingName(value);
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Header with Title and Create Button */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
        <div className='flex items-center gap-3 flex-1'>
          <div className='p-2 rounded-lg bg-primary/10 text-primary'>
            <UsersIcon className='size-5' />
          </div>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Users Management
            </h2>
            <p className='text-sm text-muted-foreground'>
              Manage and monitor all users
            </p>
          </div>
        </div>
        <Button
          type='button'
          className='gap-2 w-full sm:w-auto'
          onClick={handleOnCreate}
        >
          <Plus className='size-4' />
          <span className='hidden sm:inline font-semibold'>Add User</span>
        </Button>
      </div>
      {/* Filters Section */}
      <div className='bg-muted/30 rounded-lg border p-4'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2 mb-2'>
            <Filter className='size-4 text-muted-foreground' />
            <span className='text-sm font-medium text-muted-foreground'>
              Filters:
            </span>
          </div>
          <div className='w-full grid gap-3 sm:grid-cols-2 md:grid-cols-3'>
            {/* Search Input */}
            <div className='relative w-full'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3'>
                <Search className='size-4' />
              </div>
              <Input
                type='text'
                placeholder='Search users by name or email...'
                className='pl-9 bg-background w-full'
                value={typedSearch}
                onChange={(e) => setTypedSearch(e.target.value)}
              />
            </div>
            {/* BuildingsSearch Filter Input */}
            <AutoComplete
              fetchOptions={fetchBuildingNames}
              onSelectOption={handleBuildingNameSelect}
              placeholder='Search building name...'
              debounceMs={200}
              className='w-full'
            />
            {/* Role Filter */}
            <Select
              value={String(role)}
              onValueChange={(val) => setRole(Number(val))}
            >
              <SelectTrigger className='w-full bg-background'>
                <SelectValue
                  placeholder='Select role'
                  children={
                    role === -1 ? 'All Roles' : roles[role] || 'Unknown'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='-1'>
                  <div className='flex items-center gap-2'>
                    <span>All Roles</span>
                    <Badge variant='secondary' className='ml-auto text-xs'>
                      All
                    </Badge>
                  </div>
                </SelectItem>
                {roles.map((roleName, idx) => (
                  <SelectItem key={roleName} value={String(idx)}>
                    <div className='flex items-center gap-2'>
                      <span>{roleName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersFilters;
