import { useDraggable } from '@dnd-kit/core';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { DroppedRoom } from './types';
import { GRID_CELL_SIZE, ROOM_TEMPLATES, GRID_PRECISION, MIN_ROOM_SIZE, MAX_ROOM_SIZE } from './types';
import { cn } from '@/lib/utils';

interface ResizableRoomProps {
  room: DroppedRoom;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onResize: (id: string, width: number, height: number, newX: number, newY: number) => void;
  gridSize: number;
  zoom: number;
}

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export function ResizableRoom({
  room,
  isSelected,
  onSelect,
  onResize,
  gridSize,
  zoom,
}: ResizableRoomProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState<ResizeEdge | null>(null);
  const resizeStartRef = useRef<{ 
    mouseX: number; 
    mouseY: number; 
    width: number; 
    height: number; 
    roomX: number; 
    roomY: number 
  } | null>(null);
  const lastResizeTimeRef = useRef<number>(0);
  const resizeThrottleMs = 16; // ~60fps

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: room.id,
    data: {
      type: 'room',
      room,
      isNew: false,
    },
  });

  const cellSize = useMemo(() => GRID_CELL_SIZE * gridSize, [gridSize]);
  const template = useMemo(() => ROOM_TEMPLATES.find((t) => t.type === room.type), [room.type]);
  const borderColor = useMemo(() => room.borderColor || template?.borderColor || '#666', [room.borderColor, template]);
  
  const area = useMemo(() => room.width * room.height, [room.width, room.height]);

  const style = useMemo(() => ({
    position: 'absolute' as const,
    left: room.x * cellSize,
    top: room.y * cellSize,
    width: room.width * cellSize,
    height: room.height * cellSize,
    borderColor: borderColor,
    zIndex: isSelected ? 10 : 1,
    opacity: isDragging ? 0 : 1,
  }), [room.x, room.y, room.width, room.height, cellSize, borderColor, isSelected, isDragging]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(room.id);
  };

  const handleResizeStart = useCallback((e: React.MouseEvent, edge: ResizeEdge) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeEdge(edge);
    // Store the original values at the start of resize
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: room.width,
      height: room.height,
      roomX: room.x,
      roomY: room.y,
    };
  }, [room.width, room.height, room.x, room.y]);

  useEffect(() => {
    if (!isResizing || !resizeEdge || !resizeStartRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const start = resizeStartRef.current;
      if (!start) return;

      // Throttle resize updates to prevent excessive re-renders
      const now = Date.now();
      if (now - lastResizeTimeRef.current < resizeThrottleMs) {
        return;
      }
      lastResizeTimeRef.current = now;

      // Calculate delta from the START position (not current room position)
      // Divide by zoom because the canvas is scaled
      const mouseDeltaX = (e.clientX - start.mouseX) / cellSize / zoom;
      const mouseDeltaY = (e.clientY - start.mouseY) / cellSize / zoom;

      let newWidth = start.width;
      let newHeight = start.height;
      let newX = start.roomX;
      let newY = start.roomY;

      // Handle horizontal resize
      if (resizeEdge.includes('e')) {
        // Dragging east edge - only width changes
        newWidth = start.width + mouseDeltaX;
      } else if (resizeEdge.includes('w')) {
        // Dragging west edge - width changes and position moves
        newWidth = start.width - mouseDeltaX;
        newX = start.roomX + mouseDeltaX;
      }

      // Handle vertical resize
      if (resizeEdge.includes('s')) {
        // Dragging south edge - only height changes
        newHeight = start.height + mouseDeltaY;
      } else if (resizeEdge.includes('n')) {
        // Dragging north edge - height changes and position moves
        newHeight = start.height - mouseDeltaY;
        newY = start.roomY + mouseDeltaY;
      }

      // Round to grid precision
      newWidth = Math.round(newWidth / GRID_PRECISION) * GRID_PRECISION;
      newHeight = Math.round(newHeight / GRID_PRECISION) * GRID_PRECISION;
      newX = Math.round(newX / GRID_PRECISION) * GRID_PRECISION;
      newY = Math.round(newY / GRID_PRECISION) * GRID_PRECISION;

      // Clamp dimensions to min/max
      const clampedWidth = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newWidth));
      const clampedHeight = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newHeight));

      // If dimensions were clamped, adjust position accordingly
      if (resizeEdge.includes('w') && clampedWidth !== newWidth) {
        newX = start.roomX + start.width - clampedWidth;
      }
      if (resizeEdge.includes('n') && clampedHeight !== newHeight) {
        newY = start.roomY + start.height - clampedHeight;
      }

      // Ensure position doesn't go negative
      if (newX < 0) {
        newX = 0;
      }
      if (newY < 0) {
        newY = 0;
      }

      onResize(room.id, clampedWidth, clampedHeight, newX, newY);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeEdge(null);
      resizeStartRef.current = null;
      lastResizeTimeRef.current = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeEdge, cellSize, room.id, onResize, zoom]);

  const ResizeHandle = ({ edge, className }: { edge: ResizeEdge; className: string }) => (
    <div
      className={cn(
        'absolute bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity z-20',
        isResizing && resizeEdge === edge && 'opacity-100',
        className
      )}
      style={{ pointerEvents: 'auto' }}
      onMouseDown={(e) => handleResizeStart(e, edge)}
      onPointerDown={(e) => {
        // Prevent dnd-kit from capturing this event
        e.stopPropagation();
      }}
    />
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={cn(
        'group relative rounded-md border',
        !isResizing && 'cursor-grab active:cursor-grabbing',
        'bg-background/[0.06] backdrop-blur-sm',
        'flex flex-col items-center justify-center gap-1',
        'select-none touch-none transition',
        'hover:bg-background/[0.10] hover:shadow-md',
        isDragging && 'shadow-lg',
        isSelected && 'ring-2 ring-primary/40',
        isResizing && 'cursor-default'
      )}
    >
      {/* Resize Handles - only visible when selected */}
      {isSelected && (
        <>
          {/* Edge handles */}
          <ResizeHandle edge="n" className="top-0 left-2 right-2 h-1 -translate-y-1/2 cursor-ns-resize rounded-full" />
          <ResizeHandle edge="s" className="bottom-0 left-2 right-2 h-1 translate-y-1/2 cursor-ns-resize rounded-full" />
          <ResizeHandle edge="w" className="left-0 top-2 bottom-2 w-1 -translate-x-1/2 cursor-ew-resize rounded-full" />
          <ResizeHandle edge="e" className="right-0 top-2 bottom-2 w-1 translate-x-1/2 cursor-ew-resize rounded-full" />
          
          {/* Corner handles */}
          <ResizeHandle edge="nw" className="top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize rounded-full" />
          <ResizeHandle edge="ne" className="top-0 right-0 w-2 h-2 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize rounded-full" />
          <ResizeHandle edge="sw" className="bottom-0 left-0 w-2 h-2 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize rounded-full" />
          <ResizeHandle edge="se" className="bottom-0 right-0 w-2 h-2 translate-x-1/2 translate-y-1/2 cursor-nwse-resize rounded-full" />
        </>
      )}

      {/* Draggable content area - only this area can initiate drag */}
      <div
        {...listeners}
        {...attributes}
        className="absolute inset-0 flex flex-col items-center justify-center gap-1"
        style={{ pointerEvents: isResizing ? 'none' : 'auto', zIndex: 1 }}
      >
        {/* Room Icon */}
        {template?.icon && (
          <template.icon className="w-4 h-4 opacity-90" style={{ color: borderColor }} />
        )}
        
        {/* Room Name */}
        <span 
          className="text-[11px] font-semibold text-center px-1 truncate max-w-full leading-none"
          style={{ color: borderColor }}
        >
          {room.name}
        </span>
      </div>

      {/* Area indicator */}
      <span 
        className="absolute bottom-1 right-1 text-[10px] opacity-80 tabular-nums"
        style={{ color: borderColor, zIndex: 2 }}
      >
        {area.toFixed(3)}m²
      </span>
    </div>
  );
}
