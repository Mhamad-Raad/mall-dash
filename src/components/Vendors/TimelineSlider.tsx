import { useState, useCallback, memo } from 'react';

interface TimelineSliderProps {
  openingTime: string;
  closeTime: string;
  onTimeChange: (type: 'open' | 'close', time: string) => void;
  disabled?: boolean;
}

const TimelineSlider = memo(({ openingTime, closeTime, onTimeChange, disabled }: TimelineSliderProps) => {
  const [isDraggingOpen, setIsDraggingOpen] = useState(false);
  const [isDraggingClose, setIsDraggingClose] = useState(false);

  const handleTimeSliderDrag = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    type: 'open' | 'close'
  ) => {
    if (disabled) return;
    
    const timeline = e.currentTarget.parentElement;
    if (!timeline) return;

    const updateTime = (clientX: number) => {
      const rect = timeline.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const totalMinutes = Math.round(percent * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      if (type === 'open') {
        setIsDraggingOpen(true);
      } else {
        setIsDraggingClose(true);
      }
      
      onTimeChange(type, timeString);
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      updateTime(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      setIsDraggingOpen(false);
      setIsDraggingClose(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    e.preventDefault();
    updateTime(e.clientX);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, onTimeChange]);

  if (!openingTime || !closeTime) return null;

  const [openHour, openMin] = openingTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);
  const openPercent = ((openHour * 60 + openMin) / (24 * 60)) * 100;
  const closePercent = ((closeHour * 60 + closeMin) / (24 * 60)) * 100;
  const width = closePercent - openPercent;
  const totalMinutes = (closeHour * 60 + closeMin) - (openHour * 60 + openMin);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Get color based on hour of day
  const getColorForHour = (hour: number) => {
    if (hour >= 5 && hour < 12) return '#fbbf24'; // Morning: golden yellow
    if (hour >= 12 && hour < 17) return '#60a5fa'; // Afternoon: bright blue
    if (hour >= 17 && hour < 20) return '#f97316'; // Evening: orange
    return '#6366f1'; // Night: indigo
  };

  const startColor = getColorForHour(openHour);
  const endColor = getColorForHour(closeHour);

  const getScheduleLabel = () => {
    if (openHour < 12 && closeHour <= 14) return '🌅 Morning hours';
    if (openHour < 12 && closeHour >= 17) return '☀️ All day service';
    if (openHour >= 17) return '🌙 Evening/night hours';
    if (openHour >= 12 && closeHour < 17) return '🌤️ Afternoon hours';
    return '📅 Custom schedule';
  };

  return (
    <div className='p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20'>
      <div className='flex items-center justify-between mb-3'>
        <p className='text-sm font-semibold text-primary'>Business Schedule</p>
        {totalMinutes > 0 && (
          <span className='text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded'>
            {hours}h {minutes > 0 ? `${minutes}m` : ''} open
          </span>
        )}
      </div>

      {/* 24-hour timeline */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between text-xs text-muted-foreground mb-1 px-1'>
          <span className='font-medium'>12 AM</span>
          <span>6 AM</span>
          <span className='font-medium'>12 PM</span>
          <span>6 PM</span>
          <span className='font-medium'>11 PM</span>
        </div>
        <div className='relative h-10 bg-muted/50 rounded-full shadow-inner' style={{ overflow: 'visible' }}>
          {/* Hour markers background */}
          <div className='absolute inset-0 flex overflow-hidden rounded-full'>
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className='flex-1 border-r border-muted-foreground/5 last:border-r-0'
              />
            ))}
          </div>
          
          {width > 0 && (
            <>
              {/* Active hours bar with gradient and animation */}
              <div 
                className='absolute h-full transition-all duration-500 ease-in-out shadow-lg rounded-full overflow-hidden pointer-events-none'
                style={{ 
                  left: `${openPercent}%`, 
                  width: `${width}%`,
                  opacity: 0.85,
                  background: `linear-gradient(to right, ${startColor}, ${endColor})`
                }}
              >
                {/* Shimmer effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer' 
                     style={{
                       backgroundSize: '200% 100%',
                       animation: 'shimmer 3s infinite'
                     }}
                />
              </div>
              
              {/* Opening marker with pulse */}
              <div 
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group select-none ${
                  disabled ? 'cursor-not-allowed' : isDraggingOpen ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{ left: `${openPercent}%`, zIndex: 100 }}
                onMouseDown={(e) => handleTimeSliderDrag(e, 'open')}
              >
                <div className='relative'>
                  <div className={`w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg transition-transform ${
                    isDraggingOpen ? 'scale-125' : 'group-hover:scale-125'
                  } ${disabled ? 'opacity-50' : ''}`} />
                  {!isDraggingOpen && !disabled && (
                    <div className='absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75' />
                  )}
                </div>
                {!disabled && (
                  <div className='absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200'>
                    <div className='bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap'>
                      {isDraggingOpen ? openingTime : 'Drag to adjust'}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Closing marker with pulse */}
              <div 
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group select-none ${
                  disabled ? 'cursor-not-allowed' : isDraggingClose ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{ left: `${closePercent}%`, zIndex: 100 }}
                onMouseDown={(e) => handleTimeSliderDrag(e, 'close')}
              >
                <div className='relative'>
                  <div className={`w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg transition-transform ${
                    isDraggingClose ? 'scale-125' : 'group-hover:scale-125'
                  } ${disabled ? 'opacity-50' : ''}`} />
                  {!isDraggingClose && !disabled && (
                    <div className='absolute inset-0 w-4 h-4 bg-orange-500 rounded-full animate-ping opacity-75' />
                  )}
                </div>
                {!disabled && (
                  <div className='absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200'>
                    <div className='bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap'>
                      {isDraggingClose ? closeTime : 'Drag to adjust'}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Time labels with enhanced styling */}
        <div className='flex items-center justify-between text-xs pt-1'>
          <div className='flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800'>
            <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
            <span className='font-semibold text-emerald-700 dark:text-emerald-400'>{openingTime}</span>
            <span className='text-emerald-600 dark:text-emerald-500 text-[10px]'>OPEN</span>
          </div>
          <div className='flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800'>
            <span className='text-orange-600 dark:text-orange-500 text-[10px]'>CLOSE</span>
            <span className='font-semibold text-orange-700 dark:text-orange-400'>{closeTime}</span>
            <div className='w-2 h-2 rounded-full bg-orange-500 animate-pulse'></div>
          </div>
        </div>
      </div>
      
      {/* Additional info */}
      <div className='mt-3 pt-3 border-t border-primary/20'>
        <p className='text-xs text-muted-foreground'>
          {getScheduleLabel()}
        </p>
      </div>
    </div>
  );
});

TimelineSlider.displayName = 'TimelineSlider';

export default TimelineSlider;
