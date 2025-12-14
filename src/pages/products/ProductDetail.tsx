import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Store,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchProductById, updateProduct } from '@/data/Products';
import { fetchCategories } from '@/data/Categories';
import type { ProductType } from '@/interfaces/Products.interface';

const ProductDetail = () => {
  const { t } = useTranslation('products');
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ProductType | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [isWeightable, setIsWeightable] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState(''); // For initial display

  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    setLoading(true);
    const data = await fetchProductById(productId);
    if (data && !data.error) {
      setProduct(data);
      setName(data.name || '');
      setDescription(data.description || '');
      setPrice(data.price?.toString() || '');
      setDiscountPrice(data.discountPrice?.toString() || '');
      setInStock(data.inStock || false);
      setIsWeightable(data.isWeightable || false);
      setCategoryId(data.categoryId);
      setCategoryName(data.categoryName);
      setImagePreview(data.productImageUrl || '');
    } else {
      toast.error('Failed to load product details');
      navigate('/products');
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadCategories = async (query: string) => {
    const res = await fetchCategories({ searchName: query, limit: 10 });
    const data = Array.isArray(res) ? res : res?.data;
    if (Array.isArray(data)) {
      return data.map((c: any) => ({ id: c.id, name: c.name }));
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!name || !price || !categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append('Id', id);
    formData.append('Name', name);
    formData.append('Description', description);
    formData.append('Price', price);
    if (discountPrice) formData.append('DiscountPrice', discountPrice);
    formData.append('CategoryId', categoryId.toString());
    formData.append('InStock', String(inStock));
    formData.append('IsWeightable', String(isWeightable));

    if (imageFile) {
      formData.append('ProductImageUrl', imageFile);
    } else {
      // If no new image, do we send the old URL?
      // Usually for multipart, if we don't send file, we might send the string or nothing.
      // Based on user input "ProductImageUrl Type:string", maybe we send the string if not changed?
      // But typically backend ignores missing file field in update.
      // I'll leave it out if not changed, or send the URL string if it's required as string.
      // Let's try sending the string URL if no file is there, just in case.
      if (product?.productImageUrl) {
        formData.append('ProductImageUrl', product.productImageUrl);
      }
    }

    const result = await updateProduct(parseInt(id), formData);

    if (result && !result.error) {
      toast.success('Product updated successfully');
      navigate('/products');
    } else {
      toast.error(result?.error || 'Failed to update product');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6 pb-10'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate('/products')}
          className='rounded-full'
        >
          <ArrowLeft className='w-5 h-5' />
        </Button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Product</h1>
          <p className='text-muted-foreground'>
            Update product information and settings
          </p>
        </div>
        <div className='ml-auto'>
          {product?.vendorName && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full'>
              <Store className='w-4 h-4' />
              <span>{product.vendorName}</span>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 lg:grid-cols-3 gap-6'
      >
        {/* Left Column - Main Info */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Product Name *</Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='e.g. Fresh Tomatoes'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Product description...'
                  rows={4}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='price'>Price *</Label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                      $
                    </span>
                    <Input
                      id='price'
                      type='number'
                      step='0.01'
                      min='0'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className='pl-7'
                      required
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='discountPrice'>Discount Price</Label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                      $
                    </span>
                    <Input
                      id='discountPrice'
                      type='number'
                      step='0.01'
                      min='0'
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      className='pl-7'
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2 relative z-20'>
                <Label>Category *</Label>
                <ObjectAutoComplete
                  fetchOptions={loadCategories}
                  onSelectOption={(option) => {
                    setCategoryId(option.id);
                    setCategoryName(option.name);
                  }}
                  getOptionLabel={(c) => c.name}
                  placeholder='Select Category'
                  initialValue={categoryName}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Image */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-base'>In Stock</Label>
                  <p className='text-sm text-muted-foreground'>
                    Available for purchase
                  </p>
                </div>
                <Switch checked={inStock} onCheckedChange={setInStock} />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label className='text-base'>Weightable</Label>
                  <p className='text-sm text-muted-foreground'>
                    Sold by weight
                  </p>
                </div>
                <Switch
                  checked={isWeightable}
                  onCheckedChange={setIsWeightable}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center gap-4'>
                <div
                  className='relative w-full aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors'
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt='Preview'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                      <ImageIcon className='w-10 h-10 opacity-50' />
                      <span className='text-sm'>Click to upload image</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageChange}
                  />
                </div>
                {imageFile && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='w-full text-xs'
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(product?.productImageUrl || '');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Reset Image
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Button type='submit' className='w-full' size='lg' disabled={saving}>
            {saving ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='w-4 h-4 mr-2' />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetail;

