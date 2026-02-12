import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { ResizableRoom } from './ResizableRoom';
import { RoomSummaryPanel } from './RoomPropertiesPanel';
import { DesignerToolbar } from './DesignerToolbar';
import type { DroppedRoom, RoomTemplate } from './types';
import { GRID_CELL_SIZE, ROOM_TEMPLATES, CANVAS_MIN_X, CANVAS_MAX_X, CANVAS_MIN_Y, CANVAS_MAX_Y } from './types';
import type { ApartmentLayout, RoomLayout, Door } from '@/interfaces/Building.interface';
import { cn } from '@/lib/utils';

interface LayoutDesignerProps {
  initialLayout?: ApartmentLayout;
  onSave?: (layout: ApartmentLayout) => void;
  apartmentName?: string;
  /** When true, auto-saves on changes (useful when embedded in a dialog) */
  embedded?: boolean;
}

// Infinite canvas config
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

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

  // Pan state for infinite canvas (Draw.io style)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);

  // Ref to track if we need to save
  const pendingSaveRef = useRef(false);

  // Calculate canvas bounds (for saving, we compute based on room extents)
  const canvasBounds = useMemo(() => {
    if (rooms.length === 0) return { minX: 0, minY: 0, maxX: 12, maxY: 8 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    rooms.forEach((room) => {
      minX = Math.min(minX, room.x);
      minY = Math.min(minY, room.y);
      maxX = Math.max(maxX, room.x + room.width);
      maxY = Math.max(maxY, room.y + room.height);
    });
    return { minX, minY, maxX, maxY };
  }, [rooms]);

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
        gridSize: 1, // Grid size is always 1 meter per cell
        width: Math.ceil(canvasBounds.maxX - canvasBounds.minX + 2),
        height: Math.ceil(canvasBounds.maxY - canvasBounds.minY + 2),
      };
      debouncedSave(layout);
    }
    
    return () => debouncedSave.cancel();
  }, [rooms, doors, zoom, canvasBounds, embedded, onSave, debouncedSave]);

  // === Pan & Zoom handlers (Draw.io style) ===
  
  // Handle mouse wheel zoom - must use native listener with passive: false to preventDefault
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -Math.sign(e.deltaY) * ZOOM_STEP;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta));
        
        // Zoom towards cursor position
        const rect = viewport.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        
        // Calculate the point in canvas space under the cursor
        const canvasX = (cursorX - panOffset.x) / zoom;
        const canvasY = (cursorY - panOffset.y) / zoom;
        
        // After zoom, adjust pan so the same canvas point is under the cursor
        const newPanX = cursorX - canvasX * newZoom;
        const newPanY = cursorY - canvasY * newZoom;
        
        setPanOffset({ x: newPanX, y: newPanY });
        setZoom(newZoom);
      } else if (!e.shiftKey) {
        // Regular scroll = pan
        setPanOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, [zoom, panOffset]);

  // Handle space key for pan mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target as HTMLElement)?.closest('input, textarea')) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pan on middle mouse button or space+drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (isSpacePressed && e.button === 0)) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, panX: panOffset.x, panY: panOffset.y };
    }
  }, [isSpacePressed, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPanOffset({ x: panStartRef.current.panX + dx, y: panStartRef.current.panY + dy });
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Center view on rooms initially
  useEffect(() => {
    if (viewportRef.current && rooms.length > 0) {
      const rect = viewportRef.current.getBoundingClientRect();
      const centerX = (canvasBounds.minX + canvasBounds.maxX) / 2 * GRID_CELL_SIZE;
      const centerY = (canvasBounds.minY + canvasBounds.maxY) / 2 * GRID_CELL_SIZE;
      setPanOffset({
        x: rect.width / 2 - centerX * zoom,
        y: rect.height / 2 - centerY * zoom,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

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

  // Handle room move from ResizableRoom (clamped to canvas bounds)
  const handleRoomMove = useCallback((id: string, x: number, y: number) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === id) {
          // Clamp position to canvas bounds (accounting for room size)
          const clampedX = Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X - room.width, x));
          const clampedY = Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y - room.height, y));
          return { ...room, x: clampedX, y: clampedY };
        }
        return room;
      })
    );
  }, []);

  // Handle room resize from ResizableRoom (clamped to canvas bounds)
  const handleRoomResize = useCallback((id: string, width: number, height: number, x: number, y: number) => {
    // Clamp position to canvas bounds (accounting for new room size)
    const clampedX = Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X - width, x));
    const clampedY = Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y - height, y));
    setRooms((prev) =>
      prev.map((room) => (room.id === id ? { ...room, width, height, x: clampedX, y: clampedY } : room))
    );
  }, []);

  // Add room - place in view center (within canvas bounds)
  const handleAddRoom = useCallback((template: RoomTemplate) => {
    // Calculate center of current viewport in grid coordinates
    const viewportRect = viewportRef.current?.getBoundingClientRect();
    let centerX = 0, centerY = 0; // fallback to origin
    
    if (viewportRect) {
      const viewCenterX = viewportRect.width / 2;
      const viewCenterY = viewportRect.height / 2;
      // Convert screen coords to canvas coords
      centerX = Math.round((viewCenterX - panOffset.x) / zoom / GRID_CELL_SIZE);
      centerY = Math.round((viewCenterY - panOffset.y) / zoom / GRID_CELL_SIZE);
    }

    // Clamp center to canvas bounds (accounting for room size)
    centerX = Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X - template.defaultWidth, centerX));
    centerY = Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y - template.defaultHeight, centerY));

    // Place room at center (clamped to canvas bounds)
    const x = Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X - template.defaultWidth, centerX));
    const y = Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y - template.defaultHeight, centerY));

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
  }, [rooms, zoom, panOffset]);

  const handleDeleteRoom = useCallback((id: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
    setDoors((prev) => prev.filter((door) => door.roomId !== id && door.connectedRoomId !== id));
    setSelectedRoomId(null);
  }, []);

  const handleRotateRoom = useCallback((id: string) => {
    setRooms((prev) => {
      const roomToRotate = prev.find((r) => r.id === id);
      if (!roomToRotate) return prev;

      // Swap width and height
      const newWidth = roomToRotate.height;
      const newHeight = roomToRotate.width;

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

    // Place duplicate slightly offset (clamped to canvas bounds)
    const newX = Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X - room.width, room.x + 1));
    const newY = Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y - room.height, room.y + 1));

    const newRoom: DroppedRoom = {
      ...room,
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: newX,
      y: newY,
    };

    setRooms((prev) => [...prev, newRoom]);
    setSelectedRoomId(newRoom.id);
  }, [rooms]);

  // Handle room updates from the properties panel (with canvas bounds)
  const handleUpdateRoom = useCallback((id: string, updates: Partial<DroppedRoom>) => {
    setRooms((prev) => {
      const roomToUpdate = prev.find((r) => r.id === id);
      if (!roomToUpdate) return prev;

      // Merge updates and clamp position to canvas bounds
      const newWidth = updates.width ?? roomToUpdate.width;
      const newHeight = updates.height ?? roomToUpdate.height;
      const newX = updates.x !== undefined 
        ? Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X - newWidth, updates.x))
        : roomToUpdate.x;
      const newY = updates.y !== undefined
        ? Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y - newHeight, updates.y))
        : roomToUpdate.y;

      const updatedRoom = { ...roomToUpdate, ...updates, x: newX, y: newY, width: newWidth, height: newHeight };

      return prev.map((room) => room.id === id ? updatedRoom : room);
    });
  }, []);

  const handleCanvasClick = useCallback(() => {
    if (!isPanning) {
      setSelectedRoomId(null);
    }
  }, [isPanning]);

  const handleReset = useCallback(() => {
    setRooms([]);
    setDoors([]);
    setSelectedRoomId(null);
    setPanOffset({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  // Fit view to show all rooms
  const handleFitView = useCallback(() => {
    if (!viewportRef.current || rooms.length === 0) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const padding = 60;
    
    const contentWidth = (canvasBounds.maxX - canvasBounds.minX) * GRID_CELL_SIZE;
    const contentHeight = (canvasBounds.maxY - canvasBounds.minY) * GRID_CELL_SIZE;
    
    const scaleX = (rect.width - padding * 2) / contentWidth;
    const scaleY = (rect.height - padding * 2) / contentHeight;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(scaleX, scaleY)));
    
    const centerX = (canvasBounds.minX + canvasBounds.maxX) / 2 * GRID_CELL_SIZE;
    const centerY = (canvasBounds.minY + canvasBounds.maxY) / 2 * GRID_CELL_SIZE;
    
    setZoom(newZoom);
    setPanOffset({
      x: rect.width / 2 - centerX * newZoom,
      y: rect.height / 2 - centerY * newZoom,
    });
  }, [rooms.length, canvasBounds]);

  const cellSize = GRID_CELL_SIZE;

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
        onFitView={handleFitView}
      />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Infinite Canvas Viewport */}
        <div
          ref={viewportRef}
          className={cn(
            'flex-1 overflow-hidden relative',
            isPanning && 'cursor-grabbing',
            isSpacePressed && !isPanning && 'cursor-grab'
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Canvas Transform Layer */}
          <div
            className="absolute"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            {/* Infinite Grid Background */}
            <div
              onClick={handleCanvasClick}
              className="fixed inset-0 pointer-events-auto"
              style={{
                width: '200vw',
                height: '200vh',
                marginLeft: '-50vw',
                marginTop: '-50vh',
                backgroundImage: showGrid
                  ? `
                    linear-gradient(to right, hsl(var(--border) / 0.2) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--border) / 0.2) 1px, transparent 1px)
                  `
                  : 'none',
                backgroundSize: `${cellSize}px ${cellSize}px`,
                backgroundPosition: `${(-panOffset.x / zoom) % cellSize}px ${(-panOffset.y / zoom) % cellSize}px`,
              }}
            />

            {/* Rooms */}
            {rooms.map((room) => (
              <ResizableRoom
                key={room.id}
                room={room}
                isSelected={room.id === selectedRoomId}
                onSelect={setSelectedRoomId}
                onMove={handleRoomMove}
                onResize={handleRoomResize}
                scale={zoom}
              />
            ))}
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground border">
            {Math.round(zoom * 100)}%
          </div>

          {/* Help text */}
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground border">
            Scroll to pan • Ctrl+Scroll to zoom • Space+drag to pan
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