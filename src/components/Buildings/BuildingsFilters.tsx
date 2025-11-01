import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Plus,
  Filter,
  Download,
  Building2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const BuildingsFilters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  // typedSearch is what user is typing, search is debounced value synced to URL
  const [typedSearch, setTypedSearch] = useState(search);

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

  // Update search params in URL whenever search changes (debounced)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
    // eslint-disable-next-line
  }, [search]);

  // Sync state if URL changes externally (browser nav)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearch(urlSearch);
    setTypedSearch(urlSearch);
    // eslint-disable-next-line
  }, [searchParams]);

  const handleOnCreate = () => {
    navigate('/buildings/create');
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Header with Title and Create Button */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-primary/10 text-primary'>
            <Building2 className='size-5' />
          </div>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Buildings Management
            </h2>
            <p className='text-sm text-muted-foreground'>
              Manage buildings, floors, and apartments
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
            <span className='hidden sm:inline font-semibold'>Add Building</span>
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
              placeholder='Search buildings by name...'
              className='pl-9 bg-background'
              value={typedSearch}
              onChange={(e) => setTypedSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingsFilters;
