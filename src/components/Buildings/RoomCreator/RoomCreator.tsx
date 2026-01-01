import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragMoveEvent } from '@dnd-kit/core';
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
  Bed,
  Bath,
  CookingPot,
  Sofa,
  Utensils,
  Fence,
  Archive,
  Briefcase,
  MoveHorizontal,
  Save,
  FolderOpen,
  Trash2,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHistory } from './useHistory';
import { getAllOverlappingRoomIds, findNearestValidPosition } from './collisionUtils';
import { findSharedEdges, getEdgeAtPoint, generateDoorId, type SharedEdge } from './doorUtils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ROOM_TYPES } from './types';
import { useLayoutTemplates } from './useLayoutTemplates';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import type { LucideIcon } from 'lucide-react';

const ROOM_ICON_MAP: Record<string, LucideIcon> = {
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

interface RoomCreatorProps {
  layout: ApartmentLayout;
  onLayoutChange: (layout: ApartmentLayout) => void;
}

const MIN_GRID_COLS = 20;
const MIN_GRID_ROWS = 12;
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
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [loadTemplateOpen, setLoadTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [ghostPosition, setGhostPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const { templates, saveTemplate, deleteTemplate, applyTemplate } = useLayoutTemplates();

  // History management
  const { pushState, undo, redo, canUndo, canRedo } = useHistory(layout);

  const handleLayoutChange = useCallback((newLayout: ApartmentLayout) => {
    pushState(newLayout);
    onLayoutChange(newLayout);
  }, [onLayoutChange, pushState]);

  const handleUndo = useCallback(() => {
    const previousLayout = undo();
    if (previousLayout) {
      onLayoutChange(previousLayout);
    }
  }, [undo, onLayoutChange]);

  const handleRedo = useCallback(() => {
    const nextLayout = redo();
    if (nextLayout) {
      onLayoutChange(nextLayout);
    }
  }, [redo, onLayoutChange]);

  // Ctrl+scroll zoom handler - needs non-passive event listener to prevent browser zoom
  // Attached to scroll container to capture wheel events in the entire area
  useEffect(() => {
    const container = scrollContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const zoomDelta = e.deltaY > 0 ? -4 : 4;
        
        setCellSize((oldCellSize) => {
          const newCellSize = Math.max(24, Math.min(96, oldCellSize + zoomDelta));
          
          if (newCellSize !== oldCellSize) {
            const scale = newCellSize / oldCellSize;
            const scrollX = container.scrollLeft;
            const scrollY = container.scrollTop;
            const newScrollX = mouseX * scale - (mouseX - scrollX);
            const newScrollY = mouseY * scale - (mouseY - scrollY);
            
            requestAnimationFrame(() => {
              container.scrollLeft = Math.max(0, newScrollX);
              container.scrollTop = Math.max(0, newScrollY);
            });
          }
          
          return newCellSize;
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Middle mouse button panning
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Middle mouse button = 1
      if (e.button === 1) {
        e.preventDefault();
        isPanningRef.current = true;
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          scrollLeft: container.scrollLeft,
          scrollTop: container.scrollTop,
        };
        container.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return;
      e.preventDefault();
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      container.scrollLeft = panStartRef.current.scrollLeft - dx;
      container.scrollTop = panStartRef.current.scrollTop - dy;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1 || isPanningRef.current) {
        isPanningRef.current = false;
        container.style.cursor = '';
      }
    };

    // Prevent default middle-click behavior (auto-scroll)
    const handleAuxClick = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('auxclick', handleAuxClick);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('auxclick', handleAuxClick);
    };
  }, []);

  // Ensure doors array exists
  const doors = layout.doors || [];
  
  // Dynamic grid sizing based on room positions - expands in all directions
  const { gridCols, gridRows, offsetX, offsetY } = useMemo(() => {
    if (layout.rooms.length === 0) {
      return { gridCols: MIN_GRID_COLS, gridRows: MIN_GRID_ROWS, offsetX: 0, offsetY: 0 };
    }
    
    // Find the bounding box of all rooms
    let minX = Infinity;
    let minY = Infinity;
    let maxX = 0;
    let maxY = 0;
    
    for (const room of layout.rooms) {
      minX = Math.min(minX, room.x);
      minY = Math.min(minY, room.y);
      maxX = Math.max(maxX, room.x + room.width);
      maxY = Math.max(maxY, room.y + room.height);
    }
    
    // Calculate offset to ensure padding on left/top
    // If rooms start at x=2, we want padding before them
    const needsLeftPadding = minX < GRID_PADDING;
    const needsTopPadding = minY < GRID_PADDING;
    
    // Offset shifts the coordinate system so there's always padding
    const offX = needsLeftPadding ? GRID_PADDING - minX : 0;
    const offY = needsTopPadding ? GRID_PADDING - minY : 0;
    
    // Total grid size includes padding on all sides
    const totalWidth = maxX + offX + GRID_PADDING;
    const totalHeight = maxY + offY + GRID_PADDING;
    
    return {
      gridCols: Math.max(MIN_GRID_COLS, Math.ceil(totalWidth)),
      gridRows: Math.max(MIN_GRID_ROWS, Math.ceil(totalHeight)),
      offsetX: offX,
      offsetY: offY,
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

      handleLayoutChange({
        ...layout,
        doors: [...doors, newDoor],
      });
      setSelectedDoorId(newDoor.id);
      setDoorMode(false);
    },
    [layout, doors, handleLayoutChange]
  );

  const deleteDoor = useCallback(
    (id: string) => {
      handleLayoutChange({
        ...layout,
        doors: doors.filter((d) => d.id !== id),
      });
      if (selectedDoorId === id) {
        setSelectedDoorId(null);
      }
    },
    [layout, doors, handleLayoutChange, selectedDoorId]
  );

  const updateDoorPosition = useCallback(
    (id: string, position: number) => {
      handleLayoutChange({
        ...layout,
        doors: doors.map((d) =>
          d.id === id
            ? { ...d, position: Math.max(0.1, Math.min(0.9, position)) }
            : d
        ),
      });
    },
    [layout, doors, handleLayoutChange]
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

      handleLayoutChange({
        ...layout,
        rooms: [...layout.rooms, newRoom],
      });
      setSelectedRoomId(newRoom.id);
      setSelectedType(null);
    },
    [layout, handleLayoutChange]
  );

  const addRoomAtPosition = useCallback(
    (type: RoomType, x: number, y: number) => {
      const config = getRoomConfig(type);
      const newRoom: Room = {
        id: generateId(),
        type,
        name: config.label,
        // Allow negative positions - canvas will expand
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        width: config.defaultWidth,
        height: config.defaultHeight,
      };

      // Find valid position if there's overlap
      const validPos = findNearestValidPosition(
        newRoom,
        newRoom.x,
        newRoom.y,
        layout.rooms
      );
      newRoom.x = validPos.x;
      newRoom.y = validPos.y;

      handleLayoutChange({
        ...layout,
        rooms: [...layout.rooms, newRoom],
      });
      setSelectedRoomId(newRoom.id);
    },
    [layout, handleLayoutChange]
  );

  const deleteRoom = useCallback(
    (id: string) => {
      // Also remove any doors connected to this room
      const updatedDoors = doors.filter(
        (d) => d.roomId !== id && d.connectedRoomId !== id
      );
      
      handleLayoutChange({
        ...layout,
        rooms: layout.rooms.filter((r) => r.id !== id),
        doors: updatedDoors,
      });
      if (selectedRoomId === id) {
        setSelectedRoomId(null);
      }
    },
    [layout, doors, handleLayoutChange, selectedRoomId]
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
      
      handleLayoutChange({
        ...layout,
        rooms: [...layout.rooms, newRoom],
      });
      setSelectedRoomId(newRoom.id);
    },
    [layout, handleLayoutChange]
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
        handleLayoutChange({
          ...layout,
          rooms: layout.rooms.map((r) =>
            r.id === id ? { ...r, width: newWidth, height: newHeight } : r
          ),
        });
      }
    },
    [layout, handleLayoutChange]
  );

  const resizeRoom = useCallback(
    (id: string, width: number, height: number, deltaX?: number, deltaY?: number) => {
      const room = layout.rooms.find((r) => r.id === id);
      if (!room) return;

      const newWidth = Math.max(0.5, Math.round(width * 100) / 100);
      const newHeight = Math.max(0.5, Math.round(height * 100) / 100);
      const otherRooms = layout.rooms.filter((r) => r.id !== id);
      const tolerance = 0.1;
      
      // Calculate new position
      let newX = room.x;
      let newY = room.y;
      
      if (deltaX !== undefined || deltaY !== undefined) {
        // Position deltas provided (from edge/corner resizing)
        newX = deltaX !== undefined 
          ? Math.round((room.x + deltaX) * 100) / 100
          : room.x;
        newY = deltaY !== undefined 
          ? Math.round((room.y + deltaY) * 100) / 100
          : room.y;
      } else {
        // Smart resize from input fields - detect blocked sides
        const widthDiff = newWidth - room.width;
        const heightDiff = newHeight - room.height;
        
        // Check which sides are blocked by adjacent rooms
        const blockedLeft = otherRooms.some((other) => {
          const touchesLeft = Math.abs((other.x + other.width) - room.x) < tolerance;
          const overlapY = !(room.y + room.height <= other.y || other.y + other.height <= room.y);
          return touchesLeft && overlapY;
        });
        
        const blockedRight = otherRooms.some((other) => {
          const touchesRight = Math.abs(other.x - (room.x + room.width)) < tolerance;
          const overlapY = !(room.y + room.height <= other.y || other.y + other.height <= room.y);
          return touchesRight && overlapY;
        });
        
        const blockedTop = otherRooms.some((other) => {
          const touchesTop = Math.abs((other.y + other.height) - room.y) < tolerance;
          const overlapX = !(room.x + room.width <= other.x || other.x + other.width <= room.x);
          return touchesTop && overlapX;
        });
        
        const blockedBottom = otherRooms.some((other) => {
          const touchesBottom = Math.abs(other.y - (room.y + room.height)) < tolerance;
          const overlapX = !(room.x + room.width <= other.x || other.x + other.width <= room.x);
          return touchesBottom && overlapX;
        });
        
        // Determine how to distribute width change
        if (widthDiff !== 0) {
          if (blockedLeft && !blockedRight) {
            // Grow right only (x stays same)
          } else if (blockedRight && !blockedLeft) {
            // Grow left only (move x left)
            newX = Math.round((room.x - widthDiff) * 100) / 100;
          } else if (!blockedLeft && !blockedRight) {
            // Grow from center
            newX = Math.round((room.x - widthDiff / 2) * 100) / 100;
          }
          // If both blocked, grow right (default)
        }
        
        // Determine how to distribute height change
        if (heightDiff !== 0) {
          if (blockedTop && !blockedBottom) {
            // Grow down only (y stays same)
          } else if (blockedBottom && !blockedTop) {
            // Grow up only (move y up)
            newY = Math.round((room.y - heightDiff) * 100) / 100;
          } else if (!blockedTop && !blockedBottom) {
            // Grow from center
            newY = Math.round((room.y - heightDiff / 2) * 100) / 100;
          }
          // If both blocked, grow down (default)
        }
      }

      // Check if the new size would cause overlap
      const testRoom: Room = { ...room, x: newX, y: newY, width: newWidth, height: newHeight };
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
        handleLayoutChange({
          ...layout,
          rooms: layout.rooms.map((r) =>
            r.id === id ? { ...r, x: newX, y: newY, width: newWidth, height: newHeight } : r
          ),
        });
      }
    },
    [layout, handleLayoutChange]
  );

  const updateRoomName = useCallback(
    (id: string, name: string) => {
      handleLayoutChange({
        ...layout,
        rooms: layout.rooms.map((r) => (r.id === id ? { ...r, name } : r)),
      });
    },
    [layout, handleLayoutChange]
  );

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, delta } = event;
    const id = active.id as string;

    // Only show ghost for rooms, not doors
    if (id.startsWith('door-')) return;

    const room = layout.rooms.find((r) => r.id === id);
    if (room && delta) {
      const targetX = Math.round((room.x + delta.x / cellSize) * 100) / 100;
      const targetY = Math.round((room.y + delta.y / cellSize) * 100) / 100;

      const otherRooms = layout.rooms.filter((r) => r.id !== id);
      const validPosition = findNearestValidPosition(room, targetX, targetY, otherRooms);

      setGhostPosition((prev) => {
        if (prev && Math.abs(prev.x - validPosition.x) < 0.01 && Math.abs(prev.y - validPosition.y) < 0.01) {
          return prev;
        }
        return {
          x: validPosition.x,
          y: validPosition.y,
          width: room.width,
          height: room.height
        };
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setGhostPosition(null);
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
      // Calculate target position with 0.01m precision - allow negative for canvas expansion
      const targetX = Math.round((room.x + delta.x / cellSize) * 100) / 100;
      const targetY = Math.round((room.y + delta.y / cellSize) * 100) / 100;

      // Get other rooms (excluding the one being dragged)
      const otherRooms = layout.rooms.filter((r) => r.id !== id);

      // Find the nearest valid position that doesn't overlap
      const validPosition = findNearestValidPosition(room, targetX, targetY, otherRooms);

      handleLayoutChange({
        ...layout,
        rooms: layout.rooms.map((r) =>
          r.id === id ? { ...r, x: validPosition.x, y: validPosition.y } : r
        ),
      });
    }
  };

  const handleClearAll = () => {
    handleLayoutChange({ ...layout, rooms: [], doors: [] });
    setSelectedRoomId(null);
    setSelectedDoorId(null);
  };

  const moveRoom = useCallback((id: string, x: number, y: number) => {
      const room = layout.rooms.find(r => r.id === id);
      if (!room) return;
      
      // Check bounds or collisions if needed, but for nudge we might allow temporary overlap or just clamp to grid
      // For now, just update position
      handleLayoutChange({
          ...layout,
          rooms: layout.rooms.map(r => r.id === id ? { ...r, x, y } : r)
      });
  }, [layout, handleLayoutChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
      
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only if not typing in an input
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          if (selectedRoomId) {
            deleteRoom(selectedRoomId);
          } else if (selectedDoorId) {
             deleteDoor(selectedDoorId);
          }
        }
      }

      // Nudge with arrows
      if (selectedRoomId && !e.ctrlKey && !e.shiftKey && !e.altKey) {
          const room = layout.rooms.find(r => r.id === selectedRoomId);
          if (room && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
              let dx = 0;
              let dy = 0;
              if (e.key === 'ArrowLeft') dx = -0.1;
              if (e.key === 'ArrowRight') dx = 0.1;
              if (e.key === 'ArrowUp') dy = -0.1;
              if (e.key === 'ArrowDown') dy = 0.1;
              
              if (dx !== 0 || dy !== 0) {
                  e.preventDefault();
                  // Round to 2 decimal places
                  const newX = Math.round((room.x + dx) * 100) / 100;
                  const newY = Math.round((room.y + dy) * 100) / 100;
                  moveRoom(selectedRoomId, newX, newY);
              }
          }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedRoomId, selectedDoorId, layout.rooms, deleteRoom, deleteDoor, moveRoom]);

  const selectedRoom = layout.rooms.find((r) => r.id === selectedRoomId);
  const selectedDoor = doors.find((d) => d.id === selectedDoorId);
  const activeRoom = layout.rooms.find((r) => r.id === activeId);

  return (
    <div className='flex flex-col h-full'>
      {/* Compact toolbar */}
      <div className='flex items-center justify-between gap-2 pb-2 border-b mb-2'>
        <div className='flex items-center gap-2 flex-1 min-w-0'>
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
            className='gap-1 h-8 px-2'
            onClick={() => {
              setDoorMode(!doorMode);
              setSelectedType(null);
            }}
            title='Add doors between rooms'
          >
            <DoorOpen className='w-4 h-4' />
            <span className='hidden lg:inline text-xs'>Add Door</span>
          </Button>
          
          {hasCollisions && (
            <div className='flex items-center gap-1 text-amber-500 text-xs px-1.5 py-0.5 bg-amber-500/10 rounded shrink-0'>
              <AlertTriangle className='w-3 h-3' />
              <span className='hidden md:inline'>Overlap</span>
            </div>
          )}
        </div>

        <div className='flex items-center gap-0.5 shrink-0'>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7'
            onClick={handleUndo}
            disabled={!canUndo}
            title='Undo (Ctrl+Z)'
          >
            <Undo className='w-3.5 h-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7'
            onClick={handleRedo}
            disabled={!canRedo}
            title='Redo (Ctrl+Y)'
          >
            <Redo className='w-3.5 h-3.5' />
          </Button>
          <div className='w-px h-4 bg-border mx-0.5' />
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7'
            onClick={() => setCellSize((s) => Math.max(24, s - 8))}
            title='Zoom out'
          >
            <ZoomOut className='w-3.5 h-3.5' />
          </Button>
          <span className='text-xs text-muted-foreground w-9 text-center tabular-nums'>
            {Math.round((cellSize / DEFAULT_CELL_SIZE) * 100)}%
          </span>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7'
            onClick={() => setCellSize((s) => Math.min(96, s + 8))}
            title='Zoom in'
          >
            <ZoomIn className='w-3.5 h-3.5' />
          </Button>
          <Button
            variant={showGrid ? 'secondary' : 'ghost'}
            size='icon'
            className='h-7 w-7'
            onClick={() => setShowGrid(!showGrid)}
            title='Toggle grid'
          >
            <Grid3X3 className='w-3.5 h-3.5' />
          </Button>
          <div className='w-px h-4 bg-border mx-0.5' />
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7'
            onClick={() => {
              setTemplateName('');
              setSaveTemplateOpen(true);
            }}
            title='Save as template'
            disabled={layout.rooms.length === 0}
          >
            <Save className='w-3.5 h-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7'
            onClick={() => setLoadTemplateOpen(true)}
            title='Load template'
          >
            <FolderOpen className='w-3.5 h-3.5' />
          </Button>
          <div className='w-px h-4 bg-border mx-0.5' />
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10'
            onClick={handleClearAll}
            title='Clear all rooms'
          >
            <RotateCcw className='w-3.5 h-3.5' />
          </Button>
        </div>
      </div>

      {/* Main content: Canvas + Room Editor side panel */}
      <div className='flex-1 flex gap-2 min-h-0 overflow-hidden'>
        {/* Canvas area - scrollable */}
        <div ref={scrollContainerRef} className='flex-1 overflow-auto bg-muted/20 rounded-lg'>
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <ContextMenu modal={false}>
              <ContextMenuTrigger asChild>
                <div
                  ref={canvasRef}
                  className={cn(
                    'relative overflow-hidden bg-background',
                    'transition-colors',
                    selectedType && 'cursor-crosshair',
                    doorMode && 'cursor-pointer'
                  )}
                  style={{
                    width: gridCols * cellSize,
                    height: gridRows * cellSize,
                    minWidth: '100%',
                    minHeight: '100%',
                  }}
                  onContextMenu={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    // Convert pixel position to room coordinates (subtract offset)
                    const x = (e.clientX - rect.left) / cellSize - offsetX;
                    const y = (e.clientY - rect.top) / cellSize - offsetY;
                    setContextMenuPos({ x, y });
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const clickY = e.clientY - rect.top;

                    // Door mode - add door on shared edge
                    if (doorMode) {
                      // Adjust click position for offset when checking edges
                      const adjustedClickX = clickX - offsetX * cellSize;
                      const adjustedClickY = clickY - offsetY * cellSize;
                      const edge = getEdgeAtPoint(adjustedClickX, adjustedClickY, layout.rooms, cellSize, 20);
                      if (edge) {
                    // Calculate position along the edge (0-1)
                    const isVertical = edge.edge === 'left' || edge.edge === 'right';
                    const edgeStart = isVertical ? edge.y1 * cellSize : edge.x1 * cellSize;
                    const edgeEnd = isVertical ? edge.y2 * cellSize : edge.x2 * cellSize;
                    const clickPos = isVertical ? adjustedClickY : adjustedClickX;
                    const position = (clickPos - edgeStart) / (edgeEnd - edgeStart);
                    addDoor(edge, Math.max(0.15, Math.min(0.85, position)));
                  }
                  return;
                }

                // Add room on click when type is selected
                if (selectedType) {
                  // Convert click position to room coordinates (subtract offset)
                  const x = Math.round(((clickX / cellSize) - offsetX) * 100) / 100;
                  const y = Math.round(((clickY / cellSize) - offsetY) * 100) / 100;
                  const config = getRoomConfig(selectedType);

                  const newRoom: Room = {
                    id: generateId(),
                    type: selectedType,
                    name: config.label,
                    x: x,
                    y: y,
                    width: config.defaultWidth,
                    height: config.defaultHeight,
                  };

                  handleLayoutChange({
                    ...layout,
                    rooms: [...layout.rooms, newRoom],
                  });
                  setSelectedRoomId(newRoom.id);
                  setSelectedType(null);
                } else {
                  setSelectedRoomId(null);
                  setSelectedDoorId(null);
                }
              }}
            >
              {/* Ruler markings - horizontal (top) */}
              {showGrid && (
                <div className='absolute -top-6 left-0 right-0 h-5 flex pointer-events-none'>
                  {Array.from({ length: Math.ceil(gridCols) }).map((_, i) => {
                    const actualCoord = Math.round(i - offsetX);
                    return (
                      <div
                        key={`ruler-h-${i}`}
                        className='relative'
                        style={{ width: cellSize }}
                      >
                        {i % 2 === 0 && (
                          <span className='absolute left-0 -top-0.5 text-[9px] text-muted-foreground/70 font-mono'>
                            {actualCoord}m
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ruler markings - vertical (left) */}
              {showGrid && (
                <div className='absolute top-0 -left-6 bottom-0 w-5 pointer-events-none'>
                  {Array.from({ length: Math.ceil(gridRows) }).map((_, i) => {
                    const actualCoord = Math.round(i - offsetY);
                    return (
                      <div
                        key={`ruler-v-${i}`}
                        className='relative'
                        style={{ height: cellSize }}
                      >
                        {i % 2 === 0 && (
                          <span className='absolute -left-0.5 top-0 text-[9px] text-muted-foreground/70 font-mono'>
                            {actualCoord}m
                          </span>
                        )}
                      </div>
                    );
                  })}
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

              {/* Ghost Room */}
              {ghostPosition && (
                <div
                  className="absolute border-2 border-dashed border-primary/50 bg-primary/10 pointer-events-none z-10 transition-all duration-200 ease-out"
                  style={{
                    left: (ghostPosition.x + offsetX) * cellSize,
                    top: (ghostPosition.y + offsetY) * cellSize,
                    width: ghostPosition.width * cellSize,
                    height: ghostPosition.height * cellSize,
                  }}
                />
              )}

              {/* Rooms */}
              {layout.rooms.map((room) => (
                <RoomBox
                  key={room.id}
                  room={room}
                  cellSize={cellSize}
                  isSelected={selectedRoomId === room.id}
                  isOverlapping={overlappingRoomIds.has(room.id)}
                  offsetX={offsetX}
                  offsetY={offsetY}
                  onSelect={(id) => {
                    setSelectedRoomId(id);
                    setSelectedDoorId(null);
                  }}
                  onDelete={deleteRoom}
                  onDuplicate={duplicateRoom}
                  onResize={resizeRoom}
                />
              ))}

              {/* Shared edges highlight (when in door mode) */}
              {doorMode && sharedEdges.map((edge, i) => {
                const x1 = (edge.x1 + offsetX) * cellSize;
                const y1 = (edge.y1 + offsetY) * cellSize;
                const x2 = (edge.x2 + offsetX) * cellSize;
                const y2 = (edge.y2 + offsetY) * cellSize;
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
                    offsetX={offsetX}
                    offsetY={offsetY}
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
              </ContextMenuTrigger>
              <ContextMenuContent className="w-56">
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <span>Add Room</span>
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-48">
                    {ROOM_TYPES.map((roomType) => {
                      const config = getRoomConfig(roomType.type);
                      const IconComponent = ROOM_ICON_MAP[config.icon];
                      return (
                        <ContextMenuItem
                          key={roomType.type}
                          onClick={() => {
                            if (contextMenuPos) {
                              addRoomAtPosition(roomType.type, contextMenuPos.x, contextMenuPos.y);
                            }
                          }}
                        >
                          {IconComponent && (
                            <IconComponent 
                              className="mr-2 h-4 w-4" 
                              style={{ color: config.color }}
                            />
                          )}
                          {roomType.label}
                        </ContextMenuItem>
                      );
                    })}
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() => setDoorMode(!doorMode)}
                >
                  <DoorOpen className="mr-2 h-4 w-4" />
                  {doorMode ? 'Exit Door Mode' : 'Add Doors'}
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            <DragOverlay>
              {activeRoom && (
                <div
                  className={cn(
                    'rounded-lg group overflow-hidden',
                    'flex flex-col border',
                    'opacity-90 shadow-2xl cursor-grabbing scale-[1.02]',
                    'border-border/50 bg-card shadow-sm'
                  )}
                  style={{
                    width: activeRoom.width * cellSize,
                    height: activeRoom.height * cellSize,
                  }}
                >
                  {/* Color indicator bar */}
                  <div 
                    className='w-full shrink-0'
                    style={{ 
                      height: (activeRoom.width * cellSize < 80 || activeRoom.height * cellSize < 60) ? 3 : 4,
                      background: `linear-gradient(90deg, ${getRoomConfig(activeRoom.type).color}, ${getRoomConfig(activeRoom.type).color}dd)`
                    }}
                  />
                  
                  {/* Main content */}
                  <div className='flex-1 flex flex-col items-center justify-center p-1 min-h-0 relative'>
                    {(() => {
                      const config = getRoomConfig(activeRoom.type);
                      const IconComponent = ROOM_ICON_MAP[config.icon];
                      const isVerySmall = activeRoom.width * cellSize < 80 || activeRoom.height * cellSize < 60;
                      const isSmall = activeRoom.width * cellSize < 120 || activeRoom.height * cellSize < 80;
                      
                      return (
                        <>
                          {IconComponent && (
                            <div style={{ color: config.color }}>
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
                              {activeRoom.name || config.label}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Area footer */}
                  <div 
                    className={cn(
                      'shrink-0 text-center font-medium border-t border-border',
                      'bg-muted/50 text-muted-foreground',
                      (activeRoom.width * cellSize < 80 || activeRoom.height * cellSize < 60) ? 'text-[8px] py-0.5 px-0.5' : 
                      (activeRoom.width * cellSize < 120 || activeRoom.height * cellSize < 80) ? 'text-[9px] py-0.5 px-1' : 'text-[10px] py-1 px-1.5'
                    )}
                  >
                    {(activeRoom.width * activeRoom.height).toFixed(2)}m²
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Right panel - Selected room editor */}
        <div className='w-52 shrink-0 space-y-2 overflow-auto'>
          {selectedRoom ? (
            <div className='p-3 bg-muted/30 rounded-lg border space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded'
                    style={{ backgroundColor: overlappingRoomIds.has(selectedRoom.id) ? '#ef4444' : getRoomConfig(selectedRoom.type).color }}
                  />
                  <span className='font-medium text-sm'>Edit Room</span>
                </div>
                {overlappingRoomIds.has(selectedRoom.id) && (
                  <AlertTriangle className='w-4 h-4 text-amber-500' />
                )}
              </div>
              
              <div className='space-y-2'>
                <div>
                  <Label className='text-xs text-muted-foreground'>Name</Label>
                  <Input
                    value={selectedRoom.name}
                    onChange={(e) => updateRoomName(selectedRoom.id, e.target.value)}
                    className='mt-1 h-8 text-sm'
                  />
                </div>
                <div>
                  <Label className='text-xs text-muted-foreground'>Size (m)</Label>
                  <div className='flex gap-1.5 mt-1 items-center'>
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
                      className='w-16 h-8 text-sm'
                    />
                    <span className='text-muted-foreground text-xs'>×</span>
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
                      className='w-16 h-8 text-sm'
                    />
                  </div>
                  <div className='mt-1 text-xs text-muted-foreground'>
                    Area: <span className='font-medium text-foreground'>{(selectedRoom.width * selectedRoom.height).toFixed(2)} m²</span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className='flex gap-1.5'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 h-7 text-xs'
                    onClick={() => duplicateRoom(selectedRoom.id)}
                    title='Duplicate'
                  >
                    <Copy className='w-3 h-3 mr-1' />
                    Copy
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 h-7 text-xs'
                    onClick={() => rotateRoom(selectedRoom.id)}
                    title='Rotate'
                  >
                    <RotateCw className='w-3 h-3 mr-1' />
                    Rotate
                  </Button>
                </div>
                
                <Button
                  variant='destructive'
                  size='sm'
                  className='w-full h-7 text-xs'
                  onClick={() => deleteRoom(selectedRoom.id)}
                >
                  Delete Room
                </Button>
              </div>
            </div>
          ) : selectedDoor ? (
            <div className='p-3 bg-muted/30 rounded-lg border space-y-3'>
              <div className='flex items-center gap-2'>
                <DoorOpen className='w-4 h-4 text-amber-500' />
                <span className='font-medium text-sm'>Edit Door</span>
              </div>
              
              <div className='space-y-2'>
                <div className='text-xs'>
                  <span className='text-muted-foreground'>Connects:</span>
                  <div className='mt-1 space-y-0.5'>
                    <div className='flex items-center gap-1.5'>
                      <div
                        className='w-2 h-2 rounded'
                        style={{ backgroundColor: getRoomConfig(layout.rooms.find(r => r.id === selectedDoor.roomId)?.type || 'bedroom').color }}
                      />
                      <span className='truncate'>{layout.rooms.find(r => r.id === selectedDoor.roomId)?.name}</span>
                    </div>
                    {selectedDoor.connectedRoomId && (
                      <div className='flex items-center gap-1.5'>
                        <div
                          className='w-2 h-2 rounded'
                          style={{ backgroundColor: getRoomConfig(layout.rooms.find(r => r.id === selectedDoor.connectedRoomId)?.type || 'bedroom').color }}
                        />
                        <span className='truncate'>{layout.rooms.find(r => r.id === selectedDoor.connectedRoomId)?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className='text-xs text-muted-foreground'>Width (m)</Label>
                  <Input
                    type='number'
                    min={0.6}
                    max={2}
                    step={0.1}
                    value={selectedDoor.width}
                    onChange={(e) => {
                      const newWidth = parseFloat(e.target.value) || 0.9;
                      handleLayoutChange({
                        ...layout,
                        doors: doors.map(d => 
                          d.id === selectedDoor.id ? { ...d, width: Math.max(0.6, Math.min(2, newWidth)) } : d
                        ),
                      });
                    }}
                    className='mt-1 w-20 h-8 text-sm'
                  />
                </div>
                
                <Button
                  variant='destructive'
                  size='sm'
                  className='w-full h-7 text-xs'
                  onClick={() => deleteDoor(selectedDoor.id)}
                >
                  Delete Door
                </Button>
              </div>
            </div>
          ) : (
            <div className='p-3 bg-muted/20 rounded-lg border border-dashed text-center text-muted-foreground'>
              <p className='text-xs'>Click a room to edit</p>
              <p className='text-[10px] mt-0.5'>or drag to reposition</p>
            </div>
          )}

          {/* Room count summary */}
          {layout.rooms.length > 0 && (
            <div className='p-3 bg-muted/20 rounded-lg border'>
              <p className='text-[10px] text-muted-foreground mb-1.5'>Room Summary</p>
              <div className='space-y-0.5'>
                {Object.entries(
                  layout.rooms.reduce((acc, room) => {
                    acc[room.type] = (acc[room.type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <div key={type} className='flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-1.5'>
                      <div
                        className='w-1.5 h-1.5 rounded-full'
                        style={{ backgroundColor: getRoomConfig(type as RoomType).color }}
                      />
                      <span>{getRoomConfig(type as RoomType).label}</span>
                    </div>
                    <span className='text-muted-foreground'>{count}</span>
                  </div>
                ))}
                {doors.length > 0 && (
                  <div className='flex items-center justify-between text-xs pt-0.5 mt-0.5 border-t'>
                    <div className='flex items-center gap-1.5'>
                      <DoorOpen className='w-2.5 h-2.5 text-amber-500' />
                      <span>Doors</span>
                    </div>
                    <span className='text-muted-foreground'>{doors.length}</span>
                  </div>
                )}
              </div>
              
              {/* Total area */}
              <div className='mt-2 pt-2 border-t'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-medium'>Total Area</span>
                  <span className='text-xs font-semibold text-primary'>
                    {layout.rooms.reduce((sum, room) => sum + room.width * room.height, 0).toFixed(2)} m²
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Template Dialog */}
      <Dialog open={saveTemplateOpen} onOpenChange={setSaveTemplateOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save the current layout as a reusable template for other apartments.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='template-name'>Template Name</Label>
              <Input
                id='template-name'
                placeholder='e.g., Studio Apartment, 2BR Layout'
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className='text-sm text-muted-foreground'>
              <p>This template will include:</p>
              <ul className='list-disc list-inside mt-1 space-y-0.5'>
                <li>{layout.rooms.length} room{layout.rooms.length !== 1 ? 's' : ''}</li>
                <li>{doors.length} door{doors.length !== 1 ? 's' : ''}</li>
                <li>{layout.rooms.reduce((sum, room) => sum + room.width * room.height, 0).toFixed(2)} m² total area</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setSaveTemplateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (templateName.trim()) {
                  saveTemplate(templateName.trim(), layout);
                  setSaveTemplateOpen(false);
                  setTemplateName('');
                }
              }}
              disabled={!templateName.trim()}
            >
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Template Dialog */}
      <Dialog open={loadTemplateOpen} onOpenChange={setLoadTemplateOpen}>
        <DialogContent className='sm:max-w-4xl'>
          <DialogHeader>
            <DialogTitle>Load Template</DialogTitle>
            <DialogDescription>
              Choose a saved template to apply to this apartment.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            {templates.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <FolderOpen className='w-12 h-12 mx-auto mb-3 opacity-50' />
                <p>No templates saved yet</p>
                <p className='text-sm mt-1'>Save a layout as a template to reuse it later</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-5 max-h-[550px] overflow-auto p-1'>
                {templates.map((template) => {
                  // Calculate bounds for preview
                  const rooms = template.layout.rooms;
                  const doors = template.layout.doors || [];
                  const minX = Math.min(...rooms.map(r => r.x));
                  const minY = Math.min(...rooms.map(r => r.y));
                  const maxX = Math.max(...rooms.map(r => r.x + r.width));
                  const maxY = Math.max(...rooms.map(r => r.y + r.height));
                  const layoutWidth = maxX - minX;
                  const layoutHeight = maxY - minY;
                  const previewSize = 240;
                  const padding = 16;
                  const availableSize = previewSize - padding * 2;
                  const scale = Math.min(availableSize / layoutWidth, availableSize / layoutHeight, 22);
                  
                  return (
                    <div
                      key={template.id}
                      className='relative p-4 rounded-xl border-2 border-transparent bg-gradient-to-br from-muted/30 to-muted/10 hover:border-primary/40 hover:from-muted/50 hover:to-muted/20 transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md'
                      onClick={() => {
                        const newLayout = applyTemplate(template);
                        handleLayoutChange(newLayout);
                        setLoadTemplateOpen(false);
                        setSelectedRoomId(null);
                        setSelectedDoorId(null);
                      }}
                    >
                      {/* Delete button */}
                      <Button
                        variant='ghost'
                        size='icon'
                        className='absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all z-10 bg-background/80 backdrop-blur-sm rounded-full'
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate(template.id);
                        }}
                        title='Delete template'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </Button>
                      
                      {/* Preview canvas */}
                      <div 
                        className='relative rounded-lg mb-3 mx-auto overflow-hidden'
                        style={{ 
                          width: previewSize, 
                          height: previewSize,
                          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        {/* Grid pattern background */}
                        <div 
                          className='absolute inset-0 opacity-20'
                          style={{
                            backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
                            backgroundSize: '10px 10px',
                          }}
                        />
                        
                        {/* Centered container with calculated dimensions */}
                        <div 
                          className='absolute'
                          style={{
                            left: (previewSize - layoutWidth * scale) / 2,
                            top: (previewSize - layoutHeight * scale) / 2,
                            width: layoutWidth * scale,
                            height: layoutHeight * scale,
                          }}
                        >
                          {rooms.map((room) => {
                            const config = getRoomConfig(room.type);
                            const roomW = room.width * scale;
                            const roomH = room.height * scale;
                            const fontSize = Math.max(6, Math.min(10, Math.min(roomW, roomH) * 0.25));
                            const showName = roomW > 20 && roomH > 15;
                            return (
                              <div
                                key={room.id}
                                className='absolute rounded-sm shadow-sm overflow-hidden flex items-center justify-center'
                                style={{
                                  left: (room.x - minX) * scale,
                                  top: (room.y - minY) * scale,
                                  width: roomW,
                                  height: roomH,
                                  backgroundColor: `${config.color}50`,
                                  border: `1.5px solid ${config.color}`,
                                  boxShadow: `0 1px 3px ${config.color}30`,
                                }}
                              >
                                {showName && (
                                  <span
                                    className='text-center font-medium leading-tight px-0.5'
                                    style={{
                                      fontSize: `${fontSize}px`,
                                      color: config.color,
                                      maxWidth: '100%',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      textShadow: '0 0 2px rgba(255,255,255,0.8)',
                                    }}
                                  >
                                    {room.name || config.label}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                          {/* Door indicators */}
                          {doors.map((door) => {
                            const room = rooms.find(r => r.id === door.roomId);
                            if (!room) return null;
                            const isVertical = door.edge === 'left' || door.edge === 'right';
                            let x = (room.x - minX) * scale;
                            let y = (room.y - minY) * scale;
                            const doorWidth = Math.max(4, door.width * scale * 0.8);
                            
                            if (door.edge === 'top') {
                              x += room.width * scale * door.position - doorWidth / 2;
                            } else if (door.edge === 'bottom') {
                              x += room.width * scale * door.position - doorWidth / 2;
                              y += room.height * scale - 2;
                            } else if (door.edge === 'left') {
                              y += room.height * scale * door.position - doorWidth / 2;
                            } else {
                              x += room.width * scale - 2;
                              y += room.height * scale * door.position - doorWidth / 2;
                            }
                            
                            return (
                              <div
                                key={door.id}
                                className='absolute rounded-full'
                                style={{
                                  left: x,
                                  top: y,
                                  width: isVertical ? 3 : doorWidth,
                                  height: isVertical ? doorWidth : 3,
                                  backgroundColor: '#f59e0b',
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Template info */}
                      <div className='text-center space-y-0.5'>
                        <p className='font-semibold text-sm truncate'>{template.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {template.roomCount} room{template.roomCount !== 1 ? 's' : ''} • {template.doorCount} door{template.doorCount !== 1 ? 's' : ''} • {template.totalArea.toFixed(0)} m²
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomCreator;
