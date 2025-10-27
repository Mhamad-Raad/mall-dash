interface MiniStatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  sparklineData?: number[];
  icon?: React.ReactNode;
}

const MiniStatsCard = ({ title, value, change, sparklineData, icon }: MiniStatsCardProps) => {
  const max = sparklineData ? Math.max(...sparklineData) : 0;
  const min = sparklineData ? Math.min(...sparklineData) : 0;
  const range = max - min || 1;

  return (
    <div className='bg-card border rounded-lg p-4 hover:shadow-md transition-all'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <p className='text-sm text-muted-foreground font-medium mb-1'>{title}</p>
          <p className='text-2xl font-bold tabular-nums'>{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${
              change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <span>{change >= 0 ? '+' : ''}{change}%</span>
              <span className='text-muted-foreground'>vs last week</span>
            </div>
          )}
        </div>
        {icon && (
          <div className='p-2 rounded-lg bg-primary/10 text-primary'>
            {icon}
          </div>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData && sparklineData.length > 0 && (
        <div className='flex items-end gap-0.5 h-12'>
          {sparklineData.map((value, index) => {
            const heightPercent = ((value - min) / range) * 100;
            return (
              <div
                key={index}
                className='flex-1 bg-primary/30 hover:bg-primary/50 rounded-t transition-all cursor-pointer'
                style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                title={`${value}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MiniStatsCard;
