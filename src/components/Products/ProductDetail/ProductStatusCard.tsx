import { CheckCircle, XCircle, Scale } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface ProductStatusCardProps {
  inStock: boolean;
  isWeightable: boolean;
  onInStockChange: (inStock: boolean) => void;
  onWeightableChange: (isWeightable: boolean) => void;
}

const ProductStatusCard = ({
  inStock,
  isWeightable,
  onInStockChange,
  onWeightableChange,
}: ProductStatusCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Product Status</CardTitle>
        <CardDescription>
          Manage availability and product settings
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* In Stock Toggle */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            inStock ? 'bg-accent/50' : 'bg-muted'
          }`}
        >
          <div className='flex items-center gap-3'>
            {inStock ? (
              <CheckCircle className='w-5 h-5 text-accent-foreground' />
            ) : (
              <XCircle className='w-5 h-5 text-muted-foreground' />
            )}
            <div>
              <p className='font-medium'>In Stock</p>
              <p className='text-xs text-muted-foreground'>
                Available for purchase
              </p>
            </div>
          </div>
          <Switch checked={inStock} onCheckedChange={onInStockChange} />
        </div>

        <Separator />

        {/* Weightable Toggle */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            isWeightable ? 'bg-primary/10' : 'bg-muted'
          }`}
        >
          <div className='flex items-center gap-3'>
            <Scale
              className={`w-5 h-5 ${
                isWeightable ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <div>
              <p className='font-medium'>Sold by Weight</p>
              <p className='text-xs text-muted-foreground'>
                Price per unit weight
              </p>
            </div>
          </div>
          <Switch
            checked={isWeightable}
            onCheckedChange={onWeightableChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductStatusCard;
