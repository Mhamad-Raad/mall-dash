import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Plus, Store, Tags } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { vendorTypes } from '@/constants/vendorTypes';

const vendorTypesWithAll = [
  { label: 'All Types', value: -1 },
  ...vendorTypes,
];

export default function VendorsFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [typedSearch, setTypedSearch] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('-1');

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
    if (type !== '-1') {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
    // eslint-disable-next-line
  }, [search, type]);

  // Sync state if URL changes externally (browser nav)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
    setTypedSearch(urlSearch);
    setType(searchParams.get('type') || '-1');
    // eslint-disable-next-line
  }, [searchParams]);

  const handleOnCreate = () => {
    navigate('/vendors/create');
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header with Title and Create Button */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-4 flex-1'>
          <div className='p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-sm'>
            <Store className='size-6' />
          </div>
          <div>
            <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text'>
              Vendors Management
            </h2>
            <p className='text-sm text-muted-foreground mt-0.5'>
              Manage and monitor all vendors
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
          <span className='font-semibold'>Add Vendor</span>
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
              Filter Vendors
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
                placeholder='Search vendors...'
                className='pl-10 bg-background w-full shadow-sm border-muted-foreground/20 focus-visible:border-primary/50 transition-colors h-11'
                value={typedSearch}
                onChange={(e) => setTypedSearch(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className='relative w-full'>
              <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3.5 z-10'>
                <Tags className='size-4' />
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className='w-full bg-background shadow-sm border-muted-foreground/20 focus:border-primary/50 transition-colors pl-10 [&>span]:pl-0 !h-11'>
                  <SelectValue placeholder='Filter by type' />
                </SelectTrigger>
                <SelectContent>
                  {vendorTypesWithAll.map((vendorType) => (
                    <SelectItem key={vendorType.value} value={String(vendorType.value)}>
                      <div className='flex items-center gap-2'>
                        <span>{vendorType.label}</span>
                        {vendorType.value === -1 && (
                          <Badge variant='secondary' className='ml-auto text-xs'>
                            All
                          </Badge>
                        )}
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
}
