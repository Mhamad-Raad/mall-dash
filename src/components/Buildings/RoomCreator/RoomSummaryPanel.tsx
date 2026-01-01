import { DoorOpen } from 'lucide-react';
import { getRoomConfig } from './types';
import type { Room, Door, RoomType } from './types';

interface RoomSummaryPanelProps {
  rooms: Room[];
  doors: Door[];
}

export const RoomSummaryPanel = ({ rooms, doors }: RoomSummaryPanelProps) => {
  if (rooms.length === 0) return null;

  return (
    <div className='p-3 bg-muted/20 rounded-lg border'>
      <p className='text-[10px] text-muted-foreground mb-1.5'>Room Summary</p>
      <div className='space-y-0.5'>
        {Object.entries(
          rooms.reduce((acc, room) => {
            acc[room.type] = (acc[room.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([type, count]) => (
          <div key={type} className='flex items-center justify-between text-xs'>
            <div className='flex items-center gap-1.5'>
              <div
                className='w-1.5 h-1.5 rounded-full'
                style={{ backgroundColor: getRoomConfig(type as RoomType).color }}
              />
              <span>{getRoomConfig(type as RoomType).label}</span>
            </div>
            <span className='text-muted-foreground'>{count}</span>
          </div>
        ))}
        {doors.length > 0 && (
          <div className='flex items-center justify-between text-xs pt-0.5 mt-0.5 border-t'>
            <div className='flex items-center gap-1.5'>
              <DoorOpen className='w-2.5 h-2.5 text-amber-500' />
              <span>Doors</span>
            </div>
            <span className='text-muted-foreground'>{doors.length}</span>
          </div>
        )}
      </div>
      
      <div className='mt-2 pt-2 border-t'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-medium'>Total Area</span>
          <span className='text-xs font-semibold text-primary'>
            {rooms.reduce((sum, room) => sum + room.width * room.height, 0).toFixed(2)} m²
          </span>
        </div>
      </div>
    </div>
  );
};
