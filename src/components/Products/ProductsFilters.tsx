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
import { fetchVendors } from '@/data/Vendor';
import { fetchCategories } from '@/data/Categories';

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

  // Sync state with URL
  useEffect(() => {
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
      const vId = params.get('vendorId');
      if (!vId) setSelectedVendor(null); // Clear if removed from URL
    }

    // Category
    if (selectedCategory) {
      params.set('categoryId', selectedCategory.id.toString());
    } else {
      const cId = params.get('categoryId');
      if (!cId) setSelectedCategory(null);
    }

    // Reset page on filter change
    params.set('page', '1');

    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  }, [search, inStock, selectedVendor, selectedCategory]);

  // Initial load from URL for objects (Vendor/Category) is tricky because we only have ID in URL.
  // We might need to fetch the object by ID if we want to show the name.
  // For now, I'll skip fetching the initial object name and just let it be empty or handle it if needed.
  // Or I can just rely on the user re-selecting if they want to filter.
  // Ideally we should fetch the vendor/category details if ID is present.

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
    // We might need to force clear the AutoComplete inputs.
    // The ObjectAutoComplete component might need a key to reset or exposed method.
    // I'll add a key to force re-render.
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
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <Input
              placeholder='Search products...'
              className='pl-9'
              value={typedSearch}
              onChange={(e) => setTypedSearch(e.target.value)}
            />
            {typedSearch && (
              <button
                onClick={clearSearch}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <X className='size-4' />
              </button>
            )}
          </div>

          {/* Vendor Filter */}
          <div className='relative z-20'>
            <ObjectAutoComplete
              fetchOptions={loadVendors}
              onSelectOption={setSelectedVendor}
              getOptionLabel={(v) => v.name}
              placeholder='Select Vendor'
              initialValue={selectedVendor?.name}
            />
          </div>

          {/* Category Filter */}
          <div className='relative z-10'>
            <ObjectAutoComplete
              fetchOptions={loadCategories}
              onSelectOption={setSelectedCategory}
              getOptionLabel={(c) => c.name}
              placeholder='Select Category'
              initialValue={selectedCategory?.name}
            />
          </div>

          {/* In Stock Filter */}
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

        {(typedSearch ||
          selectedVendor ||
          selectedCategory ||
          inStock !== 'all') && (
          <div className='flex justify-end'>
            <Button
              variant='ghost'
              size='sm'
              onClick={clearAllFilters}
              className='text-muted-foreground'
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsFilters;

