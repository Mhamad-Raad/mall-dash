import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Door, Room } from './types';
import { getRoomConfig } from './types';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DoorMarkerProps {
  door: Door;
  room: Room;
  connectedRoom?: Room;
  cellSize: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DoorMarker = ({
  door,
  room,
  connectedRoom,
  cellSize,
  isSelected,
  onSelect,
  onDelete,
}: DoorMarkerProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `door-${door.id}`,
    data: { type: 'door', door, room },
  });

  const isVertical = door.edge === 'left' || door.edge === 'right';
  const doorWidthPx = door.width * cellSize;
  const doorThickness = 12;

  // Calculate door position based on edge and position
  let x = room.x * cellSize;
  let y = room.y * cellSize;

  if (door.edge === 'top') {
    x += room.width * cellSize * door.position - doorWidthPx / 2;
    y -= doorThickness / 2;
  } else if (door.edge === 'bottom') {
    x += room.width * cellSize * door.position - doorWidthPx / 2;
    y += room.height * cellSize - doorThickness / 2;
  } else if (door.edge === 'left') {
    x -= doorThickness / 2;
    y += room.height * cellSize * door.position - doorWidthPx / 2;
  } else if (door.edge === 'right') {
    x += room.width * cellSize - doorThickness / 2;
    y += room.height * cellSize * door.position - doorWidthPx / 2;
  }

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    left: x,
    top: y,
    width: isVertical ? doorThickness : doorWidthPx,
    height: isVertical ? doorWidthPx : doorThickness,
    touchAction: 'none',
  };

  const roomColor = getRoomConfig(room.type).color;
  const connectedColor = connectedRoom
    ? getRoomConfig(connectedRoom.type).color
    : roomColor;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'absolute cursor-grab active:cursor-grabbing z-30',
        isDragging && 'opacity-60'
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(door.id);
      }}
      {...listeners}
      {...attributes}
    >
      {/* Door opening - clean bar style matching room borders */}
      <div
        className={cn(
          'w-full h-full rounded-sm relative',
          isSelected && 'ring-1 ring-white ring-offset-1 ring-offset-background'
        )}
        style={{
          background: connectedRoom
            ? `linear-gradient(${isVertical ? '180deg' : '90deg'}, ${roomColor}, ${connectedColor})`
            : roomColor,
        }}
      >
        {/* Inner line to show door opening */}
        <div 
          className={cn(
            'absolute bg-background/80',
            isVertical 
              ? 'left-1/2 -translate-x-1/2 top-2 bottom-2 w-0.5' 
              : 'top-1/2 -translate-y-1/2 left-2 right-2 h-0.5'
          )}
        />
      </div>

      {/* Delete button when selected */}
      {isSelected && (
        <button
          className={cn(
            'absolute w-4 h-4 rounded-full',
            'bg-destructive text-destructive-foreground',
            'flex items-center justify-center',
            'hover:bg-destructive/90',
            'z-40',
            isVertical ? '-top-2 left-1/2 -translate-x-1/2' : '-right-2 top-1/2 -translate-y-1/2'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(door.id);
          }}
        >
          <X className='w-2.5 h-2.5' />
        </button>
      )}

      {/* Tooltip showing connected rooms */}
      {isSelected && (
        <div
          className={cn(
            'absolute whitespace-nowrap',
            'px-2 py-1.5 rounded text-xs bg-popover text-popover-foreground',
            'border shadow-md z-50',
            isVertical 
              ? 'left-full ml-2 top-1/2 -translate-y-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          )}
        >
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <span 
                className='w-2 h-2 rounded-full' 
                style={{ backgroundColor: roomColor }}
              />
              <span className='font-medium'>{room.name}</span>
            </div>
            <span className='text-muted-foreground'>↔</span>
            <div className='flex items-center gap-1'>
              <span 
                className='w-2 h-2 rounded-full' 
                style={{ backgroundColor: connectedColor }}
              />
              <span className='font-medium'>{connectedRoom?.name || 'Outside'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoorMarker;
