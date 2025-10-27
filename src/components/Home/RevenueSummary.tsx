import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompact } from '@/lib/formatNumbers';

interface RevenueSummaryProps {
  totalRevenue: number;
  monthlyGrowth: number;
  avgOrderValue: number;
  topVendorRevenue: { name: string; amount: number };
}

const RevenueSummary = ({
  totalRevenue,
  monthlyGrowth,
  avgOrderValue,
  topVendorRevenue,
}: RevenueSummaryProps) => {
  const isPositiveGrowth = monthlyGrowth >= 0;

  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold'>Revenue Overview</CardTitle>
          <div className='p-2 rounded-full bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'>
            <DollarSign className='size-5' />
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Total Revenue */}
        <div className='space-y-1'>
          <p className='text-sm text-muted-foreground font-medium'>Total Revenue</p>
          <div className='flex items-baseline gap-2'>
            <p className='text-3xl font-bold tabular-nums'>${formatCompact(totalRevenue)}</p>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositiveGrowth
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isPositiveGrowth ? (
                <TrendingUp className='size-4' />
              ) : (
                <TrendingDown className='size-4' />
              )}
              <span>{Math.abs(monthlyGrowth)}%</span>
            </div>
          </div>
          <p className='text-xs text-muted-foreground'>vs last month</p>
        </div>

        <div className='h-px bg-border' />

        {/* Average Order Value */}
        <div className='space-y-1'>
          <p className='text-sm text-muted-foreground font-medium'>Avg Order Value</p>
          <p className='text-2xl font-bold tabular-nums'>${formatCompact(avgOrderValue)}</p>
        </div>

        <div className='h-px bg-border' />

        {/* Top Vendor */}
        <div className='space-y-2'>
          <p className='text-sm text-muted-foreground font-medium'>Top Performing Vendor</p>
          <div className='flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors'>
            <div className='space-y-0.5'>
              <p className='text-sm font-semibold'>{topVendorRevenue.name}</p>
              <p className='text-xs text-muted-foreground'>This month</p>
            </div>
            <div className='flex items-center gap-2'>
              <p className='text-lg font-bold tabular-nums'>${formatCompact(topVendorRevenue.amount)}</p>
              <ArrowUpRight className='size-4 text-green-600 dark:text-green-400' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueSummary;
