import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface CategoryPerformanceProps {
  data: { category: string; value: number; color: string }[];
}

const CategoryPerformance = ({ data }: CategoryPerformanceProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const chartData = data.map((item, index) => ({
    category: item.category,
    value: item.value,
    fill: `var(--chart-${index + 1})`,
  }));

  const chartConfig = data.reduce((config, item, index) => {
    config[item.category.toLowerCase().replace(/\s+/g, '')] = {
      label: item.category,
      color: `var(--chart-${index + 1})`,
    };
    return config;
  }, {} as ChartConfig);

  const totalRevenue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <TrendingUp className='size-5 text-primary' />
            <CardTitle className='text-lg'>Top Categories</CardTitle>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='current'>This Month</SelectItem>
              <SelectItem value='last'>Last Month</SelectItem>
              <SelectItem value='year'>This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          {selectedPeriod === 'current' && `${currentMonth} ${currentYear}`}
          {selectedPeriod === 'last' && 
            `${new Date(currentYear, currentDate.getMonth() - 1).toLocaleString('default', { month: 'long' })} ${currentYear}`}
          {selectedPeriod === 'year' && `${currentYear}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Bar Chart */}
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{ top: 20, right: 12, bottom: 0, left: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='category'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 10)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey='value' radius={8} />
            </BarChart>
          </ChartContainer>

          {/* Category Stats */}
          <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
            {data.map((item, index) => {
              const revenuePercent = ((item.value / totalRevenue) * 100).toFixed(1);
              return (
                <div key={index} className='flex items-center gap-3'>
                  <div className='w-3 h-3 rounded-full' style={{ backgroundColor: `var(--chart-${index + 1})` }} />
                  <div className='flex-1'>
                    <p className='text-sm text-muted-foreground'>{item.category}</p>
                    <div className='flex items-center justify-between'>
                      <p className='text-xl font-bold'>${(item.value / 1000).toFixed(1)}k</p>
                      <p className='text-sm text-muted-foreground'>{revenuePercent}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPerformance;
