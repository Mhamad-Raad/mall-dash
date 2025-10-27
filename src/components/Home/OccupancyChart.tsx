import { Building2, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OccupancyChartProps {
  totalApartments: number;
  occupied: number;
  totalBuildings: number;
}

export default function OccupancyChart({ totalApartments, occupied, totalBuildings }: OccupancyChartProps) {
  const vacant = totalApartments - occupied;
  const occupancyRate = (occupied / totalApartments) * 100;
  
  // Calculate angles for the donut chart
  const occupiedAngle = (occupied / totalApartments) * 360;

  // SVG path for donut segments
  const radius = 80;
  const innerRadius = 55;
  const centerX = 100;
  const centerY = 100;

  const createArc = (startAngle: number, endAngle: number) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);

    const x3 = centerX + innerRadius * Math.cos(end);
    const y3 = centerY + innerRadius * Math.sin(end);
    const x4 = centerX + innerRadius * Math.cos(start);
    const y4 = centerY + innerRadius * Math.sin(start);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  };

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
          {/* Donut Chart */}
          <div className='flex items-center justify-center'>
            <div className='relative'>
              <svg width='280' height='280' viewBox='0 0 200 200'>
                {/* Vacant segment */}
                <path
                  d={createArc(occupiedAngle, 360)}
                  className='fill-muted transition-all duration-300 hover:opacity-80'
                />
                {/* Occupied segment */}
                <path
                  d={createArc(0, occupiedAngle)}
                  className='fill-green-500 dark:fill-green-400 transition-all duration-300 hover:opacity-90'
                />
                {/* Center circle for donut effect */}
                <circle cx={centerX} cy={centerY} r={innerRadius} className='fill-card' />
              </svg>
              
              {/* Center text */}
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <div className='text-4xl font-bold text-green-600 dark:text-green-400'>
                  {occupancyRate.toFixed(1)}%
                </div>
                <div className='text-xs text-muted-foreground'>Occupied</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className='flex flex-col justify-center space-y-6'>
            {/* Occupied */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-4 h-4 rounded-full bg-green-500' />
                <div>
                  <p className='text-sm text-muted-foreground'>Occupied</p>
                  <p className='text-2xl font-bold text-green-600 dark:text-green-400'>{occupied}</p>
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
                <div className='w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground/40' />
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
