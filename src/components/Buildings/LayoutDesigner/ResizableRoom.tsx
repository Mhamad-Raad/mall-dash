import { useCallback, useState, memo } from 'react';
import { Rnd, type RndDragCallback, type RndResizeCallback } from 'react-rnd';
import type { DroppedRoom } from './types';
import { GRID_CELL_SIZE, ROOM_TEMPLATES, MIN_ROOM_SIZE, MAX_ROOM_SIZE, CANVAS_MIN_X, CANVAS_MAX_X, CANVAS_MIN_Y, CANVAS_MAX_Y } from './types';
import { cn } from '@/lib/utils';

interface ResizableRoomProps {
  room: DroppedRoom;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number, x: number, y: number) => void;
  /** Current zoom level for proper drag/resize calculations */
  scale: number;
}

// Memoized inner content to prevent re-renders during drag/resize
const RoomContent = memo(function RoomContent({
  room,
  borderColor,
  Icon,
  isSelected,
  isDragging,
  isResizing,
  liveSize,
  onClick,
}: {
  room: DroppedRoom;
  borderColor: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> | undefined;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
  liveSize: { width: number; height: number } | null;
  onClick: (e: React.MouseEvent) => void;
}) {
  const displayWidth = liveSize?.width ?? room.width;
  const displayHeight = liveSize?.height ?? room.height;
  const area = displayWidth * displayHeight;

  return (
    <div
      onClick={onClick}
      className={cn(
        'w-full h-full rounded-md border-2 cursor-grab active:cursor-grabbing',
        'bg-background/[0.06] backdrop-blur-sm',
        'flex flex-col items-center justify-center gap-1',
        'select-none transition-shadow duration-150',
        'hover:bg-background/[0.10] hover:shadow-md',
        isDragging && 'shadow-2xl opacity-90',
        isResizing && 'shadow-2xl',
        isSelected && 'ring-2 ring-primary/40 shadow-lg'
      )}
      style={{ borderColor }}
    >
      {/* Room Icon */}
      {Icon && (
        <Icon className="w-5 h-5 opacity-90" style={{ color: borderColor }} />
      )}

      {/* Room Name */}
      <span
        className="text-[11px] font-semibold text-center px-1 truncate max-w-full leading-none"
        style={{ color: borderColor }}
      >
        {room.name}
      </span>

      {/* Dimensions while resizing */}
      {isResizing && liveSize && (
        <span
          className="absolute top-1 left-1 text-[10px] font-medium opacity-90 bg-background/80 px-1 rounded"
          style={{ color: borderColor }}
        >
          {liveSize.width.toFixed(1)} × {liveSize.height.toFixed(1)}m
        </span>
      )}

      {/* Area indicator */}
      <span
        className="absolute bottom-1 right-1 text-[10px] opacity-80 tabular-nums"
        style={{ color: borderColor }}
      >
        {area.toFixed(1)}m²
      </span>

      {/* Resize handles visual indicators (shown on hover/select) */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none opacity-0 transition-opacity',
          (isSelected || isDragging || isResizing) && 'opacity-100',
          'group-hover:opacity-100'
        )}
      >
        {/* Corner handles */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-sm border-2 bg-background" style={{ borderColor }} />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-sm border-2 bg-background" style={{ borderColor }} />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-sm border-2 bg-background" style={{ borderColor }} />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-sm border-2 bg-background" style={{ borderColor }} />
      </div>
    </div>
  );
});

