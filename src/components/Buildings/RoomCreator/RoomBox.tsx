import { useState, useEffect, useRef, memo } from 'react';
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

type ResizeDirection = 
  | 'top' | 'bottom' | 'left' | 'right' 
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface RoomBoxProps {
  room: Room;
  cellSize: number;
  isSelected: boolean;
  isOverlapping?: boolean;
  offsetX?: number;
  offsetY?: number;
  onSelect: (id: string) => void;
  onResize: (id: string, width: number, height: number, deltaX?: number, deltaY?: number, isResizing?: boolean) => void;
}

// Custom comparison to prevent unnecessary re-renders
const arePropsEqual = (prevProps: RoomBoxProps, nextProps: RoomBoxProps): boolean => {
  const prevRoom = prevProps.room;
  const nextRoom = nextProps.room;
  
  if (
    prevRoom.id !== nextRoom.id ||
    prevRoom.type !== nextRoom.type ||
    prevRoom.name !== nextRoom.name ||
    prevRoom.x !== nextRoom.x ||
    prevRoom.y !== nextRoom.y ||
    prevRoom.width !== nextRoom.width ||
    prevRoom.height !== nextRoom.height
  ) {
    return false;
  }
  
  if (
    prevProps.cellSize !== nextProps.cellSize ||
    prevProps.isSelected !== nextProps.isSelected ||
    prevProps.isOverlapping !== nextProps.isOverlapping ||
    prevProps.offsetX !== nextProps.offsetX ||
    prevProps.offsetY !== nextProps.offsetY
  ) {
    return false;
  }
  
  return true;
};

