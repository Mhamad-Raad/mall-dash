import { DollarSign, TrendingDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ProductPricingCardProps {
  price: string;
  discountPrice: string;
  onPriceChange: (price: string) => void;
  onDiscountPriceChange: (discountPrice: string) => void;
}

const ProductPricingCard = ({
  price,
  discountPrice,
  onPriceChange,
  onDiscountPriceChange,
}: ProductPricingCardProps) => {
  // Calculate discount percentage
  const discountPercentage = (() => {
    const priceNum = parseFloat(price);
    const discountNum = parseFloat(discountPrice);
    if (!isNaN(priceNum) && !isNaN(discountNum) && priceNum > 0 && discountNum < priceNum) {
      return Math.round(((priceNum - discountNum) / priceNum) * 100);
    }
    return 0;
  })();

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Pricing</CardTitle>
        <CardDescription>Set product pricing and discounts</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label
            htmlFor='price'
            className='text-sm font-medium flex items-center gap-2'
          >
            <DollarSign className='size-4 text-primary' />
            Regular Price <span className='text-destructive'>*</span>
          </Label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium'>
              $
            </span>
            <Input
              id='price'
              type='number'
              step='0.01'
              min='0'
              placeholder='0.00'
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              className='h-11 pl-7'
              required
            />
          </div>
        </div>
        <Separator />
        <div className='space-y-2'>
          <Label
            htmlFor='discountPrice'
            className='text-sm font-medium flex items-center gap-2'
          >
            <TrendingDown className='size-4 text-accent-foreground' />
            Discount Price
            {discountPercentage > 0 && (
              <Badge
                variant='secondary'
                className='ml-auto text-xs font-normal bg-accent/50 text-accent-foreground'
              >
                {discountPercentage}% off
              </Badge>
            )}
          </Label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium'>
              $
            </span>
            <Input
              id='discountPrice'
              type='number'
              step='0.01'
              min='0'
              placeholder='0.00'
              value={discountPrice}
              onChange={(e) => onDiscountPriceChange(e.target.value)}
              className='h-11 pl-7'
            />
          </div>
          {discountPrice && parseFloat(discountPrice) >= parseFloat(price) && (
            <p className='text-xs text-destructive'>
              Discount price should be less than regular price
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPricingCard;
