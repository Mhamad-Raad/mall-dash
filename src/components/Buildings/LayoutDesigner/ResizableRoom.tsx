import { useCallback, useRef, useState, memo } from 'react';
import { Rnd, type RndDragCallback, type RndResizeCallback } from 'react-rnd';
import type { DroppedRoom } from './types';
import { GRID_CELL_SIZE, ROOM_TEMPLATES, MIN_ROOM_SIZE, MAX_ROOM_SIZE } from './types';
import { findBestValidPosition } from './collisionDetection';
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
  /** Pass ALL rooms so collision can be checked against current positions */
  allRooms: DroppedRoom[];
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
  isColliding,
  onClick,
}: {
  room: DroppedRoom;
  borderColor: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> | undefined;
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
  liveSize: { width: number; height: number } | null;
  isColliding: boolean;
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
        isSelected && 'ring-2 ring-primary/40 shadow-lg',
        isColliding && 'ring-2 ring-destructive/60 bg-destructive/10'
      )}
      style={{ borderColor: isColliding ? 'hsl(var(--destructive))' : borderColor }}
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
  allRooms,
}: ResizableRoomProps) {
  const cellSize = GRID_CELL_SIZE;
  const template = ROOM_TEMPLATES.find((t) => t.type === room.type);
  const borderColor = room.borderColor || template?.borderColor || '#666';
  const Icon = template?.icon;

  // UI state for visual feedback only
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isColliding, setIsColliding] = useState(false);
  // Live size display during resize (local state, doesn't trigger parent re-render)
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null);

  // Track last valid position for rollback (refs don't cause re-renders)
  const lastValidPosRef = useRef({ x: room.x, y: room.y, width: room.width, height: room.height });
  // Keep allRooms in a ref so we always have current data
  const allRoomsRef = useRef(allRooms);
  allRoomsRef.current = allRooms;

  // Local collision check that uses the ref for fresh data
  const checkCollision = useCallback((
    targetX: number,
    targetY: number,
    targetWidth: number = room.width,
    targetHeight: number = room.height
  ): boolean => {
    const currentRooms = allRoomsRef.current;
    const epsilon = 0.001;
    
    for (const other of currentRooms) {
      if (other.id === room.id) continue;
      
      // Check rectangle overlap
      const overlaps = !(
        targetX + targetWidth <= other.x + epsilon ||
        targetX >= other.x + other.width - epsilon ||
        targetY + targetHeight <= other.y + epsilon ||
        targetY >= other.y + other.height - epsilon
      );
      
      if (overlaps) return true;
    }
    return false;
  }, [room.id, room.width, room.height]);

  // Handle drag start - just set UI state
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setIsColliding(false);
    lastValidPosRef.current = { x: room.x, y: room.y, width: room.width, height: room.height };
  }, [room.x, room.y, room.width, room.height]);

  // Handle drag - track valid positions and show collision feedback
  const handleDrag: RndDragCallback = useCallback((_e, d) => {
    const gridX = Math.round((d.x / cellSize) * 1000) / 1000;
    const gridY = Math.round((d.y / cellSize) * 1000) / 1000;

    const clampedX = Math.max(0, Math.min(gridX, canvasWidth - room.width));
    const clampedY = Math.max(0, Math.min(gridY, canvasHeight - room.height));

    const hasCollision = checkCollision(clampedX, clampedY);
    setIsColliding(hasCollision);
    
    if (!hasCollision) {
      lastValidPosRef.current = { ...lastValidPosRef.current, x: clampedX, y: clampedY };
    }
  }, [room.width, room.height, cellSize, canvasWidth, canvasHeight, checkCollision]);

  // Handle drag stop - NOW update parent state with smart positioning
  const handleDragStop: RndDragCallback = useCallback((_e, d) => {
    setIsDragging(false);
    setIsColliding(false);

    const gridX = Math.round((d.x / cellSize) * 1000) / 1000;
    const gridY = Math.round((d.y / cellSize) * 1000) / 1000;

    const clampedX = Math.max(0, Math.min(gridX, canvasWidth - room.width));
    const clampedY = Math.max(0, Math.min(gridY, canvasHeight - room.height));

    // Use smart positioning to find the best valid spot
    const currentRooms = allRoomsRef.current;
    const movingRoom: DroppedRoom = { ...room, x: clampedX, y: clampedY };
    const result = findBestValidPosition(movingRoom, clampedX, clampedY, currentRooms, 8);

    if (!result.hasCollision) {
      // Clamp result to canvas bounds
      const finalX = Math.max(0, Math.min(result.x, canvasWidth - room.width));
      const finalY = Math.max(0, Math.min(result.y, canvasHeight - room.height));
      onMove(room.id, finalX, finalY);
    } else {
      // No valid position found - rollback to last valid
      onMove(room.id, lastValidPosRef.current.x, lastValidPosRef.current.y);
    }
  }, [room, cellSize, canvasWidth, canvasHeight, onMove]);

  // Handle resize start
  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    setIsColliding(false);
    setLiveSize({ width: room.width, height: room.height });
    lastValidPosRef.current = { x: room.x, y: room.y, width: room.width, height: room.height };
  }, [room.x, room.y, room.width, room.height]);

  // Handle resize - track valid positions and show collision feedback
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

    // Update local display state
    setLiveSize({ width: clampedWidth, height: clampedHeight });

    const hasCollision = checkCollision(clampedX, clampedY, clampedWidth, clampedHeight);
    setIsColliding(hasCollision);
    
    if (!hasCollision) {
      lastValidPosRef.current = { x: clampedX, y: clampedY, width: clampedWidth, height: clampedHeight };
    }
  }, [cellSize, checkCollision]);

  // Handle resize stop - NOW update parent state with smart positioning
  const handleResizeStop: RndResizeCallback = useCallback((_e, _dir, ref, _delta, position) => {
    setIsResizing(false);
    setIsColliding(false);
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

    // For resize, we use the new dimensions to find best position
    const currentRooms = allRoomsRef.current;
    const resizedRoom: DroppedRoom = {
      ...room,
      x: clampedX,
      y: clampedY,
      width: clampedWidth,
      height: clampedHeight,
    };
    const result = findBestValidPosition(resizedRoom, clampedX, clampedY, currentRooms, 5);

    if (!result.hasCollision) {
      const finalX = Math.max(0, result.x);
      const finalY = Math.max(0, result.y);
      onResize(room.id, clampedWidth, clampedHeight, finalX, finalY);
    } else {
      // No valid position found for this size - rollback
      onResize(
        room.id,
        lastValidPosRef.current.width,
        lastValidPosRef.current.height,
        lastValidPosRef.current.x,
        lastValidPosRef.current.y
      );
    }
  }, [room, cellSize, onResize]);

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
        isColliding={isColliding}
        onClick={handleClick}
      />
    </Rnd>
  );
}

// Memoize the entire component - but DON'T compare allRooms (we use ref for that)
export const ResizableRoom = memo(ResizableRoomInner, (prevProps, nextProps) => {
  // Only re-render if this room's data changed, or selection state changed
  // allRooms is NOT compared because we use a ref to always have fresh data
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