function ResizableRoomInner({
  room,
  isSelected,
  onSelect,
  onMove,
  onResize,
  scale,
}: ResizableRoomProps) {
  const cellSize = GRID_CELL_SIZE;
  const template = ROOM_TEMPLATES.find((t) => t.type === room.type);
  const borderColor = room.borderColor || template?.borderColor || '#666';
  const Icon = template?.icon;

  // UI state for visual feedback only
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  // Live size display during resize (local state, doesn't trigger parent re-render)
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null);

  // Handle drag start - just set UI state
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Handle drag - no-op, just for drag state
  const handleDrag: RndDragCallback = useCallback(() => {
    // Drag is handled by Rnd, we just track state
  }, []);

  // Handle drag stop - update parent state with final position
  const handleDragStop: RndDragCallback = useCallback((_e, d) => {
    setIsDragging(false);

    // d.x and d.y are in pixels (affected by scale), convert to grid coordinates
    const rawGridX = d.x / (cellSize * scale);
    const rawGridY = d.y / (cellSize * scale);
    
    // Clamp to canvas bounds (accounting for room size)
    const gridX = Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X - room.width, rawGridX));
    const gridY = Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y - room.height, rawGridY));

    onMove(room.id, gridX, gridY);
  }, [room, cellSize, scale, onMove]);

  // Handle resize start
  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    setLiveSize({ width: room.width, height: room.height });
  }, [room.width, room.height]);

  // Handle resize - track live size for display
  const handleResize: RndResizeCallback = useCallback((_e, _dir, ref) => {
    const newPixelWidth = ref.offsetWidth;
    const newPixelHeight = ref.offsetHeight;

    // Convert pixels to grid coordinates (accounting for scale)
    const newWidth = newPixelWidth / (cellSize * scale);
    const newHeight = newPixelHeight / (cellSize * scale);

    // Clamp size to room limits
    const clampedWidth = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newWidth));
    const clampedHeight = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newHeight));

    // Update local display state
    setLiveSize({ width: clampedWidth, height: clampedHeight });
  }, [cellSize, scale]);

  // Handle resize stop - update parent state with final size and position
  const handleResizeStop: RndResizeCallback = useCallback((_e, _dir, ref, _delta, position) => {
    setIsResizing(false);
    setLiveSize(null);

    const newPixelWidth = ref.offsetWidth;
    const newPixelHeight = ref.offsetHeight;
    
    // Convert pixels to grid coordinates (accounting for scale)
    const newWidth = newPixelWidth / (cellSize * scale);
    const newHeight = newPixelHeight / (cellSize * scale);
    const newX = position.x / (cellSize * scale);
    const newY = position.y / (cellSize * scale);

    // Clamp size to room limits
    const clampedWidth = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newWidth));
    const clampedHeight = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newHeight));
    // Clamp position to canvas bounds (accounting for room size)
    const clampedX = Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X - clampedWidth, newX));
    const clampedY = Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y - clampedHeight, newY));

    onResize(room.id, clampedWidth, clampedHeight, clampedX, clampedY);
  }, [room, cellSize, scale, onResize]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(room.id);
  }, [room.id, onSelect]);

  return (
    <>
      <Rnd
        size={{
          width: room.width * cellSize,
          height: room.height * cellSize,
        }}
        position={{
          x: room.x * cellSize,
          y: room.y * cellSize,
        }}
        scale={scale}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        minWidth={MIN_ROOM_SIZE * cellSize}
        minHeight={MIN_ROOM_SIZE * cellSize}
        maxWidth={MAX_ROOM_SIZE * cellSize}
        maxHeight={MAX_ROOM_SIZE * cellSize}
        resizeGrid={[1, 1]}
        dragGrid={[1, 1]}
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        className={cn(
          'group absolute',
          isDragging && 'z-50',
          isResizing && 'z-50',
          isSelected && !isDragging && !isResizing && 'z-10'
        )}
        style={{
          zIndex: isDragging || isResizing ? 50 : isSelected ? 10 : 1,
        }}
      >
        <RoomContent
          room={room}
          borderColor={borderColor}
          Icon={Icon}
          isSelected={isSelected}
          isDragging={isDragging}
          isResizing={isResizing}
          liveSize={liveSize}
          onClick={handleClick}
        />
      </Rnd>
    </>
  );
}

// Memoize the entire component
export const ResizableRoom = memo(ResizableRoomInner, (prevProps, nextProps) => {
  // Only re-render if this room's data changed, or selection state changed
  return (
    prevProps.room.id === nextProps.room.id &&
    prevProps.room.x === nextProps.room.x &&
    prevProps.room.y === nextProps.room.y &&
    prevProps.room.width === nextProps.room.width &&
    prevProps.room.height === nextProps.room.height &&
    prevProps.room.name === nextProps.room.name &&
    prevProps.room.type === nextProps.room.type &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.scale === nextProps.scale
  );
});
