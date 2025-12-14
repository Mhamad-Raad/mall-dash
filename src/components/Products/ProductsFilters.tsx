import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Plus,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';

import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchVendors, fetchVendorById } from '@/data/Vendor';
import { fetchCategories, fetchCategoryById } from '@/data/Categories';

// We need simple interfaces for the autocomplete options if the full types are complex
interface VendorOption {
  id: number;
  name: string;
}

interface CategoryOption {
  id: number;
  name: string;
}

const ProductsFilters = () => {
  const { t } = useTranslation('products');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search state
  const [search, setSearch] = useState(
    () => searchParams.get('searchName') || ''
  );
  const [typedSearch, setTypedSearch] = useState(search);

  // Filters state
  const [inStock, setInStock] = useState<string>(() => {
    const param = searchParams.get('inStock');
    return param === null ? 'all' : param;
  });

  const [selectedVendor, setSelectedVendor] = useState<VendorOption | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);

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

  // Initial load from URL
  useEffect(() => {
    const initFilters = async () => {
      const vId = searchParams.get('vendorId');
      const cId = searchParams.get('categoryId');

      if (vId) {
        const vendor = await fetchVendorById(vId);
        if (vendor && !vendor.error) {
          setSelectedVendor({ id: vendor.id, name: vendor.name });
        }
      }

      if (cId) {
        const category = await fetchCategoryById(parseInt(cId));
        if (category && !category.error) {
          setSelectedCategory({ id: category.id, name: category.name });
        }
      }

      setIsInitialized(true);
    };

    initFilters();
  }, []);

  // Sync state with URL
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams(searchParams);

    // Search
    if (search) {
      params.set('searchName', search);
    } else {
      params.delete('searchName');
    }

    // In Stock
    if (inStock !== 'all') {
      params.set('inStock', inStock);
    } else {
      params.delete('inStock');
    }

    // Vendor
    if (selectedVendor) {
      params.set('vendorId', selectedVendor.id.toString());
    } else {
      params.delete('vendorId');
    }

    // Category
    if (selectedCategory) {
      params.set('categoryId', selectedCategory.id.toString());
    } else {
      params.delete('categoryId');
    }

    // Reset page on filter change (only if params changed)
    // Note: This logic might reset page even if we are just syncing initial state?
    // No, isInitialized protects us.
    // But if we navigate to page 2, this effect runs?
    // Dependency array: [search, inStock, selectedVendor, selectedCategory, isInitialized]
    // If we navigate to page 2, none of these change. So effect doesn't run.

    // Check if params actually changed before navigating to avoid loop or unnecessary replacement
    // But since we use navigate with replace, it's fine.
    // However, we want to ensure we don't reset page if only page changed (handled by dependency array).

    params.set('page', '1');

    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  }, [search, inStock, selectedVendor, selectedCategory, isInitialized]);

  const handleOnCreate = () => {
    navigate('/products/create');
  };

  const clearSearch = () => {
    setTypedSearch('');
    setSearch('');
  };

  const clearAllFilters = () => {
    setTypedSearch('');
    setSearch('');
    setInStock('all');
    setSelectedVendor(null);
    setSelectedCategory(null);
  };

  // Wrapper for fetching vendors
  const loadVendors = async (query: string) => {
    const res = await fetchVendors({ searchName: query, limit: 10 });
    // Handle both array response and { data: [] } response
    const data = Array.isArray(res) ? res : res?.data;
    if (Array.isArray(data)) {
      return data.map((v: any) => ({ id: v.id, name: v.name }));
    }
    return [];
  };

  // Wrapper for fetching categories
  const loadCategories = async (query: string) => {
    const res = await fetchCategories({ searchName: query, limit: 10 });
    // Handle both array response and { data: [] } response
    const data = Array.isArray(res) ? res : res?.data;
    if (Array.isArray(data)) {
      return data.map((c: any) => ({ id: c.id, name: c.name }));
    }
    return [];
  };

  return (
    <div className='flex flex-col gap-5'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-2xl blur-lg opacity-40' />
            <div className='relative p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg'>
              <ShoppingBag className='size-7' />
            </div>
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-3xl font-bold tracking-tight'>Products</h1>
              <Sparkles className='size-5 text-amber-500' />
            </div>
            <p className='text-muted-foreground mt-0.5'>
              Manage your product inventory
            </p>
          </div>
        </div>

        <Button onClick={handleOnCreate} className='gap-2'>
          <Plus className='size-4' />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className='flex flex-col gap-4 p-4 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm relative z-30'>
        <div className='flex items-center gap-2 text-muted-foreground mb-2'>
          <SlidersHorizontal className='size-4' />
          <span className='text-sm font-medium'>Filters</span>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search products...'
              value={typedSearch}
              onChange={(e) => setTypedSearch(e.target.value)}
              className='pl-9 pr-9'
            />
            {typedSearch && (
              <button
                onClick={clearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>

          {/* Vendor Filter */}
          <ObjectAutoComplete
            fetchOptions={loadVendors}
            onSelectOption={setSelectedVendor}
            getOptionLabel={(v) => v.name}
            placeholder='Select Vendor'
            initialValue={selectedVendor?.name}
          />

          {/* Category Filter */}
          <ObjectAutoComplete
            fetchOptions={loadCategories}
            onSelectOption={setSelectedCategory}
            getOptionLabel={(c) => c.name}
            placeholder='Select Category'
            initialValue={selectedCategory?.name}
          />

          {/* Stock Filter */}
          <Select value={inStock} onValueChange={setInStock}>
            <SelectTrigger>
              <SelectValue placeholder='Stock Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='true'>In Stock</SelectItem>
              <SelectItem value='false'>Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Summary (Optional) */}
        {(search ||
          inStock !== 'all' ||
          selectedVendor ||
          selectedCategory) && (
          <div className='flex items-center gap-2 pt-2 border-t'>
            <span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>
              Active Filters:
            </span>
            <div className='flex flex-wrap gap-2'>
              {search && (
                <div className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1'>
                  Search: {search}
                  <X className='w-3 h-3 cursor-pointer' onClick={clearSearch} />
                </div>
              )}
              {selectedVendor && (
                <div className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1'>
                  Vendor: {selectedVendor.name}
                  <X
                    className='w-3 h-3 cursor-pointer'
                    onClick={() => setSelectedVendor(null)}
                  />
                </div>
              )}
              {selectedCategory && (
                <div className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1'>
                  Category: {selectedCategory.name}
                  <X
                    className='w-3 h-3 cursor-pointer'
                    onClick={() => setSelectedCategory(null)}
                  />
                </div>
              )}
              {inStock !== 'all' && (
                <div className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1'>
                  Stock: {inStock === 'true' ? 'In Stock' : 'Out of Stock'}
                  <X
                    className='w-3 h-3 cursor-pointer'
                    onClick={() => setInStock('all')}
                  />
                </div>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={clearAllFilters}
                className='ml-auto h-6 text-xs hover:bg-destructive/10 hover:text-destructive'
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsFilters;

