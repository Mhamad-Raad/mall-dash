import { Building2, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

interface OccupancyChartProps {
  totalApartments: number;
  occupied: number;
  totalBuildings: number;
}

export default function OccupancyChart({ totalApartments, occupied, totalBuildings }: OccupancyChartProps) {
  const vacant = totalApartments - occupied;
  const occupancyRate = (occupied / totalApartments) * 100;

  const chartData = [{ occupancy: 'rate', occupied: occupancyRate, fill: 'var(--color-occupied)' }];

  const chartConfig = {
    occupied: {
      label: 'Occupied',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Building2 className='size-5 text-primary' />
          <CardTitle className='text-lg'>Apartment Occupancy</CardTitle>
        </div>
        <CardDescription>Current occupancy status across all buildings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Radial Chart */}
          <div className='flex items-center justify-center'>
            <ChartContainer config={chartConfig} className='mx-auto aspect-square w-full max-w-[300px]'>
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={occupancyRate * 3.6}
                innerRadius={100}
                outerRadius={140}
              >
                <PolarGrid
                  gridType='circle'
                  radialLines={false}
                  stroke='none'
                  className='first:fill-muted last:fill-background'
                  polarRadius={[106, 94]}
                />
                <RadialBar dataKey='occupied' background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className='fill-foreground text-4xl font-bold'
                            >
                              {occupancyRate.toFixed(1)}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className='fill-muted-foreground'
                            >
                              Occupied
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </div>

          {/* Stats */}
          <div className='flex flex-col justify-center space-y-6'>
            {/* Occupied */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-4 h-4 rounded-full bg-chart-2' />
                <div>
                  <p className='text-sm text-muted-foreground'>Occupied</p>
                  <p className='text-2xl font-bold'>{occupied}</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm text-muted-foreground'>
                  {((occupied / totalApartments) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Vacant */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground/20' />
                <div>
                  <p className='text-sm text-muted-foreground'>Vacant</p>
                  <p className='text-2xl font-bold'>{vacant}</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm text-muted-foreground'>
                  {((vacant / totalApartments) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className='border-t' />

            {/* Total */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Home className='size-5 text-primary' />
                <div>
                  <p className='text-sm text-muted-foreground'>Total Apartments</p>
                  <p className='text-2xl font-bold text-primary'>{totalApartments}</p>
                </div>
              </div>
            </div>

            {/* Buildings */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Building2 className='size-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Buildings</p>
                  <p className='text-xl font-semibold'>{totalBuildings}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
