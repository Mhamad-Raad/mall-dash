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
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DroppableCanvas } from './DroppableCanvas';
import { DraggableRoom } from './DraggableRoom';
import { RoomSummaryPanel } from './RoomPropertiesPanel';
import { DesignerToolbar } from './DesignerToolbar';
import { DragOverlayContent } from './DragOverlayContent';
import type { DroppedRoom, RoomTemplate } from './types';
import { GRID_CELL_SIZE, ROOM_TEMPLATES } from './types';
import type { ApartmentLayout, RoomLayout, Door } from '@/interfaces/Building.interface';
import { toast } from 'sonner';

interface LayoutDesignerProps {
  initialLayout?: ApartmentLayout;
  onSave?: (layout: ApartmentLayout) => void;
  apartmentName?: string;
  /** When true, auto-saves on changes (useful when embedded in a dialog) */
  embedded?: boolean;
}

// Canvas dimensions in grid cells (meters)
const CANVAS_WIDTH = 18;
const CANVAS_HEIGHT = 12;

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
      };
      onSave(layout);
    }
  }, [rooms, doors, zoom, embedded, onSave]);

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
      const cellSize = GRID_CELL_SIZE;
      const deltaX = Math.round(delta.x / zoom / cellSize);
      const deltaY = Math.round(delta.y / zoom / cellSize);

      if (deltaX === 0 && deltaY === 0) return;

      setRooms((prev) =>
        prev.map((room) => {
          if (room.id === active.id) {
            const newX = Math.max(0, Math.min(room.x + deltaX, CANVAS_WIDTH - room.width));
            const newY = Math.max(0, Math.min(room.y + deltaY, CANVAS_HEIGHT - room.height));
            return { ...room, x: newX, y: newY };
          }
          return room;
        })
      );
    },
    [zoom]
  );

  // Add room from toolbar click
  const handleAddRoom = useCallback((template: RoomTemplate) => {
    // Find a free position for the new room
    let x = 1;
    let y = 1;

    // Simple placement: try to find a spot that doesn't overlap
    const isOverlapping = (testX: number, testY: number, w: number, h: number) => {
      return rooms.some((room) => {
        return !(testX + w <= room.x || testX >= room.x + room.width ||
                 testY + h <= room.y || testY >= room.y + room.height);
      });
    };

    // Find first available position
    outer: for (let ty = 1; ty < CANVAS_HEIGHT - template.defaultHeight; ty++) {
      for (let tx = 1; tx < CANVAS_WIDTH - template.defaultWidth; tx++) {
        if (!isOverlapping(tx, ty, template.defaultWidth, template.defaultHeight)) {
          x = tx;
          y = ty;
          break outer;
        }
      }
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

    setRooms((prev) => [...prev, newRoom]);
    setSelectedRoomId(newRoom.id);
  }, [rooms]);

  const handleDeleteRoom = useCallback((id: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
    setDoors((prev) => prev.filter((door) => door.roomId !== id && door.connectedRoomId !== id));
    setSelectedRoomId(null);
  }, []);

  const handleRotateRoom = useCallback((id: string) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === id) {
          // Swap width and height
          const newWidth = room.height;
          const newHeight = room.width;
          // Adjust position to keep within bounds
          const newX = Math.min(room.x, CANVAS_WIDTH - newWidth);
          const newY = Math.min(room.y, CANVAS_HEIGHT - newHeight);
          return { ...room, width: newWidth, height: newHeight, x: Math.max(0, newX), y: Math.max(0, newY) };
        }
        return room;
      })
    );
  }, []);

  const handleDuplicateRoom = useCallback((id: string) => {
    const room = rooms.find((r) => r.id === id);
    if (!room) return;

    const newRoom: DroppedRoom = {
      ...room,
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: Math.min(room.x + 1, CANVAS_WIDTH - room.width),
      y: Math.min(room.y + 1, CANVAS_HEIGHT - room.height),
    };

    setRooms((prev) => [...prev, newRoom]);
    setSelectedRoomId(newRoom.id);
  }, [rooms]);

  const handleCanvasClick = useCallback(() => {
    setSelectedRoomId(null);
  }, []);

  const handleReset = useCallback(() => {
    setRooms([]);
    setDoors([]);
    setSelectedRoomId(null);
    toast.info('Layout reset');
  }, []);

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
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
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div
                className="min-w-max min-h-max p-6"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
              >
                <DroppableCanvas
                  gridSize={1}
                  canvasWidth={CANVAS_WIDTH}
                  canvasHeight={CANVAS_HEIGHT}
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
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>

          {/* Right Summary Panel */}
          <RoomSummaryPanel
            rooms={rooms}
            doors={doors.length}
          />
        </div>
      </div>

      {/* Drag Overlay - follows the cursor smoothly */}
      <DragOverlay>
        {activeRoom ? (
          <DragOverlayContent room={activeRoom} gridSize={1} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
