import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Door, Room } from './types';
import { getRoomConfig } from './types';
import { cn } from '@/lib/utils';
import { DoorOpen, X } from 'lucide-react';

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
  const doorThickness = 8;

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
        !isDragging && 'transition-shadow duration-150',
        isSelected && 'ring-2 ring-primary ring-offset-1',
        isDragging && 'opacity-70'
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(door.id);
      }}
      {...listeners}
      {...attributes}
    >
      {/* Door visual - gradient showing connection */}
      <div
        className={cn(
          'w-full h-full rounded-sm relative overflow-hidden',
          'border-2 border-background shadow-md'
        )}
        style={{
          background: connectedRoom
            ? `linear-gradient(${isVertical ? '0deg' : '90deg'}, ${roomColor}, ${connectedColor})`
            : roomColor,
        }}
      >
        {/* Door icon */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <DoorOpen
            className='text-white drop-shadow-sm'
            style={{
              width: Math.min(isVertical ? doorThickness - 2 : doorWidthPx - 4, 16),
              height: Math.min(isVertical ? doorWidthPx - 4 : doorThickness - 2, 16),
            }}
          />
        </div>
      </div>

      {/* Delete button when selected */}
      {isSelected && (
        <button
          className={cn(
            'absolute -top-2 -right-2 w-4 h-4 rounded-full',
            'bg-destructive text-destructive-foreground',
            'flex items-center justify-center',
            'hover:bg-destructive/90 transition-colors',
            'shadow-md z-40'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(door.id);
          }}
        >
          <X className='w-3 h-3' />
        </button>
      )}

      {/* Tooltip showing connected rooms */}
      {isSelected && (
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 whitespace-nowrap',
            'px-2 py-1 rounded text-xs bg-popover text-popover-foreground',
            'border shadow-lg z-50',
            door.edge === 'top' || door.edge === 'left' ? 'top-full mt-1' : 'bottom-full mb-1'
          )}
        >
          {room.name}
          {connectedRoom && (
            <>
              <span className='mx-1 text-muted-foreground'>↔</span>
              {connectedRoom.name}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DoorMarker;
