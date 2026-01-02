import { useCallback } from 'react';
import type { Room, RoomType, ApartmentLayout, Door } from './types';
import { getRoomConfig } from './types';
import { findNearestValidPosition } from './collisionUtils';

const generateId = () => `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface UseRoomOperationsProps {
  layout: ApartmentLayout;
  doors: Door[];
  selectedRoomId: string | null;
  onLayoutChange: (layout: ApartmentLayout, skipHistory?: boolean) => void;
  onSelectRoom: (id: string | null) => void;
  onSelectType: (type: RoomType | null) => void;
}

export const useRoomOperations = ({
  layout,
  doors,
  selectedRoomId,
  onLayoutChange,
  onSelectRoom,
  onSelectType,
}: UseRoomOperationsProps) => {
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
      onSelectRoom(newRoom.id);
      onSelectType(null);
    },
    [layout, onLayoutChange, onSelectRoom, onSelectType]
  );

  const addRoomAtPosition = useCallback(
    (type: RoomType, x: number, y: number) => {
      const config = getRoomConfig(type);
      const newRoom: Room = {
        id: generateId(),
        type,
        name: config.label,
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

      onLayoutChange({
        ...layout,
        rooms: [...layout.rooms, newRoom],
      });
      onSelectRoom(newRoom.id);
    },
    [layout, onLayoutChange, onSelectRoom]
  );

  const deleteRoom = useCallback(
    (id: string) => {
      // Use current values at deletion time, not captured values
      // Also remove any doors connected to this room
      const updatedDoors = doors.filter(
        (d) => d.roomId !== id && d.connectedRoomId !== id
      );
      
      const updatedRooms = layout.rooms.filter((r) => r.id !== id);
      
      onLayoutChange({
        ...layout,
        rooms: updatedRooms,
        doors: updatedDoors,
      });
      
      if (selectedRoomId === id) {
        onSelectRoom(null);
      }
    },
    [layout, doors, onLayoutChange, selectedRoomId, onSelectRoom]
  );

  const duplicateRoom = useCallback(
    (id: string) => {
      const room = layout.rooms.find(r => r.id === id);
      if (!room) return;
      
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
      onSelectRoom(newRoom.id);
    },
    [layout, onLayoutChange, onSelectRoom]
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
    (id: string, width: number, height: number, deltaX?: number, deltaY?: number, isResizing = false) => {
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
        onLayoutChange({
          ...layout,
          rooms: layout.rooms.map((r) =>
            r.id === id ? { ...r, x: newX, y: newY, width: newWidth, height: newHeight } : r
          ),
        }, isResizing); // Skip history during continuous resize
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

  const moveRoom = useCallback((id: string, x: number, y: number) => {
    const room = layout.rooms.find(r => r.id === id);
    if (!room) return;
    
    onLayoutChange({
      ...layout,
      rooms: layout.rooms.map(r => r.id === id ? { ...r, x, y } : r)
    });
  }, [layout, onLayoutChange]);

  return {
    addRoom,
    addRoomAtPosition,
    deleteRoom,
    duplicateRoom,
    rotateRoom,
    resizeRoom,
    updateRoomName,
    moveRoom,
  };
};
