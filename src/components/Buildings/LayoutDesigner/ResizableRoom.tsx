import { useCallback, useRef, useState, memo } from 'react';
import { Rnd, type RndDragCallback, type RndResizeCallback } from 'react-rnd';
import type { DroppedRoom } from './types';
import { GRID_CELL_SIZE, ROOM_TEMPLATES, MIN_ROOM_SIZE, MAX_ROOM_SIZE } from './types';
import { cn } from '@/lib/utils';

interface ResizableRoomProps {
  room: DroppedRoom;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number, x: number, y: number) => void;
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  checkCollision: (room: DroppedRoom, newX: number, newY: number, newWidth?: number, newHeight?: number) => boolean;
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
  zoom,
  canvasWidth,
  canvasHeight,
  checkCollision,
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

  // Track last valid position for rollback (refs don't cause re-renders)
  const lastValidPosRef = useRef({ x: room.x, y: room.y, width: room.width, height: room.height });

  // Handle drag start - just set UI state
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    lastValidPosRef.current = { x: room.x, y: room.y, width: room.width, height: room.height };
  }, [room.x, room.y, room.width, room.height]);

  // Handle drag - NO STATE UPDATES, just track valid positions in ref
  const handleDrag: RndDragCallback = useCallback((_e, d) => {
    const gridX = Math.round((d.x / cellSize) * 1000) / 1000;
    const gridY = Math.round((d.y / cellSize) * 1000) / 1000;

    const clampedX = Math.max(0, Math.min(gridX, canvasWidth - room.width));
    const clampedY = Math.max(0, Math.min(gridY, canvasHeight - room.height));

    // Only update ref if no collision - no React state update!
    if (!checkCollision(room, clampedX, clampedY)) {
      lastValidPosRef.current = { ...lastValidPosRef.current, x: clampedX, y: clampedY };
    }
  }, [room, cellSize, canvasWidth, canvasHeight, checkCollision]);

  // Handle drag stop - NOW update parent state
  const handleDragStop: RndDragCallback = useCallback((_e, d) => {
    setIsDragging(false);

    const gridX = Math.round((d.x / cellSize) * 1000) / 1000;
    const gridY = Math.round((d.y / cellSize) * 1000) / 1000;

    const clampedX = Math.max(0, Math.min(gridX, canvasWidth - room.width));
    const clampedY = Math.max(0, Math.min(gridY, canvasHeight - room.height));

    if (!checkCollision(room, clampedX, clampedY)) {
      onMove(room.id, clampedX, clampedY);
    } else {
      // Rollback to last valid position
      onMove(room.id, lastValidPosRef.current.x, lastValidPosRef.current.y);
    }
  }, [room, cellSize, canvasWidth, canvasHeight, checkCollision, onMove]);

  // Handle resize start
  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    setLiveSize({ width: room.width, height: room.height });
    lastValidPosRef.current = { x: room.x, y: room.y, width: room.width, height: room.height };
  }, [room.x, room.y, room.width, room.height]);

  // Handle resize - only update LOCAL liveSize for display, track valid in ref
  const handleResize: RndResizeCallback = useCallback((_e, _dir, ref, _delta, position) => {
    const newPixelWidth = ref.offsetWidth;
    const newPixelHeight = ref.offsetHeight;

    const newWidth = Math.round((newPixelWidth / cellSize) * 1000) / 1000;
    const newHeight = Math.round((newPixelHeight / cellSize) * 1000) / 1000;
    const newX = Math.round((position.x / cellSize) * 1000) / 1000;
    const newY = Math.round((position.y / cellSize) * 1000) / 1000;

    const clampedWidth = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newWidth));
    const clampedHeight = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newHeight));
    const clampedX = Math.max(0, newX);
    const clampedY = Math.max(0, newY);

    // Update local display state (lightweight, only affects this component)
    setLiveSize({ width: clampedWidth, height: clampedHeight });

    // Track valid position in ref - no parent re-render
    if (!checkCollision(room, clampedX, clampedY, clampedWidth, clampedHeight)) {
      lastValidPosRef.current = { x: clampedX, y: clampedY, width: clampedWidth, height: clampedHeight };
    }
  }, [room, cellSize, checkCollision]);

  // Handle resize stop - NOW update parent state
  const handleResizeStop: RndResizeCallback = useCallback((_e, _dir, ref, _delta, position) => {
    setIsResizing(false);
    setLiveSize(null);

    const newPixelWidth = ref.offsetWidth;
    const newPixelHeight = ref.offsetHeight;
    const newWidth = Math.round((newPixelWidth / cellSize) * 1000) / 1000;
    const newHeight = Math.round((newPixelHeight / cellSize) * 1000) / 1000;
    const newX = Math.round((position.x / cellSize) * 1000) / 1000;
    const newY = Math.round((position.y / cellSize) * 1000) / 1000;

    const clampedWidth = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newWidth));
    const clampedHeight = Math.max(MIN_ROOM_SIZE, Math.min(MAX_ROOM_SIZE, newHeight));
    const clampedX = Math.max(0, newX);
    const clampedY = Math.max(0, newY);

    if (!checkCollision(room, clampedX, clampedY, clampedWidth, clampedHeight)) {
      onResize(room.id, clampedWidth, clampedHeight, clampedX, clampedY);
    } else {
      // Rollback to last valid state
      onResize(
        room.id,
        lastValidPosRef.current.width,
        lastValidPosRef.current.height,
        lastValidPosRef.current.x,
        lastValidPosRef.current.y
      );
    }
  }, [room, cellSize, checkCollision, onResize]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(room.id);
  }, [room.id, onSelect]);

  return (
    <Rnd
      size={{
        width: room.width * cellSize,
        height: room.height * cellSize,
      }}
      position={{
        x: room.x * cellSize,
        y: room.y * cellSize,
      }}
      scale={zoom}
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
      bounds="parent"
      resizeGrid={[cellSize / 4, cellSize / 4]}
      dragGrid={[cellSize / 4, cellSize / 4]}
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
        'group',
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
  );
}

// Memoize the entire component to prevent re-renders when other rooms change
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
    prevProps.zoom === nextProps.zoom &&
    prevProps.canvasWidth === nextProps.canvasWidth &&
    prevProps.canvasHeight === nextProps.canvasHeight
  );
});
