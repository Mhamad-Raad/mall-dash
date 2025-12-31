import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Room, RoomType, ApartmentLayout, Door } from './types';
import { getRoomConfig } from './types';
import { RoomBox } from './RoomBox';
import { RoomToolbar } from './RoomToolbar';
import { DoorMarker } from './DoorMarker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Copy,
  RotateCw,
  AlertTriangle,
  DoorOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllOverlappingRoomIds, findNearestValidPosition } from './collisionUtils';
import { findSharedEdges, getEdgeAtPoint, generateDoorId, type SharedEdge } from './doorUtils';

interface RoomCreatorProps {
  layout: ApartmentLayout;
  onLayoutChange: (layout: ApartmentLayout) => void;
}

const MIN_GRID_COLS = 16;
const MIN_GRID_ROWS = 8;
const GRID_PADDING = 3; // Extra cells beyond the furthest room
const DEFAULT_CELL_SIZE = 52;

export const RoomCreator = ({ layout, onLayoutChange }: RoomCreatorProps) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedDoorId, setSelectedDoorId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [doorMode, setDoorMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);
  const [showGrid, setShowGrid] = useState(true);

  // Ensure doors array exists
  const doors = layout.doors || [];
  
  // Dynamic grid sizing based on room positions
  const { gridCols, gridRows } = useMemo(() => {
    if (layout.rooms.length === 0) {
      return { gridCols: MIN_GRID_COLS, gridRows: MIN_GRID_ROWS };
    }
    
    // Find the maximum extent of all rooms
    let maxX = 0;
    let maxY = 0;
    
    for (const room of layout.rooms) {
      const roomRight = room.x + room.width;
      const roomBottom = room.y + room.height;
      maxX = Math.max(maxX, roomRight);
      maxY = Math.max(maxY, roomBottom);
    }
    
    // Add padding and ensure minimum size
    return {
      gridCols: Math.max(MIN_GRID_COLS, maxX + GRID_PADDING),
      gridRows: Math.max(MIN_GRID_ROWS, maxY + GRID_PADDING),
    };
  }, [layout.rooms]);

  // Collision detection
  const overlappingRoomIds = useMemo(
    () => getAllOverlappingRoomIds(layout.rooms),
    [layout.rooms]
  );
  const hasCollisions = overlappingRoomIds.size > 0;

  // Find shared edges between adjacent rooms
  const sharedEdges = useMemo(
    () => findSharedEdges(layout.rooms),
    [layout.rooms]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const generateId = () => `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Door management
  const addDoor = useCallback(
    (edge: SharedEdge, clickPosition: number) => {
      const newDoor: Door = {
        id: generateDoorId(),
        roomId: edge.room1Id,
        connectedRoomId: edge.room2Id,
        edge: edge.edge,
        position: clickPosition, // 0-1 along the edge
        width: 0.9, // Default door width in meters
      };

      onLayoutChange({
        ...layout,
        doors: [...doors, newDoor],
      });
      setSelectedDoorId(newDoor.id);
      setDoorMode(false);
    },
    [layout, doors, onLayoutChange]
  );

  const deleteDoor = useCallback(
    (id: string) => {
      onLayoutChange({
        ...layout,
        doors: doors.filter((d) => d.id !== id),
      });
      if (selectedDoorId === id) {
        setSelectedDoorId(null);
      }
    },
    [layout, doors, onLayoutChange, selectedDoorId]
  );

  const updateDoorPosition = useCallback(
    (id: string, position: number) => {
      onLayoutChange({
        ...layout,
        doors: doors.map((d) =>
          d.id === id
            ? { ...d, position: Math.max(0.1, Math.min(0.9, position)) }
            : d
        ),
      });
    },
    [layout, doors, onLayoutChange]
  );

  const addRoom = useCallback(
    (type: RoomType) => {
      const config = getRoomConfig(type);
      const newRoom: Room = {
        id: generateId(),
        type,
        name: config.label,
        x: 1,
        y: 1,
        width: config.defaultWidth,
        height: config.defaultHeight,
      };

      onLayoutChange({
        ...layout,
        rooms: [...layout.rooms, newRoom],
      });
      setSelectedRoomId(newRoom.id);
      setSelectedType(null);
    },
    [layout, onLayoutChange]
  );

  const deleteRoom = useCallback(
    (id: string) => {
      // Also remove any doors connected to this room
      const updatedDoors = doors.filter(
        (d) => d.roomId !== id && d.connectedRoomId !== id
      );
      
      onLayoutChange({
        ...layout,
        rooms: layout.rooms.filter((r) => r.id !== id),
        doors: updatedDoors,
      });
      if (selectedRoomId === id) {
        setSelectedRoomId(null);
      }
    },
    [layout, doors, onLayoutChange, selectedRoomId]
  );

  const duplicateRoom = useCallback(
    (id: string) => {
      const room = layout.rooms.find(r => r.id === id);
      if (!room) return;
      
      // Find a valid position for the duplicate
      const newRoom: Room = {
        ...room,
        id: generateId(),
        name: `${room.name} (copy)`,
        x: room.x,
        y: room.y,
      };

      // Find nearest valid position offset from original
      const validPos = findNearestValidPosition(
        newRoom,
        room.x + 1,
        room.y + 1,
        layout.rooms
      );
      newRoom.x = validPos.x;
      newRoom.y = validPos.y;
      
      onLayoutChange({
        ...layout,
        rooms: [...layout.rooms, newRoom],
      });
      setSelectedRoomId(newRoom.id);
    },
    [layout, onLayoutChange]
  );

  const rotateRoom = useCallback(
    (id: string) => {
      const room = layout.rooms.find(r => r.id === id);
      if (!room) return;
      
      // Swap width and height
      const newWidth = room.height;
      const newHeight = room.width;
      
      // Check if rotation would cause overlap
      const testRoom: Room = { ...room, width: newWidth, height: newHeight };
      const otherRooms = layout.rooms.filter((r) => r.id !== id);
      const wouldOverlap = otherRooms.some((other) => {
        const r1Right = testRoom.x + testRoom.width;
        const r1Bottom = testRoom.y + testRoom.height;
        const r2Right = other.x + other.width;
        const r2Bottom = other.y + other.height;
        if (r1Right <= other.x || r2Right <= testRoom.x) return false;
        if (r1Bottom <= other.y || r2Bottom <= testRoom.y) return false;
        return true;
      });

      // Only rotate if it won't cause overlap
      if (!wouldOverlap) {
        onLayoutChange({
          ...layout,
          rooms: layout.rooms.map((r) =>
            r.id === id ? { ...r, width: newWidth, height: newHeight } : r
          ),
        });
      }
    },
    [layout, onLayoutChange]
  );

  const resizeRoom = useCallback(
    (id: string, width: number, height: number, deltaX?: number, deltaY?: number) => {
      const room = layout.rooms.find((r) => r.id === id);
      if (!room) return;

      const newWidth = Math.max(0.5, Math.round(width * 100) / 100);
      const newHeight = Math.max(0.5, Math.round(height * 100) / 100);
      
      // Calculate new position if provided (for top/left edge resizing)
      const newX = deltaX !== undefined 
        ? Math.max(0, Math.round((room.x + deltaX) * 100) / 100)
        : room.x;
      const newY = deltaY !== undefined 
        ? Math.max(0, Math.round((room.y + deltaY) * 100) / 100)
        : room.y;

      // Check if the new size would cause overlap
      const testRoom: Room = { ...room, x: newX, y: newY, width: newWidth, height: newHeight };
      const otherRooms = layout.rooms.filter((r) => r.id !== id);
      const wouldOverlap = otherRooms.some((other) => {
        const r1Right = testRoom.x + testRoom.width;
        const r1Bottom = testRoom.y + testRoom.height;
        const r2Right = other.x + other.width;
        const r2Bottom = other.y + other.height;
        if (r1Right <= other.x || r2Right <= testRoom.x) return false;
        if (r1Bottom <= other.y || r2Bottom <= testRoom.y) return false;
        return true;
      });

      // Only resize if it won't cause overlap
      if (!wouldOverlap) {
        onLayoutChange({
          ...layout,
          rooms: layout.rooms.map((r) =>
            r.id === id ? { ...r, x: newX, y: newY, width: newWidth, height: newHeight } : r
          ),
        });
      }
    },
    [layout, onLayoutChange]
  );

  const updateRoomName = useCallback(
    (id: string, name: string) => {
      onLayoutChange({
        ...layout,
        rooms: layout.rooms.map((r) => (r.id === id ? { ...r, name } : r)),
      });
    },
    [layout, onLayoutChange]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, delta } = event;
    const id = active.id as string;

    // Check if dragging a door
    if (id.startsWith('door-')) {
      const doorId = id.replace('door-', '');
      const door = doors.find((d) => d.id === doorId);
      const room = layout.rooms.find((r) => r.id === door?.roomId);

      if (door && room && delta) {
        const isVertical = door.edge === 'left' || door.edge === 'right';
        const edgeLength = isVertical ? room.height : room.width;
        const deltaPx = isVertical ? delta.y : delta.x;
        const deltaPos = deltaPx / (edgeLength * cellSize);
        const newPosition = Math.max(0.1, Math.min(0.9, door.position + deltaPos));

        updateDoorPosition(doorId, newPosition);
      }
      return;
    }

    // Dragging a room
    const room = layout.rooms.find((r) => r.id === id);

    if (room && delta) {
      // Calculate target position with 0.01m precision
      const targetX = Math.max(0, Math.round((room.x + delta.x / cellSize) * 100) / 100);
      const targetY = Math.max(0, Math.round((room.y + delta.y / cellSize) * 100) / 100);

      // Get other rooms (excluding the one being dragged)
      const otherRooms = layout.rooms.filter((r) => r.id !== id);

      // Find the nearest valid position that doesn't overlap
      const validPosition = findNearestValidPosition(room, targetX, targetY, otherRooms);

      onLayoutChange({
        ...layout,
        rooms: layout.rooms.map((r) =>
          r.id === id ? { ...r, x: validPosition.x, y: validPosition.y } : r
        ),
      });
    }
  };

  const handleClearAll = () => {
    onLayoutChange({ ...layout, rooms: [], doors: [] });
    setSelectedRoomId(null);
    setSelectedDoorId(null);
  };

  const selectedRoom = layout.rooms.find((r) => r.id === selectedRoomId);
  const selectedDoor = doors.find((d) => d.id === selectedDoorId);
  const activeRoom = layout.rooms.find((r) => r.id === activeId);

  return (
    <div className='flex flex-col h-full'>
      {/* Top toolbar - organized in rows */}
      <div className='space-y-3 pb-4 border-b mb-4'>
        {/* Row 1: Room types + Canvas controls */}
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            <RoomToolbar
              onAddRoom={addRoom}
              selectedType={selectedType}
              onSelectType={(type) => {
                setSelectedType(type);
                setDoorMode(false);
              }}
            />

            {/* Door mode button */}
            <Button
              variant={doorMode ? 'default' : 'outline'}
              size='sm'
              className='gap-1.5'
              onClick={() => {
                setDoorMode(!doorMode);
                setSelectedType(null);
              }}
              title='Add doors between rooms'
            >
              <DoorOpen className='w-4 h-4' />
              <span className='hidden sm:inline'>Add Door</span>
            </Button>
            
            {hasCollisions && (
              <div className='flex items-center gap-1.5 text-amber-500 text-xs px-2 py-1 bg-amber-500/10 rounded-md shrink-0'>
                <AlertTriangle className='w-3.5 h-3.5' />
                <span>Overlapping rooms</span>
              </div>
            )}
          </div>

          <div className='flex items-center gap-1 shrink-0'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => setCellSize((s) => Math.max(32, s - 8))}
              title='Zoom out'
            >
              <ZoomOut className='w-4 h-4' />
            </Button>
            <span className='text-xs text-muted-foreground w-10 text-center tabular-nums'>
              {Math.round((cellSize / DEFAULT_CELL_SIZE) * 100)}%
            </span>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => setCellSize((s) => Math.min(72, s + 8))}
              title='Zoom in'
            >
              <ZoomIn className='w-4 h-4' />
            </Button>
            <div className='w-px h-5 bg-border mx-1' />
            <Button
              variant={showGrid ? 'default' : 'outline'}
              size='icon'
              className='h-8 w-8'
              onClick={() => setShowGrid(!showGrid)}
              title='Toggle grid'
            >
              <Grid3X3 className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10'
              onClick={handleClearAll}
              title='Clear all rooms'
            >
              <RotateCcw className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content: Canvas + Room Editor side panel */}
      <div className='flex-1 flex gap-4 min-h-0 overflow-hidden'>
        {/* Canvas area - scrollable */}
        <div className='flex-1 overflow-auto bg-muted/20 rounded-xl p-4'>
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div
              className={cn(
                'relative border-2 border-dashed rounded-xl overflow-hidden bg-background shadow-sm',
                'transition-colors',
                selectedType && 'border-primary cursor-crosshair',
                doorMode && 'border-amber-500 cursor-pointer'
              )}
              style={{
                width: gridCols * cellSize,
                height: gridRows * cellSize,
                minWidth: MIN_GRID_COLS * cellSize,
                minHeight: MIN_GRID_ROWS * cellSize,
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                // Door mode - add door on shared edge
                if (doorMode) {
                  const edge = getEdgeAtPoint(clickX, clickY, layout.rooms, cellSize, 20);
                  if (edge) {
                    // Calculate position along the edge (0-1)
                    const isVertical = edge.edge === 'left' || edge.edge === 'right';
                    const edgeStart = isVertical ? edge.y1 * cellSize : edge.x1 * cellSize;
                    const edgeEnd = isVertical ? edge.y2 * cellSize : edge.x2 * cellSize;
                    const clickPos = isVertical ? clickY : clickX;
                    const position = (clickPos - edgeStart) / (edgeEnd - edgeStart);
                    addDoor(edge, Math.max(0.15, Math.min(0.85, position)));
                  }
                  return;
                }

                // Add room on click when type is selected
                if (selectedType) {
                  const x = Math.round((clickX / cellSize) * 100) / 100;
                  const y = Math.round((clickY / cellSize) * 100) / 100;
                  const config = getRoomConfig(selectedType);

                  const newRoom: Room = {
                    id: generateId(),
                    type: selectedType,
                    name: config.label,
                    x: Math.max(0, x),
                    y: Math.max(0, y),
                    width: config.defaultWidth,
                    height: config.defaultHeight,
                  };

                  onLayoutChange({
                    ...layout,
                    rooms: [...layout.rooms, newRoom],
                  });
                  setSelectedRoomId(newRoom.id);
                  setSelectedType(null);
                } else {
                  setSelectedRoomId(null);
                }
              }}
            >
              {/* Ruler markings - horizontal (top) */}
              {showGrid && (
                <div className='absolute -top-6 left-0 right-0 h-5 flex pointer-events-none'>
                  {Array.from({ length: Math.ceil(gridCols) }).map((_, i) => (
                    <div
                      key={`ruler-h-${i}`}
                      className='relative'
                      style={{ width: cellSize }}
                    >
                      {i % 2 === 0 && (
                        <span className='absolute left-0 -top-0.5 text-[9px] text-muted-foreground/70 font-mono'>
                          {i}m
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Ruler markings - vertical (left) */}
              {showGrid && (
                <div className='absolute top-0 -left-6 bottom-0 w-5 pointer-events-none'>
                  {Array.from({ length: Math.ceil(gridRows) }).map((_, i) => (
                    <div
                      key={`ruler-v-${i}`}
                      className='relative'
                      style={{ height: cellSize }}
                    >
                      {i % 2 === 0 && (
                        <span className='absolute -left-0.5 top-0 text-[9px] text-muted-foreground/70 font-mono'>
                          {i}m
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Grid lines */}
              {showGrid &&
                Array.from({ length: gridCols + 1 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className={cn(
                      'absolute top-0 bottom-0 w-px',
                      i % 5 === 0 ? 'bg-border/50' : 'bg-border/20'
                    )}
                    style={{ left: i * cellSize }}
                  />
                ))}
              {showGrid &&
                Array.from({ length: gridRows + 1 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className={cn(
                      'absolute left-0 right-0 h-px',
                      i % 5 === 0 ? 'bg-border/50' : 'bg-border/20'
                    )}
                    style={{ top: i * cellSize }}
                  />
                ))}

              {/* Rooms */}
              {layout.rooms.map((room) => (
                <RoomBox
                  key={room.id}
                  room={room}
                  cellSize={cellSize}
                  isSelected={selectedRoomId === room.id}
                  isOverlapping={overlappingRoomIds.has(room.id)}
                  onSelect={(id) => {
                    setSelectedRoomId(id);
                    setSelectedDoorId(null);
                  }}
                  onDelete={deleteRoom}
                  onResize={resizeRoom}
                />
              ))}

              {/* Shared edges highlight (when in door mode) */}
              {doorMode && sharedEdges.map((edge, i) => {
                const x1 = edge.x1 * cellSize;
                const y1 = edge.y1 * cellSize;
                const x2 = edge.x2 * cellSize;
                const y2 = edge.y2 * cellSize;
                const isVertical = x1 === x2;
                
                return (
                  <div
                    key={`edge-${i}`}
                    className='absolute bg-amber-500/50 hover:bg-amber-500/80 transition-colors z-20 pointer-events-auto'
                    style={{
                      left: Math.min(x1, x2) - (isVertical ? 3 : 0),
                      top: Math.min(y1, y2) - (isVertical ? 0 : 3),
                      width: isVertical ? 6 : Math.abs(x2 - x1),
                      height: isVertical ? Math.abs(y2 - y1) : 6,
                      borderRadius: 3,
                    }}
                    title='Click to add door'
                  />
                );
              })}

              {/* Doors */}
              {doors.map((door) => {
                const room = layout.rooms.find((r) => r.id === door.roomId);
                const connectedRoom = door.connectedRoomId
                  ? layout.rooms.find((r) => r.id === door.connectedRoomId)
                  : undefined;
                if (!room) return null;
                
                return (
                  <DoorMarker
                    key={door.id}
                    door={door}
                    room={room}
                    connectedRoom={connectedRoom}
                    cellSize={cellSize}
                    isSelected={selectedDoorId === door.id}
                    onSelect={(id) => {
                      setSelectedDoorId(id);
                      setSelectedRoomId(null);
                    }}
                    onDelete={deleteDoor}
                  />
                );
              })}

              {/* Empty state hint */}
              {layout.rooms.length === 0 && !selectedType && !doorMode && (
                <div className='absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none'>
                  <div className='text-center'>
                    <p className='text-sm'>Select a room type above</p>
                    <p className='text-xs mt-1'>then click here to place it</p>
                  </div>
                </div>
              )}

              {/* Door mode hint */}
              {doorMode && sharedEdges.length === 0 && layout.rooms.length > 0 && (
                <div className='absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none'>
                  <div className='text-center'>
                    <p className='text-sm'>No adjacent rooms found</p>
                    <p className='text-xs mt-1'>Place rooms next to each other to add doors</p>
                  </div>
                </div>
              )}

              {doorMode && sharedEdges.length > 0 && (
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/90 px-3 py-1.5 rounded-full border shadow-sm pointer-events-none'>
                  Click on a highlighted wall to add a door
                </div>
              )}
            </div>

            <DragOverlay>
              {activeRoom && (
                <div
                  className='rounded-lg border-2 border-dashed shadow-2xl'
                  style={{
                    width: activeRoom.width * cellSize,
                    height: activeRoom.height * cellSize,
                    backgroundColor: `${getRoomConfig(activeRoom.type).color}30`,
                    borderColor: getRoomConfig(activeRoom.type).color,
                    boxShadow: `0 0 20px ${getRoomConfig(activeRoom.type).color}40`,
                  }}
                >
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='bg-background/90 px-2 py-1 rounded text-xs font-medium shadow-sm'>
                      {activeRoom.width}m × {activeRoom.height}m
                    </div>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Right panel - Selected room editor */}
        <div className='w-64 shrink-0 space-y-4 overflow-auto'>
          {selectedRoom ? (
            <div className='p-4 bg-muted/30 rounded-xl border space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div
                    className='w-4 h-4 rounded'
                    style={{ backgroundColor: overlappingRoomIds.has(selectedRoom.id) ? '#ef4444' : getRoomConfig(selectedRoom.type).color }}
                  />
                  <span className='font-medium'>Edit Room</span>
                </div>
                {overlappingRoomIds.has(selectedRoom.id) && (
                  <AlertTriangle className='w-4 h-4 text-amber-500' />
                )}
              </div>
              
              <div className='space-y-3'>
                <div>
                  <Label className='text-xs text-muted-foreground'>Room Name</Label>
                  <Input
                    value={selectedRoom.name}
                    onChange={(e) => updateRoomName(selectedRoom.id, e.target.value)}
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label className='text-xs text-muted-foreground'>Size (meters)</Label>
                  <div className='flex gap-2 mt-1 items-center'>
                    <Input
                      type='number'
                      min={0.5}
                      max={50}
                      step={0.01}
                      value={selectedRoom.width}
                      onChange={(e) =>
                        resizeRoom(
                          selectedRoom.id,
                          parseFloat(e.target.value) || 0.5,
                          selectedRoom.height
                        )
                      }
                      className='w-20'
                    />
                    <span className='text-muted-foreground'>×</span>
                    <Input
                      type='number'
                      min={0.5}
                      max={50}
                      step={0.01}
                      value={selectedRoom.height}
                      onChange={(e) =>
                        resizeRoom(
                          selectedRoom.id,
                          selectedRoom.width,
                          parseFloat(e.target.value) || 0.5
                        )
                      }
                      className='w-20'
                    />
                    <span className='text-muted-foreground'>m</span>
                  </div>
                  <div className='mt-2 text-sm text-muted-foreground'>
                    Area: <span className='font-medium text-foreground'>{(selectedRoom.width * selectedRoom.height).toFixed(2)} m²</span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => duplicateRoom(selectedRoom.id)}
                    title='Duplicate (Ctrl+D)'
                  >
                    <Copy className='w-4 h-4 mr-1' />
                    Copy
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => rotateRoom(selectedRoom.id)}
                    title='Rotate (R)'
                  >
                    <RotateCw className='w-4 h-4 mr-1' />
                    Rotate
                  </Button>
                </div>
                
                <Button
                  variant='destructive'
                  size='sm'
                  className='w-full'
                  onClick={() => deleteRoom(selectedRoom.id)}
                >
                  Delete Room
                </Button>
              </div>
            </div>
          ) : selectedDoor ? (
            <div className='p-4 bg-muted/30 rounded-xl border space-y-4'>
              <div className='flex items-center gap-2'>
                <DoorOpen className='w-4 h-4 text-amber-500' />
                <span className='font-medium'>Edit Door</span>
              </div>
              
              <div className='space-y-3'>
                <div className='text-sm'>
                  <span className='text-muted-foreground'>Connects:</span>
                  <div className='mt-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-3 h-3 rounded'
                        style={{ backgroundColor: getRoomConfig(layout.rooms.find(r => r.id === selectedDoor.roomId)?.type || 'bedroom').color }}
                      />
                      <span>{layout.rooms.find(r => r.id === selectedDoor.roomId)?.name}</span>
                    </div>
                    {selectedDoor.connectedRoomId && (
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-3 h-3 rounded'
                          style={{ backgroundColor: getRoomConfig(layout.rooms.find(r => r.id === selectedDoor.connectedRoomId)?.type || 'bedroom').color }}
                        />
                        <span>{layout.rooms.find(r => r.id === selectedDoor.connectedRoomId)?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className='text-xs text-muted-foreground'>Door Width (meters)</Label>
                  <Input
                    type='number'
                    min={0.6}
                    max={2}
                    step={0.1}
                    value={selectedDoor.width}
                    onChange={(e) => {
                      const newWidth = parseFloat(e.target.value) || 0.9;
                      onLayoutChange({
                        ...layout,
                        doors: doors.map(d => 
                          d.id === selectedDoor.id ? { ...d, width: Math.max(0.6, Math.min(2, newWidth)) } : d
                        ),
                      });
                    }}
                    className='mt-1 w-24'
                  />
                </div>

                <p className='text-xs text-muted-foreground'>
                  Drag the door to reposition along the wall
                </p>
                
                <Button
                  variant='destructive'
                  size='sm'
                  className='w-full'
                  onClick={() => deleteDoor(selectedDoor.id)}
                >
                  Delete Door
                </Button>
              </div>
            </div>
          ) : (
            <div className='p-4 bg-muted/20 rounded-xl border border-dashed text-center text-muted-foreground'>
              <p className='text-sm'>Click a room to edit</p>
              <p className='text-xs mt-1'>or drag to reposition</p>
            </div>
          )}

          {/* Room count summary */}
          {layout.rooms.length > 0 && (
            <div className='p-4 bg-muted/20 rounded-xl border'>
              <p className='text-xs text-muted-foreground mb-2'>Room Summary</p>
              <div className='space-y-1'>
                {Object.entries(
                  layout.rooms.reduce((acc, room) => {
                    acc[room.type] = (acc[room.type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <div key={type} className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-2 h-2 rounded-full'
                        style={{ backgroundColor: getRoomConfig(type as RoomType).color }}
                      />
                      <span>{getRoomConfig(type as RoomType).label}</span>
                    </div>
                    <span className='text-muted-foreground'>{count}</span>
                  </div>
                ))}
                {doors.length > 0 && (
                  <div className='flex items-center justify-between text-sm pt-1 mt-1 border-t'>
                    <div className='flex items-center gap-2'>
                      <DoorOpen className='w-3 h-3 text-amber-500' />
                      <span>Doors</span>
                    </div>
                    <span className='text-muted-foreground'>{doors.length}</span>
                  </div>
                )}
              </div>
              
              {/* Total area */}
              <div className='mt-3 pt-3 border-t'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Total Area</span>
                  <span className='text-sm font-semibold text-primary'>
                    {layout.rooms.reduce((sum, room) => sum + room.width * room.height, 0).toFixed(2)} m²
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCreator;
