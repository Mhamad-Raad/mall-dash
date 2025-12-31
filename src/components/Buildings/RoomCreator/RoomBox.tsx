import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Bed,
  Bath,
  CookingPot,
  Sofa,
  Utensils,
  Fence,
  Archive,
  Briefcase,
  Trash2,
  MoveHorizontal,
  DoorOpen,
} from 'lucide-react';
import type { Room } from './types';
import { getRoomConfig } from './types';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  bed: Bed,
  bath: Bath,
  'cooking-pot': CookingPot,
  sofa: Sofa,
  utensils: Utensils,
  fence: Fence,
  archive: Archive,
  briefcase: Briefcase,
  'move-horizontal': MoveHorizontal,
  'door-open': DoorOpen,
};

interface RoomBoxProps {
  room: Room;
  cellSize: number;
  isSelected: boolean;
  isOverlapping?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
}

export const RoomBox = ({
  room,
  cellSize,
  isSelected,
  isOverlapping = false,
  onSelect,
  onDelete,
  onResize,
}: RoomBoxProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const config = getRoomConfig(room.type);
  const IconComponent = ICON_MAP[config.icon];

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: room.id,
      data: { room },
      disabled: isResizing, // Disable drag while resizing
    });

  // Calculate pixel dimensions for responsive content
  const pixelWidth = room.width * cellSize;
  const pixelHeight = room.height * cellSize;
  const area = room.width * room.height;
  
  // Determine what to show based on room size
  const isVerySmall = pixelWidth < 80 || pixelHeight < 60;
  const isSmall = pixelWidth < 120 || pixelHeight < 80;

  // Only apply transform during active drag
  const style: React.CSSProperties = {
    position: 'absolute',
    left: room.x * cellSize,
    top: room.y * cellSize,
    width: pixelWidth,
    height: pixelHeight,
    transform: isDragging ? CSS.Translate.toString(transform) : undefined,
    zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
    touchAction: 'none',
  };

  // Resize handler factory
  const createResizeHandler = (
    direction: 'right' | 'bottom' | 'corner'
  ) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = room.width;
    const startHeight = room.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (direction === 'right' || direction === 'corner') {
        newWidth = Math.max(0.5, Math.round((startWidth + deltaX / cellSize) * 100) / 100);
      }
      if (direction === 'bottom' || direction === 'corner') {
        newHeight = Math.max(0.5, Math.round((startHeight + deltaY / cellSize) * 100) / 100);
      }
      
      onResize(room.id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg group overflow-hidden',
        'flex flex-col border',
        !isDragging && !isResizing && 'transition-all duration-150',
        isDragging && 'opacity-90 shadow-2xl cursor-grabbing scale-[1.02]',
        !isDragging && !isResizing && 'cursor-grab hover:shadow-lg',
        isResizing && 'cursor-nwse-resize',
        isSelected && 'ring-2 ring-primary ring-offset-2 shadow-lg',
        isOverlapping 
          ? 'border-red-500 bg-destructive/10 shadow-red-500/20' 
          : 'border-border/50 bg-card shadow-sm'
      )}
      title={`${room.name}\n${room.width}m × ${room.height}m\nArea: ${(room.width * room.height).toFixed(2)}m²`}
    >
      {/* Drag overlay - captures drag events */}
      <div
        className='absolute inset-0 z-10'
        onClick={(e) => {
          e.stopPropagation();
          onSelect(room.id);
        }}
        {...attributes}
        {...listeners}
      />
      {/* Color indicator bar with gradient */}
      <div 
        className='w-full shrink-0'
        style={{ 
          height: isVerySmall ? 3 : 4,
          background: isOverlapping 
            ? '#ef4444' 
            : `linear-gradient(90deg, ${config.color}, ${config.color}dd)`
        }}
      />
      
      {/* Main content */}
      <div className='flex-1 flex flex-col items-center justify-center p-1 min-h-0 relative'>
        {/* Delete button - always accessible on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(room.id);
          }}
          className={cn(
            'absolute top-0.5 right-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20',
            'bg-background/80 hover:bg-destructive hover:text-destructive-foreground',
            'shadow-sm border border-border/50',
            isVerySmall ? 'p-0.5' : 'p-1'
          )}
        >
          <Trash2 className={isVerySmall ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        </button>

        {/* Room icon - size based on room dimensions */}
        {IconComponent && (
          <div style={{ color: isOverlapping ? '#ef4444' : config.color }}>
            <IconComponent className={cn(
              isVerySmall ? 'w-4 h-4' : isSmall ? 'w-5 h-5' : 'w-6 h-6'
            )} />
          </div>
        )}
        
        {/* Room name - hidden on very small rooms */}
        {!isVerySmall && (
          <span
            className={cn(
              'font-medium text-center truncate max-w-full text-foreground',
              isSmall ? 'text-[10px] leading-tight' : 'text-xs mt-0.5'
            )}
          >
            {room.name || config.label}
          </span>
        )}
      </div>

      {/* Area footer - adapts to size */}
      <div 
        className={cn(
          'shrink-0 text-center font-medium border-t border-border',
          'bg-muted/50 text-muted-foreground',
          isVerySmall ? 'text-[8px] py-0.5 px-0.5' : isSmall ? 'text-[9px] py-0.5 px-1' : 'text-[10px] py-1 px-1.5'
        )}
      >
        {area.toFixed(2)}m²
      </div>

      {/* Resize handles - only show when selected, z-index above drag overlay */}
      {isSelected && !isDragging && (
        <>
          {/* Right resize handle */}
          <div
            className='absolute right-0 top-1/2 -translate-y-1/2 w-3 h-10 bg-primary hover:bg-primary/80 cursor-ew-resize rounded-l z-20'
            onMouseDown={createResizeHandler('right')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          {/* Bottom resize handle */}
          <div
            className='absolute bottom-0 left-1/2 -translate-x-1/2 h-3 w-10 bg-primary hover:bg-primary/80 cursor-ns-resize rounded-t z-20'
            onMouseDown={createResizeHandler('bottom')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          {/* Corner resize handle */}
          <div
            className='absolute bottom-0 right-0 w-4 h-4 bg-primary hover:bg-primary/80 cursor-nwse-resize rounded-tl z-20'
            onMouseDown={createResizeHandler('corner')}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </>
      )}
    </div>
  );
};
