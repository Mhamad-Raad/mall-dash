import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { ResizableRoom } from './ResizableRoom';
import { RoomSummaryPanel } from './RoomPropertiesPanel';
import { DesignerToolbar } from './DesignerToolbar';
import type { DroppedRoom, RoomTemplate } from './types';
import { GRID_CELL_SIZE, ROOM_TEMPLATES } from './types';
import { wouldCollide, wouldCollideWithSize } from './collisionDetection';
import type { ApartmentLayout, RoomLayout, Door } from '@/interfaces/Building.interface';
import { cn } from '@/lib/utils';

interface LayoutDesignerProps {
  initialLayout?: ApartmentLayout;
  onSave?: (layout: ApartmentLayout) => void;
  apartmentName?: string;
  /** When true, auto-saves on changes (useful when embedded in a dialog) */
  embedded?: boolean;
}

// Canvas dimension limits in grid cells (meters)
const MIN_CANVAS_WIDTH = 12;
const MIN_CANVAS_HEIGHT = 8;
const MAX_CANVAS_WIDTH = 50;
const MAX_CANVAS_HEIGHT = 50;
const EXPAND_THRESHOLD = 2; // Expand when room is within this many cells of edge

export function LayoutDesigner({
  initialLayout,
  onSave,
  embedded = false,
}: LayoutDesignerProps) {
  // Convert initial layout to DroppedRoom format
  const initialRooms: DroppedRoom[] = useMemo(() => 
    initialLayout?.rooms.map((room) => ({
      ...room,
      borderColor: ROOM_TEMPLATES.find((t) => t.type === room.type)?.borderColor || '#666',
    })) || [],
    [initialLayout]
  );

  const [rooms, setRooms] = useState<DroppedRoom[]>(initialRooms);
  const [doors, setDoors] = useState<Door[]>(initialLayout?.doors || []);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [canvasWidth, setCanvasWidth] = useState(initialLayout?.width || MIN_CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(initialLayout?.height || MIN_CANVAS_HEIGHT);

  // Ref to track if we need to save
  const pendingSaveRef = useRef(false);

  // Calculate required canvas size based on room positions
  const recalculateCanvasSize = useCallback((currentRooms: DroppedRoom[]) => {
    if (currentRooms.length === 0) {
      setCanvasWidth(MIN_CANVAS_WIDTH);
      setCanvasHeight(MIN_CANVAS_HEIGHT);
      return;
    }

    let maxRight = 0;
    let maxBottom = 0;
    currentRooms.forEach((room) => {
      maxRight = Math.max(maxRight, room.x + room.width);
      maxBottom = Math.max(maxBottom, room.y + room.height);
    });

    const neededWidth = Math.max(MIN_CANVAS_WIDTH, Math.min(maxRight + EXPAND_THRESHOLD + 2, MAX_CANVAS_WIDTH));
    const neededHeight = Math.max(MIN_CANVAS_HEIGHT, Math.min(maxBottom + EXPAND_THRESHOLD + 2, MAX_CANVAS_HEIGHT));

    setCanvasWidth(neededWidth);
    setCanvasHeight(neededHeight);
  }, []);

  // Debounce helper for save operations
  const debouncedSave = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const debounced = (layout: ApartmentLayout) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (onSave) {
          onSave(layout);
        }
        pendingSaveRef.current = false;
        timeoutId = null;
      }, 300);
    };
    
    debounced.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    
    return debounced;
  }, [onSave]);

  // Auto-save layout whenever rooms or doors change (for embedded mode)
  useEffect(() => {
    if (embedded && onSave) {
      pendingSaveRef.current = true;
      const layout: ApartmentLayout = {
        rooms: rooms.map((room): RoomLayout => ({
          id: room.id,
          type: room.type,
          name: room.name,
          x: room.x,
          y: room.y,
          width: room.width,
          height: room.height,
        })),
        doors,
        gridSize: zoom,
        width: canvasWidth,
        height: canvasHeight,
      };
      debouncedSave(layout);
    }
    
    return () => debouncedSave.cancel();
  }, [rooms, doors, zoom, canvasWidth, canvasHeight, embedded, onSave, debouncedSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedRoomId) return;
      
      // Don't handle if user is typing in an input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteRoom(selectedRoomId);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRotateRoom(selectedRoomId);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleDuplicateRoom(selectedRoomId);
      } else if (e.key === 'Escape') {
        setSelectedRoomId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRoomId]);

  // Collision detection callback for ResizableRoom
  const checkCollision = useCallback((
    room: DroppedRoom,
    newX: number,
    newY: number,
    newWidth?: number,
    newHeight?: number
  ): boolean => {
    if (newWidth !== undefined && newHeight !== undefined) {
      return wouldCollideWithSize(room, newX, newY, newWidth, newHeight, rooms);
    }
    return wouldCollide(room, newX, newY, rooms);
  }, [rooms]);

  // Handle room move from ResizableRoom
  const handleRoomMove = useCallback((id: string, x: number, y: number) => {
    setRooms((prev) => {
      const updated = prev.map((room) => 
        room.id === id ? { ...room, x, y } : room
      );
      // Defer canvas recalculation to avoid excessive updates
      requestAnimationFrame(() => recalculateCanvasSize(updated));
      return updated;
    });
  }, [recalculateCanvasSize]);

  // Handle room resize from ResizableRoom
  const handleRoomResize = useCallback((id: string, width: number, height: number, x: number, y: number) => {
    setRooms((prev) => {
      const updated = prev.map((room) =>
        room.id === id ? { ...room, width, height, x, y } : room
      );
      requestAnimationFrame(() => recalculateCanvasSize(updated));
      return updated;
    });
  }, [recalculateCanvasSize]);

  // Add room from toolbar click
  const handleAddRoom = useCallback((template: RoomTemplate) => {
    // Create a temporary room object to check collisions
    const tempRoom: DroppedRoom = {
      id: 'temp',
      type: template.type,
      name: template.name,
      x: 0,
      y: 0,
      width: template.defaultWidth,
      height: template.defaultHeight,
      borderColor: template.borderColor,
    };

    // Find first available position within current canvas
    let x = 1;
    let y = 1;
    let found = false;

    outer: for (let ty = 1; ty < canvasHeight - template.defaultHeight; ty++) {
      for (let tx = 1; tx < canvasWidth - template.defaultWidth; tx++) {
        if (!wouldCollide({ ...tempRoom, x: tx, y: ty }, tx, ty, rooms)) {
          x = tx;
          y = ty;
          found = true;
          break outer;
        }
      }
    }

    // If no space found, place at end and expand canvas
    if (!found) {
      x = 1;
      y = canvasHeight;
    }

    const newRoom: DroppedRoom = {
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: template.type,
      name: template.name,
      x,
      y,
      width: template.defaultWidth,
      height: template.defaultHeight,
      borderColor: template.borderColor,
    };

    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    recalculateCanvasSize(updatedRooms);
    setSelectedRoomId(newRoom.id);
  }, [rooms, canvasWidth, canvasHeight, recalculateCanvasSize]);

  const handleDeleteRoom = useCallback((id: string) => {
    const updatedRooms = rooms.filter((room) => room.id !== id);
    setRooms(updatedRooms);
    setDoors((prev) => prev.filter((door) => door.roomId !== id && door.connectedRoomId !== id));
    setSelectedRoomId(null);
    recalculateCanvasSize(updatedRooms);
  }, [rooms, recalculateCanvasSize]);

  const handleRotateRoom = useCallback((id: string) => {
    setRooms((prev) => {
      const roomToRotate = prev.find((r) => r.id === id);
      if (!roomToRotate) return prev;

      // Swap width and height
      const newWidth = roomToRotate.height;
      const newHeight = roomToRotate.width;

      // Create rotated room to check collision
      const rotatedRoom = { ...roomToRotate, width: newWidth, height: newHeight };
      const otherRooms = prev.filter((r) => r.id !== id);

      // Check if rotation would cause collision
      if (wouldCollide(rotatedRoom, rotatedRoom.x, rotatedRoom.y, otherRooms)) {
        return prev;
      }

      return prev.map((room) => {
        if (room.id === id) {
          return { ...room, width: newWidth, height: newHeight };
        }
        return room;
      });
    });
  }, []);

  const handleDuplicateRoom = useCallback((id: string) => {
    const room = rooms.find((r) => r.id === id);
    if (!room) return;

    // Find a valid position for the duplicate with simple spiral search
    let newX = room.x + 1;
    let newY = room.y + 1;
    let found = false;
    
    const maxSearchRadius = 10;
    for (let radius = 1; radius <= maxSearchRadius && !found; radius++) {
      for (let dx = -radius; dx <= radius && !found; dx++) {
        for (let dy = -radius; dy <= radius && !found; dy++) {
          const testX = Math.max(0, room.x + dx);
          const testY = Math.max(0, room.y + dy);
          if (!wouldCollide({ ...room, x: testX, y: testY }, testX, testY, rooms)) {
            newX = testX;
            newY = testY;
            found = true;
          }
        }
      }
    }

    const newRoom: DroppedRoom = {
      ...room,
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: newX,
      y: newY,
    };

    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    recalculateCanvasSize(updatedRooms);
    setSelectedRoomId(newRoom.id);
  }, [rooms, recalculateCanvasSize]);

  // Handle room updates from the properties panel
  const handleUpdateRoom = useCallback((id: string, updates: Partial<DroppedRoom>) => {
    setRooms((prev) => {
      const roomToUpdate = prev.find((r) => r.id === id);
      if (!roomToUpdate) return prev;

      const updatedRoom = { ...roomToUpdate, ...updates };
      const otherRooms = prev.filter((r) => r.id !== id);

      // If position or size changed, check for collisions
      if (updates.x !== undefined || updates.y !== undefined || updates.width !== undefined || updates.height !== undefined) {
        if (wouldCollide(updatedRoom, updatedRoom.x, updatedRoom.y, otherRooms)) {
          return prev;
        }
      }

      const updated = prev.map((room) => {
        if (room.id === id) {
          return updatedRoom;
        }
        return room;
      });

      recalculateCanvasSize(updated);
      return updated;
    });
  }, [recalculateCanvasSize]);

  const handleCanvasClick = useCallback(() => {
    setSelectedRoomId(null);
  }, []);

  const handleReset = useCallback(() => {
    setRooms([]);
    setDoors([]);
    setSelectedRoomId(null);
    setCanvasWidth(MIN_CANVAS_WIDTH);
    setCanvasHeight(MIN_CANVAS_HEIGHT);
  }, []);

  // Canvas dimensions in pixels
  const cellSize = GRID_CELL_SIZE;
  const canvasPixelWidth = canvasWidth * cellSize;
  const canvasPixelHeight = canvasHeight * cellSize;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar with room buttons */}
      <DesignerToolbar
        zoom={zoom}
        onZoomChange={setZoom}
        onReset={handleReset}
        onAddRoom={handleAddRoom}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
      />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Canvas Area with scroll */}
        <div className="flex-1 overflow-auto p-4">
          <div
            className="relative origin-top-left"
            style={{
              transform: `scale(${zoom})`,
              width: canvasPixelWidth,
              height: canvasPixelHeight,
            }}
          >
            {/* Grid background */}
            <div
              onClick={handleCanvasClick}
              className={cn(
                'absolute inset-0 rounded-lg transition-colors',
                'bg-muted/30'
              )}
              style={{
                backgroundImage: showGrid
                  ? `
                    linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)
                  `
                  : 'none',
                backgroundSize: `${cellSize}px ${cellSize}px`,
              }}
            />

            {/* Rooms container */}
            <div className="absolute inset-0">
              {rooms.map((room) => (
                <ResizableRoom
                  key={room.id}
                  room={room}
                  isSelected={room.id === selectedRoomId}
                  onSelect={setSelectedRoomId}
                  onMove={handleRoomMove}
                  onResize={handleRoomResize}
                  zoom={zoom}
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                  checkCollision={checkCollision}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <RoomSummaryPanel
          rooms={rooms}
          doors={doors.length}
          selectedRoom={rooms.find((r) => r.id === selectedRoomId) || null}
          onUpdateRoom={handleUpdateRoom}
          onRotateRoom={handleRotateRoom}
          onDuplicateRoom={handleDuplicateRoom}
          onDeleteRoom={handleDeleteRoom}
        />
      </div>
    </div>
  );
}
