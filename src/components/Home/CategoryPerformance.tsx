interface CategoryPerformanceProps {
  data: { category: string; value: number; color: string }[];
}

const CategoryPerformance = ({ data }: CategoryPerformanceProps) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className='bg-card border rounded-lg p-4 hover:shadow-md transition-all'>
      <h3 className='text-sm font-semibold mb-4'>Top Categories</h3>
      
      <div className='space-y-3'>
        {data.map((item, index) => {
          const widthPercent = (item.value / maxValue) * 100;
          
          return (
            <div key={index} className='space-y-1.5'>
              <div className='flex items-center justify-between text-xs'>
                <div className='flex items-center gap-2'>
                  <div
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: item.color }}
                  />
                  <span className='font-medium'>{item.category}</span>
                </div>
                <span className='font-semibold tabular-nums text-muted-foreground'>
                  ${item.value}
                </span>
              </div>
              <div className='relative'>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='h-full rounded-full transition-all duration-500'
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPerformance;
