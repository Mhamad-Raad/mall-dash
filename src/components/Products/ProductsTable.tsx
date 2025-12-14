import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Tag,
  Store,
  Trash2,
  Edit,
  ChevronRight,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import ProductsTableSkeleton from './ProductsTableSkeleton';
import CustomTablePagination from '../CustomTablePagination';
import ConfirmModal from '@/components/ui/Modals/ConfirmModal';

import { fetchProducts } from '@/store/slices/productsSlice';

import type { RootState, AppDispatch } from '@/store/store';
import type { ProductType } from '@/interfaces/Products.interface';
import { deleteProduct as deleteProductAPI } from '@/data/Products';
import { toast } from 'sonner';

const ProductsTable = () => {
  const { t } = useTranslation('products');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error, total, page, limit } = useSelector(
    (state: RootState) => state.products
  );

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRowClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleEdit = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    setDeleteId(productId);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteProductAPI(deleteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Product deleted successfully');
        dispatch(fetchProducts({ page, limit })); // Refetch
      }
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>
          {t('error')}: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
        <ScrollArea className='h-[calc(100vh-280px)] md:h-[calc(100vh-280px)]'>
          <Table className='w-full min-w-[700px]'>
            <TableHeader>
              <TableRow className='hover:bg-transparent border-b bg-muted/50'>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Product
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Price
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Category
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Vendor
                </TableHead>
                <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Stock
                </TableHead>
                <TableHead className='sticky top-0 z-10 w-24 bg-muted/50 backdrop-blur-sm border-b h-12'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && products.length === 0
                ? Array.from({ length: 5 }).map((_, index) => (
                    <ProductsTableSkeleton key={`skeleton-${index}`} />
                  ))
                : products.map((product) => (
                    <TableRow
                      key={product.id}
                      className='group hover:bg-muted/50 transition-all cursor-pointer border-b last:border-0'
                      onClick={() => handleRowClick(product.id)}
                    >
                      {/* Product Info */}
                      <TableCell className='font-medium py-4'>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-12 w-12 rounded-lg border border-border shadow-sm'>
                            <AvatarImage
                              src={product.productImageUrl}
                              alt={product.name}
                            />
                            <AvatarFallback className='rounded-lg bg-primary/10 text-primary'>
                              <ShoppingBag className='h-5 w-5' />
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col gap-0.5'>
                            <span className='font-semibold text-base group-hover:text-primary transition-colors'>
                              {product.name}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className='py-4'>
                        <div className='flex flex-col'>
                          {product.discountPrice ? (
                            <>
                              <span className='font-bold text-base'>
                                ${product.discountPrice.toFixed(2)}
                              </span>
                              <span className='text-xs text-muted-foreground line-through'>
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className='font-medium text-base'>
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className='py-4'>
                        <div className='flex items-center gap-2'>
                          <Tag className='h-3.5 w-3.5 text-muted-foreground' />
                          <span>{product.categoryName}</span>
                        </div>
                      </TableCell>

                      {/* Vendor */}
                      <TableCell className='py-4'>
                        <div className='flex items-center gap-2'>
                          <Store className='h-3.5 w-3.5 text-muted-foreground' />
                          <span>{product.vendorName}</span>
                        </div>
                      </TableCell>

                      {/* Stock */}
                      <TableCell className='py-4'>
                        <Badge
                          variant={product.inStock ? 'default' : 'destructive'}
                          className={
                            product.inStock
                              ? 'bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-500/20'
                              : ''
                          }
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className='py-4'>
                        <div className='flex items-center gap-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-muted-foreground hover:text-primary'
                            onClick={(e) => handleEdit(e, product.id)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-muted-foreground hover:text-destructive'
                            onClick={(e) => handleDeleteClick(e, product.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        {/* Pagination */}
        <div className='border-t px-4 py-3 bg-muted/20'>
          <CustomTablePagination
            total={total}
            suggestions={[10, 20, 40, 50, 100]}
          />
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title='Delete Product'
        description='Are you sure you want to delete this product? This action cannot be undone.'
        confirmType='danger'
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
      />
    </>
  );
};

export default ProductsTable;

