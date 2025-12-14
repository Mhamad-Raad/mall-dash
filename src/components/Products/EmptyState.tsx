import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center h-full p-8 text-center bg-card/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-muted animate-in fade-in zoom-in duration-500'>
      <div className='relative'>
        <div className='absolute inset-0 bg-primary/20 blur-xl rounded-full' />
        <div className='relative p-6 bg-primary/10 rounded-full mb-6 ring-8 ring-primary/5'>
          <ShoppingBag className='size-12 text-primary' />
        </div>
      </div>
      
      <h3 className='text-xl font-bold tracking-tight mb-2'>
        No Products Found
      </h3>
      
      <p className='text-muted-foreground max-w-sm mb-8 leading-relaxed'>
        We couldn't find any products matching your filters. Try adjusting your search criteria or add a new product.
      </p>
      
      <Button 
        onClick={() => navigate('/products/create')}
        className='gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5'
      >
        <ShoppingBag className='size-4' />
        Add New Product
      </Button>
    </div>
  );
};

export default EmptyState;
