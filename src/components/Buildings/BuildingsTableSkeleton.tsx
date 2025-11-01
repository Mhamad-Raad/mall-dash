const BuildingsTableSkeleton = () => (
  <div className='w-full bg-card rounded-lg border p-6 animate-pulse'>
    {/* Table header skeleton */}
    <div className='flex gap-8 mb-4'>
      <div className='h-6 bg-muted rounded w-1/4'></div>
      <div className='h-6 bg-muted rounded w-1/4'></div>
      <div className='h-6 bg-muted rounded w-1/4'></div>
      <div className='h-6 bg-muted rounded w-1/4'></div>
    </div>
    {/* Table rows skeleton */}
    {Array.from({ length: 5 }).map((_, idx) => (
      <div key={idx} className='flex gap-8 mb-2'>
        <div className='h-5 bg-muted rounded w-1/4'></div>
        <div className='h-5 bg-muted rounded w-1/4'></div>
        <div className='h-5 bg-muted rounded w-1/4'></div>
        <div className='h-5 bg-muted rounded w-1/4'></div>
      </div>
    ))}
  </div>
);

export default BuildingsTableSkeleton;
