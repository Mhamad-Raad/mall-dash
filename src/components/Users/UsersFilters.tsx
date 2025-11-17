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
import { Search, Plus, Filter, Users as UsersIcon, Building2, Shield } from 'lucide-react';

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
    <div className='flex flex-col gap-6'>
      {/* Header with Title and Create Button */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-4 flex-1'>
          <div className='p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-sm'>
            <UsersIcon className='size-6' />
          </div>
          <div>
            <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text'>
              Users Management
            </h2>
            <p className='text-sm text-muted-foreground mt-0.5'>
              Manage and monitor all users across your platform
            </p>
          </div>
        </div>
        <Button
          type='button'
          className='gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow'
          size='lg'
          onClick={handleOnCreate}
        >
          <Plus className='size-4' />
          <span className='font-semibold'>Add User</span>
        </Button>
      </div>
      
      {/* Filters Section */}
      <div className='bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border shadow-sm p-5'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2.5 pb-3 border-b'>
            <div className='p-1.5 rounded-md bg-primary/10'>
              <Filter className='size-4 text-primary' />
            </div>
            <span className='text-sm font-semibold text-foreground'>
              Filter Users
            </span>
          </div>
          <div className='w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Search Input */}
            <div className='relative w-full'>
                <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3.5'>
                  <Search className='size-4' />
                </div>
                <Input
                  type='text'
                  placeholder='Name or email...'
                  className='pl-10 bg-background w-full shadow-sm border-muted-foreground/20 focus-visible:border-primary/50 transition-colors h-11'
                  value={typedSearch}
                  onChange={(e) => setTypedSearch(e.target.value)}
                />
            </div>
            
            {/* BuildingsSearch Filter Input */}
            <div className='relative w-full'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3.5 z-10'>
                <Building2 className='size-4' />
              </div>
              <AutoComplete
                fetchOptions={fetchBuildingNames}
                onSelectOption={handleBuildingNameSelect}
                placeholder='Select building...'
                debounceMs={200}
                className='w-full [&_input]:pl-10'
              />
            </div>
            
            {/* Role Filter */}
            <div className='relative w-full'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3.5 z-10'>
                <Shield className='size-4' />
              </div>
              <Select
                value={String(role)}
                onValueChange={(val) => setRole(Number(val))}
              >
                <SelectTrigger className='w-full bg-background shadow-sm border-muted-foreground/20 focus:border-primary/50 transition-colors pl-10 [&>span]:pl-0 !h-11'>
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
    </div>
  );
};

export default UsersFilters;
