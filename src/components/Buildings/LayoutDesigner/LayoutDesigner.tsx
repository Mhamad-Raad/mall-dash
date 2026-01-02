import { useState, useCallback, useId, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { DroppableCanvas } from './DroppableCanvas';
import { DraggableRoom } from './DraggableRoom';
import { RoomSummaryPanel } from './RoomPropertiesPanel';
import { DesignerToolbar } from './DesignerToolbar';
import { DragOverlayContent } from './DragOverlayContent';
import type { DroppedRoom, RoomTemplate } from './types';
import { GRID_CELL_SIZE, GRID_PRECISION, ROOM_TEMPLATES } from './types';
import { wouldCollide, findBestValidPosition } from './collisionDetection';
import type { ApartmentLayout, RoomLayout, Door } from '@/interfaces/Building.interface';

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
  const dndContextId = useId();

  // Convert initial layout to DroppedRoom format
  const initialRooms: DroppedRoom[] = initialLayout?.rooms.map((room) => ({
    ...room,
    borderColor: ROOM_TEMPLATES.find((t) => t.type === room.type)?.borderColor || '#666',
  })) || [];

  const [rooms, setRooms] = useState<DroppedRoom[]>(initialRooms);
  const [doors, setDoors] = useState<Door[]>(initialLayout?.doors || []);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [activeRoom, setActiveRoom] = useState<DroppedRoom | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(initialLayout?.width || MIN_CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(initialLayout?.height || MIN_CANVAS_HEIGHT);

  // Calculate required canvas size based on room positions
  const recalculateCanvasSize = useCallback((currentRooms: DroppedRoom[]) => {
    if (currentRooms.length === 0) {
      setCanvasWidth(MIN_CANVAS_WIDTH);
      setCanvasHeight(MIN_CANVAS_HEIGHT);
      return;
    }

    // Find the furthest room edges
    let maxRight = 0;
    let maxBottom = 0;
    currentRooms.forEach((room) => {
      maxRight = Math.max(maxRight, room.x + room.width);
      maxBottom = Math.max(maxBottom, room.y + room.height);
    });

    // Add padding and clamp to min/max
    const neededWidth = Math.max(MIN_CANVAS_WIDTH, Math.min(maxRight + EXPAND_THRESHOLD + 2, MAX_CANVAS_WIDTH));
    const neededHeight = Math.max(MIN_CANVAS_HEIGHT, Math.min(maxBottom + EXPAND_THRESHOLD + 2, MAX_CANVAS_HEIGHT));

    setCanvasWidth(neededWidth);
    setCanvasHeight(neededHeight);
  }, []);

  // Configure sensors for smooth dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Auto-save layout whenever rooms or doors change (for embedded mode)
  useEffect(() => {
    if (embedded && onSave) {
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
      onSave(layout);
    }
  }, [rooms, doors, zoom, canvasWidth, canvasHeight, embedded, onSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedRoomId) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteRoom(selectedRoomId);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRotateRoom(selectedRoomId);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleDuplicateRoom(selectedRoomId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRoomId]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const room = rooms.find((r) => r.id === event.active.id);
      setActiveRoom(room || null);
    },
    [rooms]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      setActiveRoom(null);

      const data = active.data.current;
      if (!data?.room) return;

      // Move existing room - divide delta by zoom to compensate for canvas scaling
      // Round to GRID_PRECISION increments (e.g., 0.001 = 1mm precision)
      const cellSize = GRID_CELL_SIZE;
      const rawDeltaX = delta.x / zoom / cellSize;
      const rawDeltaY = delta.y / zoom / cellSize;
      const deltaX = Math.round(rawDeltaX / GRID_PRECISION) * GRID_PRECISION;
      const deltaY = Math.round(rawDeltaY / GRID_PRECISION) * GRID_PRECISION;

      if (Math.abs(deltaX) < GRID_PRECISION && Math.abs(deltaY) < GRID_PRECISION) return;

      setRooms((prev) => {
        // First, calculate where the dragged room would end up
        const draggedRoom = prev.find((r) => r.id === active.id);
        if (!draggedRoom) return prev;

        let targetX = draggedRoom.x + deltaX;
        let targetY = draggedRoom.y + deltaY;

        // Check if we need to shift all rooms (expanding left or top)
        let shiftX = 0;
        let shiftY = 0;

        if (targetX < 0) {
          shiftX = -targetX; // Shift everything right to make room
          targetX = 0;
        }
        if (targetY < 0) {
          shiftY = -targetY; // Shift everything down to make room
          targetY = 0;
        }

        // Apply shift to all other rooms first to check collision in new positions
        const shiftedRooms = prev.map((room) => {
          if (room.id === active.id) return room; // Don't shift the dragged room yet
          return { ...room, x: room.x + shiftX, y: room.y + shiftY };
        });

        // Find the best valid position (snaps to edges of nearby rooms)
        const validPosition = findBestValidPosition(
          draggedRoom,
          targetX + shiftX,
          targetY + shiftY,
          shiftedRooms,
          15 // Search within 15 units for best snap position
        );

        if (validPosition.hasCollision) {
          return prev; // Don't move if no valid position found
        }

        // Update all rooms with the shift, and apply the move to the dragged room
        const updated = prev.map((room) => {
          if (room.id === active.id) {
            return { ...room, x: validPosition.x, y: validPosition.y };
          }
          return { ...room, x: room.x + shiftX, y: room.y + shiftY };
        });

        // Recalculate canvas size (will expand or shrink as needed)
        recalculateCanvasSize(updated);

        return updated;
      });
    },
    [zoom, recalculateCanvasSize]
  );

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

    // Find a valid position for the duplicate (snaps to best nearby position)
    const validPosition = findBestValidPosition(
      room,
      room.x + 1,
      room.y + 1,
      rooms,
      15 // Search within 15 units
    );

    const newRoom: DroppedRoom = {
      ...room,
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: validPosition.x,
      y: validPosition.y,
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

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
          {/* Canvas Area */}
          <div className="flex-1 flex overflow-auto">
            <div
              className="flex-1"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            >
              <DroppableCanvas
                gridSize={1}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                showGrid={showGrid}
                onCanvasClick={handleCanvasClick}
              >
                {rooms.map((room) => (
                  <DraggableRoom
                    key={room.id}
                    room={room}
                    isSelected={room.id === selectedRoomId}
                    onSelect={setSelectedRoomId}
                    gridSize={1}
                  />
                ))}
              </DroppableCanvas>
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

      {/* Drag Overlay - follows the cursor smoothly */}
      <DragOverlay dropAnimation={null}>
        {activeRoom ? (
          <DragOverlayContent room={activeRoom} gridSize={1} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
