import { TrendingUp } from 'lucide-react';

interface ActivityChartProps {
  data: { label: string; value: number }[];
  title: string;
  trend?: number;
}

const ActivityChart = ({ data, title, trend }: ActivityChartProps) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const roundedMax = Math.ceil(maxValue / 10) * 10; // Round up to nearest 10
  
  // Generate y-axis labels (5 horizontal lines)
  const yAxisSteps = 5;
  const yAxisLabels = Array.from({ length: yAxisSteps }, (_, i) => {
    return Math.round((roundedMax / (yAxisSteps - 1)) * i);
  }).reverse();
  
  return (
    <div className='w-full h-full flex flex-col'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold'>{title}</h3>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <TrendingUp className={`size-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      {/* Chart Container with Grid */}
      <div className='relative flex gap-4'>
        {/* Y-Axis Labels */}
        <div className='flex flex-col justify-between h-[200px] text-xs text-muted-foreground font-medium min-w-[2rem] text-right'>
          {yAxisLabels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>

        {/* Chart Area with Grid Lines */}
        <div className='relative flex-1 h-[200px]'>
          {/* Grid Lines */}
          <div className='absolute inset-0 flex flex-col justify-between pointer-events-none'>
            {yAxisLabels.map((_, index) => (
              <div key={index} className='w-full border-t border-border/40' />
            ))}
          </div>

          {/* Bars Container */}
          <div className='absolute inset-0 flex items-end justify-between gap-2 px-2'>
            {data.map((item, index) => {
              const heightPercentage = (item.value / roundedMax) * 100;
              
              return (
                <div key={index} className='flex flex-col items-center gap-2 flex-1 group h-full justify-end pb-8'>
                  {/* Bar */}
                  <div
                    className='w-full bg-gradient-to-t from-primary to-primary/70 hover:from-primary hover:to-primary/90 rounded-t-lg transition-all duration-300 group-hover:scale-105 shadow-sm relative'
                    style={{ height: `${heightPercentage}%`, minHeight: heightPercentage > 0 ? '4px' : '0' }}
                  >
                    {/* Tooltip on hover */}
                    <div className='absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border shadow-lg z-20'>
                      <div className='text-center'>
                        <div className='font-bold'>{item.value}</div>
                        <div className='text-[10px] text-muted-foreground'>{item.label}</div>
                      </div>
                      {/* Arrow */}
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-r border-b rotate-45' />
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className='text-xs text-muted-foreground font-semibold whitespace-nowrap absolute -bottom-6'>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X-Axis Line */}
      <div className='ml-[3rem] mt-2 border-t-2 border-border' />
    </div>
  );
};

export default ActivityChart;
