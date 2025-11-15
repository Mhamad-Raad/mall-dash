import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Plus, FileDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export vendors...');
  };

  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
      {/* Left Section - Header & Filters */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto'>
        <div className='flex items-center gap-2'>
          <Filter className='h-5 w-5 text-muted-foreground' />
          <h2 className='text-lg font-semibold'>Filters</h2>
        </div>

        {/* Search Input */}
        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search vendors...'
            value={typedSearch}
            onChange={(e) => setTypedSearch(e.target.value)}
            className='pl-9'
          />
        </div>

        {/* Type Filter */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder='Filter by type' />
          </SelectTrigger>
          <SelectContent>
            {vendorTypesWithAll.map((vendorType) => (
              <SelectItem key={vendorType.value} value={String(vendorType.value)}>
                {vendorType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right Section - Actions */}
      <div className='flex items-center gap-2 w-full sm:w-auto'>
        <Button
          variant='outline'
          onClick={handleExport}
          className='flex-1 sm:flex-initial'
        >
          <FileDown className='mr-2 h-4 w-4' />
          Export
        </Button>
        <Button onClick={handleOnCreate} className='flex-1 sm:flex-initial'>
          <Plus className='mr-2 h-4 w-4' />
          Add Vendor
        </Button>
      </div>
    </div>
  );
}
