import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Plus,
  Filter,
  Building2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface BuildingsFiltersProps {
  onCreateClick?: () => void;
}

const BuildingsFilters = ({ onCreateClick }: BuildingsFiltersProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('buildings');

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
    if (onCreateClick) {
      onCreateClick();
    } else {
      navigate('/buildings/create');
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header with Title and Create Button */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-4 flex-1'>
          <div className='p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-sm'>
            <Building2 className='size-6' />
          </div>
          <div>
            <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text'>
              {t('title')}
            </h2>
            <p className='text-sm text-muted-foreground mt-0.5'>
              {t('subtitle')}
            </p>
          </div>
        </div>
        <Button type='button' className='gap-2 shadow-md hover:shadow-lg transition-shadow' size='lg' onClick={handleOnCreate}>
          <Plus className='size-4' />
          <span className='font-semibold'>{t('addBuilding')}</span>
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
              {t('filterBuildings')}
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
                placeholder={t('searchPlaceholder')}
                className='pl-10 bg-background w-full shadow-sm border-muted-foreground/20 focus-visible:border-primary/50 transition-colors h-11'
                value={typedSearch}
                onChange={(e) => setTypedSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingsFilters;
