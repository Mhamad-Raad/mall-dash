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
import {
  Search,
  Plus,
  Filter,
  Download,
  Users as UsersIcon,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const roles = ['SuperAdmin', 'Admin', 'Vendor', 'Tenant'];

const UsersFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Use index, -1 means "All"
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  // typedSearch is what user is typing, search is debounced value synced to URL
  const [typedSearch, setTypedSearch] = useState(search);

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
  }, [search, role]);

  // Sync state if URL changes externally (browser nav)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
    setTypedSearch(urlSearch);
    setRole(
      searchParams.get('role') !== null ? Number(searchParams.get('role')) : -1
    );
    // eslint-disable-next-line
  }, [searchParams]);

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
            <h2 className='text-2xl font-bold tracking-tight'>
              Users Management
            </h2>
            <p className='text-sm text-muted-foreground'>
              Manage and monitor all users
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button type='button' variant='outline' className='gap-2'>
            <Download className='size-4' />
            <span className='hidden sm:inline'>Export</span>
          </Button>
          <Button type='button' className='gap-2' onClick={handleOnCreate}>
            <Plus className='size-4' />
            <span className='hidden sm:inline font-semibold'>Add User</span>
          </Button>
        </div>
      </div>
      {/* Filters Section */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-muted/30 rounded-lg border'>
        <div className='flex items-center gap-2 flex-1 w-full'>
          <Filter className='size-4 text-muted-foreground' />
          <span className='text-sm font-medium text-muted-foreground'>
            Filters:
          </span>
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
              value={typedSearch}
              onChange={(e) => setTypedSearch(e.target.value)}
            />
          </div>
          {/* Role Filter */}
          <Select
            value={String(role)}
            onValueChange={(val) => setRole(Number(val))}
          >
            <SelectTrigger className='w-full sm:w-[160px] bg-background'>
              <SelectValue
                placeholder='Select role'
                children={role === -1 ? 'All Roles' : roles[role] || 'Unknown'}
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
  );
};

export default UsersFilters;
