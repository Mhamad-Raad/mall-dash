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
  MoveHorizontal,
  DoorOpen,
  Trash2,
  Copy,
} from 'lucide-react';
import type { Room } from './types';
import { getRoomConfig } from './types';
import { cn } from '@/lib/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

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

type ResizeDirection = 
  | 'top' | 'bottom' | 'left' | 'right' 
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface RoomBoxProps {
  room: Room;
  cellSize: number;
  isSelected: boolean;
  isOverlapping?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onResize: (id: string, width: number, height: number, deltaX?: number, deltaY?: number) => void;
}

export const RoomBox = ({
  room,
  cellSize,
  isSelected,
  isOverlapping = false,
  onSelect,
  onDelete,
  onDuplicate,
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

  // Resize handler factory - supports all 8 directions
  const createResizeHandler = (direction: ResizeDirection) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startWidth = room.width;
    const startHeight = room.height;
    const startX = room.x;
    const startY = room.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const mouseDeltaX = moveEvent.clientX - startMouseX;
      const mouseDeltaY = moveEvent.clientY - startMouseY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let positionDeltaX: number | undefined;
      let positionDeltaY: number | undefined;
      
      // Handle horizontal resizing
      if (direction.includes('right')) {
        // Expanding/shrinking from right - just change width
        newWidth = Math.max(0.5, Math.round((startWidth + mouseDeltaX / cellSize) * 100) / 100);
      } else if (direction.includes('left')) {
        // Expanding/shrinking from left - change width and move position
        const widthChange = -mouseDeltaX / cellSize;
        newWidth = Math.max(0.5, Math.round((startWidth + widthChange) * 100) / 100);
        // Position moves by the inverse of the width change
        const actualWidthChange = newWidth - startWidth;
        positionDeltaX = -actualWidthChange;
        // Prevent moving past origin
        if (startX + positionDeltaX < 0) {
          positionDeltaX = -startX;
          newWidth = startWidth + startX;
        }
      }
      
      // Handle vertical resizing
      if (direction.includes('bottom')) {
        // Expanding/shrinking from bottom - just change height
        newHeight = Math.max(0.5, Math.round((startHeight + mouseDeltaY / cellSize) * 100) / 100);
      } else if (direction.includes('top')) {
        // Expanding/shrinking from top - change height and move position
        const heightChange = -mouseDeltaY / cellSize;
        newHeight = Math.max(0.5, Math.round((startHeight + heightChange) * 100) / 100);
        // Position moves by the inverse of the height change
        const actualHeightChange = newHeight - startHeight;
        positionDeltaY = -actualHeightChange;
        // Prevent moving past origin
        if (startY + positionDeltaY < 0) {
          positionDeltaY = -startY;
          newHeight = startHeight + startY;
        }
      }
      
      onResize(room.id, newWidth, newHeight, positionDeltaX, positionDeltaY);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Get cursor style for resize direction
  const getCursor = (direction: ResizeDirection): string => {
    switch (direction) {
      case 'top':
      case 'bottom':
        return 'cursor-ns-resize';
      case 'left':
      case 'right':
        return 'cursor-ew-resize';
      case 'top-left':
      case 'bottom-right':
        return 'cursor-nwse-resize';
      case 'top-right':
      case 'bottom-left':
        return 'cursor-nesw-resize';
    }
  };

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild disabled={isDragging || isResizing}>
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
          {/* Edge resize handles */}
          {/* Top */}
          <div
            className={cn('absolute top-0 left-1/2 -translate-x-1/2 h-2 w-8 bg-primary/80 hover:bg-primary rounded-b z-20', getCursor('top'))}
            onMouseDown={createResizeHandler('top')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          {/* Bottom */}
          <div
            className={cn('absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-8 bg-primary/80 hover:bg-primary rounded-t z-20', getCursor('bottom'))}
            onMouseDown={createResizeHandler('bottom')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          {/* Left */}
          <div
            className={cn('absolute left-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary/80 hover:bg-primary rounded-r z-20', getCursor('left'))}
            onMouseDown={createResizeHandler('left')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          {/* Right */}
          <div
            className={cn('absolute right-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary/80 hover:bg-primary rounded-l z-20', getCursor('right'))}
            onMouseDown={createResizeHandler('right')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          
          {/* Corner resize handles */}
          {/* Top-Left */}
          <div
            className={cn('absolute top-0 left-0 w-3 h-3 bg-primary hover:bg-primary/80 rounded-br z-20', getCursor('top-left'))}
            onMouseDown={createResizeHandler('top-left')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          {/* Top-Right */}
          <div
            className={cn('absolute top-0 right-0 w-3 h-3 bg-primary hover:bg-primary/80 rounded-bl z-20', getCursor('top-right'))}
            onMouseDown={createResizeHandler('top-right')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          {/* Bottom-Left */}
          <div
            className={cn('absolute bottom-0 left-0 w-3 h-3 bg-primary hover:bg-primary/80 rounded-tr z-20', getCursor('bottom-left'))}
            onMouseDown={createResizeHandler('bottom-left')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          {/* Bottom-Right */}
          <div
            className={cn('absolute bottom-0 right-0 w-3 h-3 bg-primary hover:bg-primary/80 rounded-tl z-20', getCursor('bottom-right'))}
            onMouseDown={createResizeHandler('bottom-right')}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </>
      )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onDuplicate(room.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem 
          variant="destructive" 
          onClick={() => onDelete(room.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Room
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
