interface OrderStatusChartProps {
  data: { status: string; count: number; color: string }[];
}

const OrderStatusChart = ({ data }: OrderStatusChartProps) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className='bg-card border rounded-lg p-4 hover:shadow-md transition-all'>
      <h3 className='text-sm font-semibold mb-4'>Order Status Distribution</h3>
      
      {/* Progress Bars */}
      <div className='space-y-3'>
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          
          return (
            <div key={index} className='space-y-1'>
              <div className='flex items-center justify-between text-xs'>
                <span className='font-medium text-muted-foreground'>{item.status}</span>
                <span className='font-semibold tabular-nums'>{item.count}</span>
              </div>
              <div className='h-2 bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full transition-all duration-500'
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className='mt-4 pt-3 border-t flex items-center justify-between'>
        <span className='text-sm font-medium text-muted-foreground'>Total Orders</span>
        <span className='text-lg font-bold tabular-nums'>{total}</span>
      </div>
    </div>
  );
};

export default OrderStatusChart;