// Pure visual component - isolated from DndContext
const RoomBoxVisual = memo(function RoomBoxVisual({
  room,
  cellSize,
  isSelected,
  isOverlapping = false,
  offsetX = 0,
  offsetY = 0,
  onSelect,
  onResize,
  dragRef,
  dragListeners,
  dragAttributes,
  transform,
  isDragging,
}: RoomBoxProps & {
  dragRef?: (node: HTMLElement | null) => void;
  dragListeners?: Record<string, any>;
  dragAttributes?: Record<string, any>;
  transform?: { x: number; y: number } | null;
  isDragging?: boolean;
}) {
  
  const [isResizing, setIsResizing] = useState(false);
  const config = getRoomConfig(room.type);
  const IconComponent = ICON_MAP[config.icon];
  const mouseHandlersRef = useRef<{
    handleMouseMove: ((e: MouseEvent) => void) | null;
    handleMouseUp: (() => void) | null;
  }>({ handleMouseMove: null, handleMouseUp: null });

  useEffect(() => {
    return () => {
      if (mouseHandlersRef.current.handleMouseMove) {
        document.removeEventListener('mousemove', mouseHandlersRef.current.handleMouseMove);
      }
      if (mouseHandlersRef.current.handleMouseUp) {
        document.removeEventListener('mouseup', mouseHandlersRef.current.handleMouseUp);
      }
    };
  }, []);

  const pixelWidth = room.width * cellSize;
  const pixelHeight = room.height * cellSize;
  const area = room.width * room.height;
  
  const isVerySmall = pixelWidth < 80 || pixelHeight < 60;
  const isSmall = pixelWidth < 120 || pixelHeight < 80;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: (room.x + offsetX) * cellSize,
    top: (room.y + offsetY) * cellSize,
    width: pixelWidth,
    height: pixelHeight,
    transform: isDragging && transform ? CSS.Translate.toString({ ...transform, scaleX: 1, scaleY: 1 }) : undefined,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
    touchAction: 'none',
  };

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
    
    let lastWidth = startWidth;
    let lastHeight = startHeight;
    let lastDeltaX: number | undefined;
    let lastDeltaY: number | undefined;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const mouseDeltaX = moveEvent.clientX - startMouseX;
      const mouseDeltaY = moveEvent.clientY - startMouseY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let positionDeltaX: number | undefined;
      let positionDeltaY: number | undefined;
      
      if (direction.includes('right')) {
        newWidth = Math.max(0.5, Math.round((startWidth + mouseDeltaX / cellSize) * 10000) / 10000);
      } else if (direction.includes('left')) {
        const widthChange = -mouseDeltaX / cellSize;
        newWidth = Math.max(0.5, Math.round((startWidth + widthChange) * 10000) / 10000);
        const actualWidthChange = newWidth - startWidth;
        positionDeltaX = -actualWidthChange;
        if (startX + positionDeltaX < 0) {
          positionDeltaX = -startX;
          newWidth = startWidth + startX;
        }
      }
      
      if (direction.includes('bottom')) {
        newHeight = Math.max(0.5, Math.round((startHeight + mouseDeltaY / cellSize) * 10000) / 10000);
      } else if (direction.includes('top')) {
        const heightChange = -mouseDeltaY / cellSize;
        newHeight = Math.max(0.5, Math.round((startHeight + heightChange) * 10000) / 10000);
        const actualHeightChange = newHeight - startHeight;
        positionDeltaY = -actualHeightChange;
        if (startY + positionDeltaY < 0) {
          positionDeltaY = -startY;
          newHeight = startHeight + startY;
        }
      }
      
      lastWidth = newWidth;
      lastHeight = newHeight;
      lastDeltaX = positionDeltaX;
      lastDeltaY = positionDeltaY;
      
      onResize(room.id, newWidth, newHeight, positionDeltaX, positionDeltaY, true);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      onResize(room.id, lastWidth, lastHeight, lastDeltaX, lastDeltaY, false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      mouseHandlersRef.current = { handleMouseMove: null, handleMouseUp: null };
    };

    mouseHandlersRef.current = { handleMouseMove, handleMouseUp };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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
    <div
      ref={dragRef}
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
      onClick={(e) => {
        if (!isResizing && !isDragging) {
          e.stopPropagation();
          onSelect(room.id);
        }
      }}
    >
      {dragListeners && dragAttributes && (
        <div
          className='absolute inset-0 z-10'
          {...dragAttributes}
          {...dragListeners}
        />
      )}
      
      <div 
        className='w-full shrink-0'
        style={{ 
          height: isVerySmall ? 3 : 4,
          background: isOverlapping 
            ? '#ef4444' 
            : `linear-gradient(90deg, ${config.color}, ${config.color}dd)`
        }}
      />
      
      <div className='flex-1 flex flex-col items-center justify-center p-1 min-h-0 relative'>
        {IconComponent && (
          <div style={{ color: isOverlapping ? '#ef4444' : config.color }}>
            <IconComponent className={cn(
              isVerySmall ? 'w-4 h-4' : isSmall ? 'w-5 h-5' : 'w-6 h-6'
            )} />
          </div>
        )}
        
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

      <div 
        className={cn(
          'shrink-0 text-center font-medium border-t border-border',
          'bg-muted/50 text-muted-foreground',
          isVerySmall ? 'text-[8px] py-0.5 px-0.5' : isSmall ? 'text-[9px] py-0.5 px-1' : 'text-[10px] py-1 px-1.5'
        )}
      >
        {area.toFixed(2)}m²
      </div>

      {isSelected && !isDragging && (
        <>
          <div
            className={cn('absolute top-0 left-1/2 -translate-x-1/2 h-2 w-8 bg-primary/80 hover:bg-primary rounded-b z-20', getCursor('top'))}
            onMouseDown={createResizeHandler('top')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <div
            className={cn('absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-8 bg-primary/80 hover:bg-primary rounded-t z-20', getCursor('bottom'))}
            onMouseDown={createResizeHandler('bottom')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <div
            className={cn('absolute left-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary/80 hover:bg-primary rounded-r z-20', getCursor('left'))}
            onMouseDown={createResizeHandler('left')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <div
            className={cn('absolute right-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary/80 hover:bg-primary rounded-l z-20', getCursor('right'))}
            onMouseDown={createResizeHandler('right')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <div
            className={cn('absolute top-0 left-0 w-3 h-3 bg-primary hover:bg-primary/80 rounded-br z-20', getCursor('top-left'))}
            onMouseDown={createResizeHandler('top-left')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <div
            className={cn('absolute top-0 right-0 w-3 h-3 bg-primary hover:bg-primary/80 rounded-bl z-20', getCursor('top-right'))}
            onMouseDown={createResizeHandler('top-right')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <div
            className={cn('absolute bottom-0 left-0 w-3 h-3 bg-primary hover:bg-primary/80 rounded-tr z-20', getCursor('bottom-left'))}
            onMouseDown={createResizeHandler('bottom-left')}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <div
            className={cn('absolute bottom-0 right-0 w-3 h-3 bg-primary hover:bg-primary/80 rounded-tl z-20', getCursor('bottom-right'))}
            onMouseDown={createResizeHandler('bottom-right')}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </>
      )}
    </div>
  );
}, arePropsEqual);

// Draggable wrapper - only this re-renders on drag events from DndContext
// The visual component below stays pure and won't re-render unnecessarily
export const RoomBox = function RoomBox(props: RoomBoxProps) {
  const { room } = props;
  
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: room.id,
      data: { room },
    });

  return (
    <RoomBoxVisual
      {...props}
      dragRef={setNodeRef}
      dragListeners={listeners}
      dragAttributes={attributes}
      transform={transform}
      isDragging={isDragging}
    />
  );
};
